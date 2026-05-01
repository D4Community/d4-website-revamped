import { google } from 'googleapis';

async function getSheetsInstance() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '').trim();
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export async function findMemberByEmail(email: string) {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    // Fetch rows to check for existing email
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Members!A:I", 
    });

    const rows = response.data.values;
    if (!rows) return null;

    // Based on your rowData: Index 3 is Email, Index 1 is MemberID, Index 2 is Name
    const existingRow = rows.find(row => row[3]?.toLowerCase() === email.toLowerCase());
    
    if (existingRow) {
      return {
        timestamp: existingRow[0],
        memberId: existingRow[1],
        name: existingRow[2],
        email: existingRow[3]
      };
    }
    return null;
  } catch (error) {
    console.error("Search Error:", error);
    return null;
  }
}

export async function addToGoogleSheets(data: any) {
  try {
    const sheets = await getSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const rowData = [
      data.timestamp,
      data.memberId,
      data.name,
      data.email,
      data.role || '',
      data.experience || '',
      Array.isArray(data.interest) ? data.interest.join(', ') : '',
      data.whyJoin || '',
      new Date().toISOString()
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `Members!A:I`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [rowData] },
    });
    return { success: true, updatedRows: response.data.updates?.updatedRows };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}