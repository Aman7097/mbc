import { useState, useEffect, useCallback } from "react";

const SOCKET_SERVER_URL = import.meta.env.VITE_APP_SOCKET_URL;

type ConnectionStatus = "connecting" | "connected" | "disconnected";

const useChatSocket = ({
  topicId,
  userId,
}: {
  userId?: string;
  topicId?: string;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);

  const setAllMessagesNotLoading = useCallback(() => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({ ...msg, isLoading: false }))
    );
  }, []);

  const appendErrorToLastMessage = useCallback((errorMessage: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage) {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          response: errorMessage,
          isLoading: false,
        };
        return updatedMessages;
      }
      return prevMessages;
    });
  }, []);

  const connectSocket = useCallback(
    ({ tId, uId }: { tId: string; uId: string }) => {
      if (!SOCKET_SERVER_URL) {
        const errorMsg = "Unable to connect to chat. Please try again later.";
        setError(errorMsg);
        appendErrorToLastMessage(errorMsg);
        return;
      }

      if (socket) {
        socket.close();
      }

      setConnectionStatus("connecting");
      const newSocket = new WebSocket(
        `${SOCKET_SERVER_URL}/chat/${tId}/${uId}/`
      );

      newSocket.onopen = () => {
        console.log("WebSocket connected");
        setConnectionStatus("connected");
        setError(null);
      };

      newSocket.onmessage = (event) => {
        try {
          if (!event.data) {
            const errorMsg = "No response received. Please try again.";
            console.warn("Received empty message from server");
            setError(errorMsg);
            setAllMessagesNotLoading();
            appendErrorToLastMessage(errorMsg);
            return;
          }

          const incomingMessage: { message: string } = JSON.parse(event.data);

          if (!incomingMessage || !incomingMessage.message) {
            const errorMsg = "Invalid response received. Please try again.";
            console.warn("Parsed message is empty or invalid");
            setError(errorMsg);
            setAllMessagesNotLoading();
            appendErrorToLastMessage(errorMsg);
            return;
          }

          setMessages((prevMessages: any) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && lastMessage.isLoading) {
              // Update the existing message
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                response: incomingMessage.message,
                isLoading: false,
              };
              return updatedMessages;
            } else {
              // Add a new message (this case shouldn't normally occur, but it's handled just in case)
              return [
                ...prevMessages,
                { response: incomingMessage.message, isLoading: false },
              ];
            }
          });
        } catch (error) {
          const errorMsg = "Error processing response. Please try again.";
          console.error("Error parsing message:", error);
          setError(errorMsg);
          setAllMessagesNotLoading();
          appendErrorToLastMessage(errorMsg);
        }
      };

      newSocket.onclose = () => {
        setConnectionStatus("disconnected");
        console.log("WebSocket disconnected");
        setAllMessagesNotLoading();
        appendErrorToLastMessage("Connection lost. Please try again.");
        // Attempt to reconnect after 0.1 seconds
        setTimeout(() => connectSocket({ tId, uId }), 100);
      };

      newSocket.onerror = (error) => {
        const errorMsg =
          "Connection error. Please check your internet and try again.";
        console.error("WebSocket error", error);
        setError(errorMsg);
        setAllMessagesNotLoading();
        appendErrorToLastMessage(errorMsg);
      };

      setSocket(newSocket);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appendErrorToLastMessage, setAllMessagesNotLoading]
  );

  useEffect(() => {
    if (topicId && userId) {
      connectSocket({ tId: topicId, uId: userId });
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [topicId, userId, connectSocket]);

  const sendMessage = useCallback(
    (message: Omit<ChatMessage, "isLoading">) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, isLoading: true },
      ]);
      if (
        socket &&
        socket.readyState === WebSocket.OPEN &&
        message &&
        message.query
      ) {
        console.log(message);
        socket.send(JSON.stringify({ message: message.query }));
      } else {
        const errorMsg = "Unable to send message. Please try again.";
        setError(errorMsg);
        setAllMessagesNotLoading();
        appendErrorToLastMessage(errorMsg);
      }
    },
    [socket, setAllMessagesNotLoading, appendErrorToLastMessage]
  );

  return {
    messages,
    setMessages,
    sendMessage,
    connectionStatus,
    error,
  };
};

export default useChatSocket;
