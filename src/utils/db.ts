import  { User, Tool, PromoCode } from '../types';
import GoogleSheetsDB from './googleSheetsDB';

// Initialize the Google Sheets database with your script ID
// You will need to replace this with your actual script ID from Google Apps Script
const googleDB = new GoogleSheetsDB({ 
  sheetId: 'AKfycbwWnFMmxaPcA8HZBABZQi9pV-ZqFgYIEx0Fp0P4fNm4PcYY5P3L1Keszb-03DFIoypr' // Replace with your actual script ID
});

class DB {
  private currentUser: User | null = null;
  
  constructor() {
    // Initialize and check local storage for current user
    const storedUser = localStorage.getItem('eprojects_currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  // User methods
  async register(username: string, email: string, password: string, promoCode?: string): Promise<{ success: boolean; message: string }> {
    try {
      const users = await googleDB.fetchData('users');
      if (users.some((u: User) => u.email === email)) {
        return { success: false, message: 'Email já está em uso.' };
      }

      let role: 'Basic' | 'Pro' | 'Admin' = 'Basic';
      let proDaysLeft = 0;

      if (promoCode === 'ELIDIOFODA') {
        role = 'Admin';
        proDaysLeft = 9999;
      } else if (promoCode) {
        const codes: PromoCode[] = await googleDB.fetchData('promoCodes');
        const promo = codes.find(p => p.code === promoCode && Number(p.usesLeft) > 0);
        if (promo) {
          role = 'Pro';
          proDaysLeft = Number(promo.daysGranted);
          
          // Update promo code uses
          const updatedPromo = { ...promo, usesLeft: Number(promo.usesLeft) - 1 };
          await googleDB.updateRow('promoCodes', promo.id, updatedPromo);
        } else if (promoCode) {
          return { success: false, message: 'Código promocional inválido ou expirado.' };
        }
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        email,
        password,
        role,
        proDaysLeft,
        createdAt: new Date().toISOString()
      };

      const result = await googleDB.insertRow('users', newUser);
      return { 
        success: true, 
        message: 'Conta criada com sucesso!' 
      };
    } catch (error) {
      console.error('Error during registration:', error);
      return { 
        success: false, 
        message: 'Erro ao criar conta. Tente novamente.' 
      };
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const users: User[] = await googleDB.fetchData('users');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, message: 'Email ou senha incorretos.' };
      }

      this.currentUser = user;
      localStorage.setItem('eprojects_currentUser', JSON.stringify(user));
      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, message: 'Erro ao fazer login. Tente novamente.' };
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('eprojects_currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.isCurrentUserAdmin()) return [];
    try {
      return await googleDB.fetchData('users');
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<{ success: boolean; message: string }> {
    if (!this.isCurrentUserAdmin()) {
      return { success: false, message: 'Permissão negada.' };
    }

    try {
      await googleDB.updateRow('users', id, updates);
      
      // Update current user if it's the same one being updated
      if (this.currentUser && this.currentUser.id === id) {
        this.currentUser = { ...this.currentUser, ...updates };
        localStorage.setItem('eprojects_currentUser', JSON.stringify(this.currentUser));
      }
      
      return { success: true, message: 'Usuário atualizado com sucesso.' };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, message: 'Erro ao atualizar usuário.' };
    }
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    if (!this.isCurrentUserAdmin()) {
      return { success: false, message: 'Permissão negada.' };
    }

    try {
      await googleDB.deleteRow('users', id);
      return { success: true, message: 'Usuário excluído com sucesso.' };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, message: 'Erro ao excluir usuário.' };
    }
  }

  // Tool methods
  async getAllTools(): Promise<Tool[]> {
    if (!this.currentUser) return [];
    
    try {
      const tools: Tool[] = await googleDB.fetchData('tools');
      
      // Filter tools based on access level
      if (this.currentUser.role === 'Basic') {
        return tools.filter(tool => tool.accessLevel === 'Basic');
      }
      
      return tools;
    } catch (error) {
      console.error('Error fetching tools:', error);
      return [];
    }
  }

  async getFilteredTools(category: string): Promise<Tool[]> {
    try {
      const allTools = await this.getAllTools();
      return allTools.filter(tool => tool.category === category);
    } catch (error) {
      console.error('Error filtering tools:', error);
      return [];
    }
  }

  async addTool(tool: Omit<Tool, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
    if (!this.isCurrentUserAdmin()) {
      return { success: false, message: 'Permissão negada.' };
    }

    try {
      const newTool: Tool = {
        ...tool,
        id: `tool-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      await googleDB.insertRow('tools', newTool);
      return { success: true, message: 'Ferramenta adicionada com sucesso.' };
    } catch (error) {
      console.error('Error adding tool:', error);
      return { success: false, message: 'Erro ao adicionar ferramenta.' };
    }
  }

  async updateTool(id: string, updates: Partial<Tool>): Promise<{ success: boolean; message: string }> {
    if (!this.isCurrentUserAdmin()) {
      return { success: false, message: 'Permissão negada.' };
    }

    try {
      await googleDB.updateRow('tools', id, updates);
      return { success: true, message: 'Ferramenta atualizada com sucesso.' };
    } catch (error) {
      console.error('Error updating tool:', error);
      return { success: false, message: 'Erro ao atualizar ferramenta.' };
    }
  }

  async deleteTool(id: string): Promise<{ success: boolean; message: string }> {
    if (!this.isCurrentUserAdmin()) {
      return { success: false, message: 'Permissão negada.' };
    }

    try {
      await googleDB.deleteRow('tools', id);
      return { success: true, message: 'Ferramenta excluída com sucesso.' };
    } catch (error) {
      console.error('Error deleting tool:', error);
      return { success: false, message: 'Erro ao excluir ferramenta.' };
    }
  }

  // Promo code methods
  async createPromoCode(daysGranted: number, totalUses: number): Promise<{ success: boolean; message: string; code?: string }> {
    if (!this.isCurrentUserAdmin()) {
      return { success: false, message: 'Permissão negada.' };
    }

    try {
      // Generate a random code
      const code = 'PRO' + Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const newPromoCode: PromoCode = {
        id: `promo-${Date.now()}`,
        code,
        daysGranted,
        usesLeft: totalUses,
        totalUses,
        createdAt: new Date().toISOString()
      };

      await googleDB.insertRow('promoCodes', newPromoCode);
      return { success: true, message: 'Código promocional criado com sucesso.', code };
    } catch (error) {
      console.error('Error creating promo code:', error);
      return { success: false, message: 'Erro ao criar código promocional.' };
    }
  }

  async getAllPromoCodes(): Promise<PromoCode[]> {
    if (!this.isCurrentUserAdmin()) return [];
    
    try {
      return await googleDB.fetchData('promoCodes');
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      return [];
    }
  }

  async deletePromoCode(id: string): Promise<{ success: boolean; message: string }> {
    if (!this.isCurrentUserAdmin()) {
      return { success: false, message: 'Permissão negada.' };
    }

    try {
      await googleDB.deleteRow('promoCodes', id);
      return { success: true, message: 'Código promocional excluído com sucesso.' };
    } catch (error) {
      console.error('Error deleting promo code:', error);
      return { success: false, message: 'Erro ao excluir código promocional.' };
    }
  }

  // Search methods
  async searchTools(searchTerm: string): Promise<Tool[]> {
    try {
      const allTools = await this.getAllTools();
      
      if (!searchTerm) return allTools;
      
      const term = searchTerm.toLowerCase();
      return allTools.filter(tool => 
        tool.description.toLowerCase().includes(term) || 
        tool.category.toLowerCase().includes(term) ||
        tool.link.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching tools:', error);
      return [];
    }
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    if (!this.isCurrentUserAdmin()) return [];
    
    try {
      const allUsers = await this.getAllUsers();
      
      if (!searchTerm) return allUsers;
      
      const term = searchTerm.toLowerCase();
      return allUsers.filter(user => 
        user.username.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Helper methods
  isCurrentUserAdmin(): boolean {
    return !!this.currentUser && this.currentUser.role === 'Admin';
  }

  isCurrentUserPro(): boolean {
    return !!this.currentUser && (this.currentUser.role === 'Pro' || this.currentUser.role === 'Admin');
  }
}

// Singleton instance
const db = new DB();
export default db;
 
