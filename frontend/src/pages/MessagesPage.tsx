import React, { useState, useEffect } from "react";
import AppNavigation from "../components/Navigation/AppNavigation";
import {
  Typography,
  Empty,
  Card,
  List,
  Avatar,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Badge,
  Tag,
  Divider,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMessages } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import { Message, SendMessageRequest } from "../services/messageService";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const {
    messages,
    loading,
    unreadCount,
    sendNewMessage,
    markMessageAsRead,
    refreshMessages,
  } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [composeForm] = Form.useForm();
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    refreshMessages();
  }, [refreshMessages]);

  const handleMessageClick = async (messageItem: Message) => {
    setSelectedMessage(messageItem);

    // Mark as read if it's unread and user is the receiver
    if (!messageItem.isRead && messageItem.receiver._id === user?._id) {
      await markMessageAsRead(messageItem._id);
    }
  };

  const handleSendMessage = async (values: any) => {
    try {
      setSendingMessage(true);
      const messageData: SendMessageRequest = {
        receiverEmail: values.receiverEmail,
        subject: values.subject,
        content: values.content,
        productId: values.productId,
      };

      await sendNewMessage(messageData);
      setIsComposeModalOpen(false);
      composeForm.resetFields();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessageList = () => {
    if (loading && messages.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading messages...</div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <Empty
          description="No messages yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: "50px" }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsComposeModalOpen(true)}
          >
            Send Your First Message
          </Button>
        </Empty>
      );
    }

    return (
      <List
        dataSource={messages}
        renderItem={(item) => {
          const isUnread = !item.isRead && item.receiver._id === user?._id;
          const isSentByMe = item.sender._id === user?._id;

          return (
            <List.Item
              onClick={() => handleMessageClick(item)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedMessage?._id === item._id ? "#f0f8ff" : undefined,
                padding: "16px",
              }}
              className="message-item"
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={isUnread}>
                    <Avatar
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: isSentByMe ? "#52c41a" : "#1890ff",
                      }}
                    />
                  </Badge>
                }
                title={
                  <Space direction="vertical" size={4}>
                    <Space>
                      <Text strong={isUnread}>
                        {isSentByMe
                          ? `To: ${item.receiver.firstName} ${item.receiver.lastName}`
                          : `From: ${item.sender.firstName} ${item.sender.lastName}`}
                      </Text>
                      {isSentByMe && <Tag color="green">Sent</Tag>}
                      {isUnread && <Tag color="red">New</Tag>}
                    </Space>
                    <Text strong style={{ fontSize: 14 }}>
                      {item.subject}
                    </Text>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={4}>
                    <Text ellipsis style={{ color: "#666" }}>
                      {item.content.substring(0, 100)}
                      {item.content.length > 100 ? "..." : ""}
                    </Text>
                    <Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatMessageTime(item.createdAt)}
                      </Text>
                      {item.product && (
                        <Tag color="blue" style={{ fontSize: 11 }}>
                          About: {item.product.name}
                        </Tag>
                      )}
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };

  const renderMessageDetail = () => {
    if (!selectedMessage) {
      return (
        <Empty
          description="Select a message to view details"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    const isSentByMe = selectedMessage.sender._id === user?._id;

    return (
      <Card
        title={
          <Space direction="vertical" size={8}>
            <Text strong style={{ fontSize: 18 }}>
              {selectedMessage.subject}
            </Text>
            <Space>
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: isSentByMe ? "#52c41a" : "#1890ff" }}
              />
              <Space direction="vertical" size={0}>
                <Text strong>
                  {isSentByMe
                    ? `To: ${selectedMessage.receiver.firstName} ${selectedMessage.receiver.lastName}`
                    : `From: ${selectedMessage.sender.firstName} ${selectedMessage.sender.lastName}`}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {selectedMessage.sender.email}
                </Text>
              </Space>
            </Space>
          </Space>
        }
        extra={
          <Text type="secondary">
            {new Date(selectedMessage.createdAt).toLocaleString()}
          </Text>
        }
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {selectedMessage.product && (
            <Card size="small" style={{ backgroundColor: "#f8f9fa" }}>
              <Space>
                <Text strong>Related Product:</Text>
                <Text>{selectedMessage.product.name}</Text>
                <Text type="secondary">${selectedMessage.product.price}</Text>
              </Space>
            </Card>
          )}

          <Paragraph style={{ fontSize: 14, lineHeight: 1.6 }}>
            {selectedMessage.content}
          </Paragraph>

          {selectedMessage.isRead && selectedMessage.readAt && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              <EyeOutlined /> Read on{" "}
              {new Date(selectedMessage.readAt).toLocaleString()}
            </Text>
          )}
        </Space>
      </Card>
    );
  };

  return (
    <AppNavigation>
      <div style={{ padding: "24px" }}>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            <MessageOutlined /> Messages
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ marginLeft: 8 }} />
            )}
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsComposeModalOpen(true)}
          >
            Compose Message
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={10}>
            <Card title="Inbox" bodyStyle={{ padding: 0 }}>
              {renderMessageList()}
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            {renderMessageDetail()}
          </Col>
        </Row>

        {/* Compose Message Modal */}
        <Modal
          title="Compose Message"
          open={isComposeModalOpen}
          onCancel={() => {
            setIsComposeModalOpen(false);
            composeForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={composeForm}
            layout="vertical"
            onFinish={handleSendMessage}
          >
            <Form.Item
              name="receiverEmail"
              label="To (Email Address)"
              rules={[
                { required: true, message: "Please enter receiver email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Enter receiver email address" />
            </Form.Item>

            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: "Please enter subject" }]}
            >
              <Input placeholder="Enter message subject" />
            </Form.Item>

            <Form.Item name="productId" label="Related Product (Optional)">
              <Input placeholder="Enter product ID if this message is about a specific product" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Message"
              rules={[
                { required: true, message: "Please enter message content" },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Type your message here..."
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button
                  onClick={() => {
                    setIsComposeModalOpen(false);
                    composeForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={sendingMessage}
                >
                  Send Message
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppNavigation>
  );
};

export default MessagesPage;
