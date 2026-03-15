import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await api.put('/auth/me', profileForm);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setLoadingProfile(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error('Passwords do not match');
    setLoadingPass(true);
    try {
      await api.put('/auth/update-password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password changed successfully');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setLoadingPass(false); }
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
            <User size={18} className="text-brand-400" />
          </div>
          <div>
            <h2 className="section-title">Profile Information</h2>
            <p className="text-slate-500 text-xs">Update your name and email</p>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-dark-700 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 border-2 border-brand-500/40 flex items-center justify-center">
            <span className="text-brand-400 font-bold text-2xl">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full capitalize ${
              user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
              user?.role === 'manager' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-slate-500/20 text-slate-400 border border-slate-500/30'
            }`}>{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input-field" value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input-field" value={profileForm.email}
              onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} required />
          </div>
          <div>
            <label className="label">Role</label>
            <input className="input-field bg-dark-900 cursor-not-allowed opacity-60" value={user?.role} disabled />
            <p className="text-xs text-slate-600 mt-1">Role can only be changed by an administrator</p>
          </div>
          <button type="submit" disabled={loadingProfile} className="btn-primary">
            {loadingProfile ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={15} /> Save Profile</>}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Lock size={18} className="text-purple-400" />
          </div>
          <div>
            <h2 className="section-title">Change Password</h2>
            <p className="text-slate-500 text-xs">Keep your account secure</p>
          </div>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} className="input-field pr-11" placeholder="Your current password"
                value={passForm.currentPassword} onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })} required />
              <button type="button" onClick={() => setShowPass(o => !o)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input-field" placeholder="Min. 6 characters"
              value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} required minLength={6} />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input-field" placeholder="Repeat new password"
              value={passForm.confirmPassword} onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })} required />
          </div>
          <button type="submit" disabled={loadingPass} className="btn-primary">
            {loadingPass ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Lock size={15} /> Change Password</>}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-500/20">
        <h2 className="section-title text-red-400 mb-3">Danger Zone</h2>
        <p className="text-slate-500 text-sm mb-4">Actions here cannot be undone. Proceed with caution.</p>
        <button onClick={() => { logout(); }} className="btn-danger">
          Sign Out of All Sessions
        </button>
      </div>
    </div>
  );
}
