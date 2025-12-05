import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sid: string }> }
) {
  const { sid } = await params;

  // Handle missing/invalid SID
  if (!sid || sid === "undefined") {
    return NextResponse.json(
      { detail: "Invalid business SID" },
      { status: 400 }
    );
  }

  // Generate mock wallet data based on the SID
  const isReseller = sid.includes("RESELLER");
  const mockWallet = {
    sid: `wallet_${sid}`,
    business_sid: sid,
    balance: isReseller ? 15000.00 : 5000.00,
    credit_limit: isReseller ? 50000.00 : 10000.00,
    currency: "USD",
    auto_recharge_enabled: true,
    auto_recharge_threshold: isReseller ? 5000.00 : 500.00,
    auto_recharge_amount: isReseller ? 10000.00 : 2000.00,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-12-04T14:00:00Z",
  };

  return NextResponse.json(mockWallet);
}
