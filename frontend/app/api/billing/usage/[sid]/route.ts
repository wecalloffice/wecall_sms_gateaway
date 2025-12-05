import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sid: string }> }
) {
  const { sid } = await params;
  const period = (req.nextUrl.searchParams.get("period") || "THIS_MONTH") as string;

  if (!sid || sid === "undefined") {
    return NextResponse.json(
      { detail: "Invalid business SID" },
      { status: 400 }
    );
  }

  // Generate mock metrics based on SID
  const isReseller = sid.includes("RESELLER");
  const mockMetrics = {
    business_sid: sid,
    period: period,
    sms_sent: isReseller ? 12500 : 5250,
    sms_failed: isReseller ? 250 : 120,
    sms_delivered: isReseller ? 12250 : 5130,
    total_cost: isReseller ? 625.00 : 287.50,
    currency: "USD",
    start_date: "2025-12-01",
    end_date: "2025-12-04",
    average_per_day: isReseller ? 3125 : 1312.5,
  };

  return NextResponse.json(mockMetrics);
}
