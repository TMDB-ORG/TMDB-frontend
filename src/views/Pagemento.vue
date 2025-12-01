<template>
  <div class="payment-container">
    <div class="payment-card">

      <div class="payment-header">
        <div class="logo">
          <span class="logo-text">STRIPE</span>
        </div>
        <h1 class="title">Finalizar Pagamento</h1>
        <p class="subtitle">Complete sua transação com segurança</p>
      </div>

      <div class="product-info">
        <div class="product-details">
          <h3 class="product-name">Produto Premium</h3>
          <p class="product-description">Acesso completo à plataforma</p>
        </div>
        <div class="product-price">
          <span class="price">R$ 9,99</span>
        </div>
      </div>

     
      <div class="payment-form">

        <div class="form-group">
          <label class="form-label">Informações do Cartão</label>
          <div id="card-element" ref="cardElement" class="card-element"></div>
        </div>


        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nome no Cartão</label>
            <input 
              v-model="cardholderName"
              type="text" 
              class="form-input"
              :placeholder="profile?.username || 'Como aparece no cartão'"

            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              v-model="email"
              type="email" 
              class="form-input"
              :placeholder="profile?.email || 'seu@email.com'"
            >
          </div>
        </div>

        <div class="payment-actions">
          <button 
            @click="processPayment" 
            :disabled="processing"
            class="pay-button"
            :class="{ 'processing': processing }"
          >
            <span v-if="!processing">Pagar R$ 99,90</span>
            <span v-else class="loading-text">Processando...</span>
          </button>
          
          <div class="security-info">
            <div class="security-badge">
              <span class="security-text">Pagamento 100% seguro</span>
            </div>
          </div>
        </div>
      </div>

      <div class="payment-footer">
        <p class="footer-text">
          Sua informação está protegida com criptografia de ponta a ponta
        </p>
      </div>
    </div>

    <div v-if="showSuccess" class="modal-overlay" @click="closeModal">
      <div class="success-modal" @click.stop>
        <div class="success-icon">
          <div class="checkmark"></div>
        </div>
        <h2 class="success-title">Pagamento Concluído</h2>
        <p class="success-message">Sua transação foi processada com sucesso</p>
        <button @click="closeModal" class="close-button">Continuar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue'
import { useCookieStore } from '@/stores/cookie'
const cardholderName = ref('')
const email = ref('')
const processing = ref(false)
const showSuccess = ref(false)
const cardElement = ref<HTMLElement>()
const cookieStore = useCookieStore()
let stripe: any = null
let elements: any = null
let card: any = null
let Islogged : any = null
let profile : any = ref(null)
const GetUserInfo = async () => {
  const response = await fetch('https://localhost:8080/users/getUser', {
    method: 'GET',
    credentials: 'include'
  })
  const data = await response.json();
    console.log("Dados do perfil:", data);
    
    profile.value = data;

}
onMounted(() => {
    Islogged = cookieStore.checkAuth()
    

    if(!Islogged){
        window.location.href = '/'
    }
  setTimeout(() => {
    console.log('Stripe inicializado')
  }, 1000)
})

onUnmounted(() => {
  if (card) {
    card.destroy()
  }
})

const processPayment = async () => {
  if (!cardholderName.value || !email.value) {
    alert('Por favor, preencha todos os campos')
    return
  }

  processing.value = true

  try {

    await new Promise(resolve => setTimeout(resolve, 2000))
    
 
    
    showSuccess.value = true
  } catch (error) {
    console.error('Erro no pagamento:', error)
    alert('Erro ao processar pagamento. Tente novamente.')
  } finally {
    processing.value = false
  }
}

const closeModal = () => {
  showSuccess.value = false

  cardholderName.value = ''
  email.value = ''
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.payment-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.payment-card {
  background: #0a0a0a;
  border: 1px solid #333;
  padding: 40px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.payment-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #000000, #d4af37, #000000);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.payment-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  margin-bottom: 20px;
}

.logo-text {
  color: #d4af37;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.title {
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #888;
  font-size: 14px;
  font-weight: 400;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #111;
  border: 1px solid #222;
  margin-bottom: 32px;
}

.product-name {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.product-description {
  color: #888;
  font-size: 14px;
}

.product-price {
  text-align: right;
}

.price {
  color: #d4af37;
  font-size: 24px;
  font-weight: 700;
}

.payment-form {
  margin-bottom: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

.form-label {
  display: block;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #111;
  border: 1px solid #333;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 1px #d4af37;
}

.card-element {
  padding: 12px 16px;
  background: #111;
  border: 1px solid #333;
  min-height: 44px;
  display: flex;
  align-items: center;
  color: #ffffff;
}

.payment-actions {
  margin-top: 32px;
}

.pay-button {
  width: 100%;
  padding: 16px;
  background: #d4af37;
  color: #000000;
  border: none;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.pay-button:hover:not(:disabled) {
  background: #e6c34d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.pay-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pay-button.processing {
  background: #333;
  color: #888;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.security-info {
  margin-top: 16px;
  text-align: center;
}

.security-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #111;
  border: 1px solid #333;
}

.security-text {
  color: #888;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #222;
}

.footer-text {
  color: #666;
  font-size: 12px;
  line-height: 1.4;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.success-modal {
  background: #0a0a0a;
  border: 1px solid #333;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from { 
    transform: scale(0);
    opacity: 0;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
}

.checkmark {
  width: 24px;
  height: 12px;
  border: 3px solid #000;
  border-top: none;
  border-right: none;
  transform: rotate(-45deg);
  margin-top: -4px;
}

.success-title {
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
}

.success-message {
  color: #888;
  font-size: 16px;
  margin-bottom: 24px;
}

.close-button {
  background: #d4af37;
  color: #000000;
  border: none;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #e6c34d;
  transform: translateY(-1px);
}


@media (max-width: 480px) {
  .payment-card {
    padding: 24px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .title {
    font-size: 24px;
  }
}
</style>