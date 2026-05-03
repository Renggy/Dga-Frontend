<template>
  <div class="min-h-screen bg-[#070708] flex items-center justify-center p-4 selection:bg-purple-500/30 font-sans">
    <!-- Background Decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]"></div>
      <div class="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
    </div>

    <div class="w-full max-w-[420px] relative">
      <!-- Logo Area -->
      <div class="text-center mb-8">
        <div class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 items-center justify-center shadow-xl shadow-purple-500/20 mb-4 animate-float">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-white mb-1">Welcome Back</h1>
        <p class="text-white/40 font-medium">Log in to your FlowForge account</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white/[0.03] border border-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Email Address</label>
            <div class="relative group">
              <input 
                v-model="email"
                type="email" 
                placeholder="name@company.com" 
                class="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all group-hover:border-white/20"
                required
              >
              <div class="absolute inset-y-0 right-4 flex items-center opacity-20 group-focus-within:opacity-50 transition-opacity">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center px-1">
              <label class="text-xs font-bold text-white/50 uppercase tracking-widest">Password</label>
              <a href="#" class="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors">Forgot Password?</a>
            </div>
            <div class="relative group">
              <input 
                v-model="password"
                type="password" 
                placeholder="••••••••" 
                class="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all group-hover:border-white/20"
                required
              >
              <div class="absolute inset-y-0 right-4 flex items-center opacity-20 group-focus-within:opacity-50 transition-opacity">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>Sign In</span>
          </button>
          
          <div v-if="errorMessage" class="text-red-400 text-xs font-medium text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20 mt-4">
            {{ errorMessage }}
          </div>
        </form>

        <div class="mt-8 pt-8 border-t border-white/5 text-center">
          <p class="text-sm text-white/30">Don't have an account? <a href="#" class="text-white font-bold hover:text-purple-400 transition-colors">Request Access</a></p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 text-center text-[10px] text-white/10 uppercase tracking-[0.2em] font-bold">
        Protected by DGA Enterprise Security
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  console.log("S");
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push('/');
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please check your credentials.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 5s ease-in-out infinite;
}
</style>
