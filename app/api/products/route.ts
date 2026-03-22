import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const artistId = searchParams.get('artist') || '';
    const category = searchParams.get('category') || '';

    const products = await prisma.product.findMany({
      where: {
        ...(q && { name: { contains: q, mode: 'insensitive' } }),
        ...(artistId && { artistId }),
        ...(category && { category: { equals: category, mode: 'insensitive' } }),
      },
      include: {
        artist: { select: { id: true, name: true } },
        checkoutProduct: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
