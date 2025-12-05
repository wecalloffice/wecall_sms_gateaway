'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { mockAccounts } from '@/mocks/adapters/mockAccounts';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { EditClientModal } from '@/components/modals/EditClientModal';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [resellers, setResellers] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const allClients = await mockAccounts.listClients();
      setClients(allClients);
      setFilteredClients(allClients);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        (client.business_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (client.business_username?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (client.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleAddClient = async (data: any) => {
    try {
      // Get first reseller for demo
      const reseller = await mockAccounts.getReseller('AC_RESELLER_1001');
      if (!reseller) throw new Error('No reseller found');
      await mockAccounts.createClient(data, reseller.account_sid);
      alert('Client added successfully!');
      await fetchClients();
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const handleEditClient = async (data: any) => {
    try {
      await mockAccounts.updateClient(selectedClient.sid, data);
      alert('Client updated successfully!');
      setIsEditModalOpen(false);
      setSelectedClient(null);
      await fetchClients();
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const handleDeleteClient = async (sid: string, name: string) => {
    if (!confirm(`Are you sure you want to delete client "${name}"?`)) return;

    try {
      await mockAccounts.deleteClient(sid);
      alert('Client deleted successfully!');
      await fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error deleting client');
    }
  };

  const openEditModal = (client: any) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  return (
    <MainLayout role="PLATFORM_ADMIN" businessName="WeCall Platform" userName="Admin User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Manage all clients across resellers</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Client
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Active Clients</p>
            <p className="text-2xl font-bold text-green-600">
              {clients.filter(c => c.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Inactive Clients</p>
            <p className="text-2xl font-bold text-gray-900">
              {clients.filter(c => c.status !== 'active').length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search clients by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Clients ({filteredClients.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No clients found</td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.sid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.business_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{client.business_username}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{client.contact_person}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => openEditModal(client)}
                          className="text-primary hover:text-primary-dark inline-flex items-center gap-1"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.sid, client.business_name)}
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

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddClient}
        resellerName="Default Reseller"
      />

      {/* Edit Client Modal */}
      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={handleEditClient}
        clientData={selectedClient}
      />
    </MainLayout>
  );
}
