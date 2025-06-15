<script setup lang="ts">
import { computed } from 'vue';
import LoadingSpinner from '../spinners/LoadingSpinner.vue';

const props = defineProps<{
  isDeploying: boolean;
  isDeployed: boolean;
  canDeploy?: boolean;
  hasNetworks?: boolean;
  clipboardContent?: Record<string, string>;
  isParentLoading?: Record<string, boolean>;
}>();

const emit = defineEmits<{
  (e: 'deploy', args: any[]): void;
  (e: 'create-network'): void;
  (e: 'copy-address', address: string): void;
  (e: 'show-depoyment-modal'): void;
}>();

const deployContract = () => {
  emit('show-depoyment-modal');
};

const shouldShowNetworkButton = computed(() => {
  return props.hasNetworks === false;
});

const createNetwork = () => {
  emit('create-network');
};
</script>

<template>
  <div class="deployment-panel">
    <div class="deploy-actions">
      <button
        v-if="shouldShowNetworkButton"
        class="deploy-button primary-button"
        @click="createNetwork"
        aria-label="Create a new network"
      >
        <span>Create Network First</span>
      </button>

      <button
        v-else-if="!isDeployed"
        class="deploy-button primary-button"
        :disabled="isDeploying || canDeploy === false"
        @click="deployContract()"
        aria-label="Deploy contract"
      >
        <LoadingSpinner v-if="isDeploying" size="small" />
        <span v-if="isDeploying">Deploying...</span>
        <span v-else>
          {{ 'Configure & Deploy' }}
        </span>
      </button>

      <div v-else class="redeploy-actions">
        <button
          class="deploy-button secondary-button"
          :disabled="isDeploying || canDeploy === false"
          @click="deployContract()"
          aria-label="Redeploy contract"
        >
          <LoadingSpinner v-if="isDeploying" size="small" />
          <span v-if="isDeploying">Deploying...</span>
          <span v-else>Redeploy</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deployment-panel {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--panel-bg);
  width: 280px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.deploy-actions {
  padding: 12px;
  display: flex;
  justify-content: center;
}

.deploy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  min-height: 48px;
  letter-spacing: 0.02em;
}

.primary-button {
  background-color: var(
    --vscode-button-background,
    var(--primary-color, #0078d4)
  );
  color: var(--vscode-button-foreground, white);
  border-color: var(--vscode-button-background, var(--primary-color, #0078d4));
  border-radius: 6px;
}

.primary-button:hover:not(:disabled) {
  background-color: var(
    --vscode-button-hoverBackground,
    var(--primary-hover, #106ebe)
  );
  border-color: var(
    --vscode-button-hoverBackground,
    var(--primary-hover, #106ebe)
  );
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.primary-button:active:not(:disabled) {
  background-color: var(
    --vscode-button-background,
    var(--primary-color, #0078d4)
  );
  transform: translateY(0);
}

.secondary-button {
  background-color: transparent;
  color: var(--vscode-foreground, var(--text-color));
  border-color: var(--vscode-input-border, var(--border-color));
  border-radius: 6px;
}

.secondary-button:hover:not(:disabled) {
  background-color: var(
    --vscode-list-hoverBackground,
    var(--hover-bg, rgba(255, 255, 255, 0.1))
  );
  border-color: var(--vscode-focusBorder, var(--primary-color, #0078d4));
  transform: translateY(-1px);
}

.secondary-button:active:not(:disabled) {
  transform: translateY(0);
}

.deploy-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.redeploy-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 16px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-pill.success {
  background-color: #10b981;
  color: white;
}

.status-pill.error {
  background-color: #ef4444;
  color: white;
}

.constructor-form {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  animation: slideDown 0.3s ease;
}

.constructor-heading {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-color);
}

.constructor-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.input-field label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
}

.param-type {
  color: var(--secondary-text);
  font-family: var(--vscode-editor-font-family, monospace);
  font-size: 12px;
  margin-left: 6px;
  padding: 2px 6px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  font-weight: normal;
}

.input-with-button {
  position: relative;
  width: 100%;
}

.text-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-size: 14px;
  transition: all 0.2s ease;
}

.text-input.with-button {
  padding-right: 36px;
}

.text-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 0, 120, 212), 0.25);
}

.text-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.paste-button {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 36px;
  background: transparent;
  border: none;
  border-left: 1px solid var(--border-color);
  color: var(--vscode-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition:
    opacity 0.2s,
    background-color 0.2s;
  border-radius: 0 6px 6px 0;
}

.paste-button:hover:not(:disabled) {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.05);
}

.paste-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--vscode-foreground);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  opacity: 0.7;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.constructor-actions {
  display: flex;
  gap: 10px;
}

.address-container {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  font-size: 13px;
  position: relative;
}

.address-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.address-label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 14px;
}

.address-value {
  font-family: var(--vscode-editor-font-family, monospace);
  word-break: break-all;
  font-size: 13px;
  background-color: var(--vscode-editor-background);
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.address-value:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.address-value:hover .copy-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.copy-tooltip {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background-color: var(--panel-bg);
  color: var(--text-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

.copy-button {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 4px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.copy-button:active {
  transform: translateY(0);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .deployment-panel {
    width: 100%;
  }

  .redeploy-actions {
    flex-direction: column;
    gap: 8px;
  }

  .status-pill {
    align-self: flex-start;
  }

  .paste-button {
    width: 32px;
  }

  .text-input.with-button {
    padding-right: 32px;
  }
}
</style>
