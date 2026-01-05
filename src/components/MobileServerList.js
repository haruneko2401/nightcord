import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const ServerItem = ({ item, isActive, onPress, index }) => {
  return (
    <TouchableOpacity
      style={[styles.serverItem, isActive && styles.serverItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {item.icon ? (
        <View style={styles.serverIconContainer}>
          <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.TEXT_BRIGHT} />
        </View>
      ) : (
        <View style={styles.serverIconContainer}>
          <Text style={styles.serverIconText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <Text style={styles.serverName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default function MobileServerList({ servers, activeServer, onSelectServer, onHomeClick }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Servers</Text>
      </View>

      {/* Home Button */}
      <TouchableOpacity
        style={[styles.serverItem, activeServer === 'home' && styles.serverItemActive]}
        onPress={onHomeClick}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[COLORS.ACCENT_BLUE, COLORS.ACCENT_CYAN]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.serverIconContainer}
        >
          <MaterialCommunityIcons name="home" size={24} color={COLORS.WHITE} />
        </LinearGradient>
        <Text style={styles.serverName}>Home</Text>
      </TouchableOpacity>

      {/* Servers List */}
      <FlatList
        data={servers}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <ServerItem
            item={item}
            isActive={activeServer === item.id}
            onPress={() => onSelectServer(item.id)}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Server Button */}
      <TouchableOpacity style={styles.addServerButton} activeOpacity={0.7}>
        <View style={styles.addServerIcon}>
          <MaterialCommunityIcons name="plus" size={24} color={COLORS.SUCCESS} />
        </View>
        <Text style={styles.addServerText}>Add Server</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SIDEBAR,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 8,
  },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  serverItemActive: {
    backgroundColor: COLORS.INPUT_BG,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.ACCENT,
  },
  serverIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.INPUT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serverIconText: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  serverName: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    fontWeight: '500',
  },
  addServerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 8,
    borderRadius: 8,
    backgroundColor: COLORS.INPUT_BG,
    gap: 12,
  },
  addServerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addServerText: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    fontWeight: '500',
  },
});

