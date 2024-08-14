const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  status: { type: String, default: "Approved" },
  createdAt: { type: Date, default: Date.now },
});

const ResturantSchema = new Schema({
  name: String,
  image: String,
  phone: String,
  type: String,
  location: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: new Date() },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const ItemsSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageURL: String,
  rating: { type: Number, default: 0 },
  restaurantId: String,
  ingredients: ["String"],
  createdAt: { type: Date, default: new Date() },
});

const CartSchema = new Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  items: { type: Array, required: true },
  createdAt: { type: Date, default: new Date() },
  totalCount: { type: Number, required: true },
});

const FavouriteSchema = new Schema({
  userId: String,
  itemId: Array,
  createdAt: { type: Date, default: new Date() },
  totalCount: Number,
});

const PaymentSchema = new Schema({
  cardNumber: { type: String, required: true },
  expiry: { type: String, required: true },
  securityCode: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  nickName: { type: String },
  primary: { type: Boolean, required: true },
});

const OrderSchema = new Schema({
  userId: { type: String, required: true },
  addressId: { type: String, required: true },
  paymentId: { type: String, required: true },
  promoCode: { type: String },
  subTotal: { type: String, required: true },
  deliveryFee: { type: String, required: true },
  tax: { type: String, required: true },
  totalAmount: { type: String, required: true },
  instructions: { type: String, required: true },
  orderItems: { type: Array, required: true },
  createdAt: { type: Date, default: new Date() },
});

const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  name: { type: String },
  primary: { type: Boolean, required: true },
  userId: { type: String },
});

const TimingSchema = new Schema({
  restaurantId: {
    type: String,
    required: true,
  },

  day: {
    type: String,
    required: true,
  },
  start: {
    type: String,
  },
  end: {
    type: String,
  },
  holiday: {
    type: Boolean,
    required: true,
  },
});

const notificationSchema = new Schema({
  restaurantName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const Timing = model("Timing", TimingSchema);
const User = model("User", UserSchema);
const Resturant = model("Resturant", ResturantSchema);
const Item = model("Item", ItemsSchema);
const Cart = model("Cart", CartSchema);
const Payment = model("Payment", PaymentSchema);
const Order = model("Order", OrderSchema);
const Address = model("Address", AddressSchema);
const Favourite = model("Favourite", FavouriteSchema);
const Notification = model("Notification", notificationSchema);

module.exports = {
  User,
  Resturant,
  Item,
  Cart,
  Payment,
  Address,
  Order,
  Favourite,
  Timing,
  Notification,
};
