import Deal from '../models/Deal.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

export const renderAdminLogin = (req, res) => {
  res.sendFile(process.cwd() + '/views/adminLogin.html');
};

export const handleAdminLogin = (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.cookie('admin', 'loggedin', { httpOnly: true });
    return res.redirect('/admin');
  }
  return res.send('<p>Invalid credentials</p><a href="/admin/login">Try Again</a>');
};

export const logoutAdmin = (req, res) => {
  res.clearCookie('admin');
  res.redirect('/admin/login');
};

export const getAdminDashboard = async (req, res) => {
  const totalDeals = await Deal.countDocuments();
  const acceptedDeals = await Deal.countDocuments({ status: 'accepted' });
  const pendingDeals = await Deal.countDocuments({ status: 'pending' });
  const rejectedDeals = await Deal.countDocuments({ status: 'rejected' });
  const totalUsers = await User.countDocuments();
  const totalSpent = await Payment.aggregate([
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  res.sendFile(process.cwd() + '/views/adminDashboard.html');
};


export const getAdminStats = async (req, res) => {
  try {
    const totalDeals = await Deal.countDocuments();
    const acceptedDeals = await Deal.countDocuments({ status: 'accepted' });
    const pendingDeals = await Deal.countDocuments({ status: 'pending' });
    const rejectedDeals = await Deal.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments();

    const totalSpent = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }, // or '$amount'
    ]);

    res.json({
      totalDeals,
      acceptedDeals,
      pendingDeals,
      rejectedDeals,
      totalUsers,
      totalSpent: totalSpent[0]?.total || 0,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Stats fetch failed' });
  }
};

