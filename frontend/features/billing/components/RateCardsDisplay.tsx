"use client";

import React, { useMemo, useState } from "react";
import type { RateCard } from "../types";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

type RateCardsDisplayProps = {
  rateCards: RateCard[];
  loading?: boolean;
};

type CountryGroup = {
  country_code: string;
  country_name: string;
  operators: RateCard[];
};

export const RateCardsDisplay: React.FC<RateCardsDisplayProps> = ({
  rateCards,
  loading = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Group by country
  const groupedByCountry = useMemo(() => {
    const groups: Record<string, CountryGroup> = {};

    rateCards.forEach((card) => {
      if (!groups[card.country_code]) {
        groups[card.country_code] = {
          country_code: card.country_code,
          country_name: card.country_name,
          operators: [],
        };
      }
      groups[card.country_code].operators.push(card);
    });

    return Object.values(groups);
  }, [rateCards]);

  const countries = useMemo(
    () => groupedByCountry.map((g) => ({ value: g.country_code, label: g.country_name })),
    [groupedByCountry]
  );

  const selectedCountryGroup = useMemo(
    () =>
      selectedCountry
        ? groupedByCountry.find((g) => g.country_code === selectedCountry)
        : groupedByCountry[0],
    [selectedCountry, groupedByCountry]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Rate Cards</h2>
        <p className="text-sm text-gray-600">SMS pricing by country and operator</p>
      </div>

      {/* Country selector */}
      {countries.length > 1 && (
        <div className="flex gap-2">
          <label className="text-sm font-medium text-gray-700">Country:</label>
          <select
            value={selectedCountry ?? ""}
            onChange={(e) => setSelectedCountry(e.target.value || null)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {countries.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Rate cards table */}
      {selectedCountryGroup && (
        <Card className="overflow-hidden">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {selectedCountryGroup.country_name}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Operator
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">
                      Price per SMS
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">
                      Effective From
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCountryGroup.operators.map((card) => (
                    <tr
                      key={card.sid}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-gray-900">{card.operator}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        ${card.price_per_sms.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {new Date(card.effective_from).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedCountryGroup.operators.length === 0 && (
              <p className="text-center text-gray-500">No operators found for this country</p>
            )}
          </div>
        </Card>
      )}

      {/* No data */}
      {rateCards.length === 0 && (
        <Card className="p-6">
          <p className="text-center text-gray-500">No rate cards available</p>
        </Card>
      )}
    </div>
  );
};
