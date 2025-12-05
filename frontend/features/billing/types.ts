// Types for billing and transactions
export interface Transaction {
  id: string;
  amount: number;
  type: string;
  // Add more fields
}

export interface Wallet {
  balance: number;
  currency: string;
}
