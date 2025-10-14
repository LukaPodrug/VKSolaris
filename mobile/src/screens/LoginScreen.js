import * as React from 'react';
import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { api } from '../api/client';

export function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [memberId, setMemberId] = React.useState(null);

  async function handleLogin() {
    if (!username || !password) return;
    setLoading(true);
    try {
      const { data } = await api.post('/public/login', { username, password });
      setMemberId(data.memberId);
      setStatus(data.status);
      if (data.status === 'confirmed' || data.status === 'active') {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { memberId: data.memberId } }] });
      }
    } catch (_e) {
      setStatus('invalid');
    } finally {
      setLoading(false);
    }
  }

  const showMessage = status && status !== 'confirmed' && status !== 'active';
  const message = status === 'pending' ? 'Your account is not yet confirmed.'
    : status === 'suspended' ? 'Your account is suspended.'
    : status === 'invalid' ? 'Invalid credentials.'
    : status === 'not found' ? 'Member not found.'
    : null;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Login</Text>
      <TextInput label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" style={{ marginBottom: 8 }} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 8 }} />
      {showMessage && <Text style={{ color: 'red', marginBottom: 8 }}>{message}</Text>}
      <Button mode="contained" onPress={handleLogin} loading={loading} disabled={!username || !password}>Login</Button>
      <Button onPress={() => navigation.navigate('Register')} style={{ marginTop: 8 }}>Register</Button>
    </View>
  );
}

