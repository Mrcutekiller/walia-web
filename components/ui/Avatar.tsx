import { Colors } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface AvatarProps {
    emoji: string;
    size?: number;
    online?: boolean;
    style?: ViewStyle;
}

export function Avatar({ emoji, size = 48, online, style }: AvatarProps) {
    const isImage = emoji && (emoji.startsWith('http') || emoji.startsWith('/') || emoji.startsWith('file://'));

    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
            {isImage ? (
                <Image source={{ uri: emoji }} style={{ width: size, height: size, borderRadius: size / 2 }} />
            ) : (
                <Text style={[styles.emoji, { fontSize: size * 0.5 }]}>{emoji}</Text>
            )}
            {online !== undefined && (
                <View style={[styles.indicator, online ? styles.online : styles.offline, { width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125 }]} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    emoji: {},
    indicator: { position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: Colors.surface },
    online: { backgroundColor: Colors.success },
    offline: { backgroundColor: Colors.textTertiary },
});
