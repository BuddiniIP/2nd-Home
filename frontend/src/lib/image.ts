const DEFAULT_API_BASE = 'http://localhost:5000';

export const imageUrl = (path: string | null | undefined, apiBase?: string): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = apiBase || import.meta.env.VITE_API_BASE || DEFAULT_API_BASE;
  return `${base}${path}`;
};
