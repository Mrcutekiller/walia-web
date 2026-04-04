import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, style, textStyle, icon }: ButtonProps) {
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        disabled && styles.disabled,
        style,
    ];
    const textStyles = [
        styles.text,
        styles[`text_${variant}`],
        styles[`textSize_${size}`],
        textStyle,
    ];

    return (
        <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#fff' : Colors.primary} />
            ) : (
                <>
                    {icon}
                    <Text style={textStyles}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: Spacing.sm,
        borderRadius: BorderRadius.lg, // 16px (rounded-2xl)
    },
    primary: { 
        backgroundColor: Colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    secondary: { 
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    outline: { 
        backgroundColor: 'transparent', 
        borderWidth: 1.5, 
        borderColor: Colors.primary 
    },
    ghost: { 
        backgroundColor: 'transparent' 
    },
    size_sm: { 
        paddingVertical: 10, 
        paddingHorizontal: 16 
    },
    size_md: { 
        paddingVertical: 14, 
        paddingHorizontal: 24 
    },
    size_lg: { 
        paddingVertical: 18, 
        paddingHorizontal: 32 // ~px-8
    },
    disabled: { 
        opacity: 0.5 
    },
    text: { 
        fontWeight: FontWeight.bold, // font-bold
        letterSpacing: -0.2,
    },
    text_primary: { 
        color: Colors.textInverse, 
        fontSize: FontSize.md 
    },
    text_secondary: { 
        color: Colors.primary, 
        fontSize: FontSize.md 
    },
    text_outline: { 
        color: Colors.primary, 
        fontSize: FontSize.md 
    },
    text_ghost: { 
        color: Colors.primary, 
        fontSize: FontSize.md 
    },
    textSize_sm: { fontSize: FontSize.sm },
    textSize_md: { fontSize: FontSize.md },
    textSize_lg: { fontSize: FontSize.lg + 1 },
});
