import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Spin,
  Select,
  Input,
  Space,
  Tag,
  Alert,
  Typography,
  Row,
  Col,
  Empty,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { newsService, NewsArticle, NewsQuery } from "../services/newsService";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "relevancy" | "popularity" | "publishedAt"
  >("publishedAt");
  const [country, setCountry] = useState("us");
  const [activeTab, setActiveTab] = useState<
    "general" | "headlines" | "sources"
  >("general");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [cached, setCached] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchNews = useCallback(
    async (params?: NewsQuery) => {
      setLoading(true);
      setError(null);

      try {
        let response;

        switch (activeTab) {
          case "headlines":
            response = await newsService.getTechHeadlines(country);
            break;
          case "sources":
            response = await newsService.getNewsFromTechSources();
            break;
          default:
            if (searchQuery.trim()) {
              response = await newsService.searchTechNews(searchQuery, {
                sortBy,
                page: currentPage,
                pageSize,
                ...params,
              });
            } else {
              response = await newsService.getTechNews({
                sortBy,
                page: currentPage,
                pageSize,
                ...params,
              });
            }
        }

        setArticles(response.data.articles);
        setTotalResults(response.data.totalResults);
        setCached(response.data.cached);
        setLastUpdated(response.data.lastUpdated);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch news");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    },
    [activeTab, searchQuery, sortBy, country, currentPage, pageSize]
  );

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchNews();
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchNews();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSourceColor = (sourceName: string) => {
    const colors = ["blue", "green", "orange", "red", "purple", "cyan"];
    const index = sourceName.length % colors.length;
    return colors[index];
  };

  const countries = [
    { code: "us", name: "United States" },
    { code: "gb", name: "United Kingdom" },
    { code: "ca", name: "Canada" },
    { code: "au", name: "Australia" },
    { code: "de", name: "Germany" },
    { code: "fr", name: "France" },
    { code: "jp", name: "Japan" },
    { code: "in", name: "India" },
  ];

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "32px" }}>
          Tech News Hub
        </Title>

        {/* Navigation Tabs */}
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <Button.Group>
            <Button
              type={activeTab === "general" ? "primary" : "default"}
              onClick={() => setActiveTab("general")}
            >
              General Tech News
            </Button>
            <Button
              type={activeTab === "headlines" ? "primary" : "default"}
              onClick={() => setActiveTab("headlines")}
            >
              Headlines
            </Button>
            <Button
              type={activeTab === "sources" ? "primary" : "default"}
              onClick={() => setActiveTab("sources")}
            >
              Tech Sources
            </Button>
          </Button.Group>
        </div>

        {/* Search and Filter Controls */}
        <Card style={{ marginBottom: "24px" }}>
          <Row gutter={[16, 16]} align="middle">
            {activeTab === "general" && (
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search tech news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onPressEnter={handleSearch}
                  prefix={<SearchOutlined />}
                />
              </Col>
            )}

            {activeTab === "headlines" && (
              <Col xs={24} sm={12} md={8}>
                <Select
                  style={{ width: "100%" }}
                  value={country}
                  onChange={setCountry}
                  placeholder="Select country"
                >
                  {countries.map((c) => (
                    <Option key={c.code} value={c.code}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            )}

            {activeTab === "general" && (
              <Col xs={24} sm={12} md={8}>
                <Select
                  style={{ width: "100%" }}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort by"
                >
                  <Option value="publishedAt">Latest</Option>
                  <Option value="relevancy">Relevancy</Option>
                  <Option value="popularity">Popularity</Option>
                </Select>
              </Col>
            )}

            <Col xs={24} sm={12} md={8}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={loading}
                >
                  {activeTab === "general" ? "Search" : "Load"}
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Status Information */}
          {lastUpdated && (
            <Row style={{ marginTop: "16px" }}>
              <Col span={24}>
                <Space>
                  <Tag color={cached ? "orange" : "green"}>
                    {cached ? "Cached Data" : "Fresh Data"}
                  </Tag>
                  <Text type="secondary">
                    <ClockCircleOutlined /> Last updated:{" "}
                    {formatDate(lastUpdated)}
                  </Text>
                  <Text type="secondary">Total results: {totalResults}</Text>
                </Space>
              </Col>
            </Row>
          )}
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
              <Text type="secondary">Loading latest tech news...</Text>
            </div>
          </div>
        )}

        {/* News Articles */}
        {!loading && articles.length === 0 && !error && (
          <Empty
            description="No news articles found"
            style={{ padding: "48px" }}
          />
        )}

        {!loading && articles.length > 0 && (
          <>
            <Row gutter={[16, 16]}>
              {articles.map((article, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    hoverable
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    cover={
                      article.urlToImage && (
                        <img
                          alt={article.title}
                          src={article.urlToImage}
                          style={{ height: "200px", objectFit: "cover" }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )
                    }
                    actions={[
                      <Button
                        type="link"
                        icon={<LinkOutlined />}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read Full Article
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div style={{ marginBottom: "8px" }}>
                          <Title
                            level={5}
                            style={{ margin: 0, lineHeight: "1.3" }}
                          >
                            {article.title}
                          </Title>
                        </div>
                      }
                      description={
                        <div style={{ flex: 1 }}>
                          <Paragraph
                            ellipsis={{ rows: 3, expandable: false }}
                            style={{ marginBottom: "12px" }}
                          >
                            {article.description}
                          </Paragraph>

                          <div style={{ marginTop: "auto" }}>
                            <Space wrap>
                              <Tag color={getSourceColor(article.source.name)}>
                                <GlobalOutlined /> {article.source.name}
                              </Tag>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                <ClockCircleOutlined />{" "}
                                {formatDate(article.publishedAt)}
                              </Text>
                            </Space>

                            {article.author && (
                              <div style={{ marginTop: "4px" }}>
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  By {article.author}
                                </Text>
                              </div>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {activeTab === "general" && totalResults > pageSize && (
              <div style={{ textAlign: "center", marginTop: "32px" }}>
                <Pagination
                  current={currentPage}
                  total={totalResults}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} articles`
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default News;
