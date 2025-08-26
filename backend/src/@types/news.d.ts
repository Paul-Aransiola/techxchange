export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface TechNewsResponse {
  success: boolean;
  message: string;
  data: {
    articles: NewsArticle[];
    totalResults: number;
    cached: boolean;
    lastUpdated: string;
  };
}

export interface NewsQuery {
  q?: string;
  sources?: string;
  category?: string;
  country?: string;
  language?: string;
  pageSize?: number;
  page?: number;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
}

export interface CachedNews {
  articles: NewsArticle[];
  totalResults: number;
  lastUpdated: Date;
  expiresAt: Date;
}
