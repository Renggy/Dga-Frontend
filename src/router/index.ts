import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import WorkflowEdit from '../views/WorkflowEdit.vue';
import { useAuthStore } from '../stores/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/workflows/:id/edit',
    name: 'WorkflowEdit',
    component: WorkflowEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/workflows/:id/history',
    name: 'WorkflowHistory',
    component: () => import('../views/WorkflowHistory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/workflows/:id/runs/:runId',
    name: 'RunDetail',
    component: () => import('../views/RunDetail.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard for auth
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
