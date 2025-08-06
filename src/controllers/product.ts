import { Request, Response } from 'express';

import { productServices } from "../services/product";
import logger from "../utils/util/logger";
import { productInputType } from './types/controller';




export const getProductHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await productServices.getProductById(id);

    if (!product) {
      logger.warn(`Product not found: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    logger.info(`Product retrieved: ${id}`);
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });

  } catch (error: unknown) {
  
    const errorMessage = (error as Error).message;
    logger.error(`Failed to fetch product ${id}: ${errorMessage}`);

    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve product',
      error: errorMessage,
    });
  }
};


const getAllProductsHandler = async (req: Request, res: Response) => {

  try {
    const seller = await productServices.getAllProducts();
    
    logger.info(`Products retrieved`);
    res.status(200).json({
      success: true,
      message: "All products retrieved successfully",
      data: seller,
    });
  } catch (error: unknown) {
    const errMsg =(error as Error).message ;
    logger.error(`Error retrieving products: ${errMsg}`);

    res.status(400).json({
      success: false,
      message: 'Failed to retrieve products',
      error: errMsg,
    });
  }
};


const createProductHandler = async (req: Request, res: Response) => {
  const { id } = req.user;
  const payload = req.body as productInputType;

  try {
    const product = await productServices.createProduct(payload, id as string);
    logger.info(`Product created for user with ID ${id}`);
    res.status(200).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: unknown) {
    const errMsg = (error as Error).message;
    logger.error(`Error creating product for user with ID ${id}: ${errMsg}`);

    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: errMsg,
    });
  }
};


export const productHandler = {
  getAllProductsHandler,
  getProductHandler,
  createProductHandler

};
