"use client";

import { ContactRow } from "./ContactRow";

export function ContactsTable({ contacts, onDelete }: any) {
  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">
          Contact List ({contacts.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Name", "Email", "Phone", "Group", "Added", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-xs text-gray-500 uppercase text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {contacts.map((c: any) => (
              <ContactRow key={c.id} contact={c} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
