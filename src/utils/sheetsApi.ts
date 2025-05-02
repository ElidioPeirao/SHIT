// Utility functions for making requests to Google Sheets API diretamente

/**
 * Faz requisições POST diretamente ao Google Apps Script publicado como Web App
 * Exige que o Apps Script esteja configurado como "Qualquer pessoa pode acessar"
 */
export async function fetchWithProxy(scriptId: string, body: any) {
  const apiUrl = `https://script.google.com/macros/s/${scriptId}/exec`;

  try {
    const bodyString = JSON.stringify(body);
    console.log(`Fazendo requisição para ${apiUrl} com payload:`, bodyString);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyString,
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao chamar a API do Google Sheets:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Função principal para chamadas padronizadas à API do Sheets
 */
export async function callSheetsApi(
  scriptId: string,
  action: 'read' | 'insert' | 'update' | 'delete',
  sheet: string,
  id?: string,
  data?: Record<string, any>
) {
  const body: Record<string, any> = {
    action,
    sheet,
  };

  if (id) body.id = id;
  if (data) body.data = data;

  return await fetchWithProxy(scriptId, body);
}
