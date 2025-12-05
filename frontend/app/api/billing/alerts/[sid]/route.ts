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

  // Generate mock alerts based on SID
  const isReseller = sid.includes("RESELLER");
  const mockAlerts = isReseller
    ? [
        {
          sid: `alert_001_${sid}`,
          business_sid: sid,
          type: "INVOICE_PENDING",
          severity: "INFO",
          message: "Your invoice for November 2025 is pending payment.",
          created_at: "2025-12-01T08:00:00Z",
          read: false,
        },
        {
          sid: `alert_002_${sid}`,
          business_sid: sid,
          type: "API_QUOTA_WARNING",
          severity: "WARNING",
          message: "You have used 80% of your monthly API quota.",
          created_at: "2025-12-04T14:00:00Z",
          read: false,
        },
      ]
    : [
        {
          sid: `alert_001_${sid}`,
          business_sid: sid,
          type: "LOW_BALANCE",
          severity: "WARNING",
          message: "Your wallet balance is below $1000. Consider topping up.",
          created_at: "2025-12-04T10:30:00Z",
          read: false,
        },
        {
          sid: `alert_002_${sid}`,
          business_sid: sid,
          type: "HIGH_FAILURE_RATE",
          severity: "CRITICAL",
          message: "SMS failure rate exceeded 5%. Please check your message content.",
          created_at: "2025-12-04T09:15:00Z",
          read: true,
        },
      ];

  return NextResponse.json(mockAlerts);
}
