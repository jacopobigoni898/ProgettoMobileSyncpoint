import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;      // Opzionale: per disabilitarlo
  isLoading?: boolean;     // Opzionale: per mostrare la rotellina mentre carica
  style?: ViewStyle;       // Opzionale: se vuoi aggiungere margini extra da fuori
}

export const PrimaryButton = ({ title, onPress, disabled = false, isLoading = false, style }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7} // Effetto tocco
      style={[
        styles.container,
        disabled && styles.disabled, // Se disabilitato, applica stile grigio
        style
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F59F28', // Colore Brand Syncpoint
    paddingVertical: 16,        // Area cliccabile comoda
    borderRadius: 12,           // Arrotondamento moderno
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,               // Ombra Android
    shadowColor: '#000',        // Ombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  disabled: {
    backgroundColor: '#A0A0A0', // Grigio spento quando non attivo
    elevation: 0,
  }
});