type Context = { params: Promise<{ slug: string }> };

const destination = async ({ params }: Context) => {
  const { slug } = await params;
  return `/servicios/${encodeURIComponent(slug)}`;
};

export async function GET(request: Request, context: Context) {
  return new Response(null, {
    status: 301,
    headers: {
      Location: new URL(await destination(context), request.url).toString(),
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

export const HEAD = GET;
