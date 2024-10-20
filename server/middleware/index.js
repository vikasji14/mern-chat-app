import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Please login. We need a token to verify you!' });
    }

    jwt.verify(token, `${process.env.JWT_SECREAT}`, (err, decoded) => {
      if (err) {
        console.log("🚀 ~ file: index.js:19 ~ jwt.verify ~ err:", err);
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

export default  authenticateToken ;
