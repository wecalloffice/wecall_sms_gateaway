"use client";

import { UserPlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactsHeader({ openAddModal }: { openAddModal: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Contacts</h1>
        <p className="text-gray-600">Manage your contact lists</p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline">
          <Upload className="w-4 h-4" /> Import CSV
        </Button>

        <Button onClick={openAddModal}>
          <UserPlus className="w-4 h-4" /> Add Contact
        </Button>
      </div>
    </div>
  );
}
