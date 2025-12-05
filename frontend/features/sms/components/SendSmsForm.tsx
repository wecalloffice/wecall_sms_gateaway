"use client";
import { useForm } from "react-hook-form";
import { useSmsStore } from "@/stores/smsStore";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RecipientType = "manual" | "contact" | "group";

export default function SendSmsForm() {
  const contacts = useSmsStore((state) => state.contacts);
  const groups = useSmsStore((state) => state.groups);
  const sendSms = useSmsStore((state) => state.sendSms);
  const getContactsByIds = useSmsStore((state) => state.getContactsByIds);
  
  const [recipientType, setRecipientType] = useState<RecipientType>("manual");
  const [selectedContactId, setSelectedContactId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [senderId, setSenderId] = useState("WeCall");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRecipientTypeChange = (type: RecipientType) => {
    setRecipientType(type);
    setSelectedContactId("");
    setSelectedGroupId("");
    setRecipientPhone("");
  };

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setRecipientPhone(contact.phone);
    }
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const groupContacts = getContactsByIds(group.contactIds);
      const phones = groupContacts.map(c => c.phone).join(", ");
      setRecipientPhone(phones);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMessage(null);

    try {
      // Get phone numbers
      let phonesToSend: string[] = [];
      
      if (recipientType === "group" && selectedGroupId) {
        const group = groups.find(g => g.id === selectedGroupId);
        if (group) {
          const groupContacts = getContactsByIds(group.contactIds);
          phonesToSend = groupContacts.map(c => c.phone);
        }
      } else {
        phonesToSend = recipientPhone.split(",").map(p => p.trim()).filter(p => p);
      }

      if (phonesToSend.length === 0) {
        throw new Error("Please select or enter at least one recipient");
      }

      // Send SMS
      await sendSms({
        to: phonesToSend,
        message,
        senderId,
      });

      setStatusMessage({
        type: "success",
        text: `Message sent successfully to ${phonesToSend.length} recipient(s)!`,
      });

      // Reset form
      setRecipientPhone("");
      setMessage("");
      setSelectedContactId("");
      setSelectedGroupId("");
      setRecipientType("manual");
    } catch (error: any) {
      setStatusMessage({
        type: "error",
        text: error.message || "Failed to send SMS. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Recipient Type Selector */}
      <div className="space-y-2">
        <Label>Recipient Type</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={recipientType === "manual" ? "default" : "outline"}
            onClick={() => handleRecipientTypeChange("manual")}
            className="flex-1"
          >
            Manual Entry
          </Button>
          <Button
            type="button"
            variant={recipientType === "contact" ? "default" : "outline"}
            onClick={() => handleRecipientTypeChange("contact")}
            className="flex-1"
          >
            From Contacts
          </Button>
          <Button
            type="button"
            variant={recipientType === "group" ? "default" : "outline"}
            onClick={() => handleRecipientTypeChange("group")}
            className="flex-1"
          >
            From Group
          </Button>
        </div>
      </div>

      {/* Recipient Input */}
      <div className="space-y-2">
        <Label htmlFor="to">Recipient(s)</Label>
        {recipientType === "manual" && (
          <Input
            id="to"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            placeholder="+1234567890 (comma-separated for multiple)"
            required
          />
        )}
        {recipientType === "contact" && (
          <Select value={selectedContactId} onValueChange={handleContactSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts?.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name} - {contact.phone}
                </SelectItem>
              ))}
              {contacts.length === 0 && (
                <div className="px-2 py-1 text-sm text-gray-500">No contacts available</div>
              )}
            </SelectContent>
          </Select>
        )}
        {recipientType === "group" && (
          <>
            <Select value={selectedGroupId} onValueChange={handleGroupSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups?.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.contactIds.length} members)
                  </SelectItem>
                ))}
                {groups.length === 0 && (
                  <div className="px-2 py-1 text-sm text-gray-500">No groups available</div>
                )}
              </SelectContent>
            </Select>
            {selectedGroupId && (
              <p className="text-xs text-gray-500">
                Will send to {recipientPhone.split(",").length} contact(s)
              </p>
            )}
          </>
        )}
      </div>

      {/* Sender ID */}
      <div className="space-y-2">
        <Label htmlFor="senderId">Sender ID</Label>
        <Input
          id="senderId"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          placeholder="WeCall"
          required
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-y"
          required
        />
        <p className="text-xs text-gray-500">
          {message.length} characters
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSending}>
        {isSending ? "Sending..." : "Send SMS"}
      </Button>

      {/* Status Messages */}
      {statusMessage && (
        <div className={`p-3 rounded-md ${
          statusMessage.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          <p className="text-sm">{statusMessage.text}</p>
        </div>
      )}
    </form>
  );
}
