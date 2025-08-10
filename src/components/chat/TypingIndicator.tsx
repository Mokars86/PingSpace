import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TypingIndicatorProps {
  isVisible: boolean;
  userNames: string[];
  maxDisplayNames?: number;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isVisible,
  userNames,
  maxDisplayNames = 3,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Fade in the typing indicator
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Start the dot animation
      startDotAnimation();
    } else {
      // Fade out the typing indicator
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const startDotAnimation = () => {
    const animateDot = (dotAnim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      animateDot(dot1Anim, 0),
      animateDot(dot2Anim, 200),
      animateDot(dot3Anim, 400),
    ]).start();
  };

  const getTypingText = () => {
    if (userNames.length === 0) return '';
    
    if (userNames.length === 1) {
      return `${userNames[0]} is typing...`;
    } else if (userNames.length <= maxDisplayNames) {
      const lastUser = userNames[userNames.length - 1];
      const otherUsers = userNames.slice(0, -1).join(', ');
      return `${otherUsers} and ${lastUser} are typing...`;
    } else {
      const displayedUsers = userNames.slice(0, maxDisplayNames).join(', ');
      const remainingCount = userNames.length - maxDisplayNames;
      return `${displayedUsers} and ${remainingCount} other${remainingCount > 1 ? 's' : ''} are typing...`;
    }
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      opacity: isVisible ? 1 : 0,
    },
    typingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.messageReceived,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      maxWidth: '75%',
      borderBottomLeftRadius: theme.borderRadius.sm,
    },
    typingText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.textMuted,
      marginHorizontal: 1,
    },
  });

  if (!isVisible && fadeAnim._value === 0) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.typingBubble}>
        <Text style={styles.typingText}>{getTypingText()}</Text>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot1Anim,
                transform: [
                  {
                    scale: dot1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot2Anim,
                transform: [
                  {
                    scale: dot2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot3Anim,
                transform: [
                  {
                    scale: dot3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default TypingIndicator;
