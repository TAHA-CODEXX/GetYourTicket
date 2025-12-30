import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getEvents } from '../services/api';
import { addToCart } from '../store/cartSlice';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const categories = ['All', 'Musique', 'Art', 'Spectacle', 'Football'];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getEvents();
                setEvents(response.data);
                // Initial filter will be handled by the other useEffect
            } catch (error) {
                console.error('Error fetching events:', error);
                toast.error('Erreur lors du chargement des événements');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Handle filtering for both category and search query
    useEffect(() => {
        let result = events;

        // 1. Filter by category
        const categoryParam = searchParams.get('category');
        const activeCategory = categoryParam || selectedCategory;

        // Update selected category if it comes from params
        if (categoryParam && categoryParam !== selectedCategory) {
            setSelectedCategory(categoryParam);
        }

        if (activeCategory !== 'All') {
            result = result.filter(event => event.category === activeCategory);
        }

        // 2. Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(event =>
                event.name.toLowerCase().includes(query)
            );
        }

        setFilteredEvents(result);
    }, [events, selectedCategory, searchQuery, searchParams]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        // Remove query param if user manually clicks a filter to avoid confusion
        // or keep it, but here we just set state
    };

    const handleAddToCart = (event) => {
        dispatch(addToCart(event));
        toast.success(`${event.name} ajouté au panier!`, {
            icon: '🎫',
            style: {
                borderRadius: '10px',
                background: '#1e293b',
                color: '#fff',
            },
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-blue-400 animate-pulse font-medium">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Tous les <span className="text-gradient">Événements</span>
                </h1>
                <p className="text-gray-400 text-sm">
                    Découvrez notre sélection d'événements exceptionnels
                </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 backdrop-blur-sm ${selectedCategory === category
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="max-w-md mx-auto mb-10 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full
                   text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50
                   transition-all duration-300 hover:border-white/20"
                    placeholder="Rechercher un événement..."
                />
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-4xl mb-3">🎫</div>
                    <h3 className="text-lg text-gray-400">Aucun événement trouvé</h3>
                </div>
            )}
        </div>
    );
};

export default Events;
