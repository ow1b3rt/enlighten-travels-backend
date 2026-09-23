/* features/index.js */

import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import usersRoutes from "./users/users.routes.js";
import authorsRoutes from "./authors/authors.routes.js";
import layoutRoutes from "./layouts/layouts.routes.js";
import blogRoutes from "./blogs/blogs.routes.js";
import mediaRoutes from "./media/media.routes.js";
import testimonialsRoutes from "./testimonials/testimonials.routes.js";
import destinationsRoutes from "./destinations/destinations.routes.js";
import packagesRoutes from "./packages/packages.routes.js";
import contactRoutes from "./contact/contact.routes.js";
import customTripsRoutes from "./customTrips/customTrips.routes.js";
import bookingsRoutes from "./bookings/bookings.routes.js";
import workshopRoutes from "./workshopInquiries/workshopInquiry.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/authors", authorsRoutes);
router.use("/layouts", layoutRoutes);
router.use("/blogs", blogRoutes);
router.use("/media", mediaRoutes);
router.use("/testimonials", testimonialsRoutes);
router.use("/destinations", destinationsRoutes);
router.use("/packages", packagesRoutes);
router.use("/contact", contactRoutes);
router.use("/customTrip", customTripsRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/workshop", workshopRoutes);

export default router;
