import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SmartCalendar } from '../components/SmartCalendar';
import { CustomDropdown } from '../components/DropDownMenuButton';
import { PrimaryButton } from '../components/PrimaryButton';
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#F49717', '#FFFFFF']}
        style={[styles.gradientHeader, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Calendario</Text>
        </View>
      </LinearGradient>

      <View style={styles.bodyContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  
  // Stili Header con gradiente
  gradientHeader: {
    marginBottom: 40,
    paddingBottom: 18,
    minHeight: 120,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000'
  },

  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Stili Calendario
  calendarWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  // Nota: ho rimosso gli stili "button" e "buttonText" perché ora sono nel componente PrimaryButton!
});