import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Space,
  Dropdown,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShopOutlined,
  DownOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { ROLES } from "../types/auth";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const MarketplaceLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
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
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        theme="light"
      >
        <div
          className="logo"
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            {!collapsed ? "Menu" : "TX"}
          </Title>
        </div>

        <Menu
          theme="light"
          defaultSelectedKeys={["marketplace"]}
          mode="inline"
          onClick={({ key }) => handleMenuClick(key)}
          items={[
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
            {
              key: "seller-dashboard",
              icon: <ShopOutlined />,
              label: "Seller Dashboard",
              disabled: user?.role !== ROLES.SELLER,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 24,
          }}
        >
          <div style={{ paddingLeft: 24 }}>
            <Title level={4} style={{ margin: 0 }}>
              TechXchange Marketplace
            </Title>
          </div>

          <Space>
            {user ? (
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <Space style={{ cursor: "pointer" }}>
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <Text strong>
                    {user.firstName} {user.lastName}
                  </Text>
                  <DownOutlined />
                </Space>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={handleLogin}
              >
                Login
              </Button>
            )}
          </Space>
        </Header>

        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MarketplaceLayout;
