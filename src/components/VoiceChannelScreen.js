import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

// Participant Item Component
const ParticipantItem = ({ participant, isCurrentUser, index }) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.participantItem,
        isCurrentUser && styles.participantItemCurrent,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.participantAvatarContainer}>
        <Image
          source={{ uri: participant.avatar }}
          style={styles.participantAvatar}
        />
        {participant.isSpeaking && (
          <View style={styles.speakingIndicator}>
            <MaterialCommunityIcons name="microphone" size={12} color={COLORS.SUCCESS} />
          </View>
        )}
      </View>
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>
          {participant.name}
          {isCurrentUser && ' (You)'}
        </Text>
        {participant.isMuted && (
          <Text style={styles.participantStatus}>Muted</Text>
        )}
        {participant.isDeafened && (
          <Text style={styles.participantStatus}>Deafened</Text>
        )}
      </View>
      <View style={styles.participantActions}>
        {participant.isMuted && (
          <MaterialCommunityIcons name="microphone-off" size={18} color={COLORS.ERROR} />
        )}
        {participant.isDeafened && (
          <MaterialCommunityIcons name="volume-off" size={18} color={COLORS.ERROR} />
        )}
      </View>
    </Animated.View>
  );
};

// Message Item Component (giống ChatArea)
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
        isOwnMessage && styles.msgContainerOwn,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: isOwnMessage ? slideAnim : slideAnim },
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

export default function VoiceChannelScreen({
  channelName,
  participants = [],
  messages = [],
  onSendMessage,
  onLeave,
  isMuted = false,
  isDeafened = false,
  onToggleMute,
  onToggleDeafen,
  onToggleCamera,
  onOpenChat,
  onOpenEffects,
}) {
  const [text, setText] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatText, setChatText] = useState('');
  const messagesEndRef = useRef(null);
  const chatMessagesEndRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    // Scroll to bottom when new message arrives
    messagesEndRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (showChat) {
      chatMessagesEndRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, showChat]);

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

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage && onSendMessage(text);
      setText('');
    }
  };

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

  const currentUser = participants.find(p => p.isCurrentUser) || {
    name: 'You',
    avatar: 'https://i.pravatar.cc/100?img=50',
    isCurrentUser: true,
  };

  return (
    <LinearGradient
      colors={[COLORS.BACKGROUND, COLORS.CHANNEL_LIST]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      {/* Header */}
      <LinearGradient
        colors={[COLORS.HEADER, COLORS.CHANNEL_LIST]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="volume-high" size={24} color={COLORS.ACCENT_SECONDARY} />
          <Text style={styles.headerTitle}>{channelName}</Text>
          <View style={styles.headerDivider} />
          <View style={styles.connectionStatus}>
            <View style={[styles.statusDot, isConnected && styles.statusDotConnected]} />
            <Text style={styles.statusText}>
              {isConnected ? `${participants.length} connected` : 'Connecting...'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={onLeave}>
          <MaterialCommunityIcons name="phone-hangup" size={20} color={COLORS.ERROR} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        {/* Participants List - Left Side */}
        <View style={styles.participantsSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-group" size={18} color={COLORS.ACCENT_SECONDARY} />
            <Text style={styles.sectionTitle}>Participants ({participants.length})</Text>
          </View>
          <ScrollView style={styles.participantsList} showsVerticalScrollIndicator={false}>
            {participants.map((participant, index) => (
              <ParticipantItem
                key={participant.id}
                participant={participant}
                isCurrentUser={participant.isCurrentUser}
                index={index}
              />
            ))}
          </ScrollView>
        </View>

        {/* Chat Area - Right Side */}
        <View style={styles.chatSection}>
          <View style={styles.chatHeader}>
            <MaterialCommunityIcons name="message-text" size={18} color={COLORS.ACCENT_SECONDARY} />
            <Text style={styles.sectionTitle}>Chat</Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatContainer}
            keyboardVerticalOffset={0}
          >
            {/* Messages List */}
            <FlatList
              ref={messagesEndRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <MessageItem
                  item={item}
                  isOwnMessage={item.user === 'Bạn' || item.user === 'You'}
                  index={index}
                />
              )}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
            />

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={text}
                  onChangeText={setText}
                  multiline
                  maxLength={2000}
                />
                <TouchableOpacity
                  onPress={handleSend}
                  disabled={!text.trim()}
                  style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
                >
                  <LinearGradient
                    colors={
                      text.trim()
                        ? [COLORS.ACCENT, COLORS.ACCENT_PINK]
                        : [COLORS.INPUT_BG, COLORS.INPUT_BG]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sendButtonGradient}
                  >
                    <MaterialCommunityIcons name="send" size={18} color={COLORS.WHITE} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>

      {/* Voice Controls - Bottom Bar */}
      <LinearGradient
        colors={[COLORS.INPUT_BG, COLORS.BACKGROUND]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.controlsBar}
      >
        <View style={styles.controlsContent}>
          <View style={styles.userInfo}>
            <Image source={{ uri: currentUser.avatar }} style={styles.userAvatar} />
            <View>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userStatus}>
                {isMuted ? 'Muted' : isDeafened ? 'Deafened' : 'Connected'}
              </Text>
            </View>
          </View>

          <View style={styles.controlsButtons}>
            {/* Camera Mute */}
            <TouchableOpacity
              style={[styles.controlButton, styles.controlButtonGray]}
              onPress={onToggleCamera || (() => {})}
            >
              <MaterialCommunityIcons name="video-off" size={24} color={COLORS.WHITE} />
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
                name={isMuted ? 'microphone-off' : 'microphone'}
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
                name={isDeafened ? 'headphones-off' : 'headphones'}
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
      </LinearGradient>

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
                ref={chatMessagesEndRef}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.DIVIDER,
    marginHorizontal: 8,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ERROR,
  },
  statusDotConnected: {
    backgroundColor: COLORS.SUCCESS,
  },
  statusText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  participantsSection: {
    width: 280,
    borderRightWidth: 1,
    borderRightColor: COLORS.BORDER,
    backgroundColor: COLORS.SIDEBAR,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  sectionTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 14,
    fontWeight: '600',
  },
  participantsList: {
    flex: 1,
    padding: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  participantItemCurrent: {
    backgroundColor: COLORS.INPUT_BG,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.ACCENT,
  },
  participantAvatarContainer: {
    position: 'relative',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  speakingIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 10,
    padding: 2,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 14,
    fontWeight: '500',
  },
  participantStatus: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  participantActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatSection: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  msgContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  msgContainerOwn: {
    flexDirection: 'row-reverse',
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
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.INPUT_BG,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  controlsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
  },
  userName: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 14,
    fontWeight: '600',
  },
  userStatus: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
  },
  controlsButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.INPUT_BG,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  controlButtonGray: {
    backgroundColor: COLORS.INPUT_BG,
    borderColor: COLORS.BORDER,
  },
  controlButtonMuted: {
    backgroundColor: COLORS.ERROR,
    borderColor: COLORS.ERROR,
  },
  controlButtonDeafened: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.ERROR,
  },
  controlButtonEnd: {
    backgroundColor: COLORS.ERROR,
    borderColor: COLORS.ERROR,
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
    width: '100%',
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

