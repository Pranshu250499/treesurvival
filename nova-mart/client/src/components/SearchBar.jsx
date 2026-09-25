import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';

const SearchBar = ({ className = '', onSearchSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [previewProducts, setPreviewProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setPreviewProducts([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await productService.searchProducts(searchTerm.trim());
        if (res.success) {
          setSuggestions(res.suggestions || []);
          setPreviewProducts(res.products || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term) => {
    const query = term || searchTerm;
    if (!query.trim()) return;
    setIsOpen(false);
    if (onSearchSubmit) onSearchSubmit();
    navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`);
  };

  const handleProductSelect = (slug) => {
    setIsOpen(false);
    setSearchTerm('');
    if (onSearchSubmit) onSearchSubmit();
    navigate(`/product/${slug}`);
  };

  return (
    <div ref={searchContainerRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="relative flex items-center w-full"
      >
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 || previewProducts.length > 0) setIsOpen(true);
          }}
          placeholder="Search products, brands, categories..."
          className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 w-4 h-4 text-slate-400 animate-spin" />
        ) : searchTerm ? (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSuggestions([]);
              setPreviewProducts([]);
              setIsOpen(false);
            }}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </form>

      {/* Autocomplete Popup */}
      {isOpen && (suggestions.length > 0 || previewProducts.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-float border border-slate-100 overflow-hidden z-50 animate-slide-up">
          {/* Quick Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Suggestions
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchTerm(item);
                      handleSearch(item);
                    }}
                    className="text-xs px-2.5 py-1 bg-white hover:bg-primary-50 hover:text-primary-700 text-slate-700 font-medium rounded-lg border border-slate-200 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Previews */}
          {previewProducts.length > 0 && (
            <div className="py-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4">
                Products
              </span>
              <div className="mt-1 divide-y divide-slate-50">
                {previewProducts.slice(0, 4).map((p) => (
                  <div
                    key={p._id}
                    onClick={() => handleProductSelect(p.slug || p._id)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={p.images && p.images[0] ? p.images[0] : 'https://placehold.co/80x80'}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                      <p className="text-[11px] text-slate-400">{p.brand} • {p.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-slate-900">{formatCurrency(p.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View All Matches Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => handleSearch()}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5"
            >
              <span>See all matching results for "{searchTerm}"</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
