import { useState, useEffect, useCallback } from 'react';

// Importiamo le dipendenze dell'architettura
import { Request } from '../../domain/entities/Request';
import { RequestStatus } from '../../domain/entities/RequestsType';
import { RequestRepositoryMock } from '../../data/repository/RequestRepositoryMock';
import { AuthStore } from '../../core/AuthStore';

export const useRequests = () => {
  // 1. STATO: Qui conserviamo i dati che la UI deve mostrare
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. DIPENDENZE: Istanziamo il repository e controlliamo l'utente
  // (In un'app reale useremmo la Dependency Injection, ma qui va bene così)
  const repository = new RequestRepositoryMock();
  const user = AuthStore.getLoggedUser();
  const isAdmin = AuthStore.isAdmin();

  // 3. FUNZIONE DI CARICAMENTO (Il cuore dell'hook)
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // LOGICA BUSINESS:
      // Se sono Admin -> Voglio vedere TUTTE le richieste (passo undefined)
      // Se sono User  -> Voglio vedere solo le MIE (passo il mio ID)
      const userIdToFilter = isAdmin ? undefined : user.id;
      
      const data = await repository.getRequests(userIdToFilter);
      setRequests(data);
    } catch (err) {
      console.error("Errore durante il caricamento richieste:", err);
      setError("Impossibile caricare le richieste.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user.id]);

  // 4. AZIONI ADMIN: Approva
  const approveRequest = async (requestId: string) => {
    try {
      setLoading(true); // Mostriamo il caricamento mentre salva
      await repository.updateRequestStatus(requestId, RequestStatus.APPROVED);
      await loadData(); // Ricarichiamo la lista per vedere il cambiamento
    } catch (err) {
      console.error("Errore approvazione:", err);
      alert("Errore durante l'approvazione");
      setLoading(false);
    }
  };

  // 5. AZIONI ADMIN: Rifiuta
  const rejectRequest = async (requestId: string) => {
    try {
      setLoading(true);
      await repository.updateRequestStatus(requestId, RequestStatus.REJECTED);
      await loadData(); // Ricarichiamo la lista
    } catch (err) {
      console.error("Errore rifiuto:", err);
      alert("Errore durante il rifiuto");
      setLoading(false);
    }
  };

  // 6. EFFETTO INIZIALE: Carica i dati appena la pagina si apre
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 7. INTERFACCIA PUBBLICA: Cosa restituiamo alla schermata (UI)
  return {
    requests,        // La lista dati
    loading,         // Sta caricando?
    error,           // Ci sono errori?
    isAdmin,         // Sono admin?
    refresh: loadData, // Funzione per forzare l'aggiornamento (pull-to-refresh)
    approveRequest,  // Funzione approva
    rejectRequest    // Funzione rifiuta
  };
};