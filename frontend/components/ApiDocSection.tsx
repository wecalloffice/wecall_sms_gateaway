export default function ApiDocSection() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">API Documentation</h2>

      <div className="space-y-4">
        {[
          { title: "Send SMS", endpoint: "POST /api/v1/sms/send" },
          { title: "Get Message Status", endpoint: "GET /api/v1/sms/{message_id}" },
          { title: "List Messages", endpoint: "GET /api/v1/sms/list" },
        ].map((item) => (
          <div key={item.title} className="border-l-4 border-primary pl-4">
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <code className="text-sm text-gray-600">{item.endpoint}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
