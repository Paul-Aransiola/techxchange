import { ProductModelInterFace } from "../../@types/model";
import { PaginationOptions, ProductFilter, productInputType } from "../../controllers/types/controller";
import { productModel, sellerModel } from "../../database/models";
import { mongooseTransaction } from "../../database/utils";



const getAllProducts = async (
  filter: ProductFilter = {},
  pagination: PaginationOptions = {}
): Promise<{
  products: ProductModelInterFace[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  const { page = 1, limit = 10 } = pagination;
  
  // Build price filter
  const priceFilter: any = {};
  if (filter.minPrice) {
    priceFilter.price = { ...priceFilter.price, $gte: Number(filter.minPrice) };
  }
  if (filter.maxPrice) {
    priceFilter.price = { ...priceFilter.price, $lte: Number(filter.maxPrice) };
  }

  // Build search filter for name and category
  const searchFilter: any = {};
  if (filter.search) {
    searchFilter.$or = [
      { name: { $regex: filter.search, $options: 'i' } },
      { category: { $regex: filter.search, $options: 'i' } },
      { description: { $regex: filter.search, $options: 'i' } }
    ];
  }

  // Category filter
  if (filter.category) {
    searchFilter.category = { $regex: filter.category, $options: 'i' };
  }

  // Combine all filters
  const finalFilter = {
    ...priceFilter,
    ...searchFilter,
    // Remove pagination and price filter keys from filter object
    ...Object.fromEntries(
      Object.entries(filter).filter(([key]) => 
        !['minPrice', 'maxPrice', 'search', 'page', 'limit'].includes(key)
      )
    )
  };

  const totalProducts = await productModel.countDocuments(finalFilter);
  const totalPages = Math.ceil(totalProducts / limit);
  
  const products = await productModel
    .find(finalFilter)
    .populate('seller')
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    products,
    totalProducts,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};


const getAllSellerProducts = async (
  sellerID: string,
  filter: ProductFilter = {},
  pagination: PaginationOptions = {}
): Promise<{
  products: ProductModelInterFace[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  const products = await mongooseTransaction(async (session) => {
    const seller = await sellerModel.findOne({ _id: sellerID }).session(session);
    if (!seller) throw new Error('Seller not found');
    
    const { page = 1, limit = 10 } = pagination;
    
    // Build price filter
    const priceFilter: any = {};
    if (filter.minPrice) {
      priceFilter.price = { ...priceFilter.price, $gte: Number(filter.minPrice) };
    }
    if (filter.maxPrice) {
      priceFilter.price = { ...priceFilter.price, $lte: Number(filter.maxPrice) };
    }

    // Build search filter
    const searchFilter: any = {};
    if (filter.search) {
      searchFilter.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { category: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } }
      ];
    }

    if (filter.category) {
      searchFilter.category = { $regex: filter.category, $options: 'i' };
    }

    // Combine all filters
    const finalFilter = {
      seller: seller._id,
      ...priceFilter,
      ...searchFilter,
      ...Object.fromEntries(
        Object.entries(filter).filter(([key]) => 
          !['minPrice', 'maxPrice', 'search', 'page', 'limit'].includes(key)
        )
      )
    };

    const totalProducts = await productModel.countDocuments(finalFilter).session(session);
    const totalPages = Math.ceil(totalProducts / limit);
    
    const products = await productModel
      .find(finalFilter)
      .populate('seller')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .session(session);

    return {
      products,
      totalProducts,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  });
  return products;
};


const createProduct = async (payload: productInputType, userId: string) => {
 
  const product = await mongooseTransaction(async (session) => {

    const seller = await sellerModel.findOne({ user: userId }).session(session);
    if (!seller) throw new Error('Seller not found');

    // 2. Create a new product (not upsert)
    const [newProduct] = await productModel.create(
      [{ ...payload, seller: seller._id }], 
      { session }
    );

    return newProduct;
  });

  return product;
};

const updateProduct = async (payload: productInputType, productId: string, userId: string) => {
 
  const product = await mongooseTransaction(async (session) => {

    const seller = await sellerModel.findOne({ user: userId }).session(session);
    if (!seller) throw new Error('Seller not found');

    const updatedProduct = await productModel.findOneAndUpdate(
      { 
        seller: seller._id, 
        _id: productId
      },
      { $set: { ...payload } },
      { 
        upsert: true,
        new: true,
        session,
        runValidators: true 
      }
    );

    return updatedProduct;
  });

  return product;
};


const getProductById = async (product_id: string) => {
  const product = await productModel.findOne({ _id: product_id }).populate('seller');

  if (!product) {
    throw new Error('Product not found.');
  }
  return product;
};


export const productServices = {
  getAllProducts,
  getProductById,
  createProduct,
  getAllSellerProducts,
  updateProduct,
}