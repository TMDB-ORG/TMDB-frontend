<template>
  <div class="cantinho-container">

    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Cantinho da Vergonha</h1>
        <p class="hero-subtitle">Os filmes que todos amam odiar</p>
        <div class="gold-divider"></div>
      </div>
    </section>

    <div v-if="movieStore.isLoading" class="loading">
      <p>Carregando filmes mais odiados...</p>
    </div>

    <section v-else class="shame-section">
      <div class="container">
        <div class="movies-list">
   
          <div v-if="worstMovies[0]" class="movie-card first-place" @click="openMovie(worstMovies[0].id)">
            <div class="trophy">🥇</div>
            <div class="rank-badge">#1 Mais Odiado</div>
            <img 
              :src="worstMovies[0].poster_path ? `https://image.tmdb.org/t/p/w500${worstMovies[0].poster_path}` : '/placeholder-movie.jpg'"
              :alt="worstMovies[0].title"
              class="movie-poster"
            />
            <div class="movie-info">
              <h3 class="movie-title">{{ worstMovies[0].title }}</h3>
              <p class="movie-year">{{ new Date(worstMovies[0].release_date).getFullYear() }}</p>
              <div class="dislike-stats">
                <span class="dislike-count">👎 Avaliação: {{ worstMovies[0].vote_average?.toFixed(1) }}/10</span>
              </div>
              <div class="movie-genres">
                <span 
                  v-for="genre_id in worstMovies[0].genre_ids" 
                  :key="genre_id"
                  class="genre-tag"
                >
                  {{ getGenreName(genre_id) }}
                </span>
              </div>
              <p class="movie-description">O filme mais criticado pela comunidade com a pior avaliação.</p>
              <div class="click-hint">Clique para ver detalhes →</div>
            </div>
          </div>

          <div v-if="worstMovies[1]" class="movie-card second-place" @click="openMovie(worstMovies[1].id)">
            <div class="trophy">🥈</div>
            <div class="rank-badge">#2 Mais Odiado</div>
            <img 
              :src="worstMovies[1].poster_path ? `https://image.tmdb.org/t/p/w500${worstMovies[1].poster_path}` : '/placeholder-movie.jpg'"
              :alt="worstMovies[1].title"
              class="movie-poster"
            />
            <div class="movie-info">
              <h3 class="movie-title">{{ worstMovies[1].title }}</h3>
              <p class="movie-year">{{ new Date(worstMovies[1].release_date).getFullYear() }}</p>
              <div class="dislike-stats">
                <span class="dislike-count">👎 Avaliação: {{ worstMovies[1].vote_average?.toFixed(1) }}/10</span>
              </div>
              <div class="movie-genres">
                <span 
                  v-for="genre_id in worstMovies[1].genre_ids" 
                  :key="genre_id"
                  class="genre-tag"
                >
                  {{ getGenreName(genre_id) }}
                </span>
              </div>
              <p class="movie-description">Não fica atrás do primeiro lugar em críticas negativas.</p>
              <div class="click-hint">Clique para ver detalhes →</div>
            </div>
          </div>

          <div v-if="worstMovies[2]" class="movie-card third-place" @click="openMovie(worstMovies[2].id)">
            <div class="trophy">🥉</div>
            <div class="rank-badge">#3 Mais Odiado</div>
            <img 
              :src="worstMovies[2].poster_path ? `https://image.tmdb.org/t/p/w500${worstMovies[2].poster_path}` : '/placeholder-movie.jpg'"
              :alt="worstMovies[2].title"
              class="movie-poster"
            />
            <div class="movie-info">
              <h3 class="movie-title">{{ worstMovies[2].title }}</h3>
              <p class="movie-year">{{ new Date(worstMovies[2].release_date).getFullYear() }}</p>
              <div class="dislike-stats">
                <span class="dislike-count">👎 Avaliação: {{ worstMovies[2].vote_average?.toFixed(1) }}/10</span>
              </div>
              <div class="movie-genres">
                <span 
                  v-for="genre_id in worstMovies[2].genre_ids" 
                  :key="genre_id"
                  class="genre-tag"
                >
                  {{ getGenreName(genre_id) }}
                </span>
              </div>
              <p class="movie-description">Fecha o pódio dos filmes com as piores avaliações.</p>
              <div class="click-hint">Clique para ver detalhes →</div>
            </div>
          </div>

          <div v-if="worstMovies.length === 0" class="no-movies">
            <p>Nenhum filme ruim encontrado. Tente buscar em outros gêneros.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import api from '@/plugins/axios';
