<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { isValidAddress, formatAddress } from '../../utils/index';
import { TransferResponse, TransferTransaction } from '../../types';

const props = defineProps<{
  wallets: string[];
  activeWallet: string;
  balances: Record<string, string>;
  pastedContent: string;
  transferResponse: TransferResponse;
  paste: () => void;
}>();

const emit = defineEmits<{
  transfer: [data: TransferTransaction];
  close: [];
}>();

const fromWallet = ref<string>(props.activeWallet || '');
const toAddress = ref<string>('');
const amount = ref<string>('');
const showToDropdown = ref<boolean>(false);
const showFromDropdown = ref<boolean>(false);
const isTransferring = ref<boolean>(false);
const transferResult = ref<{
  success: boolean;
  message: string;
  txHash?: string;
} | null>(null);
const isAddressPasting = ref<boolean>(false);

const getWalletBalance = (address: string): string => {
  if (!address) return '0';
  const balance = props.balances[address];
  return balance || '0';
};

const getFormattedWalletDisplay = (address: string): string => {
  if (!address) return 'Select wallet';
  const balance = getWalletBalance(address);
  return `${formatAddress(address)} ${balance} ETH`;
};

const availableToWallets = computed(() => {
  return props.wallets.filter(wallet => wallet !== fromWallet.value);
});

const isFormValid = computed(() => {
  return (
    fromWallet.value &&
    isValidAddress(toAddress.value) &&
    toAddress.value !== fromWallet.value &&
    amount.value &&
    parseFloat(amount.value) > 0 &&
    parseFloat(getWalletBalance(fromWallet.value)) >= parseFloat(amount.value)
  );
});

const handleAddressPaste = async () => {
  isAddressPasting.value = true;
  props.paste();

  setTimeout(() => {
    if (props.pastedContent) {
      toAddress.value = props.pastedContent;
    }
    isAddressPasting.value = false;
  }, 500);

  setTimeout(() => {
    isAddressPasting.value = false;
  }, 10000);
};

const selectFromWallet = (address: string) => {
  fromWallet.value = address;
  showFromDropdown.value = false;

  if (toAddress.value === address) {
    toAddress.value = '';
  }
};

const selectToWallet = (address: string) => {
  toAddress.value = address;
  showToDropdown.value = false;
};

const handleTransfer = async () => {
  if (!isFormValid.value || isTransferring.value) return;

  isTransferring.value = true;
  transferResult.value = null;

  const transferData: TransferTransaction = {
    type: 'eth',
    from: fromWallet.value,
    to: toAddress.value,
    amount: amount.value,
    nodeUrl: '',
  };

  emit('transfer', transferData);
  setTimeout(() => {
    isTransferring.value = false;
  }, 10000);
};

const closeModal = () => {
  emit('close');
};

const resetForm = () => {
  toAddress.value = '';
  amount.value = '';
  transferResult.value = null;
  showToDropdown.value = false;
  showFromDropdown.value = false;
};

const closeDropdowns = (event?: Event) => {
  if (event && event.target) {
    const target = event.target as Element;
    if (
      target.closest('.dropdown-container') ||
      target.closest('.to-input-container')
    ) {
      return;
    }
  }
  showToDropdown.value = false;
  showFromDropdown.value = false;
};

watch(
  () => props.activeWallet,
  newWallet => {
    if (newWallet) {
      fromWallet.value = newWallet;
    }
  }
);

watch(
  () => props.pastedContent,
  content => {
    if (content && isAddressPasting.value) {
      toAddress.value = content;
      isAddressPasting.value = false;
    }
  }
);

