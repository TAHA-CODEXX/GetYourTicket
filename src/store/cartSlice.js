import { createSlice } from '@reduxjs/toolkit';

const initialState = { items: [] };

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const event = action.payload;
            const existingItem = state.items.find(item => item.event.id === event.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ event, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            const eventId = action.payload;
            state.items = state.items.filter(item => item.event.id !== eventId);
        },
        updateQuantity: (state, action) => {
            const { eventId, quantity } = action.payload;
            const item = state.items.find(item => item.event.id === eventId);

            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(item => item.event.id !== eventId);
                } else {
                    item.quantity = quantity;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state?.cart?.items || [];
export const selectCartCount = (state) => {
    const items = state?.cart?.items || [];
    return items.reduce((total, item) => total + item.quantity, 0);
};
export const selectCartTotal = (state) => {
    const items = state?.cart?.items || [];
    return items.reduce((total, item) => total + (item.event.price * item.quantity), 0);
};

export default cartSlice.reducer;
