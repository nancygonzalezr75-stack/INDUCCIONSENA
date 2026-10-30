import { Role } from '../types/induction';

export interface User {
  id: string;
  role: Role;
  password: string;
}

export const INITIAL_USERS: User[] = [
  { id: '1020485921', role: 'learner', password: '123' },
  { id: '1019384729', role: 'learner', password: '123' },
  { id: 'admin', role: 'instructor', password: 'admin' },
  { id: 'bienestar', role: 'bienestar', password: '123' },
];
