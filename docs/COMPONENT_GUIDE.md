# Finance App - Component Breakdown

## Main Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    Finance Manager Dashboard                    │
│              Manage your institutions and transactions           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬─────────────────────────────────────────────┐
│   INSTITUTIONS   │         TRANSACTIONS                        │
│   (Sidebar)      │         (Main Content)                      │
├──────────────────┤─────────────────────────────────────────────┤
│                  │                                             │
│  [+]             │  ┌─────────────────────────────────────┐   │
│                  │  │ Chase Bank (CHASE)                  │   │
│  Chase Bank      │  │ Total Transactions: 5               │   │
│  Bank of America │  │                  [+ Add Transaction]│   │
│  Wells Fargo     │  └─────────────────────────────────────┘   │
│                  │                                             │
│                  │  ┌─────────────────────────────────────┐   │
│                  │  │ Date │ Desc│ Vendor│ Cat │ Amt │ ✓ │   │
│                  │  ├─────────────────────────────────────┤   │
│ (Sticky)         │  │ [Input fields for new transaction]  │   │
│                  │  ├─────────────────────────────────────┤   │
│                  │  │ 10/18 │Groceries│Whole Foods│$50  │✗│🗑 │
│                  │  │ 10/17 │Coffee  │Starbucks  │$6   │✓│🗑 │
│                  │  │ 10/16 │Gas     │Shell      │$45  │✓│🗑 │
│                  │  │ 10/15 │Movie   │AMC Theaters│$15 │✗│🗑 │
│                  │  │ 10/14 │Dinner  │Chipotle   │$12  │✓│🗑 │
│                  │  └─────────────────────────────────────┘   │
│                  │                                             │
└──────────────────┴─────────────────────────────────────────────┘
```

## Component Usage Guide

### 1. Institutions Sidebar (Left)

**UCard Container**
- Holds all institution management UI
- Sticky positioning (stays visible when scrolling)

**Header Section**
- Title: "Institutions"
- Button: [+] Create new institution

**Institution Form** (appears when + clicked)
- UFormField: "Institution Name"
  - UInput: Text input for name
- UFormField: "Code"
  - UInput: Text input for code
- Buttons: [Create] [Cancel]

**Institution List**
- UButton (repeated for each institution)
  - Label: Institution name
  - onClick: Select this institution
  - Highlight when selected (blue background)

### 2. Main Content Area (Right)

**Institution Header Card**
- Shows selected institution details
- Displays transaction count
- [+ Add Transaction] button

**Transactions Table (UCard)**

**Header Row**
- Columns: Date | Description | Vendor | Category | Amount | Confirmed | Actions

**New Transaction Row** (appears when "Add Transaction" clicked)
- All cells contain editable input fields:
  - Date: UInput type="date"
  - Description: UInput text
  - Vendor: UInput text
  - Category: USelect dropdown
  - Amount: UInput type="number"
  - Confirmed: Display text "Pending"
  - Actions: [Save] [Cancel] buttons

**Existing Transaction Rows**
- Each row shows transaction data
- Category shown as UBadge with primary color
- Amount formatted as currency (USD)
- Confirmed status shown as icon (✓ or ✗)
- Delete button (trash icon)

## Data Flow

### Creating Institution
```
Click [+] Button
    ↓
Show institution form
    ↓
User fills: name, code
    ↓
Click [Create]
    ↓
POST /api/institutions { name, code }
    ↓
Success → Add to list, close form
Error → Log error
```

### Adding Transaction
```
Click [Add Transaction]
    ↓
Show inline row with inputs
    ↓
User fills all fields
    ↓
Click [Save]
    ↓
POST /api/institutions/[id]/transactions { ...data }
    ↓
Success → Add to top of table, clear form, close
Error → Log error
```

### Deleting Transaction
```
Click trash icon [🗑]
    ↓
DELETE /api/transactions/[id]
    ↓
Success → Remove from table
Error → Log error
```

## Nuxt UI Components Used

| Component | Purpose | Location |
|-----------|---------|----------|
| `UCard` | Container sections | Sidebar, transaction table |
| `UButton` | All clickable actions | Institution list, form buttons, table actions |
| `UInput` | Text/date inputs | Institution form, transaction form |
| `USelect` | Dropdown menu | Category selection |
| `UFormField` | Label + input wrapper | Institution form |
| `UIcon` | Icons | Plus, trash, loading spinner |
| `UBadge` | Category display | Category column in table |
| Grid/Flex | Layout | Responsive layout system |

## Styling Features

- **Responsive Grid**: 
  - Mobile: 1 column (full width)
  - Desktop: 3 columns (sidebar + content)

- **Dark Mode**: 
  - All `dark:` classes included
  - Automatic theme switching

- **Hover Effects**:
  - Transaction rows: `hover:bg-gray-50 dark:hover:bg-gray-800`
  - Buttons: Built-in Nuxt UI hover states

- **Color Scheme**:
  - Primary: Blue (main actions, selected state)
  - Secondary: Gray (neutral buttons)
  - Error: Red (delete actions)
  - Success: Green (confirmed transactions)

- **Spacing**:
  - Uses Tailwind gap, px, py classes
  - Consistent 4px baseline (Tailwind's default)

## Loading & Error States

**Loading States**:
- Spinning icon while fetching data
- Disabled buttons during operations
- Visual feedback for user actions

**Error Handling**:
- Errors logged to console
- User-friendly messages could be added
- Non-blocking errors (operations fail gracefully)

## Accessibility

- Semantic HTML structure
- ARIA labels on icons
- Keyboard navigation support (via Nuxt UI)
- Color not the only indicator (icons and text used)
- Proper heading hierarchy
