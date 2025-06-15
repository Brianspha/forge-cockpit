<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { isValidAddress } from '../../utils/index';
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
  isPasting: boolean;
  paste: Function;
  activeWallet: string;
}>();

const emit = defineEmits<{
  (e: 'import', address: string): void;
  (e: 'close'): void;
}>();

const modalRef = ref(null);
const validationError = ref('');
const isImporting = ref(false);

const validateAddress = (): boolean => {
  if (!props.activeWallet.trim()) {
    validationError.value = 'Address is required';
    return false;
  }

  if (!isValidAddress(props.activeWallet.trim())) {
    validationError.value = 'Invalid Ethereum address format';
    return false;
  }

  validationError.value = '';
  return true;
};

const handleImport = () => {
  isImporting.value = true;
  if (validateAddress()) {
    emit('import', props.activeWallet.trim());
    isImporting.value = false;
  } else {
    isImporting.value = false;
  }
};

const closeModal = () => {
  emit('close');
};

onClickOutside(modalRef, event => {
  if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
    closeModal();
  }
});

const handleKeyDown = (event: any) => {
  if (event.key === 'Escape') {
    closeModal();
  } else if (event.key === 'Enter' && !isImporting.value) {
    handleImport();
  }
};

const onAddressChange = (event: any) => {
  if (validateAddress()) {
    emit('import', event.target.value);
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);

  const input = modalRef.value?.querySelector('input');
  if (input) {
    input.focus();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container" ref="modalRef">
      <div class="modal-header">
        <h3 class="modal-title">Import Wallet</h3>
        <button class="modal-close" @click="closeModal" aria-label="Close">
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="wallet-address">Ethereum Address</label>
          <div class="input-with-paste">
            <input
              type="text"
              id="wallet-address"
              class="text-input"
              :class="{ error: validationError }"
              placeholder="0x..."
              @change="onAddressChange"
              @input="validateAddress"
              @click.stop
              :value="props.activeWallet"
              aria-describedby="address-hint"
            />
            <button
              type="button"
              class="paste-button"
              @click.stop="props.paste()"
              :disabled="props.isPasting"
              :class="{ pasting: props.isPasting }"
              aria-label="Paste from clipboard"
              title="Paste from clipboard"
            >
              <div class="spinner-container">
                <span v-if="props.isPasting" class="spinner-small"></span>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
              </div>
              <span class="paste-text">Paste</span>
            </button>
          </div>
          <div v-if="validationError" class="validation-error" role="alert">
            {{ validationError }}
          </div>
        </div>

        <div class="address-hint" id="address-hint">
          Enter a valid Ethereum address (e.g.,
          0x71C7656EC7ab88b098defB751B7401B5f6d8976F)
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="cancel-button"
          @click="closeModal"
          :disabled="isImporting"
          type="button"
        >
          Cancel
        </button>
        <button
          class="import-button"
          @click="handleImport"
          :disabled="isImporting || !props.activeWallet.trim()"
          type="button"
        >
          <span v-if="isImporting" class="spinner"></span>
          <span>{{ isImporting ? 'Importing...' : 'Import' }}</span>
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
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.modal-container {
  width: 100%;
  max-width: 420px;
  background-color: var(--vscode-editor-background);
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: modal-appear 0.2s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-widget-border);
  background-color: var(--vscode-titleBar-activeBackground, rgba(0, 0, 0, 0.1));
}

.modal-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vscode-foreground);
}

.modal-close {
  background: none;
  border: none;
  color: var(--vscode-icon-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: var(
    --vscode-toolbar-hoverBackground,
    rgba(255, 255, 255, 0.1)
  );
}

.modal-body {
  padding: 16px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
}

.input-with-paste {
  position: relative;
  display: flex;
  width: 100%;
}

.text-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px 0 0 4px;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-family: var(--vscode-font-family);
  font-size: 0.9rem;
}

.text-input:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
}

.text-input.error {
  border-color: var(--vscode-inputValidation-errorBorder);
  background-color: var(--vscode-inputValidation-errorBackground);
}

.paste-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
  border: 1px solid var(--vscode-button-border, transparent);
  border-left: none;
  border-radius: 0 2px 2px 0;
  background-color: var(
    --vscode-button-secondaryBackground,
    var(--vscode-button-background)
  );
  color: var(
    --vscode-button-secondaryForeground,
    var(--vscode-button-foreground)
  );
  font-size: 0.8rem;
  font-weight: normal;
  cursor: pointer;
  transition: background-color 0.1s;
  height: 34px;
}

.paste-button:hover:not(:disabled) {
  background-color: var(
    --vscode-button-secondaryHoverBackground,
    var(--vscode-button-hoverBackground)
  );
}

.cancel-button,
.import-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 2px;
  font-size: 0.8rem;
  font-weight: normal;
  cursor: pointer;
  transition: background-color 0.1s;
  height: 28px;
  min-width: 70px;
}

.paste-button:hover:not(:disabled) {
  background-color: var(
    --vscode-button-secondaryHoverBackground,
    var(--vscode-button-hoverBackground)
  );
}

.paste-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.paste-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--vscode-focusBorder);
}

.paste-button.pasting {
  pointer-events: none;
}

.spinner-small {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: var(--vscode-button-foreground, white);
  animation: spin 0.8s linear infinite;
}

.spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.validation-error {
  color: var(--vscode-inputValidation-errorForeground);
  font-size: 0.8rem;
  margin-top: 4px;
}

.address-hint {
  font-size: 0.8rem;
  color: var(--vscode-descriptionForeground);
  margin-top: 8px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--vscode-widget-border);
}

.cancel-button,
.import-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
  height: 32px;
  min-width: 80px;
}

.cancel-button {
  background-color: transparent;
  color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
  border: 1px solid var(--vscode-button-border, var(--vscode-button-background));
}

.cancel-button:hover:not(:disabled) {
  background-color: var(
    --vscode-button-secondaryHoverBackground,
    rgba(255, 255, 255, 0.1)
  );
}

.import-button {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.import-button:hover:not(:disabled) {
  background-color: var(--vscode-button-hoverBackground);
}

.cancel-button:disabled,
.import-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--vscode-button-foreground);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive styles */
@media (max-width: 480px) {
  .modal-container {
    width: 90%;
    max-width: none;
    margin: 0 16px;
  }

  .paste-text {
    display: none;
  }

  .paste-button {
    padding: 0 8px;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .import-button {
    width: 100%;
  }
}

/* Medium screens */
@media (min-width: 481px) and (max-width: 768px) {
  .modal-container {
    width: 80%;
    max-width: 400px;
  }
}
</style>
