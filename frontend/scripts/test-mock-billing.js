const fs = require('fs');
const path = require('path');

function loadMockData() {
  const file = path.join(__dirname, '..', 'mocks', 'data', 'wecallMockData.ts');
  const raw = fs.readFileSync(file, 'utf8');
  const marker = 'export const wecallMockData';
  const idx = raw.indexOf(marker);
  if (idx === -1) throw new Error('wecallMockData export not found');
  const eqIdx = raw.indexOf('=', idx);
  const startIdx = raw.indexOf('{', eqIdx);
  // find matching closing brace
  let i = startIdx;
  let depth = 0;
  for (; i < raw.length; i++) {
    if (raw[i] === '{') depth++;
    else if (raw[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const objText = raw.slice(startIdx, i + 1);
  // wrap and eval
  const data = eval('(' + objText + ')');
  return data;
}

(function main(){
  const data = loadMockData();
  console.log('Loaded mock data.');

  const business = 'AC_CLIENT_2001';
  const to = '+250788123456';
  const count = 1;

  // find wallet
  data.billing = data.billing || { wallets: [], transactions: [] };
  let wallet = (data.billing.wallets || []).find(w => w.business_sid === business);
  console.log('\nInitial wallet:', wallet || 'not found');

  // determine price
  function priceForNumber(phone) {
    if (!phone) return 0.05;
    if (phone.startsWith('+250788') || phone.startsWith('+250789')) return 0.01;
    if (phone.startsWith('+250722') || phone.startsWith('+250723')) return 0.008;
    if (phone.startsWith('+250730') || phone.startsWith('+250731')) return 0.009;
    return 0.05;
  }

  const pricePer = priceForNumber(to);
  const total = +(pricePer * count).toFixed(6);
  console.log(`Price per SMS: ${pricePer}, total for ${count}: ${total}`);

  if (!wallet) {
    console.log('No wallet found, creating one with balance 0.');
    wallet = { sid: `WL_${business}`, business_sid: business, balance: 0, currency: 'USD', credit_limit: 0 };
    data.billing.wallets.push(wallet);
  }

  const available = (wallet.balance || 0) + (wallet.credit_limit || 0);
  if (available < total) {
    console.log('\nInsufficient balance. Cannot send SMS.');
    console.log(`Available: ${available}, required: ${total}`);
    // for test, top up
    console.log('\nTopping up wallet by $50 for test.');
    wallet.balance += 50;
    data.billing.transactions.push({ sid: 'TX_TEST_TOPUP', business_sid: business, type: 'TOPUP', amount: 50, currency: 'USD', reference: 'TEST_TOPUP', created_at: new Date().toISOString() });
    console.log('New balance:', wallet.balance);
  }

  // debit
  console.log('\nDebiting wallet for SMS...');
  wallet.balance = +(wallet.balance - total).toFixed(6);
  const tx = { sid: `TX_TEST_${Date.now()}`, business_sid: business, type: 'SMS_DEBIT', amount: -total, currency: 'USD', details: { messages: count, price_per_sms: pricePer }, created_at: new Date().toISOString() };
  data.billing.transactions.unshift(tx);

  const msgSid = `SM${Math.floor(Math.random()*900000+100000)}`;
  const msg = { sid: msgSid, business_sid: business, direction: 'outbound', from: 'TEST', to, status: 'delivered', error_code: null, price: pricePer, currency: 'USD', gateway: 'mock-gateway', created_at: new Date().toISOString(), delivered_at: new Date().toISOString() };
  data.messages = data.messages || [];
  data.messages.unshift(msg);

  console.log('\nAfter debit:');
  console.log('Wallet:', wallet);
  console.log('Inserted transaction:', tx);
  console.log('Inserted message:', msg);

  // print last 3 transactions for business
  const txs = (data.billing.transactions || []).filter(t => t.business_sid === business).slice(0,5);
  console.log('\nRecent transactions for', business, txs);

  // Save a snapshot to tmp for inspection
  const out = path.join(__dirname, '..', 'tmp', `mock-billing-test-${Date.now()}.json`);
  try {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify({ wallet, insertedTx: tx, insertedMsg: msg, recent: txs }, null, 2));
    console.log('\nWrote snapshot to', out);
  } catch (e) {
    console.warn('Failed to write snapshot:', e.message);
  }
})();
