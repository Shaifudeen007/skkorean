import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Plus, X, Upload, Edit2, Trash2, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../services/api';

const AdminGallery = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/gallery');
      setItems(data);
    } catch (error) {
      toast.error('Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    try {
      await api.delete(`/gallery/${showDeleteConfirm}`);
      toast.success('Gallery item deleted');
      fetchGallery();
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId && !imageFile) {
      toast.error('Please select an image to upload');
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      if (formData.title) data.append('title', formData.title);
      if (formData.description) data.append('description', formData.description);
      if (imageFile) data.append('image', imageFile);

      if (editId) {
        await api.put(`/gallery/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Gallery item updated successfully!');
      } else {
        await api.post('/gallery', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Image uploaded successfully!');
      }
      
      resetForm();
      fetchGallery();
    } catch (error) {
      toast.error(editId ? 'Failed to update item' : 'Failed to upload image');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditId(item.id || item._id);
    setFormData({ title: item.title || '', description: item.description || '' });
    
    if (item.url) {
      setImagePreview(getImageUrl(item.url));
    } else {
      setImagePreview(null);
    }
    
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({ title: '', description: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Gallery</h1>
          <p className="text-foreground/60 mt-1">Manage your portfolio images</p>
        </div>
        <button 
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Upload Image'}
        </button>
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
              <ImageIcon className="w-5 h-5 text-primary" />
              {editId ? 'Edit Gallery Item' : 'Upload to Gallery'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Title <span className="text-foreground/40 text-xs font-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. Clinic Setup"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Description <span className="text-foreground/40 text-xs font-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. Laser machine installation in Bangalore"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Image {!editId && <span className="text-red-500">*</span>}
                </label>
                <div className="relative border-2 border-dashed border-border rounded-xl p-2 h-48 flex flex-col items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-all cursor-pointer bg-background group overflow-hidden max-w-md">
                  <input 
                    required={!editId}
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  
                  {imagePreview ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      <Upload className="w-8 h-8 mb-3 text-primary/50 group-hover:text-primary transition-colors" />
                      <span className="font-medium">Click to upload image</span>
                      <div className="text-xs mt-2 text-foreground/40 text-center space-y-0.5">
                        <p>Max size: 8 MB</p>
                        <p>Recommended: 1600x900 px</p>
                        <p>Formats: JPG, PNG, WEBP</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border mt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 bg-foreground text-background rounded-xl font-bold hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : (editId ? 'Update Item' : 'Upload Image')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-foreground/50 bg-card border border-border rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>Loading gallery images...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id || item.id} className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-sm flex flex-col hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300">
              <div className="aspect-square w-full overflow-hidden bg-background">
                <img 
                  src={getImageUrl(item.url)} 
                  alt={item.title || 'Gallery Item'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="p-4 flex flex-col flex-grow bg-card">
                <div className="mb-4 flex-grow">
                  <h3 className="text-sm font-bold text-foreground line-clamp-1">{item.title || 'Untitled'}</h3>
                  <p className="text-xs text-foreground/60 line-clamp-2 mt-1 min-h-[2rem]">
                    {item.description || 'No description provided.'}
                  </p>
                </div>
                
                {/* Action buttons are now always visible */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-border/50">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="flex-1 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(item._id || item.id)} 
                    className="flex-1 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl">
          <div className="w-16 h-16 bg-border/50 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-foreground/40" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No images in gallery</h3>
          <p className="text-foreground/60 text-sm max-w-sm">
            Your portfolio is currently empty. Upload your first image to showcase it to your clients.
          </p>
          <button 
            onClick={() => setShowForm(true)}
            className="mt-6 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
          >
            Upload Image
          </button>
        </div>
      )}

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
              <h3 className="text-xl font-bold text-foreground mb-2">Delete Gallery Image</h3>
              <p className="text-foreground/70 mb-8 leading-relaxed">
                Are you sure you want to permanently delete this image from your portfolio? This action cannot be undone.
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
                  Delete Image
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGallery;
