import { RequestStatus, RequestType } from './RequestsType';

// Base comune per l'app
interface BaseRequest {
  id: string;             // Normalizzato (sarà sempre stringa)
  userId: string;
  status: RequestStatus;
  note?: string;          // Swagger non ha note/motivazione, quindi sarà spesso vuoto
}

// Ferie
export interface HolidayRequest extends BaseRequest {
  type: RequestType.HOLIDAY;
  startDate: string;      // DateTime
  endDate: string;
}

// Malattia
export interface SickLeaveRequest extends BaseRequest {
  type: RequestType.SICK_LEAVE;
  startDate: string;      // DateOnly
  endDate: string;
  certificateId?: string;
}

// Straordinari
export interface OvertimeRequest extends BaseRequest {
  type: RequestType.OVERTIME;
  startDate: string;      // DateTime
  endDate: string;
}

export type Request = HolidayRequest | SickLeaveRequest | OvertimeRequest;