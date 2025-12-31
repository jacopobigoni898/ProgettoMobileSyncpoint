import { Request } from '../entities/Request';
import { RequestStatus } from '../entities/RequestsType';

// Questa interfaccia elenca TUTTE le operazioni che si possono fare sulle Richieste
export interface IRequestRepository {
  
  // 1. Ottenere la lista delle richieste (utile per il Riepilogo e il Calendario)
  // Il 'userId' è opzionale: se lo passo vedo solo le mie, se non lo passo (e sono admin) le vedo tutte
  getRequests(userId?: string): Promise<Request[]>;

  // 2. Creare una nuova richiesta (Ferie o Straordinari)
  // Restituisce 'void' (nulla) o la richiesta appena creata
  addRequest(request: Request): Promise<void>;

  // 3. Modificare lo stato (solo per Admin: Approvata/Rifiutata)
  updateRequestStatus(requestId: string, status: RequestStatus): Promise<void>;
  
  // 4. (Opzionale ma utile) Cancellare una richiesta se ho sbagliato
  deleteRequest(requestId: string): Promise<void>;
}