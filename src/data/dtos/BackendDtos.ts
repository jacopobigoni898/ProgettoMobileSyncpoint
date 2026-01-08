// src/data/dtos/BackendDtos.ts

// Esempio per Richiesta_Ferie
export interface RichiestaFerieDTO {
  id_richiesta: number;
  id_utente: number;
  data_inizio: string; // I DB mandano date come stringhe ISO
  data_fine: string;
  stato_approvazione: string; // 'non validato', 'validato', etc.
}

// Esempio per Richiesta_Malattia
export interface RichiestaMalattiaDTO {
  id_malattia: number;
  id_utente: number;
  data_inizio: string;
  data_fine: string;
  stato_approvazione: string;
  certificato: string; // Nome del file
}

// 3. STRAORDINARI (da Swagger: RichiestaStraordinariDTO)
export interface RichiestaStraordinariDTO {
  idStraordinari: number;    //
  idutente: number;
  dataInizio: string;        // format: date-time
  dataFine?: string;         // Nota: nel PDF gli straordinari hanno ore, qui hanno dataFine. Useremo questa.
  statoApprovazione?: string;
}