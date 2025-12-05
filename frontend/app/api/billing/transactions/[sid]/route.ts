import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sid: string }> }
) {
  const { sid } = await params;
  const limit = req.nextUrl.searchParams.get("limit")
    ? parseInt(req.nextUrl.searchParams.get("limit")!)
    : 50;

  if (!sid || sid === "undefined") {
    return NextResponse.json(
      { detail: "Invalid business SID" },
      { status: 400 }
    );
  }

  // Generate mock transactions based on the SID
  const isReseller = sid.includes("RESELLER");
  const mockTransactions = [
    {
      sid: `tx_${sid}_001`,
      business_sid: sid,
      type: "TOPUP",
      amount: isReseller ? 5000.00 : 500.00,
      currency: "USD",
      reference: "manual-topup",
      created_at: "2025-12-04T10:00:00Z",
    },
    {
      sid: `tx_${sid}_002`,
      business_sid: sid,
      type: "SMS_DEBIT",
      amount: -(isReseller ? 1250.00 : 250.00),
      currency: "USD",
      reference: "sms-batch-001",
      created_at: "2025-12-04T11:00:00Z",
    },
    {
      sid: `tx_${sid}_003`,
      business_sid: sid,
      type: "SMS_DEBIT",
      amount: -(isReseller ? 750.00 : 150.00),
      currency: "USD",
      reference: "sms-batch-002",
      created_at: "2025-12-04T12:00:00Z",
    },
  ];

  const filtered = mockTransactions.slice(0, limit);

  return NextResponse.json(filtered);
}
