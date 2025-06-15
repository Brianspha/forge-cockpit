<script setup lang="ts">
import { onBeforeMount, onMounted, provide, ref } from 'vue';
import HomeView from './views/HomeView.vue';
import { useAppStore } from './stores/useAppstore';
import { WebviewCommand } from './utils';
const latestMessage = ref<any>(null);
const appStore = useAppStore();

provide('latestMessage', latestMessage);

onBeforeMount(() => {
  window.localStorage.clear();
});

onMounted(() => {
  window.addEventListener('message', event => {
    latestMessage.value = event.data;
  });
  appStore.sendMessage(WebviewCommand.LoadCockpitWallets, undefined);
});
</script>

<template>
  <HomeView />
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body,
html {
  font-family: var(
    --vscode-font-family,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif
  );
  font-size: var(--vscode-font-size, 13px);
  background-color: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
  line-height: 1.5;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
