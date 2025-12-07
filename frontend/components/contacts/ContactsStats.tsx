"use client";

import { Users, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ContactsStats({ contacts }: any) {
  const groups = new Set(contacts.map((c: any) => c.group));

  const Stat = ({ label, value, icon: Icon }: any) => (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className="w-8 h-8 text-primary" />
      </div>
    </Card>
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Stat label="Total Contacts" value={contacts.length} icon={Users} />
      <Stat label="Contact Groups" value={groups.size} icon={Users} />
      <Stat label="Added This Month" value={contacts.length} icon={UserPlus} />
    </div>
  );
}
