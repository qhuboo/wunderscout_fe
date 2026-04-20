"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type WebSocketContextType = {
	ws: WebSocket | null;
	messages: any[];
};

const WebSocketContex = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<any[]>([]);

	useEffect(() => {
		const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

		socket.onopen = () => {
			console.log("FE[WebSocketProvider][onopen]: Connected to the WebSocket server.");
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("FE[WebSocketProvider][onmessage]: Received: ", data);
			setMessages((prev) => [...prev, data]);
		};

		socket.onclose = () => {
			console.log("FE[WebSocketProvider][onclose]: WebSocket closed, reconnecting ...");
			setTimeout(() => {
				setWs(new WebSocket("ws://localhost:4000"));
			}, 1000);
		};

		setWs(socket);

		return () => {
			socket.close();
		};
	}, []);

	return (
		<WebSocketContex.Provider value={{ ws, messages }}>
			{children}
		</WebSocketContex.Provider>
	);
};

export const useWebSocket = () => {
	const ctx = useContext(WebSocketContex);
	if (!ctx) {
		throw new Error("useWebSocket must be inside WebSocketProvider.");
	}
	return ctx;
};
