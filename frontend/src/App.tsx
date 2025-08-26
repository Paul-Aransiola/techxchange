// App.tsx
import React from "react";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { MessageProvider } from "./contexts/MessageContext";
import { ConfigProvider } from "antd";

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <AuthProvider>
        <CartProvider>
          <MessageProvider>
            <AppRouter />
          </MessageProvider>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
