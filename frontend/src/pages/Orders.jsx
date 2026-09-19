import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import TrackOrder from '../components/TrackOrder';
import { assets } from '../assets/assets';
import { Star, X } from 'lucide-react';

const Orders = () => {
  const { backendUrl, token, currency, navigate, handleCancelOrder } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingItem, setTrackingItem] = useState(null);
  const [filter, setFilter] = useState('All');

  // Modal States
  const [showCancelCard, setShowCancelCard] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewDescription, setReviewDescription] = useState('');
  const [reviewByProduct, setReviewByProduct] = useState({});
  const [savingReview, setSavingReview] = useState(false);

  const loadOrderData = async (silent = false) => {
    if (!token) {
      toast.warning("Please login to view orders");
      setLoading(false);
      return;
    }
    try {
      if (!silent) setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const allItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allItems.push({
              ...item,
              status: order.status,
              paymentMethod: order.paymentMethod || '—',
              estimatedDelivery: order.estimatedDelivery || 'Processing',
              date: order.date,
              orderId: order._id,
              displayPrice: item.finalPrice ?? item.price,
            });
          });
        });
        allItems.sort((a, b) => b.date - a.date);
        setOrderData(allItems);
        try {
          const reviewResponse = await axios.get(`${backendUrl}/api/review/mine`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (reviewResponse.data.success) {
            setReviewByProduct(Object.fromEntries(reviewResponse.data.reviews.map((review) => [String(review.productId), review])));
          }
        } catch (reviewError) {
          console.warn('Could not load saved reviews.', reviewError?.message);
        }
      } else {
        toast.error(response.data.message || "No orders found");
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      if (!silent) toast.error("Could not load orders");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
    const interval = setInterval(() => { loadOrderData(true); }, 15000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (trackingItem) {
      const updatedItem = orderData.find(
        item => item.orderId === trackingItem.orderId && item.productId === trackingItem.productId
      );
      if (updatedItem) setTrackingItem(updatedItem);
    }
  }, [orderData]);

  const filteredData = orderData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !['Delivered', 'Cancelled'].includes(item.status);
    return item.status === filter;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  // Cancellation Handlers
  const openCancelModal = (orderId) => {
    setSelectedOrder(orderId);
    setShowCancelCard(true);
  };

  const confirmCancel = () => {
    handleCancelOrder(selectedOrder, loadOrderData);
    setShowCancelCard(false);
  };

  const openReviewModal = (item) => {
    const existing = reviewByProduct[String(item.productId)];
    setReviewItem(item);
    setReviewRating(existing?.rating || 5);
    setReviewDescription(existing?.description || '');
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (reviewDescription.trim().length < 10) {
      toast.error('Please write at least 10 characters about your experience');
      return;
    }
    try {
      setSavingReview(true);
      const response = await axios.post(`${backendUrl}/api/review/save`, {
        productId: reviewItem.productId,
        orderId: reviewItem.orderId,
        rating: reviewRating,
        description: reviewDescription.trim(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        setReviewByProduct((current) => ({ ...current, [String(reviewItem.productId)]: response.data.review }));
        toast.success(response.data.message);
        setReviewItem(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to publish your review');
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#8B4513]/20 border-t-[#8B4513] rounded-full animate-spin"></div>
        <p className="text-[#8B4513] mt-4 font-medium animate-pulse">Fetching your orders...</p>
      </div>
    );
  }

  if (trackingItem) {
    return (
      <TrackOrder
        order={trackingItem}
        currency={currency}
        onBack={() => {
          setTrackingItem(null);
          loadOrderData(true);
        }}
      />
    );
  }

  return (
    <div className="bg-[#faf7f5] min-h-screen pb-20 relative">

      {reviewItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="review-title">
          <form onSubmit={submitReview} className="relative w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl sm:p-9">
            <button type="button" onClick={() => setReviewItem(null)} aria-label="Close review form" className="absolute right-5 top-5 rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"><X size={19} /></button>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8B4513]">Verified purchase</p>
            <h2 id="review-title" className="mt-2 pr-10 font-serif text-3xl text-[#3d2b1f]">Review your {reviewItem.name}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">Tell the Drip community about the fit, fabric, quality, and how the piece felt to wear.</p>

            <fieldset className="mt-7">
              <legend className="text-xs font-bold uppercase tracking-wider text-stone-600">Your rating</legend>
              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)} aria-label={`${star} star rating`} className="rounded-lg p-1 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B4513]">
                    <Star size={30} className={star <= reviewRating ? 'fill-[#8B4513] text-[#8B4513]' : 'fill-stone-100 text-stone-300'} />
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-stone-600" htmlFor="review-description">Your review</label>
            <textarea id="review-description" value={reviewDescription} onChange={(event) => setReviewDescription(event.target.value)} maxLength={1000} rows={5} placeholder="The fit was true to size and the fabric…" className="mt-3 w-full resize-none rounded-2xl border border-stone-200 bg-[#faf7f5] p-4 text-sm leading-6 outline-none transition focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10" />
            <div className="mt-2 flex justify-between text-xs text-stone-400"><span>Minimum 10 characters</span><span>{reviewDescription.length}/1000</span></div>
            <button disabled={savingReview} className="mt-6 w-full rounded-xl bg-[#8B4513] py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-[#8B4513]/15 transition hover:bg-[#6F370F] disabled:cursor-wait disabled:opacity-60">{savingReview ? 'Publishing…' : reviewByProduct[String(reviewItem.productId)] ? 'Update review' : 'Publish review'}</button>
          </form>
        </div>
      )}

      {/* CANCELLATION CARD UI */}
    {showCancelCard && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center px-6">
    {/* Soft backdrop */}
    <div 
      className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      onClick={() => setShowCancelCard(false)}
    ></div>

    {/* Minimal White Card */}
    <div className="relative bg-white p-8 sm:p-10 rounded-[1.5rem] shadow-2xl max-w-sm w-full text-center border border-stone-100 transform transition-all animate-in fade-in zoom-in-95 duration-300">
      
      {/* Functional Cross Icon (Top Right) */}
      <button 
        onClick={() => setShowCancelCard(false)}
        className="absolute top-4 right-4 p-2 text-stone-300 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative z-10 pt-2">
        {/* Simple Warning Circle */}
        <div className="mb-6 flex justify-center">
          <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
            <svg className="w-6 h-6 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-stone-800 mb-2">
          Cancel Order
        </h2>
        
        <p className="text-stone-500 text-sm leading-relaxed mb-8 px-2">
          Are you sure you want to cancel this item? This action cannot be undone.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={confirmCancel} 
            className="w-full bg-[#8B4513] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F370F] transition-all active:scale-[0.98] shadow-md shadow-[#8B4513]/20"
          >
            Confirm Cancellation
          </button>
          
          <button 
            onClick={() => setShowCancelCard(false)} 
            className="w-full bg-transparent text-stone-400 py-2 rounded-xl text-xs font-medium hover:text-stone-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="text-2xl">
            <Title text1="MY" text2="ORDERS" />
          </div>

          {/* FILTER TABS UI */}
          <div className="flex bg-white p-1 rounded-2xl border border-[#8B4513]/10 shadow-sm overflow-x-auto no-scrollbar">
            {['All', 'Active', 'Delivered', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  filter === tab 
                  ? 'bg-[#8B4513] text-white shadow-md shadow-[#8B4513]/20' 
                  : 'text-gray-400 hover:text-[#8B4513]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#8B4513]/20 shadow-sm">
            <div className="bg-[#faf7f5] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#8B4513]/30">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <p className="text-xl font-serif text-[#3d2b1f]">No {filter !== 'All' ? filter.toLowerCase() : ''} orders found</p>
            <button onClick={() => navigate('/collection')} className="mt-6 bg-[#8B4513] text-white px-8 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((item, index) => {
              const isDelivered = item.status === 'Delivered';
              const isCancelled = item.status === 'Cancelled';

              return (
                <div
                  key={`${item.orderId}-${item.productId || index}`}
                  className={`relative overflow-hidden group border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                    isCancelled ? 'border-red-100 opacity-80' : 'border-[#8B4513]/5'
                  }`}
                >
                  <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-bold uppercase tracking-tighter rounded-bl-xl z-10 ${
                    isDelivered ? 'bg-[#8B4513]/10 text-[#6f452c]' :
                    isCancelled ? 'bg-rose-50 text-rose-500' :
                    'bg-[#8B4513]/10 text-[#8B4513]'
                  }`}>
                    {item.status}
                  </div>

                  <div className="w-full sm:w-32 h-40 sm:h-32 bg-[#faf7f5] rounded-xl overflow-hidden flex-shrink-0 border border-[#8B4513]/5">
                    <img
                      src={Array.isArray(item.image) ? item.image[0] : item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => (e.target.src = assets.parcel_icon || '')}
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-[#3d2b1f]">{item.name}</h4>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-lg font-bold text-[#8B4513]">
                        {currency}{Number(item.displayPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-400 text-sm">Qty: {item.quantity}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-10 text-xs text-gray-500">
                      <p><span className="font-semibold text-gray-400 mr-2 uppercase tracking-tighter">Ordered:</span>{formatDate(item.date)}</p>
                      <p><span className="font-semibold text-gray-400 mr-2 uppercase tracking-tighter">Delivery:</span>{item.estimatedDelivery}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-3 sm:min-w-[160px]">
                    <button
                      onClick={() => setTrackingItem(item)}
                      className="w-full bg-white border border-[#8B4513]/20 text-[#8B4513] py-2.5 rounded-xl text-xs font-bold hover:bg-[#8B4513] hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      Track Order
                    </button>

                    {!isDelivered && !isCancelled && ['Order Placed', 'Confirmed', 'Packing', 'Shipped'].includes(item.status) && (
                      <button
                        onClick={() => openCancelModal(item.orderId)}
                        className="w-full bg-rose-50 text-rose-500 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                      >
                        Cancel Item
                      </button>
                    )}
                    {isDelivered && (
                      <button onClick={() => openReviewModal(item)} className="w-full rounded-xl bg-[#8B4513] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#6F370F] active:scale-95">
                        {reviewByProduct[String(item.productId)] ? 'Edit Review' : 'Rate & Review'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
