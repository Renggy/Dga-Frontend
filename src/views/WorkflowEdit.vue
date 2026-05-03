<template>
  <div class="h-screen w-screen flex flex-col bg-[#070708] text-white selection:bg-purple-500/30 overflow-hidden font-sans">
    
    <!-- Top Navbar -->
    <nav class="h-16 shrink-0 border-b border-white/10 bg-[#0A0A0B]/80 backdrop-blur-xl px-4 flex items-center justify-between z-50">
      <div class="flex items-center gap-4">
        <router-link to="/" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <svg class="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <div>
          <h1 class="text-sm font-bold flex items-center gap-2">
            {{ workflow?.name || 'Loading Workflow...' }}
            <span v-if="workflow" class="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] border border-purple-500/20">DAG Editor</span>
          </h1>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <router-link :to="`/workflows/${route.params.id}/history`" class="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          History
        </router-link>
        <button @click="saveWorkflow" :disabled="isSaving" class="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all border border-white/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          {{ isSaving ? 'Saving...' : 'Save Layout' }}
        </button>
        <button v-if="!isExecuting" @click="triggerWorkflow" :disabled="isSaving" class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
          Run Workflow
        </button>
        <button v-else @click="stopWorkflow" class="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs rounded-lg font-bold transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2 animate-pulse">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" /></svg>
          Stop Workflow
        </button>
      </div>
    </nav>

    <!-- Main Workspace -->
    <div class="flex-1 flex overflow-hidden relative">
      <SidebarComponents @dragstart="onDragStart" />

      <!-- Vue Flow Canvas -->
      <div class="flex-1 relative" @drop="onDrop" @dragover.prevent @dragenter.prevent>
        <VueFlow v-model="elements" :default-zoom="1.5" :min-zoom="0.2" :max-zoom="4" :edges-selectable="true" @nodeClick="onNodeClick" @edgeClick="onEdgeClick" @connect="onConnect" fit-view-on-init class="flowforge-theme" edge-type="smoothstep">
          <Background pattern-color="#ffffff" :gap="20" :size="1" :opacity="0.05" />
          <Controls position="bottom-right" />
          
          <template #node-custom="props">
            <div class="px-4 py-3 rounded-xl border shadow-xl transition-all duration-300 relative group cursor-pointer"
                 :class="{
                   'border-blue-500/50 bg-blue-500/5': props.data.action === 'HttpCallRunner',
                   'border-amber-500/50 bg-amber-500/5': props.data.action === 'DelayRunner',
                   'border-pink-500/50 bg-pink-500/5': props.data.action === 'ScriptRunner',
                   'border-orange-500/50 bg-orange-500/5': props.data.action === 'SwitchNode' || props.data.action === 'ConditionalBranch',
                   'ring-2 ring-white': selectedNodeId === props.id,
                   'animate-pulse ring-2 ring-yellow-400 scale-105': props.data.status === 'running',
                   'ring-2 ring-emerald-500': props.data.status === 'success',
                   'ring-2 ring-rose-500 animate-shake': props.data.status === 'error' || props.data.status === 'failed'
                 }">
              
              <Handle :position="Position.Top" type="target" class="w-3 h-3 bg-white border-2 border-[#0A0A0B]" />
              
              <button @click.stop="runIndividualStep(props.id)" class="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-emerald-500 text-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-50">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </button>

              <div class="flex items-center gap-3 min-w-[180px]">
                <NodeIcon :action="props.data.action" :status="props.data.status" />
                <div>
                  <h3 class="text-xs font-bold text-white leading-tight">{{ props.data.name }}</h3>
                  <p class="text-[9px] font-mono mt-0.5 font-bold" :class="{'text-yellow-400': props.data.status==='running', 'text-emerald-400': props.data.status==='success', 'text-rose-400': props.data.status==='error'}" v-if="props.data.status">
                     {{ props.data.status.toUpperCase() }}
                  </p>
                  <p class="text-[8px] font-mono text-white/30" v-else>{{ props.id }}</p>
                </div>
              </div>

              <Handle :position="Position.Bottom" type="source" class="!w-3 !h-3 !bg-white !border-2 !border-[#0A0A0B]" />
            </div>
          </template>
        </VueFlow>
        
        <div v-if="isLoading" class="absolute inset-0 bg-[#070708]/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div class="flex flex-col items-center gap-4">
            <svg class="animate-spin h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span class="text-sm font-bold text-white/70 animate-pulse">Loading DAG...</span>
          </div>
        </div>
      </div>

      <NodeSettingsPanel 
        v-if="selectedNode"
        :node="selectedNode"
        :workflow-context="workflowContext"
        :is-loading-context="isLoadingContext"
        :is-loading-logs="isLoadingLogs"
        :step-logs-list="stepLogsList"
        :has-more-logs="hasMoreLogs"
        :analyzing-log-id="analyzingLogId"
        @close="selectedNodeId = null"
        @fetchLogs="fetchStepLogs"
        @fetchContext="fetchWorkflowContext"
        @insertVariable="insertVariable"
        @trackFocus="trackFocus"
        @addRule="addRule"
        @removeRule="removeRule"
        @delete="deleteNode"
        @analyzeLog="analyzeLog"
      />
    </div>

    <!-- Toast Notifications -->
    <transition-group name="toast" tag="div" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
      <div v-for="toast in toasts" :key="toast.id" class="px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-4 pointer-events-auto min-w-[320px]" :class="toastClasses(toast.type)">
        <div class="flex-1">
          <h4 class="text-xs font-bold">{{ toast.title || 'Notification' }}</h4>
          <p class="text-[10px] opacity-70 mt-0.5">{{ toast.message }}</p>
        </div>
        <button @click="removeToast(toast.id)" class="p-1 hover:bg-white/5 rounded transition-colors opacity-50 hover:opacity-100">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ApiService from '../services/ApiService';
