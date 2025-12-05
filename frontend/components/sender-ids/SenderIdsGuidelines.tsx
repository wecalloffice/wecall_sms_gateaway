"use client";

export function SenderIdsGuidelines() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 mb-2">Sender ID Guidelines</h3>
      <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
        <li>Sender IDs must be 3-11 characters long</li>
        <li>Only alphanumeric characters are allowed</li>
        <li>Approval typically takes 2-3 business days</li>
        <li>Ensure your brand name matches registration documents</li>
      </ul>
    </div>
  );
}
