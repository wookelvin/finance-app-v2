# Prisma SQLite Setup

This project uses Prisma with SQLite for database management, with separate databases for development and production.

## Database Configuration

### Development
- **Database File**: `prisma/dev.db`
- **Environment File**: `.env.development`
- **Connection**: `DATABASE_URL="file:./prisma/dev.db"`

### Production
- **Database File**: `data/prod.db`
- **Environment File**: `.env.production`
- **Connection**: `DATABASE_URL="file:./data/prod.db"`

## Getting Started

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Create and Run Migrations (Development)
```bash
# Create a new migration
npx prisma migrate dev --name init

# View/edit your database
npx prisma studio
```

### 3. Run Migrations (Production)
When deploying to production, migrations are applied automatically during the Docker build process.

## Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# View database in Studio
npm run prisma:studio

# Push schema changes directly (development only)
npm run prisma:push
```

## Adding Models

Edit `prisma/schema.prisma` to define your data models. Example:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  createdAt DateTime @default(now())
}
```

Then run migrations to update your database.

## Docker Production Setup

The production Docker image:
1. Creates the `/app/data` directory for the SQLite database
2. Uses the production environment variables
3. Automatically applies any pending migrations on startup (if configured)

The SQLite database file persists in the `data/` volume, so you can mount it as a Docker volume for persistence across container restarts.
