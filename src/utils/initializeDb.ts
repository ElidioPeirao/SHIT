import  { initialTools, initialAdmin } from '../data/initialData';
import GoogleSheetsDB from './googleSheetsDB';

// Function to initialize the database with initial data if empty
export async function initializeDatabase(googleDB: GoogleSheetsDB) {
  try {
    console.log('Checking if database needs initialization...');
    
    // Check if users collection is empty
    const users = await googleDB.fetchData('users');
    if (!users || users.length === 0) {
      console.log('Initializing users collection with admin...');
      await googleDB.insertRow('users', initialAdmin);
    }
    
    // Check if tools collection is empty
    const tools = await googleDB.fetchData('tools');
    if (!tools || tools.length === 0) {
      console.log('Initializing tools collection with default tools...');
      for (const tool of initialTools) {
        await googleDB.insertRow('tools', tool);
      }
    }
    
    console.log('Database initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}
 