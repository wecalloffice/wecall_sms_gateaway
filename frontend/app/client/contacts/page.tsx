'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Users, UserPlus, Search, Upload, Edit, Trash2 } from 'lucide-react';
import { AddContactModal } from '@/components/modals/AddContactModal';

export default function ClientContactsPage() {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Alice Brown', phone: '+250712345678', email: 'alice@example.com', group: 'Customers', added: '2024-01-15' },
    { id: 2, name: 'Bob Wilson', phone: '+250723456789', email: 'bob@example.com', group: 'Partners', added: '2024-01-16' },
    { id: 3, name: 'Carol Davis', phone: '+250734567890', email: 'carol@example.com', group: 'Staff', added: '2024-01-17' },
  ]);

  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddContact = async (data: any) => {
    const newContact = {
      id: Math.max(...contacts.map(c => c.id), 0) + 1,
      ...data,
      added: new Date().toLocaleDateString(),
    };
    setContacts([...contacts, newContact]);
    setFilteredContacts([...filteredContacts, newContact]);
    alert('Contact added successfully!');
  };

  const handleDeleteContact = (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    setFilteredContacts(updated);
    alert('Contact deleted successfully!');
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = contacts.filter(c =>
      c.name.toLowerCase().includes(value.toLowerCase()) ||
      c.phone.includes(value) ||
      c.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-1">Manage your contact lists</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <Upload size={20} />
              Import CSV
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus size={20} />
              Add Contact
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
              <Users size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contact Groups</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(contacts.map(c => c.group)).size}</p>
              </div>
              <Users size={32} className="text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Added This Month</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
              <UserPlus size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Contact List ({filteredContacts.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No contacts found</td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contact.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contact.phone}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {contact.group}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contact.added}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button 
                          onClick={() => alert('Edit functionality coming soon')}
                          className="text-primary hover:text-primary-dark inline-flex items-center gap-1"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddContact}
        userType="client"
      />
    </MainLayout>
  );
}
