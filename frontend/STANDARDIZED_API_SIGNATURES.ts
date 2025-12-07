/**
 * STANDARDIZED API SIGNATURES & PARAMETER NAMING
 * ==============================================
 * 
 * This file documents the standardized signatures across all mock adapters,
 * API layers, and hooks in the billing/accounts/messaging modules.
 * 
 * KEY STANDARDS:
 * 
 * 1. PARAMETER NAMING
 *    - Use snake_case for API params: business_sid (not businessId)
 *    - Use PascalCase for interfaces: TopupPayload, LoginPayload
 *    - Use camelCase for function params in local functions
 * 
 * 2. ACCOUNT IDENTIFIER
 *    - Primary: business_sid (string) - matches wecallMockData schema
 *    - Never: businessId, businessUsername, clientId
 *    - Context: account_sid in wecallMockData structure
 * 
 * 3. STANDARDIZED PAYLOADS
 * 
 *    BILLING:
 *      interface TopupPayload {
 *        business_sid: string;
 *        amount: number;
 *        reference?: string;
 *      }
 * 
 *    AUTH:
 *      interface LoginPayload {
 *        business_username: string;
 *        email: string;
 *        password: string;
 *      }
 *      returns: { access: string; refresh: string; user: {...} }
 * 
 *    SMS:
 *      mockSms.list(business_sid: string) → BillingTransaction[]
 *      mockSms.send(payload: SendSmsPayload) → { sid: string }
 * 
 * 4. TYPE IMPORTS
 *    - Source: features/billing/types.ts (authoritative)
 *    - Types: Wallet, BillingTransaction, Invoice, etc.
 *    - Never use old: Wallet (camelCase), Transaction
 * 
 * 5. API LAYER OPTIONS
 * 
 *    PRODUCTION (real backend):
 *      → Use: features/billing/api-clean.ts
 *      → Endpoint prefix: /api/billing/
 *      → No mock fallback
 * 
 *    DEVELOPMENT (with mock support):
 *      → Use: features/billing/api.unified.ts
 *      → Checks: NEXT_PUBLIC_USE_MOCK_BILLING env var
 *      → Falls back to mockBilling adapter when enabled
 * 
 *    HOOKS (recommended for components):
 *      → Use: features/billing/hooks.ts
 *      → Examples: useWallet(businessSid), useTransactions(businessSid)
 *      → Handles loading/error states automatically
 * 
 * 6. MOCK ADAPTERS
 *    All in mocks/adapters/:
 *    - mockAuth.ts: login(payload) → { access, refresh, user }
 *    - mockAccounts.ts: getResellers(), getClients(reseller_sid)
 *    - mockSms.ts: list(business_sid), send(payload)
 *    - mockBilling.ts: wallet(business_sid), transactions(business_sid)
 *    - mockRouting.ts: routes(), connectors()
 *    - mockObservability.ts: events()
 *    - mockStaff.ts: list(business_sid)
 * 
 * 7. WECALLMOCKDATA SCHEMA
 *    Location: mocks/data/wecallMockData.ts
 *    Keys: resellers[], messages[], billing{ wallets[], transactions[] }, routing{}, observability{}, etc.
 *    All use snake_case: account_sid, business_sid, created_at, etc.
 * 
 * 8. MIGRATION CHECKLIST
 *    ✓ Replace all businessId with business_sid
 *    ✓ Replace all description with reference (in billing)
 *    ✓ Replace all meta with details (in observations)
 *    ✓ Update component imports to use hooks.ts
 *    ✓ Remove old api.ts, api-clean.ts from direct imports
 *    ✓ Use api.unified.ts for new features needing mock support
 *    ✓ Verify all types from authoritative types.ts
 */

export {};
