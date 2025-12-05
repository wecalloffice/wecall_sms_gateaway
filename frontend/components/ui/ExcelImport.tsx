"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSmsStore } from "@/stores/smsStore";
import * as XLSX from "xlsx";

interface ExcelImportProps {
  onImportComplete?: (count: number) => void;
}

export default function ExcelImport({ onImportComplete }: ExcelImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bulkAddContacts = useSmsStore((state) => state.bulkAddContacts);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      
      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Parse and validate contacts
      const contacts = jsonData.map((row: any, index: number) => {
        // Support various column name formats
        const name = row.name || row.Name || row.NAME || row.full_name || row["Full Name"] || `Contact ${index + 1}`;
        const phone = row.phone || row.Phone || row.PHONE || row.number || row.Number || row.mobile || row.Mobile;
        const email = row.email || row.Email || row.EMAIL || "";
        const company = row.company || row.Company || row.COMPANY || "";
        const tags = row.tags || row.Tags || row.TAGS || "";

        if (!phone) {
          throw new Error(`Row ${index + 1}: Phone number is required`);
        }

        return {
          name: String(name).trim(),
          phone: String(phone).trim(),
          email: email ? String(email).trim() : undefined,
          company: company ? String(company).trim() : undefined,
          tags: tags ? String(tags).split(",").map((t: string) => t.trim()) : undefined,
        };
      });

      if (contacts.length === 0) {
        throw new Error("No contacts found in the file");
      }

      // Add contacts to store
      const added = bulkAddContacts(contacts);
      
      onImportComplete?.(added.length);
      
      // Reset input
      event.target.value = "";
    } catch (err: any) {
      console.error("Import error:", err);
      setError(err.message || "Failed to import contacts");
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Create template worksheet
    const template = [
      {
        name: "John Doe",
        phone: "+1234567890",
        email: "john@example.com",
        company: "Acme Corp",
        tags: "client,vip",
      },
      {
        name: "Jane Smith",
        phone: "+0987654321",
        email: "jane@example.com",
        company: "Tech Solutions",
        tags: "partner",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    // Download
    XLSX.writeFile(workbook, "contacts_template.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={downloadTemplate}
          className="flex-1"
        >
          📥 Download Template
        </Button>
        
        <Button
          type="button"
          variant="default"
          disabled={isImporting}
          className="flex-1"
          onClick={() => document.getElementById("excel-upload")?.click()}
        >
          {isImporting ? "Importing..." : "📤 Import from Excel"}
        </Button>
      </div>
      
      <input
        id="excel-upload"
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Supported formats:</strong> .xlsx, .xls, .csv</p>
        <p><strong>Required columns:</strong> name, phone</p>
        <p><strong>Optional columns:</strong> email, company, tags (comma-separated)</p>
      </div>
    </div>
  );
}
