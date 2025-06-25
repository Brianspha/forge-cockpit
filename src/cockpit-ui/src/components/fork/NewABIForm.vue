<script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue';
  import type { AbiFormData, AnvilInstance } from '../../types/index';
  import { isValidAddress } from '../../utils';

  const props = defineProps<{
    formData: AbiFormData;
    selectedForkId: string;
    availableForks: AnvilInstance[];
    isLoading: boolean;
    isPasteAddressLoading: boolean;
    isNodeURLLoading: boolean;
    isPortPasteLoading: boolean;
    forkError: string;
    isDownloadingAbi?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'paste-field', fieldName: string): void;
    (e: 'paste-abi'): void;
    (e: 'upload-file', event: Event): void;
    (e: 'connect'): void;
    (e: 'toggle-existing-node', value: boolean): void;
    (e: 'update:selectedForkId', value: string): void;
    (e: 'download-abi'): void;
  }>();

  const pasteField = (fieldName: string) => {
    emit('paste-field', fieldName);
  };

  const pasteAbi = () => {
    emit('paste-abi');
  };

  const uploadFile = (event: Event) => {
    emit('upload-file', event);
  };

  const connect = () => {
    emit('connect');
  };

  const toggleExistingNode = (value: boolean) => {
    emit('toggle-existing-node', value);
  };

  const updateSelectedForkId = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('update:selectedForkId', target.value);
  };

  const downloadAbi = () => {
    emit('download-abi');
  };

  const canDownloadAbi = computed(() => {
    return (
      isValidAddress(props.formData.contractAddress) && !props.isDownloadingAbi
    );
  });

  const isConnectDisabled = computed(() => {
    return (
      props.isLoading ||
      !props.formData.contractAddress ||
      !props.formData.customAbi ||
      (!props.formData.useExistingNode &&
        (!props.formData.nodeUrl || !props.formData.port)) ||
      (props.formData.useExistingNode && !props.selectedForkId)
    );
  });
</script>

