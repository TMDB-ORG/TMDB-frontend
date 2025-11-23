import { defineStore } from "pinia";
import { ref } from "vue";

export const useUnlikeStore = defineStore("unlikeStore", () => {
  const statusByMovie = ref<Record<number, string>>({});


  const fetchStatus = async (userId: number, movieId: number) => {
    const res = await fetch(
      `http://localhost:8080/dislikes/status?userId=${userId}&movieId=${movieId}`
    );

    const data = await res.json();
    statusByMovie.value[movieId] = data.status;
    return data.status;
  };


  const toggleUnlike = async (movieId: number) => {
    const current = statusByMovie.value[movieId] || "NONE";
    alert("toggleUnlike backend ainda não existe");
    if (current === "DISLIKED") {
      await fetch("http://localhost:8080/dislikes/removeDislike?", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
      });
      statusByMovie.value[movieId] = "NONE";
      return;
    }

    await fetch(`http://localhost:8080/dislikes/dislikeMovie?movieId=${movieId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    });

  };

  const isUnliked = (movieId: number) =>
    statusByMovie.value[movieId] === "DISLIKED";

  return { statusByMovie, fetchStatus, toggleUnlike, isUnliked };
});
