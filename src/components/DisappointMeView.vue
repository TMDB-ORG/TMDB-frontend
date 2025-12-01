<template>
  <section class="disappoint-me-section">
    <h2 class="section-title">Me Decepcione</h2>
    
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <button class="carousel-btn carousel-btn-prev" @click="scrollPrev(0)">
          &#8249;
        </button>
        
        <div class="carousel" ref="carousel1Ref" @wheel.prevent @touchmove.prevent>
          <div
            v-for="movie in carousel1Movies"
            :key="movie.id"
            class="carousel-item"
            @click="goToDetails(movie.id)"
          >
            <img 
              :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg'"
              :alt="movie.title"
              class="movie-banner"
              loading="lazy"
            />
            <div class="movie-overlay">
              <p class="title">{{ movie.title }}</p>
              <p class="rating"> {{ movie.vote_average?.toFixed(1) || 'N/A' }}</p>
            </div>
           
          </div>
        </div>

        <button class="carousel-btn carousel-btn-next" @click="scrollNext(0)">
          &#8250;
        </button>
      </div>
    </div>

    <div class="carousel-container">
      <div class="carousel-wrapper">
        <button class="carousel-btn carousel-btn-prev" @click="scrollPrev(1)">
          &#8249;
        </button>
        
        <div class="carousel" ref="carousel2Ref" @wheel.prevent @touchmove.prevent>
          <div
            v-for="movie in carousel2Movies"
            :key="movie.id"
            class="carousel-item"
            @click="goToDetails(movie.id)"
          >
            <img 
              :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg'"
              :alt="movie.title"
              class="movie-banner"
              loading="lazy"
            />
            <div class="movie-overlay">
              <p class="title">{{ movie.title }}</p>
              <p class="rating">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <button class="carousel-btn carousel-btn-next" @click="scrollNext(1)">
          &#8250;
        </button>
      </div>
    </div>

    <div class="carousel-container">
      <div class="carousel-wrapper">
        <button class="carousel-btn carousel-btn-prev" @click="scrollPrev(2)">
          &#8249;
        </button>
        
        <div class="carousel" ref="carousel3Ref" @wheel.prevent @touchmove.prevent>
          <div
            v-for="movie in carousel3Movies"
            :key="movie.id"
            class="carousel-item"
            @click="goToDetails(movie.id)"
          >
            <img 
              :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg'"
              :alt="movie.title"
              class="movie-banner"
              loading="lazy"
            />
            <div class="movie-overlay">
              <p class="title">{{ movie.title }}</p>
              <p class="rating">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <button class="carousel-btn carousel-btn-next" @click="scrollNext(2)">
          &#8250;
        </button>
      </div>
    </div>

    <div class="carousel-container">
      <div class="carousel-wrapper">
        <button class="carousel-btn carousel-btn-prev" @click="scrollPrev(3)">
          &#8249;
        </button>
        
        <div class="carousel" ref="carousel4Ref" @wheel.prevent @touchmove.prevent>
          <div
            v-for="movie in carousel4Movies"
            :key="movie.id"
            class="carousel-item"
            @click="goToDetails(movie.id)"
          >
            <img 
              :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg'"
              :alt="movie.title"
              class="movie-banner"
              loading="lazy"
            />
            <div class="movie-overlay">
              <p class="title">{{ movie.title }}</p>
              <p class="rating"> {{ movie.vote_average?.toFixed(1) || 'N/A' }}</p>
            </div>

          </div>
        </div>

        <button class="carousel-btn carousel-btn-next" @click="scrollNext(3)">
          &#8250;
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Carregando decepções...</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/movie';
import type { Movie } from '@/types/moviesTypes';

const movieStore = useMovieStore();
const router = useRouter();

const carousel1Ref = ref<HTMLElement | null>(null);
const carousel2Ref = ref<HTMLElement | null>(null);
const carousel3Ref = ref<HTMLElement | null>(null);
const carousel4Ref = ref<HTMLElement | null>(null);

