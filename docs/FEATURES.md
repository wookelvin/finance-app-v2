# Finance App - Institution & Transaction Management Guide

This document explains the implementation of institution and transaction management features for the Finance App using Nuxt UI.

## Features Implemented

✅ **Institution Management**
- Create new institutions with name and code
- View list of all institutions in a sidebar
- Select institution to view its transactions
- Sticky sidebar for easy navigation

✅ **Inline Transaction Management**
- Add transactions directly in the table (no modal required)
- View all transactions for a selected institution
- Delete transactions
- Inline form for quick transaction entry
- Full transaction details: Date, Description, Vendor, Category, Amount, Status

✅ **Nuxt UI Components Used**
- `UCard` - Container for sections
- `UButton` - All action buttons
- `UInput` - Text and date inputs
- `USelect` - Category dropdown
- `UFormField` - Form labels and structure
- `UIcon` - Icons throughout the app
- `UBadge` - Category badges in table
- Responsive grid layout with Tailwind CSS

## Project Structure

```
/server/api/
├── institutions.get.ts           # Fetch all institutions
├── institutions.post.ts          # Create new institution
├── institutions/
│   ├── [id].get.ts              # Fetch single institution with transactions
│   └── [id]/
│       └── transactions.post.ts  # Create transaction for institution
└── transactions/
    ├── [transactionId].patch.ts # Update transaction
    └── [transactionId].delete.ts # Delete transaction

/composables/
├── useInstitutions.ts           # Institution management logic
└── useTransactions.ts           # Transaction management logic

/app/pages/
└── index.vue                    # Main dashboard page

/prisma/
└── schema.prisma                # Database schema (Institution & Transaction models)
```

## Database Schema

### Institution Model
```prisma
model Institution {
  id           String   @id @default(cuid())
  name         String
  code         String   @unique
  transactions Transaction[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Transaction Model
```prisma
model Transaction {
  id                String      @id @default(cuid())
  institutionId     String
  institution       Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)
  date              DateTime
  description       String
  vendor            String
  category          String
  transactionAmount Float
  confirmed         Boolean     @default(false)
  createdBy         String
  updatedBy         String
  createdDate       DateTime    @default(now())
  updatedDate       DateTime    @updatedAt

  @@index([institutionId])
  @@index([date])
}
```

## API Endpoints

### Institutions

**GET /api/institutions**
- Fetches all institutions
- Returns array of institutions sorted by creation date (newest first)

**POST /api/institutions**
- Creates new institution
- Body: `{ name: string, code: string }`
- Returns created institution object

**GET /api/institutions/[id]**
- Fetches single institution with all its transactions
- Returns institution object with transactions array sorted by date

### Transactions

**POST /api/institutions/[id]/transactions**
- Creates new transaction for an institution
- Body: `{`
  - `date: string | Date (required)`
  - `description: string (required)`
  - `vendor: string (required)`
  - `category: string (required)`
  - `transactionAmount: number (required)`
  - `confirmed?: boolean (optional, defaults to false)`
  - `createdBy?: string (optional)`
  - `updatedBy?: string (optional)`
- `}`

**PATCH /api/transactions/[transactionId]**
- Updates transaction fields
- Body: Partial object with fields to update
- All fields are optional

**DELETE /api/transactions/[transactionId]**
- Deletes a transaction
- Returns `{ success: true }`

## Usage Guide

### 1. Creating an Institution

1. Click the **"+"** button in the Institutions sidebar
2. Enter the institution name (e.g., "Chase Bank")
3. Enter the institution code (e.g., "CHASE")
4. Click **"Create"** button
5. The new institution appears at the top of the list

### 2. Selecting an Institution

1. Click on any institution name in the left sidebar
2. The institution details appear on the right
3. A transaction table displays all transactions for that institution

### 3. Adding a Transaction (Inline)

1. With an institution selected, click **"Add Transaction"** button
2. A new row appears at the top of the table with input fields
3. Fill in:
   - **Date**: Click date input field
   - **Description**: Transaction description
   - **Vendor**: Company/store name
   - **Category**: Choose from dropdown (Groceries, Utilities, Entertainment, Transportation, Other)
   - **Amount**: Transaction amount (can use decimals)
4. Click **"Save"** to add the transaction
5. Click **"Cancel"** to discard and close the form

### 4. Deleting a Transaction

1. Locate the transaction in the table
2. Click the trash icon in the Actions column
3. Transaction is immediately removed

## Composables

### useInstitutions()

```typescript
const {
  institutions,          // ref: Institution[] - All institutions
  loading,              // ref: boolean - Loading state
  error,               // ref: string | null - Error message
  selectedInstitution, // ref: Institution | null - Currently selected
  fetchInstitutions,   // () => Promise<void>
  fetchInstitution,    // (id: string) => Promise<Institution | null>
  createInstitution,   // (name: string, code: string) => Promise<Institution | null>
} = useInstitutions()
```

### useTransactions()

```typescript
const {
  loading,            // ref: boolean - Loading state
  error,             // ref: string | null - Error message
  createTransaction, // (institutionId, data) => Promise<Transaction | null>
  updateTransaction, // (transactionId, data) => Promise<Transaction | null>
  deleteTransaction, // (transactionId) => Promise<boolean>
} = useTransactions()
```

## Styling

The application uses:
- **Tailwind CSS** for utility classes
- **Dark mode support** with `dark:` prefixes
- **Responsive grid**: 1 column on mobile, 3 columns on large screens (sidebar + 2x content)
- **Sticky sidebar**: Institutions sidebar stays visible when scrolling
- **Hover effects**: Transaction rows highlight on hover

## Category Options

The following categories are available for transactions:
- Groceries
- Utilities
- Entertainment
- Transportation
- Other

## Data Validation

### Institution Creation
- Name: Required
- Code: Required, must be unique

### Transaction Creation
- Date: Required
- Description: Required
- Vendor: Required
- Category: Required
- Amount: Required (positive number)

## Error Handling

- All API errors are caught and logged to console
- User-friendly error messages are displayed
- Failed operations don't modify the UI state

## Future Enhancements

Possible improvements:
- Edit existing transactions inline
- Bulk import transactions via CSV
- Transaction filtering and search
- Category-based analytics
- Monthly/yearly reports
- Transaction reconciliation UI
- Multiple account support per institution
- Transaction export to CSV/PDF
- Recurring transaction templates

## Development Notes

- Uses Nuxt 4.x with Vue 3 Composition API
- SQLite database with Prisma ORM
- Server-side API routes with Nuxt auto-imports
- Full TypeScript support
- Component auto-imports via Nuxt

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Manage database
npm run db          # Run migrations
npm run db:studio   # Open Prisma Studio
```

Visit `http://localhost:3000` to view the application.
