import { Schema, model } from 'mongoose';
import { AddressInterface, BankDetailsInterface, SellerModelInterface } from '../../@types/model';
import { MODELS } from '../../utils/util/constants';


const optionalString = { type: String, lowercase: true, trim: true, required: false };

const BankDetailsSchema = new Schema<BankDetailsInterface>(
  {
    bankCode: optionalString,
    bankName: optionalString,
    accountName: optionalString,
    accountNumber: optionalString,
  },
  { _id: false }
)

const AddressSchema = new Schema<AddressInterface>(
  {
    location: optionalString,
    state: optionalString,
    city: optionalString,
  },
  { _id: false }
);

const SellerSchema = new Schema<SellerModelInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: MODELS.USER,
      required: true,
      unique: true,
    },
    bankDetails: { type: BankDetailsSchema, required: false},
    address: { type: AddressSchema, required: false},
  },
  { timestamps: true }
);

const sellerModel = model<SellerModelInterface>('Seller', SellerSchema);

export default  sellerModel