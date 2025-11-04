<template>
  <main>
    <section class="first">
      <div class="content">
          <img src="/public/images/Logo.png" class="slide-in">
          <h1 class="slide-in">Os melhores piores filmes estão aqui</h1>
          <button class="slide-in">Criar conta</button>
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

button {
  margin-top: 20px;
  padding: 12px 30px;
  font-size: 1.1rem;
  color: white;
  background-color: #02050B;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(45deg, #000000, #D2A63C);
  transition: width 0.4s ease;
  z-index: -1;
}

button:hover::before {
  width: 100%;
}

button:hover {
  color: white;
  transform: scale(1.1);
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.6);
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