import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function ServerNameModal({ visible, onClose, onBack, onComplete, serverType }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [serverName, setServerName] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      setServerName('');
    }
  }, [visible]);

  const handleCreate = () => {
    if (serverName.trim()) {
      onComplete && onComplete(serverName.trim());
    }
  };

  const getTitle = () => {
    if (serverType === 'community') return 'Customize Your Community';
    if (serverType === 'friends') return 'Customize Your Server';
    return 'Customize Your Server';
  };

  const getDescription = () => {
    if (serverType === 'community') {
      return 'Give your new community a personality with a name and an icon. You can always change it later.';
    }
    return 'Give your new server a personality with a name and an icon. You can always change it later.';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{getTitle()}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.TEXT_BRIGHT} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{getDescription()}</Text>

          {/* Server Name Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>SERVER NAME</Text>
            <View style={[
              styles.inputContainer,
              focused && styles.inputContainerFocused
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter server name"
                placeholderTextColor={COLORS.TEXT_MUTED}
                value={serverName}
                onChangeText={setServerName}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                maxLength={100}
                autoFocus
              />
            </View>
          </View>

          {/* Server Icon Placeholder */}
          <View style={styles.iconSection}>
            <View style={styles.iconPlaceholder}>
              <MaterialCommunityIcons name="server" size={48} color={COLORS.TEXT_MUTED} />
            </View>
            <Text style={styles.iconHint}>Server Icon (Optional)</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, !serverName.trim() && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={!serverName.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  serverName.trim()
                    ? [COLORS.ACCENT, COLORS.ACCENT_PINK]
                    : [COLORS.INPUT_BG, COLORS.INPUT_BG]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createButtonGradient}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 440,
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 8,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    color: COLORS.TEXT_NORMAL,
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.INPUT_BORDER,
    padding: 12,
  },
  inputContainerFocused: {
    borderColor: COLORS.ACCENT,
  },
  input: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconHint: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: COLORS.ACCENT,
    fontSize: 14,
    fontWeight: '500',
  },
  createButton: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
});

