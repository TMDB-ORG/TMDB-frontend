<template>
  <nav>
    <img src="/public/images/Logo.png" alt="">
    <div>
       <router-link
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="nav-link"
    >
      {{ link.text }}
    </router-link>
    </div>
   
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
  background-color: #02050B;
  opacity: 0.88;
  box-shadow: 10px 10px 12px rgba(0, 0, 0, 0.3);
  padding: 4px 4px;
  padding-top: 10px;
  display: flex;
  justify-content: space-between; 
  flex-wrap: wrap; 
  position: relative;
  z-index: 9;
}
nav div {
  display: flex;
  align-items: center;
  justify-content: center;
}


.nav-link {
  color: white;
  text-decoration: none;
  margin: 8px 12px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1.1rem;
  font-family: 'lato', sans-serif;
  transition: background-color 0.3s;
  
}


.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s;
}

img {
  height: 50px;
  margin-left: 10px;
}
@media (max-width: 600px) {
  .nav-link {
    padding: 6px 10px;
    font-size: 14px;
  }
}
</style>