import NodeIcon from '../components/workflow/NodeIcon.vue';
import SidebarComponents from '../components/workflow/SidebarComponents.vue';
import NodeSettingsPanel from '../components/workflow/NodeSettingsPanel.vue';

// Vue Flow
import { VueFlow, useVueFlow, Handle, Position } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';

// WebSocket
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
(window as any).Pusher = Pusher;

const { project } = useVueFlow();
const route        = useRoute();

// --- UI State ---
const isLoading    = ref(true);
const isSaving     = ref(false);
const isExecuting  = ref(false);
const isDirty      = ref(false);

// --- Workflow Data ---
const workflow     = ref<any>(null);
const elements     = ref<any[]>([]);
const currentRunId = ref<string | null>(null);

// --- Node Selection ---
const selectedNodeId = ref<string | null>(null);

// --- Context / Incoming Data ---
const workflowContext    = ref<any>({});
const isLoadingContext   = ref(false);

// --- Logs ---
const stepLogsList  = ref<any[]>([]);
const currentLogsPage = ref(1);
const hasMoreLogs   = ref(false);
const isLoadingLogs = ref(false);
const analyzingLogId = ref<string | null>(null);

// --- Misc ---
const lastFocusedInput = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
const toasts           = ref<any[]>([]);

let echoInstance: Echo<any> | null = null;
let currentRunChannel: any    = null;

// Initialization
onMounted(() => {
  initWebSocket();
  fetchWorkflowData();
});

onUnmounted(() => {
  if (echoInstance && currentRunChannel) echoInstance.leave(`workflow.run.${currentRunChannel}`);
});

/** Inisialisasi koneksi Laravel Echo (WebSocket via Reverb) untuk menerima update real-time. */
const initWebSocket = () => {
  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST ?? 'localhost',
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
  });
};

// Data Fetching
const fetchWorkflowData = async () => {
  try {
    const response: any = await ApiService.get(`/workflows/${route.params.id}`);
    workflow.value = response.data.workflow;
    currentRunId.value = response.data.latest_run_id;
    
    const versions = workflow.value.versions || [];
    const latestVersion = versions.length > 0 ? versions.reduce((p: any, c: any) => (p.version_number > c.version_number ? p : c)) : null;
    let def = latestVersion?.definition;
    
    if (def) {
      if (typeof def === 'string') try { def = JSON.parse(def); } catch (e) { console.error(e); }
      const steps = def.steps || def.definition?.steps;
      if (steps) convertDagToVueFlow(steps);
    }
    setTimeout(() => { isDirty.value = false; }, 500);
  } catch (error) {
    showToast('Error', 'Failed to load workflow data', 'error');
  } finally {
    isLoading.value = false;
  }
};

