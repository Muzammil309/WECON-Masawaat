import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/navigation-fixes.css";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { HeroUIProvider } from "@/components/providers/heroui-provider";

import { WebVitals } from "@/components/performance/web-vitals";
import Script from 'next/script';

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
      <head>
        <link rel="icon" href="/aivent/images/icon.webp" type="image/webp" sizes="16x16" />
        {/* External CSS files from Aivent template - loaded from public folder */}
        <link href="/aivent/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="/aivent/css/vendors.css" rel="stylesheet" type="text/css" />
        <link href="/aivent/css/style.css" rel="stylesheet" type="text/css" />
        <link href="/aivent/css/scheme-01.css" rel="stylesheet" type="text/css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: '#0F1535', minHeight: '100vh' }}
      >
        <HeroUIProvider>
          <AuthProvider>
            <div className="min-h-screen" style={{ background: '#0F1535' }}>
              <ConditionalHeader />
              <main className="flex-1" style={{ background: '#0F1535' }}>
                {children}
            </main>
          </div>
          <Toaster position="top-right" richColors expand={true} />
        </AuthProvider>
        </HeroUIProvider>
        <WebVitals />

        {/* Aivent Original JavaScript Files */}
        <Script src="/aivent/js/vendors.js" strategy="beforeInteractive" />
        <Script src="/aivent/js/designesia.js" strategy="afterInteractive" />
        <Script src="/aivent/js/countdown-custom.js" strategy="afterInteractive" />
        <Script src="/aivent/js/custom-marquee.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
