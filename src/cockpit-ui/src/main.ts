import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const pinia = createPinia();
const app = createApp(App);
//@ts-ignore
pinia.use(createPersistedState({ storage: window.localStorage }));
app.use(pinia);
app.mount('#app');
