import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

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

  const handleRegister = () => {
    if (email.trim() && username.trim() && password.trim() && month && day && year) {
      onRegister();
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
                focusedInput === 'email' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
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
                  style={styles.input}
                  placeholder="Display Name (optional)"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={displayName}
                  onChangeText={setDisplayName}
                  onFocus={() => setFocusedInput('displayName')}
                  onBlur={() => setFocusedInput(null)}
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
                focusedInput === 'username' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Choose a username"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={username}
                  onChangeText={setUsername}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                />
              </View>
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
                focusedInput === 'password' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create a password"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
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
            </View>

            {/* Date of Birth - Simplified */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons name="calendar-outline" size={16} color={COLORS.ACCENT_SECONDARY} />
                <Text style={styles.label}>
                  Date of Birth <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={styles.dateRow}>
                <View style={styles.dateInputWrapper}>
                  <TextInput
                    style={[styles.dateInput, styles.dateInputMonth]}
                    placeholder="MM"
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    value={month}
                    onChangeText={setMonth}
                    maxLength={2}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.dateInputWrapper}>
                  <TextInput
                    style={[styles.dateInput, styles.dateInputDay]}
                    placeholder="DD"
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    value={day}
                    onChangeText={setDay}
                    maxLength={2}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.dateInputWrapper}>
                  <TextInput
                    style={[styles.dateInput, styles.dateInputYear]}
                    placeholder="YYYY"
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    value={year}
                    onChangeText={setYear}
                    maxLength={4}
                    keyboardType="numeric"
                  />
                </View>
              </View>
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

            {/* Legal Disclaimer */}
            <Text style={styles.disclaimer}>
              By clicking "Create Account," you agree to Nightcord's{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and have read the{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={!email.trim() || !username.trim() || !password.trim() || !month || !day || !year}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  email.trim() && username.trim() && password.trim() && month && day && year
                    ? [COLORS.ACCENT, COLORS.ACCENT_PINK]
                    : [COLORS.INPUT_BG, COLORS.INPUT_BG]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.registerButton,
                  (!email.trim() || !username.trim() || !password.trim() || !month || !day || !year) &&
                  styles.registerButtonDisabled
                ]}
              >
                <Text style={styles.registerButtonText}>Create Account</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.WHITE} />
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
});
