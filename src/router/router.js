import { createRouter, createWebHistory } from 'vue-router';
import Publications from '../pages/Publications.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Profile from '../pages/Profile.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import ProfileEdit from '../pages/ProfileEdit.vue';
import { supabase } from '../services/supabase';

const routes = [
  { path: '/', component: Publications, meta: { requiresAuth: true } },
  {
    path: '/publicaciones',
    component: Publications,
    meta: { requiresAuth: true },
  },
  { path: '/ingresar', component: Login },
  { path: '/crear-cuenta', component: Register },
  {
    path: '/perfil/:id',
    component: Profile,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/perfil/:id/editar',
    component: ProfileEdit,
    meta: { requiresAuth: true },
    props: true,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

let user = {
  id: null,
  email: null,
};

subscribeToAuthStateChanges((userState) => (user = userState));

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return '/ingresar';
    }
  }
});

export default router;
