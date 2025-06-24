import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';


const registerSchema = z.object({
  fullname: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(20, 'Full name must not exceed 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/\d/, 'Password must include at least one number'),
  role: z.enum(['buyer', 'seller']),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


export const register = async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      const errors = { fullname: '', email: '', password: '' };
      result.error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      return res.status(400).json({ errors });
    }

    const { fullname, email, password, role } = result.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        errors: { email: 'Email already exists', fullname: '', password: '' }
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ fullname, email, password: hashed, role });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      })
      .status(201)
      .json({ user: { id: newUser._id, fullname, email, role } });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const login = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      const errors = { email: '', password: '' };
      result.error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      return res.status(400).json({ errors });
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        errors: { email: 'User not found', password: '' }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        errors: { email: '', password: 'Incorrect password' }
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false,
      })
      .status(200)
      .json({ user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role } });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};



export const logout = (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false, // true in production with HTTPS
    })
    .status(200)
    .json({ message: 'Logged out successfully' });
};
