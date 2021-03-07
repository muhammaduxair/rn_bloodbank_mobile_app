import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import MianScreen from '../screens/MianScreen';
import REQUEST_PAGE from '../screens/List';
import History from '../screens/History';
import Profile from '../screens/Profile';

const Tab = createMaterialBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator
      activeColor="#d22325"
      inactiveColor="#c5bfbf"
      barStyle={{
        backgroundColor: '#fff',
        borderTopColor: '#ccc4c47d',
        borderTopWidth: 1,
      }}>
      <Tab.Screen
        name="mainscreen"
        component={MianScreen}
        options={{
          tabBarLabel: 'Find',
          tabBarIcon: ({color}) => (
            <MaterialIcon
              size={27}
              style={{textAlign: 'center'}}
              name="person-search"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="reqList"
        component={REQUEST_PAGE}
        options={{
          tabBarLabel: 'Requests',
          tabBarIcon: ({color}) => (
            <MaterialIcon
              size={28}
              style={{textAlign: 'center'}}
              name="list-alt"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="history"
        component={History}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color}) => (
            <MaterialIcon
              size={28}
              style={{textAlign: 'center'}}
              name="history"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <FontIcon
              size={25}
              style={{textAlign: 'center'}}
              name="user-circle-o"
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
