import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import MembersSidebar from './MembersSidebar';

// Typing Indicator Component
const TypingIndicator = ({ typingUsers }) => {
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.4)).current;
  const dot3Anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dot1Anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot1Anim, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot1Anim, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animateDots());
    };

    animateDots();
  }, []);

  return (
    <View style={styles.typingIndicator}>
      <View style={styles.typingDots}>
        <Animated.View style={[styles.typingDot, { opacity: dot1Anim }]} />
        <Animated.View style={[styles.typingDot, { opacity: dot2Anim }]} />
        <Animated.View style={[styles.typingDot, { opacity: dot3Anim }]} />
      </View>
      <Text style={styles.typingText}>
        {typingUsers.length === 1
          ? `${typingUsers[0]} đang soạn...`
          : `${typingUsers.length} người đang soạn...`}
      </Text>
    </View>
  );
};

const MessageItem = ({ item, isOwnMessage, index }) => {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Basic fade in / slide up
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        delay: index * 30,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        delay: index * 30,
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
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
      />
      <View style={styles.msgContent}>
        <View style={styles.msgHeader}>
          <Text style={styles.username}>{item.user || item.username || 'User'}</Text>
          <Text style={styles.timestamp}>{item.time}</Text>
        </View>
        <Text style={styles.msgText}>{item.content}</Text>
      </View>
    </Animated.View>
  );
};

