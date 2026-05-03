<template>
  <div class="min-h-screen bg-[#0A0A0B] text-white p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </router-link>
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">Execution History</h1>
          <p class="text-sm text-white/50">Viewing runs for Workflow ID: {{ route.params.id }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 mb-6">
        <button @click="setFilter('')" :class="filter === '' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'" class="px-4 py-2 rounded-lg text-sm font-bold transition-all">All Runs</button>
        <button @click="setFilter('running')" :class="filter === 'running' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'" class="px-4 py-2 rounded-lg text-sm font-bold transition-all">Running</button>
        <button @click="setFilter('completed')" :class="filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'" class="px-4 py-2 rounded-lg text-sm font-bold transition-all">Completed</button>
        <button @click="setFilter('failed')" :class="filter === 'failed' ? 'bg-rose-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'" class="px-4 py-2 rounded-lg text-sm font-bold transition-all">Failed</button>
      </div>

      <!-- Data Table -->
      <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-white/10 bg-black/20">
              <th class="p-4 text-xs font-bold text-white/50 uppercase tracking-wider">Run ID</th>
              <th class="p-4 text-xs font-bold text-white/50 uppercase tracking-wider">Status</th>
              <th class="p-4 text-xs font-bold text-white/50 uppercase tracking-wider">Trigger</th>
              <th class="p-4 text-xs font-bold text-white/50 uppercase tracking-wider">Start Time</th>
              <th class="p-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="border-b border-white/5">
              <td colspan="5" class="p-8 text-center text-white/30">Loading history...</td>
            </tr>
            <tr v-else-if="runs.length === 0" class="border-b border-white/5">
              <td colspan="5" class="p-8 text-center text-white/30">No execution history found.</td>
            </tr>
            <tr v-for="run in runs" :key="run.id" class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
              <td class="p-4">
                <span class="text-xs font-mono text-white/70">{{ run.id }}</span>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      :class="{
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': run.status === 'running',
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20': run.status === 'completed',
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20': run.status === 'failed',
                        'bg-white/10 text-white/50 border border-white/10': !['running', 'completed', 'failed'].includes(run.status)
                      }">
                  {{ run.status }}
                </span>
              </td>
              <td class="p-4">
                <span class="text-xs text-white/70 capitalize">{{ run.trigger_type || 'Manual' }}</span>
              </td>
              <td class="p-4">
                <span class="text-xs text-white/50">{{ new Date(run.started_at || run.created_at).toLocaleString() }}</span>
              </td>
              <td class="p-4 text-right">
                <router-link :to="`/workflows/${route.params.id}/runs/${run.id}`" class="text-xs font-bold text-purple-400 hover:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Detail &rarr;
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-4 border-t border-white/10 flex items-center justify-between">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg bg-white/5 text-white/70 text-xs font-bold disabled:opacity-30">Previous</button>
          <span class="text-xs text-white/50">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg bg-white/5 text-white/70 text-xs font-bold disabled:opacity-30">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ApiService from '../services/ApiService';

const route = useRoute();
const runs = ref<any[]>([]);
const isLoading = ref(true);
const filter = ref('');
const currentPage = ref(1);
const totalPages = ref(1);

const fetchHistory = async () => {
  isLoading.value = true;
  try {
    const statusParam = filter.value ? `&status=${filter.value}` : '';
    const response: any = await ApiService.get(`/workflows/${route.params.id}/runs?page=${currentPage.value}${statusParam}`);
    runs.value = response.data.data;
    currentPage.value = response.data.current_page;
    totalPages.value = response.data.last_page;
  } catch (error) {
    console.error('Failed to fetch history', error);
  } finally {
    isLoading.value = false;
  }
};

const setFilter = (status: string) => {
  filter.value = status;
  currentPage.value = 1;
  fetchHistory();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchHistory();
  }
};

onMounted(() => {
  fetchHistory();
});
</script>
