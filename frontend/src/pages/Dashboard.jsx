import { useEffect, useState } from 'react';
import api from '../services/api';
import { Package, TrendingUp, AlertTriangle, Truck, ArrowDownToLine, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const statusBadge = (status) => {
  const map = { pending: 'badge-yellow', validated: 'badge-green', dispatched: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' };
  return map[status] || 'badge-gray';
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setData(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const chartData = MONTHS.slice(0, 6).map((m, i) => {
    const month = i + 1;
    const rec = data?.monthlyReceipts?.find(r => r._id.month === month);
    const del = data?.monthlyDeliveries?.find(d => d._id.month === month);
    return { month: m, Receipts: rec?.total || 0, Deliveries: del?.total || 0 };
  });

  const stats = data?.stats || {};

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Inventory overview and analytics</p>
        </div>
        <button onClick={fetchData} className="btn-secondary text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          { label: 'Total Products', value: stats.totalProducts ?? 0, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Total Stock', value: stats.totalStock ?? 0, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Low Stock Items', value: stats.lowStockItems ?? 0, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', alert: stats.lowStockItems > 0 },
          { label: 'Pending Deliveries', value: stats.pendingDeliveries ?? 0, icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Pending Receipts', value: stats.pendingReceipts ?? 0, icon: ArrowDownToLine, color: 'text-brand-400', bg: 'bg-brand-500/10' },
        ].map(({ label, value, icon: Icon, color, bg, alert }) => (
          <div key={label} className={`stat-card ${alert ? 'border-amber-500/30' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={color} />
              </div>
              {alert && <span className="badge-yellow text-[10px]">Alert</span>}
            </div>
            <p className="text-3xl font-extrabold text-white">{value.toLocaleString()}</p>
            <p className="text-slate-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts + Low Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="xl:col-span-2 card">
          <h2 className="section-title mb-4">Stock Movement (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d52" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a35', border: '1px solid #3d3d6b', borderRadius: 8, color: '#e2e8f0' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="Receipts" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="Deliveries" fill="#f5a623" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock */}
        <div className="card">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" /> Low Stock Alerts
          </h2>
          {data?.lowStockProducts?.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">All stock levels are healthy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.lowStockProducts?.map(p => (
                <div key={p._id} className="flex items-center justify-between bg-dark-700 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-200 truncate max-w-[120px]">{p.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">{p.stockQuantity}</p>
                    <p className="text-xs text-slate-600">min: {p.minStockLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Receipts */}
        <div className="card">
          <h2 className="section-title mb-4">Recent Receipts</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header text-left">Receipt #</th>
                  <th className="table-header text-left">Supplier</th>
                  <th className="table-header text-left">Product</th>
                  <th className="table-header text-left">Qty</th>
                  <th className="table-header text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentReceipts?.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6 text-slate-600 text-sm">No receipts yet</td></tr>
                ) : data?.recentReceipts?.map(r => (
                  <tr key={r._id} className="table-row">
                    <td className="table-cell font-mono text-brand-400 text-xs">{r.receiptNumber}</td>
                    <td className="table-cell">{r.supplier}</td>
                    <td className="table-cell text-slate-400">{r.product?.name}</td>
                    <td className="table-cell font-semibold">{r.quantity}</td>
                    <td className="table-cell"><span className={statusBadge(r.status)}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="card">
          <h2 className="section-title mb-4">Recent Deliveries</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header text-left">Delivery #</th>
                  <th className="table-header text-left">Customer</th>
                  <th className="table-header text-left">Product</th>
                  <th className="table-header text-left">Qty</th>
                  <th className="table-header text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentDeliveries?.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6 text-slate-600 text-sm">No deliveries yet</td></tr>
                ) : data?.recentDeliveries?.map(d => (
                  <tr key={d._id} className="table-row">
                    <td className="table-cell font-mono text-brand-400 text-xs">{d.deliveryNumber}</td>
                    <td className="table-cell">{d.customer}</td>
                    <td className="table-cell text-slate-400">{d.product?.name}</td>
                    <td className="table-cell font-semibold">{d.quantity}</td>
                    <td className="table-cell"><span className={statusBadge(d.status)}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
