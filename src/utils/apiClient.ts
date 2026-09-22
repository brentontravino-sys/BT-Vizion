/**
 * Safe API Client for BT Vizion Intelligence Platform
 * Prevents "Unexpected end of JSON input" errors by safely handling
 * empty responses, non-JSON error payloads, and 429 Quota Exceeded states.
 */

export interface SafeApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
  isQuota?: boolean;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeApiResponse<T>> {
  try {
    // Ensure relative API URLs have a leading slash
    const normalizedUrl = url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...((options?.headers as Record<string, string>) || {}),
    };

    // Only set Content-Type if there's a body or it's a POST/PUT request
    if (options?.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const mergedOptions: RequestInit = {
      credentials: 'same-origin',
      ...options,
      headers,
    };

    const res = await fetch(normalizedUrl, mergedOptions);
    const text = await res.text();
    let data: any = {};

    if (text && text.trim().length > 0) {
      try {
        data = JSON.parse(text);
      } catch {
        // Plain text or HTML error from reverse proxy
        data = { error: text.slice(0, 300) };
      }
    } else {
      let friendlyError = '';
      if (res.status === 405) {
        friendlyError = 'API method was temporarily rejected. Please try sending your query again.';
      } else if (res.status === 502 || res.status === 503 || res.status === 504) {
        friendlyError = 'The AI advisory service is warming up. Please try again in a few seconds.';
      } else if (res.status === 404) {
        friendlyError = 'The requested endpoint was not found.';
      } else {
        friendlyError = res.ok
          ? 'Empty response received from server.'
          : `Server returned HTTP ${res.status} (${res.statusText || 'Error'}).`;
      }
      data = { error: friendlyError };
    }

    // Clean up nested error structures
    let cleanError = data.error;
    if (typeof cleanError === 'object' && cleanError !== null) {
      cleanError = cleanError.message || JSON.stringify(cleanError);
    }

    if (typeof cleanError === 'string' && cleanError.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(cleanError);
        if (parsed.error?.message) {
          cleanError = parsed.error.message;
        }
      } catch {
        // preserve original cleanError string
      }
    }

    const isQuota =
      res.status === 429 ||
      Boolean(data.isQuota) ||
      (typeof cleanError === 'string' &&
        (cleanError.includes('429') ||
          cleanError.toLowerCase().includes('quota') ||
          cleanError.includes('RESOURCE_EXHAUSTED') ||
          cleanError.toLowerCase().includes('rate limit')));

    return {
      ok: res.ok && !data.error,
      status: res.status,
      data,
      error: cleanError,
      isQuota,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: {} as T,
      error: err?.message || 'Network communication failed. Please check your internet connection.',
      isQuota: false,
    };
  }
}
