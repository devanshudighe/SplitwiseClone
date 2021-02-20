// import { stringTypeAnnotation } from "@babel/types";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
  } from "../actions/types";
  
  const userDetails = JSON.parse(localStorage.getItem("user"));
  console.log(userDetails)
  const initialState = userDetails
    ? { isLoggedIn: true, user : userDetails }
    : { isLoggedIn: false, user: {} };
  
  const states =  (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case REGISTER_SUCCESS:
        return {
          ...state,
          isLoggedIn: false,
        };
      case REGISTER_FAIL:
        return {
          // ...state,
          isLoggedIn: false
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          isLoggedIn: true,
          user: payload.user,
        };
      case LOGIN_FAIL:
        return {
          // ...state,
          isLoggedIn: false
          // user: null,
        };
      case LOGOUT:
        return {
          // ...state,
          isLoggedIn: false
          // user: null,
        };
      default:
        return state;
    }
  }
  export default states;