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
): Promise<{
  sellers: SellerModelInterface[];
  totalSellers: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  const { page = 1, limit = 10 } = pagination;
  
  // Build search filter
  const searchFilter: any = {};
  if (filter.search) {
    searchFilter.$or = [
      { 'address.city': { $regex: filter.search, $options: 'i' } },
      { 'address.state': { $regex: filter.search, $options: 'i' } },
      { 'address.country': { $regex: filter.search, $options: 'i' } }
    ];
  }

  // Combine all filters
  const finalFilter = {
    ...searchFilter,
    ...Object.fromEntries(
      Object.entries(filter).filter(([key]) => 
        !['search', 'page', 'limit'].includes(key)
      )
    )
  };

  const totalSellers = await sellerModel.countDocuments(finalFilter);
  const totalPages = Math.ceil(totalSellers / limit);
  
  const sellers = await sellerModel
    .find(finalFilter)
    .populate('user')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    sellers,
    totalSellers,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};


const getSellerById = async (id: string) => {
  // First try to find by seller ID (_id)
  let seller = await sellerModel.findById(id).populate('user');
  
  // If not found, try to find by user ID
  if (!seller) {
    seller = await sellerModel.findOne({ user: id }).populate('user');
  }

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