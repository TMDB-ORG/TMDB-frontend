<script setup lang="ts">
import { defineProps, onMounted, computed, ref } from 'vue';
import { useMovieStore } from '@/stores/movie';
import { useCommentsStore } from '@/stores/comments';
import { useUserStore } from '@/stores/user';
import { useUnlikeStore } from '@/stores/unlike';
import { useCookieStore } from '@/stores/cookie';
const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
});

const cookieStore = useCookieStore();
const movieStore = useMovieStore();
const commentsStore = useCommentsStore();
const userStore = useUserStore();
const unlikeStore = useUnlikeStore();

const movie = computed(() => movieStore.currentMovie as any);

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
  const parts = name.trim().split(' ').filter(Boolean) as string[];
  if (!parts.length) return '';
  if (parts.length === 1) {
    const first = parts[0] || '';
    return first.slice(0, 2).toUpperCase();
  }
  const firstChar = (parts[0] || '')[0] || '';
  const lastChar = (parts[parts.length - 1] || '')[0] || '';
  return (firstChar + lastChar).toUpperCase();
};


const comments = ref<any[]>([]);
const newComment = ref<string>('');
const isSubmitting = ref(false);



const loadComments = async () => {
  try {
    const maybe = commentsStore.listForMovie(props.movieId);
    const resolved = maybe instanceof Promise ? await maybe : maybe;
    if (Array.isArray(resolved)) {
      comments.value = resolved;
    } else {
      comments.value = commentsStore.commentsByMovie?.[props.movieId] || [];
    }
  } catch (e) {
    comments.value = commentsStore.commentsByMovie?.[props.movieId] || [];
    console.error('Erro carregando comentários', e);
  }
};

const submitComment = async () => {

  if (!newComment.value?.trim()) return;
  isSubmitting.value = true;
  
  try {
    await commentsStore.addComment(props.movieId, newComment.value);
    newComment.value = '';
    await loadComments();
  } catch (e: any) {
    console.error('Erro ao enviar comentário', e);
    
  
    if (e.message?.includes('Unauthorized') || e.message?.includes('401')) {
      alert('Sua sessão expirou. Faça login novamente para comentar.');
    } else {
      alert('Erro ao enviar comentário. Tente novamente.');
    }
  } finally {
    isSubmitting.value = false;
  }
};

const removeComment = async (id: string | number) => {
  try {
    await commentsStore.deleteComment(props.movieId, String(id));
    await loadComments();
  } catch (e) {
    console.error('Erro removendo comentário', e);
  }
};

const tmdbStars = (voteAverage: number | undefined) => {
  if (voteAverage === undefined || voteAverage === null) return 0;
  return Math.round((voteAverage / 10) * 5);
};

const isOdiado = computed(() => unlikeStore.isUnliked(props.movieId));
const dislikeCount = computed(() => unlikeStore.getCount(props.movieId));
const toggleOdiar = async () => {
  try {
    
    await unlikeStore.toggleUnlike(props.movieId);
  } catch (e) {
    console.error('Erro ao alternar unlike', e);
  }
};

onMounted(async () => {
  await movieStore.getMovieDetail(props.movieId);
  await loadComments();

  const uid = cookieStore.getUserIdFromCookie();
  if (uid) {
    try {
      const maybe = unlikeStore.fetchStatus(uid, props.movieId);
      if (maybe instanceof Promise) await maybe;
    } catch (e) {
      console.error('Erro ao buscar status de dislike', e);
    }
  }
  

  console.log('Token presente:', !!cookieStore.getCookie('token'));
  console.log('UserStore auth:', userStore.auth);
  console.log('UserStore isAuthenticated:', userStore.isAuthenticated);
});
</script>

