import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ownerIds = new Set(['cocina', 'eventos']);
const validId = (value) => typeof value === 'string' && value.length > 0;

export function diagnoseCatalog(site) {
  const entries = Array.isArray(site?.entries) ? site.entries : [];
  const byId = new Map(entries.filter((entry) => validId(entry?.id)).map((entry) => [entry.id, entry]));
  const issues = [];
  const graph = new Map();

  for (const entry of entries) {
    if (!validId(entry?.id)) {
      issues.push({ type: 'invalid_entry', entryId: null, message: 'Entrada sin ID válido.' });
      continue;
    }
    const config = entry.quoteConfig;
    if (entry.requestable) {
      if (!ownerIds.has(entry.ownerId))
        issues.push({ type: 'missing_owner', entryId: entry.id, message: 'Oferta cotizable sin responsable confirmado.' });
      if (
        !config ||
        !['person', 'unit', 'event', 'hour'].includes(config.quantityUnit) ||
        !(config.minimum > 0) ||
        !(config.maximum >= config.minimum) ||
        !(config.step > 0)
      )
        issues.push({ type: 'incomplete_rules', entryId: entry.id, message: 'Oferta cotizable con reglas incompletas.' });
    }
    const targets = [];
    for (const recommendation of Array.isArray(entry.recommendations) ? entry.recommendations : []) {
      if (!byId.has(recommendation?.entryId))
        issues.push({ type: 'invalid_reference', entryId: entry.id, message: `Recomendación inválida: ${String(recommendation?.entryId)}.` });
      else targets.push(recommendation.entryId);
      for (const eventTypeId of Array.isArray(recommendation?.eventTypeIds) ? recommendation.eventTypeIds : [])
        if (byId.get(eventTypeId)?.kind !== 'tipos-evento')
          issues.push({ type: 'invalid_event_type_reference', entryId: entry.id, message: `Tipo de evento inválido: ${String(eventTypeId)}.` });
    }
    graph.set(entry.id, targets);
  }

  const visited = new Set();
  const visiting = new Set();
  const visit = (id) => {
    if (visiting.has(id)) {
      issues.push({ type: 'recommendation_cycle', entryId: id, message: 'Ciclo de recomendaciones detectado.' });
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const target of graph.get(id) || []) visit(target);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of graph.keys()) visit(id);
  return issues;
}

async function run() {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf('--input');
  const inputPath = inputIndex >= 0 ? args[inputIndex + 1] : undefined;
  if (inputIndex >= 0 && !inputPath) throw new Error('Falta la ruta después de --input.');
  const site = inputPath ? JSON.parse(await readFile(inputPath, 'utf8')) : { entries: [] };
  const issues = diagnoseCatalog(site);
  console.log(JSON.stringify({ issues }, null, 2));
  if (args.includes('--strict') && issues.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await run();
