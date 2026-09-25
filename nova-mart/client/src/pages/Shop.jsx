import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { productService } from '../services/productService';
import ProductGrid from '../components/ProductGrid';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORIES } from '../utils/constants';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Highest Discount', value: 'discount' },
];

const RATING_FILTERS = [
  { label: '4★ & above', value: '4' },
  { label: '3★ & above', value: '3' },
  { label: '2★ & above', value: '2' },
];

const DISCOUNT_FILTERS = [
  { label: '10% or more', value: '10' },
  { label: '20% or more', value: '20' },
  { label: '30% or more', value: '30' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentKeyword = searchParams.get('keyword') || '';
  const currentMinPrice = searchParams.get('minPrice') || '0';
  const currentMaxPrice = searchParams.get('maxPrice') || '100000';
  const currentBrand = searchParams.get('brand') || 'all';
  const currentRating = searchParams.get('rating') || '';
  const currentDiscount = searchParams.get('discount') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentLimit = parseInt(searchParams.get('limit') || '12', 10);

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Local state for price range slider to allow smooth dragging before committing
  const [priceRange, setPriceRange] = useState(Number(currentMaxPrice));

  useEffect(() => {
    setPriceRange(Number(currentMaxPrice));
  }, [currentMaxPrice]);

  // Load products based on query params
  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: currentLimit,
          sort: currentSort,
        };

        if (currentKeyword) params.keyword = currentKeyword;
        if (currentCategory && currentCategory !== 'all') params.category = currentCategory;
        if (currentBrand && currentBrand !== 'all') params.brand = currentBrand;
        if (currentMinPrice && Number(currentMinPrice) > 0) params.minPrice = currentMinPrice;
        if (currentMaxPrice && Number(currentMaxPrice) < 100000) params.maxPrice = currentMaxPrice;
        if (currentRating) params.rating = currentRating;
        if (currentDiscount) params.discount = currentDiscount;
        if (currentInStock) params.inStock = 'true';

        const res = await productService.getProducts(params);
        if (res.success) {
          setProducts(res.products);
          setTotalProducts(res.totalProducts);
          setTotalPages(res.pages);
          if (res.availableBrands) setAvailableBrands(res.availableBrands);
        }
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    currentCategory,
    currentSort,
    currentKeyword,
    currentMinPrice,
    currentMaxPrice,
    currentBrand,
    currentRating,
    currentDiscount,
    currentInStock,
    currentPage,
    currentLimit,
  ]);

  // Update URL helper
  const updateQuery = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || val === 'all') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });

    // Reset page to 1 on filter changes unless changing page itself
    if (!('page' in updates)) {
      newParams.set('page', '1');
    }

    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams({}));
    setPriceRange(100000);
  };

  const hasActiveFilters =
    (currentCategory && currentCategory !== 'all') ||
    (currentBrand && currentBrand !== 'all') ||
    currentKeyword ||
    currentRating ||
    currentDiscount ||
    currentInStock ||
    Number(currentMaxPrice) < 100000;

  // Render Sidebar Filters Content
  const renderFilterPanel = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Category
        </h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => updateQuery({ category: 'all' })}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              currentCategory === 'all'
                ? 'bg-primary-50 text-primary-700 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateQuery({ category: cat })}
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                currentCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-primary-50 text-primary-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        {/* Price Slider */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Price Range
          </h4>
          <span className="text-xs font-extrabold text-primary-600">
            Up to {formatCurrency(priceRange)}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="100000"
          step="500"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          onMouseUp={() => updateQuery({ maxPrice: priceRange })}
          onTouchEnd={() => updateQuery({ maxPrice: priceRange })}
          className="w-full accent-primary-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>₹500</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* Brands Filter */}
      {availableBrands.length > 0 && (
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Brand
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => updateQuery({ brand: 'all' })}
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                currentBrand === 'all'
                  ? 'bg-primary-50 text-primary-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Brands
            </button>
            {availableBrands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => updateQuery({ brand })}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  currentBrand.toLowerCase() === brand.toLowerCase()
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Minimum Rating Filter */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Rating
        </h4>
        <div className="space-y-1.5">
          {RATING_FILTERS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() =>
                updateQuery({ rating: currentRating === r.value ? null : r.value })
              }
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                currentRating === r.value
                  ? 'bg-primary-50 text-primary-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Discount Filter */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Discount
        </h4>
        <div className="space-y-1.5">
          {DISCOUNT_FILTERS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() =>
                updateQuery({ discount: currentDiscount === d.value ? null : d.value })
              }
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                currentDiscount === d.value
                  ? 'bg-primary-50 text-primary-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability / Stock Filter */}
      <div className="border-t border-slate-100 pt-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) => updateQuery({ inStock: e.target.checked ? 'true' : null })}
            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
          />
          <span className="text-xs font-semibold text-slate-700">In Stock Items Only</span>
        </label>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <div className="pt-2">
          <button
            onClick={clearAllFilters}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Breadcrumbs / Filter count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentCategory !== 'all' ? currentCategory : 'All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing{' '}
            <strong className="text-slate-800 font-bold">{totalProducts}</strong> products
            {currentKeyword && ` for "${currentKeyword}"`}
          </p>
        </div>

        {/* Sort and Items Per Page bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-sm">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Items Per Page */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-sm">
            <span className="text-slate-400 font-medium">Show:</span>
            <select
              value={currentLimit}
              onChange={(e) => updateQuery({ limit: e.target.value })}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block bg-white rounded-2xl p-6 border border-slate-100 shadow-subtle sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Filter className="w-4 h-4 text-primary-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-primary-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          {renderFilterPanel()}
        </aside>

        {/* Right Product Grid & Pagination */}
        <div className="lg:col-span-3 space-y-8">
          <ProductGrid
            products={products}
            loading={loading}
            emptyTitle="No matching products found"
            emptyDescription="Try selecting a different category or clearing active filters to browse our collection."
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => updateQuery({ page: currentPage - 1 })}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors shadow-sm"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateQuery({ page: pNum })}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pNum
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => updateQuery({ page: currentPage + 1 })}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-float p-6 flex flex-col z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <span className="font-bold text-slate-900 text-base">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">{renderFilterPanel()}</div>
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Apply Filters ({totalProducts} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
