<script setup lang="ts">
  defineProps<{
    title: string;
    message: string;
    actionLabel?: string;
  }>();

  defineEmits<{
    (e: 'action'): void;
  }>();
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">📄</div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-message">{{ message }}</p>
    <button
      v-if="actionLabel"
      class="empty-action"
      type="button"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-xl);
    height: 100%;
    color: var(--secondary-text);
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: var(--space-md);
    opacity: 0.6;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: var(--space-sm);
    color: var(--text-color);
  }

  .empty-message {
    font-size: 14px;
    max-width: 400px;
  }

  .empty-action {
    margin-top: var(--space-md);
    padding: 8px 14px;
    border: 1px solid var(--vscode-button-border, transparent);
    border-radius: 6px;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    cursor: pointer;
  }

  .empty-action:hover {
    background-color: var(--vscode-button-hoverBackground);
  }
</style>
