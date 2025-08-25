import { ProductModelInterFace } from "../../@types/model";
import { PaginationOptions, ProductFilter, productInputType } from "../../controllers/types/controller";
import { productModel, sellerModel } from "../../database/models";
import { mongooseTransaction } from "../../database/utils";



const getAllProducts = async (
  filter: ProductFilter = {},
  pagination: PaginationOptions = {}
): Promise<ProductModelInterFace[]> => {
  const { page = 1, limit = 10 } = pagination;
  return await productModel
    .find(filter)
    .populate('seller')
    .skip((page - 1) * limit)
    .limit(limit);
};


const getAllSellerProducts = async (
  sellerID: string,
  filter: ProductFilter = {},
  pagination: PaginationOptions = {}
): Promise<ProductModelInterFace[]> => {
  const products = await mongooseTransaction(async (session) => {
    const seller = await sellerModel.findOne({ _id: sellerID }).session(session);
    if (!seller) throw new Error('Seller not found');
    const { page = 1, limit = 10 } = pagination;
    const products = await productModel
      .find({ seller: seller._id, ...filter })
      .populate('seller')
      .skip((page - 1) * limit)
      .limit(limit);
    return products;
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