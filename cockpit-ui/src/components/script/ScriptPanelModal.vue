<script setup lang="ts">
import { ref, computed, watch, defineProps } from 'vue';
import { AnvilInstance } from '../../types';
import WalletSelector from '../wallet/WalletSelector.vue';

const props = defineProps<{
  isOpen: boolean;
  availableNetworks: Array<AnvilInstance>;
  contractName: string;
  isDeploying?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (
    e: 'deploy-script',
    config: {
      networkUrl: string;
      viaIR: boolean;
    }
  ): void;
  (e: 'open-link', url: string): void;
}>();

const selectedNetworkUrl = ref('');
const viaIR = ref(false);
const hasReadCode = ref(false);
const showSecurityDetails = ref(false);
const error = ref<string>('');
const success = ref<string>('');

const resetModalState = () => {
  selectedNetworkUrl.value = '';
  viaIR.value = false;
  hasReadCode.value = false;
  showSecurityDetails.value = false;
  error.value = '';
  success.value = '';
};

watch(
  () => props.isOpen,
  (newVal, oldVal) => {
    if (newVal && !oldVal) {
      resetModalState();
      if (props.availableNetworks.length > 0) {
        selectedNetworkUrl.value = props.availableNetworks[0].nodeUrl;
      }
    }
  }
);

const isFormValid = computed(() => {
  return selectedNetworkUrl.value !== '' && hasReadCode.value;
});

const selectedNetworkDisplay = computed(() => {
  const network = props.availableNetworks.find(
    n => n.nodeUrl === selectedNetworkUrl.value
  );
  if (!network) return 'Select Network';

  const shortUrl =
    network.nodeUrl.length > 30
      ? network.nodeUrl.substring(0, 15) +
        '...' +
        network.nodeUrl.substring(network.nodeUrl.length - 15)
      : network.nodeUrl;

  return `${shortUrl} ${network.type === 'live' ? '(Live)' : '(Local)'}`;
});

const deployScript = () => {
  error.value = '';
  success.value = '';

  if (!selectedNetworkUrl.value) {
    error.value = 'Please select a network';
    return;
  }

  if (!hasReadCode.value) {
    error.value =
      'Please confirm that you have read through the extension code';
    return;
  }

  emit('deploy-script', {
    networkUrl: selectedNetworkUrl.value,
    viaIR: viaIR.value,
  });
};

const handleDeploymentSuccess = (message?: string) => {
  error.value = '';
  success.value =
    message ||
    `Script deployed successfully to ${selectedNetworkDisplay.value}!`;

  setTimeout(() => {
    close();
  }, 1500);
};

const handleDeploymentFailure = (message: string | boolean | any) => {
  success.value = '';

  if (typeof message === 'string' && message.trim().length > 0) {
    error.value = message.trim();
  } else if (typeof message === 'boolean' || !message) {
    error.value = 'Failed to deploy script. Please try again.';
  } else {
    error.value = 'An unexpected error occurred while deploying the script.';
  }
};

defineExpose({
  handleDeploymentSuccess,
  handleDeploymentFailure,
});

const close = () => {
  resetModalState();
  emit('close');
};

const openExtensionCode = () => {
  emit('open-link', 'https://github.com/Brianspha/forge-cockpit');
};

const openFoundryDocs = () => {
  emit(
    'open-link',
    'https://book.getfoundry.sh/reference/cast/cast-wallet-import'
  );
};

const formatNetworkUrl = (node: AnvilInstance) => {
  const shortUrl =
    node.nodeUrl.length > 40 ? node.nodeUrl.substring(0, 20) : node.nodeUrl;
  return `${shortUrl} ${node.type === 'live' ? '(Live)' : '(Local)'}`;
};
</script>

