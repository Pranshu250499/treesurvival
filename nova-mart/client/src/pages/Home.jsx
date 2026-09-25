import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, Tag, ShieldCheck, Zap } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { ProductSkeleton } from '../components/Loader';
import Modal from '../components/Modal';
import Rating from '../components/Rating';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { addToCart } = useCart();

  // Dynamic Countdown Timer for Mega Deals
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 18,
    minutes: 42,
    seconds: 32,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial home page data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, featRes, trendRes] = await Promise.all([
          productService.getCategories(),
          productService.getProducts({ featured: 'true', limit: 8 }),
          productService.getProducts({ trending: 'true', limit: 8 }),
        ]);

        if (catRes.success) setCategories(catRes.categories);
        if (featRes.success) setFeaturedProducts(featRes.products);
        if (trendRes.success) setTrendingProducts(trendRes.products);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Premium Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                SHOP SMART. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700">
                  LIVE BETTER.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover products designed for your everyday life. High quality electronics, tailored fashion, and modern home essentials with pan-India fast delivery.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-7 py-3.5 bg-slate-900 hover:bg-primary-600 text-white text-sm font-semibold rounded-2xl transition-all shadow-md hover:shadow-primary-500/25 flex items-center gap-2 group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/shop?discount=20"
                  className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-2xl border border-slate-200 transition-all shadow-subtle hover:border-slate-300 flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-rose-500" />
                  <span>Explore Deals</span>
                </Link>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-600" />
                  <span>Express Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">4.9 / 5</span>
                  <span>Customer Trust</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background blur glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-indigo-400 rounded-3xl opacity-20 blur-2xl pointer-events-none" />

                <div className="relative rounded-3xl overflow-hidden shadow-float border border-white/50 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
                    alt="Premium Lifestyle Electronics"
                    className="w-full h-[400px] object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                        Spotlight Product
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        Sony WH-1000XM5 ANC
                      </h4>
                      <p className="text-xs font-extrabold text-slate-900">₹29,999</p>
                    </div>
                    <Link
                      to="/shop?keyword=Sony"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-primary-600 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Explore Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 group"
          >
            <span>Browse all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category._id || category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* 3. TRENDING NOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Most Popular This Week
            </h2>
          </div>
          <Link
            to="/shop?sort=rating"
            className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 group"
          >
            <span>See full trending list</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. MEGA DEALS BANNER WITH LIVE COUNTDOWN TIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-float">
          {/* Background subtle radial glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="inline-block px-3 py-1 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                Limited Time Flash Offer
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                MEGA DEALS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-300 to-primary-300">
                  Up to 60% OFF
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Save massively on selected flagship headphones, luxury timepieces, athletic shoes, and designer home items.
              </p>

              <div className="pt-2">
                <Link
                  to="/shop?discount=25"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 hover:bg-primary-500 hover:text-white font-bold text-sm rounded-2xl transition-all shadow-md"
                >
                  <span>View Deals</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Live Countdown Display */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">
                Offer Ends In
              </span>
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 min-w-[64px] sm:min-w-[80px] border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black font-mono block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase mt-1 block">
                    Days
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 min-w-[64px] sm:min-w-[80px] border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black font-mono block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase mt-1 block">
                    Hours
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 min-w-[64px] sm:min-w-[80px] border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black font-mono block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase mt-1 block">
                    Mins
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 min-w-[64px] sm:min-w-[80px] border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-rose-400 block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase mt-1 block">
                    Secs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED CURATED COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Hand-Picked Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop?featured=true"
            className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 group"
          >
            <span>View all featured</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <Modal
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          title="Quick View"
          maxWidth="max-w-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={quickViewProduct.images && quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                {quickViewProduct.brand} • {quickViewProduct.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {quickViewProduct.name}
              </h3>
              <Rating value={quickViewProduct.rating || 0} numReviews={quickViewProduct.numReviews} />
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-extrabold text-slate-900">
                  {formatCurrency(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(quickViewProduct.originalPrice)}
                  </span>
                )}
                {quickViewProduct.discount > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {quickViewProduct.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {quickViewProduct.description}
              </p>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, 1);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/product/${quickViewProduct.slug || quickViewProduct._id}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  Full Details
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
