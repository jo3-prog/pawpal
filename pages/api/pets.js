/**
 * pages/api/pets.js
 *
 * API route that proxies the Petfinder API so the client_id / client_secret
 * never reach the browser.
 *
 * When PETFINDER_API_KEY is absent (e.g. a dev working without keys) the
 * route falls back to the static pet data so the app remains fully functional.
 *
 * Query params forwarded from the client:
 *   type     — "Dog" | "Cat" | "Rabbit" | "Bird" | …  (optional)
 *   breed    — exact breed string                       (optional)
 *   limit    — 1-100, default 20                        (optional)
 *   page     — 1-based page number, default 1           (optional)
 */

import { fetchPetsFromPetfinder } from "../../lib/petfinder";
import staticPets from "../../data/pets";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, breed, location, limit = "20", page = "1" } = req.query;

  // If no API key is configured, serve the static data immediately.
  if (!process.env.PETFINDER_API_KEY || !process.env.PETFINDER_SECRET) {
    return res.status(200).json({
      pets: staticPets,
      pagination: {
        count_per_page: staticPets.length,
        total_count: staticPets.length,
        current_page: 1,
        total_pages: 1,
      },
      source: "static",
    });
  }

  try {
    const result = await fetchPetsFromPetfinder({
      type,
      breed,
      location,
      limit: Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100),
      page: Math.max(parseInt(page, 10) || 1, 1),
    });

    // Cache for 5 minutes at the CDN / browser level.
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ ...result, source: "petfinder" });
  } catch (error) {
    console.error("[api/pets] Petfinder error:", error.message);
    // Graceful degradation: serve static data on API failure.
    return res.status(200).json({
      pets: staticPets,
      pagination: {
        count_per_page: staticPets.length,
        total_count: staticPets.length,
        current_page: 1,
        total_pages: 1,
      },
      source: "static_fallback",
      warning: "Live data temporarily unavailable — showing cached pets.",
    });
  }
}
