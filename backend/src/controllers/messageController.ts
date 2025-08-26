import { Request, Response } from 'express';
import { messageModel, userModel } from '../database/models';
import logger from '../utils/util/logger';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverEmail, subject, content, productId } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      throw new Error('Unauthorized');
    }

    // Validate receiver exists by email
    const receiver = await userModel.findOne({ email: receiverEmail });
    if (!receiver) {
      throw new Error('Receiver not found with this email address');
    }

    // Prevent sending message to yourself
    const sender = await userModel.findById(senderId);
    if (sender?.email === receiverEmail) {
      throw new Error('Cannot send message to yourself');
    }

    // Create message
    const message = new messageModel({
      sender: senderId,
      receiver: receiver._id,
      subject,
      content,
      product: productId || undefined,
    });

    await message.save();

    // Populate sender and receiver info
    await message.populate([
      {
        path: 'sender',
        select: 'firstName lastName email',
      },
      {
        path: 'receiver',
        select: 'firstName lastName email',
      },
      {
        path: 'product',
        select: 'name price images',
      },
    ]);

    logger.info('Message sent successfully', { messageId: message._id, senderId, receiverEmail });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message },
    });
  } catch (error: any) {
    logger.error('Error sending message', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to send message',
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20, type = 'all' } = req.query;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    let query: any = {};

    switch (type) {
      case 'sent':
        query.sender = userId;
        break;
      case 'received':
        query.receiver = userId;
        break;
      default:
        query = {
          $or: [{ sender: userId }, { receiver: userId }],
        };
    }

    const messages = await messageModel
      .find(query)
      .populate([
        {
          path: 'sender',
          select: 'firstName lastName email',
        },
        {
          path: 'receiver',
          select: 'firstName lastName email',
        },
        {
          path: 'product',
          select: 'name price images',
        },
      ])
      .sort({ createdAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const totalMessages = await messageModel.countDocuments(query);
    const totalPages = Math.ceil(totalMessages / Number(limit));

    res.status(200).json({
      success: true,
      message: 'Messages retrieved successfully',
      data: {
        messages,
        totalMessages,
        totalPages,
        currentPage: Number(page),
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error: any) {
    logger.error('Error retrieving messages', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve messages',
    });
  }
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const message = await messageModel.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Only receiver can mark message as read
    if (message.receiver.toString() !== userId) {
      throw new Error('Unauthorized to mark this message as read');
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: { message },
    });
  } catch (error: any) {
    logger.error('Error marking message as read', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to mark message as read',
    });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const unreadCount = await messageModel.countDocuments({
      receiver: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      message: 'Unread count retrieved successfully',
      data: { unreadCount },
    });
  } catch (error: any) {
    logger.error('Error getting unread count', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get unread count',
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const message = await messageModel.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Only sender or receiver can delete message
    if (message.sender.toString() !== userId && message.receiver.toString() !== userId) {
      throw new Error('Unauthorized to delete this message');
    }

    await messageModel.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error deleting message', { error: error.message });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete message',
    });
  }
};
