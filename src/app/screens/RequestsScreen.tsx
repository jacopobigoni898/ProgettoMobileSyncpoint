import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
// 1. Rimuoviamo SafeAreaView e importiamo useSafeAreaInsets per gestire il padding manualmente
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// 2. Importiamo il gradiente
import { LinearGradient } from 'expo-linear-gradient';

import { useRequests } from '../hooks/UseRequests';
import { RequestCard } from '../components/RequestCard';
import { Request } from '../../domain/entities/Request';
import { RequestStatus, RequestType } from '../../domain/entities/RequestsType';

export default function RequestsScreen() {
  
  const { requests, loading, isAdmin, refresh, approveRequest, rejectRequest } = useRequests();
  // 3. Hook per ottenere l'altezza della status bar (tacca)
  const insets = useSafeAreaInsets();

  // --- HELPERS DI FORMATTAZIONE ---
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
  };

  const getDuration = (start: string, end: string) => {
    if (!start || !end) return undefined;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.round(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours} ore` : undefined;
  };

  // --- RENDERIZZAZIONE DELLA LISTA ---
  const renderItem = ({ item }: { item: Request }) => {
    const duration = item.type === RequestType.OVERTIME 
      ? getDuration(item.startDate, item.endDate) 
      : undefined;

    return (
      <RequestCard
        type={item.type}
        status={item.status}
        dateString={formatDate(item.startDate)}
        durationString={duration}
        isAdmin={isAdmin}
        requesterName={item.requesterName}
        onApprove={() => approveRequest(item.id)}
        onReject={() => rejectRequest(item.id)}
      />
    );
  };

  return (
    // 4. Usiamo una View normale come contenitore (non SafeAreaView)
    <View style={styles.container}>
      
      {/* 5. HEADER CON GRADIENTE */}
      <LinearGradient
        // Colori: Azzurrino chiaro che sfuma verso il bianco
        colors={['#F49717', '#FFFFFF']}
        style={[styles.gradientHeader, { paddingTop: insets.top }]} // Padding dinamico per la status bar
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            {isAdmin ? "Le mie Richieste" : "Le mie Richieste"}
          </Text>
          <TouchableOpacity onPress={refresh}>
            <Text style={{ color: '#007AFF', fontWeight: '600' }}>Aggiorna</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

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
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nessuna richiesta trovata.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  // --- STILI AGGIORNATI PER HEADER ---
  gradientHeader: {
    flex:0.5,
    paddingBottom: 15,          // Spazio sotto il titolo
    borderBottomLeftRadius: 20, // (Opzionale) Arrotonda il fondo del gradiente
    borderBottomRightRadius: 20,
    elevation: 4,               // Leggera ombra su Android
    shadowColor: '#000',        // Ombra su iOS
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,             // Un po' di aria sopra il titolo (sotto la status bar)
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000', // Nero pieno per contrasto
  },
  // -----------------------------------
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20, // Spazio tra il gradiente e la prima card
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
});