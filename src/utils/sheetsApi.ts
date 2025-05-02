/**
 * Faz requisição direta ao seu Apps Script Web App (sem proxy JDoodle)
 */
export async function fetchWithProxy(scriptId: string, body: any) {
  const url = `https://script.google.com/macros/s/${scriptId}/exec`;
  const bodyString = JSON.stringify(body);

  console.log(`Calling Google Sheets Web App at ${url}`, bodyString);

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyString,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HTTP error! Status: ${response.status}`, errorText);
    throw new Error(`Google Sheets API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Simplified interface for making API calls to the Sheets Web App
 */
export async function callSheetsApi(
  scriptId: string,
  action: string,
  sheet: string,
  data?: any,
  id?: string
) {
  const payload: any = { action, sheet };
  if (data) payload.data = data;
  if (id) payload.id = id;

  return fetchWithProxy(scriptId, payload);
}
