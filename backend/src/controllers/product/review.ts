import { Request, Response } from 'express';

import { reviewServices } from "../../services/product/review";
import logger from "../../utils/util/logger";
import { reviewInputType } from '../types/controller';





export const getProductReviewsHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const reviews = await reviewServices.getAllReviews(
      id as string,
      filters,
      { page: Number(page), limit: Number(limit) }
    );
    if (!reviews) {
      logger.warn(`No reviews for product with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Product reviews not found',
      });
    }
    logger.info(`Product review retrieved for product with ID: ${id}`);
    res.status(200).json({
      success: true,
      message: 'Product review retrieved successfully',
      data: reviews,
    });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    logger.error(`Failed to fetch reviews for product ${id}: ${errorMessage}`);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve product review',
      error: errorMessage,
    });
  }
};


const getReviewHandler = async (req: Request, res: Response) => {

  try {
    const {id} = req.params

    const review = await reviewServices.getReviewById( id as string);
    
    logger.info(`Review retrieved`);
    res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
    });
  } catch (error: unknown) {
    const errMsg =(error as Error).message ;
    logger.error(`Error retrieving review: ${errMsg}`);

    res.status(400).json({
      success: false,
      message: 'Failed to retrieve review',
      error: errMsg,
    });
  }
};


export const createReviewHandler = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id: productId } = req.params;
  const payload = req.body as reviewInputType;

  try {
    const review = await reviewServices.createProductReview(
      payload,
      userId as string,
      productId as string
    );

   // 2. Success response
    logger.info(`Review created by user ${userId} for product ${productId}`);
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });

  } catch (error: unknown) {
  
    const errorMessage = (error as Error).message;
    logger.error(`Failed to create review by user ${userId}: ${errorMessage}`);

    const statusCode = errorMessage.includes('validation') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to create review',
      error: errorMessage,
    });
  }
};


export const reviewHandler = {
  getProductReviewsHandler,
  getReviewHandler,
  createReviewHandler

};
