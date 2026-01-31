# Quick Setup Guide for SeweetyBella with AdminJS

## Prerequisites

Your NeonDB connection string is already configured in `.env`!

## Setup Steps

### 1. Install Additional Dependencies

```bash
npm install bcrypt @types/bcrypt ts-node concurrently @types/express @types/express-session
```

### 2. Generate Prisma Client and Create Database Tables

```bash
npx prisma generate
npx prisma db push
```

This will create two tables:
- `products` - Store bakery products
- `admins` - Store admin users with encrypted passwords

### 3. Create Your First Admin User

```bash
npm run seed:admin
```

This creates an admin user with:
- **Email**: `admin@nalabakery.com` (from .env)
- **Password**: `changeme123` (from .env)

**IMPORTANT**: Change this password after first login!

### 4. Run Both Servers

**Option A: Run both servers together (recommended)**
```bash
npm run dev:all
```

**Option B: Run them separately**

Terminal 1 (Next.js app):
```bash
npm run dev
```

Terminal 2 (AdminJS):
```bash
npm run dev:admin
```

### 5. Access the Application

**Landing Page**: http://localhost:3000
- Public-facing bakery website
- Shows all products
- WhatsApp "Comprar" buttons

**AdminJS Panel**: http://localhost:3001/admin
- Secure admin panel with login
- Manage products (create, edit, delete)
- Manage admin users
- **Login with**: admin@nalabakery.com / changeme123

## Using AdminJS

### First Login
1. Go to http://localhost:3001/admin
2. Login with your admin credentials
3. You'll see the AdminJS dashboard

### Managing Products
1. Click "Products" in the sidebar
2. Click "Create new" to add products
3. Fill in:
   - **Name**: Product name
   - **Description**: Detailed description
   - **Price**: Price in your currency
   - **Image**: Full URL to product image
4. Click "Save"

### Managing Admin Users
1. Click "Admins" in the sidebar
2. Create additional admin users
3. Passwords are automatically encrypted
4. Change your password here after first login

### Product Image URLs
For images, you can use:
- Unsplash: `https://images.unsplash.com/photo-xxxxx`
- Cloudinary: Upload to Cloudinary and use the URL
- Any public URL to an image

## Project Structure with AdminJS

```
sofi-bakery/
├── app/
│   ├── page.tsx              # Landing page (Next.js)
│   ├── layout.tsx            # Root layout
│   └── api/
│       └── products/         # Public API to fetch products
├── admin-server.ts           # AdminJS Express server (port 3001)
├── scripts/
│   └── seed-admin.ts         # Script to create first admin user
├── components/
│   └── ProductCard.tsx       # Product card with WhatsApp
├── prisma/
│   └── schema.prisma         # Database schema (Product + Admin models)
└── lib/
    └── prisma.ts             # Prisma client
```

## Security Features

✅ **Encrypted Passwords**: All admin passwords are hashed with bcrypt
✅ **Session-based Auth**: AdminJS uses secure session cookies
✅ **Protected Routes**: Admin panel requires login
✅ **Separate Servers**: AdminJS runs on different port (3001)

## Test WhatsApp Integration

After creating products in AdminJS:
1. Go to http://localhost:3000
2. Click "Comprar" on any product
3. WhatsApp opens with pre-filled message to: +54 9 11 6880 1698

## Common Issues & Solutions

### Issue: Can't login to AdminJS
**Solution**:
1. Make sure you ran `npm run seed:admin`
2. Check credentials: admin@nalabakery.com / changeme123
3. Verify database is connected

### Issue: AdminJS not starting
**Solution**:
1. Make sure port 3001 is not in use
2. Check that all dependencies are installed
3. Run `npx prisma generate` again

### Issue: Products not showing on landing page
**Solution**:
1. Add products via AdminJS first
2. Refresh the landing page
3. Check browser console for errors

## Customization

### Change Admin Credentials
Edit `.env`:
```env
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

Then run: `npm run seed:admin`

### Change WhatsApp Number
Edit `components/ProductCard.tsx` line 17:
```typescript
const phoneNumber = '5491168801698'; // Your number
```

### Customize AdminJS Theme
Edit `admin-server.ts` in the `branding` section to change colors, logo, etc.

## Production Deployment

### Deploy Next.js App (Vercel/Netlify)
- Deploy `app/` directory as normal Next.js app
- Set `DATABASE_URL` environment variable

### Deploy AdminJS Server
- Deploy as a separate Express app to:
  - Railway
  - Render
  - Heroku
  - Any Node.js hosting
- Set environment variables: `DATABASE_URL`, `SESSION_SECRET`
- Run: `npm run start:admin`

**Security Note**: In production, use a strong `SESSION_SECRET` in `.env`

## Next Steps

1. ✅ Create your first admin user
2. ✅ Login to AdminJS
3. ✅ Add some products
4. ✅ Test the landing page
5. ✅ Test WhatsApp integration
6. 📱 Change the default admin password
7. 🚀 Deploy to production

## Need Help?

Check the main README.md for detailed documentation and troubleshooting.
