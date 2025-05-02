import GoogleSheetsDB from './googleSheetsDB';

const googleDB = new GoogleSheetsDB({
  sheetId: import.meta.env.VITE_SHEET_ID
});

export default googleDB;
