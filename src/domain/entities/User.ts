export enum UserRole {
  // Le stringhe devono essere IDENTICHE al database (Case Sensitive!)
  EMPLOYEE = 'Utente', 
  ADMIN = 'Admin',
  EXTERNAL = 'Utente_Esterno' // Hai aggiunto questo ruolo nel DB
}

export interface User {
  id: string; // Nel DB è int (id_utente), ma in JS va bene stringa per flessibilità
  name: string; // DB: nome
  surname: string; // DB: cognome
  email: string; // DB: email
  role: UserRole; // DB: id_ruolo -> join Ruolo
  
  // Campi facoltativi che hai nel DB ma mancavano nel FE:
  username?: string; 
  fiscalCode?: string; // DB: codice_fiscale
}