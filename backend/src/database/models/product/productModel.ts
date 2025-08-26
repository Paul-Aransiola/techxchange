import { Schema, model } from 'mongoose';
import { ProductModelInterFace } from '../../../@types/model';
import { MODELS } from '../../../utils/util/constants';



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
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(images: string[]) {
        return images.length <= 5; // Maximum 5 images per product
      },
      message: 'A product can have maximum 5 images'
    }
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: MODELS.SELLER,
    required: true,
  },
}, { timestamps: true });



const ProductModel = model<ProductModelInterFace>(MODELS.PRODUCT, ProductSchema);

export default ProductModel;
