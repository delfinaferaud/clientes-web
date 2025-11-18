<script>
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { login } from '../services/auth';

export default {
    name: 'Login',
    components: { AppH1, AppButton },
    data() {
        return {
            loading: false,
            user: {
                email: '',
                password: ''
            },
            errorMessage: ''
        }
    },
    methods: {
        async handleSubmit() {
            this.errorMessage = '';
            this.loading = true;

            try {
                await login(this.user.email, this.user.password);
                this.$router.push('/');
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                if (error?.message?.includes('Invalid login credentials')) {
                    this.errorMessage = 'Email o contraseña incorrectos.';
                } else {
                    this.errorMessage = 'No se pudo iniciar sesión. Intenta nuevamente.';

                }
            }
            this.loading = false;
        }
    }
}
</script>

<template>
    <div class="flex items-center justify-center">
        <form @submit.prevent="handleSubmit" class="w-full max-w-md bg-[#262626] p-6 rounded-lg shadow-md">
            <AppH1 class="text-center mb-6">Ingresar a mi cuenta</AppH1>

            <div class="mb-4">
                <label for="email" class="block mb-1 text-gray-300">Email</label>
                <input type="email" id="email" v-model="user.email"
                    class="w-full p-2 rounded border border-gray-700 bg-[#1f1f1f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600">
            </div>

            <div class="mb-4">
                <label for="password" class="block mb-1 text-gray-300">Contraseña</label>
                <input type="password" id="password" v-model="user.password"
                    class="w-full p-2 rounded border border-gray-700 bg-[#1f1f1f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600">
            </div>

            <div v-if="errorMessage" class="mb-4 p-3 rounded bg-red-700 text-white text-center animate-fade-in">
                {{ errorMessage }}
            </div>
            <AppButton type="submit" class="w-full">Ingresar</AppButton>
        </form>
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
</style>