import * as React from 'react';
import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { api } from '../api/client';

export function LoginScreen({ navigation }) {
  const [inputMemberId, setInputMemberId] = React.useState('');
  const [status, setStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  async function handleLogin() {
    if (!inputMemberId) return;
    setLoading(true);
    try {
      const { data } = await api.get('/public/status', { params: { memberId: inputMemberId } });
      setStatus(data.status);
      if (data.status === 'confirmed') {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { memberId: inputMemberId } }] });
      }
    } catch (_e) {
      setStatus('not found');
    } finally {
      setLoading(false);
    }
  }

  const showMessage = status && status !== 'confirmed';
  const message = status === 'pending' ? 'Your account is not yet confirmed.'
    : status === 'suspended' ? 'Your account is suspended.'
    : status === 'not found' ? 'Member not found.'
    : null;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Login</Text>
      <TextInput label="Member ID" value={inputMemberId} onChangeText={setInputMemberId} style={{ marginBottom: 8 }} />
      {showMessage && <Text style={{ color: 'red', marginBottom: 8 }}>{message}</Text>}
      <Button mode="contained" onPress={handleLogin} loading={loading}>Login</Button>
      <Button onPress={() => navigation.navigate('Register')} style={{ marginTop: 8 }}>Register</Button>
    </View>
  );
}

