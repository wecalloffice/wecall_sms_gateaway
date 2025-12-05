import { NextRequest, NextResponse } from "next/server";

const rateCards = [
  {
    sid: "rate_001",
    name: "Domestic SMS",
    description: "SMS within country",
    rate: 0.05,
    currency: "USD",
    sms_type: "SMS",
    region: "DOMESTIC",
    min_volume: 0,
  },
  {
    sid: "rate_002",
    name: "International SMS",
    description: "SMS to international numbers",
    rate: 0.15,
    currency: "USD",
    sms_type: "SMS",
    region: "INTERNATIONAL",
    min_volume: 0,
  },
  {
    sid: "rate_003",
    name: "Bulk Domestic",
    description: "Bulk SMS within country (5% discount)",
    rate: 0.0475,
    currency: "USD",
    sms_type: "SMS",
    region: "DOMESTIC",
    min_volume: 1000,
  },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(rateCards);
}
