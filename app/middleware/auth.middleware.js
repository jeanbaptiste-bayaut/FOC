import jwt from 'jsonwebtoken';

export default {
  // token verification
  verifyToken(req, res, next) {
    const cookies = req.headers.cookie.split(';');

    let token = '';

    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === 'token') {
        token = value;
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, please log in' });
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token' });
      }
    }
  },
};
