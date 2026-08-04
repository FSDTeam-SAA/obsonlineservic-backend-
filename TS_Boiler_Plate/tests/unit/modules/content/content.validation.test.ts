import { describe, expect, it } from "vitest";
import { ContentValidation } from "../../../../src/modules/content/content.validation.js";

describe("ContentValidation", () => {
    it("accepts published content page payloads", () => {
        const parsed = ContentValidation.createContentPageSchema.parse({
            body: {
                title: "Holiday parks in nature",
                slug: "holiday-parks-in-nature",
                pageType: "DESTINATION",
                sections: [
                    {
                        key: "hero",
                        title: "Holiday parks in nature",
                        body: "Find peaceful parks surrounded by forests, lakes, and walking routes.",
                    },
                ],
                status: "PUBLISHED",
                isPublished: true,
            },
        });

        expect(parsed.body.locale).toBe("EN");
        expect(parsed.body.sections).toHaveLength(1);
    });

    it("accepts public contact messages and defaults the topic", () => {
        const parsed = ContentValidation.createContactSchema.parse({
            body: {
                firstName: "Nina",
                email: "nina@example.com",
                message: "Can you help me choose the right holiday park?",
            },
        });

        expect(parsed.body.topic).toBe("GENERAL");
    });
});
