import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Resource, getModelByName } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const PORT = 3001;

const authenticate = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (admin && await bcrypt.compare(password, admin.password)) {
    return admin;
  }
  return null;
};

const start = async () => {
  const app = express();

  const adminOptions: any = {
    resources: [
      {
        resource: new Resource({
          model: getModelByName('Product'),
          client: prisma
        }),
        options: {
          navigation: {
            name: 'Catálogo',
            icon: 'ShoppingCart',
          },
          properties: {
            id: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
            name: {
              isTitle: true,
              isRequired: true,
            },
            description: {
              type: 'textarea',
              isRequired: true,
            },
            price: {
              type: 'number',
              isRequired: true,
            },
            image: {
              isRequired: true,
            },
            createdAt: {
              isVisible: { list: true, filter: true, show: true, edit: false },
            },
            updatedAt: {
              isVisible: { list: false, filter: false, show: true, edit: false },
            },
          },
        },
      },
      {
        resource: new Resource({
          model: getModelByName('Admin'),
          client: prisma
        }),
        options: {
          navigation: {
            name: 'Administración',
            icon: 'User',
          },
          properties: {
            password: {
              isVisible: { list: false, filter: false, show: false, edit: true },
              type: 'password',
            },
          },
          actions: {
            new: {
              before: async (request: any) => {
                if (request.payload?.password) {
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              },
            },
            edit: {
              before: async (request: any) => {
                if (request.payload?.password) {
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              },
            },
          },
        },
      },
    ],
    branding: {
      companyName: 'SeweetyBella Admin',
      withMadeWithLove: false,
    },
    rootPath: '/admin',
  };

  const admin = new AdminJS(adminOptions);

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.SESSION_SECRET || 'some-secret-password-used-to-secure-cookie',
    },
    null,
    {
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || 'some-secret-password-used-to-secure-cookie',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    }
  );

  app.use(admin.options.rootPath, adminRouter);

  app.listen(PORT, () => {
    console.log(`✅ AdminJS is running on http://localhost:${PORT}${admin.options.rootPath}`);
    console.log(`📧 Login with: ${process.env.ADMIN_EMAIL || 'admin@nalabakery.com'}`);
  });
};

start();
