import { IReview } from '../interfaces';

const reviews: IReview[] = [
  {
    id: '1',
    text: 'Great laptop, very fast!',
    rating: 5,
    reviewerName: 'John Doe',
    productId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    text: 'Good phone but battery could be better',
    rating: 4,
    reviewerName: 'Jane Smith',
    productId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    text: 'Excellent service from this seller',
    rating: 5,
    reviewerName: 'Alex Johnson',
    sellerId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getProductReviews = (productId: string): IReview[] => {
  return reviews.filter((review) => review.productId === productId);
};

export const getSellerReviews = (sellerId: string): IReview[] => {
  return reviews.filter((review) => review.sellerId === sellerId);
};