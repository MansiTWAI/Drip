import React, { useContext, useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BadgeCheck, Heart, MessageSquare, Star } from 'lucide-react';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, isProductsLoading, addToCart, getPriceDisplay, isWishlisted, toggleWishlist, backendUrl } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [reviews, setReviews] = useState({ average: 0, count: 0, breakdown: [], reviews: [] });
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const fetchProductData = () => {
    const item = products.find((product) => product._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
      setIsAdded(false);
    }
  }, [productId, products]);

  useEffect(() => {
    let active = true;
    const loadReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/review/product/${productId}`);
        if (active && response.data.success) setReviews(response.data);
      } catch (error) {
        console.warn('Reviews are temporarily unavailable.', error?.message);
      } finally {
        if (active) setReviewsLoading(false);
      }
    };
    loadReviews();
    return () => { active = false; };
  }, [backendUrl, productId]);

  const scrollToReviews = () => {
    document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddToCart = () => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }
    addToCart(productData._id, size);
    setIsAdded(true);
  };

  if (isProductsLoading && !productData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/45">Product unavailable</p>
        <h1 className="font-serif text-4xl">This piece has left the drop.</h1>
        <button onClick={() => navigate('/collection')} className="rounded-full bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">
          Shop the collection
        </button>
      </div>
    );
  }

  const { sale, mrp, discountText, hasDiscount } = getPriceDisplay(productData);
  const wishlisted = isWishlisted(productData._id);

  return (
    <div className="pt-8 pb-20 transition-opacity ease-in duration-500 opacity-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Product Main Section */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto gap-3 lg:w-24 lg:max-h-[500px]">
            {productData.image.map((img, index) => (
              <img
                key={index}
                onClick={() => setImage(img)}
                src={img}
                alt={`${productData.name} - view ${index + 1}`}
                className={`w-20 lg:w-full aspect-square object-cover cursor-pointer rounded-md border-2 transition-all ${
                  image === img ? 'border-black' : 'border-transparent hover:border-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex-1 relative">
            <img
              className="w-full h-auto rounded-lg shadow-lg object-cover max-h-[600px]"
              src={image}
              alt={productData.name}
            />
            {/* Wishlist Heart */}
            <button
              onClick={() => toggleWishlist(productData._id)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 shadow-md transition-all hover:scale-110"
            >
              <Heart
                size={22}
                className={wishlisted ? 'fill-black text-black' : 'text-gray-400 hover:text-black'}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-3xl lg:text-4xl mt-2">{productData.name}</h1>

          <button onClick={scrollToReviews} className="mt-3 flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B4513]">
            <span className="flex items-center gap-0.5" aria-label={`${reviews.average || 0} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} className={star <= Math.round(reviews.average) ? 'fill-[#8B4513] text-[#8B4513]' : 'fill-stone-100 text-stone-300'} />
              ))}
            </span>
            <span className="text-sm font-semibold text-stone-800">{reviews.count ? reviews.average.toFixed(1) : 'New'}</span>
            <span className="text-sm text-stone-500 underline underline-offset-4">{reviews.count} {reviews.count === 1 ? 'review' : 'reviews'}</span>
          </button>

          <div className="mt-6 flex items-baseline gap-4">
            <p className="text-4xl font-semibold text-black">{sale}</p>
            {hasDiscount && (
              <>
                <p className="text-2xl text-gray-500 line-through">{mrp}</p>
                <span className="text-lg font-medium text-[#6f452c] bg-[#8b5e3c]/10 px-3 py-1 rounded">
                  {discountText}
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-gray-600 md:w-5/6 leading-relaxed">{productData.description}</p>

          <div className="mt-8">
            <p className="font-medium mb-3">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {productData.sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => { setSize(item); setIsAdded(false); }}
                  className={`min-w-12 py-2 px-4 border rounded-md text-sm font-medium transition-colors ${
                    size === item
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Flipped Add to Cart / Go to Cart Button */}
          <div className="mt-8">
            {!isAdded ? (
              <button
                onClick={handleAddToCart}
                disabled={!size}
                className={`group relative overflow-hidden w-full sm:w-[280px] h-[56px] flex items-center justify-center rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  size 
                      ? 'bg-[#6f452c] text-white hover:bg-[#4c2f20] shadow-lg shadow-[#6f452c]/15 active:scale-95'
                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Cart
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/cart')}
                className="w-full sm:w-[280px] h-[56px] flex items-center justify-center gap-3 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:bg-black shadow-xl shadow-black/10 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <span className="flex items-center gap-2">
                  View in Cart
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            )}
          </div>

          <hr className="my-8 border-gray-200 sm:w-4/5" />

          <div className="text-sm text-gray-500 space-y-2">
            <p>✓ 100% Original Product</p>
            <p>✓ Cash on Delivery available</p>
            <p>↩ Easy return & exchange within 7 days</p>
          </div>
        </div>
      </div>

      <section id="customer-reviews" className="mt-20 scroll-mt-24 rounded-[2rem] border border-[#8B4513]/10 bg-[#faf7f5] p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-3 border-b border-[#8B4513]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8B4513]">Verified community</p>
            <h2 className="mt-2 font-serif text-3xl text-[#3d2b1f]">Customer reviews</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-stone-500">Only customers with a delivered Drip order can publish a rating and written review.</p>
        </div>

        <div className="grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#8B4513]/5">
            <div className="flex items-end gap-2">
              <span className="font-serif text-5xl text-[#3d2b1f]">{reviews.count ? reviews.average.toFixed(1) : '—'}</span>
              <span className="pb-1 text-sm text-stone-400">out of 5</span>
            </div>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} className={star <= Math.round(reviews.average) ? 'fill-[#8B4513] text-[#8B4513]' : 'fill-stone-100 text-stone-300'} />)}
            </div>
            <p className="mt-2 text-xs text-stone-500">Based on {reviews.count} verified {reviews.count === 1 ? 'purchase' : 'purchases'}</p>
            <div className="mt-6 space-y-2.5">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.breakdown.find((row) => row.rating === rating)?.count || 0;
                const percent = reviews.count ? (count / reviews.count) * 100 : 0;
                return <div key={rating} className="flex items-center gap-2 text-xs text-stone-500"><span className="w-3">{rating}</span><Star size={12} className="fill-[#8B4513] text-[#8B4513]" /><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-[#8B4513]" style={{ width: `${percent}%` }} /></div><span className="w-5 text-right">{count}</span></div>;
              })}
            </div>
          </aside>

          <div className="space-y-4">
            {reviewsLoading ? (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-stone-500">Loading customer reviews…</div>
            ) : reviews.reviews.length ? reviews.reviews.map((review) => (
              <article key={review._id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#8B4513]/5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="font-semibold text-[#3d2b1f]">{review.userName}</p><p className="mt-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8B4513]"><BadgeCheck size={14} /> Verified purchase</p></div>
                  <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>{[1,2,3,4,5].map((star) => <Star key={star} size={15} className={star <= review.rating ? 'fill-[#8B4513] text-[#8B4513]' : 'fill-stone-100 text-stone-300'} />)}</div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-600">{review.description}</p>
                <time className="mt-4 block text-xs text-stone-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
              </article>
            )) : (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#8B4513]/20 bg-white p-8 text-center"><MessageSquare className="text-[#8B4513]/40" size={32} /><h3 className="mt-3 font-serif text-xl text-[#3d2b1f]">Be the first to review this piece</h3><p className="mt-2 max-w-sm text-sm text-stone-500">After delivery, open My Orders to share your fit, quality, and styling experience.</p></div>
            )}
          </div>
        </div>
      </section>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
