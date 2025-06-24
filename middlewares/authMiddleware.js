import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
