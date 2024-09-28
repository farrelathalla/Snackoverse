"use client"; // Mark this as a Client Component

import { usePathname } from "next/navigation"; // Use next/navigation for routing
import Navbar from "@/components/navbar"; // Import your Navbar component
import { Toaster } from "@/components/ui/toaster"; // Import Toaster component

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Get the current pathname

  // Define paths that should not show the layout (navbar and toaster)
  const noLayoutRoutes = ["/sign-in", "/sign-up"];
  const shouldShowLayout = !noLayoutRoutes.includes(pathname); // Determine if layout should be shown

  return (
    <>
      {shouldShowLayout && <Navbar />} {/* Conditionally render Navbar */}
      {children} {/* Render children here */}
      {shouldShowLayout && <Toaster />} {/* Conditionally render Toaster */}
    </>
  );
};

export default LayoutClient;
