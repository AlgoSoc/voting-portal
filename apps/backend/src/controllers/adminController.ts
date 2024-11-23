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

const addCandidate = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { studentId, positionId } = req.body;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({
        message: 'Forbidden: Admin access required',
      });
    }

    if (!studentId || !positionId) {
      return res.status(400).json({
        message: 'Student ID and position ID are required',
      });
    }

    const position = await prisma.position.findUnique({
      where: {
        id: positionId,
      },
    });

    if (!position) {
      return res.status(404).json({
        message: 'Position not found',
      });
    }

    const student = await prisma.user.findUnique({
      where: {
        studentId: studentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: 'Student not found',
      });
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        user: {
          connect: { id: student.id },
        },
        position: {
          connect: { id: positionId },
        },
      },
    });

    return res.status(201).json({
      message: 'Candidate added successfully',
      candidate: newCandidate,
    });
  } catch (error) {
    console.error('Error in addCandidate:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getCandidates = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        message: 'Forbidden: Admin access required',
      });
    }

    const candidates = await prisma.candidate.findMany({
      include: {
        position: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            studentId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return res.status(200).json(candidates);
  } catch (error) {
    console.error('Error in getCandidates:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const candidateId = req.params.id;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        message: 'Forbidden: Admin access required',
      });
    }

    await prisma.candidate.delete({
      where: {
        id: candidateId,
      },
    });

    return res.status(200).json({
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteCandidate:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getPositions = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        message: 'Forbidden: Admin access required',
      });
    }

    const positions = await prisma.position.findMany();

    return res.status(200).json(positions);
  } catch (error) {
    console.error('Error in getPositions:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const addPosition = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { name } = req.body;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        message: 'Forbidden: Admin access required',
      });
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        message: 'Position name is required and must be a non-empty string',
      });
    }

    const existingPosition = await prisma.position.findFirst({
      where: {
        name: name.trim(),
      },
    });

    if (existingPosition) {
      return res.status(409).json({
        message: 'A position with this name already exists',
      });
    }

    const newPosition = await prisma.position.create({
      data: {
        name: name.trim(),
      },
    });

    return res.status(201).json({
      message: 'Position added successfully',
      position: newPosition,
    });
  } catch (error) {
    console.error('Error in addPosition:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export {
  adminLogin,
  checkAdmin,
  getCandidates,
  addCandidate,
  deleteCandidate,
  getPositions,
  addPosition,
};
