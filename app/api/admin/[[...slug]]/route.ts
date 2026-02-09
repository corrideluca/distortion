import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

const authenticate = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    return admin;
  }
  return null;
};

let adminApp: any = null;

const getAdminApp = async () => {
  if (adminApp) {
    return adminApp;
  }

  // Dynamically import AdminJS modules
  const [
    { default: AdminJS },
    { default: AdminJSExpress },
    { getModelByName },
    { default: express },
  ] = await Promise.all([
    import("adminjs"),
    import("@adminjs/express"),
    import("@adminjs/prisma"),
    import("express"),
  ]);

  // Set environment variable to skip bundling
  process.env.ADMIN_JS_SKIP_BUNDLE = 'true';

  const adminOptions: any = {
    resources: [
      {
        resource: { model: getModelByName("Product"), client: prisma },
        options: {},
      },
      {
        resource: { model: getModelByName("Admin"), client: prisma },
        options: {},
      },
    ],
    branding: {
      companyName: "SeweetyBella Admin",
      withMadeWithLove: false,
    },
    rootPath: "/admin",
  };

  const admin = new AdminJS(adminOptions);

  const app = express();

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
    }
  );

  app.use(admin.options.rootPath, adminRouter);
  adminApp = app;
  return app;
};

async function handler(req: NextRequest) {
  const app = await getAdminApp();

  return new Promise<Response>(async (resolve, reject) => {
    try {
      const url = new URL(req.url);
      const path = url.pathname;

      // Get request body if present
      let body: any;
      const contentType = req.headers.get("content-type") || "";

      if (req.method !== "GET" && req.method !== "HEAD") {
        if (contentType.includes("application/json")) {
          try {
            body = await req.json();
          } catch {
            body = {};
          }
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          const text = await req.text();
          body = Object.fromEntries(new URLSearchParams(text));
        } else if (contentType.includes("multipart/form-data")) {
          const formData = await req.formData();
          body = Object.fromEntries(formData);
        }
      }

      // Create a more complete Express-compatible request
      const mockReq: any = {
        url: path + url.search,
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
        query: Object.fromEntries(url.searchParams.entries()),
        body: body || {},
        path: path,
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        get: function (name: string) {
          return this.headers[name.toLowerCase()];
        },
      };

      // Create a buffer to collect response data
      let responseData: Buffer[] = [];
      let statusCode = 200;
      const responseHeaders: Record<string, string> = {};

      const mockRes: any = {
        statusCode: 200,
        headersSent: false,
        setHeader(key: string, value: string | string[]) {
          responseHeaders[key.toLowerCase()] = Array.isArray(value)
            ? value.join(", ")
            : value;
          return this;
        },
        getHeader(key: string) {
          return responseHeaders[key.toLowerCase()];
        },
        removeHeader(key: string) {
          delete responseHeaders[key.toLowerCase()];
          return this;
        },
        writeHead(code: number, headers?: Record<string, string>) {
          statusCode = code;
          if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
              this.setHeader(key, value);
            });
          }
          this.headersSent = true;
          return this;
        },
        status(code: number) {
          statusCode = code;
          this.statusCode = code;
          return this;
        },
        write(chunk: any) {
          if (chunk) {
            responseData.push(Buffer.from(chunk));
          }
          return this;
        },
        end(data?: any) {
          if (data) {
            responseData.push(Buffer.from(data));
          }
          const finalData = Buffer.concat(responseData);
          resolve(
            new Response(finalData, {
              status: statusCode,
              headers: responseHeaders,
            })
          );
          return this;
        },
        send(data: any) {
          if (typeof data === "string") {
            this.setHeader("content-type", "text/html");
            responseData.push(Buffer.from(data));
          } else if (Buffer.isBuffer(data)) {
            responseData.push(data);
          } else {
            this.setHeader("content-type", "application/json");
            responseData.push(Buffer.from(JSON.stringify(data)));
          }
          this.end();
          return this;
        },
        json(data: any) {
          this.setHeader("content-type", "application/json");
          responseData.push(Buffer.from(JSON.stringify(data)));
          this.end();
          return this;
        },
        redirect(statusOrUrl: number | string, url?: string) {
          if (typeof statusOrUrl === "string") {
            statusCode = 302;
            this.setHeader("location", statusOrUrl);
          } else {
            statusCode = statusOrUrl;
            this.setHeader("location", url || "/");
          }
          this.end();
          return this;
        },
      };

      app(mockReq, mockRes);
    } catch (error) {
      console.error("Admin route error:", error);
      reject(error);
    }
  });
}

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}

export async function PUT(req: NextRequest) {
  return handler(req);
}

export async function DELETE(req: NextRequest) {
  return handler(req);
}

export async function PATCH(req: NextRequest) {
  return handler(req);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
