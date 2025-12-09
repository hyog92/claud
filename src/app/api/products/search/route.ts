import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/coupang';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!keyword) {
    return NextResponse.json(
      { error: 'keyword parameter is required' },
      { status: 400 }
    );
  }

  try {
    const products = await searchProducts(keyword, limit);
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
