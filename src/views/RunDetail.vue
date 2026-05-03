<template>
  <div class="min-h-screen bg-[#0A0A0B] text-white flex flex-col">
    <!-- Header -->
    <header class="h-16 shrink-0 border-b border-white/10 bg-[#121214] px-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link :to="`/workflows/${route.params.id}/history`" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </router-link>
        <div>
          <h1 class="text-lg font-bold">Run Details</h1>
          <p class="text-xs text-white/50 font-mono">{{ route.params.runId }}</p>
        </div>
      </div>
      <div v-if="runData" class="flex items-center gap-3">
        <span class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
              :class="{
                'bg-emerald-500/10 text-emerald-400': runData.status === 'running',
                'bg-blue-500/10 text-blue-400': runData.status === 'completed',
                'bg-rose-500/10 text-rose-400': runData.status === 'failed',
                'bg-white/10 text-white/50': !['running', 'completed', 'failed'].includes(runData.status)
              }">
          {{ runData.status }}
        </span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden flex">
      <!-- Steps List Sidebar -->
      <aside class="w-[350px] border-r border-white/10 bg-[#0A0A0B] overflow-y-auto custom-scrollbar p-4">
        <h2 class="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Step Execution Log</h2>
        
        <div v-if="isLoading" class="text-center py-8 text-white/30">Loading steps...</div>
        
        <div v-else class="space-y-3">
          <div v-for="stepRun in runData?.step_runs || []" :key="stepRun.id" 
               class="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
               @click="selectedStep = stepRun"
               :class="{'border-purple-500/50 bg-purple-500/5': selectedStep?.id === stepRun.id}">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold font-mono text-purple-300">{{ stepRun.step_key }}</span>
              <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded"
                    :class="{
                      'bg-emerald-500/20 text-emerald-400': stepRun.status === 'success',
                      'bg-rose-500/20 text-rose-400': stepRun.status === 'failed',
                      'bg-amber-500/20 text-amber-400': stepRun.status === 'pending',
                      'bg-white/10 text-white/50': stepRun.status === 'skipped'
                    }">{{ stepRun.status }}</span>
            </div>
            <div class="flex items-center justify-between text-[10px] text-white/40">
              <span>Attempt: {{ stepRun.attempt_number }}</span>
              <span v-if="stepRun.finished_at && stepRun.started_at">{{ new Date(stepRun.finished_at).getTime() - new Date(stepRun.started_at).getTime() }}ms</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Step Detail View -->
      <section class="flex-1 bg-[#050506] p-8 overflow-y-auto custom-scrollbar">
        <div v-if="selectedStep" class="max-w-4xl mx-auto space-y-6">
          <h2 class="text-2xl font-bold font-mono">{{ selectedStep.step_key }} <span class="text-sm font-sans text-white/50 font-normal">Execution Details</span></h2>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 class="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Input Context</h3>
              <pre class="text-xs font-mono text-purple-300 whitespace-pre-wrap overflow-hidden">{{ JSON.stringify(selectedStep.input, null, 2) }}</pre>
            </div>
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 class="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Output Result</h3>
              <pre class="text-xs font-mono text-emerald-300 whitespace-pre-wrap overflow-hidden">{{ JSON.stringify(selectedStep.output, null, 2) }}</pre>
            </div>
          </div>
          
          <div v-if="selectedStep.error_message" class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <h3 class="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">Error Message</h3>
            <pre class="text-xs font-mono text-rose-300 whitespace-pre-wrap">{{ selectedStep.error_message }}</pre>
          </div>
        </div>
        <div v-else class="h-full flex items-center justify-center text-white/20">
          Select a step from the sidebar to view details
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ApiService from '../services/ApiService';

const route = useRoute();
const runData = ref<any>(null);
const isLoading = ref(true);
const selectedStep = ref<any>(null);

const fetchRunDetail = async () => {
  isLoading.value = true;
  try {
    const response: any = await ApiService.get(`/workflows/${route.params.id}/runs/${route.params.runId}`);
    runData.value = response.data;
    if (runData.value.step_runs && runData.value.step_runs.length > 0) {
      // Auto select first step
      selectedStep.value = runData.value.step_runs[0];
    }
  } catch (error) {
    console.error('Failed to fetch run detail', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchRunDetail();
});
</script>
