<template>
  <section class="bad-movies">
    <h2>Os Piores Filmes</h2>
    <div class="carousel">
      <div
        v-for="movie in movieStore.movies"
        :key="movie.id"
        class="carousel-item"
      >
        <img :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`" alt="" />
        <p class="title">{{ movie.title }}</p>
        <p class="rating">Nota: {{ movie.vote_average }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useMovieStore } from '@/stores/movie';
const movieStore = useMovieStore();

movieStore.listBadMovies();
</script>

<style scoped>
.bad‑movies {
  padding: 2rem;
  background-color: #FFFFFF;
  color: #000000;
}

.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
}

.carousel-item {
  flex: 0 0 auto;
  width: 200px;
  scroll-snap-align: start;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.carousel-item img {
  width: 100%;
  border-radius: 4px;
}

.title {
  margin: 0.5rem 0 0.25rem;
  font-size: 1rem;
}

.rating {
  color: #D2A63C; 
  font-weight: bold;
}
</style>