const carousel1Movies = ref<Movie[]>([]);
const carousel2Movies = ref<Movie[]>([]);
const carousel3Movies = ref<Movie[]>([]);
const carousel4Movies = ref<Movie[]>([]);

const isLoading = ref(false);

const autoScrollIntervals = ref<number[]>([]);

const loadAllMovies = async () => {
  isLoading.value = true;
  
  try {
    const [movies1, movies2, movies3, movies4] = await Promise.all([
      movieStore.getDisappointingMovies(15),
      movieStore.getDisappointingMovies(15),
      movieStore.getDisappointingMovies(15),
      movieStore.getDisappointingMovies(15)
    ]);
    
    carousel1Movies.value = movies1;
    carousel2Movies.value = movies2;
    carousel3Movies.value = movies3;
    carousel4Movies.value = movies4;
    
  } catch (error) {
    console.error('Erro ao carregar filmes decepcionantes:', error);
  } finally {
    isLoading.value = false;
  }
};

const goToDetails = (id: number) => {
  router.push({ name: 'MovieDetails', params: { movieId: id } });
};

const scrollNext = (carouselIndex: number) => {
  const carouselRefs = [carousel1Ref, carousel2Ref, carousel3Ref, carousel4Ref];
  const carousel = carouselRefs[carouselIndex].value;
  
  if (carousel) {
    const itemWidth = 320;
    const visibleItems = 5;
    const scrollAmount = itemWidth * visibleItems;
    
    carousel.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
};

const scrollPrev = (carouselIndex: number) => {
  const carouselRefs = [carousel1Ref, carousel2Ref, carousel3Ref, carousel4Ref];
  const carousel = carouselRefs[carouselIndex].value;
  
  if (carousel) {
    const itemWidth = 320;
    const visibleItems = 5;
    const scrollAmount = itemWidth * visibleItems;
    
    carousel.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }
};

const startAutoScroll = () => {
  autoScrollIntervals.value.forEach(interval => clearInterval(interval));
  autoScrollIntervals.value = [];
  
  const carouselRefs = [carousel1Ref, carousel2Ref, carousel3Ref, carousel4Ref];
  
  carouselRefs.forEach((carouselRef, index) => {
    const interval = setInterval(() => {
      if (carouselRef.value) {
        const maxScroll = carouselRef.value.scrollWidth - carouselRef.value.clientWidth;
        const currentScroll = carouselRef.value.scrollLeft;
        
        if (currentScroll >= maxScroll - 10) {
          carouselRef.value.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          const itemWidth = 320;
          carouselRef.value.scrollBy({
            left: itemWidth,
            behavior: 'smooth'
          });
        }
      }
    }, 3000); 
    
    autoScrollIntervals.value.push(interval);
  });
};

onMounted(async () => {
  await loadAllMovies();
  setTimeout(() => {
    startAutoScroll();
  }, 500);
});

onUnmounted(() => {
  autoScrollIntervals.value.forEach(interval => clearInterval(interval));
});
</script>

<style scoped>
.disappoint-me-section {
  padding: 2rem;
  background-color: #000000;
  position: relative;
  min-height: 100vh;
}

.section-title {
  color: rgb(243, 240, 240);
  font-family: 'Lato', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-container {
  margin-bottom: 3rem;
  position: relative;
}

.carousel-wrapper {
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
  min-width: 200px;
}

.carousel-item:hover {
  transform: scale(1.05);
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.8),
    0 6px 18px rgba(0, 0, 0, 0.6);
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
  color: #ff6b6b;
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
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

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(210, 166, 60, 0.3);
  border-radius: 50%;
  border-top-color: #D2A63C;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  color: #D2A63C;
  font-size: 1.2rem;
  font-weight: bold;
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
  .disappoint-me-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .carousel-item {
    flex: 0 0 calc(50% - 1rem); 
    min-width: 200px;
    height: 350px;
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