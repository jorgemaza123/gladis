const movedPermanently = (request: Request, pathname: string) =>
  new Response(null, {
    status: 301,
    headers: {
      Location: new URL(pathname, request.url).toString(),
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });

export function GET(request: Request) {
  return movedPermanently(request, '/servicios');
}

export const HEAD = GET;
