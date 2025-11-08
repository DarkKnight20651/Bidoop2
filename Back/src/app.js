import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';

import userRoutes from './routes/userRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import productRoutes from './routes/productRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// servir uploads
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// rutas
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/products', productRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/ranking', rankingRoutes);

// error handler
app.use(errorHandler);

export default app;
