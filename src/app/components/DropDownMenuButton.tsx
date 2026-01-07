import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Option {
  label: string;
  value: any;
}

interface CustomDropdownProps {
  label: string;             // Es. "Tipo di richiesta"
  options: Option[];         // La lista (Ferie, Malattia...)
  selectedValue: any;        // Il valore attuale
  onValueChange: (val: any) => void; // Funzione quando cambi
}

export const CustomDropdown = ({ label, options, selectedValue, onValueChange }: CustomDropdownProps) => {
  const [visible, setVisible] = useState(false);

  // Trova l'etichetta dell'opzione selezionata per mostrarla nel bottone
  const selectedLabel = options.find(o => o.value === selectedValue)?.label || "Seleziona...";

  const handleSelect = (val: any) => {
    onValueChange(val);
    setVisible(false); // Chiude la tendina
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* IL BOTTONE CHE APRE IL MENU */}
      <TouchableOpacity style={styles.dropdownBtn} onPress={() => setVisible(true)}>
        <Text style={styles.selectedText}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={20} color="#333" />
      </TouchableOpacity>

      {/* LA TENDINA (MODALE) */}
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleziona {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.optionItem, 
                    item.value === selectedValue && styles.optionSelected
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[
                    styles.optionText,
                    item.value === selectedValue && styles.optionTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {item.value === selectedValue && (
                    <Ionicons name="checkmark" size={20} color="#F59F28" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  // Stili Modale
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Sfondo scuro semitrasparente
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '50%', // Non occupa tutto lo schermo
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionSelected: {
    backgroundColor: '#FFF8E1', // Sfondo leggero se selezionato
    marginHorizontal: -20,      // Estende lo sfondo ai bordi
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: '#F59F28',
  }
});

// For compatibility: default export
export default CustomDropdown;