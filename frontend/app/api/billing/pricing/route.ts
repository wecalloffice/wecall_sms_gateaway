import { NextRequest, NextResponse } from "next/server";
import billing from "@/lib/billing";

export async function GET(req: NextRequest) {
  try {
    const providerPricing = billing.getProviderPricing();
    return NextResponse.json({ providerPricing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { providerPricing } = body;

    if (!Array.isArray(providerPricing)) {
      return NextResponse.json(
        { error: "providerPricing must be an array" },
        { status: 400 }
      );
    }

    const updated = billing.setProviderPricing(providerPricing);
    return NextResponse.json({ providerPricing: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
