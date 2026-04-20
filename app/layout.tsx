import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import Providers from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
});

const berkeleyMono = localFont({
  src: "../public/fonts/TX-02-Regular.otf",
  variable: "--font-berkeley-mono",
});

export const metadata: Metadata = {
  title: "WunderScout",
  description: "Soccer Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetBrainsMono.variable} ${berkeleyMono.variable} antialiased flex flex-col min-h-dvh`}
      >
        <Providers>
          <header className="p-4 text-2xl text-gray-500 shrink-0">
            WunderScout Analytics
          </header>
          <main className="flex-1 flex">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
