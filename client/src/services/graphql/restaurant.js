import { gql } from "@apollo/client";

export const LOGIN_RESTAURANT = gql`
  mutation RestaurantLogin($restaurant: UserLoginInput!) {
    restaurantLogin(restaurant: $restaurant) {
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

export const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($restaurant: CreateRestaurantInput!) {
    createRestaurant(restaurant: $restaurant) {
      name
      email
    }
  }
`;

export const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant($user: CreateRestaurantInput!) {
    updateRestaurant(user: $user) {
      email
      phone
      name
      location
      type
    }
  }
`;

export const RESTAURANT_INFO = gql`
  query RestaurantInfo {
    restaurantInfo {
      email
      phone
      name
      type
      location
      image
    }
  }
`;

export const GET_FOOD_ITEMS = gql`
  query FoodItems {
    foodItems {
      id
      name
      description
      price
      category
      imageURL
      rating
      restaurantId
    }
  }
`;

export const GET_FOOD_ITEMS_BY_RESTAUTANT = gql`
  query FoodItemsByRestaurant($id: String) {
    foodItemsByRestaurant(id: $id) {
      id
      name
      description
      price
      category
      imageURL
      rating
      restaurantId
    }
  }
`;

export const GET_RESTAURANTS = gql`
  query Restaurant($filter: RestaurantFilter) {
    restaurant(filter: $filter) {
      id
      name
      image
      phone
      status
      location
      image
      email
      status
    }
  }
`;

export const GET_RESTAURANT_BY_ID = gql`
  query RestaurantById($id: String) {
    restaurantById(id: $id) {
      id
      name
      image
      phone
      status
      location
      type
      email
      menu {
        id
        name
        description
        price
        rating
        imageURL
        category
      }
      timing {
        day
        open
        close
      }
    }
  }
`;

export const GET_RESTAURANT_BY_EMAIL = gql`
  query RestaurantByEmail($email: String) {
    restaurantByEmail(email: $email) {
      image
    }
  }
`;

export const RESTAURANT_ORDERS = gql`
  query RestaurantOrders {
    restaurantOrders {
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

export const RESTAURANT_ORDER_BY_ID = gql`
  query RestaurantOrderById($id: String) {
    restaurantOrderById(id: $id) {
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

export const EDIT_ORDER_STATUS = gql`
  mutation EditOrderStatus($orderId: ID!, $newStatus: String!) {
    editOrderStatus(orderId: $orderId, newStatus: $newStatus) {
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

export const RESTAURANT_ITEMS = gql`
  query RestaurantItems {
    restaurantItems {
      id
      name
      description
      price
      category
      imageURL
      rating
      restaurantId
    }
  }
`;

export const ADD_FOOD_ITEM = gql`
  mutation AddFoodItem($menuItem: MenuItemEditInput!) {
    addFoodItem(menuItem: $menuItem) {
      id
      name
      description
      price
      category
      imageURL
      rating
      restaurantId
    }
  }
`;

export const EDIT_FOOD_ITEM = gql`
  mutation EditFoodItem($menuItem: MenuItemInput!) {
    editFoodItem(menuItem: $menuItem) {
      id
      name
      description
      price
      category
      imageURL
      rating
      restaurantId
    }
  }
`;

export const RESTAURANT_ITEM_BY_ID = gql`
  query RestaurantItemById($id: String) {
    restaurantItemById(id: $id) {
      id
      name
      description
      price
      category
      imageURL
      rating
      restaurantId
    }
  }
`;

export const DELETE_FOOD_ITEM = gql`
  mutation DeleteFoodItem($id: String!) {
    deleteFoodItem(id: $id) {
      id
      name
      description
      price
      category
      imageURL
      rating
      restaurantId
    }
  }
`;

export const GET_RESTAURANT_MONTHLY_ORDERS = gql`
  query {
    restaurantMonthlyOrders {
      order
      day
    }
  }
`;

export const GET_RESTAURANT_YEARLY_ORDERS = gql`
  query {
    restaurantYearlyOrders {
      order
      month
    }
  }
`;

export const GET_RESTAURANT_TIMINGS = gql`
  query GetRestaurantTimings {
    getRestaurantTimings {
      id
      day
      start
      end
      holiday
      restaurantId
    }
  }
`;

export const GET_RESTAURANT_TIMING = gql`
  query GetRestaurantTiming($id: ID!) {
    getRestaurantTiming(id: $id) {
      id
      day
      start
      end
      holiday
      restaurantId
    }
  }
`;

export const ADD_RESTAURANT_TIMING = gql`
  mutation AddRestaurantTiming($timing: RestaurantTimingInput!) {
    addRestaurantTiming(timing: $timing) {
      id
      day
      start
      end
      holiday
      restaurantId
    }
  }
`;

export const UPDATE_RESTAURANT_TIMING = gql`
  mutation UpdateRestaurantTiming($timing: UpdateRestaurantTimingInput!) {
    updateRestaurantTiming(timing: $timing) {
      id
      day
      start
      end
      holiday
      restaurantId
    }
  }
`;

export const DELETE_RESTAURANT_TIMING = gql`
  mutation DeleteRestaurantTiming($id: ID!) {
    deleteRestaurantTiming(id: $id)
  }
`;
