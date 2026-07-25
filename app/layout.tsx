import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/ReduxProvider";
import EvaChatbot from "@/components/EvaChatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tripnowa - Discover World Travel Destinations",
  description: "Explore the best travel destinations around the world. Find romantic places, adventure spots, beaches, mountains, cities, and hidden gems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <EvaChatbot />
        </ReduxProvider>
      </body>
    </html>
  );
}
