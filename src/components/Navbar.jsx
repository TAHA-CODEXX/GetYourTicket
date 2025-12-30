import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/cartSlice';
import { useState } from 'react';

const Navbar = () => {
    const cartCount = useSelector(selectCartCount);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-black/20 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gradient">EventSphere</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-blue-500 transition-colors font-medium">
                            Accueil
                        </Link>
                        <Link to="/events" className="text-gray-300 hover:text-blue-500 transition-colors font-medium">
                            Événements
                        </Link>
                        <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">
                            Contact
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link
                            to="/admin/login"
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-gray-300 py-1.5 px-3 rounded-full border border-slate-700 transition-all hover:border-blue-500/50"
                            title="Section réservée aux administrateurs"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Admin Login</span>
                        </Link>

                        {/* Cart Icon */}
                        <Link to="/cart" className="relative group">
                            <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="badge">{cartCount}</span>
                            )}
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-3 animate-fade-in">
                        <Link to="/" className="block text-white hover:text-blue-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            Accueil
                        </Link>
                        <Link to="/events" className="block text-white hover:text-blue-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            Événements
                        </Link>
                        <Link to="/contact" className="block text-white hover:text-blue-500 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            Contact
                        </Link>
                        <Link to="/admin/login" className="block text-gray-400 hover:text-purple-500 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                            Admin
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
