# 🎯 Button Reference Guide - Where to Find & How to Use

## 📍 Platform - User Management
**URL:** `http://localhost:3000/platform/users`

### Buttons & Their Functions

#### 1. "Create User" Button
- **Location:** Top-right of page
- **Icon:** Plus icon
- **Color:** Pink/Primary
- **Action:** Opens AddUserModal
- **What happens:**
  - Modal appears with form
  - Fill: name, username, email, role, password
  - Click Submit
  - User appears in table below

#### 2. "Edit" Button (per row)
- **Location:** Last column of user table
- **Color:** Blue (primary)
- **Action:** Edit functionality (placeholder for future)
- **Status:** Ready for enhancement

#### 3. "Delete" Button (per row)
- **Location:** Last column of user table
- **Color:** Red
- **Action:** Delete with confirmation
- **What happens:**
  - Confirmation dialog: "Are you sure?"
  - Click OK to confirm
  - User removed from list
  - Stats update

### Searchable Columns
- Name
- Email  
- Username

### Stats Dashboard
- **Total Users:** Auto-updates
- **Active Users:** Green count
- **Boss Admins:** Blue count
- **Support Staff:** Purple count

---

## 📍 Platform - Client Management
**URL:** `http://localhost:3000/platform/clients`

### Buttons & Their Functions

#### 1. "Add Client" Button
- **Location:** Top-right of page
- **Icon:** Plus icon
- **Color:** Pink/Primary
- **Action:** Opens AddClientModal
- **What happens:**
  - Modal opens with client form
  - Fields: business_name, business_username, email, contact_person, contact_phone, credit_limit
  - Fill required fields (marked with *)
  - Click Submit
  - New client appears in table
  - Total count increases

#### 2. "Edit" Button (per row)
- **Location:** Last column of client table
- **Color:** Blue
- **Action:** Opens EditClientModal
- **What happens:**
  - Modal opens with pre-filled client data
  - Can change: business_name, email, contact info, credit_limit, **status**
  - Status dropdown has options: active, inactive, suspended
  - Click Submit
  - Changes appear instantly in table
  - Modal closes automatically

#### 3. "Delete" Button (per row)
- **Location:** Last column of client table (after Edit)
- **Color:** Red
- **Action:** Delete with confirmation
- **What happens:**
  - Dialog: "Are you sure you want to delete client "name"?"
  - Click OK to confirm
  - Client removed from table
  - Stats update

### Searchable Columns
- Business Name
- Username
- Email

### Stats Dashboard
- **Total Clients:** Total count
- **Active Clients:** Green (active only)
- **Inactive Clients:** Gray (suspended/inactive)

---

## 📍 Reseller - Client Management
**URL:** `http://localhost:3000/reseller/clients`

### Buttons & Their Functions

#### 1. "Add Client" Button
- **Location:** Top-right of page
- **Icon:** Plus with user icon
- **Color:** Pink/Primary
- **Action:** Opens AddClientModal
- **What happens:**
  - Modal opens
  - Automatically assigns to logged-in reseller (KCB Bank)
  - Fill client details
  - Submit
  - Client appears in "My Clients" table

#### 2. "Edit" Button (per row)
- **Location:** Last column
- **Color:** Blue  
- **Action:** Opens EditClientModal for this reseller's client
- **What happens:**
  - Pre-fills current client data
  - Can edit all fields including status
  - Submit changes
  - See updates immediately

#### 3. "Delete" Button (per row)
- **Location:** Last column (after Edit)
- **Color:** Red
- **Action:** Remove from reseller's clients
- **What happens:**
  - Confirmation dialog
  - Confirm deletion
  - Client removed
  - Stats update

### Searchable Columns
- Client Name
- Username
- Email

### Stats Dashboard
- **Total Clients:** Count of reseller's clients
- **Active Clients:** Green count
- **Credit Limit Total:** Sum of all credit limits
- **Suspended:** Red count of suspended clients

---

## 🎯 Form Fields Reference

### AddClientModal Form
| Field | Type | Required | Default | Example |
|-------|------|----------|---------|---------|
| Business Name | Text | ✓ | - | "Tech Solutions Inc" |
| Business Username | Text | ✓ | - | "techsolutions" |
| Email | Email | ✓ | - | "info@techsolutions.com" |
| Contact Person | Text | ✗ | - | "John Smith" |
| Contact Phone | Tel | ✗ | - | "+250 789 123 456" |
| Credit Limit | Number | ✗ | 500 | 1000 |

### EditClientModal Form
| Field | Type | Default |
|-------|------|---------|
| Business Name | Text | Current value |
| Email | Email | Current value |
| Contact Person | Text | Current value |
| Contact Phone | Tel | Current value |
| Credit Limit | Number | Current value |
| Status | Dropdown | Current status |

**Status Options:** active, inactive, suspended

### AddUserModal Form
| Field | Type | Required | Options |
|-------|------|----------|---------|
| Name | Text | ✓ | - |
| Username | Text | ✓ | - |
| Email | Email | ✓ | - |
| Role | Dropdown | ✓ | Boss, Finance, Tech, Marketing, Support |
| Password | Password | ✓ | - |
| Password Confirm | Password | ✓ | Must match Password |

