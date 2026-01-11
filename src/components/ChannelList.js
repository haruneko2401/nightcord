import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

export default function ChannelList({ serverName, activeChannel, onSelectChannel, channels = [] }) {

  return (
    <LinearGradient
      colors={[COLORS.CHANNEL_LIST, COLORS.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      {/* Header với Gradient */}
      <LinearGradient
        colors={[COLORS.CHANNEL_LIST, COLORS.HEADER]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="server" size={20} color={COLORS.ACCENT_SECONDARY} />
          <Text style={styles.serverName}>{serverName}</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialCommunityIcons name="chevron-down" size={20} color={COLORS.TEXT_MUTED} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Category: TEXT CHANNELS */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <MaterialCommunityIcons name="chevron-right" size={14} color={COLORS.TEXT_MUTED} />
          <Text style={styles.categoryText}>TEXT CHANNELS</Text>
        </View>
        <FlatList
          data={channels.filter(c => c.type === 'text').length > 0 ? channels.filter(c => c.type === 'text') : CHANNELS.filter(c => c.type === 'text')}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ChannelItem 
              item={item} 
              isActive={activeChannel === item.id}
              onPress={() => onSelectChannel && onSelectChannel(item.id)}
            />
          )}
          scrollEnabled={false}
        />
      </View>

      {/* Category: VOICE CHANNELS */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <MaterialCommunityIcons name="chevron-right" size={14} color={COLORS.TEXT_MUTED} />
          <Text style={styles.categoryText}>VOICE CHANNELS</Text>
        </View>
        <FlatList
          data={channels.filter(c => c.type === 'voice').length > 0 ? channels.filter(c => c.type === 'voice') : CHANNELS.filter(c => c.type === 'voice')}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ChannelItem 
              item={item} 
              isActive={activeChannel === item.id}
              onPress={() => onSelectChannel && onSelectChannel(item.id)}
            />
          )}
          scrollEnabled={false}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    borderRightWidth: 1,
    borderRightColor: COLORS.BORDER,
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
    gap: 8,
  },
  serverName: {
    color: COLORS.TEXT_BRIGHT,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  headerButton: {
    padding: 4,
  },
  categoryContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
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
    padding: 8,
    paddingHorizontal: 12,
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
