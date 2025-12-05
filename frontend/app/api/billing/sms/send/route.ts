import { NextRequest, NextResponse } from "next/server";
import billing from "@/lib/billing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, to, message, count } = body;

    if (!businessId || !to || !message) {
      return NextResponse.json(
        { error: "Missing required fields: businessId, to, message" },
        { status: 400 }
      );
    }

    // Get SMS price based on phone number (country + operator)
    const pricePerSms = billing.getSMSPriceForPhone(to);
    const smsCount = count || 1; // number of SMS parts (160 chars = 1 part)
    const totalCost = pricePerSms * smsCount;

    // Debit wallet
    const result = billing.debitWallet(businessId, totalCost, `SMS sent to ${to}`, {
      to,
      message,
      smsCount,
      pricePerSms,
    });

    return NextResponse.json({
      success: true,
      wallet: result.wallet,
      transaction: result.transaction,
      smsDetails: {
        to,
        count: smsCount,
        pricePerSms,
        totalCost,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
