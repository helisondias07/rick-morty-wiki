const API_ORIGIN = 'https://rickandmortyapi.com';

export default async function handler(request, response) {
  const requestUrl = new URL(request.url, `https://${request.headers.host}`);
  const upstreamPath = requestUrl.pathname.replace(
    /^\/api\/rick-morty/,
    '/api'
  );
  const upstreamUrl = `${API_ORIGIN}${upstreamPath}${requestUrl.search}`;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    const contentType = upstreamResponse.headers.get('content-type');
    if (contentType) {
      response.setHeader('Content-Type', contentType);
    }

    response.status(upstreamResponse.status).send(await upstreamResponse.text());
  } catch {
    response.status(502).json({
      error: 'Rick and Morty API is temporarily unavailable',
    });
  }
}
