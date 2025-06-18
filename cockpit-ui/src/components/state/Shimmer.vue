<script setup lang="ts">
  defineProps<{
    height?: string;
    width?: string;
    borderRadius?: string;
    margin?: string;
  }>();
</script>

<template>
  <div
    class="shimmer"
    :style="{
      height: height || '20px',
      width: width || '100%',
      borderRadius: borderRadius || '4px',
      margin: margin || '0',
    }"
  ></div>
</template>

<style scoped>
  .shimmer {
    background-color: var(--shimmer-color);
    position: relative;
    overflow: hidden;
  }

  .shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      var(--shimmer-animation),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }

    100% {
      left: 100%;
    }
  }
</style>
