// src/services/orderService.js

const orderService = {
    // Simulated order data
    orders: [
        { id: 1, userId: 1, items: ['Burger', 'Fries'], status: 'Pending' },
        { id: 2, userId: 1, items: ['Pizza', 'Salad'], status: 'Delivered' },
        { id: 3, userId: 2, items: ['Sushi', 'Ramen'], status: 'Preparing' },
    ],

    getOrdersByUser: async (userId) => {
        // Simulate API call to fetch orders by user ID
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(orderService.orders.filter((order) => order.userId === userId));
            }, 500); // Simulating delay for API call
        });
    },

    placeOrder: async (userId, items) => {
        // Simulate API call to place a new order
        const newOrder = { id: Date.now(), userId, items, status: 'Pending' };
        orderService.orders.push(newOrder);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(newOrder);
            }, 500); // Simulating delay for API call
        });
    },

    updateOrderStatus: async (orderId, status) => {
        // Simulate API call to update order status
        const index = orderService.orders.findIndex((order) => order.id === orderId);
        if (index !== -1) {
            orderService.orders[index].status = status;
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(orderService.orders[index]);
            }, 500); // Simulating delay for API call
        });
    },
};

export default orderService;
