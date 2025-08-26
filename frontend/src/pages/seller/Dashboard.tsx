// src/pages/seller/SellerDashboard.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Tabs,
  Button,
  Typography,
  Card,
  Space,
  Table,
  Tag,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Upload,
  Image,
  Modal,
} from "antd";
import type {
  UploadFile as AntdUploadFile,
  UploadProps,
  RcFile,
} from "antd/es/upload/interface";
import {
  InboxOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  getSellerProfile,
  updateSellerProfile,
  getMyProducts,
  createProduct,
  updateProduct,
  getProductReviews,
} from "../../services/sellerService";
import { SellerProfile, Product, Review } from "../../types/seller";
import AppNavigation from "../../components/Navigation/AppNavigation";

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [loading, setLoading] = useState({
    profile: false,
    products: false,
  });

  // Image upload state
  const [fileList, setFileList] = useState<AntdUploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Get the seller ID from the authenticated user
  const sellerId = user?._id;

  // Profile form
  const [profileForm] = Form.useForm();
  // Product form
  const [productForm] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProfile = React.useCallback(async () => {
    if (!sellerId) return;

    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const data = await getSellerProfile(sellerId);
      setProfile(data);
      profileForm.setFieldsValue({
        address: data.address,
        bankDetails: data.bankDetails,
      });
    } catch (error) {
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  }, [sellerId, profileForm]);

  const loadProducts = React.useCallback(async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    try {
      const data = await getMyProducts(); // Get authenticated seller's products
      if (!Array.isArray(data)) {
        throw new Error("Invalid products data format");
      }
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      message.error("Failed to load products. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  }, []); // No dependency on sellerId since we're getting authenticated user's products

  useEffect(() => {
    const fetchData = async () => {
      if (sellerId) {
        await loadProfile();
        await loadProducts();
      }
    };
    fetchData();
  }, [sellerId, loadProfile, loadProducts]);

  const loadProductReviews = useCallback(async (productId: string) => {
    try {
      const data = await getProductReviews(productId);
      setReviews((prev) => ({ ...prev, [productId]: data }));
    } catch (error) {
      message.error("Failed to load reviews");
    }
  }, []);

  const handleProfileUpdate = async (values: any) => {
    if (!sellerId) return;

    try {
      const updatedProfile = await updateSellerProfile(values); // Pass sellerId
      setProfile(updatedProfile);
      message.success("Profile updated successfully");
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const handleProductSubmit = async (values: any) => {
    if (!sellerId) return;

    try {
      // Prepare files for upload
      const files = fileList
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj as File);

      const productData = {
        ...values,
        images: files,
      };

      if (editingProduct) {
        const updatedProduct = await updateProduct(
          editingProduct._id,
          productData
        );
        setProducts((prev) =>
          prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
        );
        message.success("Product updated successfully");
      } else {
        const newProduct = await createProduct(productData);
        setProducts((prev) => [...prev, newProduct]);
        message.success("Product created successfully");
      }

      productForm.resetFields();
      setEditingProduct(null);
      setFileList([]);
    } catch (error) {
      message.error("Failed to save product");
    }
  };

  const handleEditProduct = useCallback(
    (product: Product) => {
      setEditingProduct(product);
      productForm.setFieldsValue({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
      });

      // Set existing images in file list for preview
      if (product.images && product.images.length > 0) {
        const existingFiles: AntdUploadFile[] = product.images.map(
          (imageUrl, index) => ({
            uid: `existing-${index}`,
            name: `image-${index + 1}.jpg`,
            status: "done" as const,
            url: `http://localhost:5000${imageUrl}`,
          })
        );
        setFileList(existingFiles);
      } else {
        setFileList([]);
      }
    },
    [productForm]
  );

  // Image upload handlers
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: AntdUploadFile) => {
    if (!file.url && !file.preview) {
      if (file.originFileObj) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleUploadChange = ({
    fileList: newFileList,
  }: {
    fileList: AntdUploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    return false; // Prevent automatic upload
  };

  const handleRemoveFile = (file: AntdUploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const productColumns = React.useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "images",
        key: "images",
        width: 80,
        render: (images: string[]) =>
          images && images.length > 0 ? (
            <Image
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: "4px" }}
              src={`http://localhost:5000${images[0]}`}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          ) : (
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
              }}
            >
              No Image
            </div>
          ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        render: (category: string) => <Tag color="blue">{category}</Tag>,
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (price: number) => `$${price.toFixed(2)}`,
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, record: Product) => (
          <Space size="middle">
            <Button onClick={() => handleEditProduct(record)}>Edit</Button>
            <Button onClick={() => loadProductReviews(record._id)}>
              View Reviews
            </Button>
          </Space>
        ),
      },
    ],
    [handleEditProduct, loadProductReviews]
  );

  return (
    <AppNavigation>
      <Title level={2}>Seller Dashboard</Title>
      {user && (
        <>
          <Card>
            <p>
              Welcome back, {user.firstName} {user.lastName}!
            </p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phoneNumber}</p>
          </Card>

          <Tabs defaultActiveKey="1" className="mt-4">
            <TabPane tab="Profile" key="1">
              <Card loading={loading.profile}>
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileUpdate}
                  initialValues={{
                    address: profile?.address,
                    bankDetails: profile?.bankDetails,
                  }}
                >
                  <Title level={4}>Address</Title>
                  <Form.Item name={["address", "location"]} label="Location">
                    <Input />
                  </Form.Item>
                  <Form.Item name={["address", "city"]} label="City">
                    <Input />
                  </Form.Item>
                  <Form.Item name={["address", "state"]} label="State">
                    <Input />
                  </Form.Item>

                  <Title level={4} className="mt-4">
                    Bank Details
                  </Title>
                  <Form.Item
                    name={["bankDetails", "bankName"]}
                    label="Bank Name"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["bankDetails", "bankCode"]}
                    label="Bank Code"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["bankDetails", "accountName"]}
                    label="Account Name"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["bankDetails", "accountNumber"]}
                    label="Account Number"
                  >
                    <Input />
                  </Form.Item>

                  <Button type="primary" htmlType="submit">
                    Update Profile
                  </Button>
                </Form>
              </Card>
            </TabPane>

            <TabPane tab="Products" key="2">
              <Card loading={loading.products}>
                <Form
                  form={productForm}
                  layout="vertical"
                  onFinish={handleProductSubmit}
                >
                  <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true }]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="Electronics">Electronics</Option>
                      <Option value="Clothing">Clothing</Option>
                      <Option value="Books">Books</Option>
                      <Option value="Home">Home</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, type: "number", min: 0 }]}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    label="Product Images"
                    help="Upload up to 5 images. Each image should be less than 5MB."
                  >
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      onRemove={handleRemoveFile}
                      multiple
                      accept="image/*"
                      maxCount={5}
                    >
                      {fileList.length >= 5 ? null : (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>

                  <Button type="primary" htmlType="submit">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  {editingProduct && (
                    <Button
                      className="ml-2"
                      onClick={() => {
                        productForm.resetFields();
                        setEditingProduct(null);
                        setFileList([]);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Form>

                <Table
                  className="mt-4"
                  columns={productColumns}
                  dataSource={products || []}
                  rowKey={(record) => record._id}
                  loading={loading.products}
                  pagination={false}
                />

                {Object.entries(reviews).map(([productId, productReviews]) => (
                  <Card
                    key={productId}
                    title={`Reviews for ${
                      products.find((p) => p._id === productId)?.name
                    }`}
                    className="mt-4"
                  >
                    {Array.isArray(productReviews) &&
                    productReviews.length > 0 ? (
                      productReviews.map((review) => (
                        <div key={review._id} className="mb-4">
                          <p>
                            <strong>
                              {review.user.firstName} {review.user.lastName}
                            </strong>
                          </p>
                          <p>Rating: {review.rating}/5</p>
                          <p>{review.text}</p>
                          <p className="text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No reviews available for this product.</p>
                    )}
                  </Card>
                ))}
              </Card>
            </TabPane>
          </Tabs>
        </>
      )}

      {/* Image Preview Modal */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </AppNavigation>
  );
};

export default SellerDashboard;
