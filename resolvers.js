const { AuthenticationError } = require("apollo-server-express");
const fs = require("fs");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {
  Order,
  Resturant,
  User,
  Item,
  Cart,
  Address,
  Payment,
  Favourite,
  Timing,
  Notification,
} = require("./models");
const { hashPassword, verifyPassword } = require("./utils/utils");
const jwt = require("jsonwebtoken");
const path = require("path");

const resolvers = {
  Query: {
    foodItems: async () => {
      const foodItems = await Item.find();
      return foodItems;
    },
    foodItemsByRestaurant: async (_, { id }) => {
      const foodItems = await Item.find({ restaurantId: id });
      return foodItems;
    },
    orders: async (_, __, { user }) => {
      const order = await Order.find({ userId: user.email }).sort({
        createdAt: -1,
      });
      return order;
    },
    favourite: async (_, __, { user }) => {
      const favourite = await Favourite.findOne({ userId: user.email });
      const ids = favourite?.itemId;
      const favouriteItems = await Item.find({
        _id: { $in: ids },
      });
      favourite.items = favouriteItems;
      return favourite;
    },
    restaurant: async (_, { filter }) => {
      const { search, category } = filter;
      let query = {};
      if (search != "") {
        query.name = { $regex: search, $options: "i" };
      }
      if (category.length > 0) {
        query.type = { $in: category };
      }
      try {
        const restaurants = await Resturant.find(
          category?.length > 0 || search !== "" ? query : null
        );
        return restaurants;
      } catch (error) {
        throw new Error(`Error fetching restaurants: ${error.message}`);
      }
    },
    userInfo: async (_, __, { user }) => {
      try {
        const userInfo = await User.findOne({ email: user?.email });
        return userInfo;
      } catch (error) {
        return { message: error };
      }
    },
    restaurantById: async (_, { id }) => {
      try {
        const restaurant = await Resturant.findOne({ _id: id });
        const menuIds = restaurant.menu;
        const items = await Item.find({ _id: { $in: menuIds } });
        restaurant.menu = items;
        return restaurant;
      } catch (error) {
        return { message: error };
      }
    },

    restaurantByEmail: async (_, { email }) => {
      try {
        const restaurant = await Resturant.findOne({ email: email });
        const menuIds = restaurant.menu;
        const items = await Item.find({ _id: { $in: menuIds } });
        restaurant.menu = items;
        return restaurant;
      } catch (error) {
        return { message: error };
      }
    },
    cart: async (_, __, { user }) => {
      try {
        if (!user) {
          return { total: 0, totalCount: 0, cartItems: [] };
        }

        // Fetch all carts for the user
        const carts = await Cart.find({ userId: user?.email });
        if (!carts || carts.length === 0) {
          return { total: 0, totalCount: 0, cartItems: [] };
        }

        // Flatten all items from multiple carts
        const allItems = carts.flatMap((cart) =>
          cart.items.map((item) => ({
            ...item,
            cartId: cart._id, // Include cartId for reference
            restaurantId: cart.restaurantId,
            cartTotalCount: cart.totalCount, // Include totalCount from the cart
          }))
        );

        // Extract item IDs
        const ids = allItems.map((item) => item.id);
        const Cartitems = await Item.find({ _id: { $in: ids } });

        // Update cart items with detailed information
        const updatedCartItems = allItems.map((item) => {
          const matchingItem = Cartitems.find((cartItem) =>
            cartItem._id.equals(item.id)
          );
          return {
            ...item,
            ...(matchingItem ? matchingItem.toObject() : {}),
          };
        });

        // Group items by restaurant and calculate total and totalCount
        const groupedByRestaurant = updatedCartItems.reduce((acc, item) => {
          const restaurantId = item.restaurantId;
          if (!acc[restaurantId]) {
            acc[restaurantId] = {
              restaurantId,
              items: [],
              total: 0,
              totalCount: 0,
            };
          }
          acc[restaurantId].items.push(item);
          acc[restaurantId].total += item.price * item.count;
          acc[restaurantId].totalCount += item.count; // Aggregate totalCount based on item count
          return acc;
        }, {});

        const restaurantIds = Object.keys(groupedByRestaurant);
        const restaurants = await Resturant.find({
          _id: { $in: restaurantIds },
        });

        restaurantIds.forEach((restaurantId) => {
          const restaurant = restaurants.find((res) =>
            res._id.equals(restaurantId)
          );
          if (restaurant) {
            groupedByRestaurant[restaurantId].restaurantName = restaurant.name;
          }
        });

        // Calculate the total price and total count of items from all carts
        const total = Object.values(groupedByRestaurant).reduce(
          (sum, group) => sum + group.total,
          0
        );
        const totalCount = Object.values(groupedByRestaurant).reduce(
          (sum, group) => sum + group.totalCount,
          0
        );

        // Convert grouped object to an array
        const groupedCartArray = Object.values(groupedByRestaurant).map(
          (group) => ({
            ...group,
            total: group.total.toFixed(2),
          })
        );

        return {
          userId: user?.email,
          total: total.toFixed(2),
          totalCount,
          cartItems: groupedCartArray,
        };
      } catch (error) {
        console.error(error);
        return { total: 0, totalCount: 0, cartItems: [] };
      }
    },

    address: async (_, __, { user }) =>
      await Address.find({ userId: user.email }),
    addressById: async (_, { id }) => {
      const address = await Address.findOne({ _id: id });
      return address;
    },
    payment: async () => await Payment.find(),

    restaurantInfo: async (_, __, { user }) => {
      try {
        const userInfo = await Resturant.findOne({ email: user?.email });
        return userInfo;
      } catch (error) {
        return { message: error };
      }
    },

    getRestaurantTimingByDay: async (_, { timing }) => {
      try {
        const { day, id } = timing;
        const timingByDay = await Timing.findOne({ day, restaurantId: id });
        return timingByDay;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch restaurant timings");
      }
    },

    notifications: async (_, __, { user }) => {
      try {
        const notifications = await Notification.find({
          userId: user?.email,
        }).sort({
          date: -1,
        });
        return notifications;
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },

    // Resturant

    restaurantItems: async (_, __, { user }) => {
      const restaurant = await Resturant.findOne({ email: user.email });
      const foodItems = await Item.find({ restaurantId: restaurant?._id });
      return foodItems;
    },

    restaurantItemById: async (_, { id }) => {
      const foodItems = await Item.findOne({ _id: id });
      return foodItems;
    },

    restaurantOrders: async (_, __, { user }) => {
      if (!user || !user.email) {
        return [];
      }

      try {
        const restaurant = await Resturant.findOne({ email: user.email });
        const orders = await Order.find({
          orderItems: {
            $elemMatch: {
              restaurantName: restaurant?.name,
            },
          },
        }).sort({
          createdAt: -1,
        });

        const formattedOrders = orders.map((order) => ({
          ...order?._doc,
          orderItems: order.orderItems.filter(
            (item) => item.restaurantName === restaurant?.name
          ),
        }));

        return formattedOrders;
      } catch (error) {
        console.error("Error fetching restaurant orders:", error);
        return [];
      }
    },

    restaurantOrderById: async (_, { id }, { user }) => {
      if (!user || !user.email) {
        return null;
      }

      try {
        const restaurant = await Resturant.findOne({ email: user.email });
        if (!restaurant) {
          throw new Error("Restaurant not found.");
        }

        const order = await Order.findOne({
          _id: id,
          orderItems: {
            $elemMatch: {
              restaurantName: restaurant.name,
            },
          },
        });

        if (!order) {
          throw new Error("Order not found.");
        }

        const formattedOrder = {
          ...order._doc,
          orderItems: order.orderItems.filter(
            (item) => item.restaurantName === restaurant.name
          ),
        };

        return formattedOrder;
      } catch (error) {
        console.error("Error fetching restaurant order by ID:", error);
        return null;
      }
    },

    restaurantMonthlyOrders: async (_, __, { user }) => {
      const currentDate = new Date();
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const restaurant = await Resturant.findOne({ email: user.email });

      const orders = await Order.find({
        "orderItems.restaurantId": restaurant?.id,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      const dailyOrders = Array(31).fill(0);

      orders.forEach((order) => {
        const orderDate = order.createdAt;
        if (
          orderDate.getMonth() === currentDate.getMonth() &&
          orderDate.getFullYear() === currentDate.getFullYear()
        ) {
          dailyOrders[orderDate.getDate() - 1] += 1;
        }
      });
      const day = Array.from({ length: 32 }, (_, index) => index + 1);

      const result = dailyOrders.map((order, index) => ({
        order,
        day: day[index],
      }));

      return result;
    },

    getRestaurantTimings: async (_, __, { user }) => {
      try {
        const timings = await Timing.find({ restaurantId: user?.email });
        return timings;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch restaurant timings");
      }
    },
    getRestaurantTiming: async (_, { id }) => {
      try {
        return await Timing.findById({ _id: id });
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch restaurant timing");
      }
    },
    restaurants: async () => {
      try {
        const restaurants = await Resturant.find();
        return restaurants;
      } catch (error) {
        throw new Error(`Error fetching restaurants: ${error.message}`);
      }
    },
    users: async () => {
      try {
        const users = await User.find({ name: { $ne: "Admin" } });
        return users;
      } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
      }
    },

    adminOrders: async () => {
      try {
        const orders = await Order.find().sort({
          createdAt: -1,
        });
        return orders;
      } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
      }
    },

    adminRestaurantOrderById: async (_, { id, restaurantId }) => {
      try {
        const restaurant = await Resturant.findById(restaurantId);
        if (!restaurant) {
          throw new Error("Restaurant not found.");
        }
        const order = await Order.findOne({
          _id: id,
          orderItems: {
            $elemMatch: {
              restaurantName: restaurant.name,
            },
          },
        });

        if (!order) {
          throw new Error("Order not found.");
        }

        const formattedOrder = {
          ...order._doc,
          orderItems: order.orderItems.filter(
            (item) => item.restaurantName === restaurant.name
          ),
        };

        return formattedOrder;
      } catch (error) {
        console.error("Error fetching restaurant order by ID:", error);
        return null;
      }
    },

    adminRestaurantInfo: async (_, { id }) => {
      try {
        const userInfo = await Resturant.findById(id);
        return userInfo;
      } catch (error) {
        return { message: error };
      }
    },

    adminUserInfo: async (_, { id }) => {
      try {
        const userInfo = await User.findById(id);
        return userInfo;
      } catch (error) {
        return { message: error };
      }
    },

    // adminMonthlyOrders: async () => {
    //   const currentDate = new Date();
    //   const startDate = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     1
    //   );
    //   const endDate = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth() + 1,
    //     0
    //   );

    //   const orders = await Order.find({
    //     createdAt: {
    //       $gte: startDate,
    //       $lte: endDate,
    //     },
    //   });

    //   const dailyOrders = Array(31).fill(0);

    //   orders.forEach((order) => {
    //     const orderDate = order.createdAt;
    //     if (
    //       orderDate.getMonth() === currentDate.getMonth() &&
    //       orderDate.getFullYear() === currentDate.getFullYear()
    //     ) {
    //       dailyOrders[orderDate.getDate() - 1] += 1;
    //     }
    //   });
    //   const day = Array.from({ length: 32 }, (_, index) => index + 1);

    //   const result = dailyOrders.map((order, index) => ({
    //     order,
    //     day: day[index],
    //   }));

    //   return result;
    // },

    adminMonthlyOrders: async (_, { monthName }) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const monthIndex = monthNames.indexOf(monthName);

      if (monthIndex === -1) {
        throw new Error("Invalid month name provided.");
      }

      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), monthIndex, 1);
      const endDate = new Date(currentDate.getFullYear(), monthIndex + 1, 0);

      const daysInMonth = endDate.getDate();

      const orders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      const dailyOrders = Array(daysInMonth).fill(0);

      orders.forEach((order) => {
        const orderDate = order.createdAt;
        if (
          orderDate.getMonth() === monthIndex &&
          orderDate.getFullYear() === currentDate.getFullYear()
        ) {
          dailyOrders[orderDate.getDate() - 1] += 1;
        }
      });

      const day = Array.from({ length: daysInMonth }, (_, index) => index + 1);

      const result = dailyOrders.map((order, index) => ({
        order,
        day: day[index],
      }));

      return result;
    },
  },
  Mutation: {
    createRestaurant: async (_, { restaurant }) => {
      const Res = await Resturant.findOne({ email: restaurant?.email });
      if (Res) {
        return { message: "Already registered with this email" };
      }
      const restaurantInfo = new Resturant(restaurant);
      const password = await hashPassword(restaurant.password);
      restaurantInfo.password = password;
      await restaurantInfo.save();
      return restaurantInfo;
    },

    restaurantLogin: async (_, { restaurant }) => {
      try {
        const loginRestaurant = await Resturant.findOne({
          email: restaurant?.email,
        });

        if (loginRestaurant != null) {
          if (loginRestaurant.status !== "Approved") {
            return {
              message: `Your Account Status is ${loginRestaurant.status}`,
            };
          }
          const password = await verifyPassword(
            restaurant.password,
            loginRestaurant.password
          );
          if (password) {
            const token = jwt.sign(
              { email: restaurant?.email },
              process.env.JWT_SECRET,
              { expiresIn: 86400 }
            );
            return {
              user: loginRestaurant,
              token,
              message: "Sucessfully logged in",
              type: "business",
            };
          } else {
            throw new AuthenticationError("Incorrect Password");
          }
        } else {
          throw new AuthenticationError("Incorrect Username");
        }
      } catch (error) {
        return { message: error };
      }
    },

    // User
    registerUser: async (_, { user }) => {
      try {
        const UserInfo = await User.findOne({ email: user?.email });
        if (UserInfo) {
          return { message: "Already registered with this email" };
        }
        const password = await hashPassword(user.password);
        user.password = password;
        const newUser = await User.create(user);
        return newUser;
      } catch (error) {
        return { message: error };
      }
    },

    loginUser: async (_, { user }) => {
      try {
        const loginUser = await User.findOne({ email: user?.email });

        if (loginUser != null) {
          if (loginUser.status !== "Approved") {
            return { message: `Your Account Status is ${loginUser.status}` };
          }
          const password = await verifyPassword(
            user.password,
            loginUser.password
          );
          if (password) {
            const token = jwt.sign(
              { email: user?.email },
              process.env.JWT_SECRET,
              { expiresIn: 86400 }
            );
            return {
              user: loginUser,
              token,
              message: "Sucessfully logged in",
              type: "user",
            };
          } else {
            throw new AuthenticationError("Incorrect Password");
          }
        } else {
          throw new AuthenticationError("Incorrect Username");
        }
      } catch (error) {
        return { message: error };
      }
    },

    updateUser: async (_, { user }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { email: user?.email },
          user
        );
        return updatedUser;
      } catch (error) {
        return { message: error };
      }
    },

    addToCart: async (_, { cartItems }, { user }) => {
      const { restaurantId, item } = cartItems;
      let cart = await Cart.findOne({
        userId: user?.email,
        restaurantId: restaurantId,
      });
      if (cart == null && restaurantId != null) {
        cart = new Cart({
          userId: user?.email,
          restaurantId: restaurantId,
          items: [],
          totalCount: 0,
        });
        await cart.save();
      }

      const { id, count } = item;
      const existingItem = cart.items.find((i) => i.id === id);
      if (existingItem) {
        existingItem.count += count;
      } else {
        cart.items.push({ id, count });
      }

      cart.markModified("items");

      cart.totalCount = cart.items.reduce(
        (total, item) => total + item.count,
        0
      );

      await cart.save();

      return cart;
    },

    addAddress: async (_, { address }, { user }) => {
      try {
        const addresses = await Address.find({ userId: user.email });
        if (addresses.length == 0) {
          address.primary = true;
        }
        if (address?.primary && addresses.length > 0) {
          await Address.updateMany(
            { userId: user?.email, primary: true },
            { $set: { primary: false } }
          );
        }
        address.userId = user?.email;
        const addressInfo = Address.create(address);
        return addressInfo;
      } catch (error) {
        console.log(error);
      }
    },

    updateAddress: async (_, { address }, { user }) => {
      try {
        if (address.primary) {
          await Address.updateMany(
            { userId: user?.email, primary: true },
            { $set: { primary: false } }
          );
        }
        const updatedAddress = await Address.findByIdAndUpdate(
          address.id,
          address,
          { new: true }
        );
        return updatedAddress;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update address");
      }
    },

    deleteAddress: async (_, { addressId }, { user }) => {
      try {
        const deletedAddress = await Address.findByIdAndDelete(addressId);
        const address = await Address.findOne({ userId: user.email });
        if (address) {
          address.primary = true;
          await Address.findByIdAndUpdate(address.id, address, {
            new: true,
          });
        }
        return deletedAddress;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update address");
      }
    },

    addPayment: async (_, { payment }, { user }) => {
      try {
        payment.userId = user?.email;
        const paymentInfo = Payment.create(payment);
        return paymentInfo;
      } catch (error) {
        console.log(error);
      }
    },

    createOrder: async (_, { order }, { user }) => {
      try {
        order.userId = user?.email;

        order.orderItems.forEach((item) => {
          item.status = "Pending";
        });

        const checkoutInfo = await Order.create(order);
        await Cart.deleteMany({});
        return checkoutInfo;
      } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order. Please try again.");
      }
    },

    addToFavourite: async (_, { favouriteItems }, { user }) => {
      let favourite = await Favourite.findOne({
        userId: user.email,
      });

      if (!favourite) {
        favourite = new Favourite({
          userId: user.email,
          itemId: [favouriteItems.itemId],
        });
      } else {
        if (!Array.isArray(favourite.itemId)) {
          favourite.itemId = [];
        }
        favourite.itemId = [...favourite.itemId, favouriteItems.itemId];
        favourite.markModified("itemId");
      }

      await favourite.save();

      return favourite;
    },

    removeFromFavourite: async (_, { itemId }, { user }) => {
      try {
        let favourite = await Favourite.findOne({ userId: user.email });

        if (favourite) {
          favourite.itemId = favourite.itemId.filter((id) => id !== itemId);
          favourite.markModified("itemId");
          await favourite.save();

          return favourite;
        } else {
          return { message: "No favourite list found for this user" };
        }
      } catch (error) {
        console.log(error);
        return {
          message: "Error occurred while removing item from favourites",
        };
      }
    },

    emptyCart: async (_, __, { user }) => {
      try {
        const cart = await Cart.findOneAndDelete({ userId: user.email });
        return { message: "Empty Cart" };
      } catch (error) {
        console.log(error);
      }
    },

    deleteCartItem: async (_, { itemId }, { user }) => {
      try {
        const cart = await Cart.findOne({ userId: user.email });
        cart.items = cart.items.filter((item) => item.id != itemId);
        cart.markModified("items");
        await cart.save();
        return cart;
      } catch (error) {
        console.log(error);
      }
    },

    // Resturant
    updateRestaurant: async (_, { user }) => {
      try {
        const updatedUser = await Resturant.findOneAndUpdate(
          { email: user?.email },
          user
        );
        return updatedUser;
      } catch (error) {
        return { message: error };
      }
    },

    addFoodItem: async (_, { menuItem }, { user }) => {
      try {
        const restaurant = await Resturant.findOne({ email: user.email });
        menuItem.restaurantId = restaurant?.id;
        const item = await Item.create(menuItem);
        return item;
      } catch (error) {
        console.log(error);
      }
    },

    editFoodItem: async (_, { menuItem }) => {
      try {
        const id = menuItem.id;
        const item = await Item.findOneAndUpdate(id, menuItem);
        return item;
      } catch (error) {
        console.log(error);
      }
    },

    deleteFoodItem: async (_, { id }) => {
      try {
        const foodItem = Item.findByIdAndDelete(id);
        return foodItem;
      } catch (error) {
        console.log(error);
      }
    },

    editOrderStatus: async (_, { orderId, newStatus }, { user }) => {
      if (!user || !user.email) {
        throw new Error("User not authenticated.");
      }

      try {
        const restaurant = await Resturant.findOne({ email: user.email });
        if (!restaurant) {
          throw new Error("Restaurant not found.");
        }

        const order = await Order.findOne({
          _id: orderId,
          "orderItems.restaurantName": restaurant.name,
        });

        if (!order) {
          throw new Error("Order not found.");
        }
        order.orderItems.forEach((item) => {
          if (item.restaurantName === restaurant.name) {
            item.status = newStatus;
          }
        });

        order.markModified("orderItems");

        await order.save();

        const notification = new Notification({
          restaurantName: restaurant.name,
          userId: order.userId,
          date: new Date(),
          price: order.totalAmount,
          status: newStatus,
        });

        await notification.save();

        return order;
      } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Failed to update order status."); // Throw an error to be handled by the GraphQL layer
      }
    },

    addRestaurantTiming: async (_, { timing }, { user }) => {
      try {
        timing.restaurantId = user.email;
        const newTiming = new Timing(timing);
        return await newTiming.save();
      } catch (error) {
        console.error(error);
        throw new Error("Failed to add restaurant timing");
      }
    },
    updateRestaurantTiming: async (_, { timing }) => {
      try {
        const id = timing.id;
        return await Timing.findByIdAndUpdate(id, timing, { new: true });
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update restaurant timing");
      }
    },
    deleteRestaurantTiming: async (_, { id }) => {
      try {
        const deletedTiming = await Timing.findByIdAndDelete(id);
        return deletedTiming ? true : false;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete restaurant timing");
      }
    },

    adminLogin: async (_, { user }) => {
      try {
        const loginAdmin = await User.findOne({
          email: user?.email,
          name: "Admin",
        });

        if (loginAdmin != null) {
          const password = await verifyPassword(
            user.password,
            loginAdmin.password
          );
          if (password) {
            const token = jwt.sign(
              { email: user?.email },
              process.env.JWT_SECRET,
              { expiresIn: 86400 }
            );
            return {
              user: loginAdmin,
              token,
              message: "Sucessfully logged in",
              type: "admin",
            };
          } else {
            throw new AuthenticationError("Incorrect Password");
          }
        } else {
          throw new AuthenticationError("Incorrect Username");
        }
      } catch (error) {
        return { message: error };
      }
    },

    adminEditOrderStatus: async (_, { orderId, newStatus, restaurantId }) => {
      try {
        const restaurant = await Resturant.findById(restaurantId);
        if (!restaurant) {
          throw new Error("Restaurant not found.");
        }

        const order = await Order.findOne({
          _id: orderId,
          "orderItems.restaurantName": restaurant.name,
        });

        if (!order) {
          throw new Error("Order not found.");
        }
        order.orderItems.forEach((item) => {
          if (item.restaurantName === restaurant.name) {
            item.status = newStatus;
          }
        });

        order.markModified("orderItems");

        await order.save();

        const notification = new Notification({
          restaurantName: restaurant.name,
          userId: order.userId,
          date: new Date(),
          price: order.totalAmount,
          status: newStatus,
        });

        await notification.save();
        return order;
      } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Failed to update order status."); // Throw an error to be handled by the GraphQL layer
      }
    },

    adminEditRestaurantStatus: async (_, { restaurantId, newStatus }) => {
      try {
        const updatedUser = await Resturant.findByIdAndUpdate(restaurantId, {
          status: newStatus,
        });
        return updatedUser;
      } catch (error) {
        return { message: error };
      }
    },
    adminDeleteRestaurant: async (_, { id }) => {
      try {
        const deletedRestaurant = await Resturant.findByIdAndDelete(id);
        return deletedRestaurant;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete restaurant");
      }
    },

    adminEditUser: async (_, { newStatus, userId }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
          status: newStatus,
        });
        return updatedUser;
      } catch (error) {
        return { message: error };
      }
    },

    adminDeleteUser: async (_, { id }) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        return deletedUser;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete user");
      }
    },
  },
};

module.exports = resolvers;
