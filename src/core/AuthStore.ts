import { User, UserRole } from '../domain/entities/User';

// Utente finto: CAMBIA 'role' QUI PER TESTARE L'APP COME ADMIN O USER
const CURRENT_USER: User = {
  id: '1',
  name: 'Mario ',
  surname: 'Rossi',
  email: 'mario@synncpoint.it',
  role: UserRole.ADMIN, // <--- Cambia in UserRole.EMPLOYEE per vedere la differenza
};

export const AuthStore = {
  // Funzione per sapere chi è loggato
  getLoggedUser: (): User => {
    return CURRENT_USER;
  },

  // Funzione per sapere se sono admin (scorciatoia)
  isAdmin: (): boolean => {
    return CURRENT_USER.role === UserRole.ADMIN;
  }
};