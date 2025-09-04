"use client";

import { ThemeProvider } from "./ThemeProvider";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<WebSocketProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</WebSocketProvider>
	);
}
