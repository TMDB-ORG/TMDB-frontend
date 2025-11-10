import { reactive, computed, ref} from 'vue';
import { defineStore } from 'pinia';

import api from '@/plugins/axios';
import { useGenreStore } from './genre';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
}
export const useMovieStore = defineStore('movie', () => {
  const state = reactive({
    isLoading : ref(false),
    currentMovie: {},
  });

  const currentMovie = computed(() => state.currentMovie);

  const getMovieDetail = async (movieId: number) => {
    // adiciona credits para poder mostrar elenco/equipe
    const response = await api.get(`movie/${movieId}`, {
      params: {
        append_to_response: 'credits',
        language: 'pt-BR'
      }
    });
    state.currentMovie = response.data;
  };
  const setLoading = (value: boolean) => {
  state.isLoading = value;
};
const listBadMovies = async (genreId: number) => {
  state.isLoading = true;
  const response = await api.get('discover/movie', {
    params: {
      with_genres: genreId || null,
      language: 'pt-BR',
      'vote_average.lte': 3.0,
      'sort_by': 'vote_average.asc',
      'vote_count.gte': 50
    },
  });
  movies.value = response.data.results;
  state.isLoading = false;
  return response.data.results;
};
const isLoading = computed(() => state.isLoading);
  const movies = ref<Movie[]>([]);

 const listMovies = async (genreId : number) => {
  const genreStore = useGenreStore();
  genreStore.setCurrentGenreId(genreId);
  console.log(genreStore.currentGenreId);
 
  const response = await api.get('discover/movie', {
    params: {
      with_genres: genreId,
      language: 'pt-BR',
    },
  });
  movies.value = response.data.results;
  setLoading(false);
};
  
   const formatDate = (date: string | number | Date) => new Date(date).toLocaleDateString('pt-BR');
  return { currentMovie, getMovieDetail, listMovies, formatDate, isLoading, setLoading, listBadMovies};
});