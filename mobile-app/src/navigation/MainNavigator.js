import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import TicketScreen from '../screens/main/TicketScreen';
import PurchaseScreen from '../screens/main/PurchaseScreen';
import WalletScreen from '../screens/main/WalletScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{title: 'Solaris Waterpolo Club'}}
    />
    <Stack.Screen
      name="Purchase"
      component={PurchaseScreen}
      options={{title: 'Purchase Season Ticket'}}
    />
  </Stack.Navigator>
);

const TicketStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TicketMain"
      component={TicketScreen}
      options={{title: 'My Tickets'}}
    />
    <Stack.Screen
      name="Wallet"
      component={WalletScreen}
      options={{title: 'Add to Wallet'}}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{title: 'Profile'}}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Tickets') {
            iconName = 'confirmation-number';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Tickets" component={TicketStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainNavigator;