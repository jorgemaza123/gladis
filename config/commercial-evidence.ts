// Paste the public, verified GLADYS reviews link here when it is available.
// An empty value keeps the reviews link hidden everywhere.
export const COMMERCIAL_EVIDENCE = {
  reviewsUrl: '',
};

export function publicReviewsUrl(value = COMMERCIAL_EVIDENCE.reviewsUrl) {
  if (!value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
