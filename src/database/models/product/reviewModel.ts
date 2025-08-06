import { Schema, model } from 'mongoose';

import { MODELS } from '../../../utils/util/constants';
import { ReviewModelInterface } from '../../../@types/model';


const ReviewSchema = new Schema<ReviewModelInterface>({
  text: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: MODELS.USER,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: MODELS.PRODUCT,
    required: true,
  },
}, { timestamps: true });

const ReviewModel = model<ReviewModelInterface>(MODELS.REVIEW, ReviewSchema);

export default ReviewModel;
