import { reactive, computed, ref } from 'vue';
import { useGenreStore } from './genre';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export interface TvShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  genre_ids: number[];
}

export const useTvStore = defineStore('tv', () => {
  const state = reactive({
    isLoading: false,
    currentTv: {} as Partial<TvShow>,
  });
  const setLoading = (value: boolean) => {
  state.isLoading = value;
};
  const isLoading = computed(() => state.isLoading);
  const tvShows = ref<TvShow[]>([]);
  const currentTv = computed(() => state.currentTv);

  const getTvDetail = async (tvId: number) => {
    const response = await api.get(`tv/${tvId}`, {
      params: {
        language: 'pt-BR',
      },
    });
    state.currentTv = response.data;
  };
  
  const listTvShows = async (genreId: number) => {
    const genreStore = useGenreStore();
  genreStore.setCurrentGenreId(genreId);
  state.isLoading = true;
  const response = await api.get('discover/tv', {
    params: {
      with_genres: genreId,
      language: 'pt-BR',
    },
  });
  tvShows.value = response.data.results;
  setLoading(false);
};

const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};
  return { currentTv, getTvDetail, tvShows, listTvShows, formatDate, isLoading, setLoading };
});
