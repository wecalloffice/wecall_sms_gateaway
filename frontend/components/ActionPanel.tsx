"use client";

import React from "react";
import { Button } from "./ui/button";
import { MessageSquare, Plus, Rocket } from "lucide-react";

export default function ActionPanel() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button>
        <MessageSquare className="w-4 h-4" />
        Send SMS
      </Button>
      <Button>
        <Rocket className="w-4 h-4" />
        New Campaign
      </Button>
      <Button>
        <Plus className="w-4 h-4" />
        Add Contact
      </Button>
    </div>
  );
}
