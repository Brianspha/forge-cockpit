<script setup lang="ts">
import { ref, computed, watch, defineProps } from 'vue';
import {
  AnvilInstance,
  DeployInputType,
  ForkInfo,
  NetworkType,
} from '../../types';
import { isNodeUrl, isValidPort } from '../../utils';

const pendingPasteFields = ref<Set<string>>(new Set());
const props = defineProps<{
  isOpen: boolean;
  anvilInstances: AnvilInstance[];
  clipboardContent?: {
    nodeUrl?: string;
    port?: string;
  };
  isParentLoading?: {
    nodeUrl?: boolean;
    port?: boolean;
  };
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'paste-field', fieldName: DeployInputType): void;
  (e: 'create-anvil-instance', config: ForkInfo): void;
}>();

const nodeType = ref<NetworkType>('default');
const nodeUrl = ref('');
const port = ref('8545');
const error = ref<string>('');
const success = ref<string>('');
const isCreating = ref(false);

const resetModalState = () => {
  nodeType.value = 'default';
  nodeUrl.value = '';
  port.value = '8545';
  error.value = '';
  success.value = '';
  isCreating.value = false;
  pendingPasteFields.value.clear();
};

watch(
  () => props.isOpen,
  (newVal, oldVal) => {
    if (newVal && !oldVal) {
      resetModalState();
    }
  }
);

watch(
  () => props.clipboardContent,
  newContent => {
    if (!newContent) return;
    if (newContent.nodeUrl && pendingPasteFields.value.has('nodeUrl')) {
      nodeUrl.value = newContent.nodeUrl;
      pendingPasteFields.value.delete('nodeUrl');
    }
    if (newContent.port && pendingPasteFields.value.has('port')) {
      port.value = newContent.port;
      pendingPasteFields.value.delete('port');
    }
  },
  { deep: true }
);

const isNodeURLLoading = computed(
  () => props.isParentLoading?.nodeUrl || false
);

const isPortPasteLoading = computed(() => props.isParentLoading?.port || false);

const pasteField = (fieldName: DeployInputType) => {
  pendingPasteFields.value.add(fieldName);
  emit('paste-field', fieldName);
};

const createInstance = () => {
  error.value = '';
  success.value = '';

  if (nodeType.value === 'fork' && !isNodeUrl(nodeUrl.value)) {
    error.value = 'A valid node URL is required for forking';
    return;
  }

  const portNumber = parseInt(port.value) ?? 0;
  if (!isValidPort(portNumber)) {
    error.value = 'Please enter a valid port number between 1024 and 65535';
    return;
  }

  const portInUse = props.anvilInstances.some(
    instance => instance.port === port.value && instance.status === 'running'
  );

  if (portInUse) {
    error.value = `Port ${port.value} is already in use by another Anvil instance`;
    return;
  }

  isCreating.value = true;
  emit('create-anvil-instance', {
    nodeUrl: nodeType.value === 'fork' ? nodeUrl.value : '',
    port: port.value.toString(),
    useExisting: nodeType.value !== 'fork',
  } as ForkInfo);
  setTimeout(() => {
    isCreating.value = false;
  }, 10000);
};

const handleCreationSuccess = () => {
  error.value = '';
  isCreating.value = false;
  success.value = `Anvil instance created successfully on port ${port.value}!`;

  setTimeout(() => {
    resetModalState();
    emit('close');
  }, 1500);
};

const handleCreationFailure = (message: string | boolean | any) => {
  isCreating.value = false;
  success.value = '';

  if (typeof message === 'string' && message.trim().length > 0) {
    error.value = message.trim();
  } else if (typeof message === 'boolean' || !message) {
    error.value = 'Failed to create Anvil instance. Please try again.';
  } else {
    error.value =
      'An unexpected error occurred while creating the Anvil instance.';
  }
};

defineExpose({
  handleCreationSuccess,
  handleCreationFailure,
});

