import { Schema, model } from 'mongoose';

import { MODELS } from '../../utils/util/constants';
import { ProductModelInterFace } from '../../@types/model';


const ProductSchema = new Schema<ProductModelInterFace>({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    lowercase: true, 
    trim: true, 
  },
  price: {
    type: Number,
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: MODELS.SELLER,
    required: true,
  },
}, { timestamps: true });



const ProductModel = model<ProductModelInterFace>(MODELS.PRODUCT, ProductSchema);

export default ProductModel;
