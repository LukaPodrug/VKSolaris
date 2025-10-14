import * as React from 'react';
import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { api } from '../api/client';

export function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [error, setError] = React.useState(null);

  async function register() {
    setError(null);
    try {
      const { data } = await api.post('/public/register', { firstName, lastName });
      navigation.navigate('Status', { memberId: data.memberId });
    } catch (e) {
      setError('Registration failed');
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Register</Text>
      <TextInput label="First name" value={firstName} onChangeText={setFirstName} style={{ marginBottom: 8 }} />
      <TextInput label="Last name" value={lastName} onChangeText={setLastName} style={{ marginBottom: 8 }} />
      {!!error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button mode="contained" onPress={register}>Register</Button>
    </View>
  );
}

