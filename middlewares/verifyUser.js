import jwt from 'jsonwebtoken';

export const verifyUser = (req, res, next) => {
  console.log('item added3')
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
  console.log('item added4')
    next();
  } catch (err) {
  console.log('err', err)
    res.status(403).json({ message: 'Invalid token' });
  }
};
