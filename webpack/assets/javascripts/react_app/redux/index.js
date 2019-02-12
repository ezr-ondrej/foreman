import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';

import reducers from './reducers';

let middleware = [thunk];

const useLogger = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isLogger = process.env.REDUX_LOGGER;

  if (!isProduction && !global.__testing__) {
    if (isLogger === undefined || isLogger === true) return true;
  }
  return isProduction && isLogger;
};

if (useLogger()) middleware = [...middleware, createLogger()];

export const generateStore = () =>
  createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(...middleware)
  );

const store = generateStore();

export function observeStore(onChange, select = state => state) {
  let currentState = select(store.getState());

  function handleChange() {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      onChange(nextState, currentState);
      currentState = nextState;
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  return unsubscribe;
}

export default store;
