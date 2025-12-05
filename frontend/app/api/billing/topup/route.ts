import { NextRequest, NextResponse } from "next/server";

// Mock wallets (shared state for this demo)
const wallets: Record<string, any> = {
  "AC_CLIENT_2001": {
    sid: "wallet_001",
    business_sid: "AC_CLIENT_2001",
    balance: 5000.00,
    credit_limit: 10000.00,
    currency: "USD",
    auto_recharge_enabled: true,
    auto_recharge_threshold: 500.00,
    auto_recharge_amount: 2000.00,
  },
  "AC_RESELLER_1001": {
    sid: "wallet_002",
    business_sid: "AC_RESELLER_1001",
    balance: 15000.00,
    credit_limit: 50000.00,
    currency: "USD",
    auto_recharge_enabled: true,
    auto_recharge_threshold: 5000.00,
    auto_recharge_amount: 10000.00,
  },
};

const transactions: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business_sid, amount, reference } = body;

    if (!business_sid || !amount) {
      return NextResponse.json(
        { detail: "business_sid and amount are required" },
        { status: 400 }
      );
    }

    const wallet = wallets[business_sid];
    if (!wallet) {
      return NextResponse.json(
        { detail: `Wallet not found for business ${business_sid}` },
        { status: 404 }
      );
    }

    // Add funds
    wallet.balance += amount;

    // Record transaction
    transactions.push({
      sid: `tx_${Date.now()}`,
      business_sid,
      type: "TOPUP",
      amount,
      currency: wallet.currency,
      reference: reference || "manual-topup",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(wallet, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Top-up failed" },
      { status: 500 }
    );
  }
}
