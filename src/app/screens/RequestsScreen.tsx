import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Per gestire il notch dell'iPhone

// ARCHITETTURA:
import { useRequests } from '../hooks/UseRequests';      // 1. LOGICA
import { RequestCard } from '../components/RequestCard'; // 2. ESTETICA
import { Request } from '../../domain/entities/Request';
import { RequestStatus, RequestType } from '../../domain/entities/RequestsType';

export default function RequestsScreen() {
  
  // ESTRAIAMO LA LOGICA DALL'HOOK
  const { requests, loading, isAdmin, refresh, approveRequest, rejectRequest } = useRequests();

  // --- HELPERS DI FORMATTAZIONE ---
  // Trasforma "2025-09-03T..." in "3 settembre"
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
  };

  // Calcola "3 ore" per gli straordinari
  const getDuration = (start: string, end: string) => {
    if (!start || !end) return undefined;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.round(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours} ore` : undefined;
  };

  // --- RENDERIZZAZIONE DELLA LISTA ---
  const renderItem = ({ item }: { item: Request }) => {
    
    // Calcoliamo la durata solo se serve
    const duration = item.type === RequestType.OVERTIME 
      ? getDuration(item.startDate, item.endDate) 
      : undefined;

    return (
      <View>
        {/* LA CARD VISIVA */}
        <RequestCard
          type={item.type}
          status={item.status}
          dateString={formatDate(item.startDate)}
          durationString={duration}/>

        {/* AZIONI ADMIN (Appaiono SOTTO la card solo se necessario) */}
        {isAdmin && item.status === RequestStatus.PENDING && (
          <View style={styles.adminActionContainer}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.rejectBtn]} 
              onPress={() => rejectRequest(item.id)}
            >
              <Text style={styles.actionText}>Rifiuta</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, styles.approveBtn]} 
              onPress={() => approveRequest(item.id)}
            >
              <Text style={styles.actionText}>Approva</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {isAdmin ? "Dashboard Richieste" : "Le mie Richieste"}
        </Text>
        <TouchableOpacity onPress={refresh}>
          <Text style={{ color: '#007AFF' }}>Aggiorna</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENUTO */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          // Messaggio se la lista è vuota
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nessuna richiesta trovata.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Sfondo bianco pulito
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
  // Stili per i bottoni Admin
  adminActionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20, // Spazio extra sotto le azioni
    marginTop: -8,    // Tiriamo su per avvicinarlo alla card
    gap: 10,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  approveBtn: { backgroundColor: '#4CD964' },
  rejectBtn: { backgroundColor: '#FF3B30' },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13
  }
});