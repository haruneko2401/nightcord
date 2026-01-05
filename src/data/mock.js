// src/data/mock.js
export const SERVERS = [
  { id: '1', name: 'Nightcord', icon: 'message-text' },
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

// Messages cho từng channel
export const CHANNEL_MESSAGES = {
  'c1': [
    { 
      id: 'm1', 
      user: 'Admin Bot', 
      avatar: 'https://i.pravatar.cc/100?img=3', 
      content: '📢 Chào mừng đến với máy chủ Nightcord!', 
      time: '10:00 AM' 
    },
    { 
      id: 'm2', 
      user: 'Moderator', 
      avatar: 'https://i.pravatar.cc/100?img=5', 
      content: 'Vui lòng đọc rules trước khi chat nhé!', 
      time: '10:15 AM' 
    },
  ],
  'c2': [
    { 
      id: 'm3', 
      user: 'Admin Bot', 
      avatar: 'https://i.pravatar.cc/100?img=3', 
      content: 'Chào mừng đến với kênh chung!', 
      time: '10:00 AM' 
    },
    { 
      id: 'm4', 
      user: 'Dev_User', 
      avatar: 'https://i.pravatar.cc/100?img=12', 
      content: 'Frontend đang được xây dựng, nhìn ổn phết.', 
      time: '10:05 AM' 
    },
    { 
      id: 'm5', 
      user: 'Designer', 
      avatar: 'https://i.pravatar.cc/100?img=20', 
      content: 'UI/UX design rất đẹp! 👏', 
      time: '10:10 AM' 
    },
  ],
  'c3': [
    { 
      id: 'm6', 
      user: 'Meme_Lord', 
      avatar: 'https://i.pravatar.cc/100?img=15', 
      content: '😂😂😂', 
      time: '09:30 AM' 
    },
    { 
      id: 'm7', 
      user: 'Funny_Guy', 
      avatar: 'https://i.pravatar.cc/100?img=8', 
      content: 'Haha vui quá!', 
      time: '09:35 AM' 
    },
  ],
  'c4': [
    { 
      id: 'm8', 
      user: 'Voice_Admin', 
      avatar: 'https://i.pravatar.cc/100?img=10', 
      content: '🎤 Voice channel - Join để chat voice!', 
      time: '11:00 AM' 
    },
  ],
};

// Voice channel participants
export const VOICE_PARTICIPANTS = {
  'c4': [
    {
      id: 'p1',
      name: 'Bạn',
      avatar: 'https://i.pravatar.cc/100?img=50',
      isCurrentUser: true,
      isMuted: false,
      isDeafened: false,
      isSpeaking: false,
    },
    {
      id: 'p2',
      name: 'Dev_User',
      avatar: 'https://i.pravatar.cc/100?img=12',
      isCurrentUser: false,
      isMuted: false,
      isDeafened: false,
      isSpeaking: true,
    },
    {
      id: 'p3',
      name: 'Designer',
      avatar: 'https://i.pravatar.cc/100?img=20',
      isCurrentUser: false,
      isMuted: true,
      isDeafened: false,
      isSpeaking: false,
    },
    {
      id: 'p4',
      name: 'Meme_Lord',
      avatar: 'https://i.pravatar.cc/100?img=15',
      isCurrentUser: false,
      isMuted: false,
      isDeafened: false,
      isSpeaking: false,
    },
  ],
};

export const INITIAL_MESSAGES = CHANNEL_MESSAGES['c2'];

// Friends data
export const FRIENDS = [
  {
    id: 'f1',
    name: 'An',
    avatar: 'https://i.pravatar.cc/100?img=1',
    status: 'online',
    activity: 'Be brave, believe yourself',
  },
  {
    id: 'f2',
    name: 'David Joy',
    avatar: 'https://i.pravatar.cc/100?img=2',
    status: 'online',
    activity: 'Chiếc nơ xinh',
  },
  {
    id: 'f3',
    name: "Hadal's Secret",
    avatar: 'https://i.pravatar.cc/100?img=3',
    status: 'online',
    activity: 'ARK: Survival Evolved • studying',
  },
  {
    id: 'f4',
    name: 'Kagutsuchi Ata',
    avatar: 'https://i.pravatar.cc/100?img=4',
    status: 'online',
    activity: 'Honkai: Star Rail • Ý nghĩa cho sự tồn tại của tao là gì?',
  },
  {
    id: 'f5',
    name: 'MICHEAL SAM!',
    avatar: 'https://i.pravatar.cc/100?img=5',
    status: 'online',
    activity: 'A DI ĐÀ PHẬT',
  },
  {
    id: 'f6',
    name: 'Minn',
    avatar: 'https://i.pravatar.cc/100?img=6',
    status: 'online',
    activity: 'Hy vọng sau này gặp lại nhau, chúng ta đều là những người hạnh phúc',
  },
  {
    id: 'f7',
    name: 'Mugi',
    avatar: 'https://i.pravatar.cc/100?img=7',
    status: 'online',
    activity: 'Idle',
  },
  {
    id: 'f8',
    name: 'Nega Black Storm',
    avatar: 'https://i.pravatar.cc/100?img=8',
    status: 'online',
    activity: 'Online',
  },
  {
    id: 'f9',
    name: 'Niver',
    avatar: 'https://i.pravatar.cc/100?img=9',
    status: 'online',
    activity: 'League of Legends +1',
  },
  {
    id: 'f10',
    name: 'Shirona',
    avatar: 'https://i.pravatar.cc/100?img=10',
    status: 'online',
    activity: 'Online',
  },
  {
    id: 'f11',
    name: 'Thomas',
    avatar: 'https://i.pravatar.cc/100?img=11',
    status: 'online',
    activity: 'Trying to do better.',
  },
  {
    id: 'f12',
    name: 'Sad Bov',
    avatar: 'https://i.pravatar.cc/100?img=12',
    status: 'idle',
    activity: null,
  },
  {
    id: 'f13',
    name: 'Offline Friend',
    avatar: 'https://i.pravatar.cc/100?img=13',
    status: 'offline',
    activity: null,
  },
];

// Direct Messages
export const DIRECT_MESSAGES = [
  { id: 'dm1', name: 'Nir', avatar: 'https://i.pravatar.cc/100?img=14', unread: 0 },
  { id: 'dm2', name: 'Dừa đi lạc', avatar: 'https://i.pravatar.cc/100?img=15', unread: 0 },
  { id: 'dm3', name: 'Aiko-Himegimi', avatar: 'https://i.pravatar.cc/100?img=16', unread: 0 },
  { id: 'dm4', name: 'Nega Black Storm', avatar: 'https://i.pravatar.cc/100?img=8', unread: 0 },
  { id: 'dm5', name: 'A.U.S.T.I.N', avatar: 'https://i.pravatar.cc/100?img=17', unread: 0 },
  { id: 'dm6', name: 'Cô Bé Maid', avatar: 'https://i.pravatar.cc/100?img=18', unread: 0 },
  { id: 'dm7', name: 'Tôm Mi', avatar: 'https://i.pravatar.cc/100?img=19', unread: 0 },
  { id: 'dm8', name: 'Assistant Bot', avatar: 'https://i.pravatar.cc/100?img=20', unread: 1, isNew: true },
  { id: 'dm9', name: 'FreezeHost', avatar: 'https://i.pravatar.cc/100?img=21', unread: 0 },
];

