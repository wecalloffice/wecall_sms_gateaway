"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

import { ContactsHeader } from "@/components/contacts/ContactsHeader";
import { ContactsStats } from "@/components/contacts/ContactsStats";
import { ContactsSearch } from "@/components/contacts/ContactsSearch";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { AddContactModal } from "@/components/modals/AddContactModal";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Alice Brown", phone: "+250712345678", email: "alice@example.com", group: "Customers", added: "2024-01-15" },
    { id: 2, name: "Bob Wilson", phone: "+250723456789", email: "bob@example.com", group: "Partners", added: "2024-01-16" },
    { id: 3, name: "Carol Davis", phone: "+250734567890", email: "carol@example.com", group: "Staff", added: "2024-01-17" },
  ]);

  const [filtered, setFiltered] = useState(contacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddContact = (data: any) => {
    const newContact = {
      id: Math.max(...contacts.map((c) => c.id), 0) + 1,
      ...data,
      added: new Date().toLocaleDateString(),
    };
    setContacts((prev) => [...prev, newContact]);
    setFiltered((prev) => [...prev, newContact]);
  };

  const handleDeleteContact = (id: number) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    setFiltered(updated);
  };

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        
        <ContactsHeader openAddModal={() => setIsAddModalOpen(true)} />

        <ContactsStats contacts={contacts} />

        <ContactsSearch
          value={searchTerm}
          contacts={contacts}
          onChange={setSearchTerm}
          onSearch={setFiltered}
        />

        <ContactsTable contacts={filtered} onDelete={handleDeleteContact} />

      </div>

      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (data) => handleAddContact(data)}
        userType="client"
      />
    </MainLayout>
  );
}
