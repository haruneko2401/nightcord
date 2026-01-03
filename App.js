// App.js
import React, { useState } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ServerSidebar from './src/components/ServerSidebar';
import ChatArea from './src/components/ChatArea';
import COLORS from './src/constants/colors';
import { INITIAL_MESSAGES, SERVERS } from './src/data/mock';

export default function App() {
  const [activeServer, setActiveServer] = useState('1');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  // Hàm xử lý gửi tin nhắn (Logic tạm ở Frontend)
  const handleSendMessage = (text) => {
    const newMsg = {
      id: Date.now().toString(),
      user: 'Bạn',
      avatar: 'https://i.pravatar.cc/100?img=50', // Avatar giả
      content: text,
      time: 'Vừa xong'
    };
    setMessages([...messages, newMsg]);
  };

  const currentServerName = SERVERS.find(s => s.id === activeServer)?.name;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.SIDEBAR} />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        
        {/* 1. Bên trái: Danh sách Server */}
        <ServerSidebar 
          activeServer={activeServer} 
          onSelect={setActiveServer} 
        />

        {/* 2. Ở giữa: Danh sách kênh (Tạm thời ẩn trên mobile, 
             sau này mình sẽ dùng Drawer Navigation để kéo ra) */}
        {/* <ChannelList serverName={currentServerName} /> */}

        {/* 3. Bên phải: Khu vực Chat */}
        <ChatArea 
          messages={messages} 
          onSendMessage={handleSendMessage} 
        />

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

