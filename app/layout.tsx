import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "@/components/Provider";
import Head from "next/head";
import LayoutClient from "@/components/LayoutClients"; // Import LayoutClient for client-side

// Importing local fonts
const Bagel = localFont({
  src: "./fonts/BagelFatOne.ttf",
  variable: "--font-bagel",
  weight: "100 900",
});
const Bricolage = localFont({
  src: "./fonts/BricolageGrotesque.ttf",
  variable: "--font-bricolage",
  weight: "100 900",
});

// Metadata for the layout
export const metadata: Metadata = {
  title: "Snack O Verse",
  description: "Snack Snack Snack!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="Logo.ico" />
      </Head>
      <body className={`${Bagel.variable} ${Bricolage.variable} antialiased`}>
        <Provider>
          <LayoutClient>
            {children} {/* Render child components */}
          </LayoutClient>
        </Provider>
      </body>
    </html>
  );
}