<template>
  <div class="new-abi-form">
    <h2 class="section-title">Import ABI & Connect to Contract</h2>
    <p class="section-description">
      Connect to a node and interact with any contract by providing its ABI.
    </p>

    <div class="form-container">
      <div class="node-type-selection">
        <div class="function-tabs">
          <button
            class="function-tab"
            :class="{ active: !formData.useExistingNode }"
            @click="toggleExistingNode(false)"
            :aria-pressed="!formData.useExistingNode"
          >
            <span class="pill-icon fork-icon"></span>
            Create Fork
          </button>
          <button
            class="function-tab"
            :class="{ active: formData.useExistingNode }"
            @click="toggleExistingNode(true)"
            :aria-pressed="formData.useExistingNode"
          >
            <span class="pill-icon connect-icon"></span>
            Use Existing Node
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="node-url">
          {{ formData.useExistingNode ? 'Select Fork' : 'Node URL' }}
        </label>

        <div v-if="formData.useExistingNode" class="select-container">
          <select
            id="fork-select"
            :value="selectedForkId"
            @change="updateSelectedForkId"
            class="select-input"
            :disabled="isLoading"
          >
            <option value="" disabled>Select a fork</option>
            <option
              v-for="fork in availableForks"
              :key="fork.port"
              :value="fork.port"
            >
              {{ fork.nodeUrl }}
            </option>
          </select>
        </div>

        <div v-else class="input-with-embedded-button">
          <input
            type="text"
            id="node-url"
            v-model="formData.nodeUrl"
            class="text-input with-button"
            placeholder="https://mainnet.infura.io/v3/YOUR_API_KEY"
            :disabled="isNodeURLLoading"
          />
          <button
            type="button"
            class="embedded-paste-button"
            @click="pasteField('nodeUrl')"
            :disabled="isNodeURLLoading"
            title="Paste from clipboard"
          >
            <span v-if="isNodeURLLoading" class="button-spinner small"></span>
            <span v-else class="paste-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                ></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </span>
          </button>
        </div>

        <div class="field-hint">
          {{
            formData.useExistingNode
              ? 'Choose an existing fork to connect through'
              : 'URL of the Ethereum node to fork'
          }}
        </div>
      </div>

      <div class="form-group" v-if="!formData.useExistingNode">
        <label for="port">Port</label>
        <div class="input-with-embedded-button">
          <input
            type="number"
            min="1024"
            max="65535"
            id="port"
            v-model="formData.port"
            class="text-input with-button"
            placeholder="e.g. 8545"
            :disabled="isPortPasteLoading"
          />
          <button
            type="button"
            class="embedded-paste-button"
            @click="pasteField('port')"
            :disabled="isPortPasteLoading"
            title="Paste from clipboard"
          >
            <span v-if="isPortPasteLoading" class="button-spinner small"></span>
            <span v-else class="paste-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                ></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </span>
          </button>
        </div>
        <div class="field-hint">The port to use for the forked node</div>
      </div>

      <div class="form-group">
        <label for="contract-address">Contract Address</label>
        <div class="input-with-embedded-button">
          <input
            type="text"
            id="contract-address"
            v-model="formData.contractAddress"
            class="text-input with-button"
            :class="{
              'invalid-address':
                formData.contractAddress &&
                !isValidAddress(props.formData.contractAddress),
            }"
            placeholder="0x..."
            :disabled="isPasteAddressLoading"
          />
          <button
            type="button"
            class="embedded-paste-button"
            @click="pasteField('contractAddress')"
            :disabled="isPasteAddressLoading"
            title="Paste from clipboard"
          >
            <span
              v-if="isPasteAddressLoading"
              class="button-spinner small"
            ></span>
            <span v-else class="paste-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                ></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </span>
          </button>
        </div>
        <div class="field-hint">
          The address of the contract you want to interact with
          <span
            v-if="
              formData.contractAddress &&
              !isValidAddress(props.formData.contractAddress)
            "
            class="invalid-hint"
          >
            Please enter a valid Ethereum address
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="contract-abi">Contract ABI</label>
        <div class="abi-input-container">
          <textarea
            id="contract-abi"
            v-model="formData.customAbi"
            class="text-area"
            placeholder="Contract ABI in JSON format..."
            :disabled="isLoading"
          ></textarea>

          <div class="abi-actions">
            <button
              type="button"
              class="action-button clipboard-button"
              @click="pasteAbi"
              :disabled="isLoading"
              title="Paste from clipboard"
            >
              <span v-if="isLoading" class="button-content">
                <span class="button-spinner"></span>
                Pasting...
              </span>
              <span v-else class="button-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="button-icon"
                >
                  <path
                    d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                  ></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                Paste
              </span>
            </button>

            <button
              type="button"
              class="action-button upload-button"
              :disabled="isLoading"
              title="Upload JSON file"
            >
              <input
                type="file"
                id="abi-file-upload"
                class="file-input"
                accept=".json,application/json"
                @change="uploadFile"
                :disabled="isLoading"
              />
              <span class="button-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="button-icon"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload
              </span>
            </button>

            <button
              type="button"
              class="action-button download-button"
              @click="downloadAbi"
              :disabled="!canDownloadAbi"
              :title="
                canDownloadAbi
                  ? 'Download ABI from ABIData'
                  : 'Enter a valid contract address first'
              "
            >
              <span v-if="isDownloadingAbi" class="button-content">
                <span class="button-spinner"></span>
                Downloading...
              </span>
              <span v-else class="button-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="button-icon"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Fetch ABI
              </span>
            </button>
          </div>
        </div>
        <div class="field-hint">
          Provide the contract's ABI by pasting, uploading a JSON file, or
          fetching from ABIData
        </div>
      </div>

      <div
        v-if="formData.validationWarnings.length > 0"
        class="validation-warnings"
      >
        <div class="warning-header">
          <span class="warning-icon">⚠️</span>
          <span>ABI Validation Warnings</span>
        </div>
        <ul class="warning-list">
          <li
            v-for="(warning, index) in formData.validationWarnings"
            :key="index"
          >
            {{ warning }}
          </li>
        </ul>
      </div>

      <div v-if="forkError" class="error-message fork-error">
        <div class="error-header">
          <span class="error-icon">❌</span>
          <span>
            {{ formData.useExistingNode ? 'Connection Error' : 'Fork Error' }}
          </span>
        </div>
        <p>{{ forkError }}</p>
      </div>

      <div v-else-if="formData.error" class="error-message">
        {{ formData.error }}
      </div>

      <div class="form-actions">
        <button
          class="action-button primary-button"
          @click="connect"
          :disabled="isConnectDisabled"
        >
          <span v-if="isLoading" class="button-content">
            <span class="button-spinner"></span>
            Connecting...
          </span>
          <span v-else>
            {{
              formData.useExistingNode
                ? 'Connect through Fork'
                : 'Create Fork & Connect'
            }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .new-abi-form {
    max-width: 800px;
    margin: 0 auto;
    background-color: var(--vscode-editor-background);
    color: var(--vscode-foreground);
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--vscode-foreground);
  }

  .section-description {
    color: var(--vscode-descriptionForeground);
    margin-bottom: 1.5rem;
  }

  .form-container {
    background-color: var(--vscode-editor-background);
    border: 1px solid var(--vscode-widget-border);
    border-radius: 4px;
    padding: 1.5rem;
  }

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
    border: 1px solid var(--vscode-button-border, var(--vscode-widget-border));
    background-color: var(--vscode-button-secondaryBackground);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--vscode-button-secondaryForeground);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    box-shadow: var(--vscode-widget-shadow, 0 1px 2px rgba(0, 0, 0, 0.1));
    position: relative;
    overflow: hidden;
  }

  .function-tab.active {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border-color: var(--vscode-button-background);
  }

  .function-tab:hover:not(.active) {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }

  .function-tab:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
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

  .fork-icon::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='18' r='3'%3E%3C/circle%3E%3Ccircle cx='6' cy='6' r='3'%3E%3C/circle%3E%3Ccircle cx='18' cy='6' r='3'%3E%3C/circle%3E%3Cpath d='M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9'%3E%3C/path%3E%3Cpath d='M12 12v3'%3E%3C/path%3E%3C/svg%3E");
    vertical-align: middle;
    margin-right: 8px;
  }

  .connect-icon::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='2' width='14' height='20' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='12' y1='18' x2='12.01' y2='18'%3E%3C/line%3E%3C/svg%3E");
    vertical-align: middle;
    margin-right: 8px;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--vscode-foreground);
  }

  .select-container {
    position: relative;
    width: 100%;
  }

  .select-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--vscode-dropdown-border, var(--vscode-input-border));
    border-radius: 4px;
    background-color: var(--vscode-dropdown-background);
    color: var(--vscode-dropdown-foreground);
    font-family: var(--vscode-font-family);
    font-size: 0.9rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .select-input:focus {
    outline: none;
    border-color: var(--vscode-focusBorder);
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
  }

  .select-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
  }

  .select-container::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--vscode-foreground);
    pointer-events: none;
  }

  .input-with-embedded-button {
    position: relative;
    width: 100%;
  }

  .text-input.with-button {
    padding-right: 40px;
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--vscode-input-border);
    border-radius: 4px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-family: var(--vscode-font-family);
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }

  .text-input.with-button:focus {
    outline: none;
    border-color: var(--vscode-focusBorder);
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
  }

  .text-input.with-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
  }

  .text-input.invalid-address {
    border-color: var(--vscode-inputValidation-errorBorder);
    background-color: var(
      --vscode-inputValidation-errorBackground,
      rgba(245, 101, 101, 0.05)
    );
  }

  .embedded-paste-button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 36px;
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

  .embedded-paste-button:hover:not(:disabled) {
    opacity: 1;
    background-color: var(
      --vscode-toolbar-hoverBackground,
      rgba(255, 255, 255, 0.1)
    );
  }

  .embedded-paste-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: var(--vscode-disabledForeground);
  }

  .text-area {
    width: 100%;
    min-height: 150px;
    padding: 0.75rem;
    border: 1px solid var(--vscode-input-border);
    border-radius: 4px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 0.9rem;
    resize: vertical;
    transition: border-color 0.2s;
  }

  .text-area:focus {
    outline: none;
    border-color: var(--vscode-focusBorder);
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
  }

  .text-area:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
  }

  .field-hint {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--vscode-descriptionForeground);
  }

  .invalid-hint {
    color: var(--vscode-inputValidation-errorForeground);
    display: block;
    margin-top: 0.25rem;
  }

  .abi-input-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .abi-actions {
    display: flex;
    gap: 8px;
  }

  .action-button {
    height: 36px;
    padding: 0 16px;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .clipboard-button,
  .upload-button,
  .download-button {
    flex: 1;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    position: relative;
  }

  .clipboard-button:hover:not(:disabled),
  .upload-button:hover:not(:disabled),
  .download-button:hover:not(:disabled),
  .primary-button:hover:not(:disabled) {
    background-color: var(--vscode-button-hoverBackground);
  }

  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }

  .button-icon {
    flex-shrink: 0;
  }

  .file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }

  .button-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--vscode-foreground, rgba(255, 255, 255, 0.3));
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .button-spinner.small {
    width: 12px;
    height: 12px;
    border-width: 1.5px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .validation-warnings {
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background-color: var(--vscode-inputValidation-warningBackground);
    border-left: 3px solid var(--vscode-inputValidation-warningBorder);
    border-radius: 4px;
  }

  .warning-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(
      --vscode-inputValidation-warningForeground,
      var(--vscode-foreground)
    );
  }

  .warning-list {
    margin: 0;
    padding-left: 2rem;
    font-size: 0.9rem;
    color: var(--vscode-foreground);
  }

  .warning-list li {
    margin-bottom: 0.25rem;
  }

  .error-message {
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background-color: var(--vscode-inputValidation-errorBackground);
    border-left: 3px solid var(--vscode-inputValidation-errorBorder);
    color: var(--vscode-inputValidation-errorForeground);
    border-radius: 4px;
  }

  .fork-error {
    background-color: var(--vscode-inputValidation-errorBackground);
    border-left: 3px solid var(--vscode-inputValidation-errorBorder);
    border-radius: 4px;
  }

  .error-header {
    display: flex;
    align-items: center;
    font-weight: 600;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
    color: var(--vscode-inputValidation-errorForeground);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-bottom: 5%;
  }

  .primary-button {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
  }

  .action-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
  }

  @media (max-width: 768px) {
    .abi-actions {
      flex-direction: column;
    }

    .form-actions {
      flex-direction: column;
    }

    .form-actions button {
      width: 100%;
    }

    .function-tabs {
      justify-content: center;
    }

    .function-tab {
      flex: 1;
      min-width: 120px;
    }
  }

  @media (max-width: 480px) {
    .new-abi-form {
      padding: 0.5rem;
    }

    .form-container {
      padding: 1rem;
    }

    .function-tabs {
      gap: 0.25rem;
    }

    .function-tab {
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
    }
  }
</style>
