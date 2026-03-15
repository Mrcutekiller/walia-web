import { BorderRadius, Colors, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ToolCardProps {
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: () => void;
}

export function ToolCard({ title, description, icon, color, onPress }: ToolCardProps) {
    return (
        <TouchableOpacity style={[styles.card, Shadow.md]} onPress={onPress} activeOpacity={0.85}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={28} color={color} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
        padding: Spacing.xl, width: '47%', marginBottom: Spacing.lg,
    },
    iconContainer: {
        width: 52, height: 52, borderRadius: BorderRadius.lg,
        alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
    },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.xs },
    description: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
});
