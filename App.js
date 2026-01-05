// App.js
import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import MobileFriendsScreen from './src/screens/MobileFriendsScreen';
import ServerSidebar from './src/components/ServerSidebar';
import ChannelList from './src/components/ChannelList';
import MobileServerList from './src/components/MobileServerList';
import MobileChannelList from './src/components/MobileChannelList';
import ChatArea from './src/components/ChatArea';
import MobileChatArea from './src/components/MobileChatArea';
import CreateServerModal from './src/components/CreateServerModal';
import ServerSetupModal from './src/components/ServerSetupModal';
import ServerNameModal from './src/components/ServerNameModal';
import VoiceChannelScreen from './src/components/VoiceChannelScreen';
import MobileVoiceChannelScreen from './src/components/MobileVoiceChannelScreen';
import COLORS from './src/constants/colors';
import { CHANNEL_MESSAGES, SERVERS, CHANNELS, VOICE_PARTICIPANTS } from './src/data/mock';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'register', 'forgot-password'
  
  // Server creation state
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [showServerSetupModal, setShowServerSetupModal] = useState(false);
  const [showServerNameModal, setShowServerNameModal] = useState(false);
  const [serverType, setServerType] = useState(null); // 'community' or 'friends'
  
  // Main app state
  const [viewMode, setViewMode] = useState('home'); // 'home' or 'server'
  const [servers, setServers] = useState([...SERVERS]); // Dynamic servers list
  const [activeServer, setActiveServer] = useState('1');
  const [activeChannel, setActiveChannel] = useState('c2');
  const [messages, setMessages] = useState(CHANNEL_MESSAGES['c2'] || []);
  
  // Mobile navigation state
  const [mobileScreen, setMobileScreen] = useState('servers'); // 'servers', 'channels', 'chat'
  
  // Voice channel state
  const [isInVoiceChannel, setIsInVoiceChannel] = useState(false);
  const [voiceParticipants, setVoiceParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Cập nhật messages khi chuyển channel
  useEffect(() => {
    const channel = CHANNELS.find(c => c.id === activeChannel);
    if (channel && channel.type === 'voice') {
      // Nếu là voice channel, join vào voice
      setIsInVoiceChannel(true);
      setVoiceParticipants(VOICE_PARTICIPANTS[activeChannel] || []);
      setMessages(CHANNEL_MESSAGES[activeChannel] || []);
    } else {
      // Nếu là text channel, rời voice
      setIsInVoiceChannel(false);
      const channelMessages = CHANNEL_MESSAGES[activeChannel] || [];
      setMessages(channelMessages);
    }
  }, [activeChannel]);

  // Hàm xử lý gửi tin nhắn (Logic tạm ở Frontend)
  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      user: 'Bạn',
      avatar: 'https://i.pravatar.cc/100?img=50',
      content: text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    
    // Lưu vào CHANNEL_MESSAGES để giữ lại khi chuyển channel
    if (!CHANNEL_MESSAGES[activeChannel]) {
      CHANNEL_MESSAGES[activeChannel] = [];
    }
    CHANNEL_MESSAGES[activeChannel].push(newMsg);
    
    setMessages([...CHANNEL_MESSAGES[activeChannel]]);
  };

  // Authentication handlers
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
  };

  const handleNavigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleForgotPassword = () => {
    setCurrentScreen('forgot-password');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handlePasswordReset = () => {
    // Tạm thời: Quay lại login sau khi reset
    setCurrentScreen('login');
  };

  // Server creation handlers
  const handleCreateServerClick = () => {
    setShowCreateServerModal(true);
  };

  const handleCreateServerNext = () => {
    setShowCreateServerModal(false);
    setShowServerSetupModal(true);
  };

  const handleServerSetupBack = () => {
    setShowServerSetupModal(false);
    setShowCreateServerModal(true);
  };

  const handleServerSetupComplete = (option) => {
    // option: 'community', 'friends', or 'skip'
    if (option === 'skip') {
      setShowServerSetupModal(false);
      setShowServerNameModal(true);
      setServerType(null);
    } else {
      setShowServerSetupModal(false);
      setShowServerNameModal(true);
      setServerType(option);
    }
  };

  const handleServerNameBack = () => {
    setShowServerNameModal(false);
    setShowServerSetupModal(true);
  };

  const handleServerNameComplete = (serverName) => {
    // Tạo server mới
    const newServer = {
      id: Date.now().toString(),
      name: serverName,
      icon: serverType === 'community' ? 'account-group' : 'account-multiple',
    };
    
    // Thêm server mới vào state
    setServers([...servers, newServer]);
    
    // Tạo channels mặc định cho server mới
    const defaultChannels = [
      { id: `${newServer.id}-c1`, name: 'general', type: 'text' },
      { id: `${newServer.id}-c2`, name: 'voice', type: 'voice' },
    ];
    
    // Đóng modal và chuyển sang server mới
    setShowServerNameModal(false);
    setActiveServer(newServer.id);
    setActiveChannel(`${newServer.id}-c1`);
    setViewMode('server');
    
    // Set messages mặc định
    CHANNEL_MESSAGES[`${newServer.id}-c1`] = [
      {
        id: 'welcome',
        user: 'System',
        avatar: 'https://i.pravatar.cc/100?img=3',
        content: `Welcome to ${serverName}! 🎉`,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(CHANNEL_MESSAGES[`${newServer.id}-c1`] || []);
    
    console.log('Server created:', newServer);
  };

  const currentServerName = servers.find(s => s.id === activeServer)?.name;

  // Show Login/Register/ForgotPassword screens if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND} />
        {currentScreen === 'login' ? (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToRegister={handleNavigateToRegister}
            onForgotPassword={handleForgotPassword}
          />
        ) : currentScreen === 'register' ? (
          <RegisterScreen
            onRegister={handleRegister}
            onNavigateToLogin={handleNavigateToLogin}
          />
        ) : (
          <ForgotPasswordScreen
            onBack={handleBackToLogin}
            onReset={handlePasswordReset}
          />
        )}
      </SafeAreaProvider>
    );
  }

  // Handler cho Home button
  const handleHomeClick = () => {
    setViewMode('home');
    if (Platform.OS !== 'web') {
      setMobileScreen('servers');
    }
  };

  // Handler cho Server click
  const handleServerSelect = (serverId) => {
    setActiveServer(serverId);
    setViewMode('server');
    if (Platform.OS !== 'web') {
      setMobileScreen('channels');
    }
  };

  // Mobile navigation handlers
  const handleMobileChannelSelect = (channelId) => {
    const channel = CHANNELS.find(c => c.id === channelId);
    if (channel && channel.type === 'voice') {
      handleJoinVoiceChannel(channelId);
    } else {
      setActiveChannel(channelId);
    }
    if (Platform.OS !== 'web') {
      setMobileScreen('chat');
    }
  };

  const handleMobileBackToChannels = () => {
    if (Platform.OS !== 'web') {
      setMobileScreen('channels');
    }
  };

  const handleMobileBackToServers = () => {
    if (Platform.OS !== 'web') {
      setMobileScreen('servers');
      setViewMode('home');
    }
  };

  // Voice channel handlers
  const handleJoinVoiceChannel = (channelId) => {
    setActiveChannel(channelId);
    setIsInVoiceChannel(true);
    setVoiceParticipants(VOICE_PARTICIPANTS[channelId] || []);
  };

  const handleLeaveVoiceChannel = () => {
    setIsInVoiceChannel(false);
    // Chuyển về text channel đầu tiên
    const firstTextChannel = CHANNELS.find(c => c.type === 'text');
    if (firstTextChannel) {
      setActiveChannel(firstTextChannel.id);
      setMessages(CHANNEL_MESSAGES[firstTextChannel.id] || []);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // Update current user in participants
    const updatedParticipants = voiceParticipants.map(p =>
      p.isCurrentUser ? { ...p, isMuted: !isMuted } : p
    );
    setVoiceParticipants(updatedParticipants);
  };

  const handleToggleDeafen = () => {
    setIsDeafened(!isDeafened);
    // Update current user in participants
    const updatedParticipants = voiceParticipants.map(p =>
      p.isCurrentUser ? { ...p, isDeafened: !isDeafened, isMuted: !isDeafened ? isMuted : true } : p
    );
    setVoiceParticipants(updatedParticipants);
    // Nếu deafen thì tự động mute
    if (!isDeafened) {
      setIsMuted(true);
    }
  };

  const handleVoiceChannelSendMessage = (text) => {
    if (!text.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      user: 'Bạn',
      avatar: 'https://i.pravatar.cc/100?img=50',
      content: text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    
    // Lưu vào CHANNEL_MESSAGES để giữ lại khi chuyển channel
    if (!CHANNEL_MESSAGES[activeChannel]) {
      CHANNEL_MESSAGES[activeChannel] = [];
    }
    CHANNEL_MESSAGES[activeChannel].push(newMsg);
    
    setMessages([...CHANNEL_MESSAGES[activeChannel]]);
  };

  // Main app (after authentication)
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.SIDEBAR} />
      <SafeAreaView 
        style={styles.container} 
        edges={Platform.OS === 'web' ? ['top', 'left', 'right'] : ['top']}
      >
        {/* 1. Bên trái: Danh sách Server (Hiển thị cả web và mobile) */}
        <ServerSidebar 
          activeServer={viewMode === 'home' ? 'home' : activeServer}
          onSelect={handleServerSelect}
          onHomeClick={handleHomeClick}
          onCreateServer={handleCreateServerClick}
          servers={servers}
        />

        {/* Create Server Modals */}
        <CreateServerModal
          visible={showCreateServerModal}
          onClose={() => setShowCreateServerModal(false)}
          onNext={handleCreateServerNext}
        />
        <ServerSetupModal
          visible={showServerSetupModal}
          onClose={() => setShowServerSetupModal(false)}
          onBack={handleServerSetupBack}
          onComplete={handleServerSetupComplete}
        />
        <ServerNameModal
          visible={showServerNameModal}
          onClose={() => setShowServerNameModal(false)}
          onBack={handleServerNameBack}
          onComplete={handleServerNameComplete}
          serverType={serverType}
        />

        {/* 2. Hiển thị Friends Screen hoặc Server View */}
        {Platform.OS === 'web' ? (
          /* Web Layout */
          viewMode === 'home' ? (
            <FriendsScreen />
          ) : isInVoiceChannel ? (
            <VoiceChannelScreen
              channelName={CHANNELS.find(c => c.id === activeChannel)?.name || 'voice-room'}
              participants={voiceParticipants}
              messages={messages}
              onSendMessage={handleVoiceChannelSendMessage}
              onLeave={handleLeaveVoiceChannel}
              isMuted={isMuted}
              isDeafened={isDeafened}
              onToggleMute={handleToggleMute}
              onToggleDeafen={handleToggleDeafen}
              onToggleCamera={() => {}}
              onOpenChat={() => {}}
              onOpenEffects={() => {}}
            />
          ) : (
            <>
              <ChannelList 
                serverName={currentServerName}
                activeChannel={activeChannel}
                onSelectChannel={(channelId) => {
                  const channel = CHANNELS.find(c => c.id === channelId);
                  if (channel && channel.type === 'voice') {
                    handleJoinVoiceChannel(channelId);
                  } else {
                    setActiveChannel(channelId);
                  }
                }}
              />
              <ChatArea 
                messages={messages} 
                onSendMessage={handleSendMessage}
                channelName={CHANNELS.find(c => c.id === activeChannel)?.name || 'chung'}
              />
            </>
          )
        ) : (
          /* Mobile Layout */
          viewMode === 'home' ? (
            <MobileFriendsScreen />
          ) : mobileScreen === 'servers' ? (
            <MobileServerList
              servers={servers}
              activeServer={activeServer}
              onSelectServer={handleServerSelect}
              onHomeClick={handleHomeClick}
            />
          ) : mobileScreen === 'channels' ? (
            <MobileChannelList
              serverName={currentServerName || 'Nightcord'}
              activeChannel={activeChannel}
              onSelectChannel={handleMobileChannelSelect}
              onBack={handleMobileBackToServers}
            />
          ) : isInVoiceChannel ? (
            <MobileVoiceChannelScreen
              channelName={CHANNELS.find(c => c.id === activeChannel)?.name || 'voice-room'}
              participants={voiceParticipants}
              messages={messages}
              onSendMessage={handleVoiceChannelSendMessage}
              onBack={() => {
                handleLeaveVoiceChannel();
                setMobileScreen('channels');
              }}
              onLeave={() => {
                handleLeaveVoiceChannel();
                setMobileScreen('channels');
              }}
              isMuted={isMuted}
              isDeafened={isDeafened}
              onToggleMute={handleToggleMute}
              onToggleDeafen={handleToggleDeafen}
              onToggleCamera={() => {}}
              onOpenChat={() => {}}
              onOpenEffects={() => {}}
            />
          ) : (
            <MobileChatArea
              channelName={CHANNELS.find(c => c.id === activeChannel)?.name || 'chung'}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={handleMobileBackToChannels}
            />
          )
        )}

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Xếp ngang
    backgroundColor: COLORS.BACKGROUND,
  },
});