export default function ChatArea({ messages, onSendMessage, channelName = 'chung', typingUsers = [], onBack, isDM = false, dmUser }) {
  const [text, setText] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyPress = (e) => {
    const key = e.nativeEvent?.key || e.key;
    const shiftKey = e.nativeEvent?.shiftKey || e.shiftKey;

    if (key === 'Enter' && !shiftKey) {
      e.preventDefault?.();
      handleSend();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginRight: 8, padding: 4 }}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.TEXT_BRIGHT} />
          </TouchableOpacity>
        )}

        {isDM ? (
          // DM Header
          <View style={styles.headerContent}>
            <View style={styles.dmAvatarContainer}>
              <Image source={{ uri: dmUser?.avatar || 'https://i.pravatar.cc/100' }} style={styles.headerAvatar} />
              <View style={styles.dmStatusIndicator} />
            </View>
            <Text style={styles.headerTitle}>{dmUser?.name || channelName}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
          </View>
        ) : (
          // Channel Header
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="pound" size={24} color={COLORS.TEXT_MUTED} />
            <Text style={styles.headerTitle}>{channelName}</Text>
            {channelName === 'voice-room' && (
              <Text style={styles.headerDescription}> | Voice channel</Text>
            )}
          </View>
        )}

        <View style={styles.headerActions}>
          {isDM ? (
            // DM Actions: Call, Video, Search
            <>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons name="phone" size={24} color={COLORS.TEXT_BRIGHT} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons name="video" size={24} color={COLORS.TEXT_BRIGHT} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons name="magnify" size={24} color={COLORS.TEXT_BRIGHT} />
              </TouchableOpacity>
            </>
          ) : (
            // Channel Actions
            <>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons name="bell" size={24} color={COLORS.TEXT_MUTED} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons name="pin" size={24} color={COLORS.TEXT_MUTED} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerButton, showMembers && styles.headerButtonActive]}
                onPress={() => setShowMembers(!showMembers)}
              >
                <MaterialCommunityIcons name="account-group" size={24} color={showMembers ? COLORS.TEXT_BRIGHT : COLORS.TEXT_MUTED} />
              </TouchableOpacity>
              <View style={styles.searchBox}>
                <TextInput
                  placeholder="Search"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  style={styles.searchInput}
                />
                <MaterialCommunityIcons name="magnify" size={18} color={COLORS.TEXT_MUTED} style={{ marginRight: 6 }} />
              </View>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons name="inbox" size={24} color={COLORS.TEXT_MUTED} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons name="help-circle" size={24} color={COLORS.TEXT_MUTED} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.mainChat}>
          {/* Messages */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) => {
                const isOwnMessage = item.isOwnMessage || item.user === 'Bạn';
                return <MessageItem item={item} isOwnMessage={isOwnMessage} index={index} />;
              }}
              contentContainerStyle={styles.listContent}
              style={styles.list}
              showsVerticalScrollIndicator={true}
              ListFooterComponent={
                typingUsers.length > 0 ? (
                  <TypingIndicator typingUsers={typingUsers} />
                ) : null
              }
            />

            {/* Chat Input Bar */}
            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, focused && styles.inputContainerFocused]}>
                {/* Left Icon (Plus) */}
                <TouchableOpacity style={styles.leftActionButton}>
                  <View style={styles.plusIconCircle}>
                    <MaterialCommunityIcons name="plus" size={20} color={COLORS.TEXT_BRIGHT} />
                  </View>
                </TouchableOpacity>

                {/* Text Input */}
                <TextInput
                  style={styles.input}
                  placeholder={isDM ? `Message @${dmUser?.name || 'User'}` : `Message #${channelName}`}
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  value={text}
                  onChangeText={setText}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onSubmitEditing={handleSend}
                  onKeyPress={handleKeyPress}
                  multiline={false}
                  returnKeyType="send"
                />

                {/* Right Icons */}
                <View style={styles.rightActions}>
                  {isDM ? (
                    // DM Mobile Icons: Gift, Mic (and Smiley usually inside input or next to it)
                    <>
                      <TouchableOpacity style={styles.rightActionButton}>
                        <MaterialCommunityIcons name="gift" size={24} color={COLORS.TEXT_MUTED} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rightActionButton}>
                        <MaterialCommunityIcons name="microphone" size={24} color={COLORS.TEXT_MUTED} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    // Desktop/Standard Channel Icons
                    <>
                      <TouchableOpacity style={styles.rightActionButton}>
                        <MaterialCommunityIcons name="gift" size={24} color={COLORS.TEXT_MUTED} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rightActionButton}>
                        <MaterialCommunityIcons name="file-gif-box" size={24} color={COLORS.TEXT_MUTED} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rightActionButton}>
                        <MaterialCommunityIcons name="sticker-emoji" size={24} color={COLORS.TEXT_MUTED} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rightActionButton}>
                        <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color={COLORS.TEXT_MUTED} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>

        {/* Members Sidebar */}
        {showMembers && <MembersSidebar members={[]} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  mainChat: {
    flex: 1,
    flexDirection: 'column',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2023', // Darker border
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.BACKGROUND,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1, // Allow text to take up space
  },
  dmAvatarContainer: {
    position: 'relative',
  },
  headerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  dmStatusIndicator: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.TEXT_MUTED, // Default/Offline, change dynamically if needed
    borderWidth: 2,
    borderColor: COLORS.BACKGROUND,
  },
  headerTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontWeight: '700',
    fontSize: 16,
  },
  headerDescription: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonActive: {
    // Optionally style active state
    opacity: 1,
  },
  searchBox: {
    backgroundColor: '#1E1F22',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    height: 24,
    width: 140,
    paddingHorizontal: 6,
  },
  searchInput: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 12,
    padding: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  msgContainer: {
    flexDirection: 'row',
    marginBottom: 16, // Spacing between messages
    paddingHorizontal: 0,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.INPUT_BG,
    marginRight: 16,
    marginTop: 2,
  },
  msgContent: {
    flex: 1,
  },
  msgHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
    gap: 8,
  },
  username: {
    color: COLORS.TEXT_BRIGHT,
    fontWeight: '500',
    fontSize: 16,
  },
  timestamp: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    fontWeight: '400',
  },
  msgText: {
    color: '#dbdee1', // Slightly softer white
    fontSize: 15,
    lineHeight: 22,
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 0,
    backgroundColor: COLORS.BACKGROUND,
  },
  inputContainer: {
    backgroundColor: '#383A40', // Typical Discord input bg
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0, // Compact
    height: 44,
  },
  inputContainerFocused: {
    // Optional focus styles
  },
  leftActionButton: {
    marginRight: 12,
  },
  plusIconCircle: {
    backgroundColor: '#B5BAC1',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    height: '100%',
    // paddingVertical: 10,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightActionButton: {
    padding: 4,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.TEXT_BRIGHT,
  },
  typingText: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
