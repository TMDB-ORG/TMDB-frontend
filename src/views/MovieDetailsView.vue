<script setup lang="ts">
import { defineProps, onMounted, computed } from 'vue';
import { useMovieStore } from '@/stores/movie';
const movieStore = useMovieStore();

const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
});

const movie = computed(() => movieStore.currentMovie as any);

// helpers para extrair editores e autores (writers)
const editors = computed(() => {
  return (movie.value?.credits?.crew || []).filter((c: any) =>
    String(c.job || '').toLowerCase().includes('edit')
  );
});

const writers = computed(() => {
  return (movie.value?.credits?.crew || []).filter((c: any) => {
    const job = (c.job || '').toLowerCase();
    return job.includes('writer') || job.includes('screenplay') || job.includes('author');
  });
});

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

onMounted(async () => {
  await movieStore.getMovieDetail(props.movieId);
});
</script>

<template>
  <div class="movie-page">
    <div v-if="movie && movie.id">
      <!-- Hero com backdrop e degradê (grande) -->
      <section
        class="hero"
        :style="{
          backgroundImage: movie.backdrop_path
            ? `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`
            : 'none'
        }"
      >
        <div class="hero-overlay"></div>

        <div class="hero-content">
          <img
            v-if="movie.poster_path"
            class="hero-poster"
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
          />
          <div class="hero-details">
            <h1>{{ movie.title }}</h1>
            <p class="tagline" v-if="movie.tagline">“{{ movie.tagline }}”</p>
            <div class="meta">
              <span v-if="movie.release_date">Lançamento: {{ movie.release_date }}</span>
              <span v-if="movie.runtime">• {{ movie.runtime }} min</span>
              <span v-if="movie.vote_average">• Avaliação: {{ movie.vote_average.toFixed(1) }}</span>
            </div>
            <p class="overview" v-if="movie.overview">{{ movie.overview }}</p>
          </div>
        </div>
      </section>

      <!-- detalhes principais -->
      <main class="details-wrap">
        <section class="companies" v-if="movie.production_companies && movie.production_companies.length">
          <h2>Produtoras</h2>
          <div class="companies-list">
            <template v-for="company in movie.production_companies" :key="company.id">
              <div class="company">
                <img
                  v-if="company.logo_path"
                  :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
                  :alt="company.name"
                />
                <p v-else>{{ company.name }}</p>
              </div>
            </template>
          </div>
        </section>

        <!-- créditos: editores (sem fotos) e autores -->
        <section class="credits" v-if="(editors.length && editors.length > 0) || (writers.length && writers.length > 0)">
          <h2>Equipe (editores e autores)</h2>

          <div class="credits-section" v-if="editors.length && editors.length > 0">
            <h3>Editores</h3>
            <div class="people-row">
              <div class="person" v-for="p in editors" :key="p.id">
                <!-- não mostrar foto para editores: avatar com iniciais -->
                <div class="avatar-initials">{{ getInitials(p.name) }}</div>
                <div class="person-info">
                  <p class="name">{{ p.name }}</p>
                  <p class="job">{{ p.job }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="credits-section" v-if="writers.length && writers.length > 0">
            <h3>Autores / Roteiristas</h3>
            <div class="people-row">
              <div class="person" v-for="p in writers" :key="p.id">
                <!-- para autores mostramos foto quando disponível -->
                <img v-if="p.profile_path" :src="`https://image.tmdb.org/t/p/w185${p.profile_path}`" :alt="p.name" />
                <div v-else class="avatar-initials small">{{ getInitials(p.name) }}</div>
                <div class="person-info">
                  <p class="name">{{ p.name }}</p>
                  <p class="job">{{ p.job }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <div v-else class="loading-placeholder">
      Carregando...
    </div>
  </div>
</template>

<style scoped>
.movie-page {
  background: #02050b;
  color: #fff;
  min-height: 100vh;
}

/* HERO */
.hero {
  position: relative;
  background-size: cover;
  background-position: center;
  min-height: 70vh;
  display: flex;
  align-items: flex-end;
  padding: 3rem 1rem;
}

/* overlay degradê parecido com Home */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(2,5,11,0.85) 0%, rgba(2,5,11,0.55) 40%, rgba(2,5,11,0.85) 100%);
  pointer-events: none;
}

/* fade inferior para evitar "branco" na transição */
.hero::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 35%;
  background: linear-gradient(to bottom, rgba(2,5,11,0) 0%, rgba(2,5,11,0.95) 100%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  align-items: flex-end;
  width: 100%;
}

.hero-poster {
  width: 320px;
  border-radius: 10px;
  box-shadow: 0 18px 50px rgba(0,0,0,0.7);
  flex-shrink: 0;
  transform: translateY(20px);
}

.hero-details {
  flex: 1;
  align-self: flex-end;
}

.hero-details h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.4rem;
  text-shadow: 2px 2px 10px rgba(0,0,0,0.7);
  font-family: 'Lato', sans-serif;
}

.tagline {
  font-style: italic;
  color: #d6c89a;
  margin-bottom: 0.8rem;
}

.meta {
  color: #cfcfcf;
  margin-bottom: 1rem;
  font-weight: 600;
}

.overview {
  line-height: 1.7;
  color: #e8e8e8;
  max-width: 70ch;
  margin-top: 0.6rem;
  font-size: 1rem;
}

/* main details */
.details-wrap {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem 3rem 1rem;
}

/* produtoras */
.companies {
  margin-bottom: 1.5rem;
}
.companies-list {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}
.company img {
  height: 48px;
  object-fit: contain;
}

/* credits */
.credits {
  margin-top: 1.5rem;
}
.credits h2 {
  margin-bottom: 1rem;
}
.credits-section {
  margin-bottom: 1rem;
}
.people-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
.person {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.006));
  width: 170px;
  min-width: 170px;
  border-radius: 10px;
  padding: 0.6rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.45);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

/* avatar (iniciais) para editores */
.avatar-initials {
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(210,166,60,0.12), rgba(210,166,60,0.06));
  color: #fff;
  font-weight: 700;
  font-size: 2rem;
}
.avatar-initials.small {
  height: 120px;
  font-size: 1.6rem;
}

/* fotos para autores */
.person img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
}

/* textos */
.person-info .name {
  font-weight: 700;
  color: #fff;
  font-size: 0.95rem;
}
.person-info .job {
  color: #d6c89a;
  font-size: 0.85rem;
}

/* responsive */
@media (max-width: 900px) {
  .hero {
    min-height: 55vh;
    padding: 2rem 1rem;
  }
  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .hero-poster {
    width: 200px;
    transform: translateY(10px);
  }
  .hero-details h1 {
    font-size: 1.6rem;
  }
  .overview {
    max-width: 100%;
  }
  .avatar-initials {
    height: 120px;
    font-size: 1.6rem;
  }
}
</style>