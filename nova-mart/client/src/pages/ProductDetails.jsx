import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  Share2,
  Check,
  Star,
  MessageSquarePlus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';
import Rating from '../components/Rating';
import Modal from '../components/Modal';
import { FullPageLoader } from '../components/Loader';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review Submission Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id);
        if (res.success) {
          setProduct(res.product);
          setReviews(res.reviews || []);
          setActiveImageIndex(0);
          if (res.product.colors && res.product.colors.length > 0) {
            setSelectedColor(res.product.colors[0]);
          }
          if (res.product.sizes && res.product.sizes.length > 0) {
            setSelectedSize(res.product.sizes[0]);
          }
        }
      } catch (err) {
        toast.error('Failed to load product details');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, navigate]);

  if (loading || !product) {
    return <FullPageLoader message="Loading product details..." />;
  }

  const isFavorited = isInWishlist(product._id);
  const inStock = product.stock > 0;
  const images = product.images && product.images.length > 0 ? product.images : ['https://placehold.co/800x800'];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast.error('Please enter a review headline and comment.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await productService.createReview(product._id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.success) {
        toast.success('Review posted successfully!');
        setReviews([res.review, ...reviews]);
        setProduct({
          ...product,
          rating: res.productRating,
          numReviews: res.numReviews,
        });
        setReviewModalOpen(false);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Review Distribution calculation
  const totalReviewCount = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = totalReviewCount > 0 ? Math.round((count / totalReviewCount) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb navigation */}
      <nav className="text-xs text-slate-400 flex items-center gap-2">
        <Link to="/" className="hover:text-slate-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-slate-700">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-700">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery Column (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-subtle">
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-full shadow-sm">
                {product.discount}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-sm ${
                isFavorited
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white'
              }`}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-primary-600 ring-2 ring-primary-100 scale-95'
                      : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Info Column (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                {product.brand}
              </span>
              <button
                onClick={handleShare}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 p-1 rounded-lg"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews anchor */}
            <div className="flex items-center gap-4 mt-3">
              <Rating value={product.rating || 0} numReviews={product.numReviews || 0} size="md" />
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-primary-600 hover:underline"
              >
                Read verified reviews
              </button>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-base text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Save {product.discount}%
              </span>
            )}
            <span className="text-xs text-slate-400 ml-auto">Inclusive of all taxes</span>
          </div>

          {/* Short description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Color: <span className="font-semibold text-primary-600 ml-1">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-100'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Size / Variant: <span className="font-semibold text-primary-600 ml-1">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-100'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Stock Status */}
          <div className="flex items-center gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Quantity
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Inventory
              </label>
              {inStock ? (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700">
                    In Stock ({product.stock} units available)
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                  Currently Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs: Add to Cart, Buy Now */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-primary-600 text-white font-bold text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-slate-900"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO CART</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 py-3.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-primary-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>BUY NOW</span>
            </button>
          </div>

          {/* Shipping Highlights */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-5 h-5 text-primary-600 mb-1" />
              <span className="text-xs font-bold text-slate-800">Free Delivery</span>
              <span className="text-[10px] text-slate-400">On orders ₹999+</span>
            </div>
            <div className="flex flex-col items-center border-x border-slate-200">
              <RefreshCw className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-xs font-bold text-slate-800">7-Day Return</span>
              <span className="text-[10px] text-slate-400">Easy replacement</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-sky-600 mb-1" />
              <span className="text-xs font-bold text-slate-800">Secure Payment</span>
              <span className="text-[10px] text-slate-400">100% Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <section id="product-tabs" className="pt-8 border-t border-slate-100">
        <div className="flex border-b border-slate-200 gap-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'description'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'specifications'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'description' && (
          <div className="py-6 max-w-3xl space-y-4 text-sm text-slate-600 leading-relaxed animate-fade-in">
            <p>{product.description}</p>
            <p>
              Every unit undergoes strict quality control and verification to ensure top-notch performance. Built with sustainable, high-grade components designed to withstand daily use.
            </p>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === 'specifications' && (
          <div className="py-6 max-w-2xl animate-fade-in">
            {product.specifications && product.specifications.length > 0 ? (
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex px-4 py-3 text-xs sm:text-sm">
                    <span className="w-1/3 font-semibold text-slate-500">{spec.key}</span>
                    <span className="w-2/3 font-medium text-slate-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No technical specifications listed for this item.</p>
            )}
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-6 space-y-8 animate-fade-in">
            {/* Review Summary Breakdown */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Overall Score */}
              <div className="md:col-span-4 text-center md:text-left space-y-2">
                <span className="text-5xl font-black text-slate-900 block font-mono">
                  {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
                </span>
                <Rating value={product.rating || 5} showText={false} size="md" />
                <p className="text-xs text-slate-500">
                  Based on {reviews.length} verified ratings
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error('Please login to write a review');
                        navigate('/login');
                        return;
                      }
                      setReviewModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-primary-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Write a Review</span>
                  </button>
                </div>
              </div>

              {/* Bar Distributions */}
              <div className="md:col-span-8 space-y-2">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-slate-600 font-semibold">{dist.stars} star</span>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-400">{dist.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Verified Buyer Reviews</h3>
              {reviews.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                            <Check className="w-3 h-3" /> Verified Purchase
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <Rating value={rev.rating} showText={false} size="xs" />
                      <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No customer reviews yet. Be the first to review this product!
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Review Submission Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write a Customer Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Overall Rating
            </label>
            <Rating
              value={reviewRating}
              interactive={true}
              onRatingChange={(newVal) => setReviewRating(newVal)}
              size="md"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Review Headline
            </label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="e.g. Worth every rupee! Outstanding quality."
              required
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Review
            </label>
            <textarea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What did you like or dislike about this product? How did it fit your expectations?"
              required
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2 bg-slate-900 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductDetails;
