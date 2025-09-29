import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
	const accessToken = req.cookies.accessToken;
	if (!accessToken) {
		return res.status(401).json({ message: 'You need to login' });
	}
	try {
		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findById(decoded.userId).select('-password');
		if (!user) {
			return res.status(401).json({ message: 'User not found' });
		}
		req.user = user;

		next(); // continue to route
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res
				.status(401)
				.json({ message: 'Unauthorized - Access token expired' });
		}
	}

	console.log('Error in protectRoute middleware', error.message);
	return res.status(401).json({ message: 'Invalid access token' }); // catch all other JWT errors
};

export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next();
	} else {
		return res.status(403).json({ message: 'Access denied - Admin only' });
	}
};
