import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up', '/api/webhook/clerk', '/thread/:id', '/api/uploadthing'],
  ignoredRoutes: ['/communities/:id'],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};