import { useMovieStore } from '@/stores/movie';

const movieStore = useMovieStore();
const router = useRouter();

const BACKEND_URL = "http://localhost:8080"; 

const worstMovies = ref<any[]>([]);
const isLoading = ref(true);

const getMovieDetailsFromTMDB = async (movieId: number) => {
  try {
    const response = await api.get(`movie/${movieId}`, {
      params: { language: "pt-BR" }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar filme no TMDB:", error);
    return null;
  }
};

const loadWorstMovies = async () => {
  try {
    isLoading.value = true;

    const response = await axios.get(`${BACKEND_URL}/dislikes/top3`);
    const dislikedMovies = response.data;
    const fullData = [];

    for (const movie of dislikedMovies) {
      const tmdbData = await getMovieDetailsFromTMDB(movie.movieId);

      if (tmdbData) {
        fullData.push({
          id: tmdbData.id,
          title: tmdbData.title,
          poster_path: tmdbData.poster_path,
          release_date: tmdbData.release_date,
          genre_ids: tmdbData.genres.map((g: any) => g.id),
          vote_average: tmdbData.vote_average,
          description: tmdbData.overview,
          dislikes: movie.count
        });
      }
    }

    worstMovies.value = fullData;

  } catch (error) {
    console.error("Erro ao carregar filmes mais odiados:", error);
    worstMovies.value = [];
  } finally {
    isLoading.value = false;
  }
};

const getGenreName = (genreId: number) => {
  const genres: any = {
    28: "Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    18: "Drama",
    27: "Terror",
    53: "Suspense",
    10749: "Romance",
    14: "Fantasia",
    878: "Ficção Científica"
  };

  return genres[genreId] || "Desconhecido";
};

const openMovie = (movieId: number) => {
  router.push({ name: 'MovieDetails', params: { movieId } });
};

onMounted(() => {
  loadWorstMovies();
});
</script>



<style scoped>
.cantinho-container {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
  padding: 20px;
}

/* Hero Section */
.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #000000, #d4af37, #000000);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #888;
  margin-bottom: 2rem;
}

.gold-divider {
  width: 100px;
  height: 2px;
  background: #d4af37;
  margin: 0 auto;
}

/* Loading */
.loading {
  text-align: center;
  padding: 2rem;
  color: #888;
}

/* Sections */
.container {
  max-width: 900px;
  margin: 0 auto;
}

.shame-section {
  padding: 2rem 0;
}

/* Movies List - Um abaixo do outro */
.movies-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 2rem;
}

.movie-card {
  background: #111;
  border: 1px solid #333;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  min-height: 280px;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.movie-card:hover {
  border-color: #d4af37;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.movie-card.first-place {
  border: 2px solid #d4af37;
}

.movie-card.second-place {
  border: 2px solid #c0c0c0;
}

.movie-card.third-place {
  border: 2px solid #cd7f32;
}

.trophy {
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 2rem;
  z-index: 2;
}

.rank-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #d4af37;
  color: #000;
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.movie-poster {
  width: 200px;
  height: 280px;
  object-fit: cover;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.movie-info {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.movie-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
}

.movie-year {
  color: #d4af37;
  font-weight: 500;
  margin-bottom: 16px;
  font-size: 1rem;
}

.dislike-stats {
  margin-bottom: 16px;
}

.dislike-count {
  background: #111;
  color: #d4af37;
  padding: 8px 16px;
  border: 1px solid #333;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
}

.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.genre-tag {
  background: #0a0a0a;
  color: #d4af37;
  padding: 6px 12px;
  border: 1px solid #333;
  font-size: 0.8rem;
  font-weight: 500;
}

.movie-description {
  color: #888;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 8px;
}

.click-hint {
  color: #d4af37;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.movie-card:hover .click-hint {
  opacity: 1;
}

.no-movies {
  text-align: center;
  padding: 3rem;
  color: #888;
  border: 1px solid #333;
  background: #111;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .movie-card {
    flex-direction: column;
    min-height: auto;
  }
  
  .movie-poster {
    width: 100%;
    height: 300px;
  }
  
  .movie-info {
    padding: 20px;
  }
  
  .movie-title {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .cantinho-container {
    padding: 16px;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-section {
    height: 30vh;
  }
  
  .movie-title {
    font-size: 1.1rem;
  }
  
  .rank-badge {
    padding: 6px 12px;
    font-size: 0.7rem;
  }
  
  .trophy {
    font-size: 1.5rem;
  }
}
</style>