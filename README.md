# SeweetyBella - Production-Ready Bakery Website

A modern, production-ready web application for SeweetyBella built with Next.js, Prisma, and PostgreSQL.

## Features

- **Landing Page**: Beautiful, responsive landing page with smooth animations
- **Product Display**: Grid layout showcasing bakery products with images, descriptions, and prices
- **WhatsApp Integration**: Direct "Buy" button that opens WhatsApp with pre-filled message
- **Admin Panel**: Full-featured admin panel to manage products (create, edit, delete)
- **Modern UI**: Built with Tailwind CSS and Framer Motion for smooth animations
- **Database**: PostgreSQL with Prisma ORM for type-safe database access

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Language**: TypeScript

## Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- A NeonDB PostgreSQL database (or any PostgreSQL database)

### 2. Clone and Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your NeonDB connection string:

```env
# Database - Replace with your NeonDB connection string
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/seweetybella?sslmode=require"

# Admin credentials (change these!)
ADMIN_EMAIL="admin@seweetybella.com"
ADMIN_PASSWORD="your-secure-password"

# Session secret (generate a random string for production)
SESSION_SECRET="generate-a-random-string-here"
```

**How to get your NeonDB connection string:**
- Log in to [NeonDB](https://neon.tech)
- Create a new project or select an existing one
- Go to the Dashboard and find "Connection Details"
- Copy the connection string (it will look like: `postgresql://user:pass@host/dbname?sslmode=require`)
- Paste it into your `.env` file as the `DATABASE_URL`

### 4. Initialize the Database

Run Prisma migrations to create the database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Create the database tables
npx prisma db push
```

Optional: Open Prisma Studio to view/edit your database:
```bash
npx prisma studio
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

### 6. Access the Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to manage products.

**Admin Panel Features:**
- Create new products
- Edit existing products
- Delete products
- Upload product images (via URL)

## Project Structure

```
sofi-bakery/
├── app/
│   ├── api/
│   │   ├── products/          # API route to fetch products
│   │   └── admin/             # Admin API routes (CRUD operations)
│   ├── admin/                 # Admin panel page
│   ├── layout.tsx             # Root layout with metadata
│   └── page.tsx               # Landing page
├── components/
│   └── ProductCard.tsx        # Product card component with WhatsApp integration
├── lib/
│   ├── prisma.ts              # Prisma client instance
│   └── admin.ts               # Admin configuration
├── prisma/
│   └── schema.prisma          # Database schema
├── .env                       # Environment variables (not in git)
├── .env.example               # Example environment file
└── package.json
```

## Database Schema

### Product Model

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String   @db.Text
  price       Float
  image       String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## WhatsApp Integration

The WhatsApp integration uses the phone number: **+54 9 11 6880 1698**

When a user clicks the "Comprar" (Buy) button, it opens WhatsApp with a pre-filled message:
```
Hola! Me gustaría pedir el producto: {product name} (${price})
```

To change the phone number, update it in `components/ProductCard.tsx`:
```typescript
const phoneNumber = '5491168801698'; // Update this
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
4. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

Make sure to:
1. Set all environment variables
2. Run `npx prisma generate` in the build step
3. Ensure your database is accessible from the deployment platform

## Production Checklist

Before deploying to production:

- [ ] Update `ADMIN_PASSWORD` in `.env` with a strong password
- [ ] Generate a secure random string for `SESSION_SECRET`
- [ ] Verify your NeonDB connection string is correct
- [ ] Test the admin panel functionality
- [ ] Test WhatsApp integration with real products
- [ ] Add product images (consider using a CDN like Cloudinary)
- [ ] Update metadata in `app/layout.tsx` if needed
- [ ] Test on mobile devices
- [ ] Set up database backups in NeonDB

## Adding Products

### Option 1: Via Admin Panel
1. Go to `/admin`
2. Fill in the product form:
   - Name
   - Description
   - Price
   - Image URL
3. Click "Crear" (Create)

### Option 2: Via Prisma Studio
```bash
npx prisma studio
```

### Option 3: Via Database Seed (Optional)

Create a seed file at `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Pan de Campo',
        description: 'Delicioso pan artesanal de masa madre',
        price: 2500,
        image: 'https://example.com/pan.jpg',
      },
      // Add more products...
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

Run the seed:
```bash
npx tsx prisma/seed.ts
```

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure NeonDB is not sleeping (free tier databases may sleep after inactivity)
- Check that your IP is not blocked by NeonDB

### Prisma Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Support

For issues or questions, please open an issue in the repository.

## License

MIT
