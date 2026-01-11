import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function MembersSidebar({ members = [] }) {
    const groupedMembers = React.useMemo(() => {
        if (!members || members.length === 0) return [];

        const online = members.filter(m => m.status === 'online');
        const offline = members.filter(m => m.status === 'offline');

        const groups = [];
        if (online.length > 0) groups.push({ title: `Online — ${online.length}`, data: online });
        if (offline.length > 0) groups.push({ title: `Offline — ${offline.length}`, data: offline });

        return groups;
    }, [members]);

    if (!members || members.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No members</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.list} showsVerticalScrollIndicator={true}>
                {groupedMembers.map((group, index) => (
                    <View key={index} style={styles.group}>
                        <Text style={styles.groupTitle}>{group.title}</Text>
                        {group.data.map((member) => (
                            <TouchableOpacity key={member.id} style={styles.memberItem}>
                                <View style={styles.avatarContainer}>
                                    <Image source={{ uri: member.avatar }} style={styles.avatar} />
                                    <View style={[styles.statusIndicator, styles[`status${member.status}`]]} />
                                </View>
                                <View style={styles.memberInfo}>
                                    <View style={styles.nameRow}>
                                        <Text style={[styles.memberName, { color: member.color || COLORS.TEXT_BRIGHT }]}>
                                            {member.name}
                                        </Text>
                                        {member.isBot && (
                                            <View style={styles.botTag}>
                                                {member.botTag === 'APP' && (
                                                    <MaterialCommunityIcons name="check" size={10} color={COLORS.WHITE} style={styles.botCheck} />
                                                )}
                                                <Text style={styles.botTagText}>{member.botTag || 'BOT'}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 240,
        backgroundColor: COLORS.SIDEBAR,
        borderLeftWidth: 1,
        borderLeftColor: COLORS.BORDER,
    },
    list: {
        flex: 1,
        padding: 16,
    },
    group: {
        marginBottom: 24,
    },
    groupTitle: {
        color: COLORS.TEXT_MUTED,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 8,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginBottom: 2,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: COLORS.SIDEBAR,
        backgroundColor: COLORS.TEXT_MUTED,
    },
    statusonline: {
        backgroundColor: COLORS.SUCCESS,
    },
    statusidle: {
        backgroundColor: '#faa61a',
    },
    statusdnd: {
        backgroundColor: COLORS.ERROR,
    },
    statusoffline: {
        backgroundColor: COLORS.TEXT_MUTED,
    },
    memberInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    memberName: {
        fontSize: 15,
        fontWeight: '500',
    },
    botTag: {
        backgroundColor: '#5865F2',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    botCheck: {
        marginRight: 0,
    },
    botTagText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: COLORS.TEXT_MUTED,
        fontSize: 14,
    },
});
