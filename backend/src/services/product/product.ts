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
  if (filter.search && filter.search.trim() !== '') {
    searchFilter.$or = [
      { name: { $regex: filter.search, $options: 'i' } },
      { category: { $regex: filter.search, $options: 'i' } },
      { description: { $regex: filter.search, $options: 'i' } }
    ];
  }

  // Category filter
  if (filter.category && filter.category.trim() !== '') {
    searchFilter.category = { $regex: filter.category, $options: 'i' };
  }

  // Combine all filters
  const finalFilter = {
    ...priceFilter,
    ...searchFilter,
    // Remove pagination, price filter keys, and empty values from filter object
    ...Object.fromEntries(
      Object.entries(filter).filter(([key, value]) => 
        !['minPrice', 'maxPrice', 'search', 'page', 'limit', 'category'].includes(key) &&
        value !== '' && value !== null && value !== undefined
      )
    )
  };

  const totalProducts = await productModel.countDocuments(finalFilter);
  const totalPages = Math.ceil(totalProducts / limit);
  
  try {
    const products = await productModel
      .find(finalFilter)
      .populate({
        path: 'seller',
        select: '_id user address',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter out products with missing seller references
    const validProducts = products.filter(product => product.seller != null);
    
    if (validProducts.length !== products.length) {
      console.warn(`Found ${products.length - validProducts.length} products with invalid seller references`);
    }

    return {
      products: validProducts,
      totalProducts: validProducts.length,
      totalPages: Math.ceil(validProducts.length / limit),
      currentPage: page,
      hasNextPage: page < Math.ceil(validProducts.length / limit),
      hasPrevPage: page > 1
    };
  } catch (populateError) {
    console.error('Error populating seller data:', populateError);
    
    // Fallback: return products without seller population
    const products = await productModel
      .find(finalFilter)
      .sort({ createdAt: -1 })
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
  }
};


const getAllSellerProducts = async (
  sellerID: string,
  filter: ProductFilter = {},
  pagination: PaginationOptions = {},
  isUserId: boolean = false
): Promise<{
  products: ProductModelInterFace[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  const products = await mongooseTransaction(async (session) => {
    // In test environment, don't use session for queries to avoid MongoDB Memory Server issues
    const isTest = process.env.NODE_ENV === 'test';
    
    // If isUserId is true, find seller by user field, otherwise by _id
    const sellerQuery = isUserId ? { user: sellerID } : { _id: sellerID };
    const seller = isTest 
      ? await sellerModel.findOne(sellerQuery)
      : await sellerModel.findOne(sellerQuery).session(session);
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
    if (filter.search && filter.search.trim() !== '') {
      searchFilter.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { category: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } }
      ];
    }

    if (filter.category && filter.category.trim() !== '') {
      searchFilter.category = { $regex: filter.category, $options: 'i' };
    }

    // Combine all filters
    const finalFilter = {
      seller: seller._id,
      ...priceFilter,
      ...searchFilter,
      ...Object.fromEntries(
        Object.entries(filter).filter(([key, value]) => 
          !['minPrice', 'maxPrice', 'search', 'page', 'limit', 'category'].includes(key) &&
          value !== '' && value !== null && value !== undefined
        )
      )
    };

    const totalProducts = isTest 
      ? await productModel.countDocuments(finalFilter)
      : await productModel.countDocuments(finalFilter).session(session);
    const totalPages = Math.ceil(totalProducts / limit);
    
    const products = isTest 
      ? await productModel
          .find(finalFilter)
          .populate('seller')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
      : await productModel
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
    // In test environment, don't use session for queries to avoid MongoDB Memory Server issues
    const isTest = process.env.NODE_ENV === 'test';
    
    const seller = isTest 
      ? await sellerModel.findOne({ user: userId })
      : await sellerModel.findOne({ user: userId }).session(session);
    if (!seller) throw new Error('Seller not found');

    // 2. Create a new product (not upsert)
    const createOptions = isTest ? {} : { session };
    const [newProduct] = await productModel.create(
      [{ ...payload, seller: seller._id }], 
      createOptions
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