<template>
  <div class="modal-overlay" v-if="isOpen" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <div class="header-content">
          <h2>Deploy Script</h2>
          <p class="contract-name">{{ contractName }}</p>
        </div>
        <button class="close-button" @click="close" aria-label="Close">
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
        <div v-if="success || error" class="alerts">
          <div v-if="success" class="alert alert-success">
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
            {{ success }}
          </div>

          <div v-if="error" class="alert alert-error">
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
            {{ error }}
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label for="network-select">Target Network</label>
            <select
              id="network-select"
              v-model="selectedNetworkUrl"
              class="form-select"
              :disabled="props.isDeploying"
            >
              <option value="" disabled>Select a network</option>
              <option
                v-for="network in props.availableNetworks"
                :key="network.nodeUrl"
                :value="network.nodeUrl"
              >
                {{ formatNetworkUrl(network) }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Wallet Configuration</label>
            <WalletSelector tabId="ScriptPanel" :nodeUrl="selectedNetworkUrl" />
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <input
                type="checkbox"
                id="via-ir"
                v-model="viaIR"
                :disabled="props.isDeploying"
              />
              <label for="via-ir" class="checkbox-label">
                <span>Enable IR-based code generation</span>
                <small
                  >Uses Yul intermediate representation for better
                  optimizations</small
                >
              </label>
            </div>
          </div>
        </div>

        <div class="warning-section">
          <div class="warning-banner">
            <div class="warning-icon">⚠️</div>
            <div class="warning-content">
              <h3>Development Feature</h3>
              <p>
                Experimental feature we use the default anvil accounts or any
                other imported accounts to run the script
              </p>
              <button
                class="details-toggle"
                @click="showSecurityDetails = !showSecurityDetails"
              >
                {{ showSecurityDetails ? 'Hide' : 'Show' }} security details
              </button>
            </div>
          </div>

          <div v-if="showSecurityDetails" class="security-details">
            <div class="security-tip">
              <strong>🔒 Security Recommendation</strong>
              <p>
                Use keystores instead of private keys in .env files for
                production deployments.
              </p>
              <button class="link-button" @click="openFoundryDocs">
                View Foundry wallet docs →
              </button>
            </div>
          </div>

          <div class="consent-group">
            <div class="checkbox-group">
              <input
                type="checkbox"
                id="read-code"
                v-model="hasReadCode"
                :disabled="props.isDeploying"
              />
              <label for="read-code" class="checkbox-label">
                <span
                  >I have reviewed the extension code and understand no private
                  keys are stored</span
                >
                <button class="link-button" @click="openExtensionCode">
                  View source code →
                </button>
              </label>
            </div>
          </div>
        </div>

        <div v-if="props.isDeploying" class="deployment-status">
          <div class="spinner"></div>
          <div>
            <h4>Deploying to {{ selectedNetworkDisplay }}</h4>
            <p>This may take a few moments...</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="button button-secondary"
          @click="close"
          :disabled="props.isDeploying"
        >
          Cancel
        </button>
        <button
          class="button button-primary"
          @click="deployScript"
          :disabled="!isFormValid || props.isDeploying"
        >
          <div v-if="props.isDeploying" class="button-spinner"></div>
          <span>{{
            props.isDeploying ? 'Deploying...' : 'Deploy Script'
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background-color: var(--vscode-editor-background);
  border: 1px solid var(--vscode-widget-border);
  border-radius: 8px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--vscode-widget-border);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content h2 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vscode-foreground);
}

.contract-name {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vscode-descriptionForeground);
  font-family: var(--vscode-editor-font-family, monospace);
  background-color: var(--vscode-badge-background);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  display: inline-block;
}

.close-button {
  background: none;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.modal-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alerts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.alert-success {
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: var(--vscode-foreground);
}

.alert-success svg {
  color: #10b981;
  flex-shrink: 0;
}

.alert-error {
  background-color: var(--vscode-inputValidation-errorBackground);
  border: 1px solid var(--vscode-inputValidation-errorBorder);
  color: var(--vscode-inputValidation-errorForeground);
}

.alert-error svg {
  flex-shrink: 0;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--vscode-foreground);
}

.form-select {
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  background-color: var(--vscode-dropdown-background);
  color: var(--vscode-dropdown-foreground);
  font-size: 0.875rem;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
}

.form-select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.checkbox-group input[type='checkbox'] {
  margin-top: 0.125rem;
  accent-color: var(--vscode-button-background);
  flex-shrink: 0;
}

.checkbox-label {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--vscode-foreground);
}

.checkbox-label small {
  color: var(--vscode-descriptionForeground);
  font-size: 0.8125rem;
}

.warning-section {
  background-color: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warning-banner {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.warning-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-content h3 {
  margin: 0 0 0.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vscode-foreground);
}

.warning-content p {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: var(--vscode-foreground);
}

.details-toggle {
  background: none;
  border: none;
  color: var(--vscode-textLink-foreground);
  cursor: pointer;
  font-size: 0.8125rem;
  text-decoration: underline;
  padding: 0;
}

.details-toggle:hover {
  color: var(--vscode-textLink-activeForeground);
}

.security-details {
  padding: 0.75rem;
  background-color: rgba(251, 191, 36, 0.05);
  border: 1px solid rgba(251, 191, 36, 0.15);
  border-radius: 4px;
}

.security-tip strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--vscode-foreground);
}

.security-tip p {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  color: var(--vscode-foreground);
}

.consent-group {
  border-top: 1px solid rgba(251, 191, 36, 0.2);
  padding-top: 1rem;
}

.link-button {
  background: none;
  border: none;
  color: var(--vscode-textLink-foreground);
  cursor: pointer;
  font-size: 0.8125rem;
  text-decoration: underline;
  padding: 0;
  margin-left: 0.25rem;
}

.link-button:hover {
  color: var(--vscode-textLink-activeForeground);
}

.deployment-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--vscode-input-background);
  border: 1px solid var(--vscode-button-background);
  border-radius: 6px;
}

.deployment-status h4 {
  margin: 0 0 0.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--vscode-foreground);
}

.deployment-status p {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--vscode-descriptionForeground);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vscode-foreground);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--vscode-widget-border);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.button {
  padding: 0.625rem 1.25rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.button-secondary {
  background-color: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
  border: 1px solid var(--vscode-widget-border);
}

.button-secondary:hover:not(:disabled) {
  background-color: var(--vscode-button-secondaryHoverBackground);
}

.button-primary {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.button-primary:hover:not(:disabled) {
  background-color: var(--vscode-button-hoverBackground);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .modal-body {
    gap: 1rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }

  .deployment-status {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .checkbox-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .checkbox-group input[type='checkbox'] {
    margin-top: 0;
    align-self: flex-start;
  }
}
</style>
