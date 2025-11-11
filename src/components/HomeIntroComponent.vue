import { RouterLink } from 'vue-router';
<template>
  <main>
    <section class="first">
      <div class="content">
          <img src="/public/images/Logo.png" class="slide-in">
          <h1 class="slide-in">Os melhores piores filmes estão aqui</h1>
          <RouterLink to="/cadastro">
            <button class="slide-in">Criar conta</button>
          </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
    
</script>

<style scoped>
section.first {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-image: url('/public/images/MV5BMTQ5MTU2NTMwMF5BMl5BanBnXkFtZTcwNzEwNTcwMw@@._V1_.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #000000; 
  position: relative; 
}


section.first::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 1;
}

.content {
  text-align: center;
  position: relative;
  z-index: 2; 
}

h1 {
  color: white;
  font-size: 1.5rem;
  text-align: center;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
  margin-bottom: 20px;
}

button{  background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
  color: #ffffff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  width: 50%;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;}

  button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  transform: scale(1.03);
}

button:hover::before {
  left: 100%;
}

button:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}



section.first::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%; 
  background: linear-gradient(
    to bottom, 
    transparent 0%, 
    rgba(8, 8, 8, 0.3) 20%,
    rgba(8, 8, 8, 0.7) 50%,
    rgb(0, 0, 0) 100%
  );
  pointer-events: none;
  z-index: 1; 
}

h1, .slide-in {
  transform: translateX(-100%);
  opacity: 0;
  animation: slideInFromLeft 2s ease-in-out forwards;
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-60%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>