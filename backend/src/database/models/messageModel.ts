import mongoose, { Schema, Document } from 'mongoose';
import { MODELS } from '../../utils/util/constants';

export interface IMessage extends Document {
  _id: string;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  product?: mongoose.Types.ObjectId;
  subject: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: MODELS.USER,
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: MODELS.USER,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: MODELS.PRODUCT,
    required: false,
  },
  subject: {
    type: String,
    required: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, isRead: 1 });

export default mongoose.model<IMessage>(MODELS.MESSAGE, MessageSchema);
