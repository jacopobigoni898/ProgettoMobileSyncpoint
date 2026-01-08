import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SmartCalendar } from '../components/SmartCalendar';
import { CustomDropdown } from '../components/DropDownMenuButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { RequestType } from '../../domain/entities/RequestsType';
import { BaseRequest } from '../../domain/entities/Request';
import { UserRole } from '../../domain/entities/User';
import { AuthStore } from '../../core/AuthStore';

export default function CalendarScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  // Stato
  // Di default impostiamo RequestType.HOLIDAY che useremo come "Assenze Generiche"
  const [selectedType, setSelectedType] = useState<RequestType | UserRole>(RequestType.HOLIDAY);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Gestione selezione date
  const handleRangeSelect = (start: string, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  // --- MODIFICA QUI: LE OPZIONI DEL FILTRO ---
  const typeOptions = [
    // Raggruppiamo Ferie e Malattia sotto "Assenze". 
    // Usiamo RequestType.HOLIDAY come valore 'tecnico' per avere i weekend bloccati in rosso.
    { label: 'Assenze', value: RequestType.HOLIDAY },
    
    // Gli straordinari rimangono separati perché hanno logiche diverse
    { label: 'Straordinari', value: RequestType.OVERTIME },

    // Opzione Admin (visibile solo se admin)
    ...(AuthStore.getLoggedUser()?.role === UserRole.ADMIN 
        ? [{ label: 'Panoramica Team (Admin)', value: UserRole.ADMIN }] 
        : []),
  ];

  const handleTypeSelect = (val: any) => {
    setSelectedType(val);
    // Reset date quando cambio tipo
    setStartDate(null);
    setEndDate(null);
  };

  const handleProceedToRequest = () => {
    if (!startDate) {
      Alert.alert('Attenzione', 'Seleziona le date sul calendario prima di procedere.');
      return;
    }

    // Navighiamo alla schermata del modulo.
    // NOTA: Passiamo le date, ma NON forziamo il tipo se è "Assenze".
    // Lasciamo che l'utente scelga "Ferie" o "Malattia" nel form successivo.
    navigation.navigate('AddRequest', {
      preselectedStartDate: startDate,
      preselectedEndDate: endDate,
      // Se è Straordinario lo pre-selezioniamo, altrimenti (Assenze) lasciamo default (Ferie)
      preselectedType: selectedType === RequestType.OVERTIME ? 'Straordinari' : 'Ferie'
    });
    
    // Reset opzionale
    setStartDate(null);
    setEndDate(null);
  };

  // Logica per dire al calendario cosa mostrare
  // Se l'utente seleziona "Assenze" (value=HOLIDAY), il calendario mostrerà i weekend rossi.
  const isRequestType = (v: any): v is RequestType => Object.values(RequestType).includes(v as RequestType);
  const calendarVisualType: RequestType = isRequestType(selectedType) 
    ? (selectedType as RequestType) 
    : RequestType.HOLIDAY;

  // Il bottone si abilita solo se ho date selezionate e non sono in modalità "Admin View" pura
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

          {/* Dropdown con la nuova voce "Assenze" */}
          <CustomDropdown
            label="Scegli il calendario da visualizzare"
            options={typeOptions}
            selectedValue={selectedType}
            onValueChange={handleTypeSelect}
          />

          <View style={styles.calendarWrapper}>
            <SmartCalendar
              requestType={calendarVisualType}
              startDate={startDate}
              endDate={endDate}
              onRangeSelect={handleRangeSelect}
            />
          </View>
          
          <View style={{ marginTop: 20 }}>
            <PrimaryButton
              title="Procedi con la richiesta" 
              onPress={handleProceedToRequest}
              disabled={!canSubmit} 
            />
          </View>
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