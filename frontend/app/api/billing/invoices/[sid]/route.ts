import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sid: string }> }
) {
  const { sid } = await params;

  if (!sid || sid === "undefined") {
    return NextResponse.json(
      { detail: "Invalid business SID" },
      { status: 400 }
    );
  }

  // Generate mock invoice based on SID
  const isReseller = sid.includes("RESELLER");
  const mockInvoice = {
    sid: `inv_${sid}`,
    business_sid: sid,
    invoice_number: `INV-2025-${isReseller ? "RES" : "CLI"}-001`,
    period_start: "2025-11-01",
    period_end: "2025-11-30",
    total_amount: isReseller ? 625.50 : 385.75,
    currency: "USD",
    status: isReseller ? "PENDING" : "PAID",
    due_date: "2025-12-15",
    paid_date: isReseller ? null : "2025-11-28",
    line_items: isReseller ? [
      {
        description: "SMS Charges (12000 SMS @ $0.04)",
        quantity: 12000,
        unit_price: 0.04,
        total: 480.00,
      },
      {
        description: "Platform Fee",
        quantity: 1,
        unit_price: 100.00,
        total: 100.00,
      },
      {
        description: "Volume Discount (15%)",
        quantity: 1,
        unit_price: -45.00,
        total: -45.00,
      },
    ] : [
      {
        description: "SMS Charges (5000 SMS @ $0.05)",
        quantity: 5000,
        unit_price: 0.05,
        total: 250.00,
      },
      {
        description: "Platform Fee",
        quantity: 1,
        unit_price: 50.00,
        total: 50.00,
      },
      {
        description: "Volume Discount (10%)",
        quantity: 1,
        unit_price: -30.00,
        total: -30.00,
      },
    ],
  };

  return NextResponse.json(mockInvoice);
}
