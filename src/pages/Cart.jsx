import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity } from '../store/cartSlice';

const Cart = () => {
    const cartItems = useSelector(selectCartItems) || [];
    const total = useSelector(selectCartTotal) || 0;
    const dispatch = useDispatch();

    const handleQuantityChange = (eventId, newQuantity) => {
        dispatch(updateQuantity({ eventId: eventId, quantity: newQuantity }));
    };

    const handleRemove = (eventId) => {
        dispatch(removeFromCart(eventId));
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Votre panier est vide</h2>
                    <p className="text-gray-400 mb-6 text-sm">Découvrez nos événements et ajoutez vos favoris!</p>
                    <Link to="/events" className="btn-primary inline-flex">Parcourir les événements</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Votre <span className="text-gradient">Panier</span></h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-3">
                    {cartItems.map(function(item, idx) {
                        const event = item && item.event ? item.event : item || {};
                        const key = (event.id || event._id || event.name) || idx;
                        const price = event.price ? event.price : 0;
                        const qty = item.quantity ? item.quantity : 1;
                        return (
                            <div key={key} className="card p-3 flex gap-4 bg-slate-900 border-slate-800">
                                <img src={event.image || ''} alt={event.name || 'event'} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-base font-bold text-white truncate pr-2">{event.name}</h3>
                                            <p className="text-purple-400 text-xs">{event.category}</p>
                                        </div>
                                        <button onClick={() => handleRemove(event.id || event._id)} className="text-gray-500 hover:text-red-500 transition-colors p-1" title="Supprimer">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center space-x-3 bg-slate-800 rounded px-2 py-1">
                                            <button onClick={() => handleQuantityChange(event.id || event._id, qty - 1)} disabled={qty <= 1} className={"w-5 h-5 flex items-center justify-center font-bold transition-colors " + (qty <= 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white') }>-</button>
                                            <span className="text-white text-sm font-semibold w-4 text-center">{qty}</span>
                                            <button onClick={() => handleQuantityChange(event.id || event._id, qty + 1)} className="text-gray-400 hover:text-white transition-colors w-5 h-5 flex items-center justify-center font-bold">+</button>
                                        </div>

                                        <div className="text-lg font-bold text-blue-400">{(price * qty) + '€'}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="lg:col-span-1">
                    <div className="card sticky top-24 bg-slate-900 border-slate-800">
                        <h2 className="text-lg font-bold text-white mb-4">Résumé</h2>

                        <div className="space-y-2 mb-4 text-sm">
                            {cartItems.map(function(item, idx) {
                                const event = item && item.event ? item.event : item || {};
                                const key = (event.id || event._id || event.name) || idx;
                                const price = event.price ? event.price : 0;
                                const qty = item.quantity ? item.quantity : 1;
                                return (
                                    <div key={key} className="flex justify-between text-gray-400">
                                        <span className="truncate pr-4 flex-1">{event.name} <span className="text-gray-600">x{qty}</span></span>
                                        <span className="whitespace-nowrap">{(price * qty) + '€'}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-slate-700 pt-3 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-base font-bold text-white">Total</span>
                                <span className="text-xl font-bold text-gradient">{(total || 0).toFixed(2) + '€'}</span>
                            </div>
                        </div>

                        <Link to="/checkout" className="btn-primary w-full text-center block">Procéder au paiement</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
