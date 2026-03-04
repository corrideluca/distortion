import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const artist = await prisma.artist.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!artist) {
      return NextResponse.json({ error: "Artista no encontrado" }, { status: 404 });
    }

    return NextResponse.json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    return NextResponse.json({ error: "Error al obtener artista" }, { status: 500 });
  }
}
