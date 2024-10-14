import express from 'express'
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import indexRoutes from './routes/main.routes'
import userRoutes from './routes/users.routes'
import productRoutes from './routes/products.routes'
import advertisementRoutes from './routes/advertisements.routes'
import orderRoutes from './routes/orders.routes'

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173']
}))

app.use('/', express.static(path.join(__dirname, '../public')));

app.use(indexRoutes)
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/advertisements', advertisementRoutes);
app.use('/orders', orderRoutes)

export default app;
