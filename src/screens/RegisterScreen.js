import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { authAPI } from '../services/api';

export default function RegisterScreen({ onRegister, onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    dateOfBirth: '',
    general: '',
  });
  
  // Refs for input navigation
  const displayNameInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const monthInputRef = useRef(null);
  const dayInputRef = useRef(null);
  const yearInputRef = useRef(null);

  // Validation functions
  const validateEmail = (emailValue) => {
    if (!emailValue.trim()) {
      return 'Email không được để trống';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue.trim())) {
      return 'Email không hợp lệ';
    }
    return '';
  };

  const validateUsername = (usernameValue) => {
    if (!usernameValue.trim()) {
      return 'Username không được để trống';
    }
    if (usernameValue.trim().length < 3) {
      return 'Username phải có ít nhất 3 ký tự';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(usernameValue.trim())) {
      return 'Username chỉ được chứa chữ cái, số và dấu gạch dưới';
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

  // Helper functions to limit input values
  const handleMonthChange = (text) => {
    // Chỉ cho phép số
    const numericValue = text.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setMonth('');
      return;
    }
    
    const num = parseInt(numericValue);
    
    // Giới hạn tháng từ 01-12
    if (num === 0) {
      setMonth('');
    } else if (num > 12) {
      setMonth('12');
    } else if (num < 1) {
      setMonth('1');
    } else {
      setMonth(numericValue);
    }
    
    // Clear error khi đang nhập
    if (errors.dateOfBirth) {
      setErrors({ ...errors, dateOfBirth: '' });
    }
  };

  const handleDayChange = (text) => {
    // Chỉ cho phép số
    const numericValue = text.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setDay('');
      return;
    }
    
    const num = parseInt(numericValue);
    const monthNum = parseInt(month) || 12;
    
    // Giới hạn ngày từ 01-31, nhưng validate theo tháng
    let maxDay = 31;
    if (monthNum === 2) {
      // Tháng 2: tối đa 29 ngày (sẽ validate năm sau)
      maxDay = 29;
    } else if ([4, 6, 9, 11].includes(monthNum)) {
      // Tháng 4, 6, 9, 11: tối đa 30 ngày
      maxDay = 30;
    }
    
    if (num === 0) {
      setDay('');
    } else if (num > maxDay) {
      setDay(maxDay.toString());
    } else if (num < 1) {
      setDay('1');
    } else {
      setDay(numericValue);
    }
    
    // Clear error khi đang nhập
    if (errors.dateOfBirth) {
      setErrors({ ...errors, dateOfBirth: '' });
    }
  };

  const handleYearChange = (text) => {
    // Chỉ cho phép số và giới hạn 4 chữ số
    const numericValue = text.replace(/[^0-9]/g, '').slice(0, 4);
    
    if (numericValue === '') {
      setYear('');
      return;
    }
    
    const currentYear = new Date().getFullYear();
    const num = parseInt(numericValue);
    
    // Giới hạn năm từ 1900 đến năm hiện tại
    if (numericValue.length === 4) {
      if (num < 1900) {
        setYear('1900');
      } else if (num > currentYear) {
        setYear(currentYear.toString());
      } else {
        setYear(numericValue);
      }
    } else {
      setYear(numericValue);
    }
    
    // Clear error khi đang nhập
    if (errors.dateOfBirth) {
      setErrors({ ...errors, dateOfBirth: '' });
    }
  };

  const validateDateOfBirth = (monthValue, dayValue, yearValue) => {
    if (!monthValue || !dayValue || !yearValue) {
      return 'Vui lòng nhập đầy đủ ngày tháng năm';
    }

    const monthNum = parseInt(monthValue);
    const dayNum = parseInt(dayValue);
    const yearNum = parseInt(yearValue);

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return 'Tháng không hợp lệ (1-12)';
    }

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      return 'Ngày không hợp lệ (1-31)';
    }

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      return `Năm không hợp lệ (1900-${new Date().getFullYear()})`;
    }

    // Check if date is valid (e.g., Feb 30 doesn't exist)
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getFullYear() !== yearNum || date.getMonth() !== monthNum - 1 || date.getDate() !== dayNum) {
      return 'Ngày tháng năm không hợp lệ';
    }

    // Check age (must be at least 13 years old)
    const today = new Date();
    const age = today.getFullYear() - yearNum;
    const monthDiff = today.getMonth() - (monthNum - 1);
    const dayDiff = today.getDate() - dayNum;

    if (age < 13 || (age === 13 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
      return 'Bạn phải ít nhất 13 tuổi để đăng ký';
    }

    return '';
  };

  const handleRegister = async () => {
    // Clear previous errors
    setErrors({
      email: '',
      username: '',
      password: '',
      dateOfBirth: '',
      general: '',
    });

    // Validate all fields
    const emailError = validateEmail(email);
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const dateError = validateDateOfBirth(month, day, year);

    if (emailError || usernameError || passwordError || dateError) {
      setErrors({
        email: emailError,
        username: usernameError,
        password: passwordError,
        dateOfBirth: dateError,
        general: '',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        email: email.trim(),
        username: username.trim(),
        password,
        displayName: displayName.trim() || username.trim(),
        month,
        day,
        year,
      });

      if (response.success) {
        setErrors({
          email: '',
          username: '',
          password: '',
          dateOfBirth: '',
          general: '',
        });
        // Tự động chuyển vào app sau khi đăng ký thành công
        onRegister(response.user, response.token);
      } else {
        setErrors({
          email: '',
          username: '',
          password: '',
          dateOfBirth: '',
          general: response.message || 'Đăng ký thất bại',
        });
      }
    } catch (error) {
      setErrors({
        email: '',
        username: '',
        password: '',
        dateOfBirth: '',
        general: error.message || 'Không thể kết nối đến server. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };

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
          {/* Background Elements */}
          <View style={styles.backgroundElements}>
            <View style={[styles.glowCircle, styles.glowCircle1]} />
            <View style={[styles.glowCircle, styles.glowCircle2]} />
            <View style={[styles.glowCircle, styles.glowCircle3]} />
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow}>
              <MaterialCommunityIcons name="music-note" size={56} color={COLORS.ACCENT_PINK} />
            </View>
            <Text style={styles.logoText}>Nightcord</Text>
            <View style={styles.logoSubtitleContainer}>
              <MaterialCommunityIcons name="star" size={16} color={COLORS.ACCENT_SECONDARY} />
              <Text style={styles.logoSubtitle}>Join the night music community</Text>
              <MaterialCommunityIcons name="star" size={16} color={COLORS.ACCENT_SECONDARY} />
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <LinearGradient
              colors={[COLORS.ACCENT, COLORS.ACCENT_PINK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTextContainer}
            >
              <Text style={styles.title}>Create an account</Text>
            </LinearGradient>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="email-outline" size={16} color={COLORS.ACCENT_SECONDARY} />
                <Text style={styles.label}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'email' && styles.inputWrapperFocused,
                errors.email && styles.inputWrapperError
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors({ ...errors, email: validateEmail(text) });
                    }
                  }}
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
                    // Enter ở email → focus vào displayName hoặc username
                    displayNameInputRef.current?.focus() || usernameInputRef.current?.focus();
                  }}
                  returnKeyType="next"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email ? (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={14} color={COLORS.ERROR} />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </View>
              ) : null}
            </View>

            {/* Display Name */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="account-outline" size={16} color={COLORS.ACCENT_SECONDARY} />
                <Text style={styles.label}>Display Name</Text>
              </View>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'displayName' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  ref={displayNameInputRef}
                  style={styles.input}
                  placeholder="Display Name (optional)"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={displayName}
                  onChangeText={setDisplayName}
                  onFocus={() => setFocusedInput('displayName')}
                  onBlur={() => setFocusedInput(null)}
                  onSubmitEditing={() => {
                    // Enter ở displayName → focus vào username
                    usernameInputRef.current?.focus();
                  }}
                  returnKeyType="next"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Username */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="at" size={16} color={COLORS.ACCENT_SECONDARY} />
                <Text style={styles.label}>
                  Username <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'username' && styles.inputWrapperFocused,
                errors.username && styles.inputWrapperError
              ]}>
                <TextInput
                  ref={usernameInputRef}
                  style={styles.input}
                  placeholder="Choose a username"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) {
                      setErrors({ ...errors, username: validateUsername(text) });
                    }
                  }}
                  onFocus={() => {
                    setFocusedInput('username');
                    if (errors.username) {
                      setErrors({ ...errors, username: '' });
                    }
                  }}
                  onBlur={() => {
                    setFocusedInput(null);
                    setErrors({ ...errors, username: validateUsername(username) });
                  }}
                  onSubmitEditing={() => {
                    // Enter ở username → focus vào password
                    passwordInputRef.current?.focus();
                  }}
                  returnKeyType="next"
                  autoCapitalize="none"
                />
              </View>
              {errors.username ? (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={14} color={COLORS.ERROR} />
                  <Text style={styles.errorText}>{errors.username}</Text>
                </View>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
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
                  placeholder="Create a password"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: validatePassword(text) });
                    }
                  }}
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
                  onSubmitEditing={() => {
                    // Enter ở password → focus vào month (date of birth)
                    monthInputRef.current?.focus();
                  }}
                  returnKeyType="next"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
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
            </View>

            {/* Date of Birth - Simplified */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="calendar-outline" size={16} color={COLORS.ACCENT_SECONDARY} />
                <Text style={styles.label}>
                  Date of Birth <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={[
                styles.dateRow,
                errors.dateOfBirth && styles.dateRowError
              ]}>
                <View style={styles.dateInputWrapper}>
                  <TextInput
                    ref={monthInputRef}
                    style={[
                      styles.dateInput,
                      styles.dateInputMonth,
                      errors.dateOfBirth && styles.dateInputError
                    ]}
                    placeholder="MM"
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    value={month}
                    onChangeText={handleMonthChange}
                    onBlur={() => {
                      setErrors({ ...errors, dateOfBirth: validateDateOfBirth(month, day, year) });
                    }}
                    onSubmitEditing={() => {
                      // Enter ở month → focus vào day
                      dayInputRef.current?.focus();
                    }}
                    returnKeyType="next"
                    maxLength={2}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.dateInputWrapper}>
                  <TextInput
                    ref={dayInputRef}
                    style={[
                      styles.dateInput,
                      styles.dateInputDay,
                      errors.dateOfBirth && styles.dateInputError
                    ]}
                    placeholder="DD"
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    value={day}
                    onChangeText={handleDayChange}
                    onBlur={() => {
                      setErrors({ ...errors, dateOfBirth: validateDateOfBirth(month, day, year) });
                    }}
                    onSubmitEditing={() => {
                      // Enter ở day → focus vào year
                      yearInputRef.current?.focus();
                    }}
                    returnKeyType="next"
                    maxLength={2}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.dateInputWrapper}>
                  <TextInput
                    ref={yearInputRef}
                    style={[
                      styles.dateInput,
                      styles.dateInputYear,
                      errors.dateOfBirth && styles.dateInputError
                    ]}
                    placeholder="YYYY"
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    value={year}
                    onChangeText={handleYearChange}
                    onBlur={() => {
                      setErrors({ ...errors, dateOfBirth: validateDateOfBirth(month, day, year) });
                    }}
                    onSubmitEditing={handleRegister}
                    returnKeyType="done"
                    maxLength={4}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              {errors.dateOfBirth ? (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={14} color={COLORS.ERROR} />
                  <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                </View>
              ) : null}
            </View>

            {/* Email Updates Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, emailUpdates && styles.checkboxChecked]}
                onPress={() => setEmailUpdates(!emailUpdates)}
              >
                {emailUpdates && (
                  <MaterialCommunityIcons name="check" size={14} color={COLORS.WHITE} />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                (Optional) It's okay to send me emails with Nightcord updates, tips, and special offers.
              </Text>
            </View>

            {/* General Error Message */}
            {errors.general ? (
              <View style={styles.generalErrorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={18} color={COLORS.ERROR} />
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            ) : null}

            {/* Legal Disclaimer */}
            <Text style={styles.disclaimer}>
              By clicking "Create Account," you agree to Nightcord's{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and have read the{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={!email.trim() || !username.trim() || !password.trim() || !month || !day || !year || loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  email.trim() && username.trim() && password.trim() && month && day && year && !loading
                    ? [COLORS.ACCENT, COLORS.ACCENT_PINK]
                    : [COLORS.INPUT_BG, COLORS.INPUT_BG]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.registerButton,
                  (!email.trim() || !username.trim() || !password.trim() || !month || !day || !year || loading) &&
                  styles.registerButtonDisabled
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.WHITE} />
                ) : (
                  <>
                    <Text style={styles.registerButtonText}>Create Account</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.WHITE} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <View style={styles.divider} />
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.linkTextBold} onPress={onNavigateToLogin}>
                  Log in
                </Text>
              </Text>
            </View>
          </View>
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
    padding: 24,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    opacity: 0.1,
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
    top: '30%',
    left: '50%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gradientTextContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
  },
  title: {
    color: COLORS.WHITE,
    fontSize: 28,
    fontWeight: 'bold',
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
    alignItems: 'stretch',
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
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  dateInput: {
    flex: 1,
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.INPUT_BORDER,
    padding: 16,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    textAlign: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  dateInputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  dateInputMonth: {
    flex: 1,
  },
  dateInputDay: {
    flex: 1,
  },
  dateInputYear: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.TEXT_MUTED,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BG,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.ACCENT,
    borderColor: COLORS.ACCENT,
  },
  checkboxText: {
    flex: 1,
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    lineHeight: 16,
  },
  disclaimer: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 16,
  },
  linkText: {
    color: COLORS.ACCENT,
    fontSize: 12,
  },
  linkTextBold: {
    color: COLORS.ACCENT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  registerButton: {
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
  registerButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  registerButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.DIVIDER,
    marginBottom: 16,
  },
  loginText: {
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
  dateRowError: {
    // Visual indicator for date error
  },
  dateInputError: {
    borderColor: COLORS.ERROR,
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
