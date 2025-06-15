<script setup lang="ts">
defineProps<{
  size?: 'small' | 'medium' | 'large';
}>();
</script>

<template>
  <div class="spinner" :class="[size || 'medium']"></div>
</template>

<style scoped>
.spinner {
  border-radius: 50%;
  animation: spin 1s linear infinite;
  border-style: solid;
  border-color: currentColor transparent currentColor transparent;
  display: inline-block;
}

.small {
  width: 14px;
  height: 14px;
  border-width: 2px;
}

.medium {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

.large {
  width: 36px;
  height: 36px;
  border-width: 4px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
