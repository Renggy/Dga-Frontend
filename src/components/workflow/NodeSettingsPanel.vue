<template>
  <transition name="slide">
    <aside v-if="node" :class="[activeTab === 'logs' || activeTab === 'data' ? 'w-[650px]' : 'w-[450px]']" class="border-l border-white/10 bg-[#0A0A0B] p-6 z-40 absolute right-0 inset-y-0 shadow-2xl flex flex-col transition-all duration-300">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-sm font-bold">{{ node.data.name || 'Node Settings' }}</h2>
        <button @click="$emit('close')" class="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <svg class="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div class="flex border-b border-white/10 mb-4 shrink-0">
        <button @click="activeTab = 'settings'" :class="{'text-purple-400 border-purple-500': activeTab === 'settings', 'text-white/50 border-transparent hover:text-white/80': activeTab !== 'settings'}" class="flex-1 pb-2 text-[10px] font-bold border-b-2 transition-colors">Settings</button>
        <button @click="activeTab = 'logs'; $emit('fetchLogs')" :class="{'text-purple-400 border-purple-500': activeTab === 'logs', 'text-white/50 border-transparent hover:text-white/80': activeTab !== 'logs'}" class="flex-1 pb-2 text-[10px] font-bold border-b-2 transition-colors">Logs</button>
        <button @click="activeTab = 'data'; $emit('fetchContext')" :class="{'text-purple-400 border-purple-500': activeTab === 'data', 'text-white/50 border-transparent hover:text-white/80': activeTab !== 'data'}" class="flex-1 pb-2 text-[10px] font-bold border-b-2 transition-colors">Incoming Data</button>
      </div>
      
      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <!-- Incoming Data Tab -->
        <div v-show="activeTab === 'data'" class="space-y-4">
          <p class="text-[9px] text-white/30 mb-4">Click any value to copy variable to clipboard or insert into focused field.</p>
          <div v-if="isLoadingContext" class="flex justify-center py-4">
            <svg class="animate-spin h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
          <div v-else class="space-y-4">
            <div v-for="(data, nodeKey) in workflowContext" :key="nodeKey" class="bg-white/5 rounded-lg overflow-hidden border border-white/5">
              <div class="bg-white/5 px-3 py-1.5 flex items-center justify-between border-b border-white/5">
                <span class="text-[10px] font-bold text-purple-400">{{ data.name }}</span>
                <span class="text-[8px] font-mono text-white/30">{{ nodeKey }}</span>
              </div>
              <div class="p-2">
                <JsonTreeView :data="data.output" :node-key="nodeKey" @pick="$emit('insertVariable', $event)" />
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-show="activeTab === 'settings'" class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Step ID</label>
            <input :value="node.id" disabled class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/50 font-mono cursor-not-allowed">
          </div>
          
          <div>
            <label class="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Display Name</label>
            <input v-model="node.data.name" @focus="$emit('trackFocus', $event)" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50">
          </div>
          
          <div>
            <label class="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Action Type</label>
            <select v-model="node.data.action" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 appearance-none">
              <option value="HttpCallRunner" class="bg-gray-900">HttpCallRunner</option>
              <option value="DelayRunner" class="bg-gray-900">DelayRunner</option>
              <option value="ScriptRunner" class="bg-gray-900">ScriptRunner</option>
              <option value="SwitchNode" class="bg-gray-900">SwitchNode (Multi-Port)</option>
            </select>
          </div>
          
          <!-- Execution Settings -->
          <div class="pt-4 border-t border-white/10">
            <h3 class="text-xs font-bold text-purple-400 mb-3">Execution Settings</h3>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label class="block text-[9px] font-bold text-white/50 uppercase mb-1">Max Retries</label>
                <input v-model.number="node.data.max_retries" type="number" min="0" max="10" class="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white">
              </div>
              <div>
                <label class="block text-[9px] font-bold text-white/50 uppercase mb-1">Timeout (s)</label>
                <input v-model.number="node.data.timeout_seconds" type="number" min="0" class="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white">
              </div>
            </div>
            <div>
              <label class="block text-[9px] font-bold text-white/50 uppercase mb-1">Retry Strategy</label>
              <select v-model="node.data.retry_strategy" class="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white appearance-none">
                <option value="exponential" class="bg-gray-900">Exponential Backoff</option>
                <option value="fixed" class="bg-gray-900">Fixed Interval</option>
                <option value="none" class="bg-gray-900">No Retry</option>
              </select>
            </div>
          </div>
          
          <!-- Dynamic Payload Config -->
          <div class="pt-4 border-t border-white/10">
            <h3 class="text-xs font-bold text-emerald-400 mb-3">Action Payload</h3>
            
            <!-- HTTP Call -->
            <div v-if="node.data.action === 'HttpCallRunner'" class="space-y-3">
              <div>
                <label class="block text-[9px] font-bold text-white/50 uppercase mb-1">Method</label>
                <select v-model="node.data.payload.method" class="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white appearance-none">
                  <option value="GET" class="bg-gray-900">GET</option>
                  <option value="POST" class="bg-gray-900">POST</option>
                </select>
              </div>
              <div>
                <label class="block text-[9px] font-bold text-white/50 uppercase mb-1">Endpoint URL</label>
                <input v-model="node.data.payload.url" @focus="$emit('trackFocus', $event)" type="text" placeholder="https://api.example.com" class="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-mono">
              </div>
            </div>

            <!-- Delay -->
            <div v-else-if="node.data.action === 'DelayRunner'">
              <label class="block text-[9px] font-bold text-white/50 uppercase mb-1">Delay Duration (seconds)</label>
              <input v-model.number="node.data.payload.delay" @focus="$emit('trackFocus', $event)" type="number" class="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white">
            </div>

            <!-- Switch/Logic -->
            <div v-else-if="node.data.action === 'SwitchNode' || node.data.action === 'ConditionalBranch'" class="space-y-4">
              <div class="flex items-center justify-between mb-2">
                <label class="block text-[10px] font-bold text-white/50 uppercase tracking-widest">Switch Rules</label>
                <button @click="$emit('addRule')" class="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors flex items-center gap-2 text-[10px] font-bold">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  Add Rule
                </button>
              </div>
              
              <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div v-for="(rule, index) in (node.data.payload?.rules || [])" :key="index" class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 relative group hover:border-purple-500/30 transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                       <span class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50">{{ index + 1 }}</span>
                       <div class="flex flex-col">
                         <label class="text-[9px] font-bold text-white/30 uppercase">Port Name</label>
                         <input v-model="rule.port" class="bg-transparent border-none p-0 text-sm font-bold text-purple-400 focus:ring-0 outline-none w-24" placeholder="e.g. active">
                       </div>
                    </div>
                    <button v-if="node.data.payload?.rules?.length > 1" @click="$emit('removeRule', index)" class="p-1.5 rounded-lg text-rose-400/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <div class="grid grid-cols-12 gap-2 pt-2 border-t border-white/5">
                    <div class="col-span-12">
                      <label class="block text-[8px] text-white/30 mb-1 uppercase font-bold tracking-wider">Property</label>
                      <input v-model="rule.property" @focus="$emit('trackFocus', $event)" type="text" placeholder="{{var}}" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white font-mono focus:border-purple-500/50 outline-none">
                    </div>
                    <div class="col-span-4">
                      <label class="block text-[8px] text-white/30 mb-1 uppercase font-bold tracking-wider">Operator</label>
                      <select v-model="rule.operator" class="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none focus:border-purple-500/50 appearance-none">
                        <option value="==">==</option>
                        <option value="!=">!=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value="matches">Regex</option>
                        <option value="contains">Contains</option>
                      </select>
                    </div>
                    <div class="col-span-8">
                      <label class="block text-[8px] text-white/30 mb-1 uppercase font-bold tracking-wider">Value</label>
                      <input v-model="rule.value" @focus="$emit('trackFocus', $event)" type="text" placeholder="value" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white font-mono focus:border-purple-500/50 outline-none">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Script Runner -->
            <div v-else-if="node.data.action === 'ScriptRunner'">
              <label class="block text-[9px] font-bold text-white/50 uppercase mb-1">PHP Script Code</label>
              <textarea v-model="node.data.payload.script" @focus="$emit('trackFocus', $event)" rows="8" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-emerald-400 font-mono focus:border-purple-500/50 outline-none resize-none custom-scrollbar" placeholder="echo 'Hello World';"></textarea>
              <p class="text-[8px] text-white/30 mt-1">Script will run in isolated PHP CLI environment.</p>
            </div>

            <!-- Default/Script -->
            <div v-else>
              <label class="block text-[9px] font-bold text-white/50 uppercase mb-1">Raw JSON Payload</label>
              <textarea v-model="node.data.payloadRaw" @focus="$emit('trackFocus', $event)" rows="4" class="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-mono" placeholder="{}"></textarea>
            </div>
          </div>
        </div>

        <!-- Logs Tab -->
        <div v-show="activeTab === 'logs'" class="space-y-3">
          <div v-if="isLoadingLogs && stepLogsList.length === 0" class="flex justify-center py-8">
             <svg class="animate-spin h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
          <div v-else-if="stepLogsList.length > 0" class="space-y-3">
             <div v-for="log in stepLogsList" :key="log.id" class="p-3 rounded-xl border border-white/5 bg-white/5">
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2 py-0.5 rounded bg-white/10 text-[9px] font-bold text-white/70">ATTEMPT #{{ log.attempt_number }}</span>
                  <span class="text-[10px] font-bold uppercase" :class="{'text-emerald-400': log.status === 'success', 'text-rose-400': log.status === 'failed'}">{{ log.status }}</span>
                </div>
                <div class="space-y-2 text-[10px]">
                  <div v-if="log.output" class="mt-2">
                    <span class="text-white/30 block mb-1 uppercase text-[8px] font-bold">Output</span>
                    <pre class="bg-black/40 p-2 rounded border border-white/5 overflow-x-auto text-emerald-300 max-h-32">{{ JSON.stringify(log.output, null, 2) }}</pre>
                  </div>
                  <div v-if="log.error_message" class="mt-2 text-rose-300 whitespace-pre-wrap">{{ log.error_message }}</div>
                </div>
             </div>
             <button v-if="hasMoreLogs" @click="$emit('fetchLogs', true)" :disabled="isLoadingLogs" class="w-full py-2 rounded-lg bg-white/5 text-[10px] font-bold text-white/50 border border-white/5">
               {{ isLoadingLogs ? 'Loading...' : 'Load More Logs' }}
             </button>
          </div>
        </div>
      </div>
      
      <!-- Actions Footer -->
      <div class="pt-4 border-t border-white/10 shrink-0">
        <button @click="$emit('delete')" class="w-full py-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 transition-colors flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Delete Node
        </button>
      </div>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JsonTreeView from '../JsonTreeView.vue';

const props = defineProps<{
  node: any;
  workflowContext: any;
  isLoadingContext: boolean;
  isLoadingLogs: boolean;
  stepLogsList: any[];
  hasMoreLogs: boolean;
}>();

const activeTab = ref('settings');

defineEmits(['close', 'fetchLogs', 'fetchContext', 'insertVariable', 'trackFocus', 'addRule', 'removeRule', 'delete']);
</script>
