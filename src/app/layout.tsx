import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SkipLink } from "@/components/ui/skip-link";
import { WebVitals } from "@/components/performance/web-vitals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventFlow - Professional Event Management Platform",
  description: "Comprehensive serverless event management platform with ticketing, real-time features, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased aivent-theme dark-scheme`}
      >
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <AuthProvider>
          <div className="min-h-screen">
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </AuthProvider>
        <WebVitals />
      </body>
    </html>
  );
}
