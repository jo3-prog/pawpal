/**
 * lib/petfinder.js
 *
 * Lightweight Petfinder API v2 client.
 *
 * Reads two environment variables (set these in .env.local for development
 * or in the Vercel dashboard for production):
 *
 *   PETFINDER_API_KEY    — your Petfinder client_id
 *   PETFINDER_SECRET     — your Petfinder client_secret
 *
 * The access token is cached in module scope so it is reused across requests
 * within the same Node.js process (e.g. a warm Vercel serverless function).
 */

const PETFINDER_API = "https://api.petfinder.com/v2";

// Module-level token cache (lives for the lifetime of one serverless invocation).
let tokenCache = null;

async function getAccessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  const response = await fetch(`${PETFINDER_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.PETFINDER_API_KEY,
      client_secret: process.env.PETFINDER_SECRET,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Petfinder OAuth failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return tokenCache.token;
}

/**
 * Fetch a page of animals from the Petfinder API and normalize each result
 * into the same shape the rest of PawPal uses for its static pet objects.
 *
 * @param {object} options
 * @param {number} [options.limit=20]   Number of results (max 100 per Petfinder).
 * @param {number} [options.page=1]     Page number.
 * @param {string} [options.type]       "Dog", "Cat", "Rabbit", "Bird", etc.
 * @param {string} [options.breed]      Breed name (exact, case-insensitive).
 * @param {string} [options.location]   Zip code or "City, State".
 * @returns {Promise<{ pets: object[], pagination: object }>}
 */
export async function fetchPetsFromPetfinder({
  limit = 20,
  page = 1,
  type,
  breed,
  location,
} = {}) {
  const token = await getAccessToken();

  const params = new URLSearchParams({ limit, page });
  if (type && type !== "All") params.set("type", type);
  if (breed && breed !== "All") params.set("breed", breed);
  if (location) params.set("location", location);

  const response = await fetch(`${PETFINDER_API}/animals?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Petfinder /animals request failed (${response.status}): ${text}`
    );
  }

  const json = await response.json();

  const pets = (json.animals ?? []).map(normalizePet);
  return { pets, pagination: json.pagination ?? {} };
}

/**
 * Map a single Petfinder animal object to PawPal's internal pet shape.
 */
function normalizePet(animal) {
  // Primary photo: prefer medium size, fall back through sizes then to a placeholder.
  const photoObj = animal.photos?.[0];
  const image =
    photoObj?.medium ??
    photoObj?.large ??
    photoObj?.small ??
    photoObj?.full ??
    `https://placehold.co/600x450/2F5233/FBF3E1?text=${encodeURIComponent(animal.name ?? "Pet")}`;

  // Normalize age string: Petfinder returns "Baby", "Young", "Adult", "Senior".
  const age = normalizeAge(animal.age);

  const keywords = [
    animal.type,
    animal.species,
    animal.breeds?.primary,
    animal.breeds?.secondary,
    ...(animal.tags ?? []),
    animal.colors?.primary,
    animal.environment?.children === true ? "good with kids" : null,
    animal.environment?.dogs === true ? "good with dogs" : null,
    animal.environment?.cats === true ? "good with cats" : null,
  ]
    .filter(Boolean)
    .map((k) => k.toLowerCase());

  return {
    id: animal.id,
    name: animal.name ?? "Unknown",
    type: animal.type ?? "Unknown",
    breed:
      animal.breeds?.primary ??
      animal.species ??
      animal.type ??
      "Mixed breed",
    age,
    gender: animal.gender ?? "Unknown",
    description:
      (animal.description ?? "").replace(/&#039;/g, "'").trim() ||
      `Meet ${animal.name}, a ${age.toLowerCase()} ${animal.breeds?.primary ?? animal.type} looking for a loving home.`,
    image,
    keywords: [...new Set(keywords)],
    // Extra Petfinder-specific fields exposed for potential future use.
    status: animal.status,
    url: animal.url,
    location: animal.contact?.address,
  };
}

function normalizeAge(ageCode) {
  const map = {
    Baby: "Under 1 year",
    Young: "1–2 years",
    Adult: "3–7 years",
    Senior: "8+ years",
  };
  return map[ageCode] ?? ageCode ?? "Unknown";
}
