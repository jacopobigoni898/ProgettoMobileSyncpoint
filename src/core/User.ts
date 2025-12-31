// Definiamo i ruoli possibili in modo rigido
export enum UserRole {
  ADMIN = 'admin',      // Può approvare
  EMPLOYEE = 'user',    // Può solo fare richieste
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;       // <--- QUESTO è il campo magico
  avatarUrl?: string;
}