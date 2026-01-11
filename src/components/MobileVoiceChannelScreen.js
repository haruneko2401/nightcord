import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const MessageItem = ({ item, isOwnMessage, index }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 50,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.msgContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Image source={{ uri: item.avatar }} style={styles.msgAvatar} />
      <View style={styles.msgContent}>
        <View style={styles.msgHeader}>
          <Text style={styles.msgUser}>{item.user}</Text>
          <Text style={styles.msgTime}>{item.time}</Text>
        </View>
        <Text style={styles.msgText}>{item.content}</Text>
      </View>
    </Animated.View>
  );
};

export default function MobileVoiceChannelScreen({
  channelName,
  participants = [],
  messages = [],
  onSendMessage,
  onLeave,
  onBack,
  isMuted = false,
  isDeafened = false,
  isCameraOn = false,
  onToggleMute,
  onToggleDeafen,
  onToggleCamera,
  onOpenChat,
  onOpenEffects,
  localVideoRef,
}) {
  const [showAddPeople, setShowAddPeople] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatText, setChatText] = useState('');
  const messagesEndRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(500)).current;
  
  // Lấy participant đầu tiên hoặc current user
  const mainParticipant = participants.find(p => p.isCurrentUser) || participants[0] || {
    name: 'Cô Bé Maid',
    avatar: 'https://i.pravatar.cc/100?img=18',
  };

  // Chat modal animations
  useEffect(() => {
    if (showChat) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(500);
    }
  }, [showChat]);

  useEffect(() => {
    if (showChat) {
      messagesEndRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, showChat]);

  const handleOpenChat = () => {
    setShowChat(true);
    onOpenChat && onOpenChat();
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  const handleSendChat = () => {
    if (chatText.trim() && onSendMessage) {
      onSendMessage(chatText);
      setChatText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.TEXT_BRIGHT} />
        </TouchableOpacity>
        
        <View style={styles.topCenter}>
          <MaterialCommunityIcons name="microphone" size={20} color={COLORS.TEXT_BRIGHT} />
          <Text style={styles.channelTitle}>{channelName}</Text>
        </View>

        <View style={styles.topRight}>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.topActionButton}>
              <MaterialCommunityIcons name="volume-high" size={20} color={COLORS.TEXT_BRIGHT} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topActionButton}>
              <MaterialCommunityIcons name="account-plus" size={20} color={COLORS.TEXT_BRIGHT} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content - Large Pink Rectangle with Avatar */}
      <View style={styles.mainContent}>
        <View style={styles.avatarWrapper}>
          <LinearGradient
            colors={[COLORS.ACCENT_PINK, '#D946EF', COLORS.ACCENT_PINK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarContainer}
          >
            <Image
              source={{ uri: mainParticipant.avatar }}
              style={styles.mainAvatar}
            />
          </LinearGradient>
          
          {/* Microphone-off overlay khi muted */}
          {isMuted && (
            <View style={styles.mutedOverlay}>
              <MaterialCommunityIcons 
                name="microphone-off" 
                size={64} 
                color={COLORS.ERROR} 
              />
            </View>
          )}
        </View>
        
        {/* Participant Name Button */}
        <TouchableOpacity style={styles.participantButton}>
          <MaterialCommunityIcons name="music" size={16} color={COLORS.TEXT_BRIGHT} />
          <Text style={styles.participantName}>{mainParticipant.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Add People Banner */}
      <TouchableOpacity 
        style={styles.addPeopleBanner}
        onPress={() => setShowAddPeople(!showAddPeople)}
      >
        <MaterialCommunityIcons name="account-plus" size={20} color={COLORS.TEXT_BRIGHT} />
        <View style={styles.addPeopleText}>
          <Text style={styles.addPeopleTitle}>Add people to Voice Chat</Text>
          <Text style={styles.addPeopleSubtitle}>Let the group know you are here!</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
      </TouchableOpacity>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.dragHandle} />
        
        <View style={styles.controlsRow}>
          {/* Camera Toggle */}
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              isCameraOn ? styles.controlButtonActive : styles.controlButtonGray
            ]}
            onPress={onToggleCamera}
          >
            <MaterialCommunityIcons 
              name={isCameraOn ? "video" : "video-off"} 
              size={24} 
              color={isCameraOn ? COLORS.SUCCESS : COLORS.WHITE} 
            />
          </TouchableOpacity>

          {/* Microphone Mute */}
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              isMuted ? styles.controlButtonMuted : styles.controlButtonGray
            ]}
            onPress={onToggleMute}
          >
            <MaterialCommunityIcons 
              name={isMuted ? "microphone-off" : "microphone"} 
              size={24} 
              color={isMuted ? COLORS.ERROR : COLORS.WHITE} 
            />
          </TouchableOpacity>
          
          {/* End Call */}
          <TouchableOpacity 
            style={[styles.controlButton, styles.controlButtonEnd]}
            onPress={onLeave}
          >
            <MaterialCommunityIcons name="phone-hangup" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>

          {/* Headphones (Deafen/Undeafen) */}
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              isDeafened ? styles.controlButtonDeafened : styles.controlButtonGray
            ]}
            onPress={onToggleDeafen}
          >
            <MaterialCommunityIcons 
              name={isDeafened ? "headphones-off" : "headphones"} 
              size={24} 
              color={isDeafened ? COLORS.ERROR : COLORS.WHITE} 
            />
          </TouchableOpacity>

          {/* Chat */}
          <TouchableOpacity 
            style={[styles.controlButton, styles.controlButtonGray]}
            onPress={handleOpenChat}
          >
            <MaterialCommunityIcons name="message-text" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>

          
        </View>
      </View>

      {/* Chat Modal */}
      <Modal
        visible={showChat}
        transparent
        animationType="none"
        onRequestClose={handleCloseChat}
      >
        <View style={styles.chatModalOverlay}>
          <TouchableOpacity
            style={styles.chatModalBackdrop}
            activeOpacity={1}
            onPress={handleCloseChat}
          />
          <Animated.View
            style={[
              styles.chatModalContent,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Chat Header */}
            <View style={styles.chatModalHeader}>
              <Text style={styles.chatModalTitle}>Chat</Text>
              <TouchableOpacity onPress={handleCloseChat}>
                <MaterialCommunityIcons name="close" size={24} color={COLORS.TEXT_BRIGHT} />
              </TouchableOpacity>
            </View>

            {/* Messages List */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.chatModalBody}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
              <FlatList
                ref={messagesEndRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => {
                  const isOwnMessage = item.user === 'Bạn' || item.user === 'You';
                  return <MessageItem item={item} isOwnMessage={isOwnMessage} index={index} />;
                }}
                contentContainerStyle={styles.chatMessagesList}
                showsVerticalScrollIndicator={false}
              />

              {/* Input Area */}
              <View style={styles.chatInputContainer}>
                <View style={styles.chatInputWrapper}>
                  <TextInput
                    style={styles.chatInput}
                    placeholder="Type a message..."
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    value={chatText}
                    onChangeText={setChatText}
                    multiline
                    maxLength={2000}
                  />
                  <TouchableOpacity
                    onPress={handleSendChat}
                    disabled={!chatText.trim()}
                    style={[styles.chatSendButton, !chatText.trim() && styles.chatSendButtonDisabled]}
                  >
                    <LinearGradient
                      colors={
                        chatText.trim()
                          ? [COLORS.ACCENT, COLORS.ACCENT_PINK]
                          : [COLORS.INPUT_BG, COLORS.INPUT_BG]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.chatSendButtonGradient}
                    >
                      <MaterialCommunityIcons name="send" size={18} color={COLORS.WHITE} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: COLORS.HEADER,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  topCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  navButton: {
    padding: 4,
  },
  channelTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  topRight: {
    alignItems: 'flex-end',
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  topActionButton: {
    padding: 4,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.ACCENT_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  mainAvatar: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderColor: COLORS.WHITE,
  },
  mutedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonDeafened: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.ERROR,
  },
  participantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BG,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    gap: 8,
  },
  participantName: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 14,
    fontWeight: '500',
  },
  addPeopleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BG,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  addPeopleText: {
    flex: 1,
  },
  addPeopleTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  addPeopleSubtitle: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
  },
  bottomControls: {
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.TEXT_MUTED,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonGray: {
    backgroundColor: COLORS.INPUT_BG,
  },
  controlButtonMuted: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.ERROR,
  },
  controlButtonEnd: {
    backgroundColor: COLORS.ERROR,
  },
  // Chat Modal Styles
  chatModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chatModalContent: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    height: '80%',
  },
  chatModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  chatModalTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatModalBody: {
    flex: 1,
  },
  chatMessagesList: {
    padding: 16,
  },
  msgContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  msgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  msgContent: {
    flex: 1,
  },
  msgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  msgUser: {
    color: COLORS.TEXT_BRIGHT,
    fontWeight: '600',
    fontSize: 15,
  },
  msgTime: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
  },
  msgText: {
    color: COLORS.TEXT_NORMAL,
    fontSize: 15,
    lineHeight: 20,
  },
  chatInputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.INPUT_BG,
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    maxHeight: 100,
  },
  chatSendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  chatSendButtonDisabled: {
    opacity: 0.5,
  },
  chatSendButtonGradient: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

