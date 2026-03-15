import { BorderRadius, Colors, FontSize, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';

interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: React.ReactNode;
    secureTextEntry?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    error?: string;
    style?: ViewStyle;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    inputStyle?: TextStyle;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function Input({
    label, placeholder, value, onChangeText, icon,
    secureTextEntry, multiline, numberOfLines, error,
    style, containerStyle, labelStyle, inputStyle, keyboardType, autoCapitalize,
}: InputProps) {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <View style={[styles.inputContainer, containerStyle, error && styles.inputError, multiline && styles.multiline]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[styles.input, multiline && styles.multilineInput, inputStyle]}
                    placeholder={placeholder}
                    placeholderTextColor={inputStyle?.color === '#fff' ? 'rgba(255,255,255,0.4)' : Colors.textTertiary}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: Spacing.lg },
    label: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xs + 2, fontWeight: '500', marginLeft: Spacing.xs },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
        borderWidth: 1, borderColor: Colors.border,
        paddingHorizontal: Spacing.lg,
    },
    inputError: { borderColor: Colors.error },
    multiline: { alignItems: 'flex-start', minHeight: 100 },
    iconContainer: { marginRight: Spacing.sm },
    input: { flex: 1, fontSize: FontSize.md, color: Colors.text, paddingVertical: Spacing.md + 2 },
    multilineInput: { paddingTop: Spacing.md, textAlignVertical: 'top' },
    error: { fontSize: FontSize.xs, color: Colors.error, marginTop: Spacing.xs, marginLeft: Spacing.xs },
});
