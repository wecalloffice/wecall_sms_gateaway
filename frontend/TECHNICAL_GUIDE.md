# 🔧 Technical Implementation Guide

## SMS Sending Module - Technical Deep Dive

### Architecture Overview

```
┌─────────────────────────────────────────────┐
│         SMS Sending Pages                   │
│  /platform/sms  /reseller/sms  /client/sms │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│     React Component (useState/useEffect)    │
│  - Form state (to, from, message)           │
│  - Messages array (from adapter)            │
│  - Statistics state                         │
│  - Filter states                            │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│     Mock SMS Adapter                        │
│  mockSms.send()                             │
│  mockSms.sendBulk()                         │
│  mockSms.list()                             │
│  mockSms.getStats()                         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│     In-Memory Message Store                 │
│  wecallMockData.messages[]                  │
│  (persists during session)                  │
└─────────────────────────────────────────────┘
```

### Data Flow - Single SMS

```
User Input
  ↓
[Recipient: +250712345678] [Message: Hello] [Send]
  ↓
handleSend() triggered
  ↓
Validate: recipient & message not empty
  ↓
setLoading(true) → show spinner
  ↓
Detect bulk: split(',').length === 1 (single)
  ↓
Call mockSms.send({
  business_sid: role-specific,
  reseller_sid: role-specific,
  to: "+250712345678",
  from: "SENDER_ID",
  message: "Hello",
  price: 0.015-0.018,
  gateway: "jasmin-*"
})
  ↓
Adapter creates message object:
{
  sid: "SM0001",
  to: "+250712345678",
  message: "Hello",
  status: "queued",
  created_at: ISO timestamp,
  price: 0.018,
  sms_parts: 1
}
  ↓
setTimeout(() => { status → "sent" → "delivered" }, 1000-3000ms)
  ↓
unshift() message to array (newest first)
  ↓
setFormData reset, setLoading(false)
  ↓
fetchMessages() called
  ↓
messages state updated
  ↓
Table re-renders
  ↓
Stats auto-refresh (interval running every 2s anyway)
  ↓
User sees message in table with status badge
```

### Data Flow - Bulk SMS

```
User Input
  ↓
[Recipients: +250712345678, +250722345678, +250732345678]
[Message: Promotion]
[Send]
  ↓
handleSend() triggered
  ↓
Validate
  ↓
Detect bulk: split(',').filter(r => r.trim()).length === 3
  ↓
setSendingBulk(true) → show "Sending bulk SMS to 3 recipients"
  ↓
Call mockSms.sendBulk({
  business_sid: ...,
  reseller_sid: ...,
  to: "+250712345678, +250722345678, +250732345678",
  from: "SENDER_ID",
  message: "Promotion",
  price: 0.018,
  ...
})
  ↓
Adapter loop: for each recipient
  ├─ Create message object
  ├─ Set status: "queued"
  ├─ unshift() to messages array
  ├─ Simulate delivery (setTimeout)
  └─ return array of message objects
  ↓
Return response:
{
  total: 3,
  messages: [msg1, msg2, msg3],
  timestamp: ISO
}
  ↓
setFormData reset
  ↓
fetchMessages()
  ↓
All 3 messages appear in table
  ↓
User sees real-time status transitions for each message
```

### Data Flow - Real-Time Status Update

```
Message sent (queued) at T=0ms
  ↓
setTimeout(1000ms) → setTimeout(1000-3000ms random)
  ↓
At T=1500-3500ms:
  ├─ simulateDelivery() called
  ├─ Pick random status: sent (67%) or failed (33%)
  ├─ message.status = "sent"
  ├─ message.dlr_received_at = now
  └─ Update in array (reference)
  ↓
Auto-refresh interval (every 2 seconds):
  ├─ fetchMessages() called
  ├─ mockSms.list() returns updated array
  ├─ setMessages(data) triggers re-render
  └─ Status badge updates
  ↓
User sees: queued → sent → delivered
```

### State Management Pattern

```typescript
// Form state
const [formData, setFormData] = useState({
  to: '',          // Recipient(s)
  from: '',        // Sender ID
  message: '',     // Message text
});

// Data states
const [messages, setMessages] = useState<Message[]>([]);
const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
const [stats, setStats] = useState({...});

// UI states
const [loading, setLoading] = useState(false);        // Show spinner
const [error, setError] = useState('');               // Show error
const [sendingBulk, setSendingBulk] = useState(false); // Show bulk message

// Filter states
const [filterStatus, setFilterStatus] = useState('all');
const [filterBusiness, setFilterBusiness] = useState('all');

// Effects
useEffect(() => {
  fetchMessages();
  const interval = setInterval(fetchMessages, 2000);
  return () => clearInterval(interval);
}, []); // Runs once on mount

useEffect(() => {
  // Apply filters to messages
  let filtered = messages;
  if (filterStatus !== 'all') {
    filtered = filtered.filter(m => m.status === filterStatus);
  }
  setFilteredMessages(filtered);
}, [messages, filterStatus]); // Re-run when dependencies change
```

