// src/services/cartService.js

const cartService = {
    // Simulated cart data
    cart: [],

    addToCart: (item) => {
        // Add item to the cart
        cartService.cart.push(item);
    },

    removeFromCart: (index) => {
        // Remove item from the cart at the specified index
        cartService.cart.splice(index, 1);
    },

    getCart: () => {
        // Get the current cart contents
        return cartService.cart;
    },

    clearCart: () => {
        // Clear the cart
        cartService.cart = [];
    },
};

export default cartService;
