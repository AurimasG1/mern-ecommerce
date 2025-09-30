import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import useProductStore from '../stores/useProductStore.js';
import { categoriesHome } from '../data/categories.js'


const CreateProductForm = () => {

    const fileInputRef = useRef(null);

    const { createProduct, loading } = useProductStore()

    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        countInStock: '',
        image: "",
        isFeatured: false,
    });

    const [imageInputMode, setImageInputMode] = useState('upload');

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createProduct(newProduct);
            setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                countInStock: '',
                image: "",
                isFeatured: false,
            })
        } catch (error) {
            const message =
                error.response?.data?.error || // if backend sends a clear message
                error.message ||               // network or Axios error
                'Error creating a product';    // fallback

            toast.error(message);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };

            reader.readAsDataURL(file); // base64
        }
    };

    const handleCancelImage = () => {
        setNewProduct({ ...newProduct, image: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // reset input value
        }
    };


    return (
        <motion.div className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                        Product Name
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
                        required
                        autoComplete='name'
                    />
                </div>
                <div>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
                        Description
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows='3'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-300'>
                        Price
                    </label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step='0.01'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='category' className='block text-sm font-medium text-gray-300'>
                        Category
                    </label>
                    <select
                        id='category'
                        name='category'
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    >
                        <option value=''>Select a category</option>
                        {categoriesHome.map((category) => (
                            <option key={category.name} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor='countInStock' className='block text-sm font-medium text-gray-300'>
                        Count in stock
                    </label>
                    <input
                        type='number'
                        id='countInStock'
                        name='countInStock'
                        value={newProduct.countInStock}
                        onChange={(e) => setNewProduct({ ...newProduct, countInStock: e.target.value })}
                        step='1'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
                        required
                    />
                </div>
                <div className='flex items-center space-x-2'>
                    <label htmlFor='isFeatured' className="text-sm font-medium text-gray-300 cursor-pointer">
                        Feature
                    </label>
                    <input
                        type='checkbox'
                        id='isFeatured'
                        name='isFeatured'
                        checked={newProduct.isFeatured}
                        onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                        className="h-4 w-4 text-emerald-500 border-gray-600 rounded focus:ring-emerald-500"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Add an image
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="imageMode"
                                value="upload"
                                checked={imageInputMode === "upload"}
                                onChange={() => {
                                    setImageInputMode("upload");
                                    setNewProduct({ ...newProduct, image: "" });
                                }}
                            />
                            <span className="text-gray-300">Upload</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="imageMode"
                                value="link"
                                checked={imageInputMode === "link"}
                                onChange={() => {
                                    setImageInputMode("link");
                                    setNewProduct({ ...newProduct, image: "" });
                                }}
                            />
                            <span className="text-gray-300">Link</span>
                        </label>
                    </div>
                </div>
                {imageInputMode === "upload" ? (
                    <div className="mt-1 flex items-center">
                        <input
                            type="file"
                            id="image"
                            ref={fileInputRef}
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <label
                            htmlFor="image"
                            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            <Upload className="h-5 w-5 inline-block mr-2" />
                            Upload Image
                        </label>
                        {newProduct.image && (
                            <>
                                <span className="ml-3 text-sm text-gray-400">Image uploaded</span>
                                <button
                                    type="button"
                                    onClick={handleCancelImage}
                                    className="ml-3 text-sm text-red-400 hover:text-red-600"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div>
                        <label htmlFor="imageLink" className="block text-sm font-medium text-gray-300">
                            Image URL
                        </label>
                        <input
                            type="url"
                            id="imageLink"
                            name="imageLink"
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                )}

                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Product
                        </>
                    )}
                </button>

            </form>


        </motion.div>
    )
}

export default CreateProductForm