// App.js
import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, View, Text, StyleSheet, Platform } from 'react-native';
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
import MobileBottomNav from './src/components/MobileBottomNav';
import CreateServerModal from './src/components/CreateServerModal';
import ServerSetupModal from './src/components/ServerSetupModal';
import ServerNameModal from './src/components/ServerNameModal';
import VoiceChannelScreen from './src/components/VoiceChannelScreen';
import MobileVoiceChannelScreen from './src/components/MobileVoiceChannelScreen';
import COLORS from './src/constants/colors';
import { CHANNEL_MESSAGES, SERVERS, CHANNELS, VOICE_PARTICIPANTS } from './src/data/mock';
import { authAPI, getStoredToken, serversAPI, messagesAPI } from './src/services/api';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'register', 'forgot-password'
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Server creation state
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [showServerSetupModal, setShowServerSetupModal] = useState(false);
  const [showServerNameModal, setShowServerNameModal] = useState(false);
  const [serverType, setServerType] = useState(null); // 'community' or 'friends'

  // Main app state
  const [viewMode, setViewMode] = useState('home'); // 'home' or 'server'
  const [servers, setServers] = useState([]); // Empty initial servers
  const [channels, setChannels] = useState([]); // Empty initial channels
  const [activeServer, setActiveServer] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingServers, setLoadingServers] = useState(false);

  // Mobile navigation state
  const [mobileScreen, setMobileScreen] = useState('servers'); // 'servers', 'channels', 'chat'
  const [activeDMUser, setActiveDMUser] = useState(null); // User object for DM

  // Voice channel state
  const [isInVoiceChannel, setIsInVoiceChannel] = useState(false);
  const [voiceParticipants, setVoiceParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [localVideoRef, setLocalVideoRef] = useState(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const speakingCheckIntervalRef = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Load servers when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadServers();
    }
  }, [isAuthenticated, user]);

  // Check if user is already authenticated
  const checkAuth = async () => {
    try {
      // Check if we have a token first
      const token = await getStoredToken();

      if (!token) {
        // No token, skip API call
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      // Try to verify token, but don't fail if backend is not available
      try {
        const response = await authAPI.verifyToken();
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (apiError) {
        // Backend might not be running, just continue without auth
        console.log('Backend not available, continuing without auth');
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Not authenticated or token expired or network error
      console.log('Auth check failed:', error.message);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  // Cập nhật messages khi chuyển channel
  useEffect(() => {
    const loadChannelMessages = async () => {
      const channel = channels.find(c => c.id === activeChannel) || CHANNELS.find(c => c.id === activeChannel);

      if (channel && channel.type === 'voice') {
        // Nếu là voice channel, join vào voice
        setIsInVoiceChannel(true);
        setVoiceParticipants(VOICE_PARTICIPANTS[activeChannel] || []);
        setMessages(CHANNEL_MESSAGES[activeChannel] || []);
      } else {
        // Nếu là text channel, rời voice
        setIsInVoiceChannel(false);

        // Thử load messages từ backend
        try {
          const response = await messagesAPI.getMessages(activeChannel);
          if (response.success && response.messages) {
            setMessages(response.messages);
          } else {
            // Fallback to mock messages
            setMessages(CHANNEL_MESSAGES[activeChannel] || []);
          }
        } catch (error) {
          console.error('Error loading messages:', error);
          // Fallback to mock messages
          setMessages(CHANNEL_MESSAGES[activeChannel] || []);
        }
      }
    };

    if (activeChannel) {
      loadChannelMessages();
    }
  }, [activeChannel, channels]);

  // Hàm xử lý gửi tin nhắn
  const handleSendMessage = async (text) => {
    if (!text.trim() || !activeChannel) return;

    try {
      // Gọi API để gửi tin nhắn
      const response = await messagesAPI.sendMessage(activeChannel, text);

      if (response.success && response.message) {
        // Thêm tin nhắn mới vào state
        setMessages([...messages, response.message]);
      } else {
        // Fallback: tạo tin nhắn local nếu API thất bại
        const newMsg = {
          id: Date.now().toString(),
          channelId: activeChannel,
          userId: user?.id || 'unknown',
          user: user?.displayName || user?.username || 'Bạn',
          username: user?.username || 'you',
          avatar: user?.avatar || `https://i.pravatar.cc/100?img=${parseInt(user?.id || '50') % 50}`,
          content: text,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date().toISOString(),
        };
        setMessages([...messages, newMsg]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback: tạo tin nhắn local nếu API thất bại
      const newMsg = {
        id: Date.now().toString(),
        channelId: activeChannel,
        userId: user?.id || 'unknown',
        user: user?.displayName || user?.username || 'Bạn',
        username: user?.username || 'you',
        avatar: user?.avatar || `https://i.pravatar.cc/100?img=${parseInt(user?.id || '50') % 50}`,
        content: text,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
    }
  };

  // Authentication handlers
  const handleLogin = (userData, token) => {
    if (userData) {
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const handleRegister = (userData, token) => {
    if (userData) {
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Vẫn tiếp tục logout ngay cả khi API call thất bại
    } finally {
      // Luôn clear state và chuyển về login
      console.log('Clearing user state and redirecting to login');
      setUser(null);
      setIsAuthenticated(false);
      setCurrentScreen('login');
    }
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

  // Load servers from backend
  const loadServers = async () => {
    try {
      setLoadingServers(true);
      const response = await serversAPI.getServers();
      if (response.success && response.servers) {
        // Load servers from API only
        const allServers = [...response.servers];
        setServers(allServers);

        // Load channels for each server
        const allChannels = [];
        for (const server of response.servers) {
          try {
            const channelsResponse = await serversAPI.getChannels(server.id);
            if (channelsResponse.success && channelsResponse.channels) {
              allChannels.push(...channelsResponse.channels);
            }
          } catch (error) {
            console.error(`Error loading channels for server ${server.id}:`, error);
          }
        }
        setChannels(allChannels);
      }
    } catch (error) {
      console.error('Error loading servers:', error);
      // Keep using mock servers if API fails
    } finally {
      setLoadingServers(false);
    }
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

  const handleServerNameComplete = async (serverName) => {
    try {
      // Gọi API để tạo server
      const response = await serversAPI.createServer(serverName, serverType);

      if (response.success && response.server) {
        const newServer = {
          ...response.server,
          icon: serverType === 'community' ? 'account-group' : 'account-multiple',
        };

        // Thêm server mới vào state
        setServers([...servers, newServer]);

        // Thêm channels vào state nếu có
        if (response.channels && response.channels.length > 0) {
          setChannels([...channels, ...response.channels]);
        }

        // Đóng modal và chuyển sang server mới
        setShowServerNameModal(false);
        setActiveServer(newServer.id);

        // Set channel đầu tiên làm active
        const firstChannel = response.channels?.[0] || { id: `${newServer.id}-c1`, name: 'general', type: 'text' };
        setActiveChannel(firstChannel.id);
        setViewMode('server');

        // Load messages cho channel đầu tiên
        try {
          const messagesResponse = await messagesAPI.getMessages(firstChannel.id);
          if (messagesResponse.success && messagesResponse.messages) {
            setMessages(messagesResponse.messages);
          } else {
            // Set welcome message nếu chưa có
            setMessages([
              {
                id: 'welcome',
                user: 'System',
                username: 'system',
                avatar: 'https://i.pravatar.cc/100?img=3',
                content: `Welcome to ${serverName}! 🎉`,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date().toISOString(),
              }
            ]);
          }
        } catch (error) {
          console.error('Error loading messages:', error);
          // Set welcome message as fallback
          setMessages([
            {
              id: 'welcome',
              user: 'System',
              username: 'system',
              avatar: 'https://i.pravatar.cc/100?img=3',
              content: `Welcome to ${serverName}! 🎉`,
              time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              timestamp: new Date().toISOString(),
            }
          ]);
        }

        console.log('Server created:', newServer);
      } else {
        console.error('Failed to create server:', response.message);
        alert('Không thể tạo server. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating server:', error);
      alert('Có lỗi xảy ra khi tạo server. Vui lòng thử lại.');
    }
  };

  const currentServerName = servers.find(s => s.id === activeServer)?.name;

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.BACKGROUND }}>
          <Text style={{ color: COLORS.TEXT_BRIGHT }}>Đang tải...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

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
  const handleOpenDM = (friend) => {
    setActiveDMUser(friend);
    setMobileScreen('chat');
    setActiveChannel(null); // Clear active channel to switch to DM mode context effectively
    // In a real app we would load DM messages here
    setMessages([
      {
        id: '1',
        user: friend.name,
        avatar: friend.avatar,
        content: '.',
        time: '17/5/25, 07:12', // Matches screenshot
        isOwnMessage: false,
      },
      {
        id: '2',
        user: friend.name,
        avatar: friend.avatar,
        content: 'https://discord.gg/lgbtqia', // Matches screenshot
        time: '17/5/25, 09:09',
        isOwnMessage: false,
        // We would render an embed here ideally
        embed: {
          title: 'Pridecord',
          description: 'An LGBTQIA+ server where you can safely interact with others...',
          members: '156,312 Members',
          online: '38,270 Online',
          image: 'https://i.imgur.com/generic.png' // Placeholder
        }
      }
    ]);
  };

  const handleMobileChannelSelect = (channelId) => {
    setActiveDMUser(null); // Clear DM user
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
  const handleJoinVoiceChannel = async (channelId) => {
    setActiveChannel(channelId);
    setIsInVoiceChannel(true);
    setVoiceParticipants(VOICE_PARTICIPANTS[channelId] || []);

    // Tự động bật mic khi join voice channel
    try {
      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });
        setLocalStream(stream);
        setIsMuted(false);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.');
      setIsMuted(true);
    }
  };

  const handleLeaveVoiceChannel = () => {
    // Dừng audio analyzer
    if (speakingCheckIntervalRef.current) {
      clearInterval(speakingCheckIntervalRef.current);
      speakingCheckIntervalRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Dừng tất cả media streams
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    setIsInVoiceChannel(false);
    setIsCameraOn(false);
    setIsMuted(false);
    setIsDeafened(false);
    setIsSpeaking(false);

    if (localVideoRef && localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    // Chuyển về text channel đầu tiên
    const firstTextChannel = channels.find(c => c.type === 'text') || CHANNELS.find(c => c.type === 'text');
    if (firstTextChannel) {
      setActiveChannel(firstTextChannel.id);
      setMessages(CHANNEL_MESSAGES[firstTextChannel.id] || []);
    }
  };

  const handleToggleMute = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // Update audio track if stream exists
    if (localStream && Platform.OS === 'web') {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !newMutedState;
      });
    }

    // Update current user in participants
    const updatedParticipants = voiceParticipants.map(p =>
      p.isCurrentUser ? { ...p, isMuted: newMutedState } : p
    );
    setVoiceParticipants(updatedParticipants);
  };

  const handleToggleDeafen = () => {
    const newDeafenedState = !isDeafened;
    setIsDeafened(newDeafenedState);

    // Update current user in participants
    const updatedParticipants = voiceParticipants.map(p =>
      p.isCurrentUser ? { ...p, isDeafened: newDeafenedState, isMuted: newDeafenedState ? true : isMuted } : p
    );
    setVoiceParticipants(updatedParticipants);
    // Nếu deafen thì tự động mute
    if (newDeafenedState) {
      setIsMuted(true);
      if (localStream && Platform.OS === 'web') {
        const audioTracks = localStream.getAudioTracks();
        audioTracks.forEach(track => {
          track.enabled = false;
        });
      }
    }
  };

  const handleToggleCamera = async () => {
    const newCameraState = !isCameraOn;

    try {
      if (newCameraState) {
        // Bật camera
        if (Platform.OS === 'web') {
          let stream;

          if (localStream) {
            // Nếu đã có audio stream, thêm video vào
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const videoTrack = videoStream.getVideoTracks()[0];
            localStream.addTrack(videoTrack);
            stream = localStream;
          } else {
            // Tạo stream mới với cả audio và video
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true
            });
            setLocalStream(stream);
            setupAudioAnalyzer(stream);
          }

          setIsCameraOn(true);

          // Hiển thị video preview sau một chút để đảm bảo ref đã được set
          setTimeout(() => {
            if (localVideoRef) {
              if (typeof localVideoRef === 'function') {
                // localVideoRef is a setter, component will handle it
              } else if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.play().catch(err => console.error('Error playing video:', err));
              }
            }
          }, 200);
        } else {
          // Mobile - cần expo-camera
          setIsCameraOn(true);
          alert('Camera sẽ được bật. Cần cài đặt expo-camera cho mobile.');
        }
      } else {
        // Tắt camera
        if (localStream && Platform.OS === 'web') {
          const videoTracks = localStream.getVideoTracks();
          videoTracks.forEach(track => {
            track.stop();
            localStream.removeTrack(track);
          });
        }
        setIsCameraOn(false);

        if (localVideoRef) {
          if (typeof localVideoRef === 'function') {
            // Component will handle clearing
          } else if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
          }
        }
      }

      // Update current user in participants
      const updatedParticipants = voiceParticipants.map(p =>
        p.isCurrentUser ? { ...p, isCameraOn: newCameraState } : p
      );
      setVoiceParticipants(updatedParticipants);
    } catch (error) {
      console.error('Error toggling camera:', error);
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
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
        {Platform.OS === 'web' ? (
          /* Web Layout */
          viewMode === 'home' ? (
            <FriendsScreen
              onLogout={handleLogout}
              user={user}
              onCreateServer={handleCreateServerClick}
            />
          ) : isInVoiceChannel ? (
            <VoiceChannelScreen
              channelName={channels.find(c => c.id === activeChannel)?.name || CHANNELS.find(c => c.id === activeChannel)?.name || 'voice-room'}
              participants={voiceParticipants}
              messages={messages}
              onSendMessage={handleVoiceChannelSendMessage}
              onLeave={handleLeaveVoiceChannel}
              isMuted={isMuted}
              isDeafened={isDeafened}
              onToggleMute={handleToggleMute}
              onToggleDeafen={handleToggleDeafen}
              onToggleCamera={handleToggleCamera}
              isCameraOn={isCameraOn}
              localVideoRef={setLocalVideoRef}
              onOpenChat={() => { }}
              onOpenEffects={() => { }}
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
                channelName={channels.find(c => c.id === activeChannel)?.name || CHANNELS.find(c => c.id === activeChannel)?.name || 'chung'}
                typingUsers={[]}
              />
            </>
          )
        ) : (
          /* Mobile Layout (Discord Style) */
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {/* Server Sidebar - Always visible on left */}
              <ServerSidebar
                activeServer={viewMode === 'home' ? 'home' : activeServer}
                onSelect={handleServerSelect}
                onHomeClick={handleHomeClick}
                onCreateServer={handleCreateServerClick}
                servers={servers}
                isMobile={true} // Add this prop if needed for specific mobile sidebar styling adjustments
              />

              {/* Main Content Area */}
              <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>
                {viewMode === 'home' ? (
                  <MobileFriendsScreen
                    user={user}
                    onLogout={handleLogout}
                  // Provide navigation to chat if needed?
                  />
                ) : mobileScreen === 'channels' ? (
                  <MobileChannelList // Or ChannelList if we can reuse
                    serverName={currentServerName || 'Nightcord'}
                    activeChannel={activeChannel}
                    onSelectChannel={handleMobileChannelSelect}
                    onBack={handleMobileBackToServers} // Maybe not needed if Sidebar is present?
                  />
                ) : isInVoiceChannel ? (
                  <MobileVoiceChannelScreen
                    // ... appropriate voice props
                    channelName={channels.find(c => c.id === activeChannel)?.name || CHANNELS.find(c => c.id === activeChannel)?.name || 'voice-room'}
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
                    onToggleCamera={handleToggleCamera}
                    isCameraOn={isCameraOn}
                    localVideoRef={setLocalVideoRef}
                    onOpenChat={() => { }}
                    onOpenEffects={() => { }}
                  />
                ) : (
                  // Chat View
                  <ChatArea
                    channelName={activeDMUser ? activeDMUser.name : (channels.find(c => c.id === activeChannel)?.name || CHANNELS.find(c => c.id === activeChannel)?.name || 'chung')}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onBack={() => {
                      if (activeDMUser) {
                        setMobileScreen('servers'); // Back to Friends/Home
                        setActiveDMUser(null);
                        setViewMode('home');
                      } else {
                        handleMobileBackToChannels();
                      }
                    }}
                    typingUsers={[]}
                    isDM={!!activeDMUser}
                    dmUser={activeDMUser}
                  />
                )}
              </View>
            </View>

            {/* Bottom Nav */}
            <MobileBottomNav
              activeTab={viewMode === 'home' ? 'home' : 'you'} // Simple logic for now
              onTabSelect={(tab) => {
                if (tab === 'home') handleHomeClick();
                // handle other tabs
              }}
              avatar={user?.avatar}
            />
          </View>
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

