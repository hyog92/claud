import { NextResponse } from 'next/server';
import { getGoldboxProducts } from '@/lib/coupang';

export async function GET() {
  try {
    const products = await getGoldboxProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Goldbox error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
