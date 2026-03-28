export const config = { runtime: 'edge' };

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'web:imagery:1.0',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`Reddit auth failed: ${res.status}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return Response.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.json({ error: 'Reddit API credentials not configured' }, { status: 500 });
  }

  let token: string;
  try {
    token = await getAccessToken(clientId, clientSecret);
  } catch (err) {
    return Response.json({ error: 'Failed to authenticate with Reddit' }, { status: 502 });
  }

  const url = `https://oauth.reddit.com${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'web:imagery:1.0',
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
    return Response.json(
      { error: `Reddit returned non-JSON (status ${res.status})` },
      { status: 502 },
    );
  }

  return Response.json(data, { status: res.status });
}
