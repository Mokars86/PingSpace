import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import PingSpaceLogo from '../components/PingSpaceLogo';

const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Animate logo entrance immediately
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Show loader after logo animation
    const loaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 1000);

    return () => clearTimeout(loaderTimer);
  }, [fadeAnim, scaleAnim]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    loader: {
      marginTop: theme.spacing.lg,
    },
    version: {
      position: 'absolute',
      bottom: theme.spacing.xl,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.7)',
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <PingSpaceLogo
          size={120}
          showText={true}
          variant="white"
          style={{ marginBottom: theme.spacing.md }}
        />
      </Animated.View>

      {showLoader && (
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={styles.loader}
        />
      )}

      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
};

export default LoadingScreen;