### Component Lifecycle

```
Mount
  │
  ├─ fetchMessages() called
  │
  ├─ Start interval: setInterval(fetchMessages, 2000)
  │
  └─ Render UI
      ├─ Form (input fields)
      ├─ Statistics cards
      ├─ Filter dropdowns
      └─ Message table

User Interaction
  ├─ Type in form fields → setFormData()
  ├─ Select filter → setFilterStatus()
  ├─ Click Send → handleSend()
  │   ├─ Validate
  │   ├─ Call mockSms
  │   ├─ Clear form
  │   └─ fetchMessages()
  │
  └─ Interval triggers every 2s
      └─ fetchMessages()
          ├─ mockSms.list()
          ├─ mockSms.getStats()
          └─ Re-render with new data

Unmount
  │
  └─ clearInterval() cleanup function runs
```

### Error Handling

```typescript
// Validation before send
if (!formData.to.trim() || !formData.message.trim()) {
  setError('Please fill in all fields');
  return;
}

// Try-catch on operations
try {
  await mockSms.send(payload);
  // Success - clear error
  setError('');
  // Refresh data
  await fetchMessages();
} catch (err) {
  // Error - show to user
  setError('Failed to send SMS. Please try again.');
  console.error(err);
}

// Show error message
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <p className="text-red-700 text-sm">{error}</p>
  </div>
)}
```

### Loading States

```typescript
// Disable form while loading
<button disabled={loading} className="disabled:opacity-50">
  {loading ? <Loader className="animate-spin" /> : <Send />}
  {loading ? 'Sending...' : 'Send SMS'}
</button>

// Show bulk message
{sendingBulk && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
    <p className="text-blue-700 text-sm">
      📤 Sending bulk SMS to {count} recipients...
    </p>
  </div>
)}

// Show spinner while fetching
{loading ? (
  <tr><td colSpan={7}>Loading...</td></tr>
) : messages.length === 0 ? (
  <tr><td colSpan={7}>No messages yet</td></tr>
) : (
  messages.map(msg => <MessageRow key={msg.sid} msg={msg} />)
)}
```

### Message Object Structure

```typescript
interface Message {
  sid: string;              // "SM0001" - unique ID
  business_sid: string;     // "AC_CLIENT_001" - who sent it
  reseller_sid: string;     // "AC_RESELLER_1001" - which reseller
  direction: "outbound";    // always outbound for this system
  from: string;             // "SMS_SENDER" - sender ID
  to: string;               // "+250712345678" - recipient
  message: string;          // "Hello World" - SMS text
  status: "queued" | "sent" | "delivered" | "failed";
  price: number;            // 0.015, 0.016, or 0.018
  currency: "USD";
  gateway: string;          // "jasmin-primary"
  created_at: string;       // ISO timestamp "2025-12-04T..."
  dlr_received_at?: string; // ISO timestamp when delivered
  sms_parts: number;        // 1-3+ depending on message length
}
```

### SMS Parts Calculation

```typescript
// Formula: parts = Math.ceil(messageLength / 160)

Examples:
- 1-160 characters = 1 SMS part
- 161-320 characters = 2 SMS parts
- 321-480 characters = 3 SMS parts

Actual code:
const smsParts = Math.ceil(formData.message.length / 160);

Display:
<span>{smsParts} SMS</span>
// Shows: "1 SMS", "2 SMS", etc.
```

### Pricing Calculation

```typescript
// Per-message cost based on role
const pricing = {
  PLATFORM_ADMIN: 0.015,  // $0.015 per SMS
  RESELLER_ADMIN: 0.016,  // $0.016 per SMS
  CLIENT_ADMIN: 0.018,    // $0.018 per SMS
};

// Total cost calculation
const totalCost = messages.reduce((sum, msg) => {
  return sum + (msg.price || 0);
}, 0);

// Bulk send cost
// Example: 3 SMS @ $0.018 = $0.054
// Each message charged separately
```

### Filtering Logic

```typescript
// Status filtering
if (filterStatus !== 'all') {
  filtered = filtered.filter(m => m.status === filterStatus);
}

// Business filtering (platform only)
if (filterBusiness !== 'all') {
  filtered = filtered.filter(m => m.business_sid === filterBusiness);
}

// Reseller filtering (automatic by role)
if (role === 'RESELLER_ADMIN') {
  filtered = messages.filter(m => m.reseller_sid === 'AC_RESELLER_1001');
}

// Client filtering (automatic by role)
if (role === 'CLIENT_ADMIN') {
  filtered = messages.filter(m => m.business_sid === 'AC_CLIENT_001');
}
```

### Status Badge Styling

```typescript
const getStatusBadge = (status: string) => {
  const styles = {
    delivered: 'bg-green-100 text-green-800',   // Light green
    sent: 'bg-blue-100 text-blue-800',          // Light blue
    failed: 'bg-red-100 text-red-800',          // Light red
    queued: 'bg-yellow-100 text-yellow-800',    // Light yellow
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
};

// Usage
<span className={`px-2 py-1 text-xs rounded font-medium ${getStatusBadge(msg.status)}`}>
  {msg.status}
</span>
```

