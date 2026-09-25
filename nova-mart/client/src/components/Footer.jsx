import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Truck, Headphones, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../utils/constants';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to NOVA MART Insider!');
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-white border-t border-slate-100 text-slate-600 pt-12 pb-8">
      {/* Value Proposition Highlights Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 bg-slate-50/70 rounded-3xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Free Delivery
              </h4>
              <p className="text-xs text-slate-500">Orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                7-Day Replacement
              </h4>
              <p className="text-xs text-slate-500">Hassle-free exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                100% Genuine
              </h4>
              <p className="text-xs text-slate-500">Direct from brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                24/7 Support
              </h4>
              <p className="text-xs text-slate-500">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base">
                N
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                NOVA<span className="text-primary-600">MART</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 mb-6 max-w-sm leading-relaxed">
              Curated everyday luxury, cutting-edge technology, and modern essentials engineered for a superior lifestyle.
            </p>

            {/* Newsletter form */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Subscribe for exclusive drops & secret deals
              </h5>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-primary-600 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <span>Join</span>}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Quick Links
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop" className="hover:text-primary-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?discount=20" className="hover:text-primary-600 transition-colors">
                  Special Mega Deals
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary-600 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary-600 transition-colors">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Shop Categories
            </h5>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#help" onClick={(e) => { e.preventDefault(); toast('Customer Support: support@novamart.com'); }} className="hover:text-primary-600 transition-colors">
                  Help Center & FAQs
                </a>
              </li>
              <li>
                <a href="#replacement" onClick={(e) => { e.preventDefault(); toast('7-Day Replacement Policy applicable on all eligible items'); }} className="hover:text-primary-600 transition-colors">
                  Replacement Policy
                </a>
              </li>
              <li>
                <a href="#shipping" onClick={(e) => { e.preventDefault(); toast('Free standard shipping across India on orders over ₹999'); }} className="hover:text-primary-600 transition-colors">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); toast('Your data is protected under 256-bit SSL encryption'); }} className="hover:text-primary-600 transition-colors">
                  Privacy Policy & Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & payment security */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NOVA MART Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Secure Checkout</span>
            <span>•</span>
            <span>UPI / Cards / NetBanking / COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
