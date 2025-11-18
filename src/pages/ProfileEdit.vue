<script>
import AppH1 from '../components/AppH1.vue';
import AppButton from '../components/AppButton.vue';
import { subscribeToAuthStateChanges, updateAuthUserData } from '../services/auth';

let unsubscribeAuth = () => { };

export default {
    name: 'ProfileEdit',
    components: { AppH1, AppButton },
    data() {
        return {
            formData: {
                display_name: null,
                bio: null,
                profession: null,
            },
            loading: false,
            successMessage: '',
            errorMessage: '',
        }
    },
    methods: {
        async handleSubmit() {
            this.successMessage = '';
            this.errorMessage = '';
            this.loading = true;
            try {
                await updateAuthUserData({ ...this.formData });
                this.successMessage = 'Perfil actualizado correctamente ✅';
            } catch (error) {
                this.errorMessage = 'Hubo un error al actualizar el perfil. Intenta nuevamente.';
            }

            this.loading = false;
        }
    },
    mounted() {
        unsubscribeAuth = subscribeToAuthStateChanges(async userState => {
            this.formData = {
                display_name: userState.display_name ?? '',
                bio: userState.bio ?? '',
                profession: userState.profession ?? '',
            }
        });
    },
    unmounted() {
        unsubscribeAuth();
    }
}
</script>

<template>
    <div class="max-w-lg mx-auto px-4 py-8">
        <AppH1 class="text-center mb-6">Actualizar mi perfil</AppH1>

        <div class="px-2 mb-6 text-gray-200 italic text-center">
            {{ formData.bio || 'Sin especificar' }}
        </div>

        <div v-if="successMessage" class="mb-4 p-3 rounded bg-green-600 text-white text-center">
            {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 rounded bg-red-600 text-white text-center">
            {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="bg-white dark:bg-[#262626] p-6 rounded-lg shadow-md">
            <div class="mb-4">
                <label for="display_name" class="block mb-1 text-gray-800 dark:text-gray-200">Nombre</label>
                <input type="text" id="display_name"
                    class="w-full p-2 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100"
                    v-model="formData.display_name">
            </div>

            <div class="mb-4">
                <label for="profession" class="block mb-1 text-gray-800 dark:text-gray-200">Profesión</label>
                <input type="text" id="profession"
                    class="w-full p-2 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100"
                    v-model="formData.profession">
            </div>

            <div class="mb-4">
                <label for="bio" class="block mb-1 text-gray-800 dark:text-gray-200">Biografía</label>
                <textarea id="bio"
                    class="w-full p-2 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100"
                    v-model="formData.bio"></textarea>
            </div>

            <AppButton type="submit" class="w-full" :disabled="loading">
                {{ loading ? 'Actualizando...' : 'Actualizar' }}
            </AppButton>
        </form>
    </div>
</template>
