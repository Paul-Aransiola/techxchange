export interface IProduct {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    sellerId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ISeller {
    id: string;
    name: string;
    location: string;
    contact: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IReview {
    id: string;
    text: string;
    rating: number;
    reviewerName: string;
    productId?: string;
    sellerId?: string;
    createdAt: Date;
    updatedAt: Date;
  }