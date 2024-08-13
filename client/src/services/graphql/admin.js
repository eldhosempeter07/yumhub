import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($user: UserLoginInput!) {
    adminLogin(user: $user) {
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

export const RESTAURANTS = gql`
  query Restaurants {
    restaurants {
      id
      name
      image
      phone
      status
      location
      image
      email
    }
  }
`;

export const USERS = gql`
  query Users {
    users {
      _id
      email
      phone
      name
      status
    }
  }
`;

export const ADMIN_ORDERS = gql`
  query AdminOrders {
    adminOrders {
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
        status
        restaurantId
        restaurantName
        total
        totalCount
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

export const ADMIN_RESTAURANT_ORDER_BY_ID = gql`
  query AdminRestaurantOrderById($id: String, $restaurantId: String) {
    adminRestaurantOrderById(id: $id, restaurantId: $restaurantId) {
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
        status
        restaurantId
        restaurantName
        total
        totalCount
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

export const ADMIN_EDIT_ORDER_STATUS = gql`
  mutation AdminEditOrderStatus(
    $orderId: ID!
    $newStatus: String!
    $restaurantId: String!
  ) {
    adminEditOrderStatus(
      orderId: $orderId
      newStatus: $newStatus
      restaurantId: $restaurantId
    ) {
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
        status
        restaurantId
        restaurantName
        total
        totalCount
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

export const ADMIN_EDIT_RESTAURANT_STATUS = gql`
  mutation AdminEditRestaurantStatus($newStatus: String!, $restaurantId: ID!) {
    adminEditRestaurantStatus(
      newStatus: $newStatus
      restaurantId: $restaurantId
    ) {
      email
      phone
      name
      location
      type
    }
  }
`;

export const ADMIN_RESTAURANT_INFO = gql`
  query AdminRestaurantInfo($id: String) {
    adminRestaurantInfo(id: $id) {
      id
      name
      image
      phone
      status
      location
      type
      email
    }
  }
`;

export const ADMIN_DELETE_RESTAURANT = gql`
  mutation AdminDeleteRestaurant($id: ID!) {
    adminDeleteRestaurant(id: $id) {
      email
      phone
      name
      location
      type
    }
  }
`;

export const ADMIN_EDIT_USER = gql`
  mutation AdminEditUser($newStatus: String!, $userId: ID!) {
    adminEditUser(newStatus: $newStatus, userId: $userId) {
      email
      phone
      name
    }
  }
`;

export const ADMIN_DELETE_USER = gql`
  mutation AdminDeleteUser($id: ID!) {
    adminDeleteUser(id: $id) {
      email
      phone
      name
    }
  }
`;

export const ADMIN_USER_INFO = gql`
  query AdminUserInfo($id: String) {
    adminUserInfo(id: $id) {
      _id
      email
      phone
      name
      status
    }
  }
`;

export const ADMIN_MONTHLY_ORDERS = gql`
  query AdminMonthlyOrders($monthName: String) {
    adminMonthlyOrders(monthName: $monthName) {
      order
      day
    }
  }
`;
