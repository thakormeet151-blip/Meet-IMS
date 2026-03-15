import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, X, ClipboardList, TrendingUp, TrendingDown } from 'lucide-react';

function AdjustmentModal({ onClose, onSave }) {
  const [form, setForm] = useState({ product: '', location: '', newQuantity: 0, reason: '' });
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/products').then(r => setProducts(r.data.data)); }, []);

  const handleProductChange = (id) => {
    const p = products.find(p => p._id === id);
    setSelected(p);
    setForm({ ...form, product: id, location: p?.warehouseLocation || '', newQuantity: p?.stockQuantity || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/adjustments', form);
      toast.success('Adjustment applied');
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Inventory Adjustment</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Product</label>
            <select className="input-field" value={form.product} onChange={e => handleProductChange(e.target.value)} required>
              <option value="">Select product...</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku}) — Current: {p.stockQuantity}</option>)}
            </select>
          </div>
          {selected && (
            <div className="bg-dark-700 rounded-lg p-3 text-sm">
              <span className="text-slate-500">Current stock: </span>
              <span className="text-white font-bold">{selected.stockQuantity} {selected.unitOfMeasure}</span>
            </div>
          )}
          <div>
            <label className="label">Location</label>
            <input className="input-field" placeholder="Warehouse location" value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div>
            <label className="label">New Quantity (Corrected)</label>
            <input type="number" className="input-field" min={0} value={form.newQuantity}
              onChange={e => setForm({ ...form, newQuantity: +e.target.value })} required />
            {selected && (
              <p className={`text-xs mt-1 font-medium ${form.newQuantity > selected.stockQuantity ? 'text-emerald-400' : form.newQuantity < selected.stockQuantity ? 'text-red-400' : 'text-slate-500'}`}>
                Difference: {form.newQuantity - selected.stockQuantity > 0 ? '+' : ''}{form.newQuantity - selected.stockQuantity}
              </p>
            )}
          </div>
          <div>
            <label className="label">Reason</label>
            <textarea className="input-field resize-none h-20" placeholder="e.g. Physical count correction, damaged goods..."
              value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Apply Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const fetchAdjustments = async () => {
    try {
      const res = await api.get('/adjustments');
      setAdjustments(res.data.data);
    } catch (e) { toast.error('Failed to load adjustments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAdjustments(); }, []);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Inventory Adjustments</h1>
          <p className="text-slate-500 text-sm mt-0.5">Correct physical stock discrepancies</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> New Adjustment</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="table-header text-left">Adj. #</th>
                <th className="table-header text-left">Product</th>
                <th className="table-header text-left">Location</th>
                <th className="table-header text-left">Old Qty</th>
                <th className="table-header text-left">New Qty</th>
                <th className="table-header text-left">Difference</th>
                <th className="table-header text-left">Reason</th>
                <th className="table-header text-left">By</th>
                <th className="table-header text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : adjustments.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12">
                  <ClipboardList size={40} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500">No adjustments yet</p>
                </td></tr>
              ) : adjustments.map(a => (
                <tr key={a._id} className="table-row">
                  <td className="table-cell font-mono text-brand-400 text-xs">{a.adjustmentNumber}</td>
                  <td className="table-cell font-medium text-slate-200">{a.product?.name}</td>
                  <td className="table-cell text-slate-400 text-xs">{a.location}</td>
                  <td className="table-cell text-slate-400">{a.oldQuantity}</td>
                  <td className="table-cell font-bold text-white">{a.newQuantity}</td>
                  <td className="table-cell">
                    <span className={`flex items-center gap-1 font-bold ${a.difference > 0 ? 'text-emerald-400' : a.difference < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                      {a.difference > 0 ? <TrendingUp size={13} /> : a.difference < 0 ? <TrendingDown size={13} /> : null}
                      {a.difference > 0 ? '+' : ''}{a.difference}
                    </span>
                  </td>
                  <td className="table-cell text-slate-400 text-xs max-w-[160px] truncate">{a.reason}</td>
                  <td className="table-cell text-slate-500 text-xs">{a.createdBy?.name}</td>
                  <td className="table-cell text-slate-500 text-xs">{new Date(a.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <AdjustmentModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetchAdjustments(); }} />}
    </div>
  );
}
