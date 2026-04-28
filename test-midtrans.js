import { getSetting } from './src/lib/server/settings.js';

async function test() {
  try {
    const serverKey = await getSetting('midtrans_server_key');
    const clientKey = await getSetting('midtrans_client_key');
    const isProduction = await getSetting('midtrans_is_production');
    
    console.log('Server Key (trimmed):', serverKey?.trim() ? 'SET' : 'NOT SET');
    console.log('Client Key (trimmed):', clientKey?.trim() ? 'SET' : 'NOT SET');
    console.log('Is Production:', isProduction);
    
    if (!serverKey?.trim()) {
      console.log('ERROR: Server Key is empty!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