const convertDagToVueFlow = (steps: any[]) => {
  const nodes = steps.map((step, idx) => ({
    id: step.id,
    type: 'custom',
    position: step.ui_metadata?.position || { x: 250 + (idx % 3) * 250, y: 100 + Math.floor(idx / 3) * 150 },
    data: { 
      name: step.name, action: step.action, status: null,
      max_retries: step.retry_policy?.max_retries || 3,
      retry_strategy: step.retry_policy?.strategy || 'exponential',
      timeout_seconds: step.timeout_seconds || 60,
      payload: step.config || {},
      payloadRaw: JSON.stringify(step.config || {}, null, 2)
    }
  }));

  const edges: any[] = [];
  steps.forEach(step => {
    (step.depends_on || []).forEach((dep: any, idx: number) => {
      const depId = typeof dep === 'object' ? dep.id : dep;
      const branch = typeof dep === 'object' ? dep.branch : null;
      let stroke = '#8b5cf6';
      if (branch === 'true') stroke = '#10b981';
      else if (branch === 'false' || branch === 'else') stroke = '#f43f5e';

      edges.push({
        id: `e-${depId}-${step.id}-${idx}-${Date.now()}`,
        source: depId, target: step.id, label: branch || null,
        data: { branch, branchIndex: idx },
        animated: true, selectable: true, updatable: true, interactionWidth: 20,
        style: { stroke, strokeWidth: 2 },
        labelStyle: { fill: 'white', fontWeight: 'bold', fontSize: '10px' },
        labelBgPadding: [4, 2], labelBgBorderRadius: 4,
        labelBgStyle: { fill: branch === 'true' ? '#10b981' : branch === 'false' ? '#f43f5e' : '#1e293b', fillOpacity: 0.8 },
      });
    });
  });

  elements.value = [...nodes, ...edges];
};

// --- Canvas Actions ---

/**
 * Dipanggil saat user menyambungkan 2 node dengan menarik garis.
 * Menentukan label & warna edge secara otomatis berdasarkan tipe node sumber.
 */
const onConnect = (params: any) => {
  const sourceNode = elements.value.find(el => el.id === params.source);
  let label = '';
  let style = { stroke: '#8b5cf6', strokeWidth: 2 };
  let edgeData: any = {};

  const isBranchingNode = sourceNode?.data?.action === 'SwitchNode'
    || sourceNode?.data?.action === 'ConditionalBranch';

  if (isBranchingNode) {
    const existingEdges = elements.value.filter(el => el.source === params.source);
    const branchIndex = existingEdges.length;
    const rules = sourceNode!.data.payload?.rules || [];

    // Ambil nama port dari rule, fallback ke 'true'/'false'/port-N
    label = rules[branchIndex]?.port
      || (branchIndex === 0 ? 'true' : branchIndex === 1 ? 'false' : `port-${branchIndex + 1}`);

    edgeData = { branchIndex, branch: label };

    if (label === 'true') style = { stroke: '#10b981', strokeWidth: 2 };
    else if (label === 'false' || label === 'else') style = { stroke: '#f43f5e', strokeWidth: 2 };
  }

  const labelBgColor = label === 'true' ? '#10b981' : label === 'false' ? '#f43f5e' : '#1e293b';

  elements.value.push({
    id: `e-${params.source}-${params.target}-${Date.now()}`,
    source: params.source,
    target: params.target,
    label: label || undefined,
    data: edgeData,
    animated: true,
    selectable: true,
    updatable: true,
    style,
    labelStyle: { fill: 'white', fontWeight: 'bold', fontSize: '10px' },
    labelBgStyle: { fill: labelBgColor, fillOpacity: 0.8 },
  });
  isDirty.value = true;
};

