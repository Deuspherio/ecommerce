import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  user: {
    userData: localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null,
    shippingData: localStorage.getItem("shippingData")
      ? JSON.parse(localStorage.getItem("shippingData"))
      : "",
  },
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) => {
            return item._id === existItem._id ? newItem : item;
          })
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "USER_SIGNIN":
      return { ...state, user: { userData: action.payload } };

    case "USER_SIGNOUT":
      return {
        ...state,
        user: { userData: null, shippingData: {} },
        cart: { cartItems: [] },
      };

    case "SAVE_SHIPPING_DATA":
      return {
        ...state,
        user: { ...state.user, shippingData: action.payload },
      };

    case "PAYMENT_METHOD":
      return {
        ...state,
        user: { ...state.user, paymentMethod: action.payload },
      };

    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
