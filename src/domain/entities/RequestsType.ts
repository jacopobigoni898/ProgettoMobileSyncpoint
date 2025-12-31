// TIPI di richiesta possibili
// Basato sul PDF: "Richiesta Assenza" e "Richiesta Straordinari"
export enum RequestType {
  HOLIDAY = 'ferie',           // Assenza pianificata
  SICK_LEAVE = 'malattia',     // Assenza imprevista
  STUDY_PERMIT = 'permesso studio', //permesso per motivi si studio
  MOURNING_ALLOWED = 'permesso lutto', //permesso per motivi di lutto
  OVERTIME = 'straordinari',   // Lavoro extra
  PERMIT_L_104 = 'permesso disabilità ', //permesso per disabilità
  MEDICAL_EXAMINATION_PERMITTED = 'permesso visita medica', //permesso visita medica
  MARRIAGE_LEAVE = 'permesso sposalizio'
  
}

// STATO della richiesta
// Serve per il "Riepilogo" e per l'Admin che deve accettare/rifiutare
export enum RequestStatus {
  PENDING = 'non validato',   // Appena creata, l'admin deve vederla 
  APPROVED = 'validato',  // Confermata, appare in calendario 
  REJECTED = 'annulato',  // Bocciata dall'admin
}