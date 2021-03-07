import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import CreateAccount from '../screens/CreateAccount';
import TabNavigator from './tabNavigation';
import ExtraDetail from '../screens/ExtraDetail';

const Stack = createStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="create-account" component={CreateAccount} />
        <Stack.Screen name="extradetail" component={ExtraDetail} />
        <Stack.Screen name="home" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
