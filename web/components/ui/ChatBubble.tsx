import { BorderRadius, Colors, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/store/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChatBubbleProps {
    text: string;
    isSent: boolean;
    timestamp: string;
    isAI?: boolean;
}

export function ChatBubble({ text, isSent, timestamp, isAI }: ChatBubbleProps) {
    const { colors } = useTheme();
    return (
        <View style={[styles.container, isSent ? styles.sent : styles.received]}>
            <View style={[
                styles.bubble,
                isSent
                    ? [styles.sentBubble, { backgroundColor: colors.primary }]
                    : isAI
                        ? [styles.receivedBubble, { backgroundColor: 'rgba(108, 99, 255, 0.1)', borderWidth: 1, borderColor: 'rgba(108, 99, 255, 0.2)' }]
                        : [styles.receivedBubble, { backgroundColor: colors.surfaceAlt }]
            ]}>
                <Text style={[styles.text, { color: isSent ? '#fff' : isAI ? Colors.primaryLight : colors.text }]}>{text}</Text>
            </View>
            <Text style={[styles.time, { color: colors.textTertiary }]}>{timestamp}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: Spacing.md, maxWidth: '80%' },
    sent: { alignSelf: 'flex-end', alignItems: 'flex-end' },
    received: { alignSelf: 'flex-start', alignItems: 'flex-start' },
    bubble: { padding: Spacing.md, paddingHorizontal: Spacing.lg },
    sentBubble: { borderRadius: BorderRadius.xl, borderBottomRightRadius: Spacing.xs },
    receivedBubble: { borderRadius: BorderRadius.xl, borderBottomLeftRadius: Spacing.xs },
    text: { fontSize: FontSize.md, lineHeight: 22 },
    time: { fontSize: FontSize.xs, marginTop: Spacing.xs },
});
