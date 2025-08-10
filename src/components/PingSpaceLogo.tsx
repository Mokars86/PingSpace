import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle, Path, Ellipse } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

interface PingSpaceLogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
  style?: any;
}

const PingSpaceLogo: React.FC<PingSpaceLogoProps> = ({ 
  size = 60, 
  showText = true, 
  variant = 'default',
  style 
}) => {
  const { theme } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.8)',
          text: '#FFFFFF',
        };
      case 'dark':
        return {
          primary: '#1a1a1a',
          secondary: '#333333',
          text: '#1a1a1a',
        };
      default:
        return {
          primary: theme.colors.accent,
          secondary: theme.colors.primary,
          text: theme.colors.text,
        };
    }
  };

  const colors = getColors();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: showText ? 8 : 0,
    },
    textContainer: {
      alignItems: 'center',
    },
    brandText: {
      fontSize: size * 0.3,
      fontFamily: theme.typography.fontFamily.bold,
      color: colors.text,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    tagline: {
      fontSize: size * 0.15,
      fontFamily: theme.typography.fontFamily.regular,
      color: colors.secondary,
      marginTop: 2,
      opacity: 0.8,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoContainer}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* White Background Circle */}
          <Circle cx="60" cy="60" r="60" fill={variant === 'white' ? 'rgba(255,255,255,0.1)' : 'white'} />

          {/* Central Intelligence Hub */}
          <Circle cx="60" cy="60" r="16" fill={colors.primary} />
          <Circle cx="60" cy="60" r="10" fill="white" fillOpacity="0.3" />

          {/* AI Brain Pattern */}
          <Path d="M55 55 Q60 50 65 55 Q60 60 55 55" fill="white" fillOpacity="0.8" />
          <Path d="M55 65 Q60 70 65 65 Q60 60 55 65" fill="white" fillOpacity="0.8" />
          <Circle cx="57" cy="57" r="1" fill="white" />
          <Circle cx="63" cy="57" r="1" fill="white" />
          <Circle cx="60" cy="63" r="1" fill="white" />

          {/* Message Bubbles Network */}
          {/* Top Messages */}
          <Ellipse cx="60" cy="25" rx="12" ry="8" fill={colors.primary} fillOpacity="0.8" />
          <Ellipse cx="60" cy="25" rx="8" ry="5" fill="white" fillOpacity="0.9" />
          <Circle cx="57" cy="25" r="1" fill={colors.primary} />
          <Circle cx="63" cy="25" r="1" fill={colors.primary} />

          {/* Right Messages */}
          <Ellipse cx="95" cy="60" rx="8" ry="12" fill={colors.primary} fillOpacity="0.8" />
          <Ellipse cx="95" cy="60" rx="5" ry="8" fill="white" fillOpacity="0.9" />
          <Circle cx="95" cy="57" r="1" fill={colors.primary} />
          <Circle cx="95" cy="63" r="1" fill={colors.primary} />

          {/* Bottom Messages */}
          <Ellipse cx="60" cy="95" rx="12" ry="8" fill={colors.primary} fillOpacity="0.8" />
          <Ellipse cx="60" cy="95" rx="8" ry="5" fill="white" fillOpacity="0.9" />
          <Circle cx="57" cy="95" r="1" fill={colors.primary} />
          <Circle cx="63" cy="95" r="1" fill={colors.primary} />

          {/* Left Messages */}
          <Ellipse cx="25" cy="60" rx="8" ry="12" fill={colors.primary} fillOpacity="0.8" />
          <Ellipse cx="25" cy="60" rx="5" ry="8" fill="white" fillOpacity="0.9" />
          <Circle cx="25" cy="57" r="1" fill={colors.primary} />
          <Circle cx="25" cy="63" r="1" fill={colors.primary} />

          {/* Intelligent Connection Lines */}
          <Path d="M60 44 L60 33" stroke={colors.primary} strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
          <Path d="M76 60 L87 60" stroke={colors.primary} strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
          <Path d="M60 76 L60 87" stroke={colors.primary} strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
          <Path d="M44 60 L33 60" stroke={colors.primary} strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />

          {/* Diagonal Smart Connections */}
          <Path d="M70 50 L85 35" stroke={colors.primary} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3,2" strokeLinecap="round" />
          <Path d="M70 70 L85 85" stroke={colors.primary} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3,2" strokeLinecap="round" />
          <Path d="M50 70 L35 85" stroke={colors.primary} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3,2" strokeLinecap="round" />
          <Path d="M50 50 L35 35" stroke={colors.primary} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3,2" strokeLinecap="round" />

          {/* Corner Activity Indicators */}
          <Circle cx="85" cy="35" r="4" fill="white" />
          <Circle cx="85" cy="35" r="2" fill={colors.primary} />
          <Circle cx="85" cy="85" r="4" fill="white" />
          <Circle cx="85" cy="85" r="2" fill={colors.primary} />
          <Circle cx="35" cy="85" r="4" fill="white" />
          <Circle cx="35" cy="85" r="2" fill={colors.primary} />
          <Circle cx="35" cy="35" r="4" fill="white" />
          <Circle cx="35" cy="35" r="2" fill={colors.primary} />

          {/* Ping Wave Rings */}
          <Circle cx="60" cy="60" r="25" stroke={colors.primary} strokeWidth="1" strokeOpacity="0.2" fill="none" />
          <Circle cx="60" cy="60" r="35" stroke={colors.primary} strokeWidth="1" strokeOpacity="0.2" fill="none" />
          <Circle cx="60" cy="60" r="45" stroke={colors.primary} strokeWidth="1" strokeOpacity="0.2" fill="none" />

          {/* Smart Features Icons */}
          {/* Marketplace indicator */}
          <Path d="M80 20 L88 20 Q89 20 89 21 L89 25 Q89 26 88 26 L80 26 Q79 26 79 25 L79 21 Q79 20 80 20 Z" fill="white" />
          <Path d="M81 22 L81 21 Q81 20 82 20 L86 20 Q87 20 87 21 L87 22" stroke={colors.primary} strokeWidth="0.5" fill="none" />

          {/* Status indicator */}
          <Circle cx="24" cy="84" r="4" fill="white" />
          <Circle cx="24" cy="84" r="2" fill={colors.primary} />
          <Circle cx="24" cy="82" r="0.5" fill="white" />
        </Svg>
      </View>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.brandText}>PingSpace</Text>
          <Text style={styles.tagline}>Connect • Shop • Pay</Text>
        </View>
      )}
    </View>
  );
};

export default PingSpaceLogo;
