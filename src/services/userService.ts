import  db from '../utils/db';
import { User } from '../types';

export async function getAllUsers(): Promise<User[]> {
  return db.getAllUsers();
}

export async function updateUser(id: string, userData: Partial<User>): Promise<{ success: boolean; message: string }> {
  return db.updateUser(id, userData);
}

export async function deleteUser(id: string): Promise<{ success: boolean; message: string }> {
  return db.deleteUser(id);
}

export async function searchUsers(searchTerm: string): Promise<User[]> {
  return db.searchUsers(searchTerm);
}
 