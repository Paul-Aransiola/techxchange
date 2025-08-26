import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Message,
  getMessages,
  sendMessage,
  markAsRead,
  SendMessageRequest,
} from "../services/messageService";
import { getAuthToken } from "../services/authService";
import { message } from "antd";

interface MessageContextType {
  messages: Message[];
  loading: boolean;
  unreadCount: number;
  sendNewMessage: (data: SendMessageRequest) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};

interface MessageProviderProps {
  children: React.ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getMessages();
      // The response structure is { data: { messages: [...] } }
      setMessages(response.data?.messages || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendNewMessage = async (data: SendMessageRequest) => {
    try {
      setLoading(true);
      await sendMessage(data);
      await fetchMessages(); // Refresh after sending message
      message.success("Message sent successfully");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to send message");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await markAsRead(messageId);
      // Update local state immediately for better UX
      setMessages((prevMessages) =>
        (prevMessages || []).map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error: any) {
      console.error("Error marking message as read:", error);
    }
  };

  const refreshMessages = useCallback(async () => {
    await fetchMessages(); // Refresh when explicitly requested
  }, [fetchMessages]);

  useEffect(() => {
    // Only fetch once on mount
    const timer = setTimeout(() => {
      const token = getAuthToken();
      if (token) {
        fetchMessages();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once

  const unreadCount = (messages || []).filter((msg) => !msg.isRead).length;

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        unreadCount,
        sendNewMessage,
        markMessageAsRead,
        refreshMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
