import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Plus, X, Upload, Search, Edit2, Trash2, Package, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    mrp: '',
    discountPrice: '',
    description: '',
    keyFeatures: '',
    whyChooseUs: '',
    procedure: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories || data.data || (Array.isArray(data) ? data : []));
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    try {
      await api.delete(`/products/${showDeleteConfirm}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleEditClick = (product: any) => {
    setEditId(product.id || product._id);
    setFormData({
      name: product.name || '',
      categoryId: product.category?.id || (typeof product.category === 'string' ? product.category : ''),
      mrp: product.mrp || product.originalPrice || '',
      discountPrice: product.discountPrice || product.price || '',
      description: product.description || '',
      keyFeatures: product.keyFeatures || '',
      whyChooseUs: product.whyChooseUs || '',
      procedure: product.procedure || '',
    });
    
    // Set image preview if exists
    if (product.image) {
      setImagePreview(getImageUrl(product.image));
    } else {
      setImagePreview(null);
    }
    
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId || !formData.description.trim()) {
      return toast.error('Please fill in all required fields');
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('categoryId', formData.categoryId);
      if (formData.mrp) data.append('mrp', formData.mrp);
      if (formData.discountPrice) data.append('discountPrice', formData.discountPrice);
      data.append('description', formData.description);
      data.append('keyFeatures', formData.keyFeatures);
      data.append('whyChooseUs', formData.whyChooseUs);
      data.append('procedure', formData.procedure);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editId) {
        await api.put(`/products/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added successfully!');
      }
      
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(editId ? 'Failed to update product' : 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({
      name: '',
      categoryId: '',
      mrp: '',
      discountPrice: '',
      description: '',
      keyFeatures: '',
      whyChooseUs: '',
      procedure: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  // Filter and Pagination Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Products</h1>
          <p className="text-foreground/60 mt-1">Manage your catalog items</p>
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
          {showForm ? 'Cancel' : 'Add Product'}
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
              <Package className="w-5 h-5 text-primary" />
              {editId ? 'Edit Product' : 'Create New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Heading (Name) <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. Laser Hair Removal Machine"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Category <span className="text-red-500">*</span></label>
                  <select 
                    required
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Category</option>
                    {editId && formData.categoryId && !categories.some(c => (c.id || c._id) === formData.categoryId) && (
                      <option value={formData.categoryId}>
                        {products.find(p => (p.id || p._id) === editId)?.category?.name || 'Unknown Category'}
                      </option>
                    )}
                    {categories.map(c => (
                      <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">MRP Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-medium">₹</span>
                    <input 
                      type="number" 
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Strikethrough price"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Selling / Discount Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-medium">₹</span>
                    <input 
                      type="number" 
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Leave blank for 'Enquire'"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder="Write a compelling product description..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Product Image</label>
                  <div className="relative border-2 border-dashed border-border rounded-xl p-2 h-[164px] flex flex-col items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-all cursor-pointer bg-background group overflow-hidden">
                    <input 
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
                          <p>Max size: 5 MB</p>
                          <p>Recommended: 1200x1200 px</p>
                          <p>Formats: JPG, PNG, WEBP</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Key Features</label>
                  <textarea 
                    name="keyFeatures"
                    value={formData.keyFeatures}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                    placeholder="Enter each feature on a new line..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Why Choose Us</label>
                  <textarea 
                    name="whyChooseUs"
                    value={formData.whyChooseUs}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                    placeholder="Enter each reason on a new line..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Procedure</label>
                  <textarea 
                    name="procedure"
                    value={formData.procedure}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                    placeholder="Enter each procedure step on a new line..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border mt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 bg-foreground text-background rounded-xl font-bold hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : (editId ? 'Update Product' : 'Save Product')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="text-sm text-foreground/60 font-medium">
            Total: {filteredProducts.length} Products
          </div>
        </div>

        {/* Table/List */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Loading products...</p>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <table className="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead className="bg-background/50 text-foreground/60 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-2xl">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedProducts.map((p) => (
                  <tr key={p.id || p._id} className="hover:bg-border/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-background border border-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {p.image ? (
                            <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-foreground/30" />
                          )}
                        </div>
                        <div className="max-w-[250px]">
                          <p className="font-medium text-foreground truncate" title={p.name}>{p.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {p.category?.name || p.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.discountPrice || p.price ? (
                        <div className="flex flex-col justify-center">
                          <span className="font-bold text-foreground">₹{p.discountPrice || p.price}</span>
                          {(p.mrp || p.originalPrice) && (
                            <span className="line-through text-xs text-foreground/40 mt-0.5">₹{p.mrp || p.originalPrice}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-foreground/60">Enquire</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(p)} 
                          className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(p.id || p._id)} 
                          className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-border/50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No products found</h3>
              <p className="text-foreground/60 text-sm max-w-sm">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : "Your catalog is currently empty. Add your first product to get started."}
              </p>
              {!searchQuery && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="mt-6 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Create Product
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-card/50">
            <p className="text-sm text-foreground/60">
              Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-medium text-foreground">{filteredProducts.length}</span> results
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-border/50 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-border/50 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
              <h3 className="text-xl font-bold text-foreground mb-2">Delete Product</h3>
              <p className="text-foreground/70 mb-8 leading-relaxed">
                Are you sure you want to permanently delete this product? This action cannot be undone and will remove it from the public catalog.
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
                  Delete Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
