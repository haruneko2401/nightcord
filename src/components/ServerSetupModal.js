import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function ServerSetupModal({ visible, onClose, onBack, onComplete }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

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
    }
  }, [visible]);

  const handleOptionSelect = (option) => {
    // option: 'community' or 'friends'
    onComplete && onComplete(option);
  };

  const handleSkip = () => {
    onComplete && onComplete('skip');
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
            <Text style={styles.title}>Tell Us More About Your Server</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.TEXT_BRIGHT} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            In order to help you with your setup, is your new server for just a few friends or a larger community?
          </Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionSelect('community')}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#57F287' }]}>
                <MaterialCommunityIcons name="earth" size={24} color={COLORS.WHITE} />
              </View>
              <Text style={styles.optionText}>For a club or community</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionSelect('friends')}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#EB459E' }]}>
                <MaterialCommunityIcons name="sofa" size={24} color={COLORS.WHITE} />
              </View>
              <Text style={styles.optionText}>For me and my friends</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>
          </View>

          {/* Skip Link */}
          <View style={styles.skipContainer}>
            <Text style={styles.skipText}>Not sure? You can </Text>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipLink}>skip this question for now.</Text>
            </TouchableOpacity>
          </View>

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
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
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    fontWeight: '500',
  },
  skipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  skipText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
  },
  skipLink: {
    color: COLORS.ACCENT,
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  backButtonText: {
    color: COLORS.ACCENT,
    fontSize: 14,
    fontWeight: '500',
  },
});

