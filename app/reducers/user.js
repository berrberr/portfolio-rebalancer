import { combineReducers } from 'redux';
import * as types from '../types';

const isLogin = (
  state = true,
  action
) => {
  switch (action.type) {
    case types.TOGGLE_LOGIN_MODE:
      return !state;
    default:
      return state;
  }
};

const message = (
  state = '',
  action
) => {
  switch (action.type) {
    case types.CHANGE_AUTHENTICATION_MODE:
    case types.LOGOUT_USER:
    case types.LOGIN_SUCCESS_USER:
    case types.SIGNUP_SUCCESS_USER:
      return '';
    case types.LOGIN_ERROR_USER:
    case types.SIGNUP_ERROR_USER:
      return action.message;
    default:
      return state;
  }
};

const isWaiting = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.MANUAL_LOGIN_USER:
    case types.SIGNUP_USER:
    case types.LOGOUT_USER:
      return true;
    case types.LOGIN_SUCCESS_USER:
    case types.SIGNUP_SUCCESS_USER:
    case types.LOGOUT_SUCCESS_USER:
    case types.LOGIN_ERROR_USER:
    case types.SIGNUP_ERROR_USER:
    case types.LOGOUT_ERROR_USER:
      return false;
    default:
      return state;
  }
};

const authenticated = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS_USER:
    case types.SIGNUP_SUCCESS_USER:
    case types.LOGOUT_ERROR_USER:
      return true;
    case types.LOGIN_ERROR_USER:
    case types.SIGNUP_ERROR_USER:
    case types.LOGOUT_SUCCESS_USER:
      return false;
    default:
      return state;
  }
};

const email = (
  state = '',
  action
) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS_USER:
    case types.SIGNUP_SUCCESS_USER:
      return action.email;
    case types.LOGIN_ERROR_USER:
    case types.SIGNUP_ERROR_USER:
    case types.LOGOUT_SUCCESS_USER:
      return '';
    default:
      return state;
  }
};

const userReducer = combineReducers({
  isLogin,
  isWaiting,
  authenticated,
  message,
  email
});

export default userReducer;