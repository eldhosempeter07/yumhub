// src/services/restaurantService.js

const restaurantService = {
    login: async (email, password) => {
        // Simulate API call for restaurant login
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if email and password are correct
                if (email === 'restaurant@example.com' && password === 'password') {
                    resolve({ success: true, message: 'Login successful' });
                } else {
                    reject({ success: false, message: 'Invalid email or password' });
                }
            }, 1000); // Simulating delay for API call
        });
    },

    logout: async () => {
        // Simulate API call for restaurant logout
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Logout successful' });
            }, 500); // Simulating delay for API call
        });
    },

    // Simulated restaurant data
    restaurants: [
        { id: 1, name: 'Restaurant 1', isOpen: true },
        { id: 2, name: 'Restaurant 2', isOpen: false },
        { id: 3, name: 'Restaurant 3', isOpen: true },
    ],

    getRestaurants: async () => {
        // Simulate API call to fetch restaurants
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(restaurantService.restaurants);
            }, 500); // Simulating delay for API call
        });
    },

    addRestaurant: async (name, isOpen) => {
        // Simulate API call to add a new restaurant
        const newRestaurant = { id: Date.now(), name, isOpen };
        restaurantService.restaurants.push(newRestaurant);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(newRestaurant);
            }, 500); // Simulating delay for API call
        });
    },

    updateRestaurant: async (id, name, isOpen) => {
        // Simulate API call to update a restaurant
        const index = restaurantService.restaurants.findIndex((r) => r.id === id);
        if (index !== -1) {
            restaurantService.restaurants[index] = { id, name, isOpen };
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(restaurantService.restaurants[index]);
            }, 500); // Simulating delay for API call
        });
    },

    deleteRestaurant: async (id) => {
        // Simulate API call to delete a restaurant
        const index = restaurantService.restaurants.findIndex((r) => r.id === id);
        if (index !== -1) {
            const deletedRestaurant = restaurantService.restaurants.splice(index, 1)[0];
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(deletedRestaurant);
                }, 500); // Simulating delay for API call
            });
        }
        return Promise.reject({ success: false, message: 'Restaurant not found' });
    },
};

export default restaurantService;
