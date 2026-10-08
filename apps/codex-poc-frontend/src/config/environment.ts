export function readEnvironment(
  environment: Readonly<Record<string, string | undefined>>,
): { apiBaseUrl: string } {
  const value = environment.API_BASE_URL ?? 'http://localhost:3001';
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('API_BASE_URL must be an absolute HTTP(S) origin');
  }
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== '/'
  ) {
    throw new Error(
      'API_BASE_URL must be an absolute HTTP(S) origin without credentials, path, query, or fragment',
    );
  }
  return { apiBaseUrl: url.origin };
}
