import { Schema, model, CallbackError } from 'mongoose';
import { compare } from 'bcrypt';

import { generatePassword } from '../../utils/util/helpers';
import { MODELS, ROLES_TYPE } from '../../utils/util/constants';
import { UserModelInterface } from '../../@types/model';

const saltRounds = parseInt(process.env.SALT_ROUNDS)

const UserSchema = new Schema<UserModelInterface>({
  firstName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: false,
    lowercase: true, 
    trim: true, 
  },
  role: {
    type: String,
    enum: Object.values(ROLES_TYPE),
    required: true,
    default: ROLES_TYPE.BUYER
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  __v: { type: Number, select: false },
  lastLogin: {
    type: Date,
  },
}, { timestamps: true });

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const password = await generatePassword(this.password, saltRounds)
    this.password = password
    next();
  } catch (error: unknown) {
    next(error as CallbackError);
  }
});

UserSchema.methods.verifyPassword = async function (password: string): Promise<boolean> {
  return compare(password, this.password);
};

// Override the `toJSON` method to hide sensitive fields (like password)
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UserModel = model<UserModelInterface>(MODELS.USER, UserSchema);

export default UserModel;
