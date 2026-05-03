import { defineStore } from 'pinia';
import ApiService from '../services/ApiService';

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    workflows: [] as any[],
    stats: null as any,
    lastFetchedAt: null as Date | null,
    isLoading: false,
    error: null as string | null
  }),
  actions: {
    async fetchWorkflows(force = false) {
      // Pakai cache jika data kurang dari 30 detik
      if (!force && this.lastFetchedAt && Date.now() - this.lastFetchedAt.getTime() < 30000) {
          return;
      }
      
      this.isLoading = true;
      try {
        const response: any = await ApiService.get('/workflows');
        // Extract data assuming paginated response
        this.workflows = response.data.data || response.data;
        this.lastFetchedAt = new Date();
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch workflows';
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchStats() {
      try {
        const response: any = await ApiService.get('/stats');
        this.stats = response.data;
      } catch (error: any) {
        console.error('Failed to fetch stats', error);
      }
    },

    // Optimistic delete
    async deleteWorkflow(id: string) {
      const backup = [...this.workflows];
      this.workflows = this.workflows.filter(w => w.id !== id); // optimistic
      try {
        await ApiService.delete(`/workflows/${id}`);
      } catch (error) {
        this.workflows = backup; // rollback on failure
        throw error;
      }
    },
    
    // Optimistic create mapping
    async createWorkflow(payload: any) {
      try {
        const response: any = await ApiService.post('/workflows', payload);
        this.workflows.unshift(response.data); // optimistic update
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }
});
