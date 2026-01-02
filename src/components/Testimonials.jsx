import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTestimonials } from '../services/api';
import toast from 'react-hot-toast';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await getTestimonials();
                setTestimonials(response.data);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            }
        };
        fetchTestimonials();
    }, []);

    const handleFeedbackClick = () => {
        toast('Donnez-nous votre avis si vous le souhaitez !', {
            icon: '✍️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        navigate('/contact');
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-16 relative z-10">
            <div className="flex justify-center items-center mb-12 relative">
                <h2 className="text-4xl font-bold text-white text-center">
                    Ce que disent nos <span className="text-gradient">Clients</span>
                </h2>
                <button
                    onClick={handleFeedbackClick}
                    className="absolute right-0 md:right-10 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-90 group"
                    title="Donnez votre avis"
                >
                    <span className="group-hover:hidden">+</span>
                    <svg className="hidden group-hover:block w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={testimonial.id}
                        className="p-6 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                        style={{ animationDelay: `${index * 0.2}s` }}
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                            />
                            <div>
                                <h3 className="text-white font-bold">{testimonial.name}</h3>
                                <p className="text-blue-400 text-xs">{testimonial.role}</p>
                            </div>
                        </div>
                        <div className="flex mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-gray-300 text-sm italic">"{testimonial.content}"</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
