import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { CHANNELS } from '../data/mock';

const ChannelItem = ({ item }) => (
  <TouchableOpacity style={styles.channelItem}>
    <MaterialCommunityIcons 
      name={item.type === 'voice' ? 'volume-high' : 'pound'} 
      size={20} 
      color={COLORS.TEXT_MUTED} 
    />
    <Text style={styles.channelName}>{item.name}</Text>
  </TouchableOpacity>
);

export default function ChannelList({ serverName }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.serverName}>{serverName}</Text>
      </View>
      <FlatList
        data={CHANNELS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChannelItem item={item} />}
        contentContainerStyle={{ padding: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240, // Độ rộng của thanh kênh
    backgroundColor: COLORS.CHANNEL_LIST,
    // Ẩn trên mobile nhỏ (hoặc dùng Drawer sau này), hiện tại mình hardcode để test logic
    // Để hiển thị trên tablet/PC hoặc test: uncomment component trong App.js
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SIDEBAR,
    height: 50,
    justifyContent: 'center',
  },
  serverName: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
    marginBottom: 2,
  },
  channelName: {
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  }
});

