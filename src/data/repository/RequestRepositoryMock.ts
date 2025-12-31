import { IRequestRepository } from '../../domain/repository/IRequestRepository';
import { Request } from '../../domain/entities/Request';
import { RequestMapper } from '../mappers/RequestMapper';
import { RichiestaFerieDTO, RichiestaMalattiaDTO, RichiestaStraordinariDTO } from '../dtos/BackendDtos';

// 1. Dati finti FERIE (basati su Swagger)
const MOCK_FERIE: RichiestaFerieDTO[] = [
  { idRichiesta: 10, idUtente: 1, dataInizio: "2025-08-15T09:00:00", dataFine: "2025-08-20T18:00:00", statoApprovazione: "validato" }
];

// 2. Dati finti MALATTIA
const MOCK_MALATTIE: RichiestaMalattiaDTO[] = [
  { idmalattia: 55, idutente: 1, dataInizio: "2025-02-10", dataFine: "2025-02-12", statoApprovazione: "in attesa", certificato: "XYZ-123" }
];

// 3. Dati finti STRAORDINARI
const MOCK_STRAORDINARI: RichiestaStraordinariDTO[] = [
  { idStraordinari: 99, idutente: 1, dataInizio: "2025-03-01T18:00:00", dataFine: "2025-03-01T20:00:00", statoApprovazione: "validato" }
];

export class RequestRepositoryMock implements IRequestRepository {
  async getRequests(userId?: string): Promise<Request[]> {
    // Invece di usare una mappa inline, risolviamo i nomi tramite UserRepositoryMock
    const { UserRepositoryMock } = await import('./UserRepositoryMock');
    const userRepo = new UserRepositoryMock();

    // Mappiamo le 3 fonti diverse
    const ferie = MOCK_FERIE.map(d => RequestMapper.fromFerieDto(d));
    const malattie = MOCK_MALATTIE.map(d => RequestMapper.fromMalattiaDto(d));
    const straordinari = MOCK_STRAORDINARI.map(d => RequestMapper.fromStraordinariDto(d));

    // Uniamo tutto
    let all = [...ferie, ...malattie, ...straordinari];

    // Se è richiesto un userId, filtriamo prima per ridurre le chiamate
    if (userId) {
      all = all.filter(r => r.userId === userId);
    }

    // Troviamo gli id distinti e risolviamo i nomi in parallelo
    const uniqueIds = Array.from(new Set(all.map(r => r.userId)));
    const users = await Promise.all(uniqueIds.map(id => userRepo.getUserById(id)));
    const userMap = Object.fromEntries(users.filter(Boolean).map(u => [u!.id, u!]));

    // Aggiungiamo requesterName a ogni richiesta quando possibile
    all = all.map(r => ({
      ...r,
      requesterName: userMap[r.userId] ? `${userMap[r.userId].name} ${userMap[r.userId].surname}` : undefined
    }));

    // Simula latenza come prima
    return new Promise((resolve) => setTimeout(() => resolve(all), 400));
  }

  async addRequest(request: Request): Promise<void> { console.log("Add", request); }
  async updateRequestStatus(id: string, status: any): Promise<void> { console.log("Update", id, status); }
  async deleteRequest(id: string): Promise<void> { console.log("Delete", id); }
}