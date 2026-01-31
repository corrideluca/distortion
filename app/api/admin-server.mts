import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { getModelByName } from "@adminjs/prisma";
import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const app = express();

const authenticate = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    return admin;
  }
  return null;
};

// Create a function to initialize AdminJS
const initializeAdmin = async () => {
  const adminOptions: any = {
    resources: [
      {
        resource: { model: getModelByName("Product"), client: prisma },
        options: {
          /* ... your existing options ... */
        },
      },
      {
        resource: { model: getModelByName("Admin"), client: prisma },
        options: {
          /* ... your existing options ... */
        },
      },
    ],
    branding: {
      companyName: "SeweetyBella Admin",
      withMadeWithLove: false,
    },
    rootPath: "/api/admin", // Vercel works best if the entry point matches the path
  };

  const admin = new AdminJS(adminOptions);

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword:
        process.env.SESSION_SECRET || "a-very-long-secure-random-string",
    },
    null,
    {
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "a-very-long-secure-random-string",
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    },
  );

  app.use(admin.options.rootPath, adminRouter);
  return app;
};

// Vercel execution
export default async (req: any, res: any) => {
  const adminApp = await initializeAdmin();
  return adminApp(req, res);
};
