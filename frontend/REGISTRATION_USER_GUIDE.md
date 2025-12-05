# Registration Feature - User Guide & Demo

## Quick Start

### How to Register as a New Client

1. **Visit Login Page**
   - Navigate to: `http://localhost:3000/login`

2. **Click "Create New Account"**
   - Located in green box below demo credentials
   - Button labeled: "Create New Account"

3. **Fill Registration Form**
   ```
   Account Type:        CLIENT
   Business Username:   myclient
   Business Name:       My Client Company
   Contact Person:      John Smith
   Email:              john@myclient.com
   Phone:              +1-555-0123
   Country:            United States
   Password:           MySecurePassword123!
   Confirm Password:   MySecurePassword123!
   ```

4. **Submit**
   - Click "Create Account" button
   - See success message with green checkmark
   - Automatically redirected to login after 2 seconds

5. **Login with New Account**
   - Username: `myclient`
   - Password: `MySecurePassword123!`
   - Access dashboard as CLIENT_ADMIN

---

### How to Register as a New Reseller

1. **Visit Login Page**
   - Navigate to: `http://localhost:3000/login`

2. **Click "Create New Account"**

3. **Fill Registration Form**
   ```
   Account Type:        RESELLER ← Select this radio button
   Business Username:   acmereseller
   Business Name:       ACME Reseller Inc
   Contact Person:      Jane Doe
   Email:              jane@acmereseller.com
   Phone:              +1-555-0456
   Country:            United States
   Password:           AnotherSecurePass456!
   Confirm Password:   AnotherSecurePass456!
   ```

4. **Submit**
   - Click "Create Account" button
   - See success message
   - Auto-redirect to login

5. **Login with New Account**
   - Username: `acmereseller`
   - Password: `AnotherSecurePass456!`
   - Access dashboard as RESELLER_ADMIN

---

## Form Fields Explained

### Business Type (Required)
- **CLIENT**: Direct SMS sender, limited to own account
- **RESELLER**: Can manage sub-customers, access billing & routing

### Business Username (Required)
- Used to login
- Must be unique (no duplicates allowed)
- Case-sensitive
- Min 3 characters recommended

### Business Name (Required)
- Your company's official name
- Displayed in dashboard and reports

### Contact Person (Required)
- Primary contact for this account
- Used in support communications

### Email (Required)
- Must be valid email format
- Validated on client side
- Used for notifications (future feature)

### Phone (Optional)
- Contact phone number
- Format: +1-555-0123 recommended

### Country (Optional)
- Business location
- Used for compliance and routing

### Password (Required)
- Minimum 8 characters recommended
- Use mix of letters, numbers, symbols
- Must match confirmation field

### Confirm Password (Required)
- Must match password field exactly
- Error if they don't match

---

## Success Message Flow

```
┌─────────────────────────────────────────────┐
│     FORM SUBMITTED                          │
│   (All fields validated)                    │
└──────────────┬──────────────────────────────┘
               ↓
        ┌──────────────────┐
        │   Validation     │
        │   ✓ Email format │
        │   ✓ Passwords    │
        │   ✓ Required     │
        │   ✓ Unique       │
        └──────────┬───────┘
                   ↓
        ┌──────────────────────────┐
        │   Account Created        │
        │   ├─ Generate account_sid│
        │   ├─ Add timestamp       │
        │   └─ Store in localStorage
        └──────────┬───────────────┘
                   ↓
     ┌─────────────────────────────────┐
     │  ✅ SUCCESS MESSAGE SHOWN        │
     │  "Registration successful!"      │
     │  "Redirecting to login..."       │
     │  [Green banner, 2 sec timer]     │
     └──────────────┬──────────────────┘
                    ↓
       ┌────────────────────────┐
       │  Auto-Redirect         │
       │  → /login              │
       │  (after 2 seconds)     │
       └────────────┬───────────┘
                    ↓
       ┌────────────────────────┐
       │  Login Page Displayed  │
       │  Ready to login with   │
       │  new credentials       │
       └────────────────────────┘
```

---

## Error Handling

### Validation Errors
| Error | Cause | Solution |
|-------|-------|----------|
| "Please fill all required fields" | Missing required field | Complete all fields with * |
| "Please enter a valid email address" | Invalid email format | Use format: name@domain.com |
| "Passwords do not match" | Confirm password different | Ensure both passwords identical |
| "Username already exists" | Username taken | Choose different username |

### Display
- Red banner with alert icon
- Clear error message in English
- Error persists until corrected and resubmitted

---

## Demo Test Cases

### Test Case 1: Happy Path (Client)
```
Input:
  Type: CLIENT
  Username: testclient1
  Name: Test Client Company
  Person: Test User
  Email: test@client.com
  Phone: +1-555-0001
  Country: USA
  Password: Test@Pass123

Expected:
  ✅ Success message appears
  ✅ Form resets
  ✅ Redirects to login
  ✅ Can login with username: testclient1
```

### Test Case 2: Happy Path (Reseller)
```
Input:
  Type: RESELLER
  Username: testreseller1
  Name: Test Reseller Corp
  Person: Reseller Manager
  Email: reseller@test.com
  Phone: +1-555-0002
  Country: USA
  Password: Reseller@Pass456

Expected:
  ✅ Success message appears
  ✅ Form resets
  ✅ Redirects to login
  ✅ Can login with username: testreseller1
  ✅ Dashboard shows RESELLER features
```

