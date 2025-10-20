# 🏗️ Architecture & Data Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Client (Vue 3)                        │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │         index.vue (Main Dashboard)               │   │
│  │                                                  │   │
│  │  ┌─────────────────┬──────────────────────────┐  │   │
│  │  │ useInstitutions │ useTransactions          │  │   │
│  │  │  Composables    │ Composables              │  │   │
│  │  └────────┬────────┴──────────────┬───────────┘  │   │
│  │           │                       │              │   │
│  │  ┌────────▼──────────────────────▼────────────┐  │   │
│  │  │      Nuxt UI Components                    │  │   │
│  │  │  UCard, UButton, UInput, USelect, etc.    │  │   │
│  │  └────────┬──────────────────────────────────┘  │   │
│  └───────────┼──────────────────────────────────────┘   │
│              │                                         │
└──────────────┼─────────────────────────────────────────┘
               │
        $fetch HTTP
               │
┌──────────────▼─────────────────────────────────────────┐
│            Nuxt Server API Routes                      │
│                                                        │
│  POST   /api/institutions               [Create]      │
│  GET    /api/institutions               [List All]    │
│  GET    /api/institutions/[id]          [Get One]     │
│  POST   /api/institutions/[id]/trans    [Add Trans]   │
│  PATCH  /api/transactions/[id]          [Update]     │
│  DELETE /api/transactions/[id]          [Delete]     │
│                                                        │
└──────────────┬─────────────────────────────────────────┘
               │
     Prisma ORM
               │
┌──────────────▼─────────────────────────────────────────┐
│              SQLite Database                           │
│                                                        │
│  ┌──────────────────┐    ┌──────────────────────────┐ │
│  │  Institution     │    │  Transaction             │ │
│  ├──────────────────┤    ├──────────────────────────┤ │
│  │ id (PK)          │    │ id (PK)                  │ │
│  │ name             │    │ institutionId (FK)      │ │
│  │ code (UNIQUE)    │    │ date                    │ │
│  │ createdAt        │    │ description             │ │
│  │ updatedAt        │    │ vendor                  │ │
│  └──────────────────┘    │ category                │ │
│         │                │ transactionAmount       │ │
│         └────────────────│ confirmed               │ │
│          (1:N)           │ createdBy               │ │
│                          │ updatedBy               │ │
│                          │ createdDate             │ │
│                          │ updatedDate             │ │
│                          └──────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## Data Flow - Creating Institution

```
User Interface
       │
       ├─ Click [+] button
       │
       ├─ Show form with UInput fields
       │       ├─ Institution Name input
       │       └─ Code input
       │
       ├─ User fills form
       │
       ├─ Click [Create]
       │
       └─ Trigger handleCreateInstitution()
              │
              └─ Call composable.createInstitution()
                     │
                     └─ Validate inputs
                            │
                            ├─ If invalid: show error, return
                            │
                            └─ If valid: POST /api/institutions
                                   │
                                   └─ Nuxt Server
                                          │
                                          ├─ Parse request body
                                          │
                                          ├─ Validate name & code
                                          │
                                          └─ Prisma: create()
                                                 │
                                                 └─ SQLite INSERT
                                                        │
                                                        ├─ If success:
                                                        │  ├─ Return institution object
                                                        │  └─ update institutions.value
                                                        │     ├─ Clear form
                                                        │     ├─ Close form
                                                        │     └─ Show in UI ✅
                                                        │
                                                        └─ If error:
                                                           ├─ Log error
                                                           └─ Show error message ❌
```

---

## Data Flow - Adding Transaction

