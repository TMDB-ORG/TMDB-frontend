<template>
  <main>
    <section class="first">
      <h1 class="slide-in">
        HALL <br> DA LAMA
      </h1>
    </section>
    <section>
      <BadMoviesComponent />
    </section>
  </main>
</template>

<script setup>
import {BadMoviesComponent} from '@/components/BadMoviesComponent.vue';
</script>

<style scoped>
section.first {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #E9E9E9;
  overflow: hidden; 
}

h1 {
  font-size: 4rem;
  line-height: 3.5rem;
  font-family: 'Lato', sans-serif;
  color: #D2A63C;
  margin: 0;

  transform: translateX(-100%);
  opacity: 0;

  animation: slideInFromLeft 1s ease-in-out forwards;

}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
