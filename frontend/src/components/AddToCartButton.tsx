import React, { useState } from "react";
import { Button, InputNumber, Space, message } from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { ROLES } from "../types/auth";

interface AddToCartButtonProps {
  productId: string;
  productName?: string;
  size?: "small" | "middle" | "large";
  type?: "primary" | "default";
  block?: boolean;
  disabled?: boolean;
  showQuantityControls?: boolean;
  defaultQuantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName = "Product",
  size = "middle",
  type = "primary",
  block = false,
  disabled = false,
  showQuantityControls = false,
  defaultQuantity = 1,
}) => {
  const { user } = useAuth();
  const { addItem, cart } = useCart();
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [isAdding, setIsAdding] = useState(false);

  // Check if user is logged in and is a buyer
  const canAddToCart = user && user.role === ROLES.BUYER;

  // Check if item is already in cart
  const existingItem = cart?.items.find(
    (item) => item.product._id === productId
  );

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      message.warning("Please log in as a buyer to add items to cart");
      return;
    }

    if (disabled) return;

    try {
      setIsAdding(true);
      await addItem({
        productId,
        quantity,
      });

      // Reset quantity to default after successful add
      setQuantity(defaultQuantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0) {
      setQuantity(value);
    }
  };

  if (!canAddToCart) {
    return (
      <Button
        size={size}
        block={block}
        disabled
        title="Please log in as a buyer to add items to cart"
      >
        <ShoppingCartOutlined /> Add to Cart
      </Button>
    );
  }

  if (existingItem && !showQuantityControls) {
    return (
      <Button
        size={size}
        block={block}
        type="default"
        disabled
        title={`${productName} is already in your cart (${existingItem.quantity} items)`}
      >
        <ShoppingCartOutlined /> In Cart ({existingItem.quantity})
      </Button>
    );
  }

  return (
    <Space.Compact style={{ width: block ? "100%" : undefined }}>
      {showQuantityControls && (
        <>
          <Button
            size={size}
            icon={<MinusOutlined />}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isAdding}
          />
          <InputNumber
            size={size}
            min={1}
            max={99}
            value={quantity}
            onChange={handleQuantityChange}
            style={{ width: 60 }}
            disabled={isAdding}
          />
          <Button
            size={size}
            icon={<PlusOutlined />}
            onClick={() => setQuantity(quantity + 1)}
            disabled={quantity >= 99 || isAdding}
          />
        </>
      )}

      <Button
        type={type}
        size={size}
        block={block && !showQuantityControls}
        loading={isAdding}
        disabled={disabled}
        onClick={handleAddToCart}
        icon={<ShoppingCartOutlined />}
        style={{
          flex: showQuantityControls ? 1 : undefined,
          minWidth: showQuantityControls ? 120 : undefined,
        }}
      >
        Add to Cart
        {showQuantityControls && quantity > 1 && ` (${quantity})`}
      </Button>
    </Space.Compact>
  );
};

export default AddToCartButton;