<template>
  <div class="movie-page">
    <div v-if="movie && movie.id">
    
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
            <p class="tagline" v-if="movie.tagline">"{{ movie.tagline }}"</p>
            <div class="meta">
              <span v-if="movie.release_date">Lançamento: {{ movie.release_date }}</span>
              <span v-if="movie.runtime">• {{ movie.runtime }} min</span>
            </div>
            <div class="ratings">
              <div class="rating-card tmdb-rating">
                <div class="rating-head">
                  <small>TMDB</small>
                  <small class="vote-num">({{ movie.vote_average ? movie.vote_average.toFixed(1) : '—' }})</small>
                </div>
                <div class="stars">
                  <template v-for="n in 5" :key="`tmdb-${n}`">
                    <span class="star" :class="{ filled: n <= tmdbStars(movie.vote_average) }">★</span>
                  </template>
                </div>
              </div>
            </div>
             <div class="odiar-wrap">
          <button
            class="odiar-btn"
            :class="{ active: isOdiado }"
            @click="toggleOdiar"
            :aria-pressed="isOdiado"
          >
            <span class="emoji">{{ isOdiado ? '💔' : '🤍' }}</span>
            <span class="label">{{ isOdiado ? 'Odiado' : 'Odiar' }}</span>
            <span class="count">({{ dislikeCount }})</span>
          </button>
        </div>
            <p class="overview">{{ movie.overview || 'Sem descrição disponível.' }}</p>
          </div>
        </div>
      </section>

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

        <div class="details-grid">
          <section class="credits" v-if="(editors.length && editors.length > 0) || (writers.length && writers.length > 0)">
            <h2>Equipe (editores e autores)</h2>
            <div class="credits-section" v-if="editors.length && editors.length > 0">
              <h3>Editores</h3>
              <div class="people-row">
                <div class="person" v-for="p in editors" :key="p.id">
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

          <aside class="comments-section">
            <h2>Comentários</h2>
            <form class="comment-form" @submit.prevent="submitComment">
              <textarea 
                v-model="newComment" 
                rows="4" 
                placeholder="Escreva seu comentário..."
                :disabled="!cookieStore.checkAuth() || isSubmitting"
              ></textarea>
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn primary"
                  :disabled="!cookieStore.checkAuth() || !newComment.trim() || isSubmitting"
                >
                  {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
                </button>
                <small v-if="cookieStore.checkAuth()" class="auth-status">
                  ✅ Logado e pronto para comentar
                </small>
                <small v-else class="warning">
                  ⚠️ Faça login para comentar
                </small>
              </div>
            </form>

            <div class="comments-list">
              <div class="comment" v-for="c in comments" :key="c.id">
                <div class="comment-head">
                  <div class="meta">
                    <strong>{{ c.username || c.author }}</strong>
                    <time>{{ new Date(c.createdAt).toLocaleString() }}</time>
                  </div>
                </div>
                <p class="comment-content">{{ c.content }}</p>
                <div class="comment-actions">
                  <button class="btn link" @click="removeComment(c.id)">Remover</button>
                </div>
              </div>

              <p v-if="!comments || comments.length === 0" class="muted">Seja o primeiro a comentar.</p>
            </div>
          </aside>
        </div>
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

.hero {
  position: relative;
  background-size: cover;
  background-position: center;
  min-height: 70vh;
  display: flex;
  align-items: flex-end;
  padding: 3rem 1rem;
}


.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(2,5,11,0.85) 0%, rgba(2,5,11,0.55) 40%, rgba(2,5,11,0.85) 100%);
  pointer-events: none;
}

.hero::after{
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


.ratings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  align-items: center;
  margin: 0.8rem 0;
}

.rating-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding: 0.8rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: flex-start;
  box-shadow: 0 6px 18px rgba(0,0,0,0.45);
}

.rating-head {
  display: flex;
  gap: 0.6rem;
  align-items: baseline;
  width: 100%;
  justify-content: space-between;
  color: #cfcfcf;
  font-weight: 700;
}

.stars {
  display: inline-flex;
  gap: 0.25rem;
  margin-left: 0;
}
.star {
  color: rgba(255,255,255,0.25);
  font-size: 1.6rem;
  cursor: default;
  user-select: none;
  transition: color 0.12s ease, transform 0.12s ease;
}
.star.filled {
  color: #D2A63C;
}


.odiar-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 0;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, color 0.12s ease;
}
.odiar-btn .emoji { font-size: 1.2rem; transition: transform 0.12s ease; }
.odiar-btn:hover { transform: translateY(-2px); }

.odiar-btn.active {
  color: #ff6b6b;
}
.odiar-btn.active .emoji { transform: translateY(-2px); }

.odiar-wrap {
  margin-top: 0.6rem;
}


.details-wrap {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem 3rem 1rem;
}

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


.person img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
}

.person-info .name {
  font-weight: 700;
  color: #fff;
  font-size: 0.95rem;
}
.person-info .job {
  color: #d6c89a;
  font-size: 0.85rem;
}


.reviews { margin-top: 1.5rem; }
.review { background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
.review-author { display:flex; gap:0.6rem; align-items:center; margin-bottom:0.6rem; }
.review-author img { width:36px; height:36px; border-radius:50%; object-fit:cover; }
.review-content { color: #ddd; white-space: pre-wrap; }


.avatar-initials.small { height:36px; width:36px; font-size:0.9rem; border-radius:50%; display:flex; align-items:center; justify-content:center; }

.details-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.5rem;
  margin-top: 1.5rem;
}


.comments-section {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.45);
}
.comment-form input,
.comment-form textarea {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.6rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  color: #fff;
  border-radius: 6px;
  resize: vertical;
}
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}
.btn { padding: 0.45rem 0.9rem; border-radius: 6px; cursor: pointer; border: 0; }
.btn.primary { background: #D2A63C; color: #02050b; font-weight: 700; }
.btn.link { background: transparent; color: #d6c89a; border: 0; padding: 0.2rem; }

.comments-list { margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.8rem; }
.comment { background: rgba(0,0,0,0.25); padding: 0.8rem; border-radius: 8px; }
.comment-head { display:flex; gap:0.8rem; align-items:center; margin-bottom:0.4rem; }
.author-initials {
  width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  background: rgba(210,166,60,0.14); color:#fff; font-weight:700;
}
.comment-content { color:#ddd; white-space:pre-wrap; margin-bottom:0.4rem; }
.comment-actions { display:flex; gap:0.6rem; justify-content:flex-end; }


@media (max-width: 900px) {
  .hero { min-height: 55vh; padding: 2rem 1rem; }
  .hero-content { flex-direction: column; align-items: center; text-align: center; }
  .hero-poster { width: 200px; transform: translateY(10px); }
  .hero-details h1 { font-size: 1.6rem; }
  .overview { max-width: 100%; }
  .avatar-initials { height: 120px; font-size: 1.6rem; }
  .people-row { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .ratings { grid-template-columns: 1fr; }
  .details-grid { grid-template-columns: 1fr; }
  .comments-section { order: 2; }
}
</style>
