import { reactive, computed, ref } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { useGenreStore } from './genre';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  adult: boolean;
}

export const useMovieStore = defineStore('movie', () => {
  const state = reactive({
    isLoading: false,
    currentMovie: {} as Movie,
  });

  const currentMovie = computed(() => state.currentMovie);
  const isLoading = computed(() => state.isLoading);

  // Função para buscar filmes ruins (nota < 3) e sem conteúdo adulto
  const getDisappointingMovies = async (count: number = 20) => {
    state.isLoading = true;
    try {
      // Gera uma página aleatória para variedade
      const randomPage = Math.floor(Math.random() * 5) + 1;
      
      const response = await api.get('discover/movie', {
        params: {
          language: 'pt-BR',
          'vote_average.lte': 3.0,
          'vote_count.gte': 10,
          include_adult: false, 
          page: randomPage,
          sort_by: 'vote_average.asc' 
        }
      });
      
      const allMovies = response.data.results || [];
      
      const filteredMovies = allMovies.filter((movie: Movie) => 
        movie.vote_average < 3.0 && !movie.adult
      );
      
      const shuffled = [...filteredMovies].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
      
    } catch (error) {
      console.error('Erro ao buscar filmes decepcionantes:', error);
      return [];
    } finally {
      state.isLoading = false;
    }
  };

  const getMovieDetail = async (movieId: number) => {
    const response = await api.get(`movie/${movieId}`, {
      params: {
        append_to_response: 'credits',
        language: 'pt-BR'
      }
    });
    state.currentMovie = response.data;
  };
  
  const listReviews = async (movieId: number) => {
    const response = await api.get(`movie/${movieId}/reviews`, {
      params: {
        language: 'pt-BR'
      }
    });
    return response.data.results || [];
  };

  const setLoading = (value: boolean) => {
    state.isLoading = value;
  };

  const listBadMovies = async () => {
    state.isLoading = true;
    const response = await api.get('discover/movie', {
      params: {
        language: 'pt-BR',
        'vote_average.lte': 3.0,
        'sort_by': 'vote_average.asc',
        'vote_count.gte': 10,
        include_adult: false
      },
    });
    state.isLoading = false;
    return response.data.results;
  };

  const listMovies = async (genreId: number) => {
    const genreStore = useGenreStore();
    genreStore.setCurrentGenreId(genreId);
    
    const response = await api.get('discover/movie', {
      params: {
        with_genres: genreId,
        language: 'pt-BR',
        'vote_average.lte': 3.0,
        'sort_by': 'vote_average.asc',
        'vote_count.gte': 10,
        include_adult: false
      },
    });
    return response.data.results;
  };
    
  const formatDate = (date: string | number | Date) => new Date(date).toLocaleDateString('pt-BR');
  
  return { 
    currentMovie, 
    getMovieDetail, 
    listMovies, 
    formatDate, 
    isLoading, 
    setLoading, 
    listBadMovies, 
    listReviews,
    getDisappointingMovies 
  };
});