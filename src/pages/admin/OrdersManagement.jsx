import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/api';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/admin/dashboard" className="text-blue-500 hover:text-cyan-500 mb-2 inline-block">
                        ← Retour au dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-white">
                        Gestion des <span className="text-gradient">Commandes</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Total: {orders.length} commande(s)</p>
                </div>

                {/* Orders Table */}
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-4 px-4 text-gray-300 hidden md:table-cell">ID</th>
                                <th className="text-left py-4 px-4 text-gray-300">Client</th>
                                <th className="text-left py-4 px-4 text-gray-300 hidden md:table-cell">Email</th>
                                <th className="text-left py-4 px-4 text-gray-300 hidden md:table-cell">Téléphone</th>
                                <th className="text-left py-4 px-4 text-gray-300">Total</th>
                                <th className="text-left py-4 px-4 text-gray-300 hidden md:table-cell">Date</th>
                                <th className="text-left py-4 px-4 text-gray-300">Détails</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-gray-400">
                                        Aucune commande pour le moment
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <>
                                        <tr
                                            key={order.id}
                                            className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                                        >
                                            <td className="py-4 px-4 text-gray-400 hidden md:table-cell">#{order.id}</td>
                                            <td className="py-4 px-4 text-white font-semibold">{order.customerName}</td>
                                            <td className="py-4 px-4 text-gray-400 hidden md:table-cell">{order.email}</td>
                                            <td className="py-4 px-4 text-gray-400 hidden md:table-cell">{order.phone}</td>
                                            <td className="py-4 px-4 text-blue-500 font-bold">{order.totalPrice.toFixed(2)}€</td>
                                            <td className="py-4 px-4 text-gray-400 hidden md:table-cell">
                                                {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() => toggleExpand(order.id)}
                                                    className="bg-purple-500 hover:bg-purple-500/80 text-white p-2 rounded-lg transition-colors"
                                                    title={expandedOrder === order.id ? 'Masquer' : 'Voir détails'}
                                                >
                                                    {expandedOrder === order.id ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedOrder === order.id && (
                                            <tr className="bg-slate-900">
                                                <td colSpan="7" className="py-4 px-4">
                                                    <div className="space-y-2">
                                                        <h4 className="text-white font-semibold mb-3">Articles commandés:</h4>
                                                        {order.items.map((item, index) => (
                                                            <div key={index} className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                                                                <div>
                                                                    <span className="text-white">{item.eventName}</span>
                                                                    <span className="text-gray-400 ml-2">x{item.quantity}</span>
                                                                </div>
                                                                <span className="text-blue-500 font-semibold">
                                                                    {(item.price * item.quantity).toFixed(2)}€
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersManagement;
