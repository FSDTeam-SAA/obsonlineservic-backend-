

import { Router } from 'express';
import {
    AccommodationRoutes,
    AdminAccommodationRoutes,
} from '../modules/accommodation/accommodation.route.js';
import { AdminAvailabilityRoutes } from '../modules/availability/availability.route.js';
import { AuthRoutes } from '../modules/auth/auth.route.js';
import {
    AdminBookingRoutes,
    BookingRoutes,
    CustomerBookingRoutes,
} from '../modules/booking/booking.route.js';
import {
    AdminContentRoutes,
    ContactRoutes,
    ContentRoutes,
    FaqRoutes,
} from '../modules/content/content.route.js';
import { EuroParcsRoutes } from '../modules/europarcs/europarcs.route.js';
import { AdminParkRoutes, ParkRoutes } from '../modules/park/park.route.js';
import {
    AdminPricingRoutes,
    ExtrasRoutes,
    PricingRoutes,
} from '../modules/pricing/pricing.route.js';
import { SearchRoutes } from '../modules/search/search.route.js';
import { UserRoutes } from '../modules/user/user.route.js';
import { rootRouter } from './root.routes.js';
import { healthRouter } from './health.route.js';
import { systemRouter } from './system.route.js';

const router = Router();

import { passportRouter } from '../auth/passport.route.js';
import { stripeWebhookRouter } from '../payments/stripe.route.js';

const moduleRoutes = [
    {
        path: '/',
        route: rootRouter,
    },
    {
        path: '/',
        route: healthRouter,
    },
    {
        path: '/system',
        route: systemRouter,
    },
    {
        path: '/europarcs',
        route: EuroParcsRoutes,
    },
    {
        path: '/parks',
        route: ParkRoutes,
    },
    {
        path: '/accommodations',
        route: AccommodationRoutes,
    },
    {
        path: '/search',
        route: SearchRoutes,
    },
    {
        path: '/pricing',
        route: PricingRoutes,
    },
    {
        path: '/bookings',
        route: BookingRoutes,
    },
    {
        path: '/customer/bookings',
        route: CustomerBookingRoutes,
    },
    {
        path: '/extras',
        route: ExtrasRoutes,
    },
    {
        path: '/content',
        route: ContentRoutes,
    },
    {
        path: '/faq',
        route: FaqRoutes,
    },
    {
        path: '/contact',
        route: ContactRoutes,
    },
    {
        path: '/admin/parks',
        route: AdminParkRoutes,
    },
    {
        path: '/admin/accommodations',
        route: AdminAccommodationRoutes,
    },
    {
        path: '/admin/availability',
        route: AdminAvailabilityRoutes,
    },
    {
        path: '/admin/pricing',
        route: AdminPricingRoutes,
    },
    {
        path: '/admin/bookings',
        route: AdminBookingRoutes,
    },
    {
        path: '/admin/content',
        route: AdminContentRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        // Passport auth routes
        path: '/auth',
        route: passportRouter,
    },
    {
        path: '/user',
        route: UserRoutes
    },
    {
        // Stripe webhook route needs raw body parser
        path: '/webhooks',
        route: stripeWebhookRouter
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
