import { Request, Response } from 'express';
import { sellerServices } from '../services/seller';
import logger from '../utils/util/logger';
import { sellerBankDetailsInputType, sellerBioInputType } from './types/controller';




const getSellerBioHandler = async (req: Request, res: Response) => {
  const { id } = req.user;

  try {
    const seller = await sellerServices.getSellerById(id as string);
    
    logger.info(`seller bio data retrieved for user with ID ${id}`);
    res.status(200).json({
      success: true,
      message: "Seller bio retrieved successfully",
      data: seller,
    });
  } catch (error: unknown) {
    const errMsg =(error as Error).message ;
    logger.error(`Error retrieving seller bio data for user with ID ${id}: ${errMsg}`);

    res.status(400).json({
      success: false,
      message: 'Failed to retrieve seller bio data',
      error: errMsg,
    });
  }
};


const getAllSellersBioHandler = async (req: Request, res: Response) => {

  try {
    const seller = await sellerServices.getAllSellers();
    
    logger.info(`sellers bio data retrieved`);
    res.status(200).json({
      success: true,
      message: "Sellers bio retrieved successfully",
      data: seller,
    });
  } catch (error: unknown) {
    const errMsg =(error as Error).message ;
    logger.error(`Error retrieving seller bio data: ${errMsg}`);

    res.status(400).json({
      success: false,
      message: 'Failed to retrieve seller bio data',
      error: errMsg,
    });
  }
};


const updateSellerBioHandler = async (req: Request, res: Response) => {
  const { id } = req.user;
  const payload = req.body as sellerBioInputType;

  try {
    const seller = await sellerServices.updateSeller(payload, id as string);
    logger.info(`Seller bio data updated for user with ID ${id}`);
    res.status(200).json({
      success: true,
      message: 'Seller bio updated successfully',
      data: seller,
    });
  } catch (error: unknown) {
    const errMsg = (error as Error).message;
    logger.error(`Error updating seller bio data for user with ID ${id}: ${errMsg}`);

    res.status(400).json({
      success: false,
      message: 'Failed to update seller bio data',
      error: errMsg,
    });
  }
};


export const sellerBioHandler = {
  getSellerBioHandler,
  getAllSellersBioHandler,
  updateSellerBioHandler

};
