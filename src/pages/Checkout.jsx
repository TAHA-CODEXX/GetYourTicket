import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { createOrder, getStats, updateStats } from '../services/api';
import { sendOrderConfirmationToN8N } from '../services/n8n';
import toast from 'react-hot-toast';

const Checkout = () => {
    const cartItems = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Manual Validation
        if (!formData.fullName.trim()) {
            toast.error('Le nom complet est requis');
            return;
        }
        if (!formData.email.trim()) {
            toast.error("L'email est requis");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("L'email n'est pas valide");
            return;
        }
        if (!formData.phone.trim()) {
            toast.error('Le numéro de téléphone est requis');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                customerName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                items: cartItems.map(item => ({
                    eventId: item.event.id,
                    eventName: item.event.name,
                    quantity: item.quantity,
                    price: item.event.price,
                })),
                totalPrice: total,
                orderDate: new Date().toISOString(),
            };

            await createOrder(orderData);

            // Send to n8n Webhook for Email Confirmation
            try {
                await sendOrderConfirmationToN8N({
                    customerName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    items: cartItems.map(item => ({
                        eventName: item.event.name,
                        quantity: item.quantity,
                        price: item.event.price
                    })),
                    totalPrice: total,
                    orderId: Date.now().toString(36) // Simple ID generation
                });
                toast.success('Confirmation email sent!', { duration: 2000 });
            } catch (n8nError) {
                console.error('Error sending to n8n:', n8nError);
                toast.error('Confirmation email could not be sent, but order is successful', { duration: 3000 });
                // We don't block the success flow if email fails
            }

            // Update stats
            try {
                const statsRes = await getStats();
                if (statsRes.data) {
                    const currentStats = statsRes.data;
                    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

                    await updateStats({
                        ...currentStats,
                        totalTicketsSold: currentStats.totalTicketsSold + totalQuantity,
                        eventsHosted: currentStats.eventsHosted, // keep other existing data
                        happyCustomers: currentStats.happyCustomers + 1 // Increment happy customers by 1 per order
                    });
                }
            } catch (statsError) {
                console.error('Error updating stats:', statsError);
                // Don't block success flow if stats update fails
            }

            setShowSuccess(true);
            dispatch(clearCart());
            toast.success('Commande validée avec succès!');

            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Une erreur est survenue pendant la commande');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !showSuccess) {
        navigate('/cart');
        return null;
    }

    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card max-w-md text-center animate-fade-in p-8">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10">
                        <svg className="w-10 h-10 text-green-500 checkmark-animation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Commande confirmée!</h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        Merci pour votre achat. Un email de confirmation a été envoyé à <span className="text-blue-400">{formData.email}</span>
                    </p>
                    <p className="text-xs text-slate-500">Redirection automatique...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
                <span className="text-gradient">Finaliser</span> votre commande
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Form */}
                <div className="card h-fit">
                    <h2 className="text-xl font-bold text-white mb-6">Informations de contact</h2>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label className="block text-gray-400 mb-1.5 text-xs font-medium uppercase tracking-wider">Nom complet</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Jean Dupont"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-1.5 text-xs font-medium uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="jean.dupont@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-1.5 text-xs font-medium uppercase tracking-wider">Téléphone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="+33 6 12 34 56 78"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Traitement...' : 'Confirmer la commande'}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="card h-fit">
                    <h2 className="text-xl font-bold text-white mb-6">Récapitulatif</h2>

                    <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                        {cartItems.map((item) => (
                            <div key={item.event.id} className="flex justify-between items-start pb-3 border-b border-slate-800 last:border-0">
                                <div className="flex-1">
                                    <h3 className="text-white font-medium text-sm">{item.event.name}</h3>
                                    <p className="text-gray-500 text-xs mt-0.5">Quantité: {item.quantity}</p>
                                </div>
                                <div className="text-blue-400 font-bold text-sm">
                                    {item.event.price * item.quantity}€
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <span className="text-gray-400">Sous-total</span>
                            <span className="text-white">{total.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center mb-3 text-sm">
                            <span className="text-gray-400">Frais de service</span>
                            <span className="text-white">0.00€</span>
                        </div>
                        <div className="border-t border-slate-700 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-2xl font-bold text-gradient">{total.toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