watch(
  () => props.transferResponse,
  response => {
    if (response && (response.success !== undefined || response.error)) {
      isTransferring.value = false;
      transferResult.value = {
        success: response.success,
        message: response.success
          ? 'Transfer completed successfully!'
          : response.error,
        txHash: response.success ? (response as any).hash : undefined,
      };

      if (response.success) {
        setTimeout(() => {
          resetForm();
        }, 3000);
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  if (props.activeWallet) {
    fromWallet.value = props.activeWallet;
  }
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>

<template>
  <div class="transfer-modal-overlay" @click.self="closeModal">
    <div class="transfer-modal">
      <div class="modal-header">
        <h3 class="modal-title">Transfer ETH</h3>
        <button class="close-button" @click="closeModal">
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

      <div class="modal-content">
        <div class="form-group">
          <label class="form-label">From</label>
          <div class="dropdown-container" @click.stop>
            <div
              class="form-select-display"
              @click="showFromDropdown = !showFromDropdown"
            >
              {{ getFormattedWalletDisplay(fromWallet) }}
              <svg
                class="dropdown-arrow"
                :class="{ open: showFromDropdown }"
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
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <div v-if="showFromDropdown" class="wallet-dropdown">
              <div
                v-for="wallet in wallets"
                :key="wallet"
                class="wallet-option"
                :class="{ selected: wallet === fromWallet }"
                @click="selectFromWallet(wallet)"
              >
                {{ formatAddress(wallet) }} {{ getWalletBalance(wallet) }} ETH
                <span v-if="wallet === props.activeWallet" class="active-badge"
                  >ACTIVE</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">To</label>
          <div class="to-input-container" @click.stop>
            <input
              v-model="toAddress"
              type="text"
              placeholder="Enter wallet address"
              class="form-input"
              :class="{ error: toAddress === fromWallet && toAddress !== '' }"
            />
            <div class="input-actions">
              <button
                class="action-button"
                @click="showToDropdown = !showToDropdown"
                title="Select from wallets"
                :disabled="availableToWallets.length === 0"
              >
                <svg
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
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <button
                class="action-button"
                @click="handleAddressPaste"
                :disabled="isAddressPasting"
                title="Paste from clipboard"
              >
                <svg
                  v-if="!isAddressPasting"
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
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="loading-spinner"
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
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10"></path>
                </svg>
              </button>
            </div>
          </div>

          <div
            v-if="showToDropdown && availableToWallets.length > 0"
            class="wallet-dropdown"
          >
            <div
              v-for="wallet in availableToWallets"
              :key="wallet"
              class="wallet-option"
              @click="selectToWallet(wallet)"
            >
              {{ formatAddress(wallet) }} {{ getWalletBalance(wallet) }} ETH
            </div>
          </div>

          <div
            v-if="toAddress === fromWallet && toAddress !== ''"
            class="error-message"
          >
            Cannot send to the same wallet
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Amount</label>
          <input
            v-model="amount"
            type="number"
            step="any"
            min="0"
            placeholder="0.0"
            class="form-input"
          />
          <div class="input-helper">Amount in ETH</div>
        </div>

        <div
          v-if="transferResult"
          class="result-notification"
          :class="{
            success: transferResult.success,
            error: !transferResult.success,
          }"
        >
          <div class="result-icon">
            <svg
              v-if="transferResult.success"
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
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg
              v-else
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="result-content">
            <div class="result-text">{{ transferResult.message }}</div>
            <div
              v-if="transferResult.success && transferResult.txHash"
              class="result-hash"
            >
              Transaction: {{ transferResult.txHash }}
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">Cancel</button>
        <button class="reset-button" @click="resetForm">Reset</button>
        <button
          class="transfer-button"
          @click="handleTransfer"
          :disabled="!isFormValid || isTransferring"
        >
          <svg
            v-if="!isTransferring"
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
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
          <svg
            v-else
            class="loading-spinner"
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
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          {{ isTransferring ? 'Transferring...' : 'Transfer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transfer-modal-overlay {
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

.transfer-modal {
  background-color: var(--vscode-editor-background);
  border: 1px solid var(--vscode-widget-border);
  border-radius: 4px;
  width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid var(--vscode-widget-border);
  background-color: var(--vscode-titleBar-activeBackground, rgba(0, 0, 0, 0.1));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--vscode-titleBar-activeForeground, var(--vscode-foreground));
}

.close-button {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.modal-content {
  padding: 1rem;
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--vscode-foreground);
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-size: 0.85rem;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
}

.form-input.error {
  border-color: var(--vscode-inputValidation-errorBorder, #ff6b68);
}

.form-input::placeholder {
  color: var(--vscode-input-placeholderForeground);
}

.dropdown-container {
  position: relative;
}

.form-select-display {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.form-select-display:hover {
  background-color: var(--vscode-list-hoverBackground);
}

.dropdown-arrow {
  transition: transform 0.2s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.to-input-container {
  position: relative;
}

.input-actions {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 2px;
}

.action-button {
  padding: 4px;
  border: none;
  background: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover:not(:disabled) {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wallet-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--vscode-dropdown-background);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
}

.wallet-option {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--vscode-widget-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wallet-option:last-child {
  border-bottom: none;
}

.wallet-option:hover {
  background-color: var(--vscode-list-hoverBackground);
}

.wallet-option.selected {
  background-color: var(--vscode-list-activeSelectionBackground);
  color: var(--vscode-list-activeSelectionForeground);
}

.active-badge {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: 500;
}

.error-message {
  font-size: 0.75rem;
  color: var(--vscode-inputValidation-errorForeground, #ff6b68);
  margin-top: 0.25rem;
}

.input-helper {
  font-size: 0.75rem;
  color: var(--vscode-descriptionForeground);
  margin-top: 0.25rem;
}

.result-notification {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 4px;
  margin-top: 1rem;
  border-left: 3px solid;
  background-color: var(
    --vscode-notifications-background,
    var(--vscode-editor-background)
  );
  color: var(--vscode-notifications-foreground, var(--vscode-foreground));
}

.result-notification.success {
  border-left-color: var(--vscode-notificationsInfoIcon-foreground, #3794ff);
  background-color: var(
    --vscode-inputValidation-infoBackground,
    rgba(55, 148, 255, 0.06)
  );
}

.result-notification.error {
  border-left-color: var(--vscode-notificationsErrorIcon-foreground, #ff6b68);
  background-color: var(
    --vscode-inputValidation-errorBackground,
    rgba(255, 107, 104, 0.06)
  );
}

.result-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.result-notification.success .result-icon {
  color: var(--vscode-notificationsInfoIcon-foreground, #3794ff);
}

.result-notification.error .result-icon {
  color: var(--vscode-notificationsErrorIcon-foreground, #ff6b68);
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-text {
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

.result-hash {
  font-size: 0.75rem;
  margin-top: 4px;
  opacity: 0.8;
  font-family: var(
    --vscode-editor-font-family,
    'SF Mono',
    Monaco,
    'Cascadia Code',
    'Roboto Mono',
    Consolas,
    'Courier New',
    monospace
  );
  word-break: break-all;
  color: var(--vscode-descriptionForeground);
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--vscode-widget-border);
  background-color: var(
    --vscode-titleBar-activeBackground,
    rgba(0, 0, 0, 0.05)
  );
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.cancel-button,
.reset-button,
.transfer-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.cancel-button {
  background: none;
  border: 1px solid var(--vscode-button-border, var(--vscode-contrastBorder));
  color: var(--vscode-foreground);
}

.cancel-button:hover {
  background-color: var(--vscode-button-secondaryHoverBackground);
}

.reset-button {
  background-color: var(--vscode-button-secondaryBackground);
  border: 1px solid var(--vscode-button-border, var(--vscode-contrastBorder));
  color: var(--vscode-button-secondaryForeground);
}

.reset-button:hover {
  background-color: var(--vscode-button-secondaryHoverBackground);
}

.transfer-button {
  background-color: var(--vscode-button-background);
  border: 1px solid var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.transfer-button:hover:not(:disabled) {
  background-color: var(--vscode-button-hoverBackground);
}

.transfer-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
