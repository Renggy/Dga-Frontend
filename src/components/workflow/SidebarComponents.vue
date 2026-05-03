<template>
  <aside class="w-72 shrink-0 border-r border-white/10 bg-[#0A0A0B]/50 backdrop-blur-xl flex flex-col p-4 z-40 overflow-y-auto custom-scrollbar">
    <h2 class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6">Components</h2>
    
    <div class="space-y-3">
      <!-- HTTP Request -->
      <div draggable="true" @dragstart="$emit('dragstart', $event, 'HttpCallRunner')" class="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group">
        <div class="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <div><h3 class="text-xs font-bold">HTTP Request</h3><p class="text-[9px] text-white/40">HttpCallRunner</p></div>
      </div>
      
      <!-- Delay -->
      <div draggable="true" @dragstart="$emit('dragstart', $event, 'DelayRunner')" class="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/50 cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group">
        <div class="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div><h3 class="text-xs font-bold">Jeda / Delay</h3><p class="text-[9px] text-white/40">DelayRunner</p></div>
      </div>
      
      <!-- Script -->
      <div draggable="true" @dragstart="$emit('dragstart', $event, 'ScriptRunner')" class="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-pink-500/50 cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group">
        <div class="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div><h3 class="text-xs font-bold">Execute Script</h3><p class="text-[9px] text-white/40">ScriptRunner</p></div>
      </div>
      
      <!-- Switch -->
      <div draggable="true" @dragstart="$emit('dragstart', $event, 'SwitchNode')" class="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-orange-500/50 cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group">
        <div class="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div><h3 class="text-xs font-bold">Percabangan</h3><p class="text-[9px] text-white/40">SwitchNode</p></div>
      </div>
    </div>
    
    <div class="mt-auto p-4 rounded-xl border border-dashed border-white/10 text-center">
      <p class="text-[10px] text-white/30 leading-relaxed uppercase tracking-wider">Drag and drop components to build workflow</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineEmits(['dragstart']);
</script>
