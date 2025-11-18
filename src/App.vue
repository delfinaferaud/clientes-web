<script>
import AppNavbar from './components/AppNavbar.vue';

export default {
    name: 'App',
    components: { AppNavbar },
}
</script>

<template>
    <AppNavbar />
    <main class="container pt-20 px-6 mx-auto">
        <RouterView />
    </main>
</template>