```
User Interface
       │
       └─ Institution Selected
              │
              ├─ Click [+ Add Transaction]
              │
              ├─ Show inline form row with inputs
              │       ├─ UInput for date
              │       ├─ UInput for description
              │       ├─ UInput for vendor
              │       ├─ USelect for category
              │       ├─ UInput for amount
              │       └─ [Save] [Cancel] buttons
              │
              ├─ User fills fields
              │
              ├─ Click [Save]
              │
              └─ Trigger handleAddTransaction()
                     │
                     ├─ Validate: institutionId exists
                     │
                     ├─ Validate: required fields filled
                     │           ├─ description
                     │           ├─ vendor
                     │           └─ category
                     │
                     └─ Call composable.createTransaction()
                            │
                            └─ POST /api/institutions/[id]/transactions
                                   │
                                   └─ Nuxt Server
                                          │
                                          ├─ Parse request body
                                          │
                                          ├─ Validate all fields
                                          │
                                          ├─ Convert date string to Date object
                                          │
                                          ├─ Convert amount to float
                                          │
                                          └─ Prisma: create()
                                                 │
                                                 └─ SQLite INSERT
                                                        │
                                                        ├─ If success:
                                                        │  ├─ Return transaction object
                                                        │  ├─ Add to top of transactions array
                                                        │  ├─ Reset form fields
                                                        │  ├─ Hide form row
                                                        │  └─ Show in UI ✅
                                                        │
                                                        └─ If error:
                                                           ├─ Log error
                                                           └─ Show error message ❌
```

---

## Data Flow - Deleting Transaction

```
User Interface
       │
       └─ Transaction visible in table
              │
              ├─ Hover over row
              │
              ├─ Click trash icon [🗑]
              │
              └─ Trigger handleDeleteTransaction()
                     │
                     └─ Call composable.deleteTransaction()
                            │
                            └─ DELETE /api/transactions/[id]
                                   │
                                   └─ Nuxt Server
                                          │
                                          ├─ Validate transaction exists
                                          │
                                          └─ Prisma: delete()
                                                 │
                                                 └─ SQLite DELETE
                                                        │
                                                        ├─ If success:
                                                        │  ├─ Return success
                                                        │  ├─ Remove from array
                                                        │  └─ Re-render table ✅
                                                        │
                                                        └─ If error:
                                                           ├─ Log error
                                                           └─ Show error message ❌
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────┐
│         Component State (index.vue)                  │
│                                                     │
│  ┌────────────────┐      ┌──────────────────────┐  │
│  │ Institutions   │      │ Transactions         │  │
│  ├────────────────┤      ├──────────────────────┤  │
│  │ institutions[] │◄────►│ institutionTrans[]   │  │
│  │ loading: bool  │      │ institutionLoading   │  │
│  │ error: string  │      │                      │  │
│  │ selected: ID   │      │ showAddRow: bool     │  │
│  │                │      │ newTransaction: obj  │  │
│  └────────────────┘      └──────────────────────┘  │
│         ▲                         ▲                │
│         │                         │                │
│         └─────────────────────────┘                │
│              (Composables)                         │
└─────────────────────────────────────────────────────┘
           │
           └──► Database (Prisma) ◄───► SQLite
```

---

## Component Hierarchy

```
<div> (main container)
  ├─ <div> (header section)
  │   └─ <h1> Finance Manager
  │
  └─ <div> (grid container - 3 cols)
      │
      ├─ <div> (left sidebar - col 1)
      │   └─ <UCard>
      │       ├─ Header: "Institutions" + [+] button
      │       ├─ Institution Form (v-if showInstitutionForm)
      │       │   ├─ <UFormField> (Name)
      │       │   ├─ <UFormField> (Code)
      │       │   └─ [Create] [Cancel] buttons
      │       └─ Institution List
      │           └─ <UButton> x N (each institution)
      │
      └─ <div> (main content - cols 2-3)
          │
          ├─ Empty State (v-if !selectedInstitution)
          │
          └─ Main Content (v-else)
              ├─ <UCard> (Institution Header)
              │   ├─ <h2> Institution Name
              │   ├─ <p> Code
              │   ├─ Transaction Count
              │   └─ [+ Add Transaction] button
              │
              └─ <UCard> (Transactions Table)
                  └─ <table>
                      ├─ <thead>
                      │   └─ <tr> (headers)
                      │       ├─ Date
                      │       ├─ Description
                      │       ├─ Vendor
                      │       ├─ Category
                      │       ├─ Amount
                      │       ├─ Confirmed
                      │       └─ Actions
                      │
                      └─ <tbody>
                          ├─ <tr> Add Form (v-if showAddRow)
                          │   ├─ <UInput> date
                          │   ├─ <UInput> description
                          │   ├─ <UInput> vendor
                          │   ├─ <USelect> category
                          │   ├─ <UInput> amount
                          │   ├─ Pending text
                          │   └─ [Save] [Cancel]
                          │
                          └─ <tr> x N (each transaction)
                              ├─ Date text
                              ├─ Description text
                              ├─ Vendor text
                              ├─ <UBadge> category
                              ├─ Amount formatted
                              ├─ <UIcon> confirmation
                              └─ [Delete] button
```

