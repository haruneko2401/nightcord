import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function MobileBottomNav({ activeTab, onTabSelect, avatar }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.tab}
                onPress={() => onTabSelect('home')}
            >
                <MaterialCommunityIcons
                    name="discord"
                    size={26}
                    color={activeTab === 'home' ? COLORS.WHITE : COLORS.TEXT_MUTED}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tab}
                onPress={() => onTabSelect('notifications')}
            >
                <MaterialCommunityIcons
                    name="bell"
                    size={26}
                    color={activeTab === 'notifications' ? COLORS.WHITE : COLORS.TEXT_MUTED}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tab}
                onPress={() => onTabSelect('you')}
            >
                <View style={[
                    styles.avatarContainer,
                    activeTab === 'you' && styles.avatarActive
                ]}>
                    <Image
                        source={{ uri: avatar || 'https://i.pravatar.cc/100?img=50' }}
                        style={styles.avatar}
                    />
                    <View style={styles.statusIndicator} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 56, // Standard bottom nav height
        backgroundColor: '#1E1F22', // Dark background like screenshot
        borderTopWidth: 1,
        borderTopColor: '#26272D',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 16 : 0, // Safe area padding
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    avatarContainer: {
        position: 'relative',
        padding: 2,
        borderRadius: 18,
    },
    avatarActive: {
        // backgroundColor: COLORS.ACCENT, // Optional ring effect
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3BA55C', // Online green
        borderWidth: 2,
        borderColor: '#1E1F22',
    }
});
