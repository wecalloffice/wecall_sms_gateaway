"use client";

import React from "react";
import type { PricingPlan, VolumeTier } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PricingDisplayProps = {
  plans: PricingPlan[];
  loading?: boolean;
};

export const PricingDisplay: React.FC<PricingDisplayProps> = ({
  plans,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Pricing Plans</h2>
        <p className="text-sm text-gray-600">Choose a plan that fits your needs</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          // Defensive fallbacks because API returns per_sms_price instead of base_price_per_sms
          const price = (plan as any)?.base_price_per_sms ?? (plan as any)?.per_sms_price ?? 0;
          const planType = plan.type ?? "PREPAID";

          return (
          <Card key={plan.sid} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900">
                  ${Number(price).toFixed(4)}
                </p>
                <p className="text-xs text-gray-500">per SMS</p>
              </div>

              {/* Type badge */}
              <Badge className="w-fit">
                {planType.replace(/_/g, " ")}
              </Badge>

              {/* Volume tiers if available */}
              {plan.volume_tiers && plan.volume_tiers.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Volume Discounts
                  </p>
                  <ul className="space-y-1 text-xs">
                    {plan.volume_tiers.map((tier, idx) => (
                      <li key={idx} className="text-gray-600">
                        <span>
                          {tier.min_messages?.toLocaleString?.() ?? tier.min_messages ?? 0} -
                          {tier.max_messages
                            ? ` ${tier.max_messages.toLocaleString()}`
                            : " ∞"}{" "}
                          messages
                        </span>
                        <span className="ml-2 font-semibold">
                          ${Number(tier.price_per_sms ?? 0).toFixed(4)}/SMS
                        </span>
                        {tier.discount_percent && (
                          <span className="ml-2 text-green-600">
                            ({tier.discount_percent}% off)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Features
                  </p>
                  <ul className="space-y-1">
                    {(plan.features ?? []).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="text-green-600">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action button */}
              <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Learn More
              </button>
            </div>
          </Card>
          );
        })}
      </div>
    </div>
  );
};
