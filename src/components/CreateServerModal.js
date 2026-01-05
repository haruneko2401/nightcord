import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const TemplateOption = ({ icon, title, iconColor, onPress }) => (
  <TouchableOpacity style={styles.templateOption} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.templateIcon, { backgroundColor: iconColor }]}>
      <MaterialCommunityIcons name={icon} size={24} color={COLORS.WHITE} />
    </View>
    <Text style={styles.templateText}>{title}</Text>
    <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
  </TouchableOpacity>
);

export default function CreateServerModal({ visible, onClose, onNext }) {
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

  const handleCreateMyOwn = () => {
    onNext && onNext();
  };

  const handleJoinServer = () => {
    // TODO: Implement join server
    onClose && onClose();
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
            <Text style={styles.title}>Create Your Server</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.TEXT_BRIGHT} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Your server is where you and your friends hang out. Make yours and start talking.
          </Text>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Create My Own */}
            <TouchableOpacity
              style={styles.createOwnButton}
              onPress={handleCreateMyOwn}
              activeOpacity={0.7}
            >
              <View style={styles.createOwnIcon}>
                <MaterialCommunityIcons name="pencil" size={20} color={COLORS.SUCCESS} />
              </View>
              <Text style={styles.createOwnText}>Create My Own</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>

            {/* Templates Section */}
            <View style={styles.templatesSection}>
              <Text style={styles.sectionTitle}>START FROM A TEMPLATE</Text>
              
              <TemplateOption
                icon="controller-classic"
                title="Gaming"
                iconColor="#5865F2"
                onPress={handleCreateMyOwn}
              />
              
              <TemplateOption
                icon="heart"
                title="Friends"
                iconColor="#EB459E"
                onPress={handleCreateMyOwn}
              />
              
              <TemplateOption
                icon="school"
                title="Study Group"
                iconColor="#FEE75C"
                onPress={handleCreateMyOwn}
              />
              
              <TemplateOption
                icon="school-outline"
                title="School Club"
                iconColor="#57F287"
                onPress={handleCreateMyOwn}
              />
            </View>

            {/* Join Server Section */}
            <View style={styles.joinSection}>
              <Text style={styles.sectionTitle}>Have an invite already?</Text>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={handleJoinServer}
                activeOpacity={0.7}
              >
                <Text style={styles.joinButtonText}>Join a Server</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    maxHeight: '80%',
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  description: {
    color: COLORS.TEXT_NORMAL,
    fontSize: 16,
    padding: 20,
    paddingBottom: 16,
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  createOwnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  createOwnIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createOwnText: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    fontWeight: '500',
  },
  templatesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  templateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateText: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    fontWeight: '500',
  },
  joinSection: {
    marginTop: 8,
  },
  joinButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    fontWeight: '500',
  },
});

