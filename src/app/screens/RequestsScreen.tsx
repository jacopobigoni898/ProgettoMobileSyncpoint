import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
// 1. Rimuoviamo SafeAreaView e importiamo useSafeAreaInsets per gestire il padding manualmente
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// 2. Importiamo il gradiente
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useRequests } from '../hooks/UseRequests';
import { RequestCard } from '../components/RequestCard';
import { Request } from '../../domain/entities/Request';
import { RequestType } from '../../domain/entities/RequestsType';
import { AuthStore } from '../../core/AuthStore';

export default function RequestsScreen() {
  
  const { requests, loading, isAdmin, refresh, approveRequest, rejectRequest, filterMode, setFilterMode } = useRequests();
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

    const currentUser = AuthStore.getLoggedUser();

    // Definiamo per ogni richiesta se è 'inviata' (item.userId === mio id)
    // o 'ricevuta' (se io sono admin e item.userId !== mio id)
    const isSent = item.userId === currentUser.id;
    const isReceived = isAdmin && item.userId !== currentUser.id;

    return (
      <RequestCard
        type={item.type}
        status={item.status}
        dateString={formatDate(item.startDate)}
        durationString={duration}
        isAdmin={isAdmin}
        requesterName={item.requesterName}
        // Mostra le azioni solo quando la richiesta è 'ricevuta' dall'admin
        showActions={isReceived && filterMode === 'received'}
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

      {/* BODY: contenitore flessibile che contiene filtri + area contenuti */}
      <View style={styles.bodyContainer}>
        {/* FILTRI: due pulsanti in stile pill (come da mock) */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterBtn, filterMode === 'sent' && styles.filterActive]}
            onPress={() => setFilterMode(filterMode === 'sent' ? 'none' : 'sent')}
          >
            <Text style={styles.filterText}>Richieste Inviate</Text>
            <Ionicons name="chevron-down" size={18} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              filterMode === 'received' && styles.filterActive,
              !isAdmin && styles.filterDisabled
            ]}
            onPress={() => isAdmin ? setFilterMode(filterMode === 'received' ? 'none' : 'received') : undefined}
            disabled={!isAdmin}
          >
            <Text style={styles.filterText}>Richieste ricevute</Text>
            <Ionicons name="chevron-down" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* CONTENUTO: qui la lista prende tutto lo spazio rimanente */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          filterMode === 'none' ? (
            // Nessun filtro selezionato: mostriamo spazio vuoto (come da mock)
            <View style={styles.emptyPlaceholder} />
          ) : (
            <FlatList
              style={{ flex: 1 }}
              data={requests}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nessuna richiesta trovata.</Text>
              }
            />
          )
        )}
      </View>
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
    marginBottom: 40,
    paddingBottom: 18,          // Spazio sotto il titolo
    minHeight: 120,
    borderBottomLeftRadius: 20, // (Opzionale) Arrotonda il fondo del gradiente
    borderBottomRightRadius: 20,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000', // Nero pieno per contrasto
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginTop: -20,
  },
  filterBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
    width: '100%'
  },
  filterText: {
    fontSize: 16,
    color: '#000',
  },
  filterActive: {
    borderWidth: 1,
    borderColor: '#F59F28',
  },
  filterDisabled: {
    opacity: 0.6,
  },
  // -----------------------------------
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  listContent: {
    paddingTop: 10, // Spazio tra il gradiente e la prima card
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPlaceholder: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
});