/**
 * Dipanggil saat user meng-drop komponen dari sidebar ke canvas.
 * Membuat node baru dengan payload default sesuai tipe komponen.
 */
const onDrop = (event: DragEvent) => {
  const type = event.dataTransfer?.getData('application/vueflow');
  if (!type) return;

  const position = project({ x: event.clientX - 256, y: event.clientY - 64 });

  // Default payload per tipe komponen
  const defaultPayloads: Record<string, any> = {
    SwitchNode: { rules: [{ port: 'true', property: '', operator: '==', value: '' }, { port: 'false', property: '', operator: '==', value: '' }] },
    HttpCallRunner: { method: 'GET', url: '' },
    DelayRunner: { delay: 5 },
    ScriptRunner: { script: '' },
  };
  const payload = defaultPayloads[type] ?? {};

  elements.value.push({
    id: `step_${Date.now()}`,
    type: 'custom',
    position,
    data: {
      name: `New ${type.replace('Runner', '').replace('Node', '')}`,
      action: type,
      status: null,
      max_retries: 3,
      retry_strategy: 'exponential',
      timeout_seconds: 60,
      payload,
      payloadRaw: JSON.stringify(payload, null, 2),
    },
  });
  isDirty.value = true;
};

// Utilities
const showToast = (title: string, message: string, type: string = 'info') => {
  const id = Date.now();
  toasts.value.push({ id, title, message, type });
  setTimeout(() => removeToast(id), 5000);
};
const removeToast = (id: number) => { toasts.value = toasts.value.filter(t => t.id !== id); };
const toastClasses = (type: string) => ({
  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400': type === 'success',
  'bg-rose-500/10 border-rose-500/20 text-rose-400': type === 'error',
  'bg-amber-500/10 border-amber-500/20 text-amber-400': type === 'warning',
  'bg-blue-500/10 border-blue-500/20 text-blue-400': type === 'info',
});

// Watchers
const selectedNode = computed(() => elements.value.find(el => el.id === selectedNodeId.value && !el.source));
watch(() => selectedNode.value?.data.payload, (newVal) => {
  if (selectedNode.value) {
    selectedNode.value.data.payloadRaw = JSON.stringify(newVal, null, 2);
    if (['SwitchNode', 'ConditionalBranch'].includes(selectedNode.value.data.action)) {
      const rules = newVal?.rules || [];
      elements.value = elements.value.map(el => {
        if (el.source === selectedNodeId.value && el.data?.branchIndex !== undefined) {
          const rule = rules[el.data.branchIndex];
          if (rule?.port) {
            let stroke = '#8b5cf6';
            if (rule.port === 'true') stroke = '#10b981';
            else if (rule.port === 'false' || rule.port === 'else') stroke = '#f43f5e';
            return { ...el, label: rule.port, style: { stroke, strokeWidth: 2 }, data: { ...el.data, branch: rule.port } };
          }
        }
        return el;
      });
    }
    isDirty.value = true;
  }
}, { deep: true });

// --- Event Handlers ---

/** Dipanggil saat drag dari sidebar dimulai. Set tipe node ke dataTransfer. */
const onDragStart = (e: DragEvent, type: string) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('application/vueflow', type);
    e.dataTransfer.effectAllowed = 'move';
  }
};

/** Dipanggil saat user klik sebuah node. Simpan ID node yang dipilih. */
const onNodeClick = (e: any) => {
  selectedNodeId.value = e.node.id;
  // Deselect semua edge agar tidak ada edge & node terpilih bersamaan
  elements.value.forEach(el => { if (el.source) el.selected = false; });
};

/** Dipanggil saat user klik edge. Deselect node yang sedang dipilih. */
const onEdgeClick = () => {
  selectedNodeId.value = null;
};

/** Simpan referensi input/textarea yang sedang aktif untuk keperluan insert variabel. */
const trackFocus = (e: any) => {
  lastFocusedInput.value = e.target;
};

/**
 * Insert variabel `{{nodeKey.path}}` ke input yang sedang aktif.
 * Jika tidak ada input aktif, salin ke clipboard.
 */
