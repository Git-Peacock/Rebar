<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';

const Events = useEvents();

const username = ref<string>('');
const password = ref<string>('');
const usernameValid = ref(false);
const passwordValid = ref(false);

async function loginOrRegister() {
    const result = await Events.emitServerRpc('authenticate:login', username.value, password.value);
    console.log(result);
}

watch(username, (value) => {
    usernameValid.value = false;

    if (username.value.length <= 2) {
        return;
    }
    if (!username.value.match(/^[A-Za-z0-9]+$/gm)) {
        return;
    }

    usernameValid.value = true;


});

watch(password, (value) => {
    passwordValid.value = false;

    // If the length of the password is less than 3, return
    if (value.length <= 2) {
        return;
    }

    passwordValid.value = true;
});
</script>

<template>
    <div class="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
        <div class="flex w-1/2 flex-col gap-4 rounded-lg bg-zinc-900 bg-opacity-80 p-6">
            <div class="font-bold text-white">Authenticate</div>
            <input v-model="username" type="text" placeholder="username"
                class="rounded-md bg-zinc-900 p-2 text-white" />
            <span class="text-xs text-red-300" v-if="!usernameValid">
                Username must be at least 3 characters long, no special characters. Alphanumeric only.
            </span>
            <input v-model="password" type="password" placeholder="password"
                class="rounded-md bg-zinc-900 p-2 text-white" />
            <span class="text-xs text-red-300" v-if="!passwordValid">
                Password must be at least 3 characters long.
            </span>
            <button @click="loginOrRegister()"
                class="rounded-md bg-emerald-700 p-3 font-medium text-white hover:bg-emerald-800"
                v-if="usernameValid && passwordValid">
                Login / Register
            </button>
        </div>
    </div>
</template>