import { Request, Response } from 'express';
import { getAllSellers, getSellerById } from '../services/seller';
import { getSellerReviews } from '../services/review';

export const getSellers = async (req: Request, res: Response) => {
  try {
    const sellers = getAllSellers();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sellers' });
  }
};

export const getSeller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seller = getSellerById(id);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const reviews = getSellerReviews(id);
    res.status(200).json({ ...seller, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seller' });
  }
};