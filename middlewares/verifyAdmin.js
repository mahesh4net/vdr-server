export const verifyAdminSession = (req, res, next) => {
  const isApi = req.originalUrl.startsWith('/api');

  if (req.cookies.admin === 'loggedin') return next();

  // If it's an API request, return 401
  if (isApi) return res.status(401).json({ message: 'Unauthorized' });

  // Otherwise redirect to login page
  res.redirect('/admin/login');
};
