import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6 bg-dark-800 rounded-2xl p-4 border border-dark-500 shadow-2xl">
            <img src={logo} alt="TruckBee Logo" className="h-20 w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">CoreInventory</h1>
        </div>
        <div className="card shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">Set New Password</h2>
          <p className="text-slate-500 text-sm mb-6">Choose a strong password for your account.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-field pr-11" placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                <button type="button" onClick={() => setShowPass(o => !o)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" className="input-field" placeholder="Repeat new password"
                value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resetting...</> : <><KeyRound size={16} /> Reset Password</>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
