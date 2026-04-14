import { google } from 'googleapis';

export async function addToGoogleSheets(data: any) {
  try {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = "Members"; 

    if (!clientEmail || !privateKey || !spreadsheetId) {
      return { success: false, error: "Environment variables missing" };
    }

    // Standardize the Private Key
    const formattedKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/"/g, '')
      .trim();

    // Establishing Identity using GoogleAuth (more robust than JWT)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: formattedKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

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
      range: `${sheetName}!A:I`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    return { success: true, updatedRows: response.data.updates?.updatedRows };
  } catch (error: any) {
    // If the API isn't enabled, this error message will now be much more specific
    console.error('❌ Sheets Error:', error.message);
    return { success: false, error: error.message };
  }
}