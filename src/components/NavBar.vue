<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/" class="nav-item">Início</router-link>
      <router-link to="/profile" class="nav-item">Conta</router-link>
      <router-link to="/cantinho" class="nav-item shame">Cantinho da Vergonha</router-link>
    </div>

    <div class="nav-right">
      <router-link :to="{ path: '/cadastro', query: { mode: 'login' } }" class="login">Entrar</router-link>
      <router-link to="/cadastro" class="btn-create">Criar conta</router-link>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 12px;
  z-index: 1000;
  background-color: rgba(2,5,11,0.45); 
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 1rem;
  transition: background-color 0.12s;
}
.nav-item:hover {
  background-color: rgba(255,255,255,0.06); 
}

.shame {
  font-weight: 600;
  color: #ffd166;
  background: transparent;
  padding: 6px 10px;
}


.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}


.login {
  color: #fff;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 6px;
}
.login:hover {
  background-color: rgba(255,255,255,0.06);
}


.btn-create {
  display: inline-block;
  background: #ffd166; 
  color: #02050B;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  border: none;
  box-shadow: 0 4px 10px rgba(255,209,102,0.16);
  transition: filter 0.12s, background-color 0.12s;
}
.btn-create:hover {
  filter: brightness(1.05); 
}


:root { --navbar-height: 64px; }
body > #app { padding-top: var(--navbar-height); }

@media (max-width: 700px) {
  .navbar { padding: 0 12px; }
  .nav-item { padding: 6px 8px; font-size: 0.95rem; }
  .btn-create { padding: 6px 10px; font-size: 0.95rem; }
}
</style>
