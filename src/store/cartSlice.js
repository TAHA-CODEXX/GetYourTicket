import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage on app startup
const loadCartFromLocalStorage = () => {
    try {
        if (typeof window === 'undefined') return { items: [] };
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : { items: [] };
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return { items: [] };
    }
};

const initialState = loadCartFromLocalStorage();

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (items) => {
    try {
        if (typeof window === 'undefined') return;
        localStorage.setItem('cart', JSON.stringify({ items }));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const event = action.payload;
            
            // Find existing item by id (handle both 'id' and '_id')
            const eventId = event?.id || event?._id;
            if (!eventId) {
                console.warn('Event has no id or _id:', event);
                // still try to add the object as-is to avoid breaking UX
                state.items.push({ event, quantity: 1 });
                saveCartToLocalStorage(state.items);
                return;
            }
            
            const existingItem = state.items.find(item => ((item.event?.id) || (item.event?._id)) === eventId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ event, quantity: 1 });
            }
            saveCartToLocalStorage(state.items);
        },
        removeFromCart: (state, action) => {
            const eventId = action.payload;
            state.items = state.items.filter(item => ((item.event?.id) || (item.event?._id)) !== eventId);
            saveCartToLocalStorage(state.items);
        },
        updateQuantity: (state, action) => {
            const { eventId, quantity } = action.payload;
            const item = state.items.find(item => ((item.event?.id) || (item.event?._id)) === eventId);

            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(item => ((item.event?.id) || (item.event?._id)) !== eventId);
                } else {
                    item.quantity = quantity;
                }
            }
            saveCartToLocalStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveCartToLocalStorage(state.items);
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => {
    const items = state?.cart?.items || [];
    // Normalize legacy shapes: if items are plain event objects (no `event` wrapper), convert them
    if (items.length > 0 && !items[0].event && (items[0].id || items[0]._id)) {
        return items.map(evt => ({ event: evt, quantity: 1 }));
    }
    return items;
};

export const selectCartCount = (state) => {
    const items = selectCartItems(state);
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
};

export const selectCartTotal = (state) => {
    const items = selectCartItems(state);
    return items.reduce((total, item) => {
        const price = item?.event?.price ?? item?.price ?? 0;
        const qty = item?.quantity ?? 0;
        return total + (price * qty);
    }, 0);
};

export default cartSlice.reducer;