const insertVariable = ({ nodeKey, path }: { nodeKey: string; path: string }) => {
  const variable = `{{${nodeKey}.${path}}}`;
  if (lastFocusedInput.value) {
    const input = lastFocusedInput.value;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const newValue = input.value.substring(0, start) + variable + input.value.substring(end);
    input.value = newValue;
    input.dispatchEvent(new Event('input'));
    input.focus();
    setTimeout(() => input.setSelectionRange(start + variable.length, start + variable.length), 0);
  } else {
    navigator.clipboard.writeText(variable);
    showToast('Copied', `Variable ${variable} disalin ke clipboard`, 'info');
  }
};

/** Tambah rule baru ke SwitchNode yang sedang dipilih. */
const addRule = () => {
  if (!selectedNode.value) return;
  const rules = selectedNode.value.data.payload.rules ??= [];
  rules.push({
    port: (rules.length + 1).toString(),
    property: '',
    operator: '==',
    value: '',
  });
  isDirty.value = true;
};

/** Hapus rule di index tertentu dari SwitchNode yang sedang dipilih. */
const removeRule = (idx: number) => {
  if (!selectedNode.value?.data.payload.rules) return;
  selectedNode.value.data.payload.rules.splice(idx, 1);
  isDirty.value = true;
};

/** Hapus node yang dipilih beserta semua edge yang terhubung ke/dari node tersebut. */
const deleteNode = () => {
  if (!selectedNodeId.value) return;
  elements.value = elements.value.filter(
    el => el.id !== selectedNodeId.value
      && el.source !== selectedNodeId.value
      && el.target !== selectedNodeId.value
  );
  selectedNodeId.value = null;
  isDirty.value = true;
};

// --- Workflow Execution ---

/**
 * Konversi state canvas (nodes + edges) menjadi format DAG JSON
 * yang siap dikirim ke backend Laravel.
 */
const generateBackendDag = () => {
  const nodes = elements.value.filter(el => !el.source);
  const edges = elements.value.filter(el => !!el.source);

  const steps = nodes.map(node => {
    const dependencies = edges
      .filter(e => e.target === node.id)
      .map(e => ({ id: e.source, branch: e.data?.branch || null }));

    return {
      id: node.id,
      step_key: node.id,
      name: node.data.name,
      action: node.data.action,
      depends_on: dependencies,
      timeout_seconds: node.data.timeout_seconds,
      retry_policy: {
        max_retries: node.data.max_retries,
        strategy: node.data.retry_strategy,
      },
      config: node.data.payload,
      ui_metadata: { position: node.position },
    };
  });

  return { steps };
};

/** Simpan layout & konfigurasi workflow ke backend. */
const saveWorkflow = async () => {
  isSaving.value = true;
  try {
    const definition = generateBackendDag();
    await ApiService.put(`/workflows/${route.params.id}`, {
      definition: JSON.stringify(definition),
    });
    isDirty.value = false;
    showToast('Tersimpan', 'Workflow berhasil disimpan', 'success');
  } catch (e) {
    showToast('Gagal Simpan', 'Tidak dapat menyimpan workflow', 'error');
  } finally {
    isSaving.value = false;
  }
};

const triggerWorkflow = async () => {
  if (isDirty.value) return showToast('Unsaved Changes', 'Please save before running', 'warning');
  try {
    elements.value.forEach(el => { if(!el.source) el.data.status = null; });
    const res: any = await ApiService.post(`/workflows/${route.params.id}/trigger`);
    currentRunId.value = res.data.run_id;
    isExecuting.value = true;
    showToast('Triggered', `Run ID: ${res.data.run_id.substring(0, 8)}`, 'success');
    if (echoInstance) {
      if (currentRunChannel) echoInstance.leave(`workflow.run.${currentRunChannel}`);
      currentRunChannel = res.data.run_id;
      echoInstance.channel(`workflow.run.${res.data.run_id}`).listen('.StepUpdated', (e: any) => {
        const node = elements.value.find(n => n.id === e.stepId);
        if (node) node.data.status = e.status;
      }).listen('.RunCompleted', () => { isExecuting.value = false; showToast('Completed', 'Workflow finished', 'success'); });
    }
  } catch (e) { isExecuting.value = false; showToast('Error', 'Trigger failed', 'error'); }
};

