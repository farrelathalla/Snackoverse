import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core"; // Adjust the path to your core file

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
