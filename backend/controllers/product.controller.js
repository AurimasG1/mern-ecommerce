import Product from '../models/product.model.js';
import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products {}
		res.json({ products });
	} catch (error) {
		console.log('Error in getAllProducts controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get('featured_products');
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: 'No featured products found' });
		}

		// store in redis for future quick access

		await redis.set('featured_products', JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log('Error in getFeaturedProducts controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category, countInStock, isFeatured } =
			req.body;

		if (!name || !description || !price || !category || !image) {
			return res
				.status(400)
				.json({ error: 'All fields including image are required' });
		}

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, {
				folder: 'products',
			});
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '',
			category,
			countInStock,
			isFeatured,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log('Error in createProduct controller', error.message);
		res.status(500).json({ message: 'Server errror', error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		if (product.image) {
			const publicId = product.image.split('/').pop().split('.')[0]; // this will get the id of the image
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log('deleted image from cloudinary');
			} catch (error) {
				console.log('error deleting image from cloudinary', error);
			}
		}

		// Delete product from DB
		await Product.findByIdAndDelete(req.params.id);

		// Refresh featured products cache if the deleted one was featured
		if (product.isFeatured) {
			await updateFeatureProductsCache();
		}

		res.json({ message: 'Product deleted succesfully' });
	} catch (error) {
		console.log('Error in deleteProduct controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);
		res.json(products);
	} catch (error) {
		console.log('Error in getRecommendedProducts controller', error.message);
		res.status(500).json({ message: 'Server errror', error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log('Error in getProductsByCategory controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeatureProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: 'Product not found' });
		}
	} catch (error) {
		console.log('Error in toggleFeaturedProduct controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}
		if (req.body.image) {
			// Extract public ID from current product.image URL if it exists
			if (product.image) {
				const publicId = product.image.split('/').slice(-2).join('/').split('.')[0]; // adjust depending on your folder structure
				await cloudinary.uploader.destroy(publicId);
			}

			// Upload the new image
			const cloudinaryResponse = await cloudinary.uploader.upload(req.body.image, {
				folder: 'products',
			});
			req.body.image = cloudinaryResponse.secure_url;
		}

		Object.assign(product, req.body);

		const updatedProduct = await product.save();

		if (req.body.isFeatured !== undefined) {
			await updateFeatureProductsCache();
		}

		res.json(updatedProduct);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Failed to update product' });
	}
};

async function updateFeatureProductsCache() {
	try {
		// the lean() method is used to return plain javascript objects instead of full Mongoose documents. This can significantly improve performance
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set('featured_products', JSON.stringify(featuredProducts));
	} catch (error) {
		console.log('Error in updateFeatureProductsCache', error.message);
		res.status(500).json({ message: 'Server errror', error: error.message });
	}
}
