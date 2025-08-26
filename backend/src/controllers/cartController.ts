import { Request, Response } from 'express';
import { cartModel, productModel } from '../database/models';
import logger from '../utils/util/logger';


export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    let cart = await cartModel
      .findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name price images category seller',
        populate: {
          path: 'seller',
          select: 'user',
          populate: {
            path: 'user',
            select: 'firstName lastName email',
          },
        },
      });

    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: { cart },
    });
  } catch (error: any) {
    logger.error('Error retrieving cart', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve cart',
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Validate product exists
    const product = await productModel.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Find or create cart
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        addedAt: new Date(),
      });
    }

    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price images category seller',
      populate: {
        path: 'seller',
        select: 'user',
        populate: {
          path: 'user',
          select: 'firstName lastName email',
        },
      },
    });

    logger.info('Product added to cart', { userId, productId, quantity });

    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      data: { cart },
    });
  } catch (error: any) {
    logger.error('Error adding to cart', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to add product to cart',
    });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw new Error('Product not found in cart');
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price images category seller',
      populate: {
        path: 'seller',
        select: 'user',
        populate: {
          path: 'user',
          select: 'firstName lastName email',
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: { cart },
    });
  } catch (error: any) {
    logger.error('Error updating cart item', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update cart item',
    });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      select: 'name price images category seller',
      populate: {
        path: 'seller',
        select: 'user',
        populate: {
          path: 'user',
          select: 'firstName lastName email',
        },
      },
    });

    logger.info('Product removed from cart', { userId, productId });

    res.status(200).json({
      success: true,
      message: 'Product removed from cart successfully',
      data: { cart },
    });
  } catch (error: any) {
    logger.error('Error removing from cart', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to remove product from cart',
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: { cart },
    });
  } catch (error: any) {
    logger.error('Error clearing cart', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to clear cart',
    });
  }
};
