import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StripeProvider} from '@stripe/stripe-react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import {AuthProvider} from './contexts/AuthContext';
import AuthNavigator from './navigation/AuthNavigator';
import MainNavigator from './navigation/MainNavigator';
import {useAuth} from './contexts/AuthContext';

const Stack = createStackNavigator();
const queryClient = new QueryClient();

// Get Stripe key from environment variables
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key';

const AppContent = () => {
  const {isAuthenticated, loading} = useAuth();

  if (loading) {
    // You can replace this with a proper loading screen
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </StripeProvider>
    </QueryClientProvider>
  );
};

export default App;