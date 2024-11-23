import { Request, Response } from 'express';
import prisma from '@repo/db/client';
import jwt from 'jsonwebtoken';

const adminLogin = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.studentId) {
      return res.status(400).json({
        message: 'Student ID is required',
      });
    }

    const userExists = await prisma.user.findFirst({
      where: {
        studentId: body.studentId,
      },
    });

    if (!userExists) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!userExists.isAdmin) {
      return res.status(403).json({
        message: 'Forbidden',
      });
    }

    const pin = userExists.pin;

    if (body.pin !== pin) {
      return res.status(401).json({
        message: 'Invalid pin',
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        message: 'Internal server error: JWT secret is not defined',
      });
    }
    const token = jwt.sign(
      {
        id: userExists.id,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const checkAdmin = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        message: 'Forbidden',
      });
    }

    return res.status(200).json({
      message: 'Authorized',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export { adminLogin, checkAdmin };
