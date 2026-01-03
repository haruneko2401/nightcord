// src/data/mock.js
export const SERVERS = [
  { id: '1', name: 'Nightcord', icon: 'discord' },
  { id: '2', name: 'JS Devs', icon: 'language-javascript' },
  { id: '3', name: 'Gamers', icon: 'controller-classic' },
  { id: '4', name: 'Music', icon: 'music' },
];

export const CHANNELS = [
  { id: 'c1', name: 'thông-báo', type: 'text' },
  { id: 'c2', name: 'chung', type: 'text' },
  { id: 'c3', name: 'meme', type: 'text' },
  { id: 'c4', name: 'voice-room', type: 'voice' },
];

export const INITIAL_MESSAGES = [
  { 
    id: 'm1', 
    user: 'Admin Bot', 
    avatar: 'https://i.pravatar.cc/100?img=3', 
    content: 'Chào mừng đến với máy chủ Nightcord!', 
    time: '10:00 AM' 
  },
  { 
    id: 'm2', 
    user: 'Dev_User', 
    avatar: 'https://i.pravatar.cc/100?img=12', 
    content: 'Frontend đang được xây dựng, nhìn ổn phết.', 
    time: '10:05 AM' 
  },
];