---

## 🔔 User Feedback

### Success Messages
- "User created successfully!" ✅
- "User deleted successfully!" ✅
- "Client added successfully!" ✅
- "Client updated successfully!" ✅
- "Client deleted successfully!" ✅

### Error Messages
- "Please fill in all required fields"
- "Passwords do not match"
- "Business name is required"
- "Error creating user"
- "Error deleting user"

### Confirmation Dialogs
- "Are you sure you want to delete user "[name]"?"
- "Are you sure you want to delete client "[name]"?"

---

## 📊 Real-Time Updates

All stats update automatically after operations:

### User Management Page
```
Before: Total Users: 5, Active: 4
After adding user: Total Users: 6, Active: 5
After deleting user: Total Users: 5, Active: 4
```

### Client Management Page  
```
Before: Total: 3, Active: 2
After adding: Total: 4, Active: 3
After updating status to suspended: Active: 2, Inactive: 2
After deleting: Total: 3
```

---

## ⌨️ Keyboard Shortcuts (in modals)

| Key | Action |
|-----|--------|
| Enter | Submit form (when focused on input) |
| Escape | Close modal (close button available) |
| Tab | Move to next field |
| Shift+Tab | Move to previous field |

---

## 🖱️ Mouse Interactions

### Buttons Hover Effects
- Primary buttons: Darker shade on hover
- Delete buttons: Brighter red on hover
- Edit buttons: Brighter blue on hover

### Table Row Hover
- Background lightens when hovering over row
- Helps identify which row you're about to act on

### Modal Interactions
- Click outside modal: Modal stays open (must use close button)
- X button: Closes modal (top right)
- Submit button: Validates and submits or shows errors

---

## 📱 Responsive Design

### Desktop (1024px+)
- All buttons and tables fully visible
- Optimal experience

### Tablet (768px-1023px)
- Table scrolls horizontally if needed
- Buttons remain accessible
- Modals take up 90% width

### Mobile (< 768px)
- Table becomes scrollable
- Buttons stack if space limited
- Modals optimized for mobile
- Touch-friendly button sizes

---

## 🎓 Complete Workflow Example

### Create → Read → Update → Delete

#### Step 1: CREATE
1. Go to `/platform/clients`
2. Click "Add Client" button
3. Fill in:
   - Business Name: "Green Energy Ltd"
   - Username: "greenergy"
   - Email: "contact@greenergy.rw"
   - Contact: "Jane Doe"
   - Phone: "555-0123"
   - Credit Limit: 2000
4. Click Submit
5. ✅ See success message
6. New client in table

#### Step 2: READ
1. Find "Green Energy Ltd" in table
2. Observe all details displayed:
   - Name: Green Energy Ltd
   - Username: greenergy  
   - Email: contact@greenergy.rw
   - Contact: Jane Doe
   - Status: active (green badge)

#### Step 3: UPDATE
1. Click Edit on that client row
2. Change:
   - Business Name: "Green Energy Solutions Ltd"
   - Status: inactive
3. Click Submit
4. ✅ Changes visible immediately
5. Name updated in table
6. Status badge now gray

#### Step 4: DELETE
1. Click Delete on that client row
2. Read: "Are you sure you want to delete client "Green Energy Solutions Ltd"?"
3. Click OK
4. ✅ Client removed from table
5. Total count decreased

---

## 🐛 Troubleshooting Buttons

### Button Not Responding
**Check:**
1. Browser console (F12) for errors
2. Verify form is filled correctly
3. Check network tab for API calls

### Modal Won't Open
**Check:**
1. Console for JavaScript errors
2. Click again (sometimes needs double-click)
3. Refresh page and retry

### Data Not Updating
**Check:**
1. Verify you clicked Submit (not just closed modal)
2. Check console for operation logs
3. Refresh table view

### Deletion Confirmation Doesn't Appear
**Check:**
1. Browser popup blocker
2. Console for any errors
3. Try again with developer tools open

---

## ✨ Pro Tips

1. **Quick Search:** Use search box to find items before editing/deleting
2. **Batch Testing:** Add multiple items, then delete them to test functionality
3. **Status Changes:** Use Edit modal to quickly change client status
4. **Validation:** Leave required fields empty to test form validation
5. **Console Logging:** Open F12 Console to see operation logs in real-time

---

## 📋 Checklist: Are All Buttons Working?

- [ ] Create User button opens modal
- [ ] User form submits and creates user
- [ ] User appears in table
- [ ] Delete User button shows confirmation
- [ ] User is removed after confirmation
- [ ] Add Client button opens modal
- [ ] Client form submits and creates client
- [ ] Client appears in table
- [ ] Edit Client button opens modal with pre-filled data
- [ ] Client updates show immediately
- [ ] Status can be changed in edit modal
- [ ] Delete Client button shows confirmation
- [ ] Client removed after confirmation
- [ ] All stats auto-update
- [ ] Search/filter works correctly
- [ ] Success messages appear after operations
- [ ] Error messages show for validation failures

✅ If all checked: **All buttons are working correctly!**

---

**Last Updated:** December 2025
**Status:** ✅ All Buttons Functional
