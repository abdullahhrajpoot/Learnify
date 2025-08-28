import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learnify - Your Educational Platform",
  description: "A comprehensive platform for students, tutors, guardians, and admins to enhance learning experiences.",
  keywords: ["education", "tutoring", "learning", "students", "tutors"],
  authors: [{ name: "Learnify Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col ocean-gradient-light overflow-x-hidden">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}





