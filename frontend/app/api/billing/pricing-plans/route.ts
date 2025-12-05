import { NextRequest, NextResponse } from "next/server";

const pricingPlans = [
  {
    sid: "plan_001",
    name: "Starter",
    description: "Perfect for getting started",
    base_price: 0,
    per_sms_price: 0.05,
    min_volume: 0,
    max_volume: 1000,
    discount_percentage: 0,
    features: ["Basic SMS", "Up to 1000 SMS/month"],
  },
  {
    sid: "plan_002",
    name: "Professional",
    description: "For growing businesses",
    base_price: 50,
    per_sms_price: 0.04,
    min_volume: 1001,
    max_volume: 10000,
    discount_percentage: 10,
    features: ["Advanced SMS", "Up to 10k SMS/month", "Priority support"],
  },
  {
    sid: "plan_003",
    name: "Enterprise",
    description: "For large-scale operations",
    base_price: 200,
    per_sms_price: 0.03,
    min_volume: 10001,
    max_volume: null,
    discount_percentage: 20,
    features: ["Unlimited SMS", "24/7 Support", "API Access", "Custom integrations"],
  },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(pricingPlans);
}
