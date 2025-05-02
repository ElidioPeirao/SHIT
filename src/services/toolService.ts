import  db from '../utils/db';
import { Tool } from '../types';

export async function getAllTools(): Promise<Tool[]> {
  return db.getAllTools();
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  return db.getFilteredTools(category);
}

export async function addTool(toolData: Omit<Tool, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
  return db.addTool(toolData);
}

export async function updateTool(id: string, toolData: Partial<Tool>): Promise<{ success: boolean; message: string }> {
  return db.updateTool(id, toolData);
}

export async function deleteTool(id: string): Promise<{ success: boolean; message: string }> {
  return db.deleteTool(id);
}

export async function searchTools(searchTerm: string): Promise<Tool[]> {
  return db.searchTools(searchTerm);
}
 