import * as React from 'react';
import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { api } from '../api/client';

export function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);

  async function register() {
    setError(null);
    try {
      const { data } = await api.post('/public/register', { firstName, lastName, username, password });
      navigation.navigate('Status', { memberId: data.memberId });
    } catch (e) {
      setError(e?.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Register</Text>
      <TextInput label="First name" value={firstName} onChangeText={setFirstName} style={{ marginBottom: 8 }} />
      <TextInput label="Last name" value={lastName} onChangeText={setLastName} style={{ marginBottom: 8 }} />
      <TextInput label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" style={{ marginBottom: 8 }} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 8 }} />
      {!!error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button mode="contained" onPress={register} disabled={!firstName || !lastName || !username || !password}>Register</Button>
    </View>
  );
}

