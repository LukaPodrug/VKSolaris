import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SoonScreen } from '../screens/SoonScreen';

const Tabs = createBottomTabNavigator();

export function MainTabs({ route }) {
  const { memberId } = route.params || {};
  return (
    <Tabs.Navigator initialRouteName="Profile">
      <Tabs.Screen name="News" children={() => <SoonScreen title="News" />} options={{ tabBarBadge: 'soon' }} />
      <Tabs.Screen name="Matches" children={() => <SoonScreen title="Matches" />} options={{ tabBarBadge: 'soon' }} />
      <Tabs.Screen name="Profile" children={() => <ProfileScreen route={{ params: { memberId } }} />} />
    </Tabs.Navigator>
  );
}

