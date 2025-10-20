# 💰 Finance Manager App

A modern, full-featured financial institution and transaction management system built with **Nuxt 4**, **Vue 3**, **TypeScript**, and **@nuxt/ui**.

## ✨ Features

- 🏦 **Institution Management** - Create and manage financial institutions
- 💳 **Transaction Tracking** - Add, delete, and organize transactions
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🌙 **Dark Mode** - Full dark mode support
- ⚡ **Inline Forms** - Add transactions without modal popups
- 🎨 **Beautiful UI** - Built with Nuxt UI components
- 📊 **Database** - SQLite with Prisma ORM
- 🔒 **Type Safe** - Full TypeScript support

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

### 4. Create & Manage
- Click **[+]** in the Institutions sidebar to create a new institution
- Click an institution name to select it
- Click **[+ Add Transaction]** to add a transaction inline
- Click the trash icon **[🗑]** to delete a transaction

## 📚 Documentation

Read these guides to understand the application:

| Document | Purpose |
|----------|---------|
| [**QUICKSTART.md**](./QUICKSTART.md) | Get started in 60 seconds |
| [**FEATURES.md**](./FEATURES.md) | Complete feature documentation & API reference |
| [**IMPLEMENTATION.md**](./IMPLEMENTATION.md) | Technical implementation summary |
| [**COMPONENT_GUIDE.md**](./COMPONENT_GUIDE.md) | UI components & layout breakdown |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | System architecture & data flows |
| [**DELIVERY.md**](./DELIVERY.md) | Complete delivery summary |
| [**CHECKLIST.md**](./CHECKLIST.md) | Implementation checklist |

## 🎯 Main Features Explained

### Institution Management
- Create institutions with name and code
- View all institutions in a sidebar
- Select institution to manage its transactions
- Sticky sidebar for easy navigation

### Transaction Management  
- **Inline Adding** - Add transactions directly in the table, no modal
- **View All Details** - See date, description, vendor, category, amount, confirmation status
- **Quick Delete** - Remove transactions with one click
- **Organization** - Categorize transactions (Groceries, Utilities, Entertainment, etc.)

### User Interface
- Clean, modern design with Nuxt UI components
- Responsive grid layout (1 col mobile, 3 cols desktop)
- Professional styling with Tailwind CSS
- Full dark mode support
- Accessible components

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Nuxt | 4.1.3 | Framework |
| Vue | 3.5.22 | UI Library |
| @nuxt/ui | 4.0.1 | Components |
| Tailwind CSS | v3 | Styling |
| Prisma | 6.17.1 | Database ORM |
| TypeScript | 5.9.3 | Type Safety |
| SQLite | Latest | Database |

## 📁 Project Structure

```
/app
  /pages
    index.vue              # Main dashboard

/server/api
  institutions.get.ts      # List institutions
  institutions.post.ts     # Create institution
  institutions/
    [id].get.ts           # Get institution with transactions
    [id]/
      transactions.post.ts # Add transaction
  transactions/
    [transactionId].patch.ts  # Update transaction
    [transactionId].delete.ts # Delete transaction

/composables
  useInstitutions.ts      # Institution management logic
  useTransactions.ts      # Transaction management logic

/prisma
  schema.prisma           # Database schema
```

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db               # Run Prisma migrations
npm run db:studio        # Open Prisma Studio (view DB)

# Code Quality
npm run lint             # Run ESLint
```

## 🗄️ Database

The application uses **SQLite** with **Prisma ORM**.

### Models

**Institution**
- id, name, code, createdAt, updatedAt
- Has many transactions

**Transaction**
- id, date, description, vendor, category, amount
- confirmed, createdBy, updatedBy
- createdDate, updatedDate
- Belongs to Institution

### Migrations

Migrations are pre-configured. Run:
```bash
npm run db
```

To view the database:
```bash
npm run db:studio
```

## 🔌 API Endpoints

All endpoints return JSON responses.

### Institutions
- `GET /api/institutions` - List all institutions
- `POST /api/institutions` - Create new institution
- `GET /api/institutions/[id]` - Get single with transactions

### Transactions
- `POST /api/institutions/[id]/transactions` - Add transaction
- `PATCH /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

See [FEATURES.md](./FEATURES.md) for complete API documentation.

## 🎨 UI Components

Built with **@nuxt/ui** and **Tailwind CSS**:

- **UCard** - Container sections
- **UButton** - Interactive buttons
- **UInput** - Text and date inputs
- **USelect** - Dropdown menus
- **UFormField** - Form labels
- **UIcon** - Heroicons
- **UBadge** - Category tags

## 🌈 Styling

- **Responsive Grid** - 1 column on mobile, 3 columns on desktop
- **Sticky Sidebar** - Institutions stay visible while scrolling
- **Dark Mode** - Automatic theme detection
- **Tailwind CSS** - Utility-first CSS framework
- **Professional Colors** - Primary, secondary, error, success colors

## 🚀 Deployment

### Docker
Build and run with Docker (optional Dockerfile provided):
```bash
npm run production-build
npm run production-run
```

### Manual Deployment
1. Run `npm run build`
2. Deploy the `.output` directory
3. Set environment variables (DATABASE_URL)
4. Start with `node .output/server/index.mjs`

## 🐛 Troubleshooting

**App won't start?**
- Run `npm install` first
- Ensure port 3000 is available
- Check Node version (v18+)

**Can't add transaction?**
- All fields are required
- Check browser console for errors
- Ensure institution is selected

**Database issues?**
- Run `npm run db` to migrate
- Check DATABASE_URL in .env

See [QUICKSTART.md](./QUICKSTART.md) for more help.

## 📖 Next Steps

1. Read [QUICKSTART.md](./QUICKSTART.md) to get started
2. Create some institutions and transactions
3. Explore [FEATURES.md](./FEATURES.md) for complete documentation
4. Check [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system

## 📝 Notes

- All API routes are fully functional and tested
- Database schema is pre-configured and migrated
- No additional setup required beyond `npm install`
- All components use Nuxt UI for consistent styling
- Full TypeScript support with type safety

## 🤝 Support

For questions or issues:
1. Check the documentation files
2. Review the component code
3. Check browser console (F12) for errors
4. View database with `npm run db:studio`

## 📄 License

This project is open source.

---

**Ready to get started?** Run `npm run dev` and open `http://localhost:3000`! 🎉

