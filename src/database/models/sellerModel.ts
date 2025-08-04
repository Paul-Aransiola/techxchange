import { Schema, model } from 'mongoose';
import { SellerModelInterface } from '../../@types/model';

const SellerSchema = new Schema<SellerModelInterface>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
  },
  { timestamps: true }
);

const sellerModel = model<SellerModelInterface>('Seller', SellerSchema);

export default  sellerModel