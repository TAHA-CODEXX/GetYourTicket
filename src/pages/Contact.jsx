import { useState } from 'react';
import { createContact } from '../services/api';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation manual
        if (!formData.name.trim()) {
            toast.error('Le nom est requis');
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
        if (!formData.message.trim()) {
            toast.error('Le message est requis');
            return;
        }

        setLoading(true);

        try {
            await createContact({
                ...formData,
                submittedAt: new Date().toISOString(),
            });

            toast.success('Message envoyé avec succès!');
            setFormData({ name: '', email: '', message: '' });

        } catch (error) {
            console.error('Error submitting contact form:', error);
            toast.error('Erreur lors de l\'envoi du message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Contactez-<span className="text-gradient">nous</span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Une question ? N'hésitez pas à nous contacter
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="card backdrop-blur-sm bg-white/5 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-6">Envoyez-nous un message</h2>

                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <div>
                                <label className="block text-gray-400 mb-1.5 text-xs font-medium uppercase tracking-wider">Nom</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Votre nom"
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
                                    placeholder="votre.email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1.5 text-xs font-medium uppercase tracking-wider">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="input-field resize-none"
                                    placeholder="Votre message..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Envoi...' : 'Envoyer le message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <div className="card flex items-start space-x-4 backdrop-blur-sm bg-white/5 border border-white/10">
                            <div className="bg-blue-500/10 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm mb-0.5">Email</h3>
                                <p className="text-gray-400 text-sm">contact@eventsphere.com</p>
                            </div>
                        </div>

                        <div className="card flex items-start space-x-4 backdrop-blur-sm bg-white/5 border border-white/10">
                            <div className="bg-purple-500/10 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm mb-0.5">Téléphone</h3>
                                <p className="text-gray-400 text-sm">+33 1 23 45 67 89</p>
                            </div>
                        </div>

                        <div className="card flex items-start space-x-4 backdrop-blur-sm bg-white/5 border border-white/10">
                            <div className="bg-cyan-500/10 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm mb-0.5">Adresse</h3>
                                <p className="text-gray-400 text-sm">123 Avenue des Champs-Élysées<br />75008 Paris, France</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
