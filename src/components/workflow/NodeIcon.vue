<template>
  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative" :class="containerClass">
    <!-- Status Overlays -->
    <svg v-if="status === 'running'" class="absolute inset-0 m-auto animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <svg v-else-if="status === 'success'" class="absolute inset-0 m-auto h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
    </svg>
    <svg v-else-if="status === 'error' || status === 'failed'" class="absolute inset-0 m-auto h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
    </svg>

    <!-- Base Icons -->
    <template v-else>
      <svg v-if="action === 'HttpCallRunner'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
      <svg v-else-if="action === 'DelayRunner'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else-if="action === 'ScriptRunner'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
      <svg v-else-if="action === 'SwitchNode' || action === 'ConditionalBranch'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  action: string;
  status?: string | null;
}>();

const containerClass = computed(() => ({
  'bg-blue-500/20 text-blue-400': props.action === 'HttpCallRunner',
  'bg-amber-500/20 text-amber-400': props.action === 'DelayRunner',
  'bg-pink-500/20 text-pink-400': props.action === 'ScriptRunner',
  'bg-orange-500/20 text-orange-400': props.action === 'SwitchNode' || props.action === 'ConditionalBranch',
}));
</script>
