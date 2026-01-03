import React, { useState } from 'react';
import { 
  View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const MessageItem = ({ item }) => (
  <View style={styles.msgContainer}>
    <Image source={{ uri: item.avatar }} style={styles.avatar} />
    <View style={styles.msgContent}>
      <View style={styles.msgHeader}>
        <Text style={styles.username}>{item.user}</Text>
        <Text style={styles.timestamp}>{item.time}</Text>
      </View>
      <Text style={styles.msgText}>{item.content}</Text>
    </View>
  </View>
);

export default function ChatArea({ messages, onSendMessage }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Kênh */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="pound" size={24} color={COLORS.TEXT_MUTED} />
        <Text style={styles.headerTitle}>chung</Text>
      </View>

      {/* Danh sách tin nhắn */}
      <KeyboardAvoidingView 
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         style={{ flex: 1 }}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageItem item={item} />}
          contentContainerStyle={{ paddingVertical: 20 }}
          style={styles.list}
        />

        {/* Ô nhập tin nhắn */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <View style={styles.plusIcon}>
              <Ionicons name="add" size={20} color={COLORS.WHITE} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nhắn tin cho #chung"
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={text}
              onChangeText={setText}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity onPress={handleSend}>
              <Ionicons name="send" size={20} color={COLORS.ACCENT} />
            </TouchableOpacity>
          </View>
        </View>
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
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#26272D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.HEADER,
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  list: { flex: 1 },
  msgContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#555' },
  msgContent: { marginLeft: 12, flex: 1 },
  msgHeader: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  username: { color: COLORS.WHITE, fontWeight: 'bold', marginRight: 8 },
  timestamp: { color: COLORS.TEXT_MUTED, fontSize: 12 },
  msgText: { color: COLORS.TEXT_NORMAL, fontSize: 15, lineHeight: 20 },
  inputWrapper: { padding: 10, backgroundColor: COLORS.BACKGROUND },
  inputContainer: {
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  plusIcon: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.TEXT_MUTED,
    justifyContent: 'center', alignItems: 'center', marginRight: 10
  },
  input: { flex: 1, color: COLORS.WHITE, fontSize: 15, paddingVertical: 5 },
});

