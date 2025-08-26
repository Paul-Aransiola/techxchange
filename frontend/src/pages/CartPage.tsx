import React, { useState } from "react";
import AppNavigation from "../components/Navigation/AppNavigation";
import {
  Card,
  List,
  Button,
  Typography,
  InputNumber,
  Space,
  Divider,
  Empty,
  Image,
  Popconfirm,
  message,
  Row,
  Col,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ClearOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { useCart } from "../contexts/CartContext";
import { CartItem } from "../services/cartService";

const { Title, Text } = Typography;

// For image serving
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const CartPage: React.FC = () => {
  const {
    cart,
    loading,
    cartItemsCount,
    totalAmount,
    updateItem,
    removeItem,
    clearAllItems,
  } = useCart();
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => [...prev, productId]);
    try {
      await updateItem(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearAllItems();
      message.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const renderCartItem = (item: CartItem) => {
    const isUpdating = updatingItems.includes(item.product._id);

    return (
      <List.Item
        key={item.product._id}
        actions={[
          <Popconfirm
            title="Remove this item from cart?"
            onConfirm={() => handleRemoveItem(item.product._id)}
            okText="Remove"
            cancelText="Cancel"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={loading}
            />
          </Popconfirm>,
        ]}
      >
        <List.Item.Meta
          avatar={
            <Image
              width={80}
              height={80}
              src={
                item.product.images && item.product.images.length > 0
                  ? `${API_BASE_URL}${item.product.images[0]}`
                  : "/placeholder-image.png"
              }
              alt={item.product.name}
              style={{ borderRadius: 8, objectFit: "cover" }}
              fallback="/placeholder-image.png"
            />
          }
          title={
            <Space direction="vertical" size={4}>
              <Text strong style={{ fontSize: 16 }}>
                {item.product.name}
              </Text>
              <Text type="secondary">
                ${item.product.price?.toFixed(2)} each
              </Text>
            </Space>
          }
          description={
            <Space direction="vertical" size={8}>
              <Text type="secondary">
                Added on {new Date(item.addedAt).toLocaleDateString()}
              </Text>

              <Space align="center">
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1 || isUpdating}
                />

                <InputNumber
                  min={1}
                  max={99}
                  value={item.quantity}
                  onChange={(value) =>
                    value && handleQuantityChange(item.product._id, value)
                  }
                  style={{ width: 60 }}
                  disabled={isUpdating}
                />

                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity + 1)
                  }
                  disabled={isUpdating}
                />

                {isUpdating && <Spin size="small" />}
              </Space>

              <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  if (loading && !cart) {
    return (
      <AppNavigation>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading your cart...</div>
        </div>
      </AppNavigation>
    );
  }

  return (
    <AppNavigation>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={2} style={{ margin: 0 }}>
                    <ShoppingOutlined /> Shopping Cart
                  </Title>

                  {cart && cart.items.length > 0 && (
                    <Popconfirm
                      title="Clear all items from cart?"
                      description="This action cannot be undone."
                      onConfirm={handleClearCart}
                      okText="Clear All"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger icon={<ClearOutlined />} loading={loading}>
                        Clear Cart
                      </Button>
                    </Popconfirm>
                  )}
                </div>

                {!cart || cart.items.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Space direction="vertical">
                        <Text>Your cart is empty</Text>
                        <Button
                          type="primary"
                          onClick={() => (window.location.href = "/")}
                        >
                          Start Shopping
                        </Button>
                      </Space>
                    }
                  />
                ) : (
                  <List
                    dataSource={cart.items}
                    renderItem={renderCartItem}
                    split={true}
                  />
                )}
              </Space>
            </Card>
          </Col>

          {cart && cart.items.length > 0 && (
            <Col xs={24} lg={8}>
              <Card title="Order Summary">
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Row justify="space-between">
                    <Text>Items ({cartItemsCount})</Text>
                    <Text>${totalAmount.toFixed(2)}</Text>
                  </Row>

                  <Row justify="space-between">
                    <Text>Shipping</Text>
                    <Text>Calculated at checkout</Text>
                  </Row>

                  <Divider style={{ margin: "8px 0" }} />

                  <Row justify="space-between">
                    <Text strong style={{ fontSize: 16 }}>
                      Total
                    </Text>
                    <Text strong style={{ fontSize: 18, color: "#1890ff" }}>
                      ${totalAmount.toFixed(2)}
                    </Text>
                  </Row>

                  <Button
                    type="primary"
                    size="large"
                    block
                    style={{ marginTop: 16 }}
                    onClick={() =>
                      message.info("Checkout functionality coming soon!")
                    }
                  >
                    Proceed to Checkout
                  </Button>

                  <Button block onClick={() => (window.location.href = "/")}>
                    Continue Shopping
                  </Button>
                </Space>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </AppNavigation>
  );
};

export default CartPage;
