// src/data/dtos/BackendDtos.ts

// 1. FERIE (da Swagger: RichiestaFerieDTO)
export interface RichiestaFerieDTO {
  idRichiesta: number;       //
  idUtente: number;
  dataInizio: string;        // format: date-time
  dataFine?: string;         // nullable in swagger
  statoApprovazione?: string;
}

// 2. MALATTIA (da Swagger: RichiestaMalattiaDTO)
export interface RichiestaMalattiaDTO {
  idmalattia: number;        // Nota il nome diverso!
  idutente: number;          // Nota: idutente tutto minuscolo qui
  dataInizio: string;        // format: date (es. "2023-10-25")
  dataFine?: string;
  statoApprovazione?: string;
  certificato?: string;
}

// 3. STRAORDINARI (da Swagger: RichiestaStraordinariDTO)
export interface RichiestaStraordinariDTO {
  idStraordinari: number;    //
  idutente: number;
  dataInizio: string;        // format: date-time
  dataFine?: string;         // Nota: nel PDF gli straordinari hanno ore, qui hanno dataFine. Useremo questa.
  statoApprovazione?: string;
}