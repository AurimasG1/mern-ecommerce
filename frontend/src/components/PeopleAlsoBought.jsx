import { useEffect, useState } from 'react';
import useProductStore from '../stores/useProductStore.js';
import ProductCard from './ProductCard.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import toast from 'react-hot-toast'
import axios from '../lib/axios.js';


const PeopleAlsoBought = () => {
    const { recommendations, fetchRecommendations, loading } = useProductStore();
    // const [recommendations, setRecommendations] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations])

    // useEffect(() => {
    //     const fetchRecommendations = async () => {
    //         try {
    //             const res = await axios.get('/products/recommendations')
    //             setRecommendations(res.data);
    //         } catch (error) {
    //             console.log(error)
    //             toast.error("Error in fetching recommendations")
    //         } finally {
    //             setIsLoading(false)
    //         }
    //     }
    //     fetchRecommendations();
    // }, [])

    // if (isLoading) return <LoadingSpinner />
    if (loading) return <LoadingSpinner />

    return (
        <div className='mt-8'>
            <h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-col-3'>
                {recommendations.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default PeopleAlsoBought