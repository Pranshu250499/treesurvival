import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw,
  Star,
  Flame,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { FullPageLoader } from '../../components/Loader';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({ limit: 100 });
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await adminService.deleteProduct(id);
      if (res.success) {
        toast.success('Product deleted successfully');
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  // Filter products locally for instantaneous admin table search
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <FullPageLoader message="Loading catalog inventory..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage catalog items, pricing, inventory stock, and highlighted flags ({products.length} Total)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl shadow-xs transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/products/add"
            className="px-4 py-2.5 bg-slate-900 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title, brand, or SKU..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-700 font-semibold"
        >
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Men's Fashion">Men's Fashion</option>
          <option value="Women's Fashion">Women's Fashion</option>
          <option value="Home & Living">Home & Living</option>
          <option value="Beauty">Beauty</option>
          <option value="Sports">Sports</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Flags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images && p.images[0] ? p.images[0] : 'https://placehold.co/60x60'}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider block">
                          {p.brand}
                        </span>
                        <Link
                          to={`/product/${p.slug || p._id}`}
                          target="_blank"
                          className="font-semibold text-slate-800 hover:text-primary-600 truncate block transition-colors"
                        >
                          {p.name}
                        </Link>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-slate-600 font-medium">{p.category}</td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-slate-900">{formatCurrency(p.price)}</span>
                    {p.discount > 0 && (
                      <span className="text-[10px] text-rose-600 block font-semibold">
                        {p.discount}% OFF
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        p.stock > 10
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.stock > 0
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    ★ {p.rating ? Number(p.rating).toFixed(1) : '0.0'}{' '}
                    <span className="text-slate-400 font-normal">({p.numReviews || 0})</span>
                  </td>

                  {/* Flags */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {p.featured && (
                        <span
                          title="Featured Product"
                          className="p-1 bg-amber-50 text-amber-600 rounded-md"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                        </span>
                      )}
                      {p.trending && (
                        <span
                          title="Trending Product"
                          className="p-1 bg-rose-50 text-rose-600 rounded-md"
                        >
                          <Flame className="w-3.5 h-3.5 fill-rose-500" />
                        </span>
                      )}
                      {!p.featured && !p.trending && (
                        <span className="text-slate-300 text-[10px]">—</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/product/${p.slug || p._id}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="View on store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="p-1.5 text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
