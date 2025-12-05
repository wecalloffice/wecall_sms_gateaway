"use client";

import MainLayout from "@/components/ui/layout/MainLayout";
import { useSmsStore, Contact } from "@/stores/smsStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function GroupsPage() {
  const groups = useSmsStore((state) => state.groups);
  const contacts = useSmsStore((state) => state.contacts);
  const addGroup = useSmsStore((state) => state.addGroup);
  const deleteGroup = useSmsStore((state) => state.deleteGroup);
  const getContactsByIds = useSmsStore((state) => state.getContactsByIds);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", contactIds: [] as string[] });

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    addGroup({
      name: newGroup.name,
      description: newGroup.description || undefined,
      contactIds: newGroup.contactIds,
    });
    setNewGroup({ name: "", description: "", contactIds: [] });
    setIsAddDialogOpen(false);
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm("Are you sure you want to delete this group?")) {
      deleteGroup(id);
    }
  };

  const handleManageMembers = (group: any) => {
    setSelectedGroup(group);
    setIsManageMembersOpen(true);
  };

  const toggleContactInGroup = (contactId: string) => {
    setNewGroup(prev => ({
      ...prev,
      contactIds: prev.contactIds.includes(contactId)
        ? prev.contactIds.filter(id => id !== contactId)
        : [...prev.contactIds, contactId]
    }));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Contact Groups</h1>
            <p className="text-sm text-gray-500 mt-1">
              {groups.length} total groups
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create New Group</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGroup} className="space-y-4">
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="Marketing Team"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="Team members for marketing campaigns"
                  />
                </div>
                
                <div>
                  <Label>Select Contacts</Label>
                  <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                    {contacts?.map((contact: Contact) => (
                      <div key={contact.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`contact-${contact.id}`}
                          checked={newGroup.contactIds.includes(contact.id)}
                          onChange={() => toggleContactInGroup(contact.id)}
                          className="rounded"
                        />
                        <label htmlFor={`contact-${contact.id}`} className="cursor-pointer flex-1">
                          {contact.name} - {contact.phone}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {newGroup.contactIds.length} contact(s) selected
                  </p>
                </div>
                
                <Button type="submit" className="w-full">Create Group</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group) => {
            const groupContacts = getContactsByIds(group.contactIds);
            return (
            <div key={group.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                  )}
                  <Badge variant="secondary" className="mt-2">
                    {group.contactIds.length} members
                  </Badge>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">MEMBERS:</p>
                <div className="space-y-1">
                  {groupContacts.slice(0, 3).map((contact) => (
                    <p key={contact.id} className="text-sm text-gray-600">
                      • {contact.name}
                    </p>
                  ))}
                  {group.contactIds.length > 3 && (
                    <p className="text-xs text-gray-400">
                      +{group.contactIds.length - 3} more...
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleManageMembers(group)}
                >
                  View Members
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          )})}
        </div>

        {groups?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No groups created yet. Create your first group!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
