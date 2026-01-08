import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { CustomDropdown } from '../components/DropDownMenuButton';
import { PrimaryButton } from '../components/PrimaryButton';

export default function AddRequestScreen({ route, navigation }: any) {
  
  // 1. RECUPERO I DATI DAL CALENDARIO
  const { preselectedStartDate, preselectedEndDate, preselectedType } = route.params || {};

  // 2. STATO DEL FORM
  const [type, setType] = useState<any>(preselectedType || 'Ferie');
  const [startDate, setStartDate] = useState<string>(preselectedStartDate || '');
  const [endDate, setEndDate] = useState<string>(preselectedEndDate || '');
  const [reason, setReason] = useState<string>(''); // Motivazione / Note

  // 3. LISTA TIPI DI ASSENZA (Aggiornata con i tuoi permessi)
  const requestOptions = [
    { label: 'Ferie', value: 'Ferie' },
    { label: 'Malattia', value: 'Malattia' },
    { label: 'Straordinari', value: 'Straordinari' },
    // Permessi specifici
    { label: 'Permesso Studio', value: 'Permesso Studio'},
    { label: 'Permesso Lutto', value: 'Permesso Lutto'},
    { label: 'Permesso L.104', value: 'Permesso L.104'},
    { label: 'Permesso Visita Medica' , value: 'Permesso Visita Medica'},
    { label: 'Congedo Genitori' , value: 'Congedo Genitori'},
    { label: 'Congedo Matrimonio', value: 'Congedo Matrimonio'},
  ];

  // 4. AGGIORNAMENTO DATI (Se l'utente torna indietro e cambia selezione)
  useEffect(() => {
    if (preselectedStartDate) setStartDate(preselectedStartDate);
    if (preselectedEndDate) setEndDate(preselectedEndDate);
    if (preselectedType) setType(preselectedType);
  }, [preselectedStartDate, preselectedEndDate, preselectedType]);

  // 5. INVIO
  const handleSubmit = () => {
    if (!startDate) {
        Alert.alert("Attenzione", "La data di inizio è obbligatoria.");
        return;
    }

    // Qui in futuro faremo lo switch per mappare sul DB:
    // Se è 'Ferie' -> Tabella Richiesta_Ferie
    // Se è 'Malattia' -> Tabella Richiesta_Malattia
    // Se è 'Permesso...' -> Tabella Richiesta_Permessi
    
    console.log("Invio richiesta:", { type, startDate, endDate, reason });
    
    Alert.alert(
        "Richiesta Inviata", 
        `La tua richiesta di "${type}" è stata inoltrata correttamente.`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.headerTitle}>Dettagli Richiesta</Text>
        <Text style={styles.subTitle}>
           Stai richiedendo un'assenza dal {startDate} {endDate ? `al ${endDate}` : ''}.
        </Text>

        {/* 1. SELEZIONE TIPO */}
        <Text style={styles.label}>Tipologia</Text>
        <View style={{ zIndex: 100, marginBottom: 15 }}> 
          <CustomDropdown 
            label="" // Lasciamo vuoto o mettiamo un titolo se vuoi
            options={requestOptions}
            selectedValue={type}
            onValueChange={(val) => setType(val)}
          />
        </View>

        {/* 2. DATE (Visualizzazione) */}
        <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Data Inizio</Text>
                <TextInput 
                    style={styles.inputDisabled} 
                    value={startDate}
                    editable={false} 
                />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.label}>Data Fine</Text>
                <TextInput 
                    style={styles.inputDisabled} 
                    value={endDate || startDate} 
                    editable={false}
                />
            </View>
        </View>

        {/* 3. MOTIVAZIONE / NOTE */}
        <Text style={styles.label}>Note o Motivazione</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Inserisci dettagli aggiuntivi..."
          multiline
          numberOfLines={4}
          value={reason}
          onChangeText={setReason}
        />

        {/* 4. BOTTONE */}
        <View style={styles.footer}>
          <PrimaryButton 
            title="CONFERMA RICHIESTA" 
            onPress={handleSubmit} 
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  inputDisabled: { // Stile diverso per i campi non modificabili
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F0F0F0', // Grigio leggero
    color: '#888',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
  },
});