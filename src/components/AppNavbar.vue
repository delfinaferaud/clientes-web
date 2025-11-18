<script>
import { logout, subscribeToAuthStateChanges } from '../services/auth';

export default {
    name: 'AppNavbar',
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            menuOpen: false,
        };
    },
    methods: {
        handleLogOut() {
            logout();
            this.$router.push('/ingresar');
        },
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
    },
    mounted() {
        subscribeToAuthStateChanges((userState) => (this.user = userState));
    },
};
</script>

<template>
    <nav
        class="z-50 flex items-center justify-between px-6 sm:px-20 py-3 bg-gray-950 shadow-md h-25 text-gray-200 relative">

        <RouterLink to="/" class="flex items-center gap-3">
            <div class="flex items-center">
                <img src="/logo.webp" alt="Logo" class="h-20 w-auto object-contain" />
            </div>
        </RouterLink>

        <button @click="toggleMenu" class="sm:hidden flex flex-col gap-1 p-2 rounded hover:bg-gray-100">
            <span class="w-6 h-0.5 bg-gray-600"></span>
            <span class="w-6 h-0.5 bg-gray-600"></span>
            <span class="w-6 h-0.5 bg-gray-600"></span>
        </button>

        <ul class="absolute sm:static left-0 right-0 top-[60px] sm:top-auto bg-gray-950 sm:bg-transparent flex flex-col sm:flex-row items-center gap-4 px-4 sm:px-0 py-4 sm:py-0 border-t sm:border-0 transition-all duration-300"
            :class="menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 sm:max-h-none sm:opacity-100 overflow-hidden sm:overflow-visible'">
            <li>
                <RouterLink class="hover:text-blue-200 transition-colors" to="/">Home</RouterLink>
            </li>

            <template v-if="user.id === null">
                <li>
                    <RouterLink class="hover:text-blue-200 transition-colors" to="/ingresar">Ingresar</RouterLink>
                </li>
                <li>
                    <RouterLink class="hover:text-blue-200 transition-colors" to="/crear-cuenta">Crear cuenta
                    </RouterLink>
                </li>
            </template>

            <template v-else>
                <li>
                    <RouterLink class="hover:text-blue-200 transition-colors" :to="`/perfil/${user.id}`">Mi perfil
                    </RouterLink>
                </li>
                <li>
                    <form action="#" @submit.prevent="handleLogOut">
                        <button type="submit" class="hover:text-red-500 transition-colors cursor-pointer">
                            {{ user.email }} - Cerrar sesión
                        </button>
                    </form>
                </li>
            </template>
        </ul>
    </nav>
</template>
