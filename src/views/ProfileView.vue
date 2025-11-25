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
              <div class="info-icon">👤</div>
              <div class="info-content">
                <label>Nome de usuário</label>
                <span class="info-value">{{ profile.user.username || profile.user.name }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-content">
                <label>Email</label>
                <span class="info-value">{{ profile.user.email }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">📅</div>
              <div class="info-content">
                <label>Membro desde</label>
                <span class="info-value">{{ formatDate(profile.user.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>


        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <span class="stat-number">{{ profile.comments?.length || 0 }}</span>
              <span class="stat-label">Comentários</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">💔</div>
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
                <div class="activity-icon">💬</div>
                <div class="activity-content">
                  <p class="activity-text">{{ comment.content }}</p>
                  <div class="activity-meta">
                    <span class="movie-id">Filme ID: {{ comment.movieId }}</span>
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
                <div class="activity-icon">💔</div>
                <div class="activity-content">
                  <p class="activity-text">Filme ID: {{ dislike.movieId }}</p>
                  <div class="activity-meta">
                    <span class="activity-date">Marcado como odiado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!profile.comments?.length && !profile.dislikes?.length" class="empty-state">
            <div class="empty-icon">📊</div>
            <p>Nenhuma atividade registrada ainda</p>
            <small>Comece a comentar e avaliar filmes para ver suas estatísticas aqui!</small>
          </div>
        </div>
      </div>

      <div v-else class="error-state">
        <div class="error-icon">❌</div>
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

const cookieStore = useCookieStore();
const loading = ref(true);
const profile = ref({});

const getInitials = (name = '') => {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('pt-BR');
};

const loadProfile = async () => {
  loading.value = true;
  try {
    console.log("Carregando perfil...");
    
    const response = await fetch("http://localhost:8080/profile/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log("Dados do perfil:", data);
    
    profile.value = data;
    
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    profile.value = { error: "Falha ao carregar perfil" };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 20px 40px;
}

.profile-card {
  width: 80%;
  max-width: 650px;
  background: rgba(17, 17, 17, 0.95);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 20px;
  padding: 40px;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 4px solid rgba(212, 175, 55, 0.3);
}

.avatar-initials {
  font-size: 2rem;
  font-weight: bold;
  color: #000;
}

.profile-header h1 {
  color: #d4af37;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 300;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(212, 175, 55, 0.3);
  border-left: 4px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  color: #d4af37;
  font-size: 1.1rem;
}

.info-section {
  margin-bottom: 40px;
}

.info-section h2 {
  color: #d4af37;
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 400;
}

.info-grid {
  display: grid;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.info-icon {
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 10px;
}

.info-content {
  flex: 1;
}

.info-content label {
  display: block;
  color: #d4af37;
  font-size: 0.9rem;
  margin-bottom: 4px;
  font-weight: 600;
}

.info-value {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  color: #d4af37;
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  color: #ccc;
  font-size: 0.9rem;
  margin-top: 4px;
}

.activities-section {
  margin-top: 40px;
}

.activity-tab {
  margin-bottom: 30px;
}

.activity-tab h3 {
  color: #d4af37;
  font-size: 1.3rem;
  margin-bottom: 16px;
  font-weight: 400;
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
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(212, 175, 55, 0.2);
}

.activity-icon {
  font-size: 1.2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #fff;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.movie-id {
  color: #d4af37;
  font-weight: 600;
}

.activity-date {
  color: #888;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.empty-state small {
  font-size: 0.9rem;
}

.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #ff6b6b;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-state h3 {
  margin-bottom: 12px;
  font-weight: 500;
}

.error-state p {
  color: #ccc;
  margin-bottom: 24px;
}

.retry-btn {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

@media (max-width: 768px) {
  .profile-container {
    padding: 60px 16px 20px;
  }
  
  .profile-card {
    padding: 24px;
    border-radius: 16px;
  }
  
  .profile-header h1 {
    font-size: 2rem;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .activity-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .info-item, .stat-card {
    padding: 16px;
  }
}
</style>