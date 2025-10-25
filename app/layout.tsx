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
	src: [
		{
			path: "./fonts/TX-02-Regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/TX-02-Bold.otf",
			weight: "700",
			style: "normal",
		},
		{
			path: "./fonts/TX-02-Oblique.otf",
			weight: "400",
			style: "oblique",
		},
    {
      path: "./fonts/TX-02-Bold-Oblique.otf",
      weight: "700",
      style: "oblique",
    },
	],
	variable: "--font-berkeley",
	display: "swap",
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
					<header className="p-4 text-2xl text-gray-500 shrink-0">WunderScout Analytics</header>
					<main className="border-2 border-green-500 flex-1 flex flex-col">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
