import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { CHANNELS } from '../data/mock';

const ChannelItem = ({ item, isActive, onPress }) => (
  <TouchableOpacity 
    style={[styles.channelItem, isActive && styles.channelItemActive]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <MaterialCommunityIcons 
      name={item.type === 'voice' ? 'volume-high' : 'pound'} 
      size={18} 
      color={isActive ? COLORS.ACCENT_SECONDARY : COLORS.TEXT_MUTED} 
    />
    <Text style={[styles.channelName, isActive && styles.channelNameActive]}>
      {item.name}
    </Text>
    {item.type === 'voice' && (
      <View style={styles.voiceIndicator}>
        <MaterialCommunityIcons name="microphone" size={12} color={COLORS.SUCCESS} />
      </View>
    )}
  </TouchableOpacity>
);

export default function MobileChannelList({ serverName, activeChannel, onSelectChannel, onBack }) {
  const textChannels = CHANNELS.filter(c => c.type === 'text');
  const voiceChannels = CHANNELS.filter(c => c.type === 'voice');

  return (
    <View style={styles.container}>
      {/* Header với Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.TEXT_BRIGHT} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="server" size={20} color={COLORS.ACCENT_SECONDARY} />
          <Text style={styles.serverName}>{serverName}</Text>
        </View>
      </View>

      {/* Channels List */}
      <ScrollView style={styles.channelsList} showsVerticalScrollIndicator={false}>
        {/* TEXT CHANNELS Category */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <MaterialCommunityIcons name="chevron-right" size={14} color={COLORS.TEXT_MUTED} />
            <Text style={styles.categoryText}>TEXT CHANNELS</Text>
          </View>
          {textChannels.map(item => (
            <ChannelItem
              key={item.id}
              item={item}
              isActive={activeChannel === item.id}
              onPress={() => onSelectChannel && onSelectChannel(item.id)}
            />
          ))}
        </View>

        {/* VOICE CHANNELS Category */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <MaterialCommunityIcons name="chevron-right" size={14} color={COLORS.TEXT_MUTED} />
            <Text style={styles.categoryText}>VOICE CHANNELS</Text>
          </View>
          {voiceChannels.map(item => (
            <ChannelItem
              key={item.id}
              item={item}
              isActive={activeChannel === item.id}
              onPress={() => onSelectChannel && onSelectChannel(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.CHANNEL_LIST,
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
  serverName: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  channelsList: {
    flex: 1,
  },
  categoryContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  categoryText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 2,
    gap: 8,
  },
  channelItemActive: {
    backgroundColor: COLORS.INPUT_BG,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.ACCENT,
  },
  channelName: {
    color: COLORS.TEXT_MUTED,
    fontWeight: '500',
    fontSize: 15,
    flex: 1,
  },
  channelNameActive: {
    color: COLORS.TEXT_BRIGHT,
  },
  voiceIndicator: {
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 8,
    padding: 2,
    opacity: 0.8,
  },
});

