<template>
  <footer class="site-footer">
    <div class="gold-strip"></div>
    <div class="footer-content">
      <div class="footer-section">
        <h3>Hall da Lama</h3>
        <p>Descubra, odeie e compartilhe seus piores filmes.</p>
      </div>
      
      <div class="footer-section">
        <h4>Links Rápidos</h4>
        <ul>
          <li><a href="/" class="footer-link">Início</a></li>
          <li><a href="/cantinho" class="footer-link">Cantinho da Vergonha</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>Contato</h4>
        <p>contatoHallDaLama@Gmail.com</p>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2025 Hall da Lama. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<script setup>

</script>

<style scoped>
.site-footer {
  background-color: #02050B;
  color: white;
  position: relative;
  margin-top: auto;
}

.gold-strip {
  height: 4px;
  background: linear-gradient(90deg, #000000, #d4af37, #000000);
  width: 100%;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 30px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section h3 {
  color: #d4af37;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.footer-section h4 {
  color: #d4af37;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.footer-section p {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 10px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-link {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #d4af37;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.social-link {
  color: #ccc;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #d4af37;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding: 20px;
  text-align: center;
  color: #888;
}

.footer-bottom p {
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 20px 15px;
  }
  
  .footer-section {
    min-width: 100%;
  }
}
</style>