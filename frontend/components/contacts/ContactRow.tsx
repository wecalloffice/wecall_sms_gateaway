"use client";

import { Edit, Trash2 } from "lucide-react";

export function ContactRow({ contact, onDelete }: any) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">{contact.name}</td>
      <td className="px-6 py-4">{contact.email}</td>
      <td className="px-6 py-4">{contact.phone}</td>
      <td className="px-6 py-4">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
          {contact.group}
        </span>
      </td>
      <td className="px-6 py-4">{contact.added}</td>

      <td className="px-6 py-4 space-x-2">
        <button className="text-primary inline-flex items-center gap-1">
          <Edit size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className="text-red-600 inline-flex items-center gap-1"
        >
          <Trash2 size={16} /> Delete
        </button>
      </td>
    </tr>
  );
}
