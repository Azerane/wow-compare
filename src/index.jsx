import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import FullStory from 'react-fullstory';
import ReactGA from 'react-ga';

import Home from './components/Home';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configureStore';

const store = configureStore();

const productionScript = () => {
  const deployMode = process.env.REACT_APP_DEPLOY_MODE;
  if (deployMode === 'production') {
    // Google analytics
    ReactGA.initialize('UA-132360927-1');
    // Fullstory
    return (<FullStory org="H99TK" />);
  }
  return (null);
};

ReactDOM.render(
  <Provider store={store}>
    <Home />
    {productionScript()}
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
