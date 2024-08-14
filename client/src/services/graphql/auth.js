import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($user: UserLoginInput!) {
    loginUser(user: $user) {
      user {
        name
        email
      }
      token
      message
      type
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($user: UserInput!) {
    registerUser(user: $user) {
      name
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($user: UserProfileInput!) {
    updateUser(user: $user) {
      email
      phone
      name
    }
  }
`;

export const USER_INFO = gql`
  query UserInfo {
    userInfo {
      email
      phone
      name
    }
  }
`;

// CART

export const CART = gql`
  query Cart {
    cart {
      userId
      totalCount
      total
      cartItems {
        restaurantId
        restaurantName
        items {
          id
          count
          name
          description
          price
          imageURL
          category
          count
        }
        total
        totalCount
      }
    }
  }
`;

export const EMPTY_CART = gql`
  mutation EmptyCart {
    emptyCart {
      message
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($cartItems: CartInput!) {
    addToCart(cartItems: $cartItems) {
      userId
      restaurantId
      totalCount
    }
  }
`;

export const DELETE_CART_ITEM = gql`
  mutation DeleteCartItem($itemId: String!) {
    deleteCartItem(itemId: $itemId) {
      userId
    }
  }
`;

export const ADD_ADDRESS = gql`
  mutation AddAddress($address: AddressInput!) {
    addAddress(address: $address) {
      street
      city
      state
      zipCode
      country
      name
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($address: UpdateAddressInput) {
    updateAddress(address: $address) {
      street
      city
      state
      zipCode
      country
      name
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($addressId: String!) {
    deleteAddress(addressId: $addressId) {
      street
      city
      state
      zipCode
      country
      name
    }
  }
`;

export const ADDRESS = gql`
  query Address {
    address {
      id
      street
      city
      state
      zipCode
      country
      name
      primary
    }
  }
`;

export const ADDRESS_BY_ID = gql`
  query AddressById($id: String) {
    addressById(id: $id) {
      id
      street
      city
      state
      zipCode
      country
      name
      primary
    }
  }
`;

export const ADD_PAYMENT = gql`
  mutation AddPayment($payment: PaymentInput!) {
    addPayment(payment: $payment) {
      cardNumber
      expiry
      securityCode
      country
      zipCode
      nickName
    }
  }
`;

export const PAYMENT = gql`
  query Payment {
    payment {
      id
      cardNumber
      expiry
      securityCode
      country
      zipCode
      nickName
    }
  }
`;

export const FAVOURITE = gql`
  query Favourite {
    favourite {
      userId
      items {
        restaurantId
        _id
        name
        description
        price
        imageURL
        category
      }
      totalCount
    }
  }
`;

export const ADD_TO_FAVOURITE = gql`
  mutation AddToFavourite($favouriteItems: FavouriteInput!) {
    addToFavourite(favouriteItems: $favouriteItems) {
      userId
      items {
        restaurantId
        _id
        name
        description
        price
        imageURL
        category
      }
      totalCount
    }
  }
`;

export const REMOVE_FROM_FAVOURITE = gql`
  mutation RemoveFromFavourite($itemId: String) {
    removeFromFavourite(itemId: $itemId) {
      userId
      items {
        restaurantId
        _id
        name
        description
        price
        imageURL
        category
      }
      totalCount
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($order: OrderInput!) {
    createOrder(order: $order) {
      userId
      addressId
      paymentId
      promoCode
      subTotal
      deliveryFee
      tax
      instructions
      totalAmount
    }
  }
`;

export const ORDERS = gql`
  query Orders {
    orders {
      _id
      userId
      addressId
      paymentId
      promoCode
      subTotal
      deliveryFee
      tax
      instructions
      totalAmount
      orderItems {
        restaurantId
        restaurantName
        total
        totalCount
        status
        items {
          id
          count
          price
          name
          description
          imageURL
          category
        }
      }
    }
  }
`;

export const GET_RESTAURANT_TIMING_BY_DAY = gql`
  query GetRestaurantTimingByDay($timing: TimingByDayInput) {
    getRestaurantTimingByDay(timing: $timing) {
      id
      day
      start
      end
      holiday
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      _id
      restaurantName
      date
      price
      status
    }
  }
`;
