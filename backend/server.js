import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' })); // to parse req.body DoS attack denial of service
// limit shouldn't be too high to prevent DoS
app.use(express.urlencoded({ extended: true })); // to parse from data
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

if (process.env.NODE_ENV === 'production') {
	// Serve frontend static files
	app.use(express.static(path.join(__dirname, '/frontend/dist')));

	// ALL other requests server frontend
	app.get('/{*any}', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
	});
} else {
	// in Development, just show a simple message on root
	app.get('/', (req, res) => {
		res.send('API is running...');
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	connectDB();
});
