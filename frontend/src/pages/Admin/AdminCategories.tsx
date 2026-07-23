import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Plus, X, Search, Edit2, Trash2, Tag, Loader2, AlertCircle, Layers, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategories = () => {
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainFilter, setSelectedMainFilter] = useState<string>('ALL');
  
  const [formData, setFormData] = useState({
    name: '',
    mainCategoryId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mainRes, subRes] = await Promise.all([
        api.get('/main-categories'),
        api.get('/categories')
      ]);

      const mainList = mainRes.data.data || mainRes.data || [];
      const subList = subRes.data.data || subRes.data.categories || subRes.data || [];

      setMainCategories(mainList);
      setSubCategories(subList);

      // Pre-select first main category if available for form
      if (mainList.length > 0 && !formData.mainCategoryId) {
        setFormData(prev => ({ ...prev, mainCategoryId: mainList[0].id }));
      }
    } catch (error) {
      toast.error('Failed to fetch categories data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    try {
      await api.delete(`/categories/${showDeleteConfirm}`);
      toast.success('Sub Category deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleEditClick = (category: any) => {
    setEditId(category.id || category._id);
    setFormData({
      name: category.name || '',
      mainCategoryId: category.mainCategoryId || category.mainCategory?.id || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Sub category name is required');
    if (!formData.mainCategoryId) return toast.error('Please select a Main Category');
    
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, formData);
        toast.success('Sub Category updated successfully!');
      } else {
        await api.post('/categories', formData);
        toast.success('Sub Category added successfully!');
      }
      
      setShowForm(false);
      setEditId(null);
      setFormData({ name: '', mainCategoryId: mainCategories[0]?.id || '' });
      fetchData();
    } catch (error) {
      toast.error(editId ? 'Failed to update sub category' : 'Failed to add sub category');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const mainCatId = c.mainCategoryId || c.mainCategory?.id;
      const mainMatch = selectedMainFilter === 'ALL' || mainCatId === selectedMainFilter;
      return nameMatch && mainMatch;
    });
  }, [subCategories, searchQuery, selectedMainFilter]);

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Category Management</h1>
          <p className="text-foreground/60 mt-1">Fixed Main Categories & Dynamic Sub Categories</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditId(null);
              setFormData({ name: '', mainCategoryId: mainCategories[0]?.id || '' });
            }
          }}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add Sub Category'}
        </button>
      </div>

      {/* Main Categories Section (Fixed Notice & Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Main Categories <span className="text-xs font-normal text-foreground/60 bg-border px-2.5 py-0.5 rounded-full border border-border/80 flex items-center gap-1"><Lock className="w-3 h-3 text-amber-500" /> Permanent / Fixed</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainCategories.map((mainCat) => {
            const subCount = subCategories.filter(
              sc => (sc.mainCategoryId || sc.mainCategory?.id) === mainCat.id
            ).length;

            return (
              <div 
                key={mainCat.id}
                onClick={() => setSelectedMainFilter(selectedMainFilter === mainCat.id ? 'ALL' : mainCat.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedMainFilter === mainCat.id 
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20' 
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Layers className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Fixed
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-1">{mainCat.name}</h3>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-xs text-foreground/60">
                  <span>{subCount} Sub {subCount === 1 ? 'Category' : 'Categories'}</span>
                  <span className="font-medium text-primary">View &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            className="bg-card border border-border p-6 rounded-2xl shadow-xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-t-2xl" />
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              {editId ? 'Edit Sub Category' : 'Create New Sub Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-5">
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Main Category <span className="text-red-500">*</span>
                </label>
                <select 
                  required
                  name="mainCategoryId"
                  value={formData.mainCategoryId}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                >
                  {mainCategories.map(mc => (
                    <option key={mc.id} value={mc.id}>{mc.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Sub Category Name <span className="text-red-500">*</span>
                </label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-foreground/30"
                  placeholder="e.g. Diode Laser, Permanent Makeup, Tattoo Removal"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-foreground text-background rounded-xl font-bold hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : (editId ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area - Sub Categories */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input 
                type="text" 
                placeholder="Search sub categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
              />
            </div>
            
            {selectedMainFilter !== 'ALL' && (
              <button 
                onClick={() => setSelectedMainFilter('ALL')}
                className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="text-sm text-foreground/60 font-medium">
            Total Sub Categories: {filteredSubCategories.length}
          </div>
        </div>

        {/* Table/List */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Loading sub categories...</p>
            </div>
          ) : filteredSubCategories.length > 0 ? (
            <table className="w-full text-left whitespace-nowrap min-w-[600px]">
              <thead className="bg-background/50 text-foreground/60 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-2xl">Sub Category</th>
                  <th className="px-6 py-4 font-semibold">Main Category</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredSubCategories.map((c) => {
                  const mainCatName = c.mainCategory?.name || 
                    mainCategories.find(m => m.id === c.mainCategoryId)?.name || 'Unassigned';

                  return (
                    <tr key={c.id || c._id} className="hover:bg-border/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Tag className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {mainCatName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(c)} 
                            className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                            title="Edit Sub Category"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(c.id || c._id)} 
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                            title="Delete Sub Category"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-border/50 rounded-full flex items-center justify-center mb-4">
                <Tag className="w-8 h-8 text-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No sub categories found</h3>
              <p className="text-foreground/60 text-sm max-w-sm">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : "You haven't created any sub categories under this main category yet."}
              </p>
              {!searchQuery && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="mt-6 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Create Sub Category
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card border border-border p-6 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Delete Sub Category</h3>
              <p className="text-foreground/70 mb-8 leading-relaxed">
                Are you sure you want to permanently delete this sub category? Products in this sub category will be affected.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(null)} 
                  className="px-5 py-2.5 rounded-xl font-semibold text-foreground bg-border hover:bg-border/80 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete} 
                  className="px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all active:scale-95 order-1 sm:order-2"
                >
                  Delete Sub Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
