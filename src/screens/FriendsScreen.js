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
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
// import { FRIENDS, DIRECT_MESSAGES } from '../data/mock';
const FRIENDS = [];
const DIRECT_MESSAGES = [];

export default function FriendsScreen({ onLogout, user, onCreateServer }) {
  const [activeTab, setActiveTab] = useState('online'); // 'online', 'all', 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const filteredFriends = FRIENDS.filter(friend => {
    if (activeTab === 'online') return friend.status === 'online';
    if (activeTab === 'pending') return friend.status === 'pending';
    return true; // 'all'
  }).filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = FRIENDS.filter(f => f.status === 'online').length;

  return (
    <View style={styles.container}>
      {/* Left Sidebar - Direct Messages */}
      <LinearGradient
        colors={[COLORS.CHANNEL_LIST, COLORS.BACKGROUND]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.leftSidebar}
      >
        {/* Top Section */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.topButton}>
            <MaterialCommunityIcons name="account-group" size={20} color={COLORS.TEXT_BRIGHT} />
            <Text style={styles.topButtonText}>Friends</Text>
          </TouchableOpacity>

        </View>

        {/* Direct Messages Header */}
        <View style={styles.dmHeader}>
          <Text style={styles.dmHeaderText}>Direct Messages</Text>
          <TouchableOpacity style={styles.dmAddButton}>
            <MaterialCommunityIcons name="plus" size={18} color={COLORS.TEXT_MUTED} />
          </TouchableOpacity>
        </View>

        {/* Direct Messages List */}
        <ScrollView style={styles.dmList} showsVerticalScrollIndicator={false}>
          {DIRECT_MESSAGES.map((dm) => (
            <TouchableOpacity key={dm.id} style={styles.dmItem}>
              <View style={styles.dmAvatarContainer}>
                <Image source={{ uri: dm.avatar }} style={styles.dmAvatar} />
                {dm.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{dm.unread}</Text>
                  </View>
                )}
                {dm.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newText}>NEW</Text>
                  </View>
                )}
              </View>
              <Text style={styles.dmName} numberOfLines={1}>{dm.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* User Profile Bar */}
        <View style={styles.userBar}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=50' }}
              style={styles.userAvatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName} numberOfLines={1}>HarukiSakur...</Text>
              <Text style={styles.userStatus}>Invisible</Text>
            </View>
          </View>
          <View style={styles.userActions}>
            <TouchableOpacity style={styles.userActionButton}>
              <MaterialCommunityIcons name="microphone" size={18} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.userActionButton}>
              <MaterialCommunityIcons name="headphones" size={18} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.userActionButton}
              onPress={() => setShowSettings(true)}
            >
              <MaterialCommunityIcons name="cog" size={18} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content - Friends */}
      <LinearGradient
        colors={[COLORS.BACKGROUND, COLORS.CHANNEL_LIST]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.mainContent}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color={COLORS.TEXT_MUTED} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find or start a conversation"
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {/* Create Server Button */}
          {onCreateServer && (
            <TouchableOpacity
              style={styles.createServerButton}
              onPress={onCreateServer}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[COLORS.ACCENT, COLORS.ACCENT_PINK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createServerButtonGradient}
              >
                <MaterialCommunityIcons name="plus" size={18} color={COLORS.WHITE} />
                <Text style={styles.createServerButtonText}>Create Server</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
              onPress={() => setActiveTab('friends')}
            >
              <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
                Friends
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'online' && styles.tabActive]}
              onPress={() => setActiveTab('online')}
            >
              <Text style={[styles.tabText, activeTab === 'online' && styles.tabTextActive]}>
                Online
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'all' && styles.tabActive]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
              onPress={() => setActiveTab('pending')}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addFriendButton}>
              <Text style={styles.addFriendText}>Add Friend</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Friends Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'online' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Online - {onlineCount}</Text>
              </View>
              <FlatList
                data={filteredFriends}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.friendItem}>
                    <View style={styles.friendAvatarContainer}>
                      <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
                      <View style={[styles.statusIndicator, styles[`status${item.status}`]]} />
                    </View>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{item.name}</Text>
                      {item.activity && (
                        <Text style={styles.friendActivity} numberOfLines={1}>
                          {item.activity}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity style={styles.friendMenu}>
                      <MaterialCommunityIcons name="dots-vertical" size={20} color={COLORS.TEXT_MUTED} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            </View>
          )}

          {activeTab === 'all' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Friends - {FRIENDS.length}</Text>
              </View>
              <FlatList
                data={filteredFriends}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.friendItem}>
                    <View style={styles.friendAvatarContainer}>
                      <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
                      <View style={[styles.statusIndicator, styles[`status${item.status}`]]} />
                    </View>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{item.name}</Text>
                      {item.activity && (
                        <Text style={styles.friendActivity} numberOfLines={1}>
                          {item.activity}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity style={styles.friendMenu}>
                      <MaterialCommunityIcons name="dots-vertical" size={20} color={COLORS.TEXT_MUTED} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            </View>
          )}

          {activeTab === 'pending' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pending - {filteredFriends.length}</Text>
              </View>
              {filteredFriends.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No pending friend requests</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredFriends}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.friendItem}>
                      <View style={styles.friendAvatarContainer}>
                        <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{item.name}</Text>
                        <Text style={styles.friendActivity}>Outgoing Friend Request</Text>
                      </View>
                      <View style={styles.pendingActions}>
                        <TouchableOpacity style={styles.acceptButton}>
                          <Text style={styles.acceptButtonText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )}
                  scrollEnabled={false}
                />
              )}
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSettings(false)}
        >
          <TouchableOpacity
            style={styles.settingsModal}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Settings</Text>
              <TouchableOpacity
                onPress={() => setShowSettings(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color={COLORS.TEXT_BRIGHT} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingsContent}>
              {/* User Info */}
              <View style={styles.settingsSection}>
                <View style={styles.userInfoSection}>
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/100?img=50' }}
                    style={styles.settingsAvatar}
                  />
                  <View style={styles.userInfoText}>
                    <Text style={styles.settingsUserName}>
                      {user?.displayName || user?.username || 'HarukiSakur...'}
                    </Text>
                    <Text style={styles.settingsUserEmail}>
                      {user?.email || 'user@example.com'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Settings Options */}
              <View style={styles.settingsSection}>
                <TouchableOpacity style={styles.settingsOption}>
                  <MaterialCommunityIcons name="account" size={20} color={COLORS.TEXT_BRIGHT} />
                  <Text style={styles.settingsOptionText}>My Account</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption}>
                  <MaterialCommunityIcons name="bell" size={20} color={COLORS.TEXT_BRIGHT} />
                  <Text style={styles.settingsOptionText}>Notifications</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption}>
                  <MaterialCommunityIcons name="shield" size={20} color={COLORS.TEXT_BRIGHT} />
                  <Text style={styles.settingsOptionText}>Privacy & Safety</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption}>
                  <MaterialCommunityIcons name="palette" size={20} color={COLORS.TEXT_BRIGHT} />
                  <Text style={styles.settingsOptionText}>Appearance</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
                </TouchableOpacity>
              </View>

              {/* Logout Button */}
              <View style={styles.settingsSection}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => {
                    if (!onLogout) {
                      console.error('onLogout function is not provided');
                      return;
                    }

                    // Đóng modal trước
                    setShowSettings(false);

                    // Sử dụng window.confirm cho web, Alert.alert cho mobile
                    if (Platform.OS === 'web') {
                      // Web: dùng window.confirm (đơn giản và hoạt động tốt trên web)
                      const confirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
                      if (confirmed) {
                        onLogout();
                      }
                    } else {
                      // Mobile: dùng Alert.alert
                      Alert.alert(
                        'Logout',
                        'Bạn có chắc chắn muốn đăng xuất?',
                        [
                          {
                            text: 'Hủy',
                            style: 'cancel',
                          },
                          {
                            text: 'Logout',
                            style: 'destructive',
                            onPress: () => {
                              onLogout();
                            },
                          },
                        ],
                        { cancelable: true }
                      );
                    }
                  }}
                >
                  <MaterialCommunityIcons name="logout" size={20} color={COLORS.ERROR} />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
  },
  leftSidebar: {
    width: Platform.OS === 'web' ? 240 : '100%',
    height: Platform.OS === 'web' ? 'auto' : 200,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderBottomWidth: Platform.OS === 'web' ? 0 : 1,
    borderRightColor: COLORS.BORDER,
    borderBottomColor: COLORS.BORDER,
    flexDirection: 'column',
  },
  topSection: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  topButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    gap: 12,
  },
  topButtonText: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    fontWeight: '500',
  },
  dmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  dmHeaderText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dmAddButton: {
    padding: 4,
  },
  dmList: {
    flex: 1,
  },
  dmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 8,
    marginVertical: 2,
    gap: 12,
  },
  dmAvatarContainer: {
    position: 'relative',
  },
  dmAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  newText: {
    color: COLORS.WHITE,
    fontSize: 8,
    fontWeight: 'bold',
  },
  dmName: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    fontWeight: '500',
  },
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.USER_BAR,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 14,
    fontWeight: '500',
  },
  userStatus: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
  },
  userActions: {
    flexDirection: 'row',
    gap: 4,
  },
  userActionButton: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.SIDEBAR,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    maxHeight: '80%',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  settingsTitle: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  settingsContent: {
    padding: 20,
  },
  settingsSection: {
    marginBottom: 20,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 8,
  },
  settingsAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfoText: {
    flex: 1,
  },
  settingsUserName: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingsUserEmail: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.INPUT_BG,
    gap: 12,
  },
  settingsOptionText: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    gap: 12,
  },
  logoutButtonText: {
    flex: 1,
    color: COLORS.ERROR,
    fontSize: 15,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    width: Platform.OS === 'web' ? 'auto' : '100%',
  },
  topBar: {
    backgroundColor: COLORS.HEADER,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flex: 1,
  },
  createServerButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  createServerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  createServerButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    color: COLORS.TEXT_BRIGHT,
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  tabActive: {
    backgroundColor: COLORS.INPUT_BG,
  },
  tabText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.TEXT_BRIGHT,
  },
  addFriendButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 4,
  },
  addFriendText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  friendAvatarContainer: {
    position: 'relative',
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.BACKGROUND,
  },
  statusonline: {
    backgroundColor: COLORS.SUCCESS,
  },
  statusidle: {
    backgroundColor: '#f59e0b',
  },
  statusdnd: {
    backgroundColor: COLORS.ERROR,
  },
  statusoffline: {
    backgroundColor: COLORS.TEXT_MUTED,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    color: COLORS.TEXT_BRIGHT,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  friendActivity: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
  },
  friendMenu: {
    padding: 4,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 4,
  },
  acceptButtonText: {
    color: COLORS.WHITE,
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
  },
});
