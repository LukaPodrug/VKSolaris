import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { api } from '../api/client';

export function StatusScreen({ route }) {
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
