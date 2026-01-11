import React, { useState, useRef } from 'react';
import { Product, StaffMember, Category } from '../../types';
import { uploadProductImage } from '../../lib/supabase';

interface InventorySectionProps {
    currentUser: StaffMember;
    products: Product[];
    categories: Category[];
    onUpdateStock: (productId: string, newStock: number) => void;
    onDeleteProduct: (productId: string) => void;
    onSetFlashSale: (productId: string, discount: number) => void;
    onAddProduct: (product: Omit<Product, 'id'>) => Promise<void> | void;
    onUpdateProduct: (product: Product) => Promise<void> | void;
    onAddCategory: (name: string, subCategories?: string[]) => void;
    onUpdateCategory: (id: string, updates: any) => void;
    onDeleteCategory: (id: string) => void;
    setSystemAlert: (alert: { message: string, type: string } | null) => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({
    currentUser,
    products,
    categories,
    onUpdateStock,
    onDeleteProduct,
    onSetFlashSale,
    onAddProduct,
    onUpdateProduct,
    onAddCategory,
    onUpdateCategory,
    onDeleteCategory,
    setSystemAlert
}) => {
    // Local UI State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Category Management State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [newSubCategoryName, setNewSubCategoryName] = useState('');

    // Add Product Form State
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Apparel',
        subCategory: '',
        price: '',
        description: '',
        stock: '50',
        colors: '',
        sizes: '',
        embroideryPrice: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Robust file tracking

    // Action Modals State
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [productToFlashSale, setProductToFlashSale] = useState<string | null>(null);
    const [flashSaleDiscount, setFlashSaleDiscount] = useState<string>('20');

    // Category Deletion State
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string, name: string } | null>(null);
    const [subCategoryToDelete, setSubCategoryToDelete] = useState<{ categoryId: string, subName: string } | null>(null);

    const [isSuccess, setIsSuccess] = useState(false); // New success state

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAddProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (uploading || isSuccess) return; // Prevent double submission

        if (parseFloat(newProduct.price) < 0) {
            setSystemAlert({ message: 'Price cannot be negative', type: 'error' });
            return;
        }
        if (parseInt(newProduct.stock) < 0) {
            setSystemAlert({ message: 'Stock cannot be negative', type: 'error' });
            return;
        }

        // Use state instead of ref for reliability
        if (!selectedFile && !previewImage) {
            setSystemAlert({ message: 'Image File Required', type: 'error' });
            return;
        }

        setUploading(true);
        try {
            let imageUrl = previewImage;
            if (selectedFile) {
                try {
                    imageUrl = await uploadProductImage(selectedFile);
                } catch (uploadErr) {
                    console.error("Upload failed:", uploadErr);
                    throw new Error("Image upload failed. Check connection.");
                }
            }

            const productData = {
                name: newProduct.name,
                category: newProduct.category,
                subCategory: newProduct.subCategory,
                price: parseFloat(newProduct.price),
                description: newProduct.description,
                image: imageUrl!,
                stock: parseInt(newProduct.stock),
                colors: newProduct.colors ? newProduct.colors.split(',').map(c => ({ name: c.trim(), hex: '#000000' })) : [],
                sizes: newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()) : [],
                isFeatured: false,
                embroideryPrice: newProduct.embroideryPrice ? parseFloat(newProduct.embroideryPrice) : undefined
            };

            if (isEditMode && editingId) {
                await onUpdateProduct({ ...productData, id: editingId });
                setSystemAlert({ message: 'Product Updated Successfully', type: 'success' });
            } else {
                await onAddProduct(productData);
                setSystemAlert({ message: 'Product Added Successfully', type: 'success' });
            }

            // Show success state
            setIsSuccess(true);
            setUploading(false); // Stop loading indicator, show success

