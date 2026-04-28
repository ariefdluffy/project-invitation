import crypto from 'crypto';

// User sitirusmini ID (format UUID standar)
const sitirusminiUserId = 'b58494c1-8d77-45d2-8f91-c7fbee08ba25';

// Generate order ID untuk sitirusmini dengan format yang benar
function buildMidtransOrderId(type, userId) {
  if (userId.length !== 36) {
    throw new Error('Invalid user id for Midtrans order_id - must be 36 char UUID');
  }
  const prefix = type === 'premium' ? 'P' : 'A';
  return `${prefix}_${userId}_${Date.now()}`;
}

// Test data dengan format baru
const testOrderId = buildMidtransOrderId('premium', sitirusminiUserId);
const testStatusCode = '200';
const testGrossAmount = '39000';
const testServerKey = 'SB-Mid-server-u0zbtnDby1LXDIMJEYUZoyBe';

// Generate signature sesuai format di code
const signatureStr = testOrderId + testStatusCode + testGrossAmount + testServerKey;
const signature = crypto.createHash('sha512').update(signatureStr).digest('hex');

console.log('=== Test Webhook untuk sitirusmini (FORMAT BARU) ===');
console.log('User ID:', sitirusminiUserId);
console.log('Order ID:', testOrderId);
console.log('Status Code:', testStatusCode);
console.log('Gross Amount:', testGrossAmount);
console.log('Server Key:', testServerKey);
console.log('');
console.log('Signature String:', signatureStr);
console.log('');
console.log('Generated Signature:', signature);
console.log('');

// Create test payload
const testPayload = {
  order_id: testOrderId,
  status_code: testStatusCode,
  gross_amount: testGrossAmount,
  signature_key: signature,
  transaction_status: 'capture',
  fraud_status: 'accept'
};

console.log('=== Test Payload (FORMAT BARU) ===');
console.log(JSON.stringify(testPayload, null, 2));