<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import { getProfileById } from '../services/profile';
import { fetchPublications } from '../services/publications';
import { formatDate } from '../utils/formatDate';

let unsubscribeAuth = () => { };

export default {
    name: 'Profile',
    props: ['id'],
    components: { AppH1 },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                profession: null,
            },
            userPublications: [],
            isOwnProfile: false,
        };
    },
    methods: {
        async loadProfileAndPublications(authUser) {
            if (this.id && this.id !== authUser.id) {
                this.isOwnProfile = false;
                this.user = await getProfileById(this.id);
                await this.loadUserPublications(this.id);
            } else {
                this.isOwnProfile = true;
                this.user = authUser;
                await this.loadUserPublications(authUser.id);
            }
        },
        async loadUserPublications(userId) {
            if (!userId) return;
            const allPublications = await fetchPublications();
            this.userPublications = allPublications.filter(p => p.sender_id === userId);
        },
        formatDate,
    },
    async mounted() {
        unsubscribeAuth = subscribeToAuthStateChanges(async authUser => {
            if (this.id && this.id !== authUser.id) {
                this.isOwnProfile = false;
                this.user = await getProfileById(this.id);
                await this.loadUserPublications(this.id);
            } else {
                this.isOwnProfile = true;
                this.user = authUser;
                await this.loadUserPublications(authUser.id);
            }
        });
    },
    watch: {
        id: {
            immediate: false,
            async handler() {
                const authUser = await new Promise((resolve) =>
                    subscribeToAuthStateChanges(resolve)
                );
                await this.loadProfileAndPublications(authUser);
            },
        },
    },
    unmounted() {
        unsubscribeAuth();
    }
};
</script>

<template>
    <div class="max-w-4xl mx-auto px-6 py-8 text-gray-100">
        <div class="flex items-center justify-between mb-6">
            <AppH1>
                {{ isOwnProfile ? 'Mi perfil' : user.display_name || 'Perfil de usuario' }}
            </AppH1>

            <RouterLink v-if="isOwnProfile"
                class="transition px-4 py-2 rounded bg-blue-900 hover:bg-blue-800 active:bg-blue-800 text-white cursor-pointer"
                :to="`/perfil/${user.id}/editar`">
                Editar perfil
            </RouterLink>
        </div>

        <div class="bg-[#1f1f1f] p-6 rounded-xl shadow-md mb-8">
            <p class="mb-4 italic text-gray-400">{{ user.bio || 'Sin especificar' }}</p>

            <dl class="divide-y divide-gray-700">
                <div class="py-2 flex justify-between">
                    <dt class="font-semibold text-gray-300">Email</dt>
                    <dd class="text-gray-100">{{ user.email }}</dd>
                </div>
                <div class="py-2 flex justify-between">
                    <dt class="font-semibold text-gray-300">Nombre</dt>
                    <dd class="text-gray-100">{{ user.display_name || '-' }}</dd>
                </div>
                <div class="py-2 flex justify-between">
                    <dt class="font-semibold text-gray-300">Profesión</dt>
                    <dd class="text-gray-100">{{ user.profession || '-' }}</dd>
                </div>
            </dl>
        </div>

        <div>
            <h2 class="text-xl font-semibold mb-4">
                {{ isOwnProfile ? 'Mis publicaciones' : 'Publicaciones' }}
            </h2>

            <div v-if="userPublications.length === 0" class="text-gray-400 italic">
                {{ isOwnProfile ? 'No has publicado nada aún.' : 'No existen publicaciones.' }}
            </div>

            <ul class="flex flex-col gap-4">
                <li v-for="pub in userPublications" :key="pub.id"
                    class="p-4 bg-[#262626] rounded-lg hover:bg-[#2f2f2f] transition shadow-md">
                    <div class="mb-2 text-gray-300 text-sm font-semibold">{{ user.email }}</div>
                    <div class="mb-2 text-gray-100">{{ pub.content }}</div>
                    <div class="text-xs text-gray-500">{{ formatDate(pub.created_at) }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
ul::-webkit-scrollbar {
    width: 6px;
}

ul::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: 3px;
}
</style>