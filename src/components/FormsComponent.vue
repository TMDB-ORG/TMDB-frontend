<template>
  <div class="form-wrapper">
    <form class="form-container" autocomplete="off" @submit.prevent="isLogin ? submitLogin(loginData) : submitRegister(registerData)">
      <h2>{{ isLogin ? 'Login' : 'Cadastro' }}</h2>
      
      <!-- Cadastro -->
      <div v-if="!isLogin">
        <div class="form-group">
          <label for="username">Nome de Usuário</label>
          <input type="text" id="username" v-model="registerData.username" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="registerData.email" />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="registerData.password" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <input type="password" id="confirmPassword" v-model="registerData.confirmPassword" />
        </div>
      </div>
      
      <!-- Login -->
      <div v-else>
        <div class="form-group">
          <label for="loginEmail">Email</label>
          <input type="email" id="loginEmail" v-model="loginData.email" />
        </div>
        <div class="form-group">
          <label for="loginPassword">Senha</label>
          <input type="password" id="loginPassword" v-model="loginData.password" />
        </div>
      </div>

      <button type="submit" :disabled="isLogin && isSubmitting">
        {{ isLogin ? (isSubmitting ? 'Entrando...' : 'Entrar') : 'Cadastrar' }}
      </button>
      
      <p class="switch-text">
        {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
        <span class="switch-btn" @click="toggleMode">Clique aqui</span>
      </p>
    </form>

    <div v-if="showSuccessPopup" class="success-popup">
      <div class="popup-content">
        <span class="popup-icon">✓</span>
        <p>{{ popupMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const isLogin = ref(false);
const showSuccessPopup = ref(false);
const popupMessage = ref('');
const isSubmitting = ref(false);

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginForm {
  email: string;
  password: string;
}

const registerData = ref<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const loginData = ref<LoginForm>({
  email: '',
  password: ''
});

// Função para ler cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
};

const submitRegister = (data: RegisterForm) => {
  if (data.password !== data.confirmPassword) {
    alert('As senhas não coincidem!');
    return;
  }
  fetchRegister(data);
};

const submitLogin = async (data: LoginForm) => {
  isSubmitting.value = true;
  await fetchLogin(data);
};

const fetchRegister = async (data: RegisterForm) => {
  try {
    const response = await fetch('http://localhost:8080/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      popupMessage.value = 'Usuário criado com sucesso!';
      showPopup();
      setTimeout(() => {
        isLogin.value = true;
        loginData.value.email = data.email;
      }, 2000);
    } else {
      alert('Erro ao cadastrar: ' + (result.error || result.message));
    }
  } catch (error) {
    alert('Erro de conexão.');
  }
};

const fetchLogin = async (data: LoginForm) => {
  try {
    console.log('Enviando login para:', data.email);
    
    const response = await fetch('http://localhost:8080/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log('Resposta do login:', result);

    if (response.ok) {
      popupMessage.value = 'Login realizado com sucesso!';
      showPopup();
      
      setTimeout(() => {
        const token = getCookie('token');
        if (token) {
          router.push('/');
        }
      }, 1000);
    } else {
      alert('Erro ao entrar: ' + (result.error || result.message));
    }
  } catch (error) {
    console.error('Erro no fetch:', error);
    alert('Erro de conexão: ' + error);
  } finally {
    isSubmitting.value = false;
  }
};

const showPopup = () => {
  showSuccessPopup.value = true;
  setTimeout(() => (showSuccessPopup.value = false), 1800);
};

onMounted(() => {
  console.log('Página de login carregada');
  
  const route = useRoute();
  if (route.query.mode === 'login') {
    isLogin.value = true;
  }
  
  watch(() => route.query.mode, (m) => {
    isLogin.value = m === 'login';
  });
});
</script>

<style scoped>
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 93vh;
  background: #0a0a0a;
  padding: 20px;
}

.form-container {
  background: #111;
  padding: 40px 32px;
  width: 100%;
  max-width: 420px;
  border: 1px solid #333;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.form-container::before {
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
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

h2 {
  text-align: center;
  margin-bottom: 32px;
  color: #d4af37;
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.switch-text {
  text-align: center;
  margin-top: 24px;
  color: #888;
  font-size: 0.9rem;
}

.switch-btn {
  color: #d4af37;
  cursor: pointer;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.switch-btn:hover {
  color: #e6c34d;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #eeece7;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input {
  width: 100%;
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 8;
  color: #fff;
  padding: 12px 16px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #d4af37;
  box-shadow: 0 0 0 1px #d4af37;
}

input::placeholder {
  color: #666;
}

button {
  width: 100%;
  background: #d4af37;
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
}

button:disabled {
  background: #333;
  color: #888;
  cursor: not-allowed;
  transform: none !important;
}

button:disabled::before {
  display: none;
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

button:hover:not(:disabled) {
  background: #e6c34d;
  transform: translateY(-1px);
}

button:hover:not(:disabled)::before {
  left: 100%;
}

.success-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #111;
  color: #d4af37;
  padding: 16px 20px;
  border: 1px solid #333;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  z-index: 1000;
  animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 1.7s forwards;
}

.popup-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.popup-icon {
  background: #d4af37;
  color: #000;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
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

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: #fff;
  -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset;
  border: 1px solid #333;
  transition: background-color 5000s ease-in-out 0s;
}


@media (max-width: 480px) {
  .form-container {
    padding: 32px 24px;
    margin: 0 16px;
  }
  
  h2 {
    font-size: 1.6rem;
  }
}
</style>