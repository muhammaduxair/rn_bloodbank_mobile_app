/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import Navigation from './config/Navigation';
import {Provider} from 'react-redux';
import store from './store/index';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};
export default App;
