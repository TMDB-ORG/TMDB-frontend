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

        <!-- Feedback do Cookie/Token -->
        <div class="cookie-feedback" :class="cookieStatus">
          <div class="feedback-icon">
            <span v-if="cookieStatus === 'checking'">⏳</span>
            <span v-else-if="cookieStatus === 'success'">✅</span>
            <span v-else-if="cookieStatus === 'error'">❌</span>
            <span v-else>🔍</span>
          </div>
          <div class="feedback-text">
            <p v-if="cookieStatus === 'checking'">Verificando autenticação...</p>
            <p v-else-if="cookieStatus === 'success'">{{ successMessage }}</p>
            <p v-else-if="cookieStatus === 'error'">{{ errorMessage }}</p>
            <p v-else>Status do cookie</p>
            <small v-if="cookieDetails" class="cookie-details">{{ cookieDetails }}</small>
          </div>
        </div>
      </div>

      <button type="submit" :disabled="isLogin && isSubmitting">
        {{ isLogin ? (isSubmitting ? 'Entrando...' : 'Entrar') : 'Cadastrar' }}
      </button>

      <p class="switch-text">
        {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
        <span class="switch-btn" @click="toggleMode">Clique aqui</span>
      </p>

      <!-- Debug Info -->
      <div class="debug-info">
        <h4 @click="toggleDebug" style="cursor: pointer;">Debug Info ▼</h4>
        <div v-if="showDebug">
          <p><strong>Cookie token:</strong> {{ debugCookieValue }}</p>
          <p><strong>Status:</strong> {{ cookieStatus }}</p>
          <p><strong>Response:</strong> {{ lastResponse }}</p>
          <button type="button" @click="checkCurrentCookie" class="debug-btn">Verificar Cookie Atual</button>
          <button type="button" @click="clearCookies" class="debug-btn" style="margin-left: 0.5rem;">Limpar Cookies</button>
        </div>
      </div>
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
import { ref, onMounted } from 'vue';

const isLogin = ref(false);
const showSuccessPopup = ref(false);
const popupMessage = ref('');
const isSubmitting = ref(false);
const cookieStatus = ref<'idle' | 'checking' | 'success' | 'error'>('idle');
const cookieDetails = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const showDebug = ref(true); // Mantenho true para debug
const debugCookieValue = ref('');
const lastResponse = ref('');

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

// Verificar cookie atual
const checkCurrentCookie = () => {
  const token = getCookie('token');
  debugCookieValue.value = token ? `Presente (${token.length} chars)` : 'Não encontrado';
  
  if (token) {
    cookieStatus.value = 'success';
    cookieDetails.value = `Token encontrado (${token.length} caracteres)`;
    successMessage.value = 'Token JWT encontrado nos cookies!';
  } else {
    cookieStatus.value = 'idle';
    cookieDetails.value = 'Nenhum token encontrado';
  }
};

// Limpar cookies (para teste)
const clearCookies = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  checkCurrentCookie();
  alert('Cookies limpos!');
};

const toggleDebug = () => {
  showDebug.value = !showDebug.value;
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  cookieStatus.value = 'idle';
  cookieDetails.value = '';
  successMessage.value = '';
  errorMessage.value = '';
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
  cookieStatus.value = 'checking';
  cookieDetails.value = 'Enviando credenciais...';
  successMessage.value = '';
  errorMessage.value = '';
  
  await fetchLogin(data);
};

const fetchRegister = async (data: RegisterForm) => {
  try {
    const response = await fetch('http://localhost:8080/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    if (response.ok) {
      popupMessage.value = 'Usuário criado com sucesso!';
      showPopup();
      setTimeout(() => {
        isLogin.value = true; // Muda para login após cadastro
        loginData.value.email = data.email; // Preenche o email
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
      headers: { 'Content-Type': 'application/json' },
      credentials: "include", // ISSO É IMPORTANTE para enviar/receber cookies
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    lastResponse.value = JSON.stringify(result, null, 2);
    
    console.log('Resposta do login:', result);
    console.log('Status HTTP:', response.status);
    console.log('Headers:', response.headers);

    if (response.ok) {
      // Login bem-sucedido - verificar se o cookie foi setado
      cookieStatus.value = 'success';
      successMessage.value = result.message || 'Login realizado com sucesso!';
      cookieDetails.value = 'Redirecionando...';
      
      // Dar tempo para o cookie ser setado
      setTimeout(() => {
        const token = getCookie('token');
        if (token) {
          cookieDetails.value = `Token JWT recebido! (${token.length} caracteres)`;
          popupMessage.value = 'Login realizado com sucesso!';
          showPopup();
          
          // Redirecionar após breve delay
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          cookieStatus.value = 'error';
          errorMessage.value = 'Token não encontrado nos cookies';
          cookieDetails.value = 'O login foi aceito, mas o cookie não foi configurado.';
          console.error('Cookie não encontrado após login bem-sucedido');
        }
      }, 100);
      
    } else {
      // Login falhou
      cookieStatus.value = 'error';
      errorMessage.value = result.error || 'Erro no login';
      cookieDetails.value = 'Verifique suas credenciais e tente novamente.';
      alert('Erro ao entrar: ' + (result.error || result.message));
    }
  } catch (error) {
    console.error('Erro no fetch:', error);
    cookieStatus.value = 'error';
    errorMessage.value = 'Erro de conexão';
    cookieDetails.value = 'Não foi possível conectar ao servidor.';
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
  checkCurrentCookie();
  console.log('Página de login carregada');
  console.log('Cookies atuais:', document.cookie);
});
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

.switch-text {
  text-align: center;
  margin-top: 1.5rem;
  color: #dadee4;
  font-size: 0.9rem;
}

.switch-text .switch-btn {
  color: #d4af37;
  cursor: pointer;
  font-weight: 500;
  margin-left: 0.25rem;
  transition: color 0.3s ease;
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

button:disabled {
  opacity: 0.6;
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
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
}

button:hover:not(:disabled)::before {
  left: 100%;
}

button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

/* Cookie Feedback Styles */
.cookie-feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  transition: all 0.3s ease;
}

.cookie-feedback.idle {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #4a5568;
}

.cookie-feedback.checking {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid #ffc107;
}

.cookie-feedback.success {
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid #28a745;
}

.cookie-feedback.error {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
}

.feedback-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.feedback-text {
  flex: 1;
}

.feedback-text p {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.cookie-details {
  color: #a0aec0;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

/* Debug Info */
.debug-info {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid #4a5568;
}

.debug-info h4 {
  margin: 0 0 0.5rem 0;
  color: #d4af37;
  font-size: 0.9rem;
}

.debug-info p {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: #a0aec0;
}

.debug-btn {
  background: transparent;
  border: 1px solid #4a5568;
  color: #e2e8f0;
  padding: 0.5rem;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.debug-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Resto dos estilos permanecem iguais */
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