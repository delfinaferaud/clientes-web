<script>
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import { fetchPublications, savePublications, subscribeToPublications } from '../services/publications';
import { formatRelativeDate } from '../utils/formatDate';

let unsubscribeAuth = () => { };
let unsubscribePublications = () => { };

export default {
    name: 'Publications',
    components: { AppH1, AppButton, },
    data() {
        return {
            messages: [],
            newMessage: {
                content: ''
            },
            user: {
                id: null,
                email: null
            },
            showModal: false,
            loading: false,
            errorMessage: '',
            successMessage: ''
        }
    },
    methods: {
        async handleSubmit() {
            this.errorMessage = '';
            this.successMessage = '';

            if (!this.newMessage.content.trim()) {
                this.errorMessage = 'No podés publicar un mensaje vacío.';
                return;
            }

            try {
                this.loading = true;

                await savePublications({
                    sender_id: this.user.id,
                    email: this.user.email,
                    content: this.newMessage.content.trim()
                });

                this.successMessage = 'Publicación creada con éxito 🎉';
                this.newMessage.content = '';

                setTimeout(() => {
                    this.showModal = false;
                    this.successMessage = '';
                }, 1200);

            } catch (error) {
                console.error('Error al publicar:', error);
                this.errorMessage = 'Ocurrió un error al crear la publicación. Intenta nuevamente.';
            } finally {
                this.loading = false;
            }
        },
        openModal() {
            this.showModal = true;
            this.errorMessage = '';
            this.successMessage = '';
        },
        closeModal() {
            this.showModal = false;
            this.errorMessage = '';
            this.successMessage = '';
            this.newMessage.content = '';
        },
        formatRelativeDate
    },
    async mounted() {
        unsubscribeAuth = subscribeToAuthStateChanges(userState => (this.user = userState));

        unsubscribePublications = subscribeToPublications(async newMessage => {
            try {
                this.messages.push(newMessage);
                await this.$nextTick();
                if (this.$refs.publicationContainer)
                    this.$refs.publicationContainer.scrollTop =
                        this.$refs.publicationContainer.scrollHeight;
            } catch (error) {
                console.error('Error al actualizar publicaciones:', error);
            }
        });

        try {
            this.messages = await fetchPublications();
            await this.$nextTick();
            this.$refs.publicationContainer.scrollTop =
                this.$refs.publicationContainer.scrollHeight;
        } catch (error) {
            console.error('Error al cargar publicaciones:', error);
        }
    },
    unmounted() {
        unsubscribeAuth();
        unsubscribePublications();
    }
}
</script>

<template>
    <div class="px-6 py-8 text-gray-100">
        <div class="flex flex-col items-center mb-6">
            <AppH1>¿Qué hay de nuevo en Caleido?</AppH1>
            <AppButton @click="openModal" class="w-50">Crear publicación</AppButton>
        </div>
        <section ref="publicationContainer"
            class="overflow-y-auto w-full max-w-3xl mx-auto h-[70vh] p-4 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg">
            <h2 class="sr-only">Lista de publicaciones</h2>
            <ol class="flex flex-col gap-4">
                <li v-for="message in messages" :key="message.id"
                    class="p-4 rounded-lg bg-[#262626] hover:bg-[#2f2f2f] transition">
                    <RouterLink :to="`/perfil/${message.sender_id}`">

                        <div class="mb-2 text-sm text-gray-400 font-semibold">{{ message.email }}</div>
                    </RouterLink>
                    <div class="mb-2 text-lg text-gray-200">{{ message.content }}</div>
                    <div class="text-xs text-gray-500">
                        {{ message.created_at ? formatRelativeDate(message.created_at) : '' }}
                    </div>
                </li>
            </ol>
        </section>

        <div v-if="showModal"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition">
            <div class="bg-[#1f1f1f] text-gray-200 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                <button @click="closeModal"
                    class="absolute top-3 right-3 text-gray-400 hover:text-gray-100 transition text-xl">&times;</button>
                <h2 class="text-xl font-semibold mb-4">Crear nueva publicación</h2>
                <div v-if="errorMessage" class="mb-3 p-3 rounded bg-red-700 text-white text-center animate-fade-in">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="mb-3 p-3 rounded bg-green-700 text-white text-center animate-fade-in">
                    {{ successMessage }}
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-4">
                        <label for="content" class="block mb-1 text-sm text-gray-300">¿Qué querés compartir?</label>
                        <textarea id="content" v-model="newMessage.content"
                            class="w-full min-h-[100px] p-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"></textarea>
                    </div>
                    <div class="flex justify-end gap-2">
                        <AppButton type="button" @click="closeModal" class="bg-gray-600 hover:bg-gray-500 text-white">
                            Cancelar
                        </AppButton>
                        <AppButton type="submit">
                            Publicar
                        </AppButton>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<style scoped>
section::-webkit-scrollbar {
    width: 6px;
}

section::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: 3px;
}

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