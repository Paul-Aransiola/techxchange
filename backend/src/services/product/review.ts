import { ReviewModelInterface } from "../../@types/model";
import { PaginationOptions, ReviewFilter, reviewInputType } from "../../controllers/types/controller";
import { reviewModel, productModel, userModel } from "../../database/models";
import { mongooseTransaction } from "../../database/utils";



const getAllReviews = async (
  productId: string,
  filter: ReviewFilter = {},
  pagination: PaginationOptions = {}
): Promise<ReviewModelInterface[]> => {
  const { page = 1, limit = 10 } = pagination;
  return await reviewModel
    .find({ product: productId, ...filter })
    .populate('product')
    .populate('user')
    .skip((page - 1) * limit)
    .limit(limit);
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