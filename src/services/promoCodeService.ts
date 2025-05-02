import  db from '../utils/db';
import { PromoCode } from '../types';

export async function getAllPromoCodes(): Promise<PromoCode[]> {
  return db.getAllPromoCodes();
}

export async function createPromoCode(
  daysGranted: number, 
  totalUses: number
): Promise<{ success: boolean; code?: string; message: string }> {
  return db.createPromoCode(daysGranted, totalUses);
}

export async function deletePromoCode(id: string): Promise<{ success: boolean; message: string }> {
  return db.deletePromoCode(id);
}
 