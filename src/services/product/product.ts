import { ProductModelInterFace } from "../../@types/model";
import { productInputType } from "../../controllers/types/controller";
import { productModel, sellerModel } from "../../database/models";
import { mongooseTransaction } from "../../database/utils";


const getAllProducts = async (): Promise<ProductModelInterFace[]> => {
  return await productModel.find().populate('seller');
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
  createProduct
}