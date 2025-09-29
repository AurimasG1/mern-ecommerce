import { motion } from 'framer-motion';
import { Trash, Star } from 'lucide-react';
import useProductStore from '../stores/useProductStore.js';
import { categories } from '../data/categories';

const ProductsList = () => {
    const { deleteProduct, products, updateProduct } = useProductStore();
    console.log(products)

    const handleInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }
    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <table className=' min-w-full divide-y divide-gray-700'>
                <thead className='bg-gray-700'>
                    <tr>
                        <th
                            scope='col'
                            className='px-1 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Product
                        </th>
                        <th
                            scope='col'
                            className='px-1 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Price
                        </th>
                        <th
                            scope='col'
                            className='px-1 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Category
                        </th>
                        <th
                            scope='col'
                            className='px-1 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Count in stock
                        </th>
                        <th
                            scope='col'
                            className='px-1 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Featured
                        </th>
                        <th
                            scope='col'
                            className='px-1 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className='bg-gray-800 divide-y divide-gray-700'>
                    {products?.map((product) => (
                        <tr key={product._id} className='hover:bg-gray-700'>
                            {/* Product image + name */}
                            <td className='px-1 py-4 whitespace-nowrap overflow-visible'>
                                <div className='flex items-center'>
                                    {/* Image with hover overlay */}

                                    <label className="relative flex-shrink-0 h-18 w-18 cursor-pointer group">
                                        <img
                                            className="h-18 w-18 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
                                            src={product.image}
                                            alt={product.name}
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs px-1 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                                            Change image
                                        </div>
                                        <input
                                            type='file'
                                            accept='image/*'
                                            className='hidden'
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                const reader = new FileReader();
                                                reader.onloadend = async () => {
                                                    const base64Image = reader.result;
                                                    await updateProduct(product._id, { image: base64Image });
                                                };
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                    </label>
                                    {/* Editable name */}
                                    <div className='ml-2 flex-1'>
                                        <textarea
                                            defaultValue={product.name}
                                            rows={1}
                                            onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
                                            onInput={handleInput}
                                            onBlur={e => updateProduct(product._id, { name: e.target.value })}
                                            className="w-full p-1 text-sm border border-gray-600 rounded resize-none overflow-hidden focus:outline-none focus:ring-1 focus:ring-blue-500 hover:bg-gray-700 transition-colors"
                                        />
                                    </div>
                                </div>
                            </td>

                            {/* Price */}
                            <td className='px-1 py-4 whitespace-nowrap'>
                                <input
                                    type='number'
                                    step='0.01'
                                    defaultValue={product.price}
                                    className='w-20 p-1 text-sm border rounded'
                                    onBlur={e => updateProduct(product._id, { price: parseFloat(e.target.value) })}
                                    onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
                                />
                            </td>

                            {/* Category */}
                            <td className='px-1 py-4 whitespace-nowrap'>
                                <select
                                    value={product.category}
                                    className='w-24 p-1 text-sm border rounded'
                                    onChange={e => updateProduct(product._id, { category: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option className='bg-gray-700' key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </td>

                            {/* Count in stock */}
                            <td className='px-1 py-4 whitespace-nowrap'>
                                <input
                                    type='number'
                                    defaultValue={product.countInStock}
                                    className='w-20 p-1 text-sm border rounded'
                                    onBlur={e => updateProduct(product._id, { countInStock: Number(e.target.value) })}
                                    onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
                                />
                            </td>

                            {/* Featured */}
                            <td className='px-1 py-4 whitespace-nowrap'>
                                <button
                                    onClick={() => updateProduct(product._id, { isFeatured: !product.isFeatured })}
                                    className={`p-1 rounded-full ${product.isFeatured ? 'bg-yellow-400 text-gray-900' : 'bg-gray-600 text-gray-300'} hover:bg-yellow-500 transition-colors duration-200`}
                                >
                                    <Star className='h-5 w-5' />
                                </button>
                            </td>

                            {/* Actions */}
                            <td className='px-1 py-4 whitespace-nowrap text-sm font-medium'>
                                <button
                                    onClick={() => deleteProduct(product._id)}
                                    className='text-red-400 hover:text-red-300'
                                >
                                    <Trash className='h-5 w-5' />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    )
}

export default ProductsList;