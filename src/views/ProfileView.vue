<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <span class="avatar-initials">{{ getInitials(profile.user?.username || profile.user?.name) }}</span>
        </div>
        <h1>Seu Perfil</h1>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando perfil...</p>
      </div>

      <div v-else-if="profile.user" class="profile-content">
        <div class="info-section">
          <h2>Informações Pessoais</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon user-icon"></div>
              <div class="info-content">
                <label>Nome de usuário</label>
                <span class="info-value">{{ profile.user.username || profile.user.name }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon email-icon"></div>
              <div class="info-content">
                <label>Email</label>
                <span class="info-value">{{ profile.user.email }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon date-icon"></div>
              <div class="info-content">
                <label>Membro desde</label>
                <span class="info-value">{{ formatDate(profile.user.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-icon comment-icon"></div>
            <div class="stat-info">
              <span class="stat-number">{{ profile.comments?.length || 0 }}</span>
              <span class="stat-label">Comentários</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon dislike-icon"></div>
            <div class="stat-info">
              <span class="stat-number">{{ profile.dislikes?.length || 0 }}</span>
              <span class="stat-label">Filmes Odiados</span>
            </div>
          </div>
        </div>

        <div class="activities-section">
          <div class="activity-tab" v-if="profile.comments && profile.comments.length">
            <h3>Seus Comentários</h3>
            <div class="activity-list">
              <div class="activity-item comment-item" v-for="comment in profile.comments" :key="comment.id">
                <div class="activity-icon comment-icon-small"></div>
                <div class="activity-content">
                  <p class="activity-text">{{ comment.content }}</p>
                  <div class="activity-meta">
                    <span class="movie-id">Filme: {{ comment.movieTitle }}</span>
                    <span class="activity-date">{{ formatDateTime(comment.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="activity-tab" v-if="profile.dislikes && profile.dislikes.length">
            <h3>Filmes que Você Odiou</h3>
            <div class="activity-list">
              <div class="activity-item dislike-item" v-for="dislike in profile.dislikes" :key="dislike.movieId">
                <div class="activity-icon dislike-icon-small"></div>
                <div class="activity-content">
                  <p class="activity-text">Filme: {{ dislike.movieTitle }}</p>
                  <div class="activity-meta">
                    <span class="activity-date">Marcado como odiado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!profile.comments?.length && !profile.dislikes?.length" class="empty-state">
            <div class="empty-icon"></div>
            <p>Nenhuma atividade registrada ainda</p>
            <small>Comece a comentar e avaliar filmes para ver suas estatísticas aqui!</small>
          </div>
        </div>
      </div>

      <div v-else class="error-state">
        <div class="error-icon"></div>
        <h3>Erro ao carregar perfil</h3>
        <p>Não foi possível carregar suas informações</p>
        <button class="retry-btn" @click="loadProfile">Tentar novamente</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCookieStore } from "@/stores/cookie";
import api from "@/plugins/axios";

const cookieStore = useCookieStore();
const loading = ref(true);
const profile = ref({});
const movieTitlesCache = {};

// Buscar título no TMDB
const getMovieTitle = async (movieId) => {
  if (!movieId) return "Filme Desconhecido";
  if (movieTitlesCache[movieId]) return movieTitlesCache[movieId];

  try {
    const response = await api.get(`movie/${movieId}`, {
      params: { language: "pt-BR" },
    });
    const title = response.data.title || "Filme Desconhecido";
    movieTitlesCache[movieId] = title;
    return title;
  } catch (error) {
    console.error("Erro ao buscar título do filme:", error);
    return "Filme Desconhecido";
  }
};

const getInitials = (name = "") => {
  if (!name) return "?";
  const split = name.trim().split(" ").filter(Boolean);
  if (split.length === 1) return split[0].slice(0, 2).toUpperCase();
  return (split[0][0] + split[split.length - 1][0]).toUpperCase();
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("pt-BR") : "N/A";
const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString("pt-BR") : "N/A";

// Carregar perfil
const loadProfile = async () => {
  loading.value = true;

  try {
    const response = await fetch("http://localhost:8080/profile/user", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) throw new Error("Falha ao buscar perfil");

    const data = await response.json();
    profile.value = data;

    // Resolver títulos dos comentários
    if (profile.value.comments) {
      for (const c of profile.value.comments) {
        c.movieTitle = await getMovieTitle(c.movieId);
      }
    }

    // Resolver títulos dos dislikes
    if (profile.value.dislikes) {
      for (const d of profile.value.dislikes) {
        d.movieTitle = await getMovieTitle(d.movieId);
      }
    }
  } catch (err) {
    console.error(err);
    profile.value = { error: true };
  } finally {
    loading.value = false;
  }
};

onMounted(loadProfile);
</script>

<style scoped>
/* ———— TODO O SEU CSS ORIGINAL ———— */
/* (Nada alterado, só deixei exatamente igual ao seu para evitar quebrar algo) */

.profile-container {
  width: 100%;
  min-height: 100vh;
  background: #0a0a0a;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 20px 40px;
}

.profile-card {
  width: 80%;
  border-radius: 8px;
  max-width: 650px;
  background: #111;
  border: 1px solid #333;
  padding: 40px;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #d4af37;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 2px solid #333;
}

.avatar-initials {
  font-size: 1.8rem;
  font-weight: bold;
  color: #000;
}

.profile-header h1 {
  color: #d4af37;
  font-size: 2.2rem;
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.5px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-left: 3px solid #d4af37;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading p {
  color: #d4af37;
  font-size: 1rem;
}

.info-section {
  margin-bottom: 40px;
}

.info-section h2 {
  color: #d4af37;
  font-size: 1.4rem;
  margin-bottom: 20px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #0a0a0a;
  border: 1px solid #333;
  transition: all 0.3s ease;
}

.info-item:hover {
  border-color: #d4af37;
  transform: translateY(-1px);
}

.info-icon {
  width: 40px;
  height: 40px;
  background: #1a1a1a;
  border: 1px solid #333;
  position: relative;
}

.user-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: #d4af37;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.email-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 14px;
  border: 2px solid #d4af37;
  border-top: none;
}

.date-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border: 2px solid #d4af37;
  border-radius: 1px;
}

.date-icon::after {
  content: "";
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 2px;
  background: #d4af37;
}

.info-content {
  flex: 1;
}

.info-content label {
  display: block;
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #0a0a0a;
  border: 1px solid #333;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #d4af37;
  transform: translateY(-1px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: #1a1a1a;
  border: 1px solid #333;
  position: relative;
}

.comment-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 14px;
  border: 2px solid #d4af37;
  border-radius: 8px 8px 0 8px;
}

.dislike-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  background: #d4af37;
  clip-path: polygon(
    20% 0%,
    0% 20%,
    30% 50%,
    0% 80%,
    20% 100%,
    50% 70%,
    80% 100%,
    100% 80%,
    70% 50%,
    100% 20%,
    80% 0%,
    50% 30%
  );
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  color: #d4af37;
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  color: #888;
  font-size: 0.85rem;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activities-section {
  margin-top: 40px;
}

.activity-tab {
  margin-bottom: 30px;
}

.activity-tab h3 {
  color: #d4af37;
  font-size: 1.2rem;
  margin-bottom: 16px;
  font-weight: 500;
  text-transform: uppercase;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #0a0a0a;
  border: 1px solid #333;
  transition: all 0.3s ease;
}

.activity-item:hover {
  border-color: #d4af37;
}

.activity-icon {
  width: 32px;
  height: 32px;
  background: #1a1a1a;
  border: 1px solid #333;
  position: relative;
  flex-shrink: 0;
}

.comment-icon-small::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 10px;
  border: 1.5px solid #d4af37;
  border-radius: 6px 6px 0 6px;
}

.dislike-icon-small::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: #d4af37;
  clip-path: polygon(
    20% 0%,
    0% 20%,
    30% 50%,
    0% 80%,
    20% 100%,
    50% 70%,
    80% 100%,
    100% 80%,
    70% 50%,
    100% 20%,
    80% 0%,
    50% 30%
  );
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #fff;
  margin: 0 0 8px 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.movie-id {
  color: #d4af37;
  font-weight: 600;
}

.activity-date {
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  width: 60px;
  height: 60px;
  background: #1a1a1a;
  border: 1px solid #333;
  margin: 0 auto 20px;
  position: relative;
}

.empty-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: #333;
  clip-path: polygon(
    0% 0%,
    0% 100%,
    40% 100%,
    40% 60%,
    60% 60%,
    60% 100%,
    100% 100%,
    100% 0%
  );
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.empty-state small {
  font-size: 0.85rem;
  color: #555;
}

.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #d4af37;
}

.error-icon {
  width: 60px;
  height: 60px;
  background: #1a1a1a;
  border: 1px solid #333;
  margin: 0 auto 20px;
  position: relative;
}

.error-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: #d4af37;
  clip-path: polygon(
    20% 0%,
    0% 20%,
    30% 50%,
    0% 80%,
    20% 100%,
    50% 70%,
    80% 100%,
    100% 80%,
    70% 50%,
    100% 20%,
    80% 0%,
    50% 30%
  );
}

.error-state h3 {
  margin-bottom: 12px;
  font-weight: 500;
}

.error-state p {
  color: #888;
  margin-bottom: 24px;
}

.retry-btn {
  background: #d4af37;
  color: #000;
  border: none;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
}

.retry-btn:hover {
  background: #e6c34d;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .profile-container {
    padding: 60px 16px 20px;
  }

  .profile-card {
    padding: 24px;
    width: 90%;
  }

  .profile-header h1 {
    font-size: 1.8rem;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .activity-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-item,
  .stat-card {
    padding: 14px;
  }
}
</style>