const stopWorkflow = async () => {
  if (!currentRunId.value) return;
  try {
    await ApiService.post(`/workflows/${route.params.id}/runs/${currentRunId.value}/stop`);
    isExecuting.value = false;
    elements.value.forEach(el => { if(!el.source && el.data.status === 'running') el.data.status = null; });
    showToast('Stopping', 'Workflow stop signal sent', 'info');
  } catch (e) { showToast('Error', 'Stop failed', 'error'); }
};

const fetchWorkflowContext = async () => {
  isLoadingContext.value = true;
  try {
    const response = await ApiService.get(`/workflows/${route.params.id}/latest-context`);
    workflowContext.value = response.data;
  } catch (error) {
    console.error('Failed to fetch context', error);
  } finally {
    isLoadingContext.value = false;
  }
};

const fetchStepLogs = async (loadMore = false) => {
  if (!selectedNodeId.value) return;
  if (!loadMore) { stepLogsList.value = []; currentLogsPage.value = 1; }
  else { currentLogsPage.value++; }

  isLoadingLogs.value = true;
  try {
    const res: any = await ApiService.get(`/workflows/${route.params.id}/steps/${selectedNodeId.value}/all-logs?page=${currentLogsPage.value}`);
    const newData = res.data.data || [];
    stepLogsList.value = loadMore ? [...stepLogsList.value, ...newData] : newData;
    hasMoreLogs.value = res.data.current_page < res.data.last_page;
  } catch (error) {
    console.error('Failed to load step logs', error);
  } finally {
    isLoadingLogs.value = false;
  }
};

const runIndividualStep = async (stepKey: string) => {
  const node = elements.value.find(el => el.id === stepKey);
  if (node) node.data.status = 'running';
  try {
    showToast('Testing Step', `Executing ${stepKey}...`, 'info');
    const definition = generateBackendDag();
    await ApiService.post(`/workflows/${route.params.id}/steps/${stepKey}/test`, { definition });
    if (node) node.data.status = 'success';
    showToast('Success', `Step ${stepKey} executed successfully`, 'success');
    fetchWorkflowContext();
    selectedNodeId.value = stepKey;
    fetchStepLogs();
  } catch (error: any) {
    if (node) node.data.status = 'error';
    showToast('Failed', `Step ${stepKey} failed: ${error.response?.data?.message || error.message}`, 'error');
  }
};

const analyzeLog = async (log: any) => {
  if (!log.id || !log.workflow_run_id) return;
  
  analyzingLogId.value = log.id;
  try {
    const res: any = await ApiService.post(
      `/workflows/${route.params.id}/runs/${log.workflow_run_id}/steps/${log.id}/analyze`
    );
    // Update the log object in the list with the analysis result
    const index = stepLogsList.value.findIndex(l => l.id === log.id);
    if (index !== -1) {
      stepLogsList.value[index] = {
        ...stepLogsList.value[index],
        ai_analysis: res.data
      };
    }
    showToast('AI Analysis Ready', 'Diagnosis and solution have been generated.', 'success');
  } catch (error: any) {
    showToast('AI Error', 'Failed to analyze failure with AI', 'error');
  } finally {
    analyzingLogId.value = null;
  }
};

const { onNodeDragStop, onNodesChange, onEdgesChange } = useVueFlow();
onNodeDragStop(() => isDirty.value = true);
onNodesChange(c => { if (c.some(x => x.type === 'add' || x.type === 'remove')) isDirty.value = true; });
onEdgesChange(c => { if (c.some(x => x.type === 'add' || x.type === 'remove')) isDirty.value = true; });
</script>

<style>

.flowforge-theme .vue-flow__edge.selected .vue-flow__edge-path { stroke: #d8b4fe; stroke-width: 4; filter: drop-shadow(0 0 8px #a855f7); }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translateY(20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateY(-20px) scale(0.9); }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
.animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
</style>
