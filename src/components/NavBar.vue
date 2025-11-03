<template>
  <nav>
    <router-link
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="nav-link"
    >
      {{ link.text }}
    </router-link>
  </nav>
</template>

<script setup>
const links = [
  { text: 'Home', to: '/' },
  { text: 'Filmes', to: '/filmes' },
  { text: 'Programas de TV', to: '/tv' },
]
</script>

<style scoped>

nav {
  background-color: #010101;
  padding: 12px 12px;
  display: flex;
  justify-content: start; 
  flex-wrap: wrap; 
}


.nav-link {
  color: white;
  text-decoration: none;
  margin: 8px 12px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1.3rem;
  font-family: 'lato', sans-serif;
  transition: background-color 0.3s;
  
}


.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}


@media (max-width: 600px) {
  .nav-link {
    padding: 6px 10px;
    font-size: 14px;
  }
}
</style>
