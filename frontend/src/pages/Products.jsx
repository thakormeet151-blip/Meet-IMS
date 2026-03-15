import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2, X, Package, Filter, AlertTriangle } from 'lucide-react';

const UNITS = ['pcs', 'kg', 'ltr', 'mtr', 'box', 'pallet', 'carton', 'set'];

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || {
    name: '', sku: '', category: '', unitOfMeasure: 'pcs',
    stockQuantity: 0, minStockLevel: 10, warehouseLocation: 'Main Warehouse', description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product?._id) {
        await api.put(`/products/${product._id}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/products', form);
        toast.success('Product created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">{product?._id ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Product Name</label>
              <input className="input-field" placeholder="e.g. Steel Pipe 50mm" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">SKU Code</label>
              <input className="input-field" placeholder="e.g. STL-001" value={form.sku}
                onChange={e => setForm({ ...form, sku: e.target.value.toUpperCase() })} required />
            </div>
            <div>
              <label className="label">Category</label>
              <input className="input-field" placeholder="e.g. Raw Material" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div>
              <label className="label">Unit of Measure</label>
              <select className="input-field" value={form.unitOfMeasure} onChange={e => setForm({ ...form, unitOfMeasure: e.target.value })}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Stock Quantity</label>
              <input type="number" className="input-field" min={0} value={form.stockQuantity}
                onChange={e => setForm({ ...form, stockQuantity: +e.target.value })} />
            </div>
            <div>
              <label className="label">Min Stock Level</label>
              <input type="number" className="input-field" min={0} value={form.minStockLevel}
                onChange={e => setForm({ ...form, minStockLevel: +e.target.value })} />
            </div>
            <div>
              <label className="label">Warehouse Location</label>
              <input className="input-field" placeholder="e.g. Zone A-01" value={form.warehouseLocation}
                onChange={e => setForm({ ...form, warehouseLocation: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Description (optional)</label>
              <textarea className="input-field resize-none h-20" placeholder="Product description..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (product?._id ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [modal, setModal] = useState(null);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (lowStockOnly) params.lowStock = true;
      const res = await api.get('/products', { params });
      setProducts(res.data.data);
    } catch (e) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(res.data.data);
    } catch (e) {}
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [search, category, lowStockOnly]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (e) { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} products found</p>
        </div>
        <button onClick={() => setModal({})} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input-field pl-9" placeholder="Search by name or SKU..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 min-w-[180px]">
            <Filter size={14} className="text-slate-500 shrink-0" />
            <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={() => setLowStockOnly(o => !o)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${lowStockOnly ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-dark-700 border-dark-400 text-slate-400 hover:text-slate-200'}`}>
            <AlertTriangle size={14} /> Low Stock
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="table-header text-left">Product</th>
                <th className="table-header text-left">SKU</th>
                <th className="table-header text-left">Category</th>
                <th className="table-header text-left">Unit</th>
                <th className="table-header text-left">Stock</th>
                <th className="table-header text-left">Location</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-500">
                  <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12">
                  <Package size={40} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500">No products found</p>
                </td></tr>
              ) : products.map(p => (
                <tr key={p._id} className="table-row">
                  <td className="table-cell">
                    <div className="font-semibold text-slate-200">{p.name}</div>
                    {p.description && <div className="text-xs text-slate-600 truncate max-w-[200px]">{p.description}</div>}
                  </td>
                  <td className="table-cell font-mono text-brand-400 text-xs">{p.sku}</td>
                  <td className="table-cell">
                    <span className="badge-blue">{p.category}</span>
                  </td>
                  <td className="table-cell text-slate-400">{p.unitOfMeasure}</td>
                  <td className="table-cell">
                    <span className={`font-bold ${p.isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>{p.stockQuantity}</span>
                    {p.isLowStock && <AlertTriangle size={12} className="inline ml-1 text-amber-400" />}
                  </td>
                  <td className="table-cell text-slate-400 text-xs">{p.warehouseLocation}</td>
                  <td className="table-cell">
                    {p.isLowStock ? <span className="badge-yellow">Low Stock</span> : <span className="badge-green">In Stock</span>}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(p)} className="p-1.5 rounded-lg bg-dark-600 hover:bg-brand-500/20 text-slate-400 hover:text-brand-400 transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg bg-dark-600 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== null && (
        <ProductModal product={modal._id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); fetchProducts(); fetchCategories(); }} />
      )}
    </div>
  );
}
