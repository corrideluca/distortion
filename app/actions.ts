"use server";

import { prisma } from "@/lib/prisma";
import { createSession, destroySession, getSession } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function login(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return { error: "Credenciales incorrectas" };
  }
  await createSession(admin.id);
  return { success: true };
}

export async function logout() {
  await destroySession();
  return { success: true };
}

export async function checkAuth() {
  const adminId = await getSession();
  return !!adminId;
}

export async function createProduct(formData: FormData) {
  const adminId = await getSession();
  if (!adminId) return { error: "No autorizado" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const image = formData.get("image") as string;

  if (!name || !description || !price || !image) {
    return { error: "Todos los campos son obligatorios" };
  }

  const product = await prisma.product.create({
    data: { name, description, price, image },
  });

  return { success: true, product };
}

export async function updateProduct(id: string, formData: FormData) {
  const adminId = await getSession();
  if (!adminId) return { error: "No autorizado" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const image = formData.get("image") as string;

  if (!name || !description || !price || !image) {
    return { error: "Todos los campos son obligatorios" };
  }

  const product = await prisma.product.update({
    where: { id },
    data: { name, description, price, image },
  });

  return { success: true, product };
}

export async function deleteProduct(id: string) {
  const adminId = await getSession();
  if (!adminId) return { error: "No autorizado" };

  await prisma.product.delete({ where: { id } });
  return { success: true };
}

export async function getProducts() {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAdmins() {
  return prisma.admin.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAdmin(email: string, password: string) {
  const adminId = await getSession();
  if (!adminId) return { error: "No autorizado" };

  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: { email, password: hashed },
  });

  return { success: true, admin: { id: admin.id, email: admin.email } };
}

export async function deleteAdmin(id: string) {
  const adminId = await getSession();
  if (!adminId) return { error: "No autorizado" };

  if (adminId === id) {
    return { error: "No podés eliminarte a vos mismo" };
  }

  await prisma.admin.delete({ where: { id } });
  return { success: true };
}

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function updateSetting(key: string, value: string) {
  const adminId = await getSession();
  if (!adminId) return { error: "No autorizado" };

  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return { success: true };
}
