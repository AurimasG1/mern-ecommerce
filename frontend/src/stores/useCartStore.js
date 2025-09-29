import { create } from 'zustand';
import axios from '../lib/axios.js';
import { toast } from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	loading: false,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get('/coupons');
			set({ coupon: response.data });
		} catch (error) {
			console.error('Error fetching coupon', error);
		}
	},
	applyCoupon: async code => {
		try {
			const response = await axios.post('/coupons/validate', { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success('Coupon applied successfully');
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to apply coupon');
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success('Coupon removed');
	},

	getCartItems: async () => {
		try {
			const res = await axios.get('/cart');
			set({ cart: res.data, isCouponApplied: false });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [], isCouponApplied: false });
			console.error('Failed to fetch cart items:', error);
		}
	},
	addToCart: async product => {
		try {
			await axios.post(`/cart`, { productId: product._id });
			set(prevState => {
				const existingItem = prevState.cart.find(item => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map(item =>
							item._id === product._id
								? { ...item, quantity: item.quantity + 1 }
								: item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals();
			toast.success('Product added to cart', { id: 'quantity' });
		} catch (error) {
			if (error.response?.status === 401) {
				toast.error('Please log in to add items to your cart.');
				return; // stop further execution
			}
			// Normalize error message
			const message =
				error?.response?.data?.message || // server provided
				error?.message || // axios or network error
				'An unexpected error occurred'; // fallback

			console.error('Failed to fetch cart items:', error);
			toast.error(message);
		}
	},

	removeFromCart: async productId => {
		await axios.delete('/cart', { data: { productId } });
		set(prevState => ({
			cart: prevState.cart.filter(item => item._id !== productId),
		}));
		get().calculateTotals();
	},

	clearCart: async () => {
		await axios.delete('/cart/clear');
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},

	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}
		await axios.put(`/cart/${productId}`, { quantity });
		set(prevState => ({
			cart: prevState.cart.map(item =>
				item._id === productId ? { ...item, quantity } : item
			),
		}));
		get().calculateTotals();
	},

	calculateTotals: () => {
		const { cart, coupon, isCouponApplied } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon && isCouponApplied) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}
		set({ subtotal, total });
	},
}));
