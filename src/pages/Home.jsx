import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEvents, getCategories } from '../services/api';
import StatsCounter from '../components/StatsCounter';
import Testimonials from '../components/Testimonials';

const categoryIcons = {
    "Musique": (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
    ),
    "Art": (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
    ),
    "Spectacle": (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    "Football": (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const Home = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, categoriesRes] = await Promise.all([
                    getEvents(),
                    getCategories()
                ]);
                setFeaturedEvents(eventsRes.data.slice(0, 3));
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                        Bienvenue sur <span className="text-gradient">EventSphere</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Découvrez les événements les plus extraordinaires et réservez vos tickets en quelques clics
                    </p>
                    <Link
                        to="/events"
                        className="btn-primary inline-block animate-slide-up"
                        style={{ animationDelay: '0.4s' }}
                    >
                        Voir tous les événements
                    </Link>
                </div>
            </section>


            {/* Stats Section */}
            <StatsCounter />

            {/* Featured Events */}
            <section className="max-w-7xl mx-auto px-4 py-16 relative z-10">
                <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    Événements à venir
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredEvents.map((event, index) => (
                        <div
                            key={event.id}
                            className="card hover:scale-105 transform transition-all duration-300 backdrop-blur-sm bg-white/5"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <img
                                src={event.image}
                                alt={event.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                            <p className="text-gray-400 text-sm mb-4">{event.description.substring(0, 100)}...</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-gradient">{event.price}€</span>
                                <span className="text-purple-500 text-sm">{event.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="max-w-7xl mx-auto px-4 py-16 relative z-10">
                <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    Nos Catégories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            to={`/events?category=${category.name}`}
                            className="card text-center hover:scale-110 transform transition-all duration-300 group backdrop-blur-sm bg-white/5"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="mb-4 text-blue-500 group-hover:scale-125 transition-transform duration-300">
                                {categoryIcons[category.name] || (
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-gradient transition-colors">
                                {category.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <Testimonials />
        </div>
    );
};

export default Home;
