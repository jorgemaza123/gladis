import type { Metadata } from 'next';
import type { SiteContent, SEOFields } from '@/models/content';
import {
  getBusinessContact,
  resolveWhatsAppDestination,
} from '@/lib/business-contacts';
export function absoluteUrl(site: SiteContent, path: string) {
  try {
    const origin = new URL(site.settings.origin);
    if (!['https:', 'http:'].includes(origin.protocol)) return undefined;
    return new URL(path, origin.origin).href;
  } catch {
    return undefined;
  }
}
export function canonicalFor(
  site: SiteContent,
  fields: SEOFields,
  path: string,
) {
  const fallback = absoluteUrl(site, path);
  if (!fields.canonical) return fallback;
  try {
    const url = new URL(fields.canonical, site.settings.origin);
    return url.origin === new URL(site.settings.origin).origin &&
      !url.search &&
      !url.hash
      ? url.href
      : fallback;
  } catch {
    return fallback;
  }
}

type QueryValue = string | string[] | undefined;

function scalar(value: QueryValue) {
  return typeof value === 'string' ? value : '';
}

/** Keeps only the internally generated page number in canonical catalogue URLs. */
export function catalogUrlPolicy(
  kind: string,
  query: Record<string, QueryValue>,
) {
  const rawPage = scalar(query.pagina);
  const parsedPage = /^[1-9][0-9]*$/.test(rawPage) ? Number(rawPage) : 1;
  const page = Number.isSafeInteger(parsedPage) ? parsedPage : 1;
  const hasFilters = Boolean(
    scalar(query.q).trim() ||
    scalar(query.categoria) ||
    scalar(query.modalidad),
  );
  return {
    page,
    pageParamPresent: rawPage.length > 0,
    noindex: hasFilters,
    canonicalPath:
      hasFilters || page === 1 ? `/${kind}` : `/${kind}?pagina=${page}`,
  };
}
export function metadataFor(
  site: SiteContent,
  fields: SEOFields,
  path: string,
  imageId?: string,
): Metadata {
  const s = site.settings,
    canonical = canonicalFor(site, fields, path),
    title = fields.title || s.seo.title || s.name,
    description = fields.description || s.seo.description || s.footer;
  const image = site.media.find(
    (m) => m.id === (fields.imageId || imageId) && (!m.demo || s.demo),
  );
  const imageUrl = image ? absoluteUrl(site, image.url) : undefined;
  const index = !!(
    s.origin &&
    s.indexable &&
    !s.demo &&
    !s.seo.noindex &&
    !fields.noindex
  );
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: { index, follow: true },
    openGraph: {
      title,
      description,
      locale: 'es_PE',
      type: 'website',
      url: canonical,
      siteName: s.name,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: image?.alt,
              width: image?.width,
              height: image?.height,
            },
          ]
        : [],
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}
export function breadcrumbsData(
  site: SiteContent,
  items: { name: string; path: string }[],
) {
  if (!site.settings.origin || site.settings.demo) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((i, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: i.name,
      item: absoluteUrl(site, i.path),
    })),
  };
}
export function businessData(site: SiteContent) {
  const s = site.settings;
  const url = absoluteUrl(site, '/');
  if (!s.businessVerified || s.demo || !url || !s.name.trim()) return null;
  const logo = site.media.find((media) => media.id === s.logoId && !media.demo);
  const logoUrl = logo ? absoluteUrl(site, logo.url) : undefined;
  const areaServed = Array.from(
    new Set(
      site.entries
        .filter(
          (entry) => entry.kind === 'cobertura' && entry.status === 'published',
        )
        .map((entry) => entry.title.trim())
        .filter(Boolean),
    ),
  ).map((name) => ({ '@type': 'AdministrativeArea', name }));
  const publicOwners = new Set(
    site.entries
      .filter((entry) => entry.status === 'published' && entry.requestable)
      .map((entry) => entry.ownerId),
  );
  const contactPoint = Array.from(publicOwners).flatMap((ownerId) => {
    const contact = getBusinessContact(ownerId);
    const phone = resolveWhatsAppDestination(ownerId);
    return contact && phone
      ? [
          {
            '@type': 'ContactPoint',
            contactType: contact.label,
            telephone: `+${phone}`,
          },
        ]
      : [];
  });
  const publicAddress = s.publicAddress.trim();
  return {
    '@context': 'https://schema.org',
    '@type': publicAddress ? 'LocalBusiness' : 'Organization',
    '@id': absoluteUrl(site, '/#business'),
    name: s.name,
    url,
    description: s.seo.description || s.footer,
    ...(logoUrl ? { logo: logoUrl, image: logoUrl } : {}),
    ...(publicAddress
      ? { address: { '@type': 'PostalAddress', streetAddress: publicAddress } }
      : {}),
    ...(areaServed.length ? { areaServed } : {}),
    ...(contactPoint.length ? { contactPoint } : {}),
    ...(s.email ? { email: s.email } : {}),
    sameAs: s.socialLinks.map((l) => l.url),
  };
}
