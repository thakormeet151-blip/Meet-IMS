import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, X, Truck } from 'lucide-react';

const statusBadge = (s) => ({ pending: 'badge-yellow', dispatched: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' }[s] || 'badge-gray');

function DeliveryModal({ onClose, onSave }) {
  const [form, setForm] = useState({ customer: '', product: '', quantity: 1, notes: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/products').then(r => setProducts(r.data.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/deliveries', form);
      toast.success('Delivery order created & stock deducted');
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Delivery Order</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Customer</label>
            <input className="input-field" placeholder="Customer name" value={form.customer}
              onChange={e => setForm({ ...form, customer: e.target.value })} required />
          </div>
          <div>
            <label className="label">Product</label>
            <select className="input-field" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} required>
              <option value="">Select product...</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku}) — Stock: {p.stockQuantity}</option>)}
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
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Delivery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get('/deliveries');
      setDeliveries(res.data.data);
    } catch (e) { toast.error('Failed to load deliveries'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDeliveries(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/deliveries/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchDeliveries();
    } catch (err) { toast.error('Failed to update status'); }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Deliveries</h1>
          <p className="text-slate-500 text-sm mt-0.5">Outgoing stock to customers</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> New Delivery</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="table-header text-left">Delivery #</th>
                <th className="table-header text-left">Customer</th>
                <th className="table-header text-left">Product</th>
                <th className="table-header text-left">Qty</th>
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : deliveries.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12">
                  <Truck size={40} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500">No deliveries yet</p>
                </td></tr>
              ) : deliveries.map(d => (
                <tr key={d._id} className="table-row">
                  <td className="table-cell font-mono text-brand-400 text-xs">{d.deliveryNumber}</td>
                  <td className="table-cell font-medium text-slate-200">{d.customer}</td>
                  <td className="table-cell">{d.product?.name}</td>
                  <td className="table-cell font-bold text-red-400">{d.quantity}</td>
                  <td className="table-cell text-slate-500 text-xs">{new Date(d.date).toLocaleDateString()}</td>
                  <td className="table-cell"><span className={statusBadge(d.status)}>{d.status}</span></td>
                  <td className="table-cell">
                    {d.status === 'pending' && (
                      <button onClick={() => handleStatusUpdate(d._id, 'dispatched')}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 transition-colors">
                        Mark Dispatched
                      </button>
                    )}
                    {d.status === 'dispatched' && (
                      <button onClick={() => handleStatusUpdate(d._id, 'delivered')}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors">
                        Mark Delivered
                      </button>
                    )}
                    {(d.status === 'delivered' || d.status === 'cancelled') && (
                      <span className="text-slate-600 text-xs italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <DeliveryModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetchDeliveries(); }} />}
    </div>
  );
}
