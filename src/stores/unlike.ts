import { defineStore } from "pinia";
import { ref } from "vue";
import { useCookieStore } from './cookie';


export const useUnlikeStore = defineStore("unlikeStore", () => {
  const statusByMovie = ref<Record<number, string>>({});
  const countByMovie = ref<Record<number, number>>({});
  const cookieStore = useCookieStore();

  const fetchStatus = async (userId: number, movieId: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/dislikes/status?userId=${userId}&movieId=${movieId}`
      );
      const data = await res.json();
      statusByMovie.value[movieId] = data.status;
      return data.status;
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      return "NONE";
    }
  };

  const fetchCount = async (movieId: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/dislikes/count?movieId=${movieId}`
      );
      const data = await res.json();
      countByMovie.value[movieId] = data.count || 0;
      return data.count || 0;
    } catch (error) {
      console.error('Erro ao buscar contagem:', error);
      return 0;
    }
  };

  const toggleUnlike = async (movieId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/dislikes/toggle?movieId=${movieId}`, {
      method: 'POST',
      credentials: 'include'
    });

    const data = await response.json();
    
    statusByMovie.value[movieId] = data.newStatus;
    
    const countRes = await fetch(`http://localhost:8080/dislikes/count?movieId=${movieId}`);
    const countData = await countRes.json();
    countByMovie.value[movieId] = countData.count || 0;

  } catch (error) {
    console.error("Erro ao alternar dislike:", error);
  }
};

  const isUnliked = (movieId: number) =>
    statusByMovie.value[movieId] === "DISLIKED";

  const getCount = (movieId: number) => countByMovie.value[movieId] || 0;


  return { 
    statusByMovie, 
    countByMovie,
    fetchStatus, 
    fetchCount,
    toggleUnlike, 
    isUnliked,
    getCount,
  };
});