import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
// import { FRIENDS, DIRECT_MESSAGES } from '../data/mock';
const FRIENDS = [];
const DIRECT_MESSAGES = [];

// Placeholder illustration (can use a generic image or the generate_image tool if needed, for now using a network placeholder)
const EMPTY_STATE_IMAGE = 'https://i.imgur.com/X0ktw0k.png'; // Placeholder for the two characters sitting

// Demo data for visual match
const DEMO_FRIENDS = [
  {
    id: 'f1',
    name: 'HarukiSakurai',
    avatar: 'https://i.pravatar.cc/100?img=10', // Placeholder
    status: 'online',
    activity: 'Playing VS Code' // Just for fun
  }
];

export default function MobileFriendsScreen({ onLogout, user, onOpenDM }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.addFriendAction}>
            <MaterialCommunityIcons name="account-plus" size={20} color={COLORS.TEXT_BRIGHT} />
            <Text style={styles.addFriendActionText}>Add Friends</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={COLORS.TEXT_MUTED} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={COLORS.TEXT_MUTED}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {/* Empty State / Illustration */}
        <View style={styles.illustrationSection}>
          <View style={styles.circleBg}>
            <MaterialCommunityIcons name="account-group" size={80} color="#5865F2" />
          </View>
          <Text style={styles.welcomeTitle}>DMs with superpowers</Text>
          <Text style={styles.welcomeDesc}>
            Invite your friends to play games, listen to music together, and more.
          </Text>
          <TouchableOpacity style={styles.mainAddButton}>
            <Text style={styles.mainAddButtonText}>Add Friends</Text>
          </TouchableOpacity>
        </View>

        {/* Active Now / Recent DMs List (To allow clicking) */}
        <View style={styles.activeNowSection}>
          <Text style={styles.sectionTitle}>Active Now</Text>
          {DEMO_FRIENDS.map(friend => (
            <TouchableOpacity
              key={friend.id}
              style={styles.friendItem}
              onPress={() => onOpenDM && onOpenDM(friend)}
            >
              <View style={styles.avatarContainer}>
                <Image source={{ uri: friend.avatar }} style={styles.avatar} />
                <View style={styles.onlineBadge} />
              </View>
              <View style={styles.friendInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.friendName}>🌸{friend.name}💫</Text>
                  {/* Adding decorations to match screenshot vibe */}
                </View>
                <Text style={styles.friendActivity}>Sticker • 17/5/25</Text>
              </View>
              <MaterialCommunityIcons name="camera-outline" size={20} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 24,
    fontWeight: '800', // Bold/Heavy
  },
  addFriendAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#35373C', // Dark pill bg
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  addFriendActionText: {
    color: COLORS.TEXT_BRIGHT,
    fontWeight: '600',
    fontSize: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1F22',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: -40, // Visual adjustment
  },
  illustrationContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBg: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#2B2D31', // Darker circle behind illustration
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDesc: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  mainAddButton: {
    backgroundColor: '#5865F2', // Discord Blurple
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24, // Pill shape
    alignItems: 'center',
  },
  mainAddButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  illustrationSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginBottom: 30,
    marginTop: 20,
  },
  activeNowSection: {
    paddingHorizontal: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#23a559',
    borderWidth: 2,
    borderColor: COLORS.BACKGROUND,
  },
  friendInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  friendName: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    fontWeight: '600',
  },
  friendActivity: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
  }
});

