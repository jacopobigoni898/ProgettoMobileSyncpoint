import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SmartCalendar } from '../components/SmartCalendar';
import { CustomDropdown } from '../components/DropDownMenuButton';
import { PrimaryButton } from '../components/PrimaryButton'; // <--- IMPORTA IL NUOVO COMPONENTE
import { RequestType } from '../../domain/entities/RequestsType';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();

  // Stato
  const [selectedType, setSelectedType] = useState<RequestType>(RequestType.HOLIDAY);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleRangeSelect = (start: string, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const typeOptions = [
    { label: 'Ferie', value: RequestType.HOLIDAY },
    { label: 'Malattia', value: RequestType.SICK_LEAVE },
    { label: 'Straordinari', value: RequestType.OVERTIME },
  ];

  const handleTypeSelect = (val: RequestType) => {
    setSelectedType(val);
    setStartDate(null);
    setEndDate(null);
  };

  const handleSubmit = () => {
    // Validazione base
    if (!startDate) {
      Alert.alert('Attenzione', 'Seleziona almeno una data per la richiesta.');
      return;
    }

    console.log('Nuova richiesta:', { selectedType, startDate, endDate, notes });
    Alert.alert('Richiesta creata', `Richiesta di ${selectedType} inviata con successo!`);

    // Reset
    setSelectedType(RequestType.HOLIDAY);
    setStartDate(null);
    setEndDate(null);
    setNotes('');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.header}>Nuova Richiesta</Text>

        {/* Selettore tipo (dropdown esterno) */}
        <CustomDropdown
          label="Tipo di richiesta"
          options={typeOptions}
          selectedValue={selectedType}
          onValueChange={handleTypeSelect}
        />

        {/* Calendario */}
        <View style={styles.calendarWrapper}>
          <SmartCalendar
            requestType={selectedType}
            startDate={startDate}
            endDate={endDate}
            onRangeSelect={handleRangeSelect}
          />
        </View>
        <View style={{ marginTop: 20 }}>
            <PrimaryButton 
                title="INVIA RICHIESTA" 
                onPress={handleSubmit} 
                disabled={!startDate} // Il bottone è spento se non hai scelto una data!
            />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  
  // Selettore tipo — ora usa il componente esterno CustomDropdown
  typeSelectorContainer: { marginBottom: 20 },

  // Stili Calendario e Input
  calendarWrapper: { 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  label: { marginBottom: 8, fontWeight: '600', color: '#333' },
  notesInput: { 
    minHeight: 100, 
    backgroundColor: '#FAFAFA', 
    borderColor: '#E5E7EB', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 12, 
    textAlignVertical: 'top',
    fontSize: 16
  },
  // Nota: ho rimosso gli stili "button" e "buttonText" perché ora sono nel componente PrimaryButton!
});