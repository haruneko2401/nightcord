import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const ServerItem = ({ item, isActive, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Stagger animation - mỗi item xuất hiện sau item trước
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    // Bounce animation khi click
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          transform: [
            { scale: scaleAnim },
            { rotate: rotation },
          ],
        },
      ]}
    >
      <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.touchable}
      >
        {isActive && (
          <LinearGradient
            colors={[COLORS.ACCENT_PINK, COLORS.ACCENT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.activePill}
          />
        )}
        <View style={[
          styles.iconBox, 
          isActive && styles.iconBoxActive,
          !isActive && styles.iconBoxHover
        ]}>
          {isActive ? (
            <LinearGradient
              colors={[COLORS.ACCENT, COLORS.ACCENT_PINK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <MaterialCommunityIcons 
                name={item.icon} 
                size={28} 
                color={COLORS.WHITE} 
              />
            </LinearGradient>
          ) : (
            <MaterialCommunityIcons 
              name={item.icon} 
              size={28} 
              color={COLORS.TEXT_MUTED} 
            />
          )}
        </View>
        {isActive && (
          <Animated.View 
            style={[
              styles.activeGlow,
              {
                opacity: scaleAnim,
              }
            ]} 
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ServerSidebar({ activeServer, onSelect, onHomeClick, onCreateServer, servers = [] }) {
  const homeScale = useRef(new Animated.Value(0)).current;
  const addScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Home button animation
    Animated.spring(homeScale, {
      toValue: 1,
      delay: 200,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Add button animation
    Animated.spring(addScale, {
      toValue: 1,
      delay: 400,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.SIDEBAR, COLORS.CHANNEL_LIST]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      {/* Home/Direct Messages Button */}
      <Animated.View
        style={{
          transform: [{ scale: homeScale }],
        }}
      >
        <TouchableOpacity 
          style={[
            styles.iconBox, 
            styles.homeButton,
            activeServer === 'home' && styles.iconBoxActive
          ]}
          activeOpacity={0.7}
          onPress={onHomeClick}
        >
          {activeServer === 'home' ? (
            <LinearGradient
              colors={[COLORS.ACCENT_BLUE, COLORS.ACCENT_CYAN]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <MaterialCommunityIcons 
                name="home" 
                size={28} 
                color={COLORS.WHITE} 
              />
            </LinearGradient>
          ) : (
            <MaterialCommunityIcons 
              name="home" 
              size={28} 
              color={COLORS.TEXT_MUTED} 
            />
          )}
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.divider} />

      <FlatList
        data={servers}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <ServerItem 
            item={item} 
            isActive={activeServer === item.id}
            onPress={() => onSelect(item.id)}
            index={index}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Server Button */}
      <Animated.View
        style={{
          transform: [{ scale: addScale }],
        }}
      >
        <TouchableOpacity 
          style={[styles.iconBox, styles.addButton]}
          activeOpacity={0.7}
          onPress={onCreateServer}
        >
          <MaterialCommunityIcons 
            name="plus" 
            size={28} 
            color={COLORS.SUCCESS} 
          />
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    alignItems: 'center',
    paddingTop: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.BORDER,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  itemContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 56,
    position: 'relative',
  },
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.INPUT_BG,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconBoxActive: {
    borderRadius: 16,
    borderColor: COLORS.ACCENT_PINK,
    shadowColor: COLORS.ACCENT_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  iconBoxHover: {
    borderColor: COLORS.BORDER,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    position: 'absolute',
    left: 0,
    width: 4,
    height: 40,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    shadowColor: COLORS.ACCENT_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  activeGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.ACCENT_PINK,
    zIndex: -1,
  },
  homeButton: {
    marginBottom: 8,
    borderRadius: 16,
  },
  addButton: {
    marginTop: 8,
    borderColor: COLORS.SUCCESS,
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  divider: {
    width: 32,
    height: 2,
    backgroundColor: COLORS.DIVIDER,
    borderRadius: 1,
    marginVertical: 8,
  },
});
