<template>
  <div class="space-y-1 font-mono text-[10px]">
    <div v-for="(value, key) in data" :key="key" class="ml-2 border-l border-purple-500/30 pl-2">
      <!-- If object, recurse -->
      <div v-if="typeof value === 'object' && value !== null" class="cursor-default">
        <div 
          @click="toggleExpand(key)" 
          class="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors cursor-pointer py-0.5"
        >
          <svg 
            class="w-2 h-2 fill-current transition-transform duration-200" 
            :class="{ 'rotate-90': expandedNodes[key] }"
            viewBox="0 0 20 20"
          >
            <path d="M6 6L14 10L6 14V6Z" />
          </svg>
          <span class="text-purple-400/80">{{ key }}:</span>
          <span class="text-[8px] opacity-50 italic" v-if="!expandedNodes[key]">{{ Array.isArray(value) ? `Array[${value.length}]` : '{...}' }}</span>
        </div>
        
        <transition name="fade-slide">
          <JsonTreeView 
            v-if="expandedNodes[key]"
            :data="value" 
            :node-key="nodeKey" 
            :parent-path="getFullPath(key)" 
            @pick="(e) => $emit('pick', e)" 
          />
        </transition>
      </div>
      
      <!-- If primitive, allow picking -->
      <div 
        v-else 
        @click="$emit('pick', { nodeKey, path: getFullPath(key) })" 
        class="hover:bg-purple-500/20 px-1 rounded cursor-pointer group flex items-center gap-2 transition-colors py-0.5"
      >
        <span class="text-white/60">{{ key }}:</span>
        <span class="text-emerald-400 truncate max-w-[150px]">{{ formatValue(value) }}</span>
        <div class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
           <span class="text-[8px] text-purple-400 uppercase font-bold">Pick</span>
           <svg class="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  data: any;
  nodeKey: string;
  parentPath?: string;
}>();

defineEmits(['pick']);

const expandedNodes = ref<Record<string, boolean>>({});

const toggleExpand = (key: string) => {
  expandedNodes.value[key] = !expandedNodes.value[key];
};

const getFullPath = (key: string) => {
  return props.parentPath ? `${props.parentPath}.${key}` : `output.${key}`;
};

const formatValue = (val: any) => {
  if (typeof val === 'string') return `"${val}"`;
  if (val === null) return 'null';
  return val;
};
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.2s ease-out;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-5px);
}
</style>
