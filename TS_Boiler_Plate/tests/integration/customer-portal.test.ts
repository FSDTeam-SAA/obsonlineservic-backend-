import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { User } from "../../src/modules/user/user.model.js";
import { Booking } from "../../src/modules/booking/booking.model.js";
import { SupportThread } from "../../src/modules/support/support.model.js";
import { generateToken } from "../../src/utils/jwt.js";

describe("Customer Portal API", () => {
    let customerToken: string;
    let otherCustomerToken: string;
    let customerId: string;
    let otherCustomerId: string;
    let bookingId: string;

    beforeAll(async () => {
        // Create test users
        const customer = await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.customer@example.com",
            password: "password123",
            role: "USER",
        });
        customerId = String(customer._id);
        customerToken = generateToken({ userId: customerId, role: "USER" });

        const otherCustomer = await User.create({
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.customer@example.com",
            password: "password123",
            role: "USER",
        });
        otherCustomerId = String(otherCustomer._id);
        otherCustomerToken = generateToken({ userId: otherCustomerId, role: "USER" });

        // Create a test booking for the customer
        const booking = await Booking.create({
            bookingReference: "EP-TEST-123",
            userId: customerId,
            customer: {
                firstName: "John",
                lastName: "Doe",
                email: "john.customer@example.com",
            },
            parkSlug: "test-park",
            accommodationUnitSlug: "test-unit-1",
            accommodationTypeSlug: "test-type",
            checkIn: new Date(Date.now() + 86400000), // Tomorrow
            checkOut: new Date(Date.now() + 86400000 * 3), // 3 days from now
            guests: { adults: 2 },
            priceSnapshot: {
                currency: "EUR",
                nights: 2,
                subtotal: 200,
                discountTotal: 0,
                feeTotal: 50,
                taxTotal: 10,
                depositTotal: 0,
                extrasTotal: 0,
                grandTotal: 260,
                dueToday: 260,
                paymentScheduleType: "PAY_NOW",
                lineItems: [],
            },
            status: "CONFIRMED",
            holdExpiresAt: new Date(),
        });
        bookingId = String(booking._id);
    });

    afterAll(async () => {
        await User.deleteMany({ email: { $in: ["john.customer@example.com", "jane.customer@example.com"] } });
        await Booking.deleteMany({ bookingReference: "EP-TEST-123" });
        await SupportThread.deleteMany({ userId: customerId });
    });

    describe("GET /customer/bookings", () => {
        it("should return the customer's bookings", async () => {
            const res = await request(app)
                .get("/api/v1/customer/bookings")
                .set("Authorization", `Bearer ${customerToken}`)
                .expect(200);

            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].bookingReference).toBe("EP-TEST-123");
        });

        it("should return upcoming bookings with timeline=upcoming", async () => {
            const res = await request(app)
                .get("/api/v1/customer/bookings?timeline=upcoming")
                .set("Authorization", `Bearer ${customerToken}`)
                .expect(200);

            expect(res.body.data).toHaveLength(1);
        });

        it("should not return past bookings with timeline=past", async () => {
            const res = await request(app)
                .get("/api/v1/customer/bookings?timeline=past")
                .set("Authorization", `Bearer ${customerToken}`)
                .expect(200);

            expect(res.body.data).toHaveLength(0);
        });
    });

    describe("GET /customer/bookings/:id", () => {
        it("should return booking details for the owner", async () => {
            const res = await request(app)
                .get(`/api/v1/customer/bookings/${bookingId}`)
                .set("Authorization", `Bearer ${customerToken}`)
                .expect(200);

            expect(res.body.data.bookingReference).toBe("EP-TEST-123");
        });

        it("should block access to other users' bookings", async () => {
            await request(app)
                .get(`/api/v1/customer/bookings/${bookingId}`)
                .set("Authorization", `Bearer ${otherCustomerToken}`)
                .expect(403);
        });
    });

    describe("Support Threads API", () => {
        let threadId: string;

        it("should create a support thread", async () => {
            const res = await request(app)
                .post("/api/v1/customer/support/threads")
                .set("Authorization", `Bearer ${customerToken}`)
                .send({
                    topic: "Accommodation Issue",
                    message: "The heater is not working in our unit.",
                    bookingReference: "EP-TEST-123",
                })
                .expect(201);

            expect(res.body.data.topic).toBe("Accommodation Issue");
            threadId = res.body.data._id;
        });

        it("should return customer's threads", async () => {
            const res = await request(app)
                .get("/api/v1/customer/support/threads")
                .set("Authorization", `Bearer ${customerToken}`)
                .expect(200);

            expect(res.body.data).toHaveLength(1);
        });

        it("should add a message to the thread", async () => {
            const res = await request(app)
                .post(`/api/v1/customer/support/threads/${threadId}/messages`)
                .set("Authorization", `Bearer ${customerToken}`)
                .send({ text: "Also, the wifi is slow." })
                .expect(201);

            expect(res.body.data.text).toBe("Also, the wifi is slow.");
        });

        it("should get messages for the thread", async () => {
            const res = await request(app)
                .get(`/api/v1/customer/support/threads/${threadId}/messages`)
                .set("Authorization", `Bearer ${customerToken}`)
                .expect(200);

            expect(res.body.data).toHaveLength(2); // Initial message + added message
        });
    });
});
