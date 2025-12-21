import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MacroTrackerProvider } from "@/context/MacroTrackerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Macro Nutrient Tracker",
  description: "Track your macros efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <MacroTrackerProvider>
          <div className="mx-auto max-w-md min-h-screen bg-background border-x border-border shadow-sm">
            {children}
          </div>
        </MacroTrackerProvider>
      </body>
    </html>
  );
}
