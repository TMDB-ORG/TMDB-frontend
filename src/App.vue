<script setup>
import { RouterLink } from 'vue-router'
import NavBar from './components/NavBar.vue'
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>     
        <NavBar />
          <RouterView />
          <FooterComponent />
       
  
</template>