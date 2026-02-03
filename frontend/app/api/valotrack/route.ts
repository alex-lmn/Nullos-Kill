import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const tag = searchParams.get('tag');

  if (!name || !tag) {
    return NextResponse.json({ error: 'Name and tag are required' }, { status: 400 });
  }

  const apiKey = process.env.TRACKER_API_KEY || 'b04755e2-050f-4df2-a22f-1bee288f8524';
  
  // Note: Standard endpoint for Valorant might differ, using the one requested:
  // /v2/<your game>/standard/profile/<platform>/<player identifier>
  const platform = 'riot';
  const game = 'valorant';
  const identifier = `${name}#${tag}`;
  
  const url = `https://public-api.tracker.gg/v2/${game}/standard/profile/${platform}/${encodeURIComponent(identifier)}`;

  try {
    const res = await fetch(url, {
      headers: {
        'TRN-Api-Key': apiKey,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Tracker API Error:', res.status, errorText);
        return NextResponse.json({ error: `Tracker API error: ${res.status}`, details: errorText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}
