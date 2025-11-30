/* Frontend helper functions to call Supabase Edge Functions
   Use import.meta.env.VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the frontend.
*/

const FUNCTIONS_BASE = (import.meta.env.VITE_SUPABASE_URL || '') + '/functions/v1';

async function callFunction(name: string, method = 'GET', body?: any, token?: string) {
  const url = `${FUNCTIONS_BASE}/${name}`;
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const resp = await fetch(url + (method === 'GET' && body ? ('?' + new URLSearchParams(body)) : ''), {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(body)
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Function ${name} error: ${resp.status} ${text}`);
  }
  return resp.json();
}

export async function getRestaurants(filters: { city?: string; cuisine?: string; min_lbh?: number; limit?: number; offset?: number } = {}) {
  return callFunction('get-restaurants', 'GET', filters);
}

export async function getRestaurant(id: string) {
  return callFunction('get-restaurant', 'GET', { id });
}

export async function addReview(restaurant_id: string, rating: number, text: string, token: string) {
  return callFunction('create-review', 'POST', { restaurant_id, rating, text }, token);
}

export async function getWatchlist(token: string) {
  return callFunction('watchlist', 'GET', undefined, token);
}

export async function addToWatchlist(restaurant_id: string, token: string) {
  return callFunction('watchlist', 'POST', { restaurant_id }, token);
}

export async function removeFromWatchlist(restaurant_id: string, token: string) {
  // use query param on DELETE
  return fetch((import.meta.env.VITE_SUPABASE_URL || '') + `/functions/v1/watchlist?restaurant_id=${encodeURIComponent(restaurant_id)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
}
