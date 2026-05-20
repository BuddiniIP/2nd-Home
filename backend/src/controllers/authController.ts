import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User.js';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
  });
};

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
  phone: z.string().optional(),
  university: z.string().optional(),
});

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedParams = registerSchema.safeParse(req.body);
    
    if (!parsedParams.success) {
      res.status(400).json({ message: parsedParams.error.issues[0].message });
      return;
    }

    const { firstName, lastName, email, password, role, phone, university } = parsedParams.data;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      university: role === UserRole.STUDENT ? university : undefined, // only attach to student
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token: generateToken((user._id as any).toString(), user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error("/// REGISTRATION ERROR ///", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedParams = loginSchema.safeParse(req.body);
    
    if (!parsedParams.success) {
      res.status(400).json({ message: parsedParams.error.issues[0].message });
      return;
    }

    const { email, password } = parsedParams.data;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: 'Login successful',
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token: generateToken((user._id as any).toString(), user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error("/// LOGIN ERROR ///", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
