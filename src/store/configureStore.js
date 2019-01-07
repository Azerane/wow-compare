import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { logger } from 'redux-logger';
import rootReducer from '../reducers';

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  middlewares.push(logger);
}

const configureStore = () => {
  const defaultStore = {
    baseReducer: {
      players: {
        group: [],
        queue: [],
      },
    },
  };
  return createStore(rootReducer, defaultStore, applyMiddleware(...middlewares));
};

export default configureStore;
