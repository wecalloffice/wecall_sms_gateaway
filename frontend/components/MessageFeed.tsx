"use client";

import React from "react";
import { Card } from "./ui/card";

interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

interface MessageFeedProps {
  messages: Message[];
}

export default function MessageFeed({ messages }: MessageFeedProps) {
  return (
    <Card className="h-full">
      <h2 className="text-lg font-semibold mb-3">Recent Messages</h2>

      <div className="flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-3 rounded-lg bg-gray-50 border text-sm"
          >
            <p className="font-medium">{msg.sender}</p>
            <p className="text-gray-700">{msg.message}</p>
            <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
