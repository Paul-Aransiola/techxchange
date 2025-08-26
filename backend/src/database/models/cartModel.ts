import mongoose, { Schema, Document } from 'mongoose';
import { MODELS } from '../../utils/util/constants';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  addedAt: Date;
}

export interface ICart extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: MODELS.PRODUCT,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const CartSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: MODELS.USER,
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
  totalItems: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Calculate totals before saving
CartSchema.pre('save', async function(next) {
  const cart = this as unknown as ICart;
  
  // Populate products to calculate total amount
  await cart.populate('items.product');
  
  cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  cart.totalAmount = cart.items.reduce((total, item) => {
    const product = item.product as any;
    return total + (product.price * item.quantity);
  }, 0);
  
  next();
});

export default mongoose.model<ICart>(MODELS.CART, CartSchema);
