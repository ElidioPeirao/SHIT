//  Utility functions for making requests to Google Sheets API via JDoodle proxy

/**
 * Optimized fetch function for JDoodle proxy
 * Uses a technique to avoid the "body has already been used" error with redirects
 */
export async function fetchWithProxy(scriptId: string, body: any) {
  const scriptUrl = `https://script.google.com/macros/s/${this.config.sheetId}/exec`;
  
  try {
    // Convert body to string once to avoid "body already used" issue
    const bodyString = JSON.stringify(body);
    
    console.log(`Making request to ${proxyUrl} with payload:`, bodyString);
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyString,
      // Important: don't follow redirects automatically
      redirect: 'manual',
    });
    
    // If we got a redirect, need to make a second request
    if (response.type === 'opaqueredirect' || response.status === 302 || response.status === 307) {
      console.log('Received redirect, making follow-up request');
      
      // Extract location from redirect if possible, fallback to original URL
      const location = response.headers.get('Location') || proxyUrl;
      
      // Make a second request with the same body but to the new location
      const finalResponse = await fetch(location, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyString,
      });
      
      if (!finalResponse.ok) {
        const errorText = await finalResponse.text();
        console.error(`HTTP error! Status: ${finalResponse.status}`, errorText);
        throw new Error(`HTTP error! Status: ${finalResponse.status}`);
      }
      
      return await finalResponse.json();
    }
    
    // If not a redirect, process the original response
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}`, errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchWithProxy:', error);
    throw error;
  }
}

// Simplified interface for making API calls
export async function callSheetsApi(scriptId: string, action: string, sheet: string, data?: any, id?: string) {
  try {
    const payload: any = {
      action,
      sheet
    };
    
    if (data) payload.data = data;
    if (id) payload.id = id;
    
    const result = await fetchWithProxy(scriptId, payload);
    return result;
  } catch (error) {
    console.error(`Error calling Sheets API (${action} on ${sheet}):`, error);
    throw error;
  }
}
 
