<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps<{
    activeType: string;
    readCount: number;
    writeCount: number;
  }>();

  const emit = defineEmits<{
    (e: 'switch-type', type: string): void;
  }>();

  const switchType = (type: string) => {
    emit('switch-type', type);
  };
</script>

<template>
  <div class="function-tabs">
    <button
      class="function-tab"
      :class="{ active: activeType === 'read' }"
      @click="switchType('read')"
      :aria-pressed="activeType === 'read'"
    >
      <span class="pill-icon read-icon"></span>
      Read Functions ({{ readCount }})
    </button>
    <button
      class="function-tab"
      :class="{ active: activeType === 'write' }"
      @click="switchType('write')"
      :aria-pressed="activeType === 'write'"
    >
      <span class="pill-icon write-icon"></span>
      Write Functions ({{ writeCount }})
    </button>
  </div>
</template>

<style scoped>
  .function-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0.5rem 0;
  }

  .function-tab {
    padding: 0.5rem 1.25rem;
    border-radius: 1.5rem;
    border: 1px solid
      var(--vscode-button-border, var(--vscode-button-background));
    background-color: var(--vscode-button-secondaryBackground, transparent);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }

  .function-tab.active {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border-color: var(--vscode-button-background);
  }

  .function-tab:hover:not(.active) {
    background-color: var(
      --vscode-button-secondaryHoverBackground,
      rgba(255, 255, 255, 0.1)
    );
  }

  .function-tab:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--vscode-focusBorder);
  }

  .pill-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.8;
  }

  .read-icon::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'%3E%3C/path%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'%3E%3C/path%3E%3C/svg%3E");
    vertical-align: middle;
    margin-right: 8px;
  }

  .write-icon::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'%3E%3C/path%3E%3Cpath d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'%3E%3C/path%3E%3C/svg%3E");
    vertical-align: middle;
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    .function-tabs {
      justify-content: center;
    }

    .function-tab {
      flex: 1;
      max-width: 180px;
    }
  }

  @media (max-width: 480px) {
    .function-tab {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }
  }
</style>
