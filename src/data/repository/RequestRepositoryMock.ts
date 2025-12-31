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
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mappiamo le 3 fonti diverse
        const ferie = MOCK_FERIE.map(d => RequestMapper.fromFerieDto(d));
        const malattie = MOCK_MALATTIE.map(d => RequestMapper.fromMalattiaDto(d));
        const straordinari = MOCK_STRAORDINARI.map(d => RequestMapper.fromStraordinariDto(d));

        // Uniamo tutto
        let all = [...ferie, ...malattie, ...straordinari];

        if (userId) {
          all = all.filter(r => r.userId === userId);
        }
        resolve(all);
      }, 500);
    });
  }

  async addRequest(request: Request): Promise<void> { console.log("Add", request); }
  async updateRequestStatus(id: string, status: any): Promise<void> { console.log("Update", id, status); }
  async deleteRequest(id: string): Promise<void> { console.log("Delete", id); }
}