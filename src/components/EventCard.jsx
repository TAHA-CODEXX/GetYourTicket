const EventCard = ({ event, onAddToCart }) => {
    return (
        <div className="card group hover:scale-[1.02] transform transition-all duration-300 flex flex-col h-full bg-slate-900 border-slate-800 p-3">
            {/* Event Image */}
            <div className="relative overflow-hidden rounded-md mb-3 aspect-video">
                <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                    <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-slate-700">
                        {event.category}
                    </span>
                </div>
            </div>

            {/* Event Info */}
            <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {event.name}
                        </h3>
                        <p className="text-gray-400 text-xs line-clamp-2 mt-1">
                            {event.description}
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-400">
                        {event.price}€
                    </span>

                    <button
                        onClick={() => onAddToCart(event)}
                        className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 
                     text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                        title="Ajouter au panier"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>      </div>
    );
};

export default EventCard;
