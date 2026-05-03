<template>
  <div class="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              FlowForge
            </span>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 transition-colors duration-300">
              <span class="w-2 h-2 rounded-full relative">
                <span class="absolute inline-flex h-full w-full rounded-full opacity-75" :class="isConnected ? 'animate-ping bg-emerald-400' : 'bg-rose-400'"></span>
                <span class="relative inline-flex rounded-full w-2 h-2" :class="isConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]'"></span>
              </span>
              <span class="text-xs font-medium text-white/70">{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
            </div>
            
            <div class="h-8 w-[1px] bg-white/10 mx-2"></div>
            
            <div class="flex items-center gap-3">
              <div class="text-right hidden sm:block" v-if="authStore.user">
                <p class="text-xs font-semibold text-white">{{ authStore.user.name }}</p>
                <p class="text-[10px] text-white/40">Tenant: {{ authStore.user.tenant }}</p>
              </div>
              <button @click="logout" class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/10 flex items-center justify-center hover:scale-105 transition-transform" title="Logout">
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">Workflow <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Orchestrator</span></h1>
          <p class="text-lg text-white/50 max-w-2xl">Manage and monitor your automated pipelines.</p>
        </div>
        <button v-if="authStore.user && authStore.user.role.slug !== 'VIEWER'" @click="showCreateModal = true" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Workflow
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" v-if="workflowStore.stats">
        <div class="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110">
            <svg class="w-40 h-40 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p class="text-sm font-medium text-white/50 mb-2">Active Executions</p>
          <div class="text-4xl font-bold tracking-tight">{{ workflowStore.stats.active_runs }}</div>
          <div class="mt-4 flex items-center gap-1.5 text-xs font-medium" :class="workflowStore.stats.active_runs > 0 ? 'text-emerald-400' : 'text-white/30'">
            <svg v-if="workflowStore.stats.active_runs > 0" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span>{{ workflowStore.stats.active_runs > 0 ? 'Running currently' : 'Idle' }}</span>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110">
            <svg class="w-40 h-40 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p class="text-sm font-medium text-white/50 mb-2">Success Rate (24h)</p>
          <div class="text-4xl font-bold tracking-tight tabular-nums">{{ workflowStore.stats.success_rate }}%</div>
          <div class="mt-4 flex items-center gap-1.5 text-xs text-blue-400 font-medium">
            <span>{{ workflowStore.stats.total_24h }} total runs</span>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110">
            <svg class="w-40 h-40 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm font-medium text-white/50 mb-2">Avg. Duration</p>
          <div class="text-4xl font-bold tracking-tight">{{ workflowStore.stats.avg_duration ? Math.round(workflowStore.stats.avg_duration * 10) / 10 : 0 }}s</div>
          <div class="mt-4 flex items-center gap-1.5 text-xs font-medium" :class="workflowStore.stats.failed_24h > 0 ? 'text-rose-400' : 'text-emerald-400'">
            <svg v-if="workflowStore.stats.failed_24h == 0" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            <span>{{ workflowStore.stats.failed_24h }} failed steps</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Workflow List -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xl font-bold">My Workflows</h2>
            <div class="flex gap-2">
              <div class="relative">
                <input type="text" placeholder="Search..." class="bg-white/5 border border-white/10 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:border-purple-500/50 w-48">
                <svg class="w-4 h-4 text-white/30 absolute right-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </div>

          <div v-for="workflow in workflowStore.workflows" :key="workflow.id" class="p-5 rounded-2xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg group-hover:text-purple-400 transition-colors">{{ workflow.name }}</h3>
                  <p class="text-sm text-white/40">{{ workflow.description }}</p>
                </div>
              </div>
              <div class="flex items-center gap-6 text-right">
                <div class="hidden sm:block">
                  <p class="text-[10px] uppercase tracking-wider text-white/20 mb-1">Status</p>
                  <span class="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-tighter">
                    {{ workflow.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                
                <div class="flex gap-2">
                  <button v-if="authStore.user && authStore.user.role.slug !== 'VIEWER'" @click="triggerWorkflow(workflow.id)" 
                          class="p-2 rounded-lg transition-all group" 
                          :class="activeRuns[workflow.id] ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 animate-pulse shadow-lg shadow-rose-500/20' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'"
                          :title="activeRuns[workflow.id] ? 'Stop Workflow' : 'Trigger Workflow'">
                    <svg v-if="!activeRuns[workflow.id]" class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    <svg v-else class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <router-link v-if="authStore.user && authStore.user.role.slug !== 'VIEWER'" :to="`/workflows/${workflow.id}/edit`" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors" title="Edit Workflow">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </router-link>
                  <router-link :to="`/workflows/${workflow.id}/history`" class="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-colors" title="View History">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </router-link>
                  <button v-if="authStore.user && authStore.user.role.slug === 'ADMIN'" @click="deleteWorkflow(workflow.id)" class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors" title="Delete Workflow">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="space-y-4">
           <h2 class="text-xl font-bold flex items-center gap-2 mb-2">
            <div class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </div>
            Activity Feed
          </h2>
          
          <div class="rounded-2xl border border-white/10 bg-[#0A0A0B]/50 overflow-hidden backdrop-blur-xl max-h-[600px] overflow-y-auto custom-scrollbar">
            <TransitionGroup name="list" tag="ul" class="divide-y divide-white/5">
              <li v-for="event in events" :key="event.id" class="p-4 hover:bg-white/[0.03] transition-colors flex items-start gap-3">
                <div class="mt-1 flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center" 
                  :class="{
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': event.type === 'success',
                    'bg-blue-500/10 text-blue-400 border-blue-500/20': event.type === 'info',
                    'bg-purple-500/10 text-purple-400 border-purple-500/20': event.type === 'start',
                    'bg-rose-500/10 text-rose-400 border-rose-500/20': event.type === 'fail'
                  }">
                  <svg v-if="event.type === 'success'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  <svg v-if="event.type === 'info'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <svg v-if="event.type === 'start'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                  <svg v-if="event.type === 'fail'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-0.5">
                    <h3 class="font-bold text-white/90 text-sm">{{ event.title }}</h3>
                    <span class="text-[10px] text-white/30">{{ event.time }}</span>
                  </div>
                  <p class="text-xs text-white/50 line-clamp-2 leading-relaxed">{{ event.message }}</p>
                </div>
              </li>
            </TransitionGroup>
          </div>
          
          <button @click="triggerSimulatedEvent" class="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold transition-all border border-white/10 border-dashed">
            Simulate Event
          </button>
        </div>
      </div>
    </main>

    <!-- Create Workflow Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-[#121214] border border-white/10 rounded-2xl max-w-md w-full shadow-2xl">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white">Create Workflow</h2>
            <button @click="showCreateModal = false" class="text-white/40 hover:text-white">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="handleCreateWorkflow">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-white/70 mb-1">Workflow Name</label>
                <input v-model="newWorkflow.name" type="text" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-white/70 mb-1">Description (Optional)</label>
                <textarea v-model="newWorkflow.description" rows="3" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"></textarea>
              </div>
            </div>
            <div class="mt-8 flex gap-3">
              <button type="button" @click="showCreateModal = false" class="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors">Cancel</button>
              <button type="submit" class="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold transition-all" :disabled="isCreating">
                {{ isCreating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useWorkflowStore } from '../stores/workflow';
import ApiService from '../services/ApiService';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const router = useRouter();
const authStore = useAuthStore();
const workflowStore = useWorkflowStore();
const isConnected = ref(false);
const events = ref<any[]>([]);

const showCreateModal = ref(false);
const isCreating = ref(false);
const newWorkflow = ref({ name: '', description: '' });

// Mapping workflow_id -> run_id untuk state tombol Play/Stop
const activeRuns = ref<Record<string, string>>({});
const executionsCount = ref(0);

const fetchWorkflows = async () => {
  // Force=true agar tidak terblokir oleh cache 30 detik di dalam Store
  await workflowStore.fetchWorkflows(true);
  
  // Sinkronisasi activeRuns lokal dengan data dari server
  const updatedActiveRuns: Record<string, string> = {};
  workflowStore.workflows.forEach((wf: any) => {
    // Jika workflow punya run terakhir, dan statusnya pending/running, maka ia sedang berjalan
    if (wf.latest_run && ['pending', 'running'].includes(wf.latest_run.status)) {
      updatedActiveRuns[String(wf.id)] = String(wf.latest_run.id);
    }
  });
  activeRuns.value = updatedActiveRuns;
  
  // Refresh statistik juga agar sinkron dengan daftar workflow
  workflowStore.fetchStats();
};

const deleteWorkflow = async (id: string) => {
  if (confirm('Are you sure you want to delete this workflow?')) {
    await workflowStore.deleteWorkflow(id);
  }
};

const handleCreateWorkflow = async () => {
  if (!newWorkflow.value.name) return;
  isCreating.value = true;
  try {
    const payload = {
      name: newWorkflow.value.name,
      description: newWorkflow.value.description,
      definition: JSON.stringify({ steps: [] }) // Empty initial definition
    };
    const created = await workflowStore.createWorkflow(payload);
    showCreateModal.value = false;
    newWorkflow.value = { name: '', description: '' };
    router.push(`/workflows/${created.id}/edit`);
  } catch (error) {
    console.error('Failed to create workflow', error);
    alert('Failed to create workflow. See console for details.');
  } finally {
    isCreating.value = false;
  }
};

const triggerWorkflow = async (id: any) => {
  const workflowId = String(id);
  console.log('Triggering workflow:', workflowId);
  
  if (activeRuns.value[workflowId]) {
    try {
      console.log('Stopping run:', activeRuns.value[workflowId]);
      await ApiService.post(`/workflows/${workflowId}/runs/${activeRuns.value[workflowId]}/stop`);
      const updated = { ...activeRuns.value };
      delete updated[workflowId];
      activeRuns.value = updated;
      workflowStore.fetchStats();
    } catch (error) {
      console.error('Failed to stop workflow', error);
    }
  } else {
    try {
      const response: any = await ApiService.post(`/workflows/${workflowId}/trigger`);
      console.log('API Response:', response);
      
      // Ambil run_id dari response. data bisa di response atau response.data tergantung interceptor
      const runId = response?.run_id ?? response?.data?.run_id ?? response?.id ?? response?.data?.id;
      
      if (runId) {
        console.log('Setting active run:', runId);
        activeRuns.value = { ...activeRuns.value, [workflowId]: String(runId) };
      } else {
        console.warn('No Run ID found in response');
      }
      
      workflowStore.fetchStats();
    } catch (error) {
      console.error('Failed to trigger workflow', error);
      alert('Failed to trigger workflow');
    }
  }
};



const initWebSocket = () => {
  if (isConnected.value) return;

  (window as any).Pusher = Pusher;
  const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
  });

  // Monitoring Koneksi
  echo.connector.pusher.connection.bind('connected', () => {
    console.log('📡 WebSocket Connected to Reverb');
    isConnected.value = true;
  });

  echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('❌ WebSocket Disconnected');
    isConnected.value = false;
  });

  echo.channel('workflow-runs')
    .listen('.RunStarted', (e: any) => {
      console.log('🚀 RunStarted received:', e);
      if (e.run && e.run.workflow_id) {
        const wfId = String(e.run.workflow_id);
        
        // Update activeRuns agar tombol berubah jadi "Stop"
        activeRuns.value = { ...activeRuns.value, [wfId]: String(e.run.id) };
        
        // Update latest_run di store
        const wfIndex = workflowStore.workflows.findIndex(w => String(w.id) === wfId);
        if (wfIndex !== -1) {
          workflowStore.workflows[wfIndex].latest_run = e.run;
        }

        addEvent('start', 'Workflow Started', `Workflow "${e.run.workflow?.name || e.run.workflow_id}" is now running.`);
      }
    })
    .listen('.RunCompleted', (e: any) => {
      console.log('✅ RunCompleted received:', e);
      if (e.run && e.run.workflow_id) {
        const wfId = String(e.run.workflow_id);
        
        // Hapus dari activeRuns
        const updated = { ...activeRuns.value };
        delete updated[wfId];
        activeRuns.value = updated;

        // Update latest_run di store
        const wfIndex = workflowStore.workflows.findIndex(w => String(w.id) === wfId);
        if (wfIndex !== -1) {
          workflowStore.workflows[wfIndex].latest_run = e.run;
        }

        // Fallback: Refresh statistik jika StatsUpdated terlewat
        workflowStore.fetchStats();

        const isSuccess = e.run.status === 'completed';
        addEvent(
          isSuccess ? 'success' : 'fail', 
          isSuccess ? 'Workflow Success' : 'Workflow Failed', 
          `Workflow "${e.run.workflow?.name || e.run.workflow_id}" finished: ${e.run.status}.`
        );
      }
    })
    .listen('.StatsUpdated', (e: any) => {
      console.log('📊 StatsUpdated received:', e);
      if (e.stats) {
        workflowStore.stats = e.stats;
      }
    });
};

const triggerSimulatedEvent = () => {
  const items = [
    { type: 'start', title: 'Step Started',   message: 'Initializing parallel execution for Layer 3.' },
    { type: 'info',  title: 'Worker Busy',    message: 'CPU usage spiked to 85% on worker node 01.' },
    { type: 'success', title: 'Step Success', message: 'HttpCallRunner finished successfully in 450ms.' },
  ];
  const item = items[Math.floor(Math.random() * items.length)];
  executionsCount.value++;
  addEvent(item.type, item.title, item.message);
};

const addEvent = (type, title, message) => {
  const now = new Date();
  events.value.unshift({
    id: Date.now().toString() + Math.random(),
    type, title, message,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  if (events.value.length > 20) events.value.pop();
};

onMounted(() => {
  fetchWorkflows(); // Juga memanggil fetchStats di dalamnya
  initWebSocket();
});

onUnmounted(() => {
  // Relying entirely on WebSocket, no poller to clear
});
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from { opacity: 0; transform: translateX(-20px); }
.list-leave-to { opacity: 0; transform: translateX(20px); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>
