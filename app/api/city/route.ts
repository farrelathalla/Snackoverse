// app/api/city/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Parse the query parameters from the request URL
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get('province');

  if (!provinceId) {
    return NextResponse.json({ error: 'Province ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.rajaongkir.com/starter/city?province=${provinceId}&key=${process.env.NEXT_PUBLIC_RAJAONGKIR_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
