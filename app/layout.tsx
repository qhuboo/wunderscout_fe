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

const ephidona = localFont({
	src: [
		{
			path: "./fonts/Ephidona_1.woff",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/Ephidona.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/Ephidona.ttf",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-ephidona",
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
				className={`${geistSans.variable} ${geistMono.variable} ${jetBrainsMono.variable} ${ephidona.variable} antialiased`}
			>
				<Providers>
					<header className="p-4 text-4xl">WunderScout Analytics</header>
					<main className="">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
