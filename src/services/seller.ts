import { SellerModelInterface } from '../@types/model';
import { sellerBioInputType } from '../controllers/types/controller';
import { sellerModel } from '../database/models';


const getAllSellers = async (): Promise<SellerModelInterface[]> => {
  return await sellerModel.find();
};


const getSellerById = async (user_id: string) => {
  const seller = await sellerModel.findOne({ user: user_id });

  if (!seller) {
    throw new Error('Seller not found.');
  }
  return seller;
};

const updateSeller = async (payload: sellerBioInputType, user_id: string) => {

  const seller = await sellerModel.findOneAndUpdate(
    { user: user_id },
    { $set: payload },
    { new: true }
  ).select("-__v");
  return seller
};

export const sellerServices = {
  getAllSellers,
  getSellerById,
  updateSeller,
}