const close = () => {
  resetModalState();
  emit('close');
};

const getWarningMessage = computed(() => {
  switch (nodeType.value) {
    case 'default':
      return 'This will create a new local Anvil instance on the specified port. Ensure the port is not already in use.';
    case 'fork':
      return 'This will create a forked Anvil instance of the provided network. Make sure your node URL is correct and accessible.';
    default:
      return 'Creating an Anvil instance will allow you to deploy and interact with smart contracts.';
  }
});
</script>

<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Create Anvil Instance</h2>
        <button class="close-button" @click="close" title="Close">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="alert-message">
          <div class="alert-icon">ℹ️</div>
          <div class="alert-content">
            <p><strong>Note:</strong> {{ getWarningMessage }}</p>
          </div>
        </div>

        <div v-if="success && success.length > 0" class="success-message">
          <div class="success-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="success-text">{{ success }}</div>
        </div>

        <div class="node-type-options">
          <h3>Node Type</h3>
          <div class="option-tabs">
            <button
              class="option-tab"
              :class="{ active: nodeType === 'default' }"
              @click="nodeType = 'default'"
              :disabled="isCreating"
            >
              <span class="tab-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              </span>
              Default
            </button>
            <button
              class="option-tab"
              :class="{ active: nodeType === 'fork' }"
              @click="nodeType = 'fork'"
              :disabled="isCreating"
            >
              <span class="tab-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="18" r="3"></circle>
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="18" cy="6" r="3"></circle>
                  <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
                  <path d="M12 12v3"></path>
                </svg>
              </span>
              Fork
            </button>
          </div>
        </div>

        <div v-if="nodeType === 'fork'" class="form-group">
          <label for="fork-url">Node URL</label>
          <div class="input-with-button">
            <input
              type="text"
              id="fork-url"
              v-model="nodeUrl"
              class="text-input with-button"
              placeholder="https://mainnet.infura.io/v3/YOUR_API_KEY"
              :disabled="isNodeURLLoading || isCreating"
            />
            <button
              type="button"
              class="paste-button"
              @click="pasteField('nodeUrl')"
              :disabled="isNodeURLLoading || isCreating"
              title="Paste from clipboard"
            >
              <div v-if="isNodeURLLoading" class="button-spinner"></div>
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                ></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </button>
          </div>
          <div class="field-hint">URL of the Ethereum node to fork from</div>
        </div>

        <div class="form-group">
          <label for="port">Port</label>
          <div class="input-with-button">
            <input
              type="number"
              min="1024"
              max="65535"
              id="port"
              v-model="port"
              class="text-input with-button"
              placeholder="8545"
              :disabled="isPortPasteLoading || isCreating"
            />
            <button
              type="button"
              class="paste-button"
              @click="pasteField('port')"
              :disabled="isPortPasteLoading || isCreating"
              title="Paste from clipboard"
            >
              <div v-if="isPortPasteLoading" class="button-spinner"></div>
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                ></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </button>
          </div>
          <div class="field-hint">
            Port for the Anvil instance (must be unused)
          </div>
        </div>
        <div v-if="error && error.length > 0" class="error-message">
          <div class="error-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div class="error-text">{{ error }}</div>
        </div>
        <div v-if="props.anvilInstances.length > 0" class="running-instances">
          <h4>Running Instances</h4>
          <ul class="instance-list">
            <li
              v-for="instance in props.anvilInstances.filter(
                i => i.status === 'running'
              )"
              :key="instance.port"
              class="instance-item"
            >
              <div class="instance-port">
                http://localhost:{{ instance.port }}
              </div>
            </li>
          </ul>
        </div>

        <div v-if="isCreating" class="creation-progress">
          <div class="progress-spinner"></div>
          <p>Creating Anvil instance... This may take a few moments.</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="close" :disabled="isCreating">
          Close
        </button>
        <button
          class="create-button"
          @click="createInstance"
          :disabled="isCreating || (nodeType === 'fork' && !nodeUrl) || !port"
        >
          <div v-if="isCreating" class="button-spinner white"></div>
          <span v-else>Create Anvil Instance</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: var(--vscode-editor-background);
  border: 1px solid var(--vscode-widget-border);
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-widget-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vscode-foreground);
}

