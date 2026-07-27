import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Plus, X, Upload, Search, Edit2, Trash2, Package, Loader2, AlertCircle, Image as ImageIcon, Layers, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    mainCategoryId: '',
    categoryId: '',
    mrp: '',
    discountPrice: '',
    description: '',
    keyFeatures: '',
    whyChooseUs: '',
    procedure: '',
  });

  // Multiple image state (up to 4 images max)
  const [existingImages, setExistingImages] = useState<Array<{ id: string; url: string; isCover?: boolean }>>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [coverImageIndex, setCoverImageIndex] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const fetchCategoriesAndMain = async () => {
    try {
      const [mainRes, subRes] = await Promise.all([
        api.get('/main-categories'),
        api.get('/categories')
      ]);

      const mainList = mainRes.data.data || mainRes.data || [];
      const subList = subRes.data.data || subRes.data.categories || subRes.data || [];

      setMainCategories(mainList);
      setSubCategories(subList);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      const list = Array.isArray(data) ? data : (data?.products || data?.data || []);
      setProducts(list);
    } catch (error) {
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndMain();
  }, []);

  // Filtered subcategories based on selected main category in form
  const availableSubCategories = useMemo(() => {
    if (!formData.mainCategoryId) return [];
    return subCategories.filter(sc => (sc.mainCategoryId || sc.mainCategory?.id) === formData.mainCategoryId);
  }, [subCategories, formData.mainCategoryId]);

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
    
    const prodCat = product.category;
    const catId = typeof prodCat === 'object' && prodCat ? prodCat.id : (typeof prodCat === 'string' ? prodCat : '');
    
    let mCatId = '';
    if (typeof prodCat === 'object' && prodCat) {
      mCatId = prodCat.mainCategoryId || prodCat.mainCategory?.id || '';
    }
    
    if (!mCatId && catId) {
      const match = subCategories.find(s => s.id === catId);
      if (match) {
        mCatId = match.mainCategoryId || match.mainCategory?.id || '';
      }
    }

    if (!mCatId && mainCategories.length > 0) {
      mCatId = mainCategories[0].id;
    }

    setFormData({
      name: product.name || '',
      mainCategoryId: mCatId,
      categoryId: catId,
      mrp: product.mrp || product.originalPrice || '',
      discountPrice: product.discountPrice || product.price || '',
      description: product.description || '',
      keyFeatures: product.keyFeatures || '',
      whyChooseUs: product.whyChooseUs || '',
      procedure: product.procedure || '',
    });
    
    const existingImgs = (product.images && product.images.length > 0)
      ? product.images.map((img: any) => typeof img === 'string' ? { id: img, url: img, isCover: false } : { id: img.id || img.url, url: img.url, isCover: img.isCover })
      : (product.image ? [{ id: 'legacy', url: product.image, isCover: true }] : []);

    setExistingImages(existingImgs);
    const coverImg = existingImgs.find(i => i.isCover);
    setCoverImageId(coverImg ? coverImg.id : null);
    setCoverImageIndex(null);
    setDeletedImageIds([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'mainCategoryId') {
      const newSubCats = subCategories.filter(sc => (sc.mainCategoryId || sc.mainCategory?.id) === value);
      setFormData(prev => ({
        ...prev,
        mainCategoryId: value,
        categoryId: newSubCats.length > 0 ? (newSubCats[0].id || newSubCats[0]._id) : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const activeExistingImages = useMemo(() => {
    return existingImages.filter(img => !deletedImageIds.includes(img.id));
  }, [existingImages, deletedImageIds]);

  const totalImageCount = activeExistingImages.length + newImageFiles.length;

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const remainingSlots = 4 - totalImageCount;

      if (remainingSlots <= 0) {
        toast.error('Maximum 4 images allowed per product');
        return;
      }

      const filesToProcess = selectedFiles.slice(0, remainingSlots);
      if (selectedFiles.length > remainingSlots) {
        toast.info(`Only ${remainingSlots} image(s) added to stay within the 4 image limit`);
      }

      setNewImageFiles(prev => [...prev, ...filesToProcess]);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      e.target.value = '';
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (coverImageIndex === index) setCoverImageIndex(null);
    else if (coverImageIndex !== null && coverImageIndex > index) setCoverImageIndex(coverImageIndex - 1);
  };

  const handleRemoveExistingImage = (imageId: string) => {
    setDeletedImageIds(prev => [...prev, imageId]);
    if (coverImageId === imageId) setCoverImageId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId || !formData.description.trim()) {
      return toast.error('Please fill in all required fields (Name, Sub Category, Description)');
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

      // Append multi-image files
      newImageFiles.forEach(file => {
        data.append('images', file);
      });

      // Append deleted existing image IDs
      if (deletedImageIds.length > 0) {
        data.append('deletedImageIds', JSON.stringify(deletedImageIds));
      }

      if (coverImageId) data.append('coverImageId', coverImageId);
      if (coverImageIndex !== null) data.append('coverImageIndex', coverImageIndex.toString());

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
      mainCategoryId: mainCategories[0]?.id || '',
      categoryId: '',
      mrp: '',
      discountPrice: '',
      description: '',
      keyFeatures: '',
      whyChooseUs: '',
      procedure: '',
    });
    setExistingImages([]);
    setDeletedImageIds([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setCoverImageId(null);
    setCoverImageIndex(null);
  };

  // Filter and Pagination Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const catName = p.category?.name || '';
      const mainCatName = p.category?.mainCategory?.name || '';
      const catMatch = catName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       mainCatName.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || catMatch;
    });
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenForm = () => {
    if (showForm) {
      resetForm();
    } else {
      const defaultMain = mainCategories[0]?.id || '';
      const defaultSubCats = subCategories.filter(sc => (sc.mainCategoryId || sc.mainCategory?.id) === defaultMain);
      setFormData({
        name: '',
        mainCategoryId: defaultMain,
        categoryId: defaultSubCats[0]?.id || '',
        mrp: '',
        discountPrice: '',
        description: '',
        keyFeatures: '',
        whyChooseUs: '',
        procedure: '',
      });
      setExistingImages([]);
      setDeletedImageIds([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setCoverImageId(null);
      setCoverImageIndex(null);
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Products Catalog</h1>
          <p className="text-foreground/60 mt-1">Manage catalog items under Main & Sub Categories</p>
        </div>
        <button 
          onClick={handleOpenForm}
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
              
              {/* Product Name & Category Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Product Name <span className="text-red-500">*</span></label>
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
                  <label className="block text-sm font-medium text-foreground/80 mb-2">1. Main Category <span className="text-red-500">*</span></label>
                  <select 
                    required
                    name="mainCategoryId"
                    value={formData.mainCategoryId}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer font-medium"
                  >
                    <option value="" disabled>Select Main Category</option>
                    {mainCategories.map(mc => (
                      <option key={mc.id} value={mc.id}>{mc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">2. Sub Category <span className="text-red-500">*</span></label>
                  <select 
                    required
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    disabled={availableSubCategories.length === 0}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {availableSubCategories.length === 0 ? (
                      <option value="">No Sub Categories (Create one first)</option>
                    ) : (
                      availableSubCategories.map(sc => (
                        <option key={sc.id || sc._id} value={sc.id || sc._id}>{sc.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">MRP Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-medium">&#8377;</span>
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
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-medium">&#8377;</span>
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

              {/* Description & Multiple Image Upload */}
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
                    placeholder="Write a detailed product description..."
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground/80">
                      Product Images <span className="text-xs text-foreground/50 font-normal">(Optional, Up to 4)</span>
                    </label>
                    <span className="text-xs text-foreground/50 block mt-1">The first uploaded image becomes the Cover Image by default. You can change it anytime.</span>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                      {totalImageCount} / 4 Images
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-h-[140px] p-2 bg-background border border-border rounded-xl">
                    {/* Existing Uploaded Images */}
                    {activeExistingImages.map((img) => (
                      <div 
                        key={img.id} 
                        className={`relative group rounded-lg overflow-hidden bg-card h-28 flex items-center justify-center transition-all duration-300 ${
                          img.id === coverImageId 
                            ? 'border-[3px] border-[#16A34A] shadow-[0_0_15px_rgba(22,163,74,0.4)] scale-[1.02]' 
                            : 'border border-border'
                        }`}
                      >
                        <img src={getImageUrl(img.url)} alt="Existing Product" className="w-full h-full object-cover" />
                        
                        <div className={`absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center gap-2 ${img.id === coverImageId ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                          {img.id !== coverImageId && (
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); setCoverImageId(img.id); setCoverImageIndex(null); }}
                              className="px-2 py-1 bg-[#16A34A] text-white text-xs rounded hover:bg-green-600 transition-colors shadow"
                            >
                              Set as Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(img.id)}
                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow"
                            title="Delete Image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {img.id !== coverImageId && (
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                            Saved
                          </span>
                        )}
                        {img.id === coverImageId && (
                          <div className="absolute top-2 left-2 bg-[#16A34A] text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-bold tracking-wide uppercase">Cover Image</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Newly Selected Image Previews */}
                    {newImagePreviews.map((previewUrl, index) => (
                      <div 
                        key={index} 
                        className={`relative group rounded-lg overflow-hidden bg-card h-28 flex items-center justify-center transition-all duration-300 ${
                          index === coverImageIndex 
                            ? 'border-[3px] border-[#16A34A] shadow-[0_0_15px_rgba(22,163,74,0.4)] scale-[1.02]' 
                            : 'border border-primary/50'
                        }`}
                      >
                        <img src={previewUrl} alt={`New upload ${index + 1}`} className="w-full h-full object-cover" />
                        
                        <div className={`absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center gap-2 ${index === coverImageIndex ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                          {index !== coverImageIndex && (
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); setCoverImageIndex(index); setCoverImageId(null); }}
                              className="px-2 py-1 bg-[#16A34A] text-white text-xs rounded hover:bg-green-600 transition-colors shadow"
                            >
                              Set as Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow"
                            title="Remove Image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {index !== coverImageIndex && (
                          <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 rounded font-bold">
                            New
                          </span>
                        )}
                        {index === coverImageIndex && (
                          <div className="absolute top-2 left-2 bg-[#16A34A] text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-bold tracking-wide uppercase">Cover Image</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add Image Box (if total count < 4) */}
                    {totalImageCount < 4 && (
                      <div className="relative border-2 border-dashed border-border rounded-lg h-28 flex flex-col items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-all cursor-pointer bg-card/50 group">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleImagesChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Upload className="w-5 h-5 mb-1 text-primary/60 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-semibold text-center px-1">Upload</span>
                        <span className="text-[9px] text-foreground/40">Max 4</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Features, Why Choose Us, Procedure */}
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
            <table className="w-full text-left whitespace-nowrap min-w-[800px]">
              <thead className="bg-background/50 text-foreground/60 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-2xl">Product</th>
                  <th className="px-6 py-4 font-semibold">Main Category</th>
                  <th className="px-6 py-4 font-semibold">Sub Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedProducts.map((p) => {
                  const subCatName = p.category?.name || 'Uncategorized';
                  const mainCatName = p.category?.mainCategory?.name || 'Machineries';
                  
                  const displayImg = p.images && p.images.length > 0 
                    ? p.images[0].url 
                    : p.image;

                  const extraImageCount = p.images && p.images.length > 1 
                    ? p.images.length - 1 
                    : 0;

                  return (
                    <tr key={p.id || p._id} className="hover:bg-border/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-lg bg-background border border-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {displayImg ? (
                              <img src={getImageUrl(displayImg)} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-foreground/30" />
                            )}
                            {extraImageCount > 0 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-primary text-primary-foreground text-[9px] font-extrabold px-1 py-0.2 rounded-full leading-none shadow">
                                +{extraImageCount}
                              </span>
                            )}
                          </div>
                          <div className="max-w-[220px]">
                            <p className="font-medium text-foreground truncate" title={p.name}>{p.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {mainCatName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {subCatName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.discountPrice || p.price ? (
                          <div className="flex flex-col justify-center">
                            <span className="font-bold text-foreground">&#8377;{p.discountPrice || p.price}</span>
                            {(p.mrp || p.originalPrice) && (
                              <span className="line-through text-xs text-foreground/40 mt-0.5">&#8377;{p.mrp || p.originalPrice}</span>
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
                  );
                })}
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
                  onClick={handleOpenForm}
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
                Are you sure you want to permanently delete this product? This action cannot be undone.
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
