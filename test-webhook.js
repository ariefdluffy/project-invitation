import crypto from 'crypto';

// Data test
const testOrderId = 'P_28d6f5a2-8033-474f-a185-4c64fe0c5f39_1714134400000'; // User arieftheluffy
const testStatusCode = '200';
const testGrossAmount = '39000';
const testServerKey = 'SB-Mid-server-u0zbtnDby1LXDIMJEYUZoyBe';

// Generate signature sesuai format di code
const signatureStr = testOrderId + testStatusCode + testGrossAmount + testServerKey;
const signature = crypto.createHash('sha512').update(signatureStr).digest('hex');

console.log('=== Test Webhook Signature ===');
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

console.log('=== Test Payload ===');
console.log(JSON.stringify(testPayload, null, 2));