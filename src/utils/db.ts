import GoogleSheetsDB from './googleSheetsDB';

/**
 * Aqui você cria UMA instância única do GoogleSheetsDB
 * apontando pro seu Web App no Google Sheets.
 */
const googleDB = new GoogleSheetsDB({
  sheetId: 'AKfycbwWnFMmxaPcA8HZBABZQi9pV-ZqFgYIEx0Fp0P4fNm4PcYY5P3L1Keszb-03DFIoypr'
});

export default googleDB;
