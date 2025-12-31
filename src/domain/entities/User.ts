export enum UserRole {
  EMPLOYEE = 'dipendente', // Può solo creare richieste
  ADMIN = 'admin',         // Può approvare/rifiutare richieste altrui
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: UserRole;          // Questo campo è CRUCIALE per la tua logica
  avatarUrl?: string;      // Per l'immagine del profilo
}