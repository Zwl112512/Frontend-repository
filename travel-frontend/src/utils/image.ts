// src/utils/image.ts
export function getImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `http://localhost:3000${path}`;
}
