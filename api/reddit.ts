export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return Response.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  const url = `https://www.reddit.com${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Imagery/1.0)',
        'Accept': 'application/json',
      },
    });
  } catch (err) {
    return Response.json({ error: 'Failed to reach Reddit' }, { status: 502 });
  }

  const text = await res.text();

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    // Reddit returned non-JSON (HTML error/challenge page)
    return Response.json(
      { error: `Reddit returned non-JSON response (status ${res.status})`, body: text.slice(0, 500) },
      { status: 502 },
    );
  }

  return Response.json(data, { status: res.status });
}
