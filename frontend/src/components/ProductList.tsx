import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Button,
  Spin,
  Alert,
  Pagination,
  Space,
  Slider,
  Tag,
  Rate,
  Empty,
  Modal,
  Form,
  message,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ShopOutlined,
  DollarOutlined,
  StarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import {
  getProducts,
  getProductReviews,
  createReview,
  ProductFilters,
  PaginatedResponse,
} from "../services/buyerService";
import { SellerProduct, ProductReview, ReviewInput } from "../types/seller";
import { ROLES } from "../types/auth";
import AddToCartButton from "./AddToCartButton";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ProductList: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    search: "",
    category: "",
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 12,
    hasNext: false,
    hasPrev: false,
  });

  // Review modal state
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(
    null
  );
  const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);

  const [reviewForm] = Form.useForm();

  const categories = [
    "Smartphones",
    "Laptops",
    "Desktop Computers",
    "Tablets",
    "Accessories",
    "Software",
    "Gaming",
    "Audio",
    "Smart Home",
    "Wearables",
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<SellerProduct> = await getProducts(
        filters
      );

      setProducts(response.data.products || []);
      setPagination({
        total: response.data.totalProducts || 0,
        current: response.data.currentPage,
        pageSize: filters.limit || 12,
        hasNext: response.data.hasNextPage,
        hasPrev: response.data.hasPrevPage,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  };

  const handlePriceRangeChange = (values: number | number[]) => {
    const rangeValues = Array.isArray(values)
      ? (values as [number, number])
      : [0, values];
    setFilters((prev) => ({
      ...prev,
      minPrice: rangeValues[0] || undefined,
      maxPrice: rangeValues[1] || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: "",
      category: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const viewProductDetails = async (product: SellerProduct) => {
    setSelectedProduct(product);
    setReviewModalVisible(true);
    setReviewsLoading(true);

    try {
      const response = await getProductReviews(product._id);
      setProductReviews(response.data.reviews || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setProductReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (values: ReviewInput) => {
    if (!selectedProduct || !user) return;

    setSubmitReviewLoading(true);
    try {
      await createReview(selectedProduct._id, values);
      message.success("Review submitted successfully!");
      reviewForm.resetFields();

      // Refresh reviews
      const response = await getProductReviews(selectedProduct._id);
      setProductReviews(response.data.reviews || []);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitReviewLoading(false);
    }
  };

  const calculateAverageRating = (reviews: ProductReview[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "32px" }}>
        <ShopOutlined /> Tech Marketplace
      </Title>

      {/* Filters Section */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Select category"
              value={filters.category || undefined}
              onChange={handleCategoryChange}
              allowClear
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div>
              <Text strong>Price Range: </Text>
              <Slider
                range
                min={0}
                max={5000}
                value={[filters.minPrice || 0, filters.maxPrice || 5000]}
                onChange={handlePriceRangeChange}
                tooltip={{
                  formatter: (value) => `$${value}`,
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">${filters.minPrice || 0}</Text>
                <Text type="secondary">${filters.maxPrice || 5000}</Text>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button icon={<FilterOutlined />} onClick={clearFilters}>
                Clear
              </Button>
            </Space>
          </Col>
        </Row>

        <Row style={{ marginTop: "16px" }}>
          <Col span={24}>
            <Space wrap>
              {filters.search && (
                <Tag closable onClose={() => handleSearch("")}>
                  Search: {filters.search}
                </Tag>
              )}
              {filters.category && (
                <Tag closable onClose={() => handleCategoryChange("")}>
                  Category: {filters.category}
                </Tag>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Tag closable onClose={() => handlePriceRangeChange([0, 5000])}>
                  Price: ${filters.minPrice || 0} - ${filters.maxPrice || 5000}
                </Tag>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: "24px" }}
          onClose={() => setError(null)}
        />
      )}

      {/* Loading Spinner */}
      {loading && (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text type="secondary">Loading products...</Text>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length === 0 && !error && (
        <Empty description="No products found" style={{ padding: "48px" }} />
      )}

      {!loading && products.length > 0 && (
        <>
          <div style={{ marginBottom: "16px" }}>
            <Text type="secondary">
              Showing {products.length} of {pagination.total} products
            </Text>
          </div>

          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={product._id}>
                <Card
                  hoverable
                  style={{ height: "100%" }}
                  cover={
                    product.images && product.images.length > 0 ? (
                      <img
                        alt={product.name}
                        src={`http://localhost:5000${product.images[0]}`}
                        style={{
                          height: "200px",
                          objectFit: "cover",
                          width: "100%",
                        }}
                        onLoad={() =>
                          console.log("Image loaded:", product.images?.[0])
                        }
                        onError={() =>
                          console.error("Image failed:", product.images?.[0])
                        }
                      />
                    ) : (
                      <div
                        style={{
                          height: "200px",
                          backgroundColor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ShopOutlined
                          style={{ fontSize: "48px", color: "#ccc" }}
                        />
                      </div>
                    )
                  }
                  actions={[
                    <Button
                      type="default"
                      icon={<EyeOutlined />}
                      onClick={() => viewProductDetails(product)}
                      size="small"
                    >
                      Details
                    </Button>,
                    <AddToCartButton
                      productId={product._id}
                      productName={product.name}
                      size="small"
                      type="primary"
                    />,
                  ]}
                >
                  <Card.Meta
                    title={
                      <Title level={5} style={{ margin: 0 }}>
                        {product.name}
                      </Title>
                    }
                    description={
                      <div>
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ marginBottom: "8px" }}
                        >
                          {product.description}
                        </Paragraph>

                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Tag color="blue">{product.category}</Tag>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              strong
                              style={{ fontSize: "18px", color: "#1890ff" }}
                            >
                              <DollarOutlined /> ${product.price}
                            </Text>
                          </div>

                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Sold by: {product.seller?.user?.firstName}{" "}
                            {product.seller?.user?.lastName}
                          </Text>
                        </Space>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} products`
              }
            />
          </div>
        </>
      )}

      {/* Product Details & Reviews Modal */}
      <Modal
        title={selectedProduct?.name}
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedProduct && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div>
                    <img
                      alt={selectedProduct.name}
                      src={`http://localhost:5000${selectedProduct.images[0]}`}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        marginBottom: "16px",
                        borderRadius: "8px",
                      }}
                    />
                    {selectedProduct.images.length > 1 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          overflowX: "auto",
                        }}
                      >
                        {selectedProduct.images.slice(1).map((image, index) => (
                          <img
                            key={index}
                            alt={`${selectedProduct.name} ${index + 2}`}
                            src={`http://localhost:5000${image}`}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              cursor: "pointer",
                              border: "1px solid #f0f0f0",
                            }}
                            onClick={() => {
                              // Swap main image
                              const mainImg = document.querySelector(
                                'img[alt="' + selectedProduct.name + '"]'
                              ) as HTMLImageElement;
                              if (mainImg) {
                                const currentSrc = mainImg.src;
                                mainImg.src = `http://localhost:5000${image}`;
                                // Update the thumbnail
                                (
                                  document.querySelectorAll(
                                    'img[style*="cursor: pointer"]'
                                  )[index] as HTMLImageElement
                                ).src = currentSrc;
                              }
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      height: "300px",
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <ShopOutlined
                      style={{ fontSize: "120px", color: "#ccc" }}
                    />
                  </div>
                )}
              </Col>

              <Col span={12}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={3}>{selectedProduct.name}</Title>
                  <Tag color="blue">{selectedProduct.category}</Tag>
                  <Text strong style={{ fontSize: "24px", color: "#1890ff" }}>
                    ${selectedProduct.price}
                  </Text>
                  <Paragraph>{selectedProduct.description}</Paragraph>
                  <Text type="secondary">
                    Sold by: {selectedProduct.seller?.user?.firstName}{" "}
                    {selectedProduct.seller?.user?.lastName}
                  </Text>
                </Space>
              </Col>
            </Row>

            {/* Reviews Section */}
            <div style={{ marginTop: "24px" }}>
              <Title level={4}>
                <StarOutlined /> Reviews ({productReviews.length})
                {productReviews.length > 0 && (
                  <span style={{ marginLeft: "8px" }}>
                    <Rate
                      disabled
                      value={calculateAverageRating(productReviews)}
                    />
                    <Text type="secondary">
                      {" "}
                      ({calculateAverageRating(productReviews).toFixed(1)})
                    </Text>
                  </span>
                )}
              </Title>

              {/* Add Review Form (for buyers only) */}
              {user && user.role === ROLES.BUYER && (
                <Card style={{ marginBottom: "16px" }}>
                  <Title level={5}>Write a Review</Title>
                  <Form
                    form={reviewForm}
                    onFinish={handleSubmitReview}
                    layout="vertical"
                  >
                    <Form.Item
                      name="rating"
                      label="Rating"
                      rules={[
                        { required: true, message: "Please select a rating" },
                      ]}
                    >
                      <Rate />
                    </Form.Item>

                    <Form.Item
                      name="text"
                      label="Review"
                      rules={[
                        { required: true, message: "Please enter your review" },
                      ]}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="Share your experience with this product..."
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitReviewLoading}
                      >
                        Submit Review
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div style={{ textAlign: "center", padding: "24px" }}>
                  <Spin />
                </div>
              ) : productReviews.length === 0 ? (
                <Empty description="No reviews yet" />
              ) : (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {productReviews.map((review) => (
                    <Card key={review._id} size="small">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: "8px" }}>
                            <Rate
                              disabled
                              value={review.rating}
                              style={{ fontSize: "14px" }}
                            />
                            <Text strong style={{ marginLeft: "8px" }}>
                              {review.user?.firstName} {review.user?.lastName}
                            </Text>
                          </div>
                          <Paragraph style={{ margin: 0 }}>
                            {review.text}
                          </Paragraph>
                        </div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                      </div>
                    </Card>
                  ))}
                </Space>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;
