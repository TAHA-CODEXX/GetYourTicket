import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/api';

import { uploadImage } from '../../services/cloudinary';

const EventsManagement = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
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

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            name: event.name,
            description: event.description,
            category: event.category,
            image: event.image,
            price: event.price.toString(),
            date: event.date,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        setEventToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        try {
            await deleteEvent(eventToDelete);
            fetchEvents();
            setShowDeleteModal(false);
            setEventToDelete(null);
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Erreur lors de la suppression');
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setEventToDelete(null);
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
        setEditingEvent(null);
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

                {/* Events Table */}
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-4 px-4 text-gray-300">Image</th>
                                <th className="text-left py-4 px-4 text-gray-300">Nom</th>
                                <th className="text-left py-4 px-4 text-gray-300 hidden md:table-cell">Catégorie</th>
                                <th className="text-left py-4 px-4 text-gray-300 hidden md:table-cell">Prix</th>
                                <th className="text-left py-4 px-4 text-gray-300 hidden md:table-cell">Date</th>
                                <th className="text-left py-4 px-4 text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <img src={event.image} alt={event.name} className="w-16 h-16 object-cover rounded-lg" />
                                    </td>
                                    <td className="py-4 px-4 text-white font-semibold">{event.name}</td>
                                    <td className="py-4 px-4 hidden md:table-cell">
                                        <span className="bg-purple-500/20 text-purple-500 px-3 py-1 rounded-full text-sm">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-blue-500 font-bold hidden md:table-cell">{event.price}€</td>
                                    <td className="py-4 px-4 text-gray-400 hidden md:table-cell">{event.date}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="card max-w-sm w-full bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/30 shadow-2xl">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.228 6.228a9 9 0 1012.544 12.544M6.228 6.228L2.5 2.5m9.728 9.728l3.728 3.728m0 0l3.728 3.728M19.5 19.5l-3.728-3.728" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 text-center">Confirmer la suppression</h3>
                            <p className="text-gray-300 text-center mb-6">Êtes-vous certain de vouloir supprimer cet événement? Cette action est irréversible.</p>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-lg"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsManagement;
