const fs = require('fs');
const path = require('path');

// Path to your downloaded JSON file
const jsonPath = path.join(__dirname, '../credentials/google-sheets-credentials.json');

try {
  // Check if JSON file exists
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Error: credentials/google-sheets-credentials.json not found!');
    console.log('\n📋 Please:');
    console.log('1. Create a "credentials" folder in your project root');
    console.log('2. Download the JSON file from Google Cloud Console');
    console.log('3. Save it as: credentials/google-sheets-credentials.json');
    console.log('\n💡 Need help? Follow the guide at:');
    console.log('https://console.cloud.google.com/apis/credentials');
    process.exit(1);
  }

  // Read the JSON file
  const jsonData = fs.readFileSync(jsonPath, 'utf8');
  const credentials = JSON.parse(jsonData);

  // Your spreadsheet ID
  const SPREADSHEET_ID = '1uSHw25318SVYH8rXLLF7fxlfEdbstoi0DAJyMDqrmyA';
  
  // Extract values
  const clientEmail = credentials.client_email;
  const privateKey = credentials.private_key;

  // Check if .env.local already exists
  const envPath = path.join(__dirname, '../.env.local');
  let existingContent = '';
  
  if (fs.existsSync(envPath)) {
    existingContent = fs.readFileSync(envPath, 'utf8');
  }

  // Create .env.local content
  const envContent = `# Email Configuration
GMAIL_USER=help.d4community@gmail.com
# Get Gmail App Password: https://myaccount.google.com/apppasswords
GMAIL_PASS=your-gmail-app-password-here

# Google Sheets Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=${SPREADSHEET_ID}
GOOGLE_SHEETS_CLIENT_EMAIL=${clientEmail}
GOOGLE_SHEETS_PRIVATE_KEY="${privateKey}"
`;

  // Write to .env.local
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Success! .env.local file has been created/updated with your credentials!\n');
  console.log('📋 File location:', envPath);
  console.log('\n📊 Your Google Sheets Spreadsheet ID:', SPREADSHEET_ID);
  console.log('🔑 Service Account Email:', clientEmail);
  console.log('\n⚠️  IMPORTANT NEXT STEPS:');
  console.log('1️⃣  Replace "your-gmail-app-password-here" with your actual Gmail app password');
  console.log('    - Go to: https://myaccount.google.com/apppasswords');
  console.log('    - Generate a password for "Mail"');
  console.log('    - Copy the 16-digit password');
  console.log('\n2️⃣  Share your Google Sheet with this email:', clientEmail);
  console.log('    - Open: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit');
  console.log('    - Click "Share" button');
  console.log('    - Add this email as "Editor"');
  console.log('\n3️⃣  Never commit .env.local to git (it should be in .gitignore)\n');
  
  // Create .env.example file for reference
  const envExamplePath = path.join(__dirname, '../.env.example');
  const envExampleContent = `# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# Google Sheets Configuration
GOOGLE_SHEETS_CLIENT_EMAIL=d4-sheets-access@d4-new-members-sheets.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDVgdryyzKJTpnb\nB0hMPh0OYWlnFofLIrJ1oBYybNNjlXzSOtsUCsoin10+YKIJR5eqxN/4lbAH8TM8\nfHsvFBmvKw+vJs/6Jgxj/tC4J8EHHnDlQ/dd5XTYjyeMUXe6iJvhawJiTAjKFS4i\nN2PzlcB5MQ15fQhF/k2frEQkiZAOi5KL8OoeG9+HXD520+ZMhe6Kq10h8PBrPyBw\nWnxig7CkTeWpgu+fBXGzG6J/JNd+Y8kxgfDKe7MhlLhJfOKqLpbdRoJD08HnvZqu\nUxdrpwDQobKdwAveiGY/K53psx7cqOhh++PmqYCd7BTTPPtsvuhfRYYTTar9PWAv\neSCEM8unAgMBAAECggEABkIdKdq863trVRk8jEeR0HcYgNYPOuwUcRA1NlssQxIB\nq6PgAhFi5Wrob8ijV0RK9M16hy3UEBeI2fAIKFQdgJ3xgr/PftSYrmGsuoknxk6l\nHoNEf/MW3rYrgZhtuwEAGLZrRnhWFZ5TUNtwyZYNI0BF1dbNZEfU/KYvBScnGtX8\nxXjnusE0TecTLeOvls1e2/jAdI5/XpM6ecDgYUZK6hM4dJ5k8/GF4FBF/CgDmPFM\n64A1/eRPrAZA1diOQi9rWtGHY9rzSKzS+ZN5ejPxTDhG8/VnRVJGfFqNi2ujKrMc\nCUCxOPgvm+Et6lnAO42EV7RJfLT/FQsQMyiiI2jteQKBgQD4f8gJNGoayl3WXja9\niTiafW/FDWzyMqVV2B1iVqARhNS+OjrxvcvGunxxrmH36D50e7TP9x6k4XHKltk4\nTLCEEduLwc51Aup2LZUnGIAHSH1eFzBtrEqmpZL6uQHFCISpTao1UtmgykURZ6Ib\nsFys9YpvXRHtypmjj1OJUZKTXQKBgQDb866mDjew3iA+p+P9642bTWJzQhkgD3nN\nIQ3GeEa+qFE8x0Fity8H4L9mmMpedaSdw+jqLHoINXw76ReXV84X07IZGvZbM/ga\ndGv5bgP+LKVwnObgELgcRJGWiJ9qTvle4ZTquXikg/0hEUvnbLmqysvavm5oTaw7\nutJk85ZO0wKBgCOISfce+okIJLDRWexyIZjdlMzNZaWgHkoPE+yKzGqU3sKwmtsU\nM34gDklHERUcrUmEos8V29jhr56zQS4usRLBZu4t8TKEDziEvg4QD8Z61ApPMIqO\nF0KK7GBTcfBVjnqS82KajSnTolqhwelJp4bHuVrBKR4iWSOtC9nXwyi1AoGAJ5KF\nFo0ySdj89ijgpRuPI6TdlJ0Mxi7inBxZTR7wo3bG/udehTMt+/3ckcnlhu8lidjo\ne9E6t2VgD6tVOj5q7vCAd3HZZvlHpwLRNlQr1bwUm9ku1JtNdJCFnQ7Bl6/Tv9VY\nJI7v/LFehmeFP4LZOLg5ywY9+PgYh7qKBe2pWk8CgYBzdlT5pvpojKpUefKDKv1B\nuiMHNc8ZseG+cdBqYkjskuk9szmdwxvtXqe59k6lGEfo2l/86XyRt3UcYy/77A7s\n2I1859iB2cta/oSjg6tCwcZTuDFdN7DZcXaWiKm7LZxvrAtYzeyYKED40IpHSH0Q\nWTrcgiiHzaVBYyG9BYjndA==\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_SPREADSHEET_ID=1uSHw25318SVYH8rXLLF7fxlfEdbstoi0DAJyMDqrmyA
`;
  
  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log('📝 Created .env.example file for reference\n');

} catch (error) {
  console.error('\n❌ Error reading credentials file:', error.message);
  console.log('\n📋 Make sure your JSON file is valid and contains:');
  console.log('   - client_email');
  console.log('   - private_key');
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Check if the JSON file is properly formatted');
  console.log('2. Make sure you downloaded the correct JSON key from Google Cloud');
  console.log('3. Verify the file path: credentials/google-sheets-credentials.json\n');
}