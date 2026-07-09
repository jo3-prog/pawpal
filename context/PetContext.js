import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import staticPets from "../data/pets";

const PetContext = createContext(undefined);

const FAVORITES_KEY = "pawpal:favorites";
const APPLICATIONS_KEY = "pawpal:applications";

function readFromStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function PetProvider({ children }) {
  // ── Pet data 
  const [pets, setPets] = useState(staticPets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState("static");

  // ── Search + filter state 
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "All", breed: "All" });

  // ── Persistence state (hydrated from localStorage after mount)
  const [favorites, setFavorites] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readFromStorage(FAVORITES_KEY, []));
    setApplications(readFromStorage(APPLICATIONS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  }, [applications, hydrated]);

  const fetchPets = useCallback(async ({ type, breed } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (type && type !== "All") params.set("type", type);
      if (breed && breed !== "All") params.set("breed", breed);

      // const response = await fetch(`/api/pets?${params}`);
      // if (!response.ok) throw new Error(`API responded with ${response.status}`);

      // const data = await response.json();
      // setPets(data.pets ?? staticPets);
      // setDataSource(data.source ?? "api");

      // if (data.warning) console.warn("[PawPal]", data.warning);
    } catch (err) {
      console.error("[PawPal] fetchPets error:", err);
      setError("Could not load live pet data. Showing local pets instead.");
      setPets(staticPets);
      setDataSource("static_fallback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  function toggleFavorite(petId) {
    setFavorites((current) =>
      current.includes(petId)
        ? current.filter((id) => id !== petId)
        : [...current, petId]
    );
  }

  function isFavorite(petId) {
    return favorites.includes(petId);
  }

  function hasApplied(petId) {
    return applications.some((app) => app.petId === petId);
  }

  function applyToAdopt(petId, applicantInfo) {
    if (hasApplied(petId)) return;
    setApplications((current) => [
      ...current,
      {
        id: `${petId}-${Date.now()}`,
        petId,
        ...applicantInfo,
        submittedAt: new Date().toISOString(),
      },
    ]);
  }

  function withdrawApplication(applicationId) {
    setApplications((current) =>
      current.filter((app) => app.id !== applicationId)
    );
  }

  // ── Derived filter data 
  const types = useMemo(() => {
    const unique = new Set(pets.map((pet) => pet.type));
    return ["All", ...Array.from(unique).sort()];
  }, [pets]);

  const breeds = useMemo(() => {
    const relevant =
      filters.type === "All"
        ? pets
        : pets.filter((pet) => pet.type === filters.type);
    const unique = new Set(relevant.map((pet) => pet.breed));
    return ["All", ...Array.from(unique).sort()];
  }, [pets, filters.type]);

  const filteredPets = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return pets.filter((pet) => {
      const matchesType = filters.type === "All" || pet.type === filters.type;
      const matchesBreed =
        filters.breed === "All" || pet.breed === filters.breed;
      if (!matchesType || !matchesBreed) return false;
      if (!term) return true;

      const haystack = [pet.name, pet.type, pet.breed, ...(pet.keywords ?? [])]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [pets, searchTerm, filters]);

  function getPetById(id) {
    return pets.find((pet) => String(pet.id) === String(id));
  }

  function clearFilters() {
    setSearchTerm("");
    setFilters({ type: "All", breed: "All" });
  }

  function handleSetFilters(next) {
    setFilters(next);
    // Trigger a fresh API fetch whenever filters change so the Petfinder
    // endpoint can do server-side filtering (ignored when using static data).
    const resolved = typeof next === "function" ? next(filters) : next;
    fetchPets({ type: resolved.type, breed: resolved.breed });
  }

  const value = {
    // Pet data
    pets,
    loading,
    error,
    dataSource,
    fetchPets,
    getPetById,
    // Favorites
    favorites,
    favoritePets: pets.filter((pet) => favorites.includes(pet.id)),
    toggleFavorite,
    isFavorite,
    // Applications
    applications,
    applyToAdopt,
    withdrawApplication,
    hasApplied,
    // Search + filters
    searchTerm,
    setSearchTerm,
    filters,
    setFilters: handleSetFilters,
    clearFilters,
    types,
    breeds,
    filteredPets,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error("usePets must be used within a PetProvider");
  }
  return context;
}
