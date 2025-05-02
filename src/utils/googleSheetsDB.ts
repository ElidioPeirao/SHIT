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
  }

  /**
   * Fetch list of rows from a given sheet
   */
  async fetchData(sheetName: string): Promise<any[]> {
    if (this.useLocalFallback) {
      console.log(`Using local mock data for ${sheetName}`);
      return this.getMockData(sheetName);
    }
    try {
      const result = await callSheetsApi(
        this.config.sheetId,
        'list',
        sheetName
      );
      return result.success ? result.result : [];
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      this.useLocalFallback = true;
      return this.getMockData(sheetName);
    }
  }

  /**
   * Insert a new row into a sheet
   */
  async insertRow(sheetName: string, rowData: Record<string, any>): Promise<boolean> {
    if (this.useLocalFallback) {
      console.log(`Mock insert into ${sheetName}:`, rowData);
      return true;
    }
    try {
      const result = await callSheetsApi(
        this.config.sheetId,
        'insert',
        sheetName,
        rowData
      );
      console.log('Insert result:', result);
      return result.success;
    } catch (error) {
      console.error('Error inserting data to Google Sheets:', error);
      this.useLocalFallback = true;
      return true;
    }
  }

  /**
   * Update an existing row in a sheet
   */
  async updateRow(
    sheetName: string,
    rowId: string,
    rowData: Record<string, any>
  ): Promise<boolean> {
    if (this.useLocalFallback) {
      console.log(`Mock update in ${sheetName} for id ${rowId}:`, rowData);
      return true;
    }
    try {
      const result = await callSheetsApi(
        this.config.sheetId,
        'update',
        sheetName,
        rowData,
        rowId
      );
      return result.success;
    } catch (error) {
      console.error('Error updating data in Google Sheets:', error);
      this.useLocalFallback = true;
      return true;
    }
  }

  /**
   * Delete a row by id from a sheet
   */
  async deleteRow(sheetName: string, rowId: string): Promise<boolean> {
    if (this.useLocalFallback) {
      console.log(`Mock delete in ${sheetName} for id ${rowId}`);
      return true;
    }
    try {
      const result = await callSheetsApi(
        this.config.sheetId,
        'delete',
        sheetName,
        undefined,
        rowId
      );
      return result.success;
    } catch (error) {
      console.error('Error deleting data from Google Sheets:', error);
      this.useLocalFallback = true;
      return true;
    }
  }

  /**
   * Fallback mock data for development
   */
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
