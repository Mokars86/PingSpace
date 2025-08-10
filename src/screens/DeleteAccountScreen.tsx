import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const DeleteAccountScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [step, setStep] = useState<'warning' | 'reasons' | 'confirmation' | 'export'>('warning');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [password, setPassword] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deletionReasons = [
    'I no longer use this app',
    'Privacy concerns',
    'Too many notifications',
    'Found a better alternative',
    'Account security issues',
    'App is too complicated',
    'Technical problems',
    'Other (please specify)',
  ];

  const dataTypes = [
    { type: 'Messages', description: 'All your chat messages and media', size: '2.3 GB' },
    { type: 'Contacts', description: 'Your contact list and blocked users', size: '1.2 MB' },
    { type: 'Wallet Data', description: 'Transaction history and payment info', size: '45 MB' },
    { type: 'Profile', description: 'Profile information and settings', size: '2.1 MB' },
    { type: 'Spaces', description: 'Space data and shared content', size: '890 MB' },
    { type: 'Marketplace', description: 'Orders, products, and reviews', size: '156 MB' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    warningCard: {
      backgroundColor: theme.colors.error + '20',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    warningIcon: {
      alignSelf: 'center',
      marginBottom: theme.spacing.md,
    },
    warningTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      fontWeight: 'bold',
    },
    warningText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: 24,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    warningList: {
      marginBottom: theme.spacing.lg,
    },
    warningListItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    warningListBullet: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.error,
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    warningListText: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: 22,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
    },
    reasonItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    reasonItemSelected: {
      borderColor: theme.colors.error,
      backgroundColor: theme.colors.error + '10',
    },
    reasonText: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
    },
    customReasonInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      height: 80,
      textAlignVertical: 'top',
      marginTop: theme.spacing.md,
    },
    dataTypeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    dataTypeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.info + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    dataTypeInfo: {
      flex: 1,
    },
    dataTypeName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
    dataTypeDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    dataTypeSize: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    confirmationInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    passwordInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    continueButton: {
      backgroundColor: theme.colors.error,
    },
    continueButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    continueButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    exportButton: {
      backgroundColor: theme.colors.info,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    exportButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    skipExportButton: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    skipExportButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    progressText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
  });

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      Alert.alert(
        'Export Complete',
        'Your data has been exported. You will receive an email with download instructions.',
        [{ text: 'OK', onPress: () => setStep('confirmation') }]
      );
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export your data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE MY ACCOUNT') {
      Alert.alert('Confirmation Error', 'Please type "DELETE MY ACCOUNT" exactly as shown.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your password to confirm deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted. Thank you for using PingSpace.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login or splash screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Deletion Failed', 'Failed to delete your account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const canContinue = () => {
    switch (step) {
      case 'reasons':
        return selectedReasons.length > 0 && (
          !selectedReasons.includes('Other (please specify)') || customReason.trim()
        );
      case 'confirmation':
        return confirmationText === 'DELETE MY ACCOUNT' && password.trim();
      default:
        return true;
    }
  };

  const renderWarningStep = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.warningCard}>
        <Ionicons
          name="warning"
          size={48}
          color={theme.colors.error}
          style={styles.warningIcon}
        />
        <Text style={styles.warningTitle}>Delete Account</Text>
        <Text style={styles.warningText}>
          This action is permanent and cannot be undone. Once deleted:
        </Text>
        <View style={styles.warningList}>
          <View style={styles.warningListItem}>
            <Text style={styles.warningListBullet}>•</Text>
            <Text style={styles.warningListText}>
              All your messages, media, and chat history will be permanently deleted
            </Text>
          </View>
          <View style={styles.warningListItem}>
            <Text style={styles.warningListBullet}>•</Text>
            <Text style={styles.warningListText}>
              Your wallet balance and transaction history will be lost
            </Text>
          </View>
          <View style={styles.warningListItem}>
            <Text style={styles.warningListBullet}>•</Text>
            <Text style={styles.warningListText}>
              You will be removed from all spaces and groups
            </Text>
          </View>
          <View style={styles.warningListItem}>
            <Text style={styles.warningListBullet}>•</Text>
            <Text style={styles.warningListText}>
              Your marketplace listings and orders will be cancelled
            </Text>
          </View>
          <View style={styles.warningListItem}>
            <Text style={styles.warningListBullet}>•</Text>
            <Text style={styles.warningListText}>
              You cannot recover your account or data after deletion
            </Text>
          </View>
        </View>
        <Text style={styles.warningText}>
          We recommend exporting your data before proceeding with account deletion.
        </Text>
      </View>
    </ScrollView>
  );

  const renderReasonsStep = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Why are you deleting your account?</Text>
      <Text style={styles.warningText}>
        Your feedback helps us improve PingSpace for everyone.
      </Text>
      
      {deletionReasons.map((reason) => (
        <TouchableOpacity
          key={reason}
          style={[
            styles.reasonItem,
            selectedReasons.includes(reason) && styles.reasonItemSelected,
          ]}
          onPress={() => handleReasonToggle(reason)}
        >
          <Ionicons
            name={selectedReasons.includes(reason) ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color={selectedReasons.includes(reason) ? theme.colors.error : theme.colors.textMuted}
          />
          <Text style={styles.reasonText}>{reason}</Text>
        </TouchableOpacity>
      ))}

      {selectedReasons.includes('Other (please specify)') && (
        <TextInput
          style={styles.customReasonInput}
          placeholder="Please tell us more..."
          placeholderTextColor={theme.colors.textMuted}
          value={customReason}
          onChangeText={setCustomReason}
          multiline
          maxLength={200}
        />
      )}
    </ScrollView>
  );

  const renderExportStep = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Export Your Data</Text>
      <Text style={styles.warningText}>
        Before deleting your account, you can export your data. This includes:
      </Text>

      {dataTypes.map((dataType) => (
        <View key={dataType.type} style={styles.dataTypeItem}>
          <View style={styles.dataTypeIcon}>
            <Ionicons name="document" size={20} color={theme.colors.info} />
          </View>
          <View style={styles.dataTypeInfo}>
            <Text style={styles.dataTypeName}>{dataType.type}</Text>
            <Text style={styles.dataTypeDescription}>{dataType.description}</Text>
          </View>
          <Text style={styles.dataTypeSize}>{dataType.size}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.exportButton}
        onPress={handleExportData}
        disabled={isExporting}
      >
        {isExporting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.exportButtonText}>Export My Data</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipExportButton}
        onPress={() => setStep('confirmation')}
        disabled={isExporting}
      >
        <Text style={styles.skipExportButtonText}>Skip Export</Text>
      </TouchableOpacity>

      {isExporting && (
        <Text style={styles.progressText}>
          Preparing your data for export...
        </Text>
      )}
    </ScrollView>
  );

  const renderConfirmationStep = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.warningCard}>
        <Ionicons
          name="skull"
          size={48}
          color={theme.colors.error}
          style={styles.warningIcon}
        />
        <Text style={styles.warningTitle}>Final Confirmation</Text>
        <Text style={styles.warningText}>
          This is your last chance to cancel. Type "DELETE MY ACCOUNT" below to confirm:
        </Text>
      </View>

      <TextInput
        style={styles.confirmationInput}
        placeholder="Type: DELETE MY ACCOUNT"
        placeholderTextColor={theme.colors.textMuted}
        value={confirmationText}
        onChangeText={setConfirmationText}
        autoCapitalize="characters"
      />

      <Text style={styles.sectionTitle}>Enter Your Password</Text>
      <TextInput
        style={styles.passwordInput}
        placeholder="Enter your password"
        placeholderTextColor={theme.colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[
          styles.continueButton,
          !canContinue() && styles.continueButtonDisabled,
        ]}
        onPress={handleDeleteAccount}
        disabled={!canContinue() || isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.continueButtonText}>Delete My Account Forever</Text>
        )}
      </TouchableOpacity>

      {isDeleting && (
        <Text style={styles.progressText}>
          Deleting your account...
        </Text>
      )}
    </ScrollView>
  );

  const getStepContent = () => {
    switch (step) {
      case 'warning':
        return renderWarningStep();
      case 'reasons':
        return renderReasonsStep();
      case 'export':
        return renderExportStep();
      case 'confirmation':
        return renderConfirmationStep();
      default:
        return renderWarningStep();
    }
  };

  const getNextStep = () => {
    switch (step) {
      case 'warning':
        return 'reasons';
      case 'reasons':
        return 'export';
      case 'export':
        return 'confirmation';
      default:
        return 'warning';
    }
  };

  const handleContinue = () => {
    if (step === 'confirmation') {
      handleDeleteAccount();
    } else {
      setStep(getNextStep() as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
      </View>

      <View style={styles.content}>
        {getStepContent()}

        {step !== 'export' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.continueButton,
                !canContinue() && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!canContinue() || isDeleting}
            >
              <Text style={styles.continueButtonText}>
                {step === 'confirmation' ? 'Delete Account' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;
