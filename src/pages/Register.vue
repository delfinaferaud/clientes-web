<script>
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { register } from '../services/auth';

export default {
    name: 'Register',
    components: { AppH1, AppButton },
    data() {
        return {
            user: {
                email: '',
                password: ''
            },
            loading: false,
            successMessage: '',
            errorMessage: ''
        };
    },
    methods: {
        async handleSubmit() {
            this.successMessage = '';
            this.errorMessage = '';
            this.loading = true;

            try {
                await register(this.user.email, this.user.password);
                this.successMessage = 'Usuario creado con éxito 🎉';
                setTimeout(() => {
                    this.$router.push('/');
                }, 3000);
            } catch (error) {
                console.error('Error al registrar usuario:', error);
                this.errorMessage = error?.message || 'Ocurrió un error al crear la cuenta. Intenta nuevamente.';
                this.loading = false;
            }
        }
    }
}
</script>

<template>
    <div class="flex items-center justify-center">

        <form v-if="!successMessage" action="#" @submit.prevent="handleSubmit"
            class="w-full max-w-md bg-[#262626] p-6 rounded-lg shadow-md">
            <AppH1 class="text-center mb-6">Crear una cuenta</AppH1>
            <div class="mb-4">
                <label for="email" class="block mb-1 text-gray-300">Email</label>
                <input type="email" id="email"
                    class="w-full p-2 rounded border border-gray-700 bg-[#1f1f1f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    v-model="user.email">
            </div>
            <div class="mb-4">
                <label for="password" class="block mb-1 text-gray-300">Contraseña</label>
                <input type="password" id="password"
                    class="w-full p-2 rounded border border-gray-700 bg-[#1f1f1f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    v-model="user.password">
            </div>
            <div v-if="errorMessage" class="mb-4 p-3 rounded bg-red-700 text-white text-center animate-fade-in">
                {{ errorMessage }}
            </div>
            <AppButton type="submit" class="w-full" :disabled="loading">
                {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
            </AppButton>
        </form>
        <div v-else class="w-full max-w-md bg-green-700 p-8 rounded-lg shadow-md text-center animate-fade-in">
            <AppH1 class="mb-4">🎉 ¡Registro exitoso!</AppH1>
            <p class="text-gray-100 mb-6">{{ successMessage }}</p>
        </div>
    </div>
</template>