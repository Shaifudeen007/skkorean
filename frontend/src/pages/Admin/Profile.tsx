import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { User, Mail, Shield, Lock, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/admin/profile');
        setProfile(data);
      } catch (error) {
        toast.error('Failed to fetch profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    
    setChangingPassword(true);
    try {
      await api.put('/admin/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-foreground/50">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin Profile</h1>
        <p className="text-foreground/60 mt-1">Manage your account settings and password</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-center p-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{profile?.name || 'Administrator'}</h2>
            <p className="text-foreground/60 text-sm mb-6">{profile?.role || 'Admin Role'}</p>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/50">
                <Mail className="w-5 h-5 text-foreground/40 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-foreground/50 font-medium">Email Address</p>
                  <p className="text-sm text-foreground truncate">{profile?.email || 'admin@example.com'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/50">
                <Shield className="w-5 h-5 text-foreground/40 shrink-0" />
                <div>
                  <p className="text-xs text-foreground/50 font-medium">Access Level</p>
                  <p className="text-sm text-foreground capitalize">{profile?.role || 'Admin'}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="mt-6 w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-red-500 font-bold bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Change Password
            </h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">New Password</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Confirm new password"
                />
              </div>
              
              <div className="pt-4 border-t border-border mt-6">
                <button 
                  type="submit" 
                  disabled={changingPassword}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ml-auto"
                >
                  {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
