import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Button, TextInput } from 'react-native-paper';
import { View, Text } from 'react-native';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
const api = axios.create({ baseURL: API_URL });

function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [memberId, setMemberId] = React.useState('');
  const [error, setError] = React.useState(null);

  async function register() {
    setError(null);
    try {
      const { data } = await api.post('/public/register', { firstName, lastName, memberId });
      navigation.navigate('Status', { memberId });
    } catch (e) {
      setError('Registration failed');
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Register</Text>
      <TextInput label="First name" value={firstName} onChangeText={setFirstName} style={{ marginBottom: 8 }} />
      <TextInput label="Last name" value={lastName} onChangeText={setLastName} style={{ marginBottom: 8 }} />
      <TextInput label="Member ID" value={memberId} onChangeText={setMemberId} style={{ marginBottom: 8 }} />
      {!!error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button mode="contained" onPress={register}>Register</Button>
    </View>
  );
}

function StatusScreen({ route }) {
  const { memberId } = route.params;
  const [status, setStatus] = React.useState('');

  async function load() {
    try {
      const { data } = await api.get('/public/status', { params: { memberId } });
      setStatus(data.status);
    } catch (e) {
      setStatus('not found');
    }
  }
  React.useEffect(() => { load(); }, []);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Status</Text>
      <Text>Member ID: {memberId}</Text>
      <Text>Account status: {status}</Text>
      <Button onPress={load} style={{ marginTop: 12 }}>Refresh</Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Status" component={StatusScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}


