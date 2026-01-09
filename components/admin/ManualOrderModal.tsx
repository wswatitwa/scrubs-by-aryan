import React, { useState } from 'react';
import { Product, Order } from '../../types';

interface ManualOrderModalProps {
    products: Product[];
    onClose: () => void;
    onSubmit: (orderData: any) => void;
}

const ManualOrderModal: React.FC<ManualOrderModalProps> = ({ products, onClose, onSubmit }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [location, setLocation] = useState('');
    const [selectedItems, setSelectedItems] = useState<{ product: Product, quantity: number }[]>([]);
    const [notes, setNotes] = useState('');

    const addItem = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Check if already added
        const existing = selectedItems.find(i => i.product.id === productId);
        if (existing) {
            setSelectedItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setSelectedItems(prev => [...prev, { product, quantity: 1 }]);
        }
    };

    const removeItem = (productId: string) => {
        setSelectedItems(prev => prev.filter(i => i.product.id !== productId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItems.length === 0) return;

        const subtotal = selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const shippingFee = 0; // Manual orders usually pickup or handled differently, can add field later

        onSubmit({
            customerName,
            customerPhone,
            location: location || 'Walk-in / Phone',
            items: selectedItems.map(i => ({
                ...i.product,
                quantity: i.quantity,
                selectedColor: 'Default', // Simplified for manual
                selectedSize: 'Default'
            })),
            subtotal,
            shippingFee,
            total: subtotal + shippingFee,
            notes,
            status: 'Paid', // Assume manual orders are paid immediately via physical means
            mpesaCode: 'MANUAL-' + Date.now().toString().slice(-6),
            shippingMethod: 'Pickup/Direct'
        });
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">

                <div className="bg-blue-900 p-6 flex justify-between items-center">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">New Manual Order</h3>
                    <button onClick={onClose} className="text-blue-200 hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</label>
                            <input required type="text" className="w-full p-3 bg-slate-50 border rounded-xl font-bold" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                            <input required type="tel" className="w-full p-3 bg-slate-50 border rounded-xl font-bold" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Products</label>
                        <select className="w-full p-3 bg-slate-50 border rounded-xl font-bold" onChange={(e) => { addItem(e.target.value); e.target.value = ''; }}>
                            <option value="">Select a product to add...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} - KES {p.price}</option>
                            ))}
                        </select>
                    </div>

                    {selectedItems.length > 0 && (
                        <div className="bg-slate-50 p-4 rounded-xl space-y-2 max-h-40 overflow-y-auto">
                            {selectedItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-700">{item.quantity}x {item.product.name}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black">KES {item.product.price * item.quantity}</span>
                                        <button type="button" onClick={() => removeItem(item.product.id)} className="text-red-500"><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t pt-2 flex justify-between items-center text-blue-900 font-black">
                                <span>TOTAL</span>
                                <span>KES {selectedItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0).toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={selectedItems.length === 0} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-500 disabled:opacity-50 transition-all">
                        Create Order (Offline Ready)
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManualOrderModal;
