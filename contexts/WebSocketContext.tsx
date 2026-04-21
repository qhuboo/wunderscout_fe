"use client";

import React, {
  createContext,
  useRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type WebSocketContextType = {
  ws: WebSocket | null;
  messages: any[];
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);
    wsRef.current = socket;
    setWs(socket);

    socket.onopen = () => {
      console.log(
        "FE[WebSocketProvider][onopen]: Connected to the WebSocket server.",
      );
      pingInterval.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("FE[WebSocketProvider][onmessage]: Received: ", data);
      if (data?.type === "pong") return;
      setMessages((prev) => [...prev, data]);
    };

    socket.onclose = () => {
      console.log(
        "FE[WebSocketProvider][onclose]: WebSocket closed, reconnecting ...",
      );
      clearInterval(pingInterval.current!);
      reconnectTimeout.current = setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      clearInterval(pingInterval.current!);
      clearTimeout(reconnectTimeout.current!);
      wsRef.current?.close();
    };
  }, [connect]);

  return (
    <WebSocketContext.Provider value={{ ws, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error("useWebSocket must be inside WebSocketProvider.");
  }
  return ctx;
};
