"use client";

import MainLayout from "@/components/ui/layout/MainLayout";
import { useSmsStore } from "@/stores/smsStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ExcelImport from "@/components/ui/ExcelImport";
import * as XLSX from "xlsx";

export default function ContactsPage() {
  const contacts = useSmsStore((state) => state.contacts);
  const addContact = useSmsStore((state) => state.addContact);
  const updateContact = useSmsStore((state) => state.updateContact);
  const deleteContact = useSmsStore((state) => state.deleteContact);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    tags: "",
  });

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    addContact({
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email || undefined,
      company: newContact.company || undefined,
      tags: newContact.tags
        ? newContact.tags.split(",").map((t) => t.trim())
        : undefined,
    });
    setNewContact({ name: "", phone: "", email: "", company: "", tags: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditContact = (contact: any) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || "",
      company: contact.company || "",
      tags: contact.tags?.join(", ") || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      updateContact(editingContact.id, {
        name: newContact.name,
        phone: newContact.phone,
        email: newContact.email || undefined,
        company: newContact.company || undefined,
        tags: newContact.tags
          ? newContact.tags.split(",").map((t) => t.trim())
          : undefined,
      });
      setEditingContact(null);
      setNewContact({ name: "", phone: "", email: "", company: "", tags: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      deleteContact(id);
    }
  };

  const handleExportToExcel = () => {
    const exportData = contacts.map((contact) => ({
      Name: contact.name,
      Phone: contact.phone,
      Email: contact.email || "",
      Company: contact.company || "",
      Tags: contact.tags?.join(", ") || "",
      "Created At": new Date(contact.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    XLSX.writeFile(workbook, `contacts_export_${Date.now()}.xlsx`);
  };

  const handleImportComplete = (count: number) => {
    setIsImportDialogOpen(false);
    alert(`Successfully imported ${count} contacts!`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Contacts</h1>
            <p className="text-sm text-gray-500 mt-1">
              {contacts.length} total contacts
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportToExcel}>
              📊 Export to Excel
            </Button>

            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">📤 Import from Excel</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Contacts from Excel</DialogTitle>
                </DialogHeader>
                <ExcelImport onImportComplete={handleImportComplete} />
              </DialogContent>
            </Dialog>

            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  setEditingContact(null);
                  setNewContact({ name: "", phone: "", email: "", company: "", tags: "" });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>➕ Add Contact</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingContact ? "Edit Contact" : "Add New Contact"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={editingContact ? handleUpdateContact : handleAddContact}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) =>
                        setNewContact({ ...newContact, name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) =>
                        setNewContact({ ...newContact, phone: e.target.value })
                      }
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) =>
                        setNewContact({ ...newContact, email: e.target.value })
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newContact.company}
                      onChange={(e) =>
                        setNewContact({ ...newContact, company: e.target.value })
                      }
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={newContact.tags}
                      onChange={(e) =>
                        setNewContact({ ...newContact, tags: e.target.value })
                      }
                      placeholder="client, vip, partner"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingContact ? "Update Contact" : "Save Contact"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No contacts yet. Add your first contact or import from Excel!
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{contact.name}</td>
                    <td className="px-6 py-4">{contact.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contact.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contact.company || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags?.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContact(contact)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
