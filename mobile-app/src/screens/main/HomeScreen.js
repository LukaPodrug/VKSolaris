import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {useQuery} from 'react-query';
import {userAPI} from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StatusBadge = ({status}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'confirmed':
        return {color: '#4caf50', text: 'Confirmed', icon: 'check-circle'};
      case 'pending':
        return {color: '#ff9800', text: 'Pending Approval', icon: 'schedule'};
      case 'suspended':
        return {color: '#f44336', text: 'Suspended', icon: 'block'};
      default:
        return {color: '#666', text: 'Unknown', icon: 'help'};
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.statusBadge, {backgroundColor: config.color}]}>
      <Icon name={config.icon} size={16} color="#fff" />
      <Text style={styles.statusText}>{config.text}</Text>
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  const {user} = useAuth();
  
  const {data: canPurchaseData} = useQuery(
    'canPurchaseTicket',
    userAPI.canPurchaseTicket,
    {
      enabled: !!user,
    },
  );

  const canPurchase = canPurchaseData?.data?.canPurchase || false;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>
            {user?.firstName} {user?.lastName}
          </Text>
          <StatusBadge status={user?.status} />
        </View>

        {/* Club Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Solaris Waterpolo Club</Text>
          <Text style={styles.cardSubtitle}>
            Professional waterpolo team based in Croatia
          </Text>
          <Text style={styles.cardDescription}>
            Join us for an exciting season of competitive waterpolo. Purchase
            your season ticket to access all home games and exclusive member
            benefits.
          </Text>
        </View>

        {/* Season Ticket Status */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="confirmation-number" size={24} color="#1976d2" />
            <Text style={styles.cardTitle}>Season Ticket Status</Text>
          </View>
          
          {user?.hasSeasonTicket ? (
            <View style={styles.ticketActive}>
              <Icon name="check-circle" size={48} color="#4caf50" />
              <Text style={styles.ticketActiveText}>
                Active Season Ticket
              </Text>
              <Text style={styles.ticketYear}>
                Season {user.seasonTicketYear}
              </Text>
            </View>
          ) : (
            <View style={styles.ticketInactive}>
              <Icon name="local-activity" size={48} color="#666" />
              <Text style={styles.ticketInactiveText}>
                No Active Season Ticket
              </Text>
              {canPurchase ? (
                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={() => navigation.navigate('Purchase')}>
                  <Text style={styles.purchaseButtonText}>
                    Purchase Season Ticket
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.cannotPurchaseText}>
                  {user?.status === 'pending'
                    ? 'Account approval required to purchase tickets'
                    : user?.status === 'suspended'
                    ? 'Account suspended - contact support'
                    : 'Season ticket purchase unavailable'}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Tickets')}>
              <Icon name="confirmation-number" size={32} color="#1976d2" />
              <Text style={styles.actionText}>My Tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Profile')}>
              <Icon name="person" size={32} color="#1976d2" />
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>

            {user?.hasSeasonTicket && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Wallet')}>
                <Icon name="account-balance-wallet" size={32} color="#1976d2" />
                <Text style={styles.actionText}>Add to Wallet</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Account Status Info */}
        {user?.status === 'pending' && (
          <View style={styles.infoCard}>
            <Icon name="info" size={24} color="#ff9800" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Account Pending</Text>
              <Text style={styles.infoText}>
                Your account is awaiting approval from our administrators. You'll
                be able to purchase season tickets once your account is confirmed.
              </Text>
            </View>
          </View>
        )}

        {user?.discountPercentage > 0 && (
          <View style={styles.infoCard}>
            <Icon name="local-offer" size={24} color="#4caf50" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Special Discount</Text>
              <Text style={styles.infoText}>
                You have a {user.discountPercentage}% discount on season tickets!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ticketActive: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  ticketActiveText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 8,
  },
  ticketYear: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ticketInactive: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  ticketInactiveText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
  },
  purchaseButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cannotPurchaseText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});

export default HomeScreen;