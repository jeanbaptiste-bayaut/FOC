import express from 'express';
import router from './routers/index.router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

export default app;
