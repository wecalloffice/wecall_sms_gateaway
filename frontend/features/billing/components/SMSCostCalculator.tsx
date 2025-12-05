"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SMSCostCalculatorProps {
  businessId: string;
  onCostChange?: (cost: number, parts: number) => void;
}

export default function SMSCostCalculator({ businessId, onCostChange }: SMSCostCalculatorProps) {
  const [message, setMessage] = useState<string>("");
  const [pricing, setPricing] = useState<any>(null);
  const [cost, setCost] = useState<number>(0);
  const [parts, setParts] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch("/api/billing/pricing");
        if (!res.ok) throw new Error("Failed to load pricing");
        const data = await res.json();
        setPricing(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  useEffect(() => {
    if (!pricing) return;

    // Calculate number of SMS parts (160 chars per part for GSM, 70 for Unicode)
    const isUnicode = /[^\x00-\x7F]/.test(message); // Check for non-ASCII chars
    const charsPerPart = isUnicode ? 70 : 160;
    const messageLength = message.length;
    const calculatedParts = messageLength === 0 ? 1 : Math.ceil(messageLength / charsPerPart);
    setParts(calculatedParts);

    // Calculate cost
    const perSms = pricing.basePrice * (1 + (pricing.resellerMargin || 0) + (pricing.clientMargin || 0));
    const totalCost = perSms * calculatedParts;
    setCost(totalCost);

    onCostChange?.(totalCost, calculatedParts);
  }, [message, pricing, onCostChange]);

  if (loading) return <p className="text-gray-500 text-sm">Loading pricing...</p>;

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
      <h3 className="font-semibold text-sm mb-3">SMS Cost Calculator</h3>

      <div className="space-y-3">
        {/* Message Preview */}
        <div>
          <Label className="text-xs font-medium text-gray-600 mb-1 block">Message Preview</Label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            maxLength={918}
            className="w-full p-2 border rounded text-sm bg-white resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length} / {parts > 1 ? `${parts * 160}` : "160"} characters
          </p>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">SMS Parts</p>
              <p className="font-bold text-lg text-gray-800">{parts}</p>
            </div>
            <div>
              <p className="text-gray-600">Cost per Part</p>
              <p className="font-bold text-lg text-gray-800">
                ${(pricing.basePrice * (1 + (pricing.resellerMargin || 0) + (pricing.clientMargin || 0))).toFixed(4)}
              </p>
            </div>
          </div>

          {/* Total Cost */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-gray-600 text-xs">Total Cost</p>
            <p className="font-bold text-2xl text-blue-600">${cost.toFixed(4)}</p>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-white p-2 rounded text-xs text-gray-600 border border-gray-200">
          <p>
            <span className="font-medium">Base:</span> ${pricing.basePrice.toFixed(4)} |{" "}
            <span className="font-medium">Reseller Margin:</span> {(pricing.resellerMargin * 100).toFixed(1)}% |{" "}
            <span className="font-medium">Client Margin:</span> {(pricing.clientMargin * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </Card>
  );
}
