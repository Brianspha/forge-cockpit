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

//@ts-ignore
document.head.insertAdjacentHTML(
  'beforeend',
  `<style>
    /* Global CSS for theme compatibility */
    body {
      background-color: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      font-family: var(--vscode-font-family);
      margin: 0;
      padding: 0;
    }
    
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: var(--vscode-scrollbarSlider-background);
      border-radius: 5px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--vscode-scrollbarSlider-hoverBackground);
    }
    
    ::-webkit-scrollbar-thumb:active {
      background-color: var(--vscode-scrollbarSlider-activeBackground);
    }
    
    ::-webkit-scrollbar-corner {
      background-color: var(--vscode-editor-background);
    }
  </style>`
);
