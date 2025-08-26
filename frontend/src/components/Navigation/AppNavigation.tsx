import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useMessages } from "../../contexts/MessageContext";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Space,
  Dropdown,
  Badge,
  Drawer,
  Grid,
  Tooltip,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShopOutlined,
  DownOutlined,
  ReadOutlined,
  MenuOutlined,
  BellOutlined,
  SearchOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { ROLES } from "../../types/auth";
import { useNavigate, useLocation } from "react-router-dom";
import "./AppNavigation.css";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface AppNavigationProps {
  children: React.ReactNode;
}

const AppNavigation: React.FC<AppNavigationProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const { unreadCount } = useMessages();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (screens.xs || screens.sm) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [screens]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleUserMenuClick = (key: string) => {
    switch (key) {
      case "profile":
        navigate("/seller/dashboard?tab=profile");
        break;
      case "products":
        navigate("/seller/dashboard?tab=products");
        break;
      case "logout":
        logout();
        break;
      default:
        break;
    }
  };

  const userMenu = (
    <Menu onClick={({ key }) => handleUserMenuClick(key)}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile Settings
      </Menu.Item>
      {user?.role === ROLES.SELLER && (
        <Menu.Item key="products" icon={<ShopOutlined />}>
          Products
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // Handle menu item clicks
  const handleMenuClick = (key: string) => {
    switch (key) {
      case "marketplace":
        navigate("/");
        break;
      case "news":
        navigate("/news");
        break;
      case "seller-dashboard":
        navigate("/seller/dashboard");
        break;
      case "favorites":
        navigate("/favorites");
        break;
      case "cart":
        navigate("/cart");
        break;
      case "messages":
        navigate("/messages");
        break;
      default:
        break;
    }
    // Close mobile drawer after navigation
    if (screens.xs || screens.sm) {
      setMobileDrawerVisible(false);
    }
  };

  // Get current menu key based on location
  const getCurrentMenuKey = () => {
    const path = location.pathname;
    if (path === "/") return ["marketplace"];
    if (path === "/news") return ["news"];
    if (path === "/seller/dashboard") return ["seller-dashboard"];
    if (path === "/cart") return ["cart"];
    if (path === "/messages") return ["messages"];
    return ["marketplace"];
  };

  const menuItems = [
    {
      key: "marketplace",
      icon: <HomeOutlined />,
      label: "Marketplace",
    },
    {
      key: "news",
      icon: <ReadOutlined />,
      label: "Tech News",
    },
    ...(user
      ? [
          {
            key: "cart",
            icon: <ShoppingCartOutlined />,
            label: (
              <Space>
                Cart
                {cartItemsCount > 0 && (
                  <Badge
                    count={cartItemsCount}
                    size="small"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </Space>
            ),
          },
          {
            key: "messages",
            icon: <MessageOutlined />,
            label: (
              <Space>
                Messages
                {unreadCount > 0 && (
                  <Badge
                    count={unreadCount}
                    size="small"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </Space>
            ),
          },
        ]
      : []),
    ...(user?.role === ROLES.SELLER
      ? [
          {
            type: "divider" as const,
          },
          {
            key: "seller-dashboard",
            icon: <DashboardOutlined />,
            label: "Seller Dashboard",
          },
        ]
      : []),
  ];

  const sidebarContent = (
    <>
      <div className="app-navigation-logo">
        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
          {!collapsed ? (
            <Space>
              <ShopOutlined />
              TechXchange
            </Space>
          ) : (
            "TX"
          )}
        </Title>
      </div>

      <Menu
        theme="light"
        selectedKeys={getCurrentMenuKey()}
        mode="inline"
        onClick={({ key }) => handleMenuClick(key)}
        items={menuItems}
        className="app-navigation-menu"
      />
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      {!(screens.xs || screens.sm) && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={280}
          theme="light"
          className="app-navigation-sider"
        >
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        title={
          <Space>
            <ShopOutlined style={{ color: "#1890ff" }} />
            <Text strong>TechXchange</Text>
          </Space>
        }
        placement="left"
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        bodyStyle={{ padding: 0 }}
        width={280}
      >
        {sidebarContent}
      </Drawer>

      <Layout>
        <Header className="app-navigation-header">
          <div className="app-navigation-header-left">
            {/* Mobile Menu Button */}
            {(screens.xs || screens.sm) && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileDrawerVisible(true)}
                style={{ marginRight: 16 }}
              />
            )}

            <Title level={4} className="app-navigation-title">
              {screens.xs ? "TX" : "TechXchange Marketplace"}
            </Title>
          </div>

          <Space size="middle">
            {/* Search Button */}
            <Tooltip title="Search">
              <Button
                type="text"
                icon={<SearchOutlined />}
                size="large"
                style={{ color: "#666" }}
              />
            </Tooltip>

            {user ? (
              <>
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <Badge count={unreadCount} size="small">
                    <Button
                      type="text"
                      icon={<BellOutlined />}
                      size="large"
                      style={{ color: "#666" }}
                      onClick={() => navigate("/messages")}
                    />
                  </Badge>
                </Tooltip>

                {/* User Menu */}
                <Dropdown
                  overlay={userMenu}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Space className="app-navigation-user-dropdown">
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#1890ff" }}
                      size="small"
                    />
                    {!screens.xs && (
                      <>
                        <div className="app-navigation-user-info">
                          <Text strong style={{ fontSize: 14, margin: 0 }}>
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text
                            type="secondary"
                            style={{ fontSize: 12, margin: 0 }}
                          >
                            {user.role === ROLES.SELLER ? "Seller" : "Buyer"}
                          </Text>
                        </div>
                        <DownOutlined style={{ fontSize: 12, color: "#666" }} />
                      </>
                    )}
                  </Space>
                </Dropdown>
              </>
            ) : (
              <Space>
                <Button onClick={handleRegister} size="large">
                  Sign Up
                </Button>
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={handleLogin}
                  size="large"
                >
                  Login
                </Button>
              </Space>
            )}
          </Space>
        </Header>

        <Content
          className={
            screens.xs
              ? "app-navigation-content-mobile"
              : "app-navigation-content"
          }
        >
          <div
            className={
              screens.xs
                ? "app-navigation-content-inner-mobile"
                : "app-navigation-content-inner"
            }
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppNavigation;
