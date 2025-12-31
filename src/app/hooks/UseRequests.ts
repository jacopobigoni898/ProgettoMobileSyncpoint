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

  // Stato del filtro: 'none' = nessun filtro selezionato (non mostrare niente),
  // 'sent' = richieste inviate, 'received' = richieste ricevute
  const [filterMode, setFilterMode] = useState<'none'|'sent' | 'received'>('none');

  // 3. FUNZIONE DI CARICAMENTO (Il cuore dell'hook)
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Se non è selezionato alcun filtro => non mostriamo richieste
      if (filterMode === 'none') {
        setRequests([]);
        setLoading(false);
        return;
      }

      // LOGICA BUSINESS:
      // - Se sono NON-admin -> vedo solo le mie richieste (l'unico filtro valido è 'sent')
      // - Se sono admin:
      //    * 'sent' => vedi le richieste inviate dall'admin (user.id)
      //    * 'received' => vedi le richieste degli altri (undefined ma poi filtrate)
      let userIdToFilter: string | undefined;
      if (!isAdmin) {
        // Non-admin può solo vedere le proprie richieste: forziamo 'sent'
        userIdToFilter = user.id;
      } else {
        userIdToFilter = filterMode === 'sent' ? user.id : undefined;
      }

      let data = await repository.getRequests(userIdToFilter);

      // Se admin e vuole vedere 'received', escludo le sue stesse richieste
      if (isAdmin && filterMode === 'received') {
        data = data.filter(r => r.userId !== user.id);
      }

      setRequests(data);
    } catch (err) {
      console.error("Errore durante il caricamento richieste:", err);
      setError("Impossibile caricare le richieste.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user.id, filterMode]);

  // 4. AZIONI ADMIN: Approva
  const approveRequest = async (requestId: string) => {
    if (!isAdmin) {
      alert("Non sei autorizzato a eseguire questa azione.");
      return;
    }
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
    if (!isAdmin) {
      alert("Non sei autorizzato a eseguire questa azione.");
      return;
    }
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
    filterMode,      // 'sent' | 'received'
    setFilterMode,   // cambia il filtro e ricarica automaticamente
    refresh: loadData, // Funzione per forzare l'aggiornamento (pull-to-refresh)
    approveRequest,  // Funzione approva
    rejectRequest    // Funzione rifiuta
  };
};