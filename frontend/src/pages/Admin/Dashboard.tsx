import React, { useEffect, useState } from 'react';
import api, { getImageUrl } from '../../services/api';
import { Package, Image as ImageIcon, LayoutGrid, Plus, ArrowRight, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalProducts: 0,
    totalGalleryImages: 0,
    recentProducts: [],
    recentUploads: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesRes, productsRes, galleryRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
          api.get('/gallery')
        ]);
        
        const categories = categoriesRes.data || [];
        const products = productsRes.data || [];
        const gallery = galleryRes.data || [];

        setStats({
          totalCategories: categories.length,
          totalProducts: products.length,
          totalGalleryImages: gallery.length,
          recentProducts: products.slice(0, 5), // Assuming backend returns newest first or we just take first 5
          recentUploads: gallery.slice(0, 5)
        });
      } catch (error) {
        // toast.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Categories', value: stats.totalCategories, icon: LayoutGrid, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Gallery Images', value: stats.totalGalleryImages, icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const quickActions = [
    { name: 'Add Product', path: '/admin/products', icon: Plus, desc: 'Create a new product catalog' },
    { name: 'Add Category', path: '/admin/categories', icon: Plus, desc: 'Create a new product category' },
    { name: 'Upload Image', path: '/admin/gallery', icon: Plus, desc: 'Upload to gallery portfolio' },
    { name: 'Manage Profile', path: '/admin/profile', icon: Settings, desc: 'Update admin settings' },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-foreground/60 mt-1">Welcome to SK Admin Dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-foreground/60 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Products</h3>
            <Link to="/admin/products" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {stats.recentProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.recentProducts.map((p: any) => (
                <div key={p.id || p._id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-border/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center overflow-hidden border border-border">
                      {p.imageUrl || p.image ? (
                        <img src={getImageUrl(p.imageUrl || p.image)} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-foreground/40" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{p.name}</h4>
                      <p className="text-xs text-foreground/50">{p.category?.name || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{p.discountPrice || p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-foreground/50">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No products found</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, idx) => (
              <Link 
                key={idx}
                to={action.path}
                className="group p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all block"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">{action.name}</h4>
                <p className="text-xs text-foreground/50">{action.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
