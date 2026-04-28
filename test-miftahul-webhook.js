import crypto from 'crypto';

// User miftahul ID
const miftahulUserId = 'f12516fe-e017-4464-9fef-9fc98082e732';

// Generate order ID untuk miftahul dengan format yang benar
function buildMidtransOrderId(type, userId) {
  if (userId.length !== 36) {
    throw new Error('Invalid user id for Midtrans order_id - must be 36 char UUID');
  }
  const prefix = type === 'premium' ? 'P' : 'A';
  return `${prefix}_${userId}_${Date.now()}`;
}

// Test data untuk miftahul
const testOrderId = buildMidtransOrderId('premium', miftahulUserId);
const testStatusCode = '200';
const testGrossAmount = '39000';
const testServerKey = 'SB-Mid-server-u0zbtnDby1LXDIMJEYUZoyBe';

// Generate signature
const signatureStr = testOrderId + testStatusCode + testGrossAmount + testServerKey;
const signature = crypto.createHash('sha512').update(signatureStr).digest('hex');

console.log('=== Test Webhook untuk miftahul (FORMAT BARU) ===');
console.log('User ID:', miftahulUserId);
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