### Test Case 3: Password Mismatch
```
Input:
  ... all fields ...
  Password: MyPassword123
  Confirm: MyPassword456  ← Different

Expected:
  ❌ Error: "Passwords do not match"
  ❌ Red banner with alert icon
  ❌ Form remains for correction
```

### Test Case 4: Invalid Email
```
Input:
  ... all fields ...
  Email: notanemail  ← Invalid format

Expected:
  ❌ Error: "Please enter a valid email address"
  ❌ Red banner displayed
  ❌ Form remains open
```

### Test Case 5: Duplicate Username
```
Scenario:
  1. Register: username "acme"
  2. Register again: username "acme" ← Same

Expected on attempt 2:
  ❌ Error: "Username already exists"
  ❌ Red banner displayed
  ❌ Form remains, suggest different username
```

### Test Case 6: Missing Required Field
```
Input:
  ... all fields filled except Email is blank ...

Expected:
  ❌ Error: "Please fill all required fields"
  ❌ Email field highlighted
  ❌ Form remains open
```

---

## Technical Details

### Storage Format (localStorage)
```javascript
// localStorage['mockAccounts'] - Array of registered accounts
[
  {
    "business_username": "myclient",
    "business_name": "My Client Company",
    "business_type": "CLIENT",
    "contact_person": "John Smith",
    "contact_email": "john@myclient.com",
    "contact_phone": "+1-555-0123",
    "country": "United States",
    "password": "MySecurePassword123!",
    "account_sid": "AC_MYCLIENT",
    "created_at": "2025-12-04T10:30:00.000Z"
  },
  {
    "business_username": "acmereseller",
    "business_name": "ACME Reseller Inc",
    "business_type": "RESELLER",
    "contact_person": "Jane Doe",
    "contact_email": "jane@acmereseller.com",
    "contact_phone": "+1-555-0456",
    "country": "United States",
    "password": "AnotherSecurePass456!",
    "account_sid": "AC_ACMERESELLER",
    "created_at": "2025-12-04T10:35:00.000Z"
  }
]
```

### Account SID Generation
- Formula: `AC_{USERNAME_UPPERCASE}`
- Example: username "myclient" → `AC_MYCLIENT`
- Example: username "acmereseller" → `AC_ACMERESELLER`

### Role Assignment on Login
- CLIENT business_type → `CLIENT_ADMIN` role
- RESELLER business_type → `RESELLER_ADMIN` role
- PLATFORM_ADMIN role only available for demo admin account

---

## Integration Notes

### Current Implementation (Mock)
- Accounts stored in browser localStorage
- Data persists during session
- Clears on browser cache clear or private browsing exit
- Demo accounts (admin, kcb, rdb) still work as fallback

### Future Backend Integration
Replace mock calls with:
```javascript
// Replace in features/auth/api.ts
export async function registerBusiness(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || "Registration failed");
  }
  
  return res.json();
}
```

---

## Troubleshooting

### Issue: Registration button not showing on login page
**Solution**: Check that `/login` page loads correctly. Try:
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check console for errors (F12)

### Issue: Form won't submit
**Solution**: Ensure:
1. All required fields (marked with *) are filled
2. Password and confirm password match exactly
3. Email is in valid format (name@domain.com)
4. No console errors (F12 → Console tab)

### Issue: Can't login after registration
**Solution**:
1. Verify username is correct (case-sensitive)
2. Try the exact password entered
3. Clear localStorage and re-register:
   ```javascript
   localStorage.clear()
   // Then refresh and register again
   ```

### Issue: Registered account doesn't persist
**Solution**:
- In private/incognito mode, localStorage may be limited
- Try in normal browsing mode
- Check localStorage is enabled in browser settings

---

## Feature Roadmap

### ✅ Phase 1: Basic Registration (COMPLETE)
- Self-registration form
- Form validation
- Mock persistence
- Login integration

### 🔄 Phase 2: Enhancements (Next)
- Email verification
- Admin approval workflow
- Account tier selection
- CAPTCHA protection

### 🔜 Phase 3: Advanced (Future)
- Two-factor authentication
- Identity verification
- Referral system
- Social login

---

## Screenshots & UI Elements

### Registration Button (Login Page)
```
┌────────────────────────────────────────┐
│   Don't have an account yet?           │
│                                        │
│   ┌──────────────────────────────────┐ │
│   │  🟢 Create New Account           │ │
│   └──────────────────────────────────┘ │
│                                        │
│   Resellers and Clients can           │
│   self-register here                  │
└────────────────────────────────────────┘
```

### Business Type Selection
```
┌──────────────────────┬──────────────────────┐
│  ⭕ Client           │  ⭕ Reseller         │
│  Direct SMS sender   │  Serve your customers│
└──────────────────────┴──────────────────────┘
```

### Success Message
```
┌────────────────────────────────────────┐
│  ✅ Registration successful!           │
│  Redirecting to login...               │
│                                        │
│  [2 second timer showing...]           │
└────────────────────────────────────────┘
```

### Error Message
```
┌────────────────────────────────────────┐
│  ⚠️  Passwords do not match.            │
│  Please re-enter and try again.        │
└────────────────────────────────────────┘
```

---

## Support & Questions

For issues or questions about the registration feature:
1. Check this documentation first
2. Review test cases above
3. Check browser console (F12) for errors
4. Try different browser or incognito mode
5. Clear localStorage if data seems corrupted

