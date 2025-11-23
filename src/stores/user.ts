import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

const RATINGS_KEY = 'tmdb:user:ratings';
const ODIADOS_KEY = 'tmdb:user:odiados';
const AUTH_KEY = 'tmdb:user:auth';

function loadJSON(key: string, fallback: any) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const useUserStore = defineStore('user', () => {

  const ratings = ref<Record<number, number>>(loadJSON(RATINGS_KEY, {}));
  const odiados = ref<number[]>(loadJSON(ODIADOS_KEY, []));
  const auth = ref<{ token?: string; name?: string; email?: string }>(
    loadJSON(AUTH_KEY, {})
  );

  const save = () => {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings.value));
    localStorage.setItem(ODIADOS_KEY, JSON.stringify(odiados.value));
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth.value));
  };


  const rateMovie = (movieId: number, rating: number) => {
    if (!movieId) return;
    ratings.value = { ...ratings.value, [movieId]: rating };
    save();
  };

  const getUserRating = (movieId: number) => {
    return ratings.value[movieId] ?? null;
  };


  const toggleOdiar = (movieId: number) => {
    const idx = odiados.value.indexOf(movieId);
    if (idx === -1) odiados.value.push(movieId);
    else odiados.value.splice(idx, 1);
    save();
  };

  const isOdiado = (movieId: number) => odiados.value.includes(movieId);

  const setAuth = (payload: { token?: string; name?: string; email?: string }) => {
    auth.value = { ...auth.value, ...payload };
    save();
  };

  const clearAuth = () => {
    auth.value = {};
    save();
  };

  const isAuthenticated = computed(() => !!auth.value.token);

  return {
    ratings,
    odiados,
    auth,
    rateMovie,
    getUserRating,
    toggleOdiar,
    isOdiado,
    setAuth,
    clearAuth,
    isAuthenticated,
  };
});