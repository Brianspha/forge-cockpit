<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { DeployContract, Function, TestFile } from '../../types';
  import WalletSelector from '../wallet/WalletSelector.vue';
  import { vscode } from '../../utils/vscode';

  const props = defineProps<{
    isOpen: boolean;
    contract: TestFile;
    constructorArgs: Function | null;
    nodeUrl: string;
    isDeploying: boolean;
    clipboardContent?: Record<string, string>;
    isParentLoading?: Record<string, boolean>;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'deploy', config: DeployContract): void;
    (e: 'paste-constructor-field', fieldId: string): void;
  }>();

  const constructorArgsValues = ref<any[]>([]);
  const error = ref('');

  const getConstructorFromABI = (abi: Array<Function>): Function | null => {
    if (!abi || !Array.isArray(abi)) return null;

    const constructor = abi.find(func => func.type === 'constructor');

    if (constructor && constructor.inputs && constructor.inputs.length > 0) {
      return constructor;
    }

    return null;
  };

  const actualConstructorArgs = computed(() => {
    if (props.constructorArgs) {
      return props.constructorArgs;
    }

    return getConstructorFromABI(props.contract.abi);
  });

  const hasConstructorArgs = computed(() => {
    return (
      actualConstructorArgs.value &&
      actualConstructorArgs.value.inputs &&
      actualConstructorArgs.value.inputs.length > 0
    );
  });

  function initializeConstructorArgs() {
    if (hasConstructorArgs.value && actualConstructorArgs.value?.inputs) {
      const newValues = actualConstructorArgs.value.inputs.map(input => {
        switch (input.type) {
          case 'string':
            return '';
          case 'bool':
            return false;
          case 'address':
            return '0x0000000000000000000000000000000000000000';
          default:
            if (input.type.includes('int')) {
              return '0';
            }
            return '';
        }
      });
      constructorArgsValues.value = newValues;

      applyClipboardContent();
    } else {
      constructorArgsValues.value = [];
    }
  }

  function applyClipboardContent() {
    if (!props.clipboardContent) return;

    Object.entries(props.clipboardContent).forEach(([fieldId, value]) => {
      if (fieldId.startsWith('constructorArg_')) {
        const index = parseInt(fieldId.replace('constructorArg_', ''));
        if (
          !isNaN(index) &&
          index >= 0 &&
          index < constructorArgsValues.value.length
        ) {
          constructorArgsValues.value[index] = value;
        }
      }
    });
  }

  watch(
    () => props.clipboardContent,
    newContent => {
      if (!newContent) return;
      applyClipboardContent();
    },
    { deep: true }
  );

  onMounted(() => {
    initializeConstructorArgs();
  });

  watch(
    () => props.isOpen,
    newVal => {
      if (newVal) {
        initializeConstructorArgs();
        error.value = '';
      }
    }
  );

  watch(
    () => actualConstructorArgs.value,
    () => {
      initializeConstructorArgs();
    }
  );

  const deployContract = () => {
    error.value = '';
    if (hasConstructorArgs.value) {
      const allArgsValid = constructorArgsValues.value.every(
        val => val !== undefined && val !== null && val !== ''
      );

      if (!allArgsValid) {
        error.value = 'Please fill in all constructor arguments';
        return;
      }
    }

    emit('deploy', {
      constructorArgs: constructorArgsValues.value,
      nodeUrl: props.nodeUrl,
      contractName: props.contract.fileName,
      from: '',
      msgSender: '',
      bytecode: props.contract.bytecode,
      abi: props.contract.abi,
    } as DeployContract);
  };

  const close = () => {
    emit('close');
  };

  const formatInputType = (type: string) => {
    return type.replace(/uint(\d+)/, 'uint $1').replace(/int(\d+)/, 'int $1');
  };

  const getInputPlaceholder = (type: string | string[]) => {
    if (type === 'address') {
      return '0x...';
    } else if (type.includes('int')) {
      return '0';
    } else if (type === 'string') {
      return 'Text value';
    } else if (type === 'bool') {
      return 'true / false';
    }
    return '';
  };

  const handlePasteConstructorArg = (index: number) => {
    const fieldId = `constructorArg_${index}`;
    emit('paste-constructor-field', fieldId);
  };

  const isConstructorFieldLoading = (index: number) => {
    const fieldId = `constructorArg_${index}`;
    return props.isParentLoading?.[fieldId] || false;
  };

  const contractName = computed(() => props.contract.fileName);
</script>

