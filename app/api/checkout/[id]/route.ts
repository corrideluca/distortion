import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const checkoutProduct = await prisma.checkoutProduct.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            artist: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!checkoutProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(checkoutProduct);
  } catch (error) {
    console.error("Error fetching checkout product:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}
