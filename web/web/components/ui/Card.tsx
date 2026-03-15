import { BorderRadius, Colors, Shadow, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'elevated' | 'flat';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
    return (
        <View style={[
            styles.card,
            variant === 'elevated' && Shadow.md,
            variant === 'flat' && styles.flat,
            variant === 'default' && Shadow.sm,
            style,
        ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
    },
    flat: {
        backgroundColor: Colors.surfaceAlt,
    },
});
