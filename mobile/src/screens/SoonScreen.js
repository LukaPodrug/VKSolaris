import * as React from 'react';
import { View, Text } from 'react-native';

export function SoonScreen({ title }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, color: '#888' }}>{title} — SOON</Text>
    </View>
  );
}
