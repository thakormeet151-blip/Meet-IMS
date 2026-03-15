import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, X, CheckCircle, XCircle, ArrowDownToLine } from 'lucide-react';

const statusBadge = (s) => ({ pending: 'badge-yellow', validated: 'badge-green', cancelled: 'badge-red' }[s] || 'badge-gray');

function ReceiptModal({ onClose, onSave }) {
  const [form, setForm] = useState({ supplier: '', product: '', quantity: 1, notes: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/receipts', form);
      toast.success('Receipt created');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating receipt');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Receipt</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Supplier</label>
            <input className="input-field" placeholder="Supplier name" value={form.supplier}
              onChange={e => setForm({ ...form, supplier: e.target.value })} required />
          </div>
          <div>
            <label className="label">Product</label>
            <select className="input-field" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} required>
              <option value="">Select product...</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Quantity</label>
            <input type="number" className="input-field" min={1} value={form.quantity}
              onChange={e => setForm({ ...form, quantity: +e.target.value })} required />
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <textarea className="input-field resize-none h-20" value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const fetchReceipts = async () => {
    try {
      const res = await api.get('/receipts');
      setReceipts(res.data.data);
    } catch (e) { toast.error('Failed to load receipts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReceipts(); }, []);

  const handleValidate = async (id) => {
    try {
      await api.put(`/receipts/${id}/validate`);
      toast.success('Receipt validated & stock updated');
      fetchReceipts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this receipt?')) return;
    try {
      await api.put(`/receipts/${id}/cancel`);
      toast.success('Receipt cancelled');
      fetchReceipts();
    } catch (err) { toast.error('Failed to cancel'); }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Receipts</h1>
          <p className="text-slate-500 text-sm mt-0.5">Incoming stock from suppliers</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> New Receipt</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="table-header text-left">Receipt #</th>
                <th className="table-header text-left">Supplier</th>
                <th className="table-header text-left">Product</th>
                <th className="table-header text-left">SKU</th>
                <th className="table-header text-left">Qty</th>
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : receipts.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12">
                  <ArrowDownToLine size={40} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500">No receipts yet</p>
                </td></tr>
              ) : receipts.map(r => (
                <tr key={r._id} className="table-row">
                  <td className="table-cell font-mono text-brand-400 text-xs">{r.receiptNumber}</td>
                  <td className="table-cell font-medium text-slate-200">{r.supplier}</td>
                  <td className="table-cell">{r.product?.name}</td>
                  <td className="table-cell font-mono text-xs text-slate-500">{r.product?.sku}</td>
                  <td className="table-cell font-bold text-emerald-400">{r.quantity}</td>
                  <td className="table-cell text-slate-500 text-xs">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="table-cell"><span className={statusBadge(r.status)}>{r.status}</span></td>
                  <td className="table-cell">
                    {r.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleValidate(r._id)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors">
                          <CheckCircle size={12} /> Validate
                        </button>
                        <button onClick={() => handleCancel(r._id)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors">
                          <XCircle size={12} /> Cancel
                        </button>
                      </div>
                    )}
                    {r.status !== 'pending' && <span className="text-slate-600 text-xs italic">Processed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ReceiptModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetchReceipts(); }} />}
    </div>
  );
}
