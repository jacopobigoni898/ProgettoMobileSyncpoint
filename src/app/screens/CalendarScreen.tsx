import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SmartCalendar } from '../components/SmartCalendar';
import { CustomDropdown } from '../components/DropDownMenuButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { RequestType } from '../../domain/entities/RequestsType';
import { UserRole } from '../../domain/entities/User';
import { AuthStore } from '../../core/AuthStore';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();

  // Stato
  const [selectedType, setSelectedType] = useState<RequestType | UserRole>(RequestType.HOLIDAY);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  // Gestisce gli eventi prendendo data di inizio e di fine selezionate dal utente
  const handleRangeSelect = (start: string, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };
  //costante che salva le opzioni disponibili nel dropdown
  const typeOptions = [
    { label: 'Ferie', value: RequestType.HOLIDAY },
    { label: 'Malattia', value: RequestType.SICK_LEAVE },
    { label: 'Straordinari', value: RequestType.OVERTIME },
    ...(AuthStore.getLoggedUser()?.role === UserRole.ADMIN ? [{ label: 'Panoramica generale admin', value: UserRole.ADMIN }] : []),
  ];
  // Gestisce la selezione del tipo di richiesta dal dropdown
  const handleTypeSelect = (val: RequestType | UserRole) => {
    setSelectedType(val as any);
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
  };

  // Helper: determina se il valore selezionato è un RequestType valido
  const isRequestType = (v: any): v is RequestType => Object.values(RequestType).includes(v as RequestType);

  // Tipo che passiamo al calendario (se è admin, usiamo il default FERIE)
  const calendarType: RequestType = isRequestType(selectedType) ? (selectedType as RequestType) : RequestType.HOLIDAY;

  // Abilita il submit solo se è selezionato un RequestType e una data
  const canSubmit = isRequestType(selectedType) && !!startDate;

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
              requestType={calendarType}
              startDate={startDate}
              endDate={endDate}
              onRangeSelect={handleRangeSelect}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <PrimaryButton
              title="INVIA RICHIESTA"
              onPress={handleSubmit}
              disabled={!canSubmit} // Disabilitato se non è selezionato un RequestType valido o manca la data
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