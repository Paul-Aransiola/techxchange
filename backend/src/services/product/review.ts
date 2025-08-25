import { ReviewModelInterface } from "../../@types/model";
import { PaginationOptions, ReviewFilter, reviewInputType } from "../../controllers/types/controller";
import { reviewModel, productModel, userModel } from "../../database/models";
import { mongooseTransaction } from "../../database/utils";



const getAllReviews = async (
  productId: string,
  filter: ReviewFilter = {},
  pagination: PaginationOptions = {}
): Promise<{
  reviews: ReviewModelInterface[];
  totalReviews: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  averageRating: number;
}> => {
  const { page = 1, limit = 10 } = pagination;
  
  // Build rating filter
  const ratingFilter: any = {};
  if (filter.minRating) {
    ratingFilter.rating = { ...ratingFilter.rating, $gte: Number(filter.minRating) };
  }
  if (filter.maxRating) {
    ratingFilter.rating = { ...ratingFilter.rating, $lte: Number(filter.maxRating) };
  }

  // Build search filter
  const searchFilter: any = {};
  if (filter.search) {
    searchFilter.text = { $regex: filter.search, $options: 'i' };
  }

  // Combine all filters
  const finalFilter = {
    product: productId,
    ...ratingFilter,
    ...searchFilter,
    ...Object.fromEntries(
      Object.entries(filter).filter(([key]) => 
        !['minRating', 'maxRating', 'search', 'page', 'limit'].includes(key)
      )
    )
  };

  const totalReviews = await reviewModel.countDocuments(finalFilter);
  const totalPages = Math.ceil(totalReviews / limit);
  
  const reviews = await reviewModel
    .find(finalFilter)
    .populate('product')
    .populate('user')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // Calculate average rating
  const ratingStats = await reviewModel.aggregate([
    { $match: { product: productId } },
    { $group: { _id: null, averageRating: { $avg: '$rating' } } }
  ]);
  
  const averageRating = ratingStats.length > 0 ? Math.round(ratingStats[0].averageRating * 10) / 10 : 0;

  return {
    reviews,
    totalReviews,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    averageRating
  };
};


const createProductReview = async (
  payload: reviewInputType,
  userId: string,
  productId: string
) => {
  const review = await mongooseTransaction(async (session) => {
 
    const user = await userModel.findById(userId).session(session);
    if (!user) throw new Error('User not found');

    const product = await productModel.findById(productId).session(session);
    if (!product) throw new Error('Product not found');

    const updatedReview = await reviewModel.findOneAndUpdate(
      { 
        user: user._id, 
        product: product._id 
      },
      { $set: { ...payload } },
      { 
        upsert: true,
        new: true,
        session,
        runValidators: true 
      }
    );

    return updatedReview;
  });

  return review;
};


const getReviewById = async (reviewId: string) => {
  const review = await reviewModel.findById({ _id: reviewId }).populate('user');

  if (!review) {
    throw new Error('Review not found.');
  }
  return review;
};


export const reviewServices = {
  getAllReviews,
  createProductReview,
  getReviewById
}