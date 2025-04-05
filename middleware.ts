import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define ALL public routes (not just sign-in)
const isPublicRoute = createRouteMatcher([
  "/", // Homepage
  "/features(.*)", // Features page
  "/pricing(.*)", // Pricing page
  "/about(.*)", // About page
  "/sign-in(.*)", // Sign-in routes
  "/sign-up(.*)", // Sign-up routes
  "/marketplace"
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
