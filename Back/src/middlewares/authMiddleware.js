// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('Usuario no encontrado');
      }
      next();
    } catch (error) {
      res.status(401);
      return next(new Error('Token no válido'));
    }
  } else {
    res.status(401);
    return next(new Error('No autorizado, token faltante'));
  }
};

export const adminOnly = (req, res, next) => {
  // suponer que User tiene campo role
  if (req.user && req.user.role === 'admin') return next();
  res.status(403);
  return next(new Error('Requiere permisos de administrador'));
};
