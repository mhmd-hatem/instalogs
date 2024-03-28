import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function SocketWrapper({
  children,
}: {
  children: (
    socketRef: React.MutableRefObject<Socket | null>,
    setIsConnectedRef: React.MutableRefObject<
      React.Dispatch<React.SetStateAction<boolean>> | undefined
    >
  ) => React.ReactNode;
}) {
  const socketRef = useRef<Socket | null>(null);
  const setIsConnectedRef =
    useRef<React.Dispatch<React.SetStateAction<boolean>>>();

  useEffect(() => {
    // Initialize the socket connection only once
    if (!socketRef.current) {
      socketRef.current = io("ws://localhost:20000", { autoConnect: false });

      socketRef.current.emit("message", {
        session: "test",
        action: "join",
        content: {},
      });

      socketRef.current.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to socket server");
        setIsConnectedRef.current?.(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
        setIsConnectedRef.current?.(false);
      });

      // socketRef.current.connect(); // Manually open the connection
    }

    // This function will be called when the component unmounts
    return () => {
      socketRef.current?.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []);

  return <>{children(socketRef, setIsConnectedRef)}</>;
}
