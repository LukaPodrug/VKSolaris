import * as React from 'react';
import { View, Text, Linking } from 'react-native';
import { Banner, Button } from 'react-native-paper';
import { api } from '../api/client';

export function ProfileScreen({ route }) {
  const { memberId } = route.params || {};
  const [promo, setPromo] = React.useState(null);
  const [purchaseStatus, setPurchaseStatus] = React.useState('none');
  const [loading, setLoading] = React.useState(false);
  const [applePassUrl, setApplePassUrl] = React.useState(null);
  const [googleWalletUrl, setGoogleWalletUrl] = React.useState(null);

  async function loadPromo() {
    try {
      const { data } = await api.get('/public/active-promo');
      setPromo(data?.code || null);
    } catch (_e) {
      setPromo(null);
    }
  }

  async function loadPurchaseStatus() {
    try {
      const { data } = await api.get('/public/purchase-status', { params: { memberId } });
      setPurchaseStatus(data.status || 'none');
    } catch (_e) {
      setPurchaseStatus('none');
    }
  }

  async function ensureWalletIssued() {
    try {
      const { data } = await api.post('/public/wallet/issue', { memberId });
      setApplePassUrl(data.applePassUrl || null);
      setGoogleWalletUrl(data.googleWalletUrl || null);
    } catch (_e) {
      setApplePassUrl(null);
      setGoogleWalletUrl(null);
    }
  }

  React.useEffect(() => {
    loadPromo();
    loadPurchaseStatus();
  }, []);

  React.useEffect(() => {
    if (purchaseStatus === 'active') {
      ensureWalletIssued();
    }
  }, [purchaseStatus]);

  async function startCheckout() {
    setLoading(true);
    try {
      const { data } = await api.post('/public/checkout-session', { memberId, promoCode: promo });
      if (data?.url) {
        await Linking.openURL(data.url);
      }
    } catch (_e) {
      // swallow for now
    } finally {
      setLoading(false);
    }
  }

  const isPurchased = purchaseStatus === 'active';

  return (
    <View style={{ flex: 1 }}>
      {isPurchased ? (
        <Banner visible actions={[{ label: 'Refresh', onPress: () => { loadPurchaseStatus(); ensureWalletIssued(); } }]}>
          Purchase confirmed. Thank you for subscribing!
        </Banner>
      ) : (
        <Banner visible actions={[{ label: 'Buy', onPress: startCheckout }]}>
          {promo ? `Limited-time discount code ${promo}. ` : ''}Tap to subscribe.
        </Banner>
      )}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18 }}>Profile</Text>
        <Text style={{ marginTop: 8 }}>Member ID: {memberId}</Text>
        {!isPurchased && (
          <Button style={{ marginTop: 12 }} mode="contained" onPress={startCheckout} loading={loading}>
            Subscribe
          </Button>
        )}
        {isPurchased && (
          <View style={{ marginTop: 16, width: '80%' }}>
            {applePassUrl ? (
              <Button mode="contained" onPress={() => Linking.openURL(applePassUrl)} style={{ marginBottom: 8 }}>
                Add to Apple Wallet
              </Button>
            ) : (
              <Text style={{ textAlign: 'center', color: '#888', marginBottom: 8 }}>Apple Wallet — Coming soon</Text>
            )}
            {googleWalletUrl ? (
              <Button mode="contained" onPress={() => Linking.openURL(googleWalletUrl)}>
                Add to Google Wallet
              </Button>
            ) : (
              <Text style={{ textAlign: 'center', color: '#888' }}>Google Wallet — Coming soon</Text>
            )}
          </View>
        )}
        <Button style={{ marginTop: 8 }} onPress={() => { loadPurchaseStatus(); ensureWalletIssued(); }}>Refresh</Button>
      </View>
    </View>
  );
}
