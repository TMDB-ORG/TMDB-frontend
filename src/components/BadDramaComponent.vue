<template>
  <section class="bad-movies">
    <h2>Drama para rir</h2>
    <div class="carousel-container">
      <button class="carousel-btn carousel-btn-prev" @click="scrollPrev">
        &#8249;
      </button>

      <div class="carousel" ref="carouselRef" @wheel.prevent @touchmove.prevent>
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="carousel-item"
          @click="goToDetails(movie.id)"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="movie-banner"
          />
          <div class="movie-overlay">
            <p class="title">{{ movie.title }}</p>
            <p class="rating">{{ movie.vote_average.toFixed(1) }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-btn carousel-btn-next" @click="scrollNext">
        &#8250;
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/movie';
import type { Movie } from '@/types/moviesTypes';

const movieStore = useMovieStore();
const router = useRouter();
const carouselRef = ref<HTMLElement | null>(null);

const movies = ref<Movie[]>([]);

const loadMovies = async () => {
  movies.value = await movieStore.listMovies(18);
  console.log(movies.value);
};

const goToDetails = (id: number) => {
  router.push({ name: 'MovieDetails', params: { movieId: id } });
};

const scrollNext = () => {
  if (carouselRef.value) {
    const itemWidth = 320;
    const visibleItems = 5;
    const scrollAmount = itemWidth * visibleItems;
    
    carouselRef.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
};

const scrollPrev = () => {
  if (carouselRef.value) {
    const itemWidth = 320; 
    const visibleItems = 5;
    const scrollAmount = itemWidth * visibleItems;
    
    carouselRef.value.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }
};

onMounted(() => {
  loadMovies();
});
</script>

<style scoped>
.bad-movies {
  padding: 2rem;
  background-color: #000000;
  position: relative;
}

h2 {
  color: rgb(243, 240, 240);
  font-family: 'Lato', sans-serif;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  /* Previne scroll da página quando sobre o carousel */
  overscroll-behavior: contain;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 calc(14.28% - 1rem); 
  aspect-ratio: 2 / 3;
  scroll-snap-align: start;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.6),
    0 4px 12px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  cursor: pointer;
}

.carousel-item:hover {
  transform: scale(1.05);
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.8),
    0 6px 18px rgba(0, 0, 0, 0.6);
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-item:hover img {
  transform: scale(1.1);
}

.movie-banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-item:hover .movie-banner {
  transform: scale(1.1);
}

.movie-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(2, 5, 11, 0.95) 0%,
    rgba(2, 5, 11, 0.7) 50%,
    transparent 100%
  );
  padding: 2rem 1rem 1rem;
  transform: translateY(10px);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.carousel-item:hover .movie-overlay {
  transform: translateY(0);
  opacity: 1;
}

.title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  font-family: 'Lato', sans-serif;
}

.rating {
  color: #D2A63C;
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.carousel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0px;
  padding: 2px;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(210, 166, 60, 0.3),
    transparent
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
  -webkit-mask-composite: xor;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.carousel-item:hover::before {
  opacity: 1;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(210, 166, 60, 0.8);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.carousel-btn:hover {
  background: rgba(210, 166, 60, 1);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn-prev {
  left: -25px;
}

.carousel-btn-next {
  right: -25px;
}

@media (max-width: 1400px) {
  .carousel-item {
    flex: 0 0 calc(25% - 1rem);
    min-width: 250px;
  }
}

@media (max-width: 1200px) {
  .carousel-item {
    flex: 0 0 calc(33.333% - 1rem); 
    min-width: 230px;
  }
}

@media (max-width: 768px) {
  .bad-movies {
    padding: 1rem;
  }
  
  .carousel-item {
    flex: 0 0 calc(50% - 1rem); 
    min-width: 200px;
    height: 350px;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .carousel-btn-prev {
    left: -15px;
  }
  
  .carousel-btn-next {
    right: -15px;
  }
}

@media (max-width: 480px) {
  .carousel-item {
    flex: 0 0 calc(100% - 1rem); 
    min-width: 180px;
    height: 300px;
  }
  
  .movie-overlay {
    padding: 1.5rem 0.8rem 0.8rem;
  }
  
  .title {
    font-size: 1rem;
  }
  
  .rating {
    font-size: 0.9rem;
  }
  
  .carousel-btn {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}
</style>