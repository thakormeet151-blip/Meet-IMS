import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, X, ArrowLeftRight, CheckCircle } from 'lucide-react';

const statusBadge = (s) => ({ pending: 'badge-yellow', completed: 'badge-green', cancelled: 'badge-red' }[s] || 'badge-gray');

function TransferModal({ onClose, onSave }) {
  const [form, setForm] = useState({ product: '', fromLocation: '', toLocation: '', quantity: 1, notes: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/products').then(r => setProducts(r.data.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.fromLocation === form.toLocation) return toast.error('From and To locations must differ');
    setLoading(true);
    try {
      await api.post('/transfers', form);
      toast.success('Transfer created');
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Transfer</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Product</label>
            <select className="input-field" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} required>
              <option value="">Select product...</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku}) — {p.warehouseLocation}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">From Location</label>
              <input className="input-field" placeholder="e.g. Zone A" value={form.fromLocation}
                onChange={e => setForm({ ...form, fromLocation: e.target.value })} required />
            </div>
            <div>
              <label className="label">To Location</label>
              <input className="input-field" placeholder="e.g. Zone B" value={form.toLocation}
                onChange={e => setForm({ ...form, toLocation: e.target.value })} required />
            </div>
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
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const fetchTransfers = async () => {
    try {
      const res = await api.get('/transfers');
      setTransfers(res.data.data);
    } catch (e) { toast.error('Failed to load transfers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTransfers(); }, []);

  const handleComplete = async (id) => {
    try {
      await api.put(`/transfers/${id}/complete`);
      toast.success('Transfer completed & location updated');
      fetchTransfers();
    } catch (err) { toast.error('Failed to complete transfer'); }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Transfers</h1>
          <p className="text-slate-500 text-sm mt-0.5">Move stock between warehouse locations</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> New Transfer</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="table-header text-left">Transfer #</th>
                <th className="table-header text-left">Product</th>
                <th className="table-header text-left">From</th>
                <th className="table-header text-left">To</th>
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
              ) : transfers.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12">
                  <ArrowLeftRight size={40} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500">No transfers yet</p>
                </td></tr>
              ) : transfers.map(t => (
                <tr key={t._id} className="table-row">
                  <td className="table-cell font-mono text-brand-400 text-xs">{t.transferNumber}</td>
                  <td className="table-cell font-medium text-slate-200">{t.product?.name}</td>
                  <td className="table-cell"><span className="badge-gray">{t.fromLocation}</span></td>
                  <td className="table-cell"><span className="badge-blue">{t.toLocation}</span></td>
                  <td className="table-cell font-bold text-blue-400">{t.quantity}</td>
                  <td className="table-cell text-slate-500 text-xs">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="table-cell"><span className={statusBadge(t.status)}>{t.status}</span></td>
                  <td className="table-cell">
                    {t.status === 'pending' && (
                      <button onClick={() => handleComplete(t._id)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors">
                        <CheckCircle size={12} /> Complete
                      </button>
                    )}
                    {t.status !== 'pending' && <span className="text-slate-600 text-xs italic">Done</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <TransferModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetchTransfers(); }} />}
    </div>
  );
}