<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Deploy Contract: {{ contractName }}</h2>
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
        <div class="network-info">
          <div class="network-label">Deploying to:</div>
          <div class="network-url">{{ nodeUrl }}</div>
        </div>

        <div class="wallet-section">
          <h3>Select Deployment Wallet</h3>
          <p class="section-description">
            Choose the wallet to use for deploying this contract:
          </p>
          <div class="wallet-selector-container">
            <WalletSelector tabId="deploymentModal" :nodeUrl="nodeUrl" />
          </div>
        </div>

        <div v-if="hasConstructorArgs" class="constructor-args">
          <h3>Constructor Arguments</h3>
          <p class="section-description">
            This contract requires the following constructor arguments:
          </p>

          <div
            class="form-group"
            v-for="(input, index) in actualConstructorArgs?.inputs"
            :key="index"
          >
            <div class="input-header">
              <label :for="`arg-${index}`">
                {{ input.name || `Argument ${index + 1}` }}
              </label>
              <span class="input-type">{{ formatInputType(input.type) }}</span>
            </div>

            <div
              v-if="!input.type.startsWith('bool')"
              class="input-with-button"
            >
              <input
                :id="`arg-${index}`"
                v-model="constructorArgsValues[index]"
                class="text-input with-button"
                :type="input.type.includes('int') ? 'number' : 'text'"
                :placeholder="getInputPlaceholder(input.type)"
                :disabled="isDeploying || isConstructorFieldLoading(index)"
              />
              <button
                type="button"
                class="paste-button"
                @click="handlePasteConstructorArg(index)"
                :disabled="isDeploying || isConstructorFieldLoading(index)"
                :title="`Paste value for ${input.name || `Argument ${index + 1}`}`"
                :aria-label="`Paste value for ${input.name || `Argument ${index + 1}`}`"
              >
                <div
                  v-if="isConstructorFieldLoading(index)"
                  class="button-spinner"
                ></div>
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

            <select
              v-else
              :id="`arg-${index}`"
              v-model="constructorArgsValues[index]"
              class="select-input"
              :disabled="isDeploying"
            >
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>

            <div class="field-hint">
              {{ `Enter value for ${input.name || `Argument ${index + 1}`}` }}
            </div>
          </div>
        </div>

        <div v-if="isDeploying" class="deployment-progress">
          <div class="progress-spinner"></div>
          <p>Deploying contract... This may take a few moments.</p>
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
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="close" :disabled="isDeploying">
          Close
        </button>
        <button
          class="deploy-button"
          @click="deployContract"
          :disabled="isDeploying"
        >
          <div v-if="isDeploying" class="button-spinner white"></div>
          <span v-else>Deploy Contract</span>
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
    max-width: 650px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    position: relative;
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

  .network-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    margin-bottom: 20px;
    background-color: var(
      --vscode-inputValidation-infoBackground,
      rgba(59, 130, 246, 0.1)
    );
    border: 1px solid
      var(--vscode-inputValidation-infoBorder, rgba(59, 130, 246, 0.5));
    border-radius: 4px;
  }

  .network-label {
    font-weight: 600;
    font-size: 14px;
  }

  .network-url {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 14px;
    word-break: break-all;
  }

  .constructor-args h3,
  .wallet-section h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--vscode-foreground);
  }

  .section-description {
    color: var(--vscode-descriptionForeground);
    font-size: 14px;
    margin-bottom: 16px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .input-type {
    font-size: 12px;
    color: var(--vscode-descriptionForeground);
    padding: 2px 8px;
    background-color: var(--vscode-badge-background);
    border-radius: 4px;
    font-family: monospace;
  }

  .input-with-button {
    position: relative;
    width: 100%;
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

  .text-input.with-button {
    padding-right: 40px;
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

  .paste-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .select-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--vscode-input-border);
    border-radius: 4px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-family: var(--vscode-font-family);
    font-size: 14px;
    cursor: pointer;
  }

  .select-input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .field-hint {
    margin-top: 4px;
    font-size: 12px;
    color: var(--vscode-descriptionForeground);
  }

  .constructor-args {
    margin-bottom: 24px;
  }

  .wallet-section {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px dashed var(--vscode-input-border);
    position: relative;
  }

  .wallet-selector-container {
    position: relative;
    width: 100%;
    z-index: 10;
  }

  .wallet-selector-container :deep(.dropdown-container),
  .wallet-selector-container :deep(.dropdown-menu) {
    width: 100%;
    max-width: 100%;
  }

  .wallet-selector-container :deep(.dropdown-menu) {
    max-height: 200px;
    overflow-y: auto;
    position: absolute;
    left: 0;
    right: 0;
  }

  .wallet-selector-container :deep(.select-display) {
    width: 100%;
  }

  .wallet-selector-container :deep(.search-container) {
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid var(--vscode-dropdown-border, #444);
  }

  .wallet-selector-container :deep(.search-icon) {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--vscode-input-placeholderForeground);
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }

  .wallet-selector-container :deep(.search-input) {
    width: 100%;
    padding: 6px 8px 6px 32px;
    border: 1px solid var(--vscode-input-border);
    border-radius: 4px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
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

  .deployment-progress {
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

  .deployment-progress p {
    margin: 0;
    color: var(--vscode-foreground);
    font-size: 14px;
  }

  .modal-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--vscode-widget-border);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .cancel-button,
  .deploy-button {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 100px;
  }

  .cancel-button {
    background-color: transparent;
    color: var(--vscode-foreground);
    border-color: var(--vscode-input-border, var(--vscode-widget-border));
  }

  .cancel-button:hover:not(:disabled) {
    background-color: var(
      --vscode-list-hoverBackground,
      rgba(255, 255, 255, 0.1)
    );
    border-color: var(--vscode-focusBorder, var(--vscode-input-border));
  }

  .deploy-button {
    background-color: var(
      --vscode-button-background,
      var(--primary-color, #0078d4)
    );
    color: var(--vscode-button-foreground, white);
    border-color: var(
      --vscode-button-background,
      var(--primary-color, #0078d4)
    );
  }

  .deploy-button:hover:not(:disabled) {
    background-color: var(
      --vscode-button-hoverBackground,
      var(--primary-hover, #106ebe)
    );
    border-color: var(
      --vscode-button-hoverBackground,
      var(--primary-hover, #106ebe)
    );
  }

  .cancel-button:disabled,
  .deploy-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    .modal-container {
      width: 95%;
      max-height: 95vh;
    }

    .wallet-selector-container :deep(.dropdown-menu) {
      max-height: 150px;
    }
  }

  @media (max-width: 480px) {
    .modal-header h2 {
      padding-right: 24px;
      font-size: 16px;
    }

    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .input-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .input-type {
      align-self: flex-start;
    }

    .network-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .wallet-selector-container :deep(.wallet-name),
    .wallet-selector-container :deep(.wallet-address) {
      white-space: normal;
      word-break: break-all;
    }
  }
</style>
