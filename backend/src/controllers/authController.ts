import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { UserRole } from '../models/User.js';
import { z } from 'zod';
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from '../config/env.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
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
      return;
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
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
      return;
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    const allowed = ['firstName', 'lastName', 'email', 'phone', 'university', 'profilePicture'];
    const updates: Record<string, any> = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ message: 'No valid fields to update' });
      return;
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { returnDocument: 'after', runValidators: true }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    console.error("UPDATE PROFILE ERROR", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ message: 'Not authorized' }); return; }
    const file = (req as any).file;
    if (!file) { res.status(400).json({ message: 'No file uploaded' }); return; }
    const url = file.path;
    // Delete old picture from Cloudinary before saving new one
    const currentUser = await User.findById(req.user.id).select('profilePicture');
    if (currentUser?.profilePicture) {
      await deleteCloudinaryImage(currentUser.profilePicture);
    }
    await User.findByIdAndUpdate(req.user.id, { profilePicture: url });
    res.json({ url, path: url });
  } catch (error: any) {
    console.error("UPLOAD PROFILE PIC ERROR", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'No account found with this email. You need to register to the system.' });
      return;
    }
    const code = crypto.randomInt(10000000, 99999999).toString();
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    user.resetPasswordToken = codeHash;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    const { sendResetCode } = await import('../config/mailer.js');
    await sendResetCode(email, code);

    if (NODE_ENV !== 'production') {
    }

    res.json({ message: 'An 8-digit reset code has been sent to your email.' });
  } catch (error: any) {
    console.error("FORGOT PASSWORD ERROR", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, password } = req.body;
    if (!email || !code || !password) {
      res.status(400).json({ message: 'Email, code, and new password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }
    if (code.length !== 8) {
      res.status(400).json({ message: 'Reset code must be 8 characters' });
      return;
    }
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const user = await User.findOne({
      email,
      resetPasswordToken: codeHash,
      resetPasswordExpires: { $gt: new Date() },
    } as any);
    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset code. Please request a new one.' });
      return;
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful. You can now sign in.' });
  } catch (error: any) {
    console.error("RESET PASSWORD ERROR", error);
    res.status(500).json({ message: 'Server Error' });
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
    console.error("GET ME ERROR", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
