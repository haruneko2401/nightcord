import React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { SERVERS } from '../data/mock';

const ServerItem = ({ item, isActive, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
    {isActive && <View style={styles.activePill} />}
    <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
      <MaterialCommunityIcons 
        name={item.icon} 
        size={28} 
        color={isActive ? COLORS.WHITE : COLORS.TEXT_MUTED} 
      />
    </View>
  </TouchableOpacity>
);

export default function ServerSidebar({ activeServer, onSelect }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={SERVERS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ServerItem 
            item={item} 
            isActive={activeServer === item.id}
            onPress={() => onSelect(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    backgroundColor: COLORS.SIDEBAR,
    alignItems: 'center',
    paddingTop: 10,
  },
  itemContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 50,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#36393f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxActive: {
    borderRadius: 16,
    backgroundColor: COLORS.ACCENT,
  },
  activePill: {
    position: 'absolute',
    left: 0,
    width: 4,
    height: 40,
    backgroundColor: COLORS.WHITE,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});

