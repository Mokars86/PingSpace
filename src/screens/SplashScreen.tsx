import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the splash animation sequence
    const animationSequence = Animated.sequence([
      // Logo entrance
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
      ]),
      
      // Logo rotation
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      // Text slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      
      // Hold for a moment
      Animated.delay(1000),
      
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start(() => {
      onFinish();
    });
  }, [fadeAnim, scaleAnim, slideAnim, logoRotateAnim, onFinish]);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ff1744', // Vibrant red background
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    },
    logoBackground: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#FFFFFF', // Solid white background
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    logoIcon: {
      marginBottom: 10,
    },
    appName: {
      fontSize: 42,
      fontWeight: 'bold',
      color: '#FFFFFF',
      letterSpacing: 2,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    tagline: {
      fontSize: 18,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      marginTop: 10,
      fontWeight: '300',
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      marginTop: 20,
      fontWeight: '400',
    },
    loadingContainer: {
      position: 'absolute',
      bottom: 100,
      alignItems: 'center',
    },
    loadingText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 16,
      marginTop: 20,
      fontWeight: '500',
    },
    decorativeElements: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    circle1: {
      position: 'absolute',
      top: 100,
      right: 50,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    circle2: {
      position: 'absolute',
      bottom: 200,
      left: 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    circle3: {
      position: 'absolute',
      top: 250,
      left: 80,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff1744" />
      
      {/* Decorative Background Elements */}
      <View style={styles.decorativeElements}>
        <Animated.View 
          style={[
            styles.circle1,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: logoRotation },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            styles.circle2,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: logoRotation },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            styles.circle3,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: logoRotation },
              ],
            },
          ]}
        />
      </View>

      {/* Main Logo and Text */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoBackground,
            {
              transform: [{ rotate: logoRotation }],
            },
          ]}
        >
          <Ionicons
            name="chatbubbles"
            size={50}
            color="#ff1744"
            style={styles.logoIcon}
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.appName,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          PingSpace
        </Animated.Text>

        <Animated.Text
          style={[
            styles.tagline,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          Messaging meets intelligent flow
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          Connect • Collaborate • Commerce
        </Animated.Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ rotate: logoRotation }],
          }}
        >
          <Ionicons
            name="sync"
            size={24}
            color="rgba(255, 255, 255, 0.8)"
          />
        </Animated.View>
        <Text style={styles.loadingText}>Loading your experience...</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
