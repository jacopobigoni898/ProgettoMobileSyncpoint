import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { CustomDropdown } from '../components/DropDownMenuButton';
import { PrimaryButton } from '../components/PrimaryButton'; // <--- Importiamo il tuo bottone

export default function AddRequestScreen({ route, navigation }: any) {
  
  // 1. RECUPERO I DATI DAL CALENDARIO
  const { preselectedStartDate, preselectedEndDate, preselectedType } = route.params || {};

  // 2. STATO DEL FORM
  const [type, setType] = useState<any>(preselectedType || 'Ferie');
  const [startDate, setStartDate] = useState<string>(preselectedStartDate || '');
  const [endDate, setEndDate] = useState<string>(preselectedEndDate || '');
  const [certificate, setCertificate] = useState<any>(null);

  const requestOptions = [
    { label: 'Ferie', value: 'Ferie' },
    { label: 'Malattia', value: 'Malattia' },
    { label: 'Straordinari', value: 'Straordinari' },
    { label: 'Permesso Studio', value: 'Permesso Studio'},
    { label: 'Permesso Lutto', value: 'Permesso Lutto'},
    { label: 'Permesso L.104', value: 'Permesso L.104'},
    { label: 'Permesso Visita Medica' , value: 'Permesso Visita Medica'},
    { label: 'Congedo Genitori' , value: 'Congedo Genitori'},
    { label: 'Congedo Matrimonio', value: 'Congedo Matrimonio'},
  ];

  useEffect(() => {
    if (preselectedStartDate) setStartDate(preselectedStartDate);
    if (preselectedEndDate) setEndDate(preselectedEndDate);
    if (preselectedType) setType(preselectedType);
  }, [preselectedStartDate, preselectedEndDate, preselectedType]);

  // Funzione selezione PDF
  const pickCertificate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true
      });

      if (result.assets && result.assets.length > 0) {
        setCertificate(result.assets[0]);
      }
    } catch (err) {
      console.log("Selezione annullata", err);
    }
  };

  const handleSubmit = () => {
    // Validazioni
    if (!startDate) {
        Alert.alert("Attenzione", "La data di inizio è obbligatoria.");
        return;
    }
    if (type === 'Malattia' && !certificate) {
        Alert.alert("Certificato mancante", "Per la malattia è obbligatorio caricare il PDF.");
        return;
    }

   let dataFinaleEffettiva = endDate; // Copia il valore

    if (!dataFinaleEffettiva) {
    dataFinaleEffettiva = startDate; // Se era vuoto, mettici la data inizio
    }
    const payload = { 
        type, 
        startDate, 
        endDate: dataFinaleEffettiva,
        certificate: certificate ? certificate.name : null 
    };
    console.log("Dati da inviare:", payload);

  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.headerTitle}>Dettagli Richiesta</Text>
        <Text style={styles.subTitle}>
           Compila i dettagli per la richiesta di assenza.
        </Text>

        {/* TIPOLOGIA */}
        <Text style={styles.label}>Tipologia</Text>
        <View style={{ zIndex: 100, marginBottom: 15 }}> 
          <CustomDropdown 
            label="" 
            options={requestOptions}
            selectedValue={type}
            onValueChange={(val) => {
                setType(val);
                if (val !== 'Malattia') setCertificate(null);
            }}
          />
        </View>

        {/* DATE */}
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

        {/* UPLOAD (Solo per Malattia) */}
        {type === 'Malattia' && (
            <View style={styles.uploadSection}>
                <Text style={styles.label}>Certificato Medico (PDF) *</Text>
                <TouchableOpacity style={styles.uploadBtn} onPress={pickCertificate}>
                    <Ionicons 
                        name={certificate ? "document-text" : "cloud-upload-outline"} 
                        size={24} 
                        color={certificate ? "#F59F28" : "#666"} 
                    />
                    <Text style={[styles.uploadText, certificate && styles.uploadTextSelected]}>
                        {certificate ? certificate.name : "Tocca per caricare PDF"}
                    </Text>
                    {certificate && <Ionicons name="checkmark-circle" size={20} color="green" style={{marginLeft:'auto'}}/>}
                </TouchableOpacity>
            </View>
        )}

        {/* 4. BOTTONE "PRIMARY" */}
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
  inputDisabled: { 
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F0F0F0',
    color: '#888',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  footer: {
    marginTop: 40,
    marginBottom: 30,
  },
  uploadSection: {
    marginTop: 15,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59F28',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFF8E1',
  },
  uploadText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  uploadTextSelected: {
    color: '#333',
    fontWeight: '600',
  }
});