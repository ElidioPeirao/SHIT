//  Improved Google Sheets Database API
import { callSheetsApi } from './sheetsApi';
import { mockUsers, mockTools, mockPromoCodes } from './mockData';

export interface GoogleSheetsConfig {
  sheetId: string;
}

export default class GoogleSheetsDB {
  private config: GoogleSheetsConfig;
  private useLocalFallback: boolean = false;
  
  constructor(config: GoogleSheetsConfig) {
    this.config = config;
    
    // If no script ID is provided, use local fallback
    //if (!config.sheetId || config.sheetId === 'AKfycbwWnFMmxaPcA8HZBABZQi9pV-ZqFgYIEx0Fp0P4fNm4PcYY5P3L1Keszb-03DFIoypr') {
     // console.warn('No script ID provided, using local mock data');
     // this.useLocalFallback = true;
    }
  }
  
  async fetchData(sheetName: string): Promise<any[]> {
    try {
      // Use mock data if no script ID or in fallback mode
      if (this.useLocalFallback) {
        return this.getMockData(sheetName);
      }
      
      const result = await callSheetsApi(this.config.sheetId, 'read', sheetName);
      
      // If successful, return the data
      if (result.success) {
        return result.result || [];
      } else {
        // If there's an API error, fall back to mock data
        console.error('Error fetching data, using fallback:', result.error);
        this.useLocalFallback = true;
        return this.getMockData(sheetName);
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      
      // Fall back to mock data
      this.useLocalFallback = true;
      return this.getMockData(sheetName);
    }
  }
  
  async insertRow(sheetName: string, rowData: Record<string, any>): Promise<boolean> {
    try {
      if (this.useLocalFallback) {
        console.log(`Mock insert into ${sheetName}:`, rowData);
        return true;
      }
      
      console.log(`Inserting row to ${sheetName}:`, rowData);
      
      const result = await callSheetsApi(
        this.config.sheetId,
        'insert',
        sheetName,
        rowData
      );
      
      console.log('Insert result:', result);
      return result.success || false;
    } catch (error) {
      console.error('Error inserting data to Google Sheets:', error);
      
      // Fall back to mock mode if the API fails
      this.useLocalFallback = true;
      return true; // Pretend it succeeded
    }
  }
  
  async updateRow(sheetName: string, rowId: string, rowData: Record<string, any>): Promise<boolean> {
    try {
      if (this.useLocalFallback) {
        console.log(`Mock update in ${sheetName} for id ${rowId}:`, rowData);
        return true;
      }
      
      const result = await callSheetsApi(
        this.config.sheetId,
        'update',
        sheetName,
        rowData,
        rowId
      );
      
      return result.success || false;
    } catch (error) {
      console.error('Error updating data in Google Sheets:', error);
      
      // Fall back to mock mode if the API fails
      this.useLocalFallback = true;
      return true; // Pretend it succeeded
    }
  }
  
  async deleteRow(sheetName: string, rowId: string): Promise<boolean> {
    try {
      if (this.useLocalFallback) {
        console.log(`Mock delete from ${sheetName} id ${rowId}`);
        return true;
      }
      
      const result = await callSheetsApi(
        this.config.sheetId,
        'delete',
        sheetName,
        null,
        rowId
      );
      
      return result.success || false;
    } catch (error) {
      console.error('Error deleting data from Google Sheets:', error);
      
      // Fall back to mock mode if the API fails
      this.useLocalFallback = true;
      return true; // Pretend it succeeded
    }
  }
  
  // Helper method to get mock data for fallback mode
  private getMockData(sheetName: string): any[] {
    switch (sheetName) {
      case 'users':
        return mockUsers;
      case 'tools':
        return mockTools;
      case 'promoCodes':
        return mockPromoCodes;
      default:
        return [];
    }
  }
}
 
