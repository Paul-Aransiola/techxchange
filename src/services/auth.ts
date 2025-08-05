import jwt from 'jsonwebtoken';
import { UserModelInterface } from '../@types/model';
import { sellerModel, userModel } from '../database/models';
import { checkUserPhoneOrEmailExistence, generateUserToken } from '../utils/util/helpers';
import { registerInputType, signInInputType } from '../controllers/types/controller';
import { mongooseTransaction } from '../database/utils';


const registerUser = async (payload: registerInputType) => {
    const { email, phoneNumber, password, lastName, firstName, role } = payload;
    const userExist = await checkUserPhoneOrEmailExistence(email, phoneNumber);
    
    if (userExist) {
      throw new Error(`Phone number or email already exists.`);
    }
  
    const { user } = await mongooseTransaction(async (session) => {
      const [newUser] = await userModel.create([{ phoneNumber, firstName, lastName, email, password, role }], {
        session,
      });
      await sellerModel.create([{ user: newUser._id }], { session });
      return { user: newUser };
    });
  
    const token = generateUserToken(user._id.toString(), role);

    return { user, token };
  };


  const signInUser = async (payload: signInInputType) => {
    const { email, password } = payload;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('Incorrect email/password.');
    }
  
    const isPasswordValid = await user.verifyPassword?.(password);
    if (!isPasswordValid) {
      throw new Error('Incorrect email/password.');
    }
  
    const token = await generateUserToken(user.id.toString(), user.role);
    user.lastLogin = new Date();
    await user.save();
    return { user, token };
  };

  export const authenticationService = {
    registerUser,
    signInUser,
  };