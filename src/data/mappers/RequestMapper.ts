import { HolidayRequest, SickLeaveRequest, OvertimeRequest } from '../../domain/entities/Request';
import { RequestStatus, RequestType } from '../../domain/entities/RequestsType';
import { RichiestaFerieDTO, RichiestaMalattiaDTO, RichiestaStraordinariDTO } from '../dtos/BackendDtos';

export class RequestMapper {

  // --- FERIE ---
  static fromFerieDto(dto: RichiestaFerieDTO): HolidayRequest {
    return {
      id: dto.id_richiesta.toString(), // Prendo id_richiesta
      userId: dto.id_utente.toString(),
      type: RequestType.HOLIDAY,
      status: mapStatus(dto.stato_approvazione),
      startDate: dto.data_inizio,
      endDate: dto.data_fine || dto.data_inizio, // Fallback se null
    };
  }

  // --- MALATTIA ---
  static fromMalattiaDto(dto: RichiestaMalattiaDTO): SickLeaveRequest {
    return {
      id: dto.id_malattia.toString(), // Prendo id_malattia
      userId: dto.id_utente.toString(), // Nota: id_utente dallo Swagger
      type: RequestType.SICK_LEAVE,
      status: mapStatus(dto.stato_approvazione),
      startDate: dto.data_inizio,
      endDate: dto.data_fine || dto.data_inizio,
      certificateId: dto.certificato
    };
  }

  // --- STRAORDINARI ---
  static fromStraordinariDto(dto: RichiestaStraordinariDTO): OvertimeRequest {
    return {
      id: dto.idStraordinari.toString(), // Prendo idStraordinari
      userId: dto.idutente.toString(),
      type: RequestType.OVERTIME,
      status: mapStatus(dto.statoApprovazione),
      startDate: dto.dataInizio,
      endDate: dto.dataFine || dto.dataInizio,
    };
  }
}

// Helper per lo stato (uguale a prima)
function mapStatus(status?: string): RequestStatus {
  if (!status) return RequestStatus.PENDING;
  const s = status.toLowerCase();
  if (s === 'validato' || s === 'approvata') return RequestStatus.APPROVED;
  if (s === 'annullato' || s === 'rifiutata') return RequestStatus.REJECTED;
  return RequestStatus.PENDING;
}