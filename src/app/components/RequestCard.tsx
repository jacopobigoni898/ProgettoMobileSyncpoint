import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RequestStatus, RequestType } from '../../domain/entities/RequestsType';

interface RequestCardProps {
  type: RequestType;         // Per decidere titolo e colore cerchio
  status: RequestStatus;     // Per decidere colore e testo badge
  dateString: string;        // Es. "3 settembre"
  durationString?: string;   // Es. "3 ore" (opzionale, solo per straordinari)
}

export const RequestCard = ({ type, status, dateString, durationString }: RequestCardProps) => {

  // 1. Logica Colori: Mappiamo i tipi ai colori (come nell'immagine)
  const getTypeColor = (t: RequestType) => {
    switch (t) {
      case RequestType.OVERTIME: return '#EA00FF';   // MAGENTA (come foto)
      case RequestType.HOLIDAY: return '#F4FF21';    // Giallo
      case RequestType.SICK_LEAVE: return '#FF3B30'; // Rosso
      default: return '#8E8E93';                     // Grigio
    }
  };

  // 2. Logica Badge: Colore sfondo e testo in base allo stato
  const getBadgeStyle = (s: RequestStatus) => {
    switch (s) {
      case RequestStatus.PENDING: 
        return { bg: '#F59F28', text: 'In attesa', textColor: '#000' }; // ARANCIO (come foto)
      case RequestStatus.APPROVED: 
        return { bg: '#168400', text: 'Approvato', textColor: '#FFF' }; // Verde
      case RequestStatus.REJECTED: 
        return { bg: '#FF0000', text: 'Rifiutato', textColor: '#FFF' }; // Rosso
      default: 
        return { bg: '#CCC', text: s, textColor: '#000' };
    }
  };

  const badgeInfo = getBadgeStyle(status);
  const typeColor = getTypeColor(type);

  // Formattiamo il titolo (Prima lettera maiuscola)
  const title = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <View style={styles.cardContainer}>
      
      {/* SEZIONE SINISTRA: Icona e Testi */}
      <View style={styles.leftSection}>
        {/* Il Cerchio Colorato */}
        <View style={[styles.circleIcon, { backgroundColor: typeColor }]} />
        
        {/* Testi */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {dateString}{durationString ? `, ${durationString}` : ''}
          </Text>
        </View>
      </View>

      {/* SEZIONE DESTRA: Badge Stato */}
      <View style={[styles.badge, { backgroundColor: badgeInfo.bg }]}>
        <Text style={[styles.badgeText, { color: badgeInfo.textColor }]}>
          {badgeInfo.text}
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#EAEAEA', // Grigio chiaro sfondo
    borderRadius: 20,           // Angoli molto arrotondati
    padding: 16,
    flexDirection: 'row',       // Allinea orizzontalmente SX e DX
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    
    // Ombreggiatura leggera (Shadow iOS & Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Occupa tutto lo spazio disponibile verso sinistra
  },
  circleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21, // Perfettamente rotondo
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#555', // Grigio scuro per il testo secondario
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  }
});