import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "billing.json");

type Wallet = {
  id: string;
  businessId: string;
  balance: string; // stored as string for compatibility with frontend types
  currency: string;
  createdAt: string;
  updatedAt: string;
};

type Transaction = {
  id: string;
  businessId: string;
  walletId: string;
  type: "TOP_UP" | "SMS_DEBIT" | "ADJUSTMENT";
  amount: string;
  balanceAfter: string;
  description: string | null;
  meta: Record<string, any>;
  createdAt: string;
};

type Pricing = {
  basePrice: number; // base price per SMS
  resellerMargin: number; // fraction (0.1 = 10%)
  clientMargin: number; // fraction
};

type ProviderPricing = {
  country: string; // "RW", "UG", "TZ", etc.
  operator: string; // "MTN", "Airtel", "Vodacom", etc.
  pricePerSms: number; // e.g., 0.01 for $0.01 per SMS
};

type AuditLog = {
  id: string;
  action: "WALLET_CREATED" | "TOP_UP" | "SMS_DEBIT" | "PRICING_UPDATED" | "WALLET_ADJUSTED";
  businessId: string;
  actor?: string; // user who performed the action
  details: Record<string, any>;
  createdAt: string;
};

type DBShape = {
  wallets: Wallet[];
  transactions: Transaction[];
  pricing: Pricing;
  providerPricing: ProviderPricing[];
  auditLogs: AuditLog[];
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function defaultDB(): DBShape {
  return {
    wallets: [],
    transactions: [],
    auditLogs: [],
    pricing: { basePrice: 0.05, resellerMargin: 0.1, clientMargin: 0.0 },
    providerPricing: [
      // Rwanda - MTN
      { country: "RW", operator: "MTN", pricePerSms: 0.01 },
      // Rwanda - Airtel
      { country: "RW", operator: "Airtel", pricePerSms: 0.008 },
      // Rwanda - Tigo
      { country: "RW", operator: "Tigo", pricePerSms: 0.009 },
      // Default fallback
      { country: "DEFAULT", operator: "DEFAULT", pricePerSms: 0.05 },
    ],
  };
}

function readDB(): DBShape {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    const init = defaultDB();
    fs.writeFileSync(DATA_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  try {
    return JSON.parse(raw) as DBShape;
  } catch (err) {
    const init = defaultDB();
    fs.writeFileSync(DATA_FILE, JSON.stringify(init, null, 2));
    return init;
  }
}

function writeDB(db: DBShape) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function makeId(prefix = "") {
  return `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 10000).toString(36)}`;
}

export function getPricing() {
  const db = readDB();
  return db.pricing;
}

export function setPricing(p: Pricing) {
  const db = readDB();
  db.pricing = p;
  writeDB(db);
  return db.pricing;
}

export function getOrCreateWallet(businessId: string) {
  const db = readDB();
  let w = db.wallets.find((x) => x.businessId === businessId);
  if (!w) {
    const now = new Date().toISOString();
    w = {
      id: makeId("w_"),
      businessId,
      balance: "0",
      currency: "USD",
      createdAt: now,
      updatedAt: now,
    };
    db.wallets.push(w);
    writeDB(db);
  }
  return w;
}

export function getWallet(businessId: string) {
  const db = readDB();
  const w = db.wallets.find((x) => x.businessId === businessId) || null;
  return w;
}

export function topUpWallet(params: { businessId: string; amount: number; description?: string; meta?: Record<string, any> }) {
  const { businessId, amount, description, meta } = params;
  const db = readDB();
  let w = db.wallets.find((x) => x.businessId === businessId);
  const now = new Date().toISOString();
  if (!w) {
    w = {
      id: makeId("w_"),
      businessId,
      balance: String(amount),
      currency: "USD",
      createdAt: now,
      updatedAt: now,
    };
    db.wallets.push(w);
  } else {
    const current = parseFloat(w.balance || "0");
    w.balance = String(current + amount);
    w.updatedAt = now;
  }

  const tx: Transaction = {
    id: makeId("t_"),
    businessId,
    walletId: w.id,
    type: "TOP_UP",
    amount: String(amount),
    balanceAfter: w.balance,
    description: description || "Top up",
    meta: meta || {},
    createdAt: now,
  };
  db.transactions.push(tx);
  writeDB(db);
  return { wallet: w, transaction: tx };
}

export function addTransaction(tx: Omit<Transaction, "id" | "createdAt">) {
  const db = readDB();
  const now = new Date().toISOString();
  const id = makeId("t_");
  const full: Transaction = { id, createdAt: now, ...tx };
  db.transactions.push(full);
  writeDB(db);
  return full;
}

export function getTransactions(businessId: string, limit = 50, offset = 0) {
  const db = readDB();
  const rows = db.transactions.filter((t) => t.businessId === businessId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return rows.slice(offset, offset + limit);
}

export function debitWallet(businessId: string, amount: number, description?: string, meta?: Record<string, any>) {
  const db = readDB();
  const w = db.wallets.find((x) => x.businessId === businessId);
  if (!w) throw new Error("Wallet not found");
  const current = parseFloat(w.balance || "0");
  if (current < amount) throw new Error("Insufficient balance");
  const newBalance = current - amount;
  w.balance = String(newBalance);
  w.updatedAt = new Date().toISOString();

  const tx: Transaction = {
    id: makeId("t_"),
    businessId,
    walletId: w.id,
    type: "SMS_DEBIT",
    amount: String(-Math.abs(amount)),
    balanceAfter: w.balance,
    description: description || "SMS debit",
    meta: meta || {},
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(tx);
  writeDB(db);
  return { wallet: w, transaction: tx };
}

function addAuditLog(action: AuditLog["action"], businessId: string, details: Record<string, any>, actor?: string) {
  const db = readDB();
  const now = new Date().toISOString();
  const log: AuditLog = {
    id: makeId("al_"),
    action,
    businessId,
    actor,
    details,
    createdAt: now,
  };
  db.auditLogs.push(log);
  writeDB(db);
  return log;
}

function getAuditLogs(businessId?: string, limit = 100) {
  const db = readDB();
  let logs = db.auditLogs;
  if (businessId) logs = logs.filter((l) => l.businessId === businessId);
  return logs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
}

/**
 * Extract country code from phone number
 * Examples: +250788123456 → "RW", +256701234567 → "UG"
 */
function getCountryFromPhone(phoneNumber: string): string {
  if (phoneNumber.startsWith("+250")) return "RW";
  if (phoneNumber.startsWith("+256")) return "UG";
  if (phoneNumber.startsWith("+255")) return "TZ";
  if (phoneNumber.startsWith("+243")) return "CD";
  if (phoneNumber.startsWith("+254")) return "KE";
  return "DEFAULT";
}

/**
 * Detect mobile operator from phone number or country code
 * Examples: +250788... (MTN Rwanda), +250722... (Airtel Rwanda)
 */
function getOperatorFromPhone(phoneNumber: string): string {
  // Rwanda operators
  if (phoneNumber.startsWith("+250788") || phoneNumber.startsWith("+250789")) return "MTN";
  if (phoneNumber.startsWith("+250722") || phoneNumber.startsWith("+250723")) return "Airtel";
  if (phoneNumber.startsWith("+250730") || phoneNumber.startsWith("+250731")) return "Tigo";

  // Uganda operators (optional)
  if (phoneNumber.startsWith("+256700") || phoneNumber.startsWith("+256701")) return "MTN";
  if (phoneNumber.startsWith("+256702") || phoneNumber.startsWith("+256703")) return "Airtel";

  return "DEFAULT";
}

/**
 * Get SMS price for a phone number
 * Example: +250788123456 → 0.01 (Rwanda MTN)
 */
export function getSMSPriceForPhone(phoneNumber: string): number {
  const db = readDB();
  const country = getCountryFromPhone(phoneNumber);
  const operator = getOperatorFromPhone(phoneNumber);

  // Look for exact match
  const exact = db.providerPricing.find((p) => p.country === country && p.operator === operator);
  if (exact) return exact.pricePerSms;

  // Fallback to country default
  const countryDefault = db.providerPricing.find((p) => p.country === country && p.operator === "DEFAULT");
  if (countryDefault) return countryDefault.pricePerSms;

  // Fallback to global default
  const globalDefault = db.providerPricing.find((p) => p.country === "DEFAULT");
  if (globalDefault) return globalDefault.pricePerSms;

  return 0.05; // hardcoded fallback
}

/**
 * Get all provider pricing rules
 */
export function getProviderPricing(): ProviderPricing[] {
  const db = readDB();
  return db.providerPricing;
}

/**
 * Update provider pricing rules
 */
export function setProviderPricing(pricing: ProviderPricing[]): ProviderPricing[] {
  const db = readDB();
  db.providerPricing = pricing;
  writeDB(db);
  return db.providerPricing;
}

export default {
  getOrCreateWallet,
  getWallet,
  topUpWallet,
  addTransaction,
  getTransactions,
  debitWallet,
  getPricing,
  setPricing,
  getSMSPriceForPhone,
  getProviderPricing,
  setProviderPricing,
  addAuditLog,
  getAuditLogs,
};
