export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return Response.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  const url = `https://www.reddit.com${path}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Imagery/1.0' },
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
