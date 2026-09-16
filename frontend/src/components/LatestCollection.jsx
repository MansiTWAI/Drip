import React, { useContext, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const LatestCollection = ({ 
  title = "The Best Dress For The Best Woman",
  count = 4 
}) => {
  const { products = [], isProductsLoading } = useContext(ShopContext);
  const navigate = useNavigate();

  // Get the most recently added products
  const latestProducts = useMemo(() => {
    if (!products?.length) return [];
    return [...products]
      .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
      .slice(0, count);
  }, [products, count]);

  // Navigate to Collection
  const goToCollection = () => navigate('/collection?sort=newest');

  // Check loading state
  const isLoading = isProductsLoading;

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Heading */}
        <div className="mb-8 md:mb-10">
          <h2
            className="text-[#11110f] uppercase"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              fontSize: 'clamp(32px, 5.5vw, 72px)',
              lineHeight: '1.15',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h2>
          <p className="mt-3 max-w-md text-sm text-black/55">New silhouettes, considered textures, zero filler.</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-7 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: count }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-stone-100 rounded mb-4" />
                <div className="h-4 w-3/5 bg-stone-200 rounded mb-2" />
                <div className="h-5 w-4/5 bg-stone-200 rounded" />
              </div>
            ))
          ) : latestProducts.length > 0 ? (
            latestProducts.map((product) => (
              <ProductItem
                key={product._id}
                id={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-12">
              No products available yet.
            </p>
          )}
        </div>

        {/* See More Button */}
        <div className="mt-10 md:mt-12 flex justify-start">
          <button
            onClick={goToCollection}
            className="
              flex items-center gap-3 px-8 py-3.5 
              rounded-full bg-[#11110f] text-white
              text-[13px] font-bold uppercase tracking-[0.18em]
              hover:bg-[#c7ff4a] hover:text-black active:scale-[0.98]
              transition-all duration-300
              min-w-[180px]
            "
          >
            <span>See More</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;
