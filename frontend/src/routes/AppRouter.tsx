// routes/AppRouter.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import SellerDashboard from "../pages/seller/Dashboard";
import UnauthorizedPage from "../pages/Unauthorized";
import NewsPage from "../pages/NewsPage";
import CartPage from "../pages/CartPage";
import MessagesPage from "../pages/MessagesPage";

import HomePage from "../pages/Home";

import { ROLES } from "../types";
import ProtectedRoute from "../components/ProdectedRoute";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />

        {/* Protected user routes (both buyers and sellers) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.BUYER, ROLES.SELLER]} />
          }
        >
          <Route path="/cart" element={<CartPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Route>

        {/* Protected seller routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.SELLER]} />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
