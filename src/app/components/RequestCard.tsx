import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // Aggiungi TouchableOpacity
import { RequestStatus, RequestType } from '../../domain/entities/RequestsType';

interface RequestCardProps {
  type: RequestType;
  status: RequestStatus;
  dateString: string;
  durationString?: string;
  // --- NUOVE PROPS ---
  isAdmin?: boolean;             // Opzionale, default false
  onApprove?: () => void;        // Funzione da eseguire all'approvazione
  onReject?: () => void;         // Funzione da eseguire al rifiuto
  requesterName?: string;        // Nome della persona che ha inviato la richiesta
  // Se true, mostra i pulsanti di azione (approva/rifiuta). Usato per distinguere 'sent' vs 'received'.
  showActions?: boolean;
}

export const RequestCard = ({ 
  type, 
  status, 
  dateString, 
  durationString, 
  isAdmin = false, // Valore di default
  onApprove, 
  onReject, 
  requesterName,
  showActions = false,
}: RequestCardProps) => {

  // ... (Tieni le funzioni getTypeColor e getBadgeStyle come prima) ...
  const getTypeColor = (t: RequestType) => {
    switch (t) {
      case RequestType.OVERTIME: return '#EA00FF';
      case RequestType.HOLIDAY: return '#F4FF21';
      case RequestType.SICK_LEAVE: return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getBadgeStyle = (s: RequestStatus) => {
    switch (s) {
      case RequestStatus.PENDING: 
        return { bg: '#F59F28', text: 'In attesa', textColor: '#000' };
      case RequestStatus.APPROVED: 
        return { bg: '#168400', text: 'Approvato', textColor: '#FFF' };
      case RequestStatus.REJECTED: 
        return { bg: '#FF0000', text: 'Rifiutato', textColor: '#FFF' };
      default: 
        return { bg: '#CCC', text: s, textColor: '#000' };
    }
  };

  const badgeInfo = getBadgeStyle(status);
  const typeColor = getTypeColor(type);
  const title = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    // CAMBIAMENTO 1: Il contenitore principale ora contiene tutto verticalmente
    <View style={styles.cardContainer}>
      
      {/* CAMBIAMENTO 2: Avvolgiamo il contenuto originale in una 'row' per mantenerlo orizzontale */}
      <View style={styles.topRow}>
        {/* SEZIONE SINISTRA */}
        <View style={styles.leftSection}>
          <View style={[styles.circleIcon, { backgroundColor: typeColor }]} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              {dateString}{durationString ? `, ${durationString}` : ''}
            </Text>
            {requesterName ? (
              <Text style={styles.requester}>{requesterName}</Text>
            ) : null}
          </View>
        </View>

        {/* SEZIONE DESTRA: Badge */}
        <View style={[styles.badge, { backgroundColor: badgeInfo.bg }]}>
          <Text style={[styles.badgeText, { color: badgeInfo.textColor }]}>
            {badgeInfo.text}
          </Text>
        </View>
      </View>

      {/* CAMBIAMENTO 3: Sezione Admin inserita qui sotto */}
      {showActions && status === RequestStatus.PENDING && (
        <View style={styles.adminActionContainer}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.rejectBtn]} 
            onPress={onReject} // Usiamo la prop
          >
            <Text style={styles.actionText}>Rifiuta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, styles.approveBtn]} 
            onPress={onApprove} // Usiamo la prop
          >
            <Text style={styles.actionText}>Approva</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    // Rimuoviamo flexDirection: 'row' da qui perché ora è un contenitore verticale
    // Rimuoviamo alignItems e justifyContent da qui
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  // Nuova classe per la parte superiore della card
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    color: '#555',
  },
  requester: {
    fontSize: 13,
    color: '#333',
    marginTop: 4,
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
  },
  // --- STILI ADMIN SPOSTATI QUI ---
  adminActionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,    // Spazio tra la riga sopra e i bottoni
    gap: 10,
    borderTopWidth: 1, // Opzionale: una linetta per separare
    borderTopColor: '#D1D1D6',
    paddingTop: 10,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  approveBtn: { backgroundColor: '#168400' }, // Un verde più "iOS"
  rejectBtn: { backgroundColor: '#FF3B30' },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  }
});