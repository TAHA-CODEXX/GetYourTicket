import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/api';

import { uploadImage } from '../../services/cloudinary';

const EventsManagement = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [uploading, setUploading] = useState(false); // New state for upload status
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Musique',
        image: '',
        price: '',
        date: '',
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await getEvents();
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadImage(file);
            setFormData(prev => ({ ...prev, image: imageUrl }));
        } catch (error) {
            alert("Erreur lors de l'upload de l'image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const eventData = {
                ...formData,
                price: parseFloat(formData.price),
            };

            if (editingEvent) {
                await updateEvent(editingEvent.id, eventData);
            } else {
                await createEvent(eventData);
            }

            fetchEvents();
            resetForm();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: 'Musique',
            image: '',
            price: '',
            date: '',
        });
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <Link to="/admin/dashboard" className="text-blue-500 hover:text-cyan-500 mb-2 inline-block">
                            ← Retour au dashboard
                        </Link>
                        <h1 className="text-4xl font-bold text-white">
                            Gestion des <span className="text-gradient">Événements</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        + Nouvel événement
                    </button>
                </div>
                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
                                </h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">Nom</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="input-field resize-none"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Catégorie</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="Musique">Musique</option>
                                            <option value="Art">Art</option>
                                            <option value="Spectacle">Spectacle</option>
                                            <option value="Football">Football</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2">Prix (€)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Image</label>
                                    <div className="flex gap-4 items-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="input-field"
                                            disabled={uploading}
                                        />
                                        {uploading && <span className="text-blue-500">Upload en cours...</span>}
                                    </div>
                                    {formData.image && (
                                        <div className="mt-2 relative group w-fit">
                                            <img
                                                src={formData.image}
                                                alt="Aperçu"
                                                className="h-20 w-20 object-cover rounded-lg border border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button type="submit" className="btn-primary flex-1">
                                        {editingEvent ? 'Mettre à jour' : 'Créer'}
                                    </button>
                                    <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsManagement;

