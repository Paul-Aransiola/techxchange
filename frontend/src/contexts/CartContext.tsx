import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Cart,
  CartItem,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "../services/cartService";
import { getAuthToken } from "../services/authService";
import { message } from "antd";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  cartItemsCount: number;
  totalAmount: number;
  addItem: (data: AddToCartRequest) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearAllItems: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await getCart();
      setCart(response.cart);
    } catch (error: any) {
      // Don't show error if user just hasn't created a cart yet
      if (error.response?.status !== 404) {
        console.error("Error fetching cart:", error);
      }
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = async (data: AddToCartRequest) => {
    try {
      setLoading(true);
      await addToCart(data);
      await fetchCart(); // Refresh after adding item
      message.success("Item added to cart");
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      const data: UpdateCartItemRequest = { quantity };
      await updateCartItem(productId, data);
      await fetchCart(); // Refresh after updating item
      message.success("Cart item updated");
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to update cart item"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setLoading(true);
      await removeFromCart(productId);
      await fetchCart(); // Refresh after removing item
      message.success("Item removed from cart");
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to remove item from cart"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearAllItems = async () => {
    try {
      setLoading(true);
      await clearCart();
      setCart(null);
      message.success("Cart cleared");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to clear cart");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = useCallback(async () => {
    await fetchCart(); // Refresh when explicitly requested
  }, [fetchCart]);

  useEffect(() => {
    // Only fetch once on mount
    const timer = setTimeout(() => {
      const token = getAuthToken();
      if (token) {
        fetchCart();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once

  const cartItemsCount = cart?.totalItems || 0;
  const totalAmount = cart?.totalAmount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartItemsCount,
        totalAmount,
        addItem,
        updateItem,
        removeItem,
        clearAllItems: clearAllItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
