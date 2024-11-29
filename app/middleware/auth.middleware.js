import jwt from 'jsonwebtoken';

export default {
  // token verification for protected routes
  verifyToken(req, res, next) {
    const cookies = req.headers.cookie.split(';'); // get cookies from headers

    let token = ''; // initialize token

    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      // check if key is token and assign value to token
      if (key === 'token') {
        token = value;
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, please log in' });
    }

    try {
      // verify token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      // assign user data to req.user
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
