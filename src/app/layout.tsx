import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spyne Content Tracker | Professional Dashboard",
  description: "Content tracking dashboard for Spyne content operations",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="midnight" data-font="sans">
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