### Bulk Detection Logic

```typescript
const recipientCount = formData.to
  .split(',')                    // Split by comma
  .map(r => r.trim())            // Trim whitespace
  .filter(r => r)                // Remove empty strings
  .length;

if (recipientCount > 1) {
  // Bulk send
  setSendingBulk(true);
  await mockSms.sendBulk(payload);
} else {
  // Single send
  await mockSms.send(payload);
}

// Display to user
{recipientCount > 1 && (
  <p className="text-xs text-gray-500 mt-1">
    ✓ Bulk mode: {recipientCount} recipients
  </p>
)}
```

### Adapter Methods

```typescript
// Single send
mockSms.send({
  business_sid: 'AC_CLIENT_001',
  reseller_sid: 'AC_RESELLER_1001',
  to: '+250712345678',
  from: 'SMS_SENDER',
  message: 'Hello',
  price: 0.018,
  gateway: 'jasmin-primary'
}) → Promise<Message>

// Bulk send
mockSms.sendBulk({
  business_sid: 'AC_CLIENT_001',
  reseller_sid: 'AC_RESELLER_1001',
  to: '+250712345678, +250722345678',
  from: 'SMS_SENDER',
  message: 'Hello',
  price: 0.018,
  gateway: 'jasmin-primary'
}) → Promise<{ total, messages[], timestamp }>

// List messages
mockSms.list({
  business_sid: 'AC_CLIENT_001',
  reseller_sid: 'AC_RESELLER_1001',
  status: 'delivered'
}) → Promise<Message[]>

// Get stats
mockSms.getStats('AC_CLIENT_001') → Promise<{
  total: number,
  sent: number,
  delivered: number,
  failed: number,
  queued: number,
  total_cost: number
}>
```

### Time Calculations

```typescript
// Format timestamp
new Date(msg.created_at).toLocaleTimeString()
// Result: "2:45:30 PM" or "14:45:30" depending on locale

new Date(msg.created_at).toLocaleString()
// Result: "12/4/2025, 2:45:30 PM"

// Delivery time simulation
setTimeout(() => simulateDelivery(msg), 1000 + Math.random() * 2000);
// Wait 1-3 seconds before marking as sent/delivered
```

### Performance Considerations

```typescript
// 1. Interval cleanup
useEffect(() => {
  const interval = setInterval(fetchMessages, 2000);
  return () => clearInterval(interval); // Prevent memory leak
}, []);

// 2. Filter dependencies
useEffect(() => {
  let filtered = messages;
  // ... filtering logic
  setFilteredMessages(filtered);
}, [messages, filterStatus]); // Only re-run when these change

// 3. Batch operations
// Bulk send: multiple messages in one call
// Vs. single sends in a loop (slower)
await mockSms.sendBulk(payload); // Faster
vs
for (const to of recipients) {
  await mockSms.send({ ...payload, to }); // Slower
}
```

### TypeScript Types

```typescript
interface Message {
  sid: string;
  from: string;
  to: string;
  message: string;
  status: string;
  price: number;
  created_at: string;
  sms_parts: number;
  business_sid?: string;
  reseller_sid?: string;
}

interface Stats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  queued: number;
  total_cost: number;
}

interface SendPayload {
  business_sid: string;
  reseller_sid: string;
  to: string;
  from: string;
  message: string;
  price: number;
  gateway: string;
}

interface BulkResponse {
  total: number;
  messages: Message[];
  timestamp: string;
}
```

---

## Testing Scenarios

### Unit Test: Send Single SMS
```typescript
test('should send single SMS', async () => {
  const payload = {
    business_sid: 'AC_CLIENT_001',
    reseller_sid: 'AC_RESELLER_1001',
    to: '+250712345678',
    from: 'TEST',
    message: 'Hello',
    price: 0.018,
    gateway: 'jasmin-primary'
  };
  
  const result = await mockSms.send(payload);
  
  expect(result.status).toBe('queued');
  expect(result.to).toBe('+250712345678');
  expect(result.message).toBe('Hello');
});
```

### Integration Test: Send and Track
```typescript
test('should update status over time', async (done) => {
  const result = await mockSms.send(payload);
  const initialStatus = result.status;
  
  setTimeout(() => {
    const msg = mockSms.getMessage(result.sid);
    expect(msg.status).not.toBe(initialStatus);
    done();
  }, 2000);
});
```

---

## Debugging

### Console Logs Available
```javascript
// Check DevTools Console (F12)
console.log('mockSms operations')
console.log('Message sent:', msg)
console.log('Stats updated:', stats)
```

### Check Component State
```javascript
// DevTools React extension
// View: messages, stats, loading, error, filterStatus
```

### Network Activity
```javascript
// DevTools Network tab
// None (all in-memory, no API calls)
```

---

**Version:** 2.0
**Date:** December 4, 2025
**Status:** Complete
