import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Perfume Finder",
  description: "Find the perfect perfume for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} flex flex-col min-h-screen bg-background bg-gradient bg-right-top`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
