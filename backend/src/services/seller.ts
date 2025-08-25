import { SellerModelInterface } from '../@types/model';
import { sellerBioInputType } from '../controllers/types/controller';
import { sellerModel } from '../database/models';



interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface SellerFilter {
  [key: string]: any;
}

const getAllSellers = async (
  filter: SellerFilter = {},
  pagination: PaginationOptions = {}
): Promise<SellerModelInterface[]> => {
  const { page = 1, limit = 10 } = pagination;
  return await sellerModel
    .find(filter)
    .populate('user')
    .skip((page - 1) * limit)
    .limit(limit);
};


const getSellerById = async (user_id: string) => {
  const seller = await sellerModel.findOne({ user: user_id }).populate('user');

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