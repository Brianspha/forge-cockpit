<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import LoadingSpinner from '../spinners/LoadingSpinner.vue';
import type { AbiTab } from '../../types/index';

const props = defineProps<{
  tabs: AbiTab[];
  activeTabId: string;
}>();

const emit = defineEmits<{
  (e: 'switch-tab', tabId: string): void;
  (e: 'close-tab', tabId: string): void;
  (e: 'add-tab'): void;
}>();

const switchTab = (tabId: string) => {
  emit('switch-tab', tabId);
};

const closeTab = (tabId: string, event: Event) => {
  event.stopPropagation();
  emit('close-tab', tabId);
};

const addTab = () => {
  emit('add-tab');
};
</script>

<template>
  <div class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.id"
      class="tab"
      :class="{ active: tab.id === activeTabId }"
      @click="switchTab(tab.id)"
    >
      <div class="tab-content">
        <div v-if="tab.isLoading" class="tab-loading">
          <LoadingSpinner size="tiny" />
        </div>
        <div class="tab-title">{{ tab.title }}</div>
      </div>
      <button class="tab-close" @click="e => closeTab(tab.id, e)">×</button>
    </div>

    <button
      class="add-tab-button"
      :class="{ active: !activeTabId }"
      @click="addTab"
    >
      +
    </button>
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  background-color: var(--vscode-tab-inactiveBackground);
  border-bottom: 1px solid var(--vscode-tab-border);
  height: 40px;
  overflow-x: auto;
  flex-shrink: 0;
}

.tab {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background-color: var(--vscode-tab-inactiveBackground);
  color: var(--vscode-tab-inactiveForeground);
  border-right: 1px solid var(--vscode-tab-border);
  cursor: pointer;
  min-width: 120px;
  max-width: 200px;
  height: 100%;
  position: relative;
}

.tab.active {
  background-color: var(--vscode-tab-activeBackground);
  color: var(--vscode-tab-activeForeground);
  border-bottom: 2px solid var(--vscode-tab-activeBorderTop);
}

.tab-content {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tab-loading {
  margin-right: 8px;
}

.tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-close {
  margin-left: 8px;
  font-size: 16px;
  background: none;
  border: none;
  color: var(--vscode-icon-foreground);
  cursor: pointer;
  opacity: 0.6;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}

.tab-close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

.add-tab-button {
  width: 32px;
  height: 100%;
  background: none;
  border: none;
  color: var(--vscode-icon-foreground);
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-tab-button:hover,
.add-tab-button.active {
  background-color: var(--vscode-tab-activeBackground);
}

@media (max-width: 480px) {
  .tab {
    min-width: 100px;
  }
}
</style>
