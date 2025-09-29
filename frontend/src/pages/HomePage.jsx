import { useEffect } from 'react';
import CategoryItem from '../components/CategoryItem.jsx';
import { categoriesHome } from '../data/categories.js';
import useProductStore from '../stores/useProductStore.js';
import FeaturedProducts from '../components/FeaturedProducts.jsx';

const HomePage = () => {

    const { fetchFeaturedProducts, products, isLoading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts()
    }, [fetchFeaturedProducts])
    return (
        <div className='relative min-h-screen text-white overflow-hidden'>
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>Explore Our Categories</h1>
                <p className='text-center text-xl text-gray-300 mb-12'>Discover the latest trensds in eco-friendly fashion</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {categoriesHome.map(category => (
                        <CategoryItem category={category} key={category.name} />
                    ))}
                </div>
            </div>
            {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
        </div>
    )
}

export default HomePage