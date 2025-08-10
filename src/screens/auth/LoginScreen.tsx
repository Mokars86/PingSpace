import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import PingSpaceLogo from '../../components/PingSpaceLogo';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const { login, isLoading } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validation
    let hasErrors = false;

    if (!email.trim()) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing['3xl'],
    },
    logo: {
      fontSize: theme.typography.fontSize['4xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
      marginBottom: theme.spacing.md,
    },
    tagline: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    form: {
      marginBottom: theme.spacing.xl,
    },
    loginButton: {
      marginTop: theme.spacing.lg,
    },
    footer: {
      alignItems: 'center',
      paddingBottom: theme.spacing.xl,
    },
    footerText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    signupButton: {
      marginTop: theme.spacing.md,
    },
    forgotPasswordButton: {
      marginTop: theme.spacing.lg,
    },
    demoNote: {
      backgroundColor: theme.colors.info + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    demoNoteText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.info,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <PingSpaceLogo
              size={80}
              showText={true}
              variant="default"
              style={{ marginBottom: theme.spacing.md }}
            />
            <Text style={styles.subtitle}>
              Connect, collaborate, and communicate with AI-powered features
            </Text>
          </View>

          {/* Demo Note */}
          <View style={styles.demoNote}>
            <Text style={styles.demoNoteText}>
              This is a demo app. Use any email and password (minimum 6 characters) to login.
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              error={emailError}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              leftIcon="lock-closed"
              error={passwordError}
            />

            <Button
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            
            <Button
              title="Create Account"
              onPress={() => navigation.navigate('Register')}
              variant="outline"
              style={styles.signupButton}
            />

            <Button
              title="Forgot Password?"
              onPress={() => navigation.navigate('ForgotPassword')}
              variant="ghost"
              style={styles.forgotPasswordButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
