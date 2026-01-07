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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { authAPI } from '../services/api';

export default function LoginScreen({ onLogin, onNavigateToRegister, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const passwordInputRef = useRef(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation - bounce in with rotation
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

    // Fade in và slide up cho form
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

    // Glow pulse animation
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

  // Validation functions
  const validateEmail = (emailValue) => {
    if (!emailValue.trim()) {
      return 'Email hoặc Username không được để trống';
    }
    return '';
  };

  const validatePassword = (passwordValue) => {
    if (!passwordValue.trim()) {
      return 'Mật khẩu không được để trống';
    }
    if (passwordValue.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return '';
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (errors.email) {
      setErrors({ ...errors, email: validateEmail(text) });
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) {
      setErrors({ ...errors, password: validatePassword(text) });
    }
  };

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({ email: '', password: '', general: '' });

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        general: '',
      });
      return;
    }

    setLoading(true);
    
    // Button press animation
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
    ]).start();

    try {
      const response = await authAPI.login(email.trim(), password);
      
      if (response.success) {
        setErrors({ email: '', password: '', general: '' });
        // Tự động chuyển vào app sau khi đăng nhập thành công
        onLogin(response.user, response.token);
      } else {
        setErrors({
          email: '',
          password: '',
          general: response.message || 'Đăng nhập thất bại',
        });
      }
    } catch (error) {
      setErrors({
        email: '',
        password: '',
        general: error.message || 'Không thể kết nối đến server. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
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
          {/* Animated Background Elements */}
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

          {/* Animated Logo */}
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
              <MaterialCommunityIcons name="music-note" size={56} color={COLORS.ACCENT_PINK} />
            </Animated.View>
            <Text style={styles.logoText}>Nightcord</Text>
            <View style={styles.logoSubtitleContainer}>
              <MaterialCommunityIcons name="star" size={16} color={COLORS.ACCENT_SECONDARY} />
              <Text style={styles.logoSubtitle}>Where music meets night</Text>
              <MaterialCommunityIcons name="star" size={16} color={COLORS.ACCENT_SECONDARY} />
            </View>
          </Animated.View>

          {/* Animated Welcome Message */}
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
              <Text style={styles.welcomeTitle}>Welcome back!</Text>
            </LinearGradient>
            <Text style={styles.welcomeSubtitle}>
              We're so excited to see you again! ✨
            </Text>
          </Animated.View>

          {/* Animated Form Container */}
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
            {/* Email Input */}
            <Animated.View
              style={[
                styles.inputGroup,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="email-outline" size={16} color={COLORS.ACCENT_SECONDARY} />
                <Text style={styles.label}>
                  Email or Phone Number <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'email' && styles.inputWrapperFocused,
                errors.email && styles.inputWrapperError
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email or phone"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={email}
                  onChangeText={handleEmailChange}
                  onFocus={() => {
                    setFocusedInput('email');
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  onBlur={() => {
                    setFocusedInput(null);
                    setErrors({ ...errors, email: validateEmail(email) });
                  }}
                  onSubmitEditing={() => {
                    // Khi nhấn Enter ở email, focus vào password
                    passwordInputRef.current?.focus();
                  }}
                  returnKeyType="next"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email ? (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={14} color={COLORS.ERROR} />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </View>
              ) : null}
            </Animated.View>

            {/* Password Input */}
            <Animated.View
              style={[
                styles.inputGroup,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="lock-outline" size={16} color={COLORS.ACCENT_SECONDARY} />
                <Text style={styles.label}>
                  Password <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'password' && styles.inputWrapperFocused,
                errors.password && styles.inputWrapperError
              ]}>
                <TextInput
                  ref={passwordInputRef}
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={() => {
                    setFocusedInput('password');
                    if (errors.password) {
                      setErrors({ ...errors, password: '' });
                    }
                  }}
                  onBlur={() => {
                    setFocusedInput(null);
                    setErrors({ ...errors, password: validatePassword(password) });
                  }}
                  onSubmitEditing={handleLogin}
                  returnKeyType="done"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.ACCENT_SECONDARY}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={14} color={COLORS.ERROR} />
                  <Text style={styles.errorText}>{errors.password}</Text>
                </View>
              ) : null}
            </Animated.View>

            {/* General Error Message */}
            {errors.general ? (
              <Animated.View
                style={[
                  styles.generalErrorContainer,
                  { opacity: fadeAnim }
                ]}
              >
                <MaterialCommunityIcons name="alert-circle" size={18} color={COLORS.ERROR} />
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </Animated.View>
            ) : null}

            {/* Forgot Password Link */}
            <Animated.View
              style={{
                opacity: fadeAnim,
              }}
            >
              <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={onForgotPassword}
            >
                <Text style={styles.linkText}>Forgot your password?</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.ACCENT} />
              </TouchableOpacity>
            </Animated.View>

            {/* Login Button với Animation */}
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
            >
              <TouchableOpacity
                onPress={handleLogin}
                disabled={!email.trim() || !password.trim() || loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    email.trim() && password.trim() && !loading
                      ? [COLORS.ACCENT, COLORS.ACCENT_PINK]
                      : [COLORS.INPUT_BG, COLORS.INPUT_BG]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.loginButton,
                    (!email.trim() || !password.trim() || loading) && styles.loginButtonDisabled
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.WHITE} />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Log In</Text>
                      <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.WHITE} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Register Link */}
            <Animated.View
              style={[
                styles.registerContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.divider} />
              <Text style={styles.registerText}>
                Need an account?{' '}
                <Text style={styles.linkTextBold} onPress={onNavigateToRegister}>
                  Register
                </Text>
              </Text>
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
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    color: COLORS.TEXT_NORMAL,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: COLORS.ERROR,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.INPUT_BORDER,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputWrapperFocused: {
    borderColor: COLORS.INPUT_FOCUS,
    shadowColor: COLORS.INPUT_FOCUS,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    paddingVertical: 12,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 24,
    gap: 4,
  },
  linkText: {
    color: COLORS.ACCENT,
    fontSize: 14,
    fontWeight: '500',
  },
  linkTextBold: {
    color: COLORS.ACCENT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 16,
    gap: 8,
    marginBottom: 20,
    shadowColor: COLORS.ACCENT_PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  loginButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.DIVIDER,
    marginBottom: 16,
  },
  registerText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
  },
  inputWrapperError: {
    borderColor: COLORS.ERROR,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    flex: 1,
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  generalErrorText: {
    color: COLORS.ERROR,
    fontSize: 13,
    flex: 1,
  },
});
