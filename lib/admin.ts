import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';

AdminJS.registerAdapter({ Database, Resource });

const prisma = new PrismaClient();

export const adminOptions = {
  resources: [
    {
      resource: { model: prisma.product, client: prisma },
      options: {
        properties: {
          id: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          name: {
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
        actions: {
          new: {
            isAccessible: true,
          },
          edit: {
            isAccessible: true,
          },
          delete: {
            isAccessible: true,
          },
          bulkDelete: {
            isAccessible: true,
          },
        },
      },
    },
  ],
  branding: {
    companyName: 'SeweetyBella Admin',
    logo: false,
    withMadeWithLove: false,
    softwareBrothers: false,
  },
  rootPath: '/admin',
};

export const admin = new AdminJS(adminOptions);
