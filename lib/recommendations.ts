import type { ContentEntry, Recommendation } from '@/models/content';

export type RecommendationCandidate = Pick<
  ContentEntry,
  | 'id'
  | 'kind'
  | 'slug'
  | 'title'
  | 'description'
  | 'status'
  | 'sortOrder'
  | 'imageId'
  | 'requestable'
  | 'ownerId'
  | 'quoteConfig'
  | 'recommendations'
>;

export type ResolvedRecommendation<T extends RecommendationCandidate = RecommendationCandidate> = {
  entry: T;
  reason: string;
  priority: number;
};

function matchesEvent(recommendation: Recommendation, eventTypeId?: string | null) {
  return recommendation.eventTypeIds.length === 0 ||
    (!!eventTypeId && recommendation.eventTypeIds.includes(eventTypeId));
}

function isRequestable(entry: RecommendationCandidate | undefined): entry is RecommendationCandidate {
  return !!entry && entry.status === 'published' && entry.requestable &&
    entry.ownerId !== null && entry.quoteConfig !== null;
}

/** Resolves one explicit level only. It never infers or follows a recommendation recursively. */
export function resolveRecommendations<T extends RecommendationCandidate>({
  sourceEntryId,
  entries,
  presentEntryIds = [],
  eventTypeId,
  limit = 3,
}: {
  sourceEntryId: string | null;
  entries: T[];
  presentEntryIds?: Iterable<string>;
  eventTypeId?: string | null;
  limit?: number;
}): ResolvedRecommendation<T>[] {
  if (!sourceEntryId || limit < 1) return [];
  const source = entries.find((entry) => entry.id === sourceEntryId);
  if (!source) return [];
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const present = new Set(presentEntryIds);
  present.add(sourceEntryId);
  const seen = new Set<string>();

  const candidates = source.recommendations
    .filter((recommendation) => matchesEvent(recommendation, eventTypeId))
    .map((recommendation) => ({ recommendation, entry: byId.get(recommendation.entryId) }))
    .filter((item): item is { recommendation: Recommendation; entry: T } =>
      isRequestable(item.entry) && !present.has(item.recommendation.entryId),
    )
    .sort((left, right) =>
      left.recommendation.priority - right.recommendation.priority ||
      left.entry.sortOrder - right.entry.sortOrder ||
      left.entry.title.localeCompare(right.entry.title),
    );

  return candidates
    .filter(({ recommendation }) => {
      if (seen.has(recommendation.entryId)) return false;
      seen.add(recommendation.entryId);
      return true;
    })
    .slice(0, limit)
    .map(({ recommendation, entry }) => ({
      entry,
      reason: recommendation.reason,
      priority: recommendation.priority,
    }));
}