.close-button {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: 60vh;
}

.alert-message {
  display: flex;
  gap: 12px;
  padding: 12px;
  background-color: var(
    --vscode-inputValidation-infoBackground,
    rgba(59, 130, 246, 0.1)
  );
  border: 1px solid
    var(--vscode-inputValidation-infoBorder, rgba(59, 130, 246, 0.5));
  border-radius: 4px;
  margin-bottom: 20px;
}

.alert-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.alert-content p {
  margin: 0;
  font-size: 14px;
  color: var(--vscode-foreground);
}

.success-message {
  margin: 16px 0;
  padding: 12px;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.5);
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-icon {
  color: var(--success-color, #10b981);
}

.success-text {
  color: var(--vscode-foreground);
  font-size: 14px;
}

.node-type-options {
  margin-bottom: 24px;
}

.node-type-options h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--vscode-foreground);
}

.option-tabs {
  display: flex;
  gap: 8px;
}

.option-tab {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--vscode-button-border);
  border-radius: 6px;
  background-color: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.option-tab:hover:not(:disabled) {
  background-color: var(--vscode-button-secondaryHoverBackground);
}

.option-tab.active {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border-color: var(--vscode-button-background);
}

.option-tab:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tab-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--vscode-foreground);
}

.text-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-family: var(--vscode-font-family);
  font-size: 14px;
}

.text-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.input-with-button {
  position: relative;
  width: 100%;
}

.text-input.with-button {
  padding-right: 40px;
}

.paste-button {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 40px;
  background: transparent;
  border: none;
  border-left: 1px solid var(--vscode-input-border);
  color: var(--vscode-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition:
    opacity 0.2s,
    background-color 0.2s;
}

.paste-button:hover:not(:disabled) {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.05);
}

.field-hint {
  margin-top: 4px;
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
}

.running-instances {
  margin-top: 24px;
  margin-bottom: 16px;
}

.running-instances h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vscode-foreground);
}

.instance-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  max-height: 120px;
  overflow-y: auto;
}

.instance-item {
  padding: 8px 12px;
  border-bottom: 1px solid var(--vscode-input-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.instance-item:last-child {
  border-bottom: none;
}

.instance-name {
  font-weight: 600;
}

.instance-port {
  font-family: var(--vscode-editor-font-family, monospace);
  color: var(--vscode-descriptionForeground);
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background-color: var(--vscode-inputValidation-errorBackground);
  border: 1px solid var(--vscode-inputValidation-errorBorder);
  color: var(--vscode-inputValidation-errorForeground);
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.error-icon {
  color: var(--vscode-inputValidation-errorForeground);
  margin-top: 2px;
  flex-shrink: 0;
}

.error-text {
  flex: 1;
  font-size: 14px;
}

.creation-progress {
  margin-top: 20px;
  padding: 16px;
  background-color: var(--vscode-input-background);
  border: 1px solid var(--vscode-button-background);
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.progress-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vscode-foreground);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 12px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.creation-progress p {
  margin: 0;
  color: var(--vscode-foreground);
  font-size: 14px;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--vscode-foreground);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  opacity: 0.7;
}

.button-spinner.white {
  border-color: white;
  border-top-color: transparent;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--vscode-widget-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button,
.create-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 100px;
}

.cancel-button {
  background-color: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}

.cancel-button:hover:not(:disabled) {
  background-color: var(--vscode-button-secondaryHoverBackground);
}

.create-button {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.create-button:hover:not(:disabled) {
  background-color: var(--vscode-button-hoverBackground);
}

.cancel-button:disabled,
.create-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .option-tabs {
    flex-direction: column;
  }

  .option-tab {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .instance-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
