import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

// Modern Input Component với Floating Label (giống LoginScreen)
const ModernInput = ({ 
  label, 
  icon, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  autoCapitalize = 'none',
  required = false,
}) => {
  const [focused, setFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: focused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (focused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [focused, value]);

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -8],
  });

  const labelSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.modernInputContainer}>
      <View style={[
        styles.modernInputWrapper,
        focused && styles.modernInputFocused
      ]}>
        {icon && (
          <View style={styles.modernIconContainer}>
            <MaterialCommunityIcons 
              name={icon} 
              size={20} 
              color={focused ? COLORS.ACCENT_SECONDARY : COLORS.TEXT_MUTED} 
            />
          </View>
        )}

        <View style={styles.modernInputInner}>
          <Animated.Text
            style={[
              styles.modernFloatingLabel,
              {
                top: labelTop,
                fontSize: labelSize,
                color: focused ? COLORS.ACCENT_SECONDARY : COLORS.TEXT_MUTED,
              },
            ]}
          >
            {label} {required && <Text style={styles.required}>*</Text>}
          </Animated.Text>

          <TextInput
            style={styles.modernInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={focused ? placeholder : ''}
            placeholderTextColor={COLORS.TEXT_MUTED}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </View>
      </View>

      {focused && (
        <Animated.View
          style={[
            styles.modernGlowBorder,
            { opacity: glowOpacity },
          ]}
        />
      )}
    </View>
  );
};

export default function ForgotPasswordScreen({ onBack, onReset }) {
  const [email, setEmail] = useState('');
  
  // Animations - giống hệt LoginScreen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation - bounce in with rotation (giống LoginScreen)
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Fade in và slide up cho form (giống LoginScreen)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse animation (giống LoginScreen)
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleReset = () => {
    if (email.trim()) {
      // Button press animation (giống LoginScreen)
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onReset && onReset();
      });
    }
  };

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <LinearGradient
      colors={[COLORS.BACKGROUND, COLORS.SIDEBAR, COLORS.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Animated Background Elements - giống LoginScreen */}
          <View style={styles.backgroundElements}>
            <Animated.View 
              style={[
                styles.glowCircle, 
                styles.glowCircle1,
                { opacity: glowOpacity }
              ]} 
            />
            <Animated.View 
              style={[
                styles.glowCircle, 
                styles.glowCircle2,
                { opacity: glowOpacity }
              ]} 
            />
            <Animated.View 
              style={[
                styles.glowCircle, 
                styles.glowCircle3,
                { opacity: glowOpacity }
              ]} 
            />
          </View>

          {/* Animated Logo - giống LoginScreen */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: logoScale },
                  { rotate: logoRotation },
                ],
              },
            ]}
          >
            <Animated.View style={[styles.logoGlow, { opacity: glowOpacity }]}>
              <MaterialCommunityIcons name="lock-reset" size={56} color={COLORS.ACCENT_PINK} />
            </Animated.View>
            <Text style={styles.logoText}>Nightcord</Text>
            <View style={styles.logoSubtitleContainer}>
              <MaterialCommunityIcons name="star" size={16} color={COLORS.ACCENT_SECONDARY} />
              <Text style={styles.logoSubtitle}>Reset your password</Text>
              <MaterialCommunityIcons name="star" size={16} color={COLORS.ACCENT_SECONDARY} />
            </View>
          </Animated.View>

          {/* Animated Welcome Message - giống LoginScreen */}
          <Animated.View
            style={[
              styles.welcomeContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[COLORS.ACCENT, COLORS.ACCENT_PINK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTextContainer}
            >
              <Text style={styles.welcomeTitle}>Forgot your password?</Text>
            </LinearGradient>
            <Text style={styles.welcomeSubtitle}>
              No worries! We'll send you a reset link ✨
            </Text>
          </Animated.View>

          {/* Animated Form Container - giống LoginScreen */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* Modern Email Input */}
            <ModernInput
              label="Email"
              icon="email-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              required
            />

            {/* Reset Button với Animation - giống LoginScreen */}
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
            >
              <TouchableOpacity
                onPress={handleReset}
                disabled={!email.trim()}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    email.trim()
                      ? [COLORS.ACCENT, COLORS.ACCENT_PINK]
                      : [COLORS.INPUT_BG, COLORS.INPUT_BG]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.resetButton,
                    (!email.trim()) && styles.resetButtonDisabled
                  ]}
                >
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.WHITE} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Back Link - giống LoginScreen */}
            <Animated.View
              style={[
                styles.backContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.divider} />
              <TouchableOpacity style={styles.backLink} onPress={onBack}>
                <MaterialCommunityIcons name="arrow-left" size={16} color={COLORS.ACCENT} />
                <Text style={styles.backLinkText}>Back to Login</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    minHeight: '100%',
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  glowCircle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  glowCircle1: {
    width: 300,
    height: 300,
    backgroundColor: COLORS.ACCENT,
    top: -100,
    right: -100,
  },
  glowCircle2: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.ACCENT_PINK,
    bottom: -50,
    left: -50,
  },
  glowCircle3: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.ACCENT_BLUE,
    top: '40%',
    left: '50%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoGlow: {
    shadowColor: COLORS.ACCENT_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 16,
  },
  logoText: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: COLORS.ACCENT_PINK,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  logoSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoSubtitle: {
    color: COLORS.ACCENT_SECONDARY,
    fontSize: 14,
    fontStyle: 'italic',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  gradientTextContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  welcomeTitle: {
    color: COLORS.WHITE,
    fontSize: 28,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    color: COLORS.TEXT_MUTED,
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: 'rgba(39, 39, 42, 0.6)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  // Modern Input Styles - giống LoginScreen
  modernInputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  modernInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.INPUT_BORDER,
    overflow: 'hidden',
    minHeight: 64,
  },
  modernInputFocused: {
    borderColor: COLORS.ACCENT,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  modernIconContainer: {
    paddingLeft: 20,
    paddingRight: 12,
  },
  modernInputInner: {
    flex: 1,
    position: 'relative',
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
  },
  modernFloatingLabel: {
    position: 'absolute',
    left: 0,
    fontWeight: '600',
    backgroundColor: COLORS.INPUT_BG,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  required: {
    color: COLORS.ERROR,
  },
  modernInput: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    paddingTop: 12,
    paddingBottom: 4,
    minHeight: 24,
  },
  modernGlowBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    shadowOpacity: 1,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 18,
    gap: 8,
    marginBottom: 20,
    shadowColor: COLORS.ACCENT_PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  resetButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  resetButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.DIVIDER,
    marginBottom: 16,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backLinkText: {
    color: COLORS.ACCENT,
    fontSize: 14,
    fontWeight: '500',
  },
});