---

## API Request/Response Cycle

```
Browser                    Nuxt Server             Database
   │                            │                      │
   │ 1. POST /api/institutions  │                      │
   ├───────────────────────────►│                      │
   │    { name, code }          │                      │
   │                            │ 2. Validate input    │
   │                            │                      │
   │                            │ 3. prisma.institution.create()
   │                            ├─────────────────────►│
   │                            │                      │ 4. INSERT
   │                            │                      │
   │                            │ 5. Return new record │
   │                            │◄─────────────────────┤
   │                            │                      │
   │ 6. Return institution obj  │                      │
   │◄───────────────────────────┤                      │
   │                            │                      │
   │ 7. Update UI               │                      │
   └────────────────────────────────────────────────────┘
   
Time progression: Left to Right
```

---

## Error Handling Flow

```
User Action
    │
    ├─ Input validation (client)
    │   │
    │   ├─ If invalid → Show error, stop
    │   └─ If valid → Continue
    │
    ├─ API call (server)
    │   │
    │   ├─ If network error → Catch, log, show message
    │   ├─ If validation error → Return 400, handle
    │   ├─ If server error → Return 500, handle
    │   └─ If success → Process response
    │
    └─ UI Update
        ├─ Add to list/table
        ├─ Clear form
        ├─ Show success feedback
        └─ OR show error message

Error Path: User sees friendly message, no crashes
```

---

## Dependency Graph

```
index.vue
    │
    ├─► useInstitutions()
    │   ├─► $fetch GET /api/institutions
    │   ├─► $fetch POST /api/institutions
    │   └─► $fetch GET /api/institutions/[id]
    │
    ├─► useTransactions()
    │   ├─► $fetch POST /api/institutions/[id]/transactions
    │   ├─► $fetch PATCH /api/transactions/[id]
    │   └─► $fetch DELETE /api/transactions/[id]
    │
    └─► Nuxt UI Components
        ├─► UCard (layout)
        ├─► UButton (actions)
        ├─► UInput (forms)
        ├─► USelect (dropdown)
        ├─► UFormField (labels)
        ├─► UIcon (icons)
        └─► UBadge (tags)
```

---

## Deployment Architecture (Optional)

```
┌──────────────────────────────────────────────────────┐
│           Cloud/Server Environment                  │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │        Docker Container (Optional)             │ │
│  │                                                │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │    Nuxt Application (Built/SSR)         │ │ │
│  │  │    PORT: 3000 (configurable)            │ │ │
│  │  │                                          │ │ │
│  │  │    ├─ API Routes (server-side)          │ │ │
│  │  │    ├─ Pages (client-side)               │ │ │
│  │  │    └─ Middleware                        │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │                   │                            │ │
│  │                   ▼                            │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │    SQLite Database                       │ │ │
│  │  │    (dev.db in project or mounted volume)│ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
         │
         │ HTTP/HTTPS
         │
    User Browser
    
For production, consider:
- PostgreSQL instead of SQLite
- Environment-based configuration
- HTTPS/SSL certificates
- Load balancing (if needed)
- Database backups
```

---

This comprehensive architecture shows how all components work together to provide a seamless institution and transaction management experience!
