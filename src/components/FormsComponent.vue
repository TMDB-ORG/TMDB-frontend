<template>
  <div class="form-wrapper">
    <form class="form-container" autocomplete="off" @submit.prevent="submitForm(formData)">
      <h2>Cadastro</h2>

      <div class="form-group">
        <label for="username">Nome de Usuário</label>
        <input type="text" id="username" v-model="formData.username" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="formData.email" />
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="formData.password" />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input type="password" id="confirmPassword" v-model="formData.confirmPassword" />
      </div>
      
      <button type="submit">Cadastrar</button>
    </form>
  </div>

  <div v-if="showSuccessPopup" class="success-popup">
    <div class="popup-content">
      <span class="popup-icon">✓</span>
      <p>Usuário criado com sucesso!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const formData = ref<FormData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const showSuccessPopup = ref(false);

const submitForm = (data: FormData) => {
  console.log(data);
  if (data.password !== data.confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }
  fetchDataRegister(data);
};

const fetchDataRegister = async (data: FormData) => {
  try {
    const response = await fetch("http://localhost:8080/users/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log(result + "Isso foi o retorno do java");
    
    if (result.success) {

      showSuccessPopup.value = true;
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      alert("Erro ao cadastrar usuário: " + result.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    alert("Erro de conexão. Tente novamente.");
  }
}
</script>

<style scoped>
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 93vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
}

.form-container {
  background: #1e1e1e;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  border: 1px solid #333;
}

h2 {
  text-align: center;
  margin-bottom: 2.5rem;
  color: #d4af37;
  font-weight: 600;
  font-size: 1.75rem;
  letter-spacing: -0.5px;
}

.form-group {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #e2e8f0;
  font-size: 0.95rem;
}

input {
  background: transparent;
  border: none;
  border-bottom: 1px solid #4a5568;
  color: #f7fafc;
  padding: 0.8rem 0;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

input:focus {
  border-bottom-color: transparent;
}

input::placeholder {
  color: #718096;
}

.form-group::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #d4af37, #f7ef8a, #d4af37);
  transition: width 0.4s ease;
  transform: scaleX(0);
  transform-origin: left;
}

.form-group:focus-within::after {
  width: 100%;
  transform: scaleX(1);
}

button {
  background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
  color: #1a202c;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
}

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
}

button:hover::before {
  left: 100%;
}

button:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.form-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #d4af37, #b8860b, #d4af37);
  border-radius: 14px;
  z-index: -1;
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

.form-container:hover::before {
  opacity: 0.15;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: #f7fafc;
  -webkit-box-shadow: 0 0 0px 1000px #1e1e1e inset;
  transition: background-color 5000s ease-in-out 0s;
}

.form-group:focus-within label {
  color: #d4af37;
}

.success-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  z-index: 15;
  animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 1.7s forwards;
}

.popup-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.popup-icon {
  background: white;
  color: #10b981;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  z-index: 10;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>