            // Delay closing logic
            setTimeout(() => {
                setShowAddModal(false);
                setNewProduct({ name: '', category: 'Apparel', subCategory: '', price: '', description: '', stock: '50', colors: '', sizes: '', embroideryPrice: '' });
                setPreviewImage(null);
                setSelectedFile(null); // Clear file
                setIsEditMode(false);
                setEditingId(null);
                setIsSuccess(false); // Reset success state
            }, 1000); // 1.5s delay

        } catch (err: any) {
            console.error("Submission error:", err);
            setSystemAlert({ message: err.message || 'Upload/Update Failed', type: 'error' });
            setUploading(false);
        } finally {
            setTimeout(() => setSystemAlert(null), 3000);
        }
    };

    const openEditModal = (product: Product) => {
        setNewProduct({
            name: product.name,
            category: product.category,
            subCategory: product.subCategory || '',
            price: product.price.toString(),
            description: product.description,
            stock: product.stock.toString(),
            colors: product.colors?.map(c => c.name).join(', ') || '',
            sizes: product.sizes?.join(', ') || '',
            embroideryPrice: product.embroideryPrice?.toString() || ''
        });
        setPreviewImage(product.image);
        setEditingId(product.id);
        setIsEditMode(true);
        setShowAddModal(true);
    };

    // Helper to get subcategories for current form selection
    const currentSubCategories = categories.find(c => c.name === newProduct.category)?.subCategories || [];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Stock <span className="text-blue-600">Inventory</span></h3>
                {currentUser.permissions.access_inventory && (
                    <div className="flex gap-4">
                        <button onClick={() => setShowCategoryModal(true)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                            <i className="fa-solid fa-layer-group"></i> Manage Categories
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2">
                            <i className="fa-solid fa-plus"></i> Add New Product
                        </button>
                    </div>
                )}
            </div>

            {currentUser.permissions.access_inventory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between group hover:border-blue-200 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                                    <div>
                                        <p className="font-black text-slate-800 text-xs line-clamp-1">{product.name}</p>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase">Stock: {product.stock}</p>
                                    </div>
                                </div>
                                {product.originalPrice && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Sale</span>}
                                {product.stock > 0 && (
                                    <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Live
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onUpdateStock(product.id, product.stock + 10)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all" title="Add Stock">
                                        <i className="fa-solid fa-plus text-[10px]"></i>
                                    </button>
                                    <button onClick={() => setProductToFlashSale(product.id)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-white transition-all" title="Set Flash Sale">
                                        <i className="fa-solid fa-tags text-[10px]"></i>
                                    </button>
                                    <button onClick={() => openEditModal(product)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all" title="Edit Product">
                                        <i className="fa-solid fa-pen text-[10px]"></i>
                                    </button>
                                </div>
                                <button onClick={() => setProductToDelete(product.id)} className="text-[10px] font-black text-slate-300 hover:text-red-500 uppercase tracking-wider transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full p-20 gap-4">
                    <i className="fa-solid fa-lock text-5xl text-slate-100"></i>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Permission 'access_inventory' Denied.</p>
                </div>
            )}

            {/* Add/Edit Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-blue-900/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
                        <div className="w-full md:w-5/12 bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                            <div className="relative group w-full aspect-square mb-6">
                                {previewImage ? <img src={previewImage} className="w-full h-full object-cover rounded-3xl shadow-lg border-4 border-white" alt="Preview" /> : <div className="w-full h-full bg-white border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 gap-4 group-hover:border-blue-400 transition-colors"><i className="fa-solid fa-cloud-arrow-up text-5xl"></i><p className="text-[10px] font-black uppercase tracking-widest">Drop Image Here</p></div>}
                                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                {previewImage && <button onClick={() => { setPreviewImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><i className="fa-solid fa-xmark text-xs"></i></button>}
                            </div>
                        </div>
                        <div className="flex-1 p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div><h3 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">{isEditMode ? 'Edit' : 'Add'} <span className="text-blue-600">Product</span></h3></div>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
                            </div>
                            <form onSubmit={handleAddProductSubmit} className="space-y-4">
                                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title</label><input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" placeholder="e.g. Premium Medical Clogs" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (KES)</label><input required type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" placeholder="3500" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} /></div>
                                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Embroidery (Optional)</label><input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" placeholder="Def: Global" value={newProduct.embroideryPrice} onChange={e => setNewProduct({ ...newProduct, embroideryPrice: e.target.value })} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value, subCategory: '' })}>
                                            {categories.length > 0 ? (
                                                categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                                            ) : (
                                                <option disabled>No Categories Available</option>
                                            )}
                                        </select>
                                    </div>
                                    {/* Dynamic Sub Category Dropdown */}
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub Category</label>
                                        <select
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black"
                                            value={newProduct.subCategory}
                                            onChange={e => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                                        >
                                            <option value="">Select Option</option>
                                            {currentSubCategories.map(sub => (
                                                <option key={sub} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Colors</label><input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" placeholder="Navy, Teal, Black" value={newProduct.colors} onChange={e => setNewProduct({ ...newProduct, colors: e.target.value })} /></div>
                                    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sizes</label><input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black" placeholder="S, M, L, XL" value={newProduct.sizes} onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value })} /></div>
                                </div>
                                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label><textarea required rows={3} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-black resize-none" placeholder="Enter fabric details..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} /></div>
                                <button
                                    type="submit"
                                    disabled={uploading || isSuccess}
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all ${isSuccess ? 'bg-green-600 text-white shadow-green-100 hover:bg-green-700' : 'bg-blue-700 text-white hover:bg-blue-800 shadow-blue-100'}`}
                                >
                                    {uploading ? (
                                        <>
                                            <i className="fa-solid fa-circle-notch animate-spin"></i>
                                            Processing Assets...
                                        </>
                                    ) : isSuccess ? (
                                        <>
                                            <i className="fa-solid fa-check-double scale-125"></i>
                                            Published!
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-check"></i>
                                            Finalize & Publish
                                        </>
                                    )}
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showCategoryModal && (
                <div className="fixed inset-0 z-[450] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300 max-h-[80vh] overflow-y-auto">
                        {/* Wrapper for content to allow modals to stack or replace */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Manage <span className="text-blue-600">Categories</span></h3>
                                {selectedCategory ? (
                                    <button onClick={() => setSelectedCategory(null)} className="text-xs text-blue-500 font-bold mt-1 flex items-center gap-1 hover:underline">
                                        <i className="fa-solid fa-arrow-left"></i> Back to Main Categories
                                    </button>
                                ) : (
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Select a category to manage sub-items</p>
                                )}
                            </div>
                            <button onClick={() => setShowCategoryModal(false)} className="text-slate-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>

                        {!selectedCategory ? (
                            // Main Categories View
                            <div className="space-y-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none"
                                        placeholder="New Category Name..."
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                    />
                                    <button
                                        onClick={() => {
                                            if (newCategoryName.trim()) {
                                                onAddCategory(newCategoryName.trim());
                                                setNewCategoryName('');
                                            }
                                        }}
                                        className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all cursor-pointer" onClick={() => setSelectedCategory(cat)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xs">
                                                    {cat.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-slate-700 block">{cat.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cat.subCategories?.length || 0} Sub-categories</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCategoryToDelete({ id: cat.id, name: cat.name });
                                                    }}
                                                    className="w-8 h-8 rounded-full hover:bg-red-100 text-slate-300 hover:text-red-500 transition-colors flex items-center justify-center"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                                <i className="fa-solid fa-chevron-right text-slate-300 ml-2"></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Sub Categories View
                            <div className="space-y-6 animate-in slide-in-from-right-4">
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-4">
                                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Editing: {selectedCategory.name}</p>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none"
                                        placeholder={`New ${selectedCategory.name} Item...`}
                                        value={newSubCategoryName}
                                        onChange={(e) => setNewSubCategoryName(e.target.value)}
                                    />
                                    <button
                                        onClick={() => {
                                            if (newSubCategoryName.trim()) {
                                                const updatedSubs = [...(selectedCategory.subCategories || []), newSubCategoryName.trim()];
                                                onUpdateCategory(selectedCategory.id, { subCategories: updatedSubs });
                                                setNewSubCategoryName('');
                                                // Optimistic update for local view
                                                setSelectedCategory({ ...selectedCategory, subCategories: updatedSubs });
                                            }
                                        }}
                                        className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {selectedCategory.subCategories && selectedCategory.subCategories.length > 0 ? (
                                        selectedCategory.subCategories.map((sub, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <span className="text-sm font-bold text-slate-700">{sub}</span>
                                                <button
                                                    onClick={() => {
                                                        setSubCategoryToDelete({ categoryId: selectedCategory.id, subName: sub });
                                                    }}
                                                    className="text-slate-300 hover:text-red-500 transition-colors px-2"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-slate-400">
                                            <i className="fa-solid fa-folder-open text-3xl mb-2 opacity-50"></i>
                                            <p className="text-xs font-bold uppercase tracking-widest">No Sub-categories yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Category Delete Confirmation Modal */}
            {categoryToDelete && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-red-900/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Delete Category?</h3>
                        <p className="text-xs text-slate-500 font-bold mb-6">Are you sure you want to remove "{categoryToDelete.name}"? All products in this category will need re-categorizing.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setCategoryToDelete(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Cancel</button>
                            <button
                                onClick={() => {
                                    onDeleteCategory(categoryToDelete.id);
                                    setCategoryToDelete(null);
                                    // If we were viewing it (unlikely as we delete from list, but safety check)
                                    if (selectedCategory?.id === categoryToDelete.id) setSelectedCategory(null);
                                }}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-200 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-Category Delete Confirmation Modal */}
            {subCategoryToDelete && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-red-900/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <i className="fa-solid fa-eraser text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Remove Sub-Category</h3>
                        <p className="text-xs text-slate-500 font-bold mb-6">Confirm removing "{subCategoryToDelete.subName}" from the list?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setSubCategoryToDelete(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Cancel</button>
                            <button
                                onClick={() => {
                                    // Logic to remove sub from category
                                    const cat = categories.find(c => c.id === subCategoryToDelete.categoryId);
                                    if (cat) {
                                        const updatedSubs = (cat.subCategories || []).filter(s => s !== subCategoryToDelete.subName);
                                        onUpdateCategory(cat.id, { subCategories: updatedSubs });
                                        // Update selected category local state if open
                                        if (selectedCategory && selectedCategory.id === cat.id) {
                                            setSelectedCategory({ ...selectedCategory, subCategories: updatedSubs });
                                        }
                                    }
                                    setSubCategoryToDelete(null);
                                }}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-200 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Delete Confirmation Modal */}
            {productToDelete && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-red-900/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Confirm Deletion</h3>
                        <p className="text-xs text-slate-500 font-bold mb-6">Are you sure you want to remove this product from inventory? This action is irreversible.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setProductToDelete(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Cancel</button>
                            <button
                                onClick={() => {
                                    if (productToDelete) {
                                        onDeleteProduct(productToDelete);
                                        setProductToDelete(null);
                                        setSystemAlert({ message: 'Product Deleted', type: 'success' });
                                        setTimeout(() => setSystemAlert(null), 3000);
                                    }
                                }}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-200 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Flash Sale Modal */}
            {productToFlashSale && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-amber-900/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Set <span className="text-amber-500">Flash Sale</span></h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Apply immediate discount</p>
                            </div>
                            <button onClick={() => setProductToFlashSale(null)} className="text-slate-300 hover:text-amber-500 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Percentage (%)</label>
                                <input
                                    type="number"
                                    value={flashSaleDiscount}
                                    onChange={(e) => setFlashSaleDiscount(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-2xl font-black text-center text-amber-500 focus:border-amber-500 outline-none"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (productToFlashSale) {
                                        onSetFlashSale(productToFlashSale, parseInt(flashSaleDiscount));
                                        setProductToFlashSale(null);
                                        setSystemAlert({ message: 'Discount Applied', type: 'success' });
                                        setTimeout(() => setSystemAlert(null), 3000);
                                    }
                                }}
                                className="w-full py-4 bg-amber-500 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-amber-600 shadow-xl shadow-amber-200 transition-colors"
                            >
                                Apply Discount
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventorySection;
