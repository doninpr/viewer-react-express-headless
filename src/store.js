import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import thunk from 'redux-thunk';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [
  thunk,
];

export default createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(...middlewares)),
);
