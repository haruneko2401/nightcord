import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const MessageItem = ({ item, isOwnMessage, index }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Stagger animation cho messages
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
      {!isOwnMessage && (
        <Animated.Image 
          source={{ uri: item.avatar }} 
          style={[
            styles.avatar,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]} 
        />
      )}
      <View style={[styles.msgContent, isOwnMessage && styles.msgContentOwn]}>
        {!isOwnMessage && (
          <View style={styles.msgHeader}>
            <Text style={styles.username}>{item.user}</Text>
            <View style={styles.timestampContainer}>
              <Text style={styles.timestamp}>{item.time}</Text>
            </View>
          </View>
        )}
        <Animated.View
          style={[
            styles.msgBubble,
            isOwnMessage ? styles.msgBubbleOwn : styles.msgBubbleOther,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {isOwnMessage ? (
            <LinearGradient
              colors={[COLORS.ACCENT, COLORS.ACCENT_PINK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.msgBubbleGradient}
            >
              <Text style={styles.msgTextOwn}>{item.content}</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.msgText}>{item.content}</Text>
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default function ChatArea({ messages, onSendMessage, channelName = 'chung' }) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const inputScale = useRef(new Animated.Value(1)).current;
  const sendButtonScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Send button appear animation
    if (text.trim()) {
      Animated.spring(sendButtonScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(sendButtonScale, {
        toValue: 0,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim()) {
      // Button press animation
      Animated.sequence([
        Animated.timing(inputScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(inputScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.BACKGROUND, COLORS.CHANNEL_LIST]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      {/* Header Kênh với Gradient */}
      <LinearGradient
        colors={[COLORS.HEADER, COLORS.CHANNEL_LIST]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="pound" size={24} color={COLORS.ACCENT_SECONDARY} />
          <Text style={styles.headerTitle}>{channelName}</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.headerDescription}>
            {channelName === 'voice-room' ? 'Voice channel - Join to chat' : 'General chat for everyone'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="bell-outline" size={20} color={COLORS.TEXT_MUTED} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="pin-outline" size={20} color={COLORS.TEXT_MUTED} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="account-group-outline" size={20} color={COLORS.TEXT_MUTED} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Danh sách tin nhắn */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            const isOwnMessage = item.user === 'Bạn';
            return <MessageItem item={item} isOwnMessage={isOwnMessage} index={index} />;
          }}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* Ô nhập tin nhắn với Animation */}
        <Animated.View
          style={[
            styles.inputWrapper,
            {
              transform: [{ scale: inputScale }],
            },
          ]}
        >
          <View style={[
            styles.inputContainer,
            focused && styles.inputContainerFocused
          ]}>
            <TouchableOpacity style={styles.plusIcon}>
              <LinearGradient
                colors={[COLORS.ACCENT_BLUE, COLORS.ACCENT_CYAN]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.plusIconGradient}
              >
                <Ionicons name="add" size={20} color={COLORS.WHITE} />
              </LinearGradient>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder={`Nhắn tin cho #${channelName}`}
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={text}
              onChangeText={setText}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={handleSend}
              multiline
            />
            <Animated.View
              style={{
                transform: [{ scale: sendButtonScale }],
                opacity: sendButtonScale,
              }}
            >
              <TouchableOpacity 
                onPress={handleSend}
                disabled={!text.trim()}
                style={styles.sendButton}
              >
                {text.trim() ? (
                  <LinearGradient
                    colors={[COLORS.ACCENT, COLORS.ACCENT_PINK]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sendButtonGradient}
                  >
                    <Ionicons name="send" size={20} color={COLORS.WHITE} />
                  </LinearGradient>
                ) : (
                  <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color={COLORS.TEXT_MUTED} />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
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
  header: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.DIVIDER,
  },
  headerDescription: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 6,
    borderRadius: 4,
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
    marginBottom: 20,
  },
  msgContainerOwn: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.INPUT_BG,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.ACCENT_SECONDARY,
  },
  msgContent: {
    flex: 1,
    maxWidth: '75%',
  },
  msgContentOwn: {
    alignItems: 'flex-end',
  },
  msgHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    gap: 8,
  },
  username: {
    color: COLORS.TEXT_BRIGHT,
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestampContainer: {
    backgroundColor: COLORS.INPUT_BG,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timestamp: {
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
  },
  msgBubble: {
    borderRadius: 12,
    padding: 12,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  msgBubbleOther: {
    backgroundColor: COLORS.INPUT_BG,
    borderTopLeftRadius: 4,
  },
  msgBubbleOwn: {
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  msgBubbleGradient: {
    padding: 12,
  },
  msgText: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    lineHeight: 20,
  },
  msgTextOwn: {
    color: COLORS.WHITE,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  inputWrapper: {
    padding: 12,
    backgroundColor: COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  inputContainer: {
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: COLORS.INPUT_BORDER,
    minHeight: 44,
  },
  inputContainerFocused: {
    borderColor: COLORS.INPUT_FOCUS,
    shadowColor: COLORS.INPUT_FOCUS,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  plusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    overflow: 'hidden',
  },
  plusIconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    paddingVertical: 4,
    maxHeight: 100,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
