import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents } from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [eventsRes, ordersRes] = await Promise.all([
                    getEvents(),
                    getOrders()
                ]);

                const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalPrice, 0);

                setStats({
                    totalEvents: eventsRes.data.length,
                    totalOrders: ordersRes.data.length,
                    totalRevenue: totalRevenue,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Dashboard <span className="text-gradient">Admin</span>
                        </h1>
                        <p className="text-gray-400">Gérez vos événements et commandes</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary"
                    >
                        Déconnexion
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card bg-gradient-to-br from-blue-500 to-cyan-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 mb-2">Total Événements</p>
                                <p className="text-4xl font-bold text-white">{stats.totalEvents}</p>
                            </div>
                            <div className="text-5xl">🎫</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-500 to-pink-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 mb-2">Total Commandes</p>
                                <p className="text-4xl font-bold text-white">{stats.totalOrders}</p>
                            </div>
                            <div className="text-5xl">📦</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500 to-emerald-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 mb-2">Revenu Total</p>
                                <p className="text-4xl font-bold text-white">{stats.totalRevenue.toFixed(2)}€</p>
                            </div>
                            <div className="text-5xl">💰</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/admin/events" className="card hover:scale-105 transform transition-all duration-300 group">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-500/20 p-4 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">
                                    Gérer les événements
                                </h3>
                                <p className="text-gray-400">Ajouter, modifier ou supprimer des événements</p>
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/orders" className="card hover:scale-105 transform transition-all duration-300 group">
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-500/20 p-4 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-purple-500 transition-colors">
                                    Voir les commandes
                                </h3>
                                <p className="text-gray-400">Consulter toutes les commandes clients</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
