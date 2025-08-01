import { Request, Response } from 'express';
import { getAllProducts, getProductById } from '../services/product';
import { getProductReviews } from '../services/review';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = getProductReviews(id);
    res.status(200).json({ ...product, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};