import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from 'next-auth'; // Import for session management
import { authOptions } from '@/lib/auth'; // Your NextAuth auth options

const f = createUploadthing();

// Authentication function to check if user is logged in and is an admin
const auth = async (req: Request) => {
  const session = await getServerSession(authOptions); // Use actual session/auth function
  if (!session || session.user.role !== 'Admin') return null; // Only allow admins to upload
  return { id: session.user.id };
};

// Define the file routes for image upload
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "2MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user) throw new UploadThingError("Unauthorized");

      // Return user metadata for later use
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Logs and additional processing after image upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Return the uploaded image URL (stored in the client or backend)
      return { uploadedBy: metadata.userId, imageUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
