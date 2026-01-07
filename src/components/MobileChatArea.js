import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

// Typing Indicator Component (same as ChatArea)
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

export default function MobileChatArea({ 
  channelName, 
  messages, 
  onSendMessage,
  typingUsers = [], 
  onBack 
}) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const inputScale = useRef(new Animated.Value(1)).current;
  const sendButtonScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    messagesEndRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    Animated.spring(sendButtonScale, {
      toValue: text.trim() ? 1 : 0,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [text]);

  const handleSend = () => {
    if (text.trim()) {
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

  const handleKeyPress = (e) => {
    // Enter để gửi, Shift+Enter để xuống dòng
    const key = e.nativeEvent?.key || e.key;
    const shiftKey = e.nativeEvent?.shiftKey || e.shiftKey;
    
    if (key === 'Enter' && !shiftKey) {
      e.preventDefault?.();
      handleSend();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header với Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.TEXT_BRIGHT} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="pound" size={20} color={COLORS.ACCENT_SECONDARY} />
          <Text style={styles.headerTitle}>{channelName}</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialCommunityIcons name="magnify" size={20} color={COLORS.TEXT_MUTED} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={messagesEndRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            const isOwnMessage = item.user === 'Bạn' || item.user === 'You';
            return <MessageItem item={item} isOwnMessage={isOwnMessage} index={index} />;
          }}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            typingUsers.length > 0 ? (
              <TypingIndicator typingUsers={typingUsers} />
            ) : null
          }
        />

        {/* Input Area */}
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
              <MaterialCommunityIcons name="plus" size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder={`Message #${channelName}`}
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={text}
              onChangeText={setText}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={handleSend}
              onKeyPress={handleKeyPress}
              multiline
              blurOnSubmit={false}
              maxLength={2000}
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
                <LinearGradient
                  colors={[COLORS.ACCENT, COLORS.ACCENT_PINK]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendButtonGradient}
                >
                  <MaterialCommunityIcons name="send" size={18} color={COLORS.WHITE} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 18,
    fontWeight: '600',
  },
  searchButton: {
    padding: 4,
  },
  keyboardView: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
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
  inputWrapper: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.INPUT_BG,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  inputContainerFocused: {
    borderColor: COLORS.ACCENT,
  },
  plusIcon: {
    padding: 4,
  },
  input: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.TEXT_MUTED,
  },
  typingText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
    fontStyle: 'italic',
  },
});

