import { combineReducers } from 'redux';
import * as types from '../types';

const selectedModelPortfolio = (state = {}, action) => {
  switch (action.type) {
    case types.SELECT_MODEL_PORTFOLIO:
      return {
        id: action.selectedModelPortfolio.id,
        name: action.selectedModelPortfolio.name,
        email: action.selectedModelPortfolio.email,
        securities: action.selectedModelPortfolio.securities
      };
    case types.CREATE_MODEL_PORTFOLIO_REQUEST:
    case types.SAVE_MODEL_PORTFOLIO_REQUEST:
      return {
        ...state,
        id: action.id,
        name: action.name,
        email: action.email,
        securities: action.securities
      };
    case types.MODEL_PORTFOLIO_NAME_TEXT_FIELD_CHANGE:
      return {
        ...state,
        name: action.value
      };
    case types.CREATE_NEW_PORTFOLIO:
    case types.DELETE_MODEL_PORTFOLIO_REQUEST: {
      let numModelPortfoliosWithDefaultName = 0;
      for (let i = 0; i < action.modelPortfolios.length; i++) {
        if (action.modelPortfolios[i].email === action.email) {
          if (numModelPortfoliosWithDefaultName === 0) {
            if (action.modelPortfolios[i].name === 'Model Portfolio Name') {
              numModelPortfoliosWithDefaultName += 2;
            }
          } else if (action.modelPortfolios[i].name === 'Model Portfolio Name ' + numModelPortfoliosWithDefaultName) {
            numModelPortfoliosWithDefaultName++;
          } else {
            break;
          }
        }
      }
      let newModelPortfolioName = 'Model Portfolio Name';
      if (numModelPortfoliosWithDefaultName > 0) {
        newModelPortfolioName += ' ' + numModelPortfoliosWithDefaultName;
      }
      return {
        id: '',
        name: newModelPortfolioName,
        email: '',
        securities: []
      };
    }
    default:
      return state;
  }
};

const symbol = (state = {
    value: '',
    setOnce: false
  }, action) => {
  switch (action.type) {
    case types.SELECT_MODEL_PORTFOLIO:
      return {
        value: action.security.symbol,
        setOnce: true
      };
    case types.SECURITY_TEXT_FIELD_CHANGE:
      return {
        value: action.value,
        setOnce: true
      };
    default:
      return state;
  }
};

const allocation = (state = {
    value: '0',
    setOnce: false
  }, action) => {
  switch (action.type) {
    case types.SELECT_MODEL_PORTFOLIO:
      return {
        value: action.security.allocation,
        setOnce: true
      };
    case types.SECURITY_TEXT_FIELD_CHANGE:
      return {
        value: action.value,
        setOnce: true
      };
    default:
      return state;
  }
};

const price = (state = {
    value: '1.00',
    setOnce: false,
    fetchStatus: 'NONE'
  }, action) => {
  switch (action.type) {
    case types.SELECT_MODEL_PORTFOLIO:
      return {
        value: action.security.price,
        setOnce: true
      };
    case types.SECURITY_TEXT_FIELD_CHANGE:
      return {
        value: action.value,
        setOnce: true,
        fetchStatus: 'NONE'
      };
    case types.SET_PRICE_TO_FETCHING:
      return {
        ...state,
        fetchStatus: 'IN_PROGRESS'
      };
    case types.SET_PRICE_TO_NOT_FETCHING:
      return {
        ...state,
        fetchStatus: 'NONE'
      };
    case types.SET_PRICE_FROM_FETCH:
      return {
        ...state,
        value: action.price,
        setOnce: true,
        fetchStatus: 'DONE'
      };
    case types.SET_PRICE_TO_FETCH_FAILED:
      return {
        ...state,
        fetchStatus: 'FAILED'
      };
    default:
      return state;
  }
};

const units = (state = {
    value: '0',
    setOnce: false
  }, action) => {
  switch (action.type) {
    case types.SECURITY_TEXT_FIELD_CHANGE:
      return {
        value: action.value,
        setOnce: true
      };
    default:
      return state;
  }
};

const security = (state = {}, action) => {
  switch (action.type) {
    case types.SELECT_MODEL_PORTFOLIO:
      return {
        index: action.index,
        symbol: symbol(undefined, action),
        allocation: allocation(undefined, action),
        price: price(undefined, action),
        units: units(undefined, action)
      };
    case types.CREATE_NEW_PORTFOLIO:
    case types.DELETE_MODEL_PORTFOLIO_REQUEST:
      return {
        index: 0,
        symbol: symbol(undefined, action),
        allocation: allocation(undefined, action),
        price: price(undefined, action),
        units: units(undefined, action),
      };
    case types.ADD_SECURITY:
      return {
        index: action.index,
        symbol: symbol(undefined, action),
        allocation: allocation(undefined, action),
        price: price(undefined, action),
        units: units(undefined, action),
      };
    case types.SECURITY_TEXT_FIELD_CHANGE:
      if (state.index === action.index) {
        switch (action.column) {
          case 'symbol':
            return {
              ...state,
              symbol: symbol(state.symbol, action)
            };
          case 'allocation':
            return {
              ...state,
              allocation: allocation(state.allocation, action)
            };
          case 'price':
            return {
              ...state,
              price: price(state.price, action)
            };
          case 'units':
            return {
              ...state,
              units: units(state.units, action)
            };
          default:
            return state;
        }
      }
      return state;
    case types.SET_PRICE_TO_FETCHING:
    case types.SET_PRICE_TO_NOT_FETCHING:
    case types.SET_PRICE_FROM_FETCH:
    case types.SET_PRICE_TO_FETCH_FAILED:
      if (state.index === action.index) {
        return {
          ...state,
          price: price(state.price, action)
        };
      }
      return state;
    default:
      return state;
  }
};

const portfolio = (state = [], action) => {
  switch (action.type) {
    case types.SELECT_MODEL_PORTFOLIO: {
      const selectedPortoflio = [];
      for (let i = 0; i < action.selectedModelPortfolio.securities.length; i++) {
        const securityAction = {type: types.SELECT_MODEL_PORTFOLIO, index: i, security: action.selectedModelPortfolio.securities[i]};
        selectedPortoflio.push(security(undefined, securityAction));
      }
      return selectedPortoflio;
    }
    case types.CREATE_NEW_PORTFOLIO:
    case types.DELETE_MODEL_PORTFOLIO_REQUEST: {
      const newPortfolio = [];
      newPortfolio.push(security(undefined, action));
      return newPortfolio;
    }
    case types.ADD_SECURITY: {
      const addedSecurityAction = {type: types.ADD_SECURITY, index: state.length};
      return [
        ...state,
        security(undefined, addedSecurityAction)
      ];
    }
    case types.REMOVE_SECURITY: {
      const trunkedPortfolio = state.filter(s => s.index !== action.index);
      for (let i = action.index; i < trunkedPortfolio.length; i++) {
        trunkedPortfolio[i].index--;
      }
      return trunkedPortfolio;
    }
    case types.SECURITY_TEXT_FIELD_CHANGE:
    case types.SET_PRICE_TO_FETCHING:
    case types.SET_PRICE_TO_NOT_FETCHING:
    case types.SET_PRICE_FROM_FETCH:
    case types.SET_PRICE_TO_FETCH_FAILED:
      return state.map(s => security(s, action));
    default:
      return state;
  }
};

const portfolioReducer = combineReducers({
  selectedModelPortfolio,
  portfolio
});

export default portfolioReducer;