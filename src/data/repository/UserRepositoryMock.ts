import { User } from '../../domain/entities/User';

// Mock users (in un'app reale faresti chiamate al backend)
const MOCK_USERS: User[] = [
  { id: '1', name: 'Mario', surname: 'Rossi', email: 'mario@synncpoint.it', role: ("ADMIN" as any) },
  { id: '2', name: 'Giulia', surname: 'Verdi', email: 'giulia@example.com', role: ("EMPLOYEE" as any) },
];

export class UserRepositoryMock {
  async getUserById(id: string): Promise<User | undefined> {
    // Simula I/O
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_USERS.find(u => u.id === id)), 100);
    });
  }

  async getAllUsers(): Promise<User[]> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_USERS.slice()), 100));
  }
}
