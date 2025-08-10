import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface PaymentNotificationProps {
  id: string;
  type: 'request' | 'sent' | 'received';
  fromUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  toUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  amount: number;
  currency: string;
  note?: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  onAccept?: () => void;
  onDecline?: () => void;
  onView?: () => void;
}

const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  id,
  type,
  fromUser,
  toUser,
  amount,
  currency,
  note,
  timestamp,
  status,
  onAccept,
  onDecline,
  onView,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    typeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    requestIcon: {
      backgroundColor: theme.colors.warning + '20',
    },
    sentIcon: {
      backgroundColor: theme.colors.info + '20',
    },
    receivedIcon: {
      backgroundColor: theme.colors.success + '20',
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    amount: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    note: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      fontStyle: 'italic',
      marginTop: theme.spacing.xs,
      backgroundColor: theme.colors.inputBackground,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    timestamp: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.sm,
    },
    actions: {
      flexDirection: 'row',
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    actionButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    acceptButton: {
      backgroundColor: theme.colors.success,
    },
    declineButton: {
      backgroundColor: theme.colors.error,
    },
    viewButton: {
      backgroundColor: theme.colors.accent,
    },
    actionButtonText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: '#FFFFFF',
      marginLeft: theme.spacing.xs,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      alignSelf: 'flex-start',
      marginTop: theme.spacing.sm,
    },
    pendingBadge: {
      backgroundColor: theme.colors.warning + '20',
    },
    acceptedBadge: {
      backgroundColor: theme.colors.success + '20',
    },
    declinedBadge: {
      backgroundColor: theme.colors.error + '20',
    },
    completedBadge: {
      backgroundColor: theme.colors.info + '20',
    },
    statusText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
    },
    pendingText: {
      color: theme.colors.warning,
    },
    acceptedText: {
      color: theme.colors.success,
    },
    declinedText: {
      color: theme.colors.error,
    },
    completedText: {
      color: theme.colors.info,
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'request':
        return 'hand-left';
      case 'sent':
        return 'arrow-up';
      case 'received':
        return 'arrow-down';
      default:
        return 'card';
    }
  };

  const getTypeIconStyle = () => {
    switch (type) {
      case 'request':
        return styles.requestIcon;
      case 'sent':
        return styles.sentIcon;
      case 'received':
        return styles.receivedIcon;
      default:
        return styles.requestIcon;
    }
  };

  const getTypeIconColor = () => {
    switch (type) {
      case 'request':
        return theme.colors.warning;
      case 'sent':
        return theme.colors.info;
      case 'received':
        return theme.colors.success;
      default:
        return theme.colors.warning;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'request':
        return `${fromUser.name} requested money`;
      case 'sent':
        return `Money sent to ${toUser?.name || 'Unknown'}`;
      case 'received':
        return `Money received from ${fromUser.name}`;
      default:
        return 'Payment notification';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'request':
        return 'Tap to respond';
      case 'sent':
        return 'Transaction completed';
      case 'received':
        return 'Added to your wallet';
      default:
        return '';
    }
  };

  const getStatusBadgeStyle = () => {
    switch (status) {
      case 'pending':
        return styles.pendingBadge;
      case 'accepted':
        return styles.acceptedBadge;
      case 'declined':
        return styles.declinedBadge;
      case 'completed':
        return styles.completedBadge;
      default:
        return styles.pendingBadge;
    }
  };

  const getStatusTextStyle = () => {
    switch (status) {
      case 'pending':
        return styles.pendingText;
      case 'accepted':
        return styles.acceptedText;
      case 'declined':
        return styles.declinedText;
      case 'completed':
        return styles.completedText;
      default:
        return styles.pendingText;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const handleAccept = () => {
    Alert.alert(
      'Accept Payment Request',
      `Accept ${formatCurrency(amount, currency)} request from ${fromUser.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            onAccept?.();
            Alert.alert('Payment Sent', `${formatCurrency(amount, currency)} has been sent to ${fromUser.name}.`);
          },
        },
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      'Decline Payment Request',
      `Decline ${formatCurrency(amount, currency)} request from ${fromUser.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            onDecline?.();
            Alert.alert('Request Declined', 'The payment request has been declined.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.typeIcon, getTypeIconStyle()]}>
          <Ionicons
            name={getTypeIcon() as any}
            size={20}
            color={getTypeIconColor()}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>
        <Text style={styles.amount}>{formatCurrency(amount, currency)}</Text>
      </View>

      {note && (
        <Text style={styles.note}>"{note}"</Text>
      )}

      <View style={[styles.statusBadge, getStatusBadgeStyle()]}>
        <Text style={[styles.statusText, getStatusTextStyle()]}>
          {getStatusText()}
        </Text>
      </View>

      <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>

      {type === 'request' && status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={handleDecline}
          >
            <Ionicons name="close" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {(type === 'sent' || type === 'received' || status !== 'pending') && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={onView}
          >
            <Ionicons name="eye" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PaymentNotification;
