<script setup lang="ts">
  import { ref, computed, watch, defineProps } from 'vue';
  import DeploymentPanel from './DeploymentPanel.vue';
  import EventPanel from './EventPanel.vue';
  import type {
    AnvilInstance,
    DeployContract,
    DeployedContract,
    FunctionCallResponse,
    ProcessedEvent,
    TestFile,
  } from '../../types';

  const props = defineProps<{
    anvilInstances: AnvilInstance[];
    contract: TestFile;
    isDeploying: boolean;
    deploymentInfo: DeployedContract | undefined;
    activeTab: string;
    panelClipboardContent?: Record<string, string>;
    panelLoadingStates?: Record<string, boolean>;
    transactions: FunctionCallResponse[];
  }>();

  const emit = defineEmits<{
    (e: 'deploy', data: DeployContract): void;
    (e: 'change-tab', tabId: string): void;
    (e: 'open-anvil-modal'): void;
    (e: 'select-network', networkUrl: string): void;
    (e: 'copy-address', address: string): void;
    (e: 'remove-network', port: string): void;
    (e: 'paste-panel-constructor-field', fieldId: string): void;
    (e: 'show-depoyment-modal'): void;
  }>();

  const tabs = [
    { id: 'readFunctions', label: 'Read Functions' },
    { id: 'writeFunctions', label: 'Write Functions' },
    { id: 'rawAbi', label: 'Raw ABI' },
    { id: 'events', label: 'Emitted Events' },
  ];

  const selectedNetworkUrl = ref('');
  const showNetworkDropdown = ref(false);

  const changeTab = (tabId: string) => {
    emit('change-tab', tabId);
  };

  const handleDeploy = (args: any[]) => {
    if (!canDeploy.value) return;
    emit('deploy', {
      contractName: contractName.value,
      abi: props.contract.abi,
      constructorArgs: args,
      nodeUrl: selectedNetworkUrl.value,
      bytecode: props.contract.bytecode,
      msgSender: '',
    } as DeployContract);
  };

  const openAnvilModal = () => {
    emit('open-anvil-modal');
  };

  const onShowDeploymentModal = () => {
    emit('show-depoyment-modal');
  };

  const selectNetwork = (networkUrl: string) => {
    selectedNetworkUrl.value = networkUrl;
    emit('select-network', networkUrl);
    showNetworkDropdown.value = false;
  };

  const removeNetwork = (port: string, event: Event) => {
    event.stopPropagation();
    emit('remove-network', port);
    showNetworkDropdown.value = false;
  };

  const copyContractAddress = () => {
    if (props.deploymentInfo && props.deploymentInfo.address) {
      emit('copy-address', props.deploymentInfo.address);
    }
  };

  const handlePanelConstructorPaste = (fieldId: string) => {
    emit('paste-panel-constructor-field', fieldId);
  };

  const formatNodeUrl = (url: string) => {
    if (url.length > 30) {
      return url.substring(0, 15) + '...' + url.substring(url.length - 15);
    }
    return url;
  };

  const availableNetworks = computed(() => {
    return props.anvilInstances
      .filter(instance => instance.status === 'running')
      .map(instance => ({
        id: instance.port,
        url: `http://localhost:${instance.port}`,
        port: instance.port,
      }));
  });

  const contractName = computed(() => props.contract.fileName);

  const contractEvents = computed(() => {
    if (!props.deploymentInfo?.address) {
      return [];
    }

    const contractAddress = props.deploymentInfo.address.toLowerCase();

    return props.transactions
      .map(transaction => transaction.logs || [])
      .flat()
      .filter(
        (event: ProcessedEvent) =>
          event &&
          event.address &&
          event.address.toLowerCase() === contractAddress
      );
  });

  const canDeploy = computed(() => {
    return selectedNetworkUrl.value !== '' && !props.isDeploying;
  });

  const hasRunningNetworks = computed(() => {
    return availableNetworks.value.length > 0;
  });

  const isContractDeployed = computed(() => {
    return !!props.deploymentInfo;
  });

  const selectedNetworkDisplay = computed(() => {
    const network = availableNetworks.value.find(
      n => n.url === selectedNetworkUrl.value
    );
    return network ? formatNodeUrl(network.url) : 'Select Network';
  });

  watch(
    availableNetworks,
    newNetworks => {
      if (newNetworks.length === 0) {
        selectedNetworkUrl.value = '';
        return;
      }

      const isCurrentValid = newNetworks.some(
        network => network.url === selectedNetworkUrl.value
      );
      if (!isCurrentValid || selectedNetworkUrl.value === '') {
        selectedNetworkUrl.value = newNetworks[0].url;
        emit('select-network', newNetworks[0].url);
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="contract-details">
    <div class="contract-header">
      <div class="contract-title-area">
        <h2 class="contract-title">
          {{ contractName }}
          <span v-if="deploymentInfo" class="deployed-badge">Deployed</span>
          <span v-else class="contract-badge">Contract</span>
        </h2>

        <div v-if="deploymentInfo" class="address-container">
          <div class="address-display">
            <div class="address-value">{{ deploymentInfo.address }}</div>
            <button
              class="copy-address-btn"
              @click="copyContractAddress"
              title="Copy address"
              aria-label="Copy contract address"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path
                  d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                ></path>
              </svg>
            </button>
          </div>
          <div class="copy-tooltip">Click to copy</div>
        </div>
      </div>

      <DeploymentPanel
        :contract="contract"
        :is-deploying="isDeploying"
        :is-deployed="!!deploymentInfo"
        :deployment-info="deploymentInfo || null"
        :can-deploy="canDeploy && hasRunningNetworks"
        :has-networks="hasRunningNetworks"
        :clipboard-content="panelClipboardContent"
        :is-parent-loading="panelLoadingStates"
        @deploy="handleDeploy"
        @create-network="openAnvilModal"
        @copy-address="copyContractAddress"
        @paste-constructor-field="handlePanelConstructorPaste"
        @show-depoyment-modal="onShowDeploymentModal"
      />
    </div>

    <div class="network-row">
      <div class="network-selector">
        <label class="network-label">Network:</label>
        <div class="network-selector-container">
          <div class="custom-dropdown" :class="{ open: showNetworkDropdown }">
            <button
              class="dropdown-button"
              @click="showNetworkDropdown = !showNetworkDropdown"
              :disabled="isDeploying || availableNetworks.length === 0"
            >
              <span>{{ selectedNetworkDisplay }}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="dropdown-arrow"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <div v-if="showNetworkDropdown" class="dropdown-menu">
              <div
                v-if="availableNetworks.length === 0"
                class="dropdown-item disabled"
              >
                No networks available
              </div>
              <div
                v-for="network in availableNetworks"
                :key="network.id"
                class="dropdown-item"
                @click="selectNetwork(network.url)"
                :class="{ selected: network.url === selectedNetworkUrl }"
              >
                <span class="network-url">
                  {{ formatNodeUrl(network.url) }}
                </span>
                <button
                  class="remove-network-btn"
                  @click="removeNetwork(network.port, $event)"
                  title="Remove network"
                  aria-label="Remove network"
                >
                  <svg
                    width="14"
                    height="14"
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
            </div>
          </div>

          <button
            class="create-network-button"
            @click="openAnvilModal"
            title="Create new Anvil instance"
            aria-label="Create new network"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="!isContractDeployed" class="deployment-notice">
      <div class="notice-message">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>Deploy this contract to interact with its functions</span>
      </div>
    </div>

    <div class="tab-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="changeTab(tab.id)"
      >
        {{ tab.label }}
        <span
          v-if="tab.id === 'events' && contractEvents.length > 0"
          class="event-count"
        >
          {{ contractEvents.length }}
        </span>
      </button>
    </div>

    <div
      class="tab-content"
      :class="{ 'functions-disabled': !isContractDeployed }"
    >
      <div v-if="activeTab === 'readFunctions'" class="tab-panel">
        <slot name="readFunctions"></slot>
      </div>
      <div v-if="activeTab === 'writeFunctions'" class="tab-panel">
        <slot name="writeFunctions"></slot>
      </div>
      <div v-if="activeTab === 'rawAbi'" class="tab-panel">
        <slot name="rawAbi"></slot>
      </div>
      <div v-if="activeTab === 'events'" class="tab-panel">
        <EventPanel
          :events="contractEvents"
          :is-deployed="isContractDeployed"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .contract-details {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
  }

  .contract-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .contract-title-area {
    flex: 1;
  }

  .contract-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .deployed-badge {
    font-size: 12px;
    background-color: #10b981;
    color: white;
    padding: 4px 8px;
    border-radius: 16px;
    font-weight: 500;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    text-transform: uppercase;
  }

  .contract-badge {
    background-color: var(
      --vscode-button-background,
      var(--primary-color, #0078d4)
    );
    color: var(--vscode-button-foreground, white);
    border-color: var(
      --vscode-button-background,
      var(--primary-color, #0078d4)
    );
    font-size: 12px;

    border-radius: 6px;
    padding: 4px 8px;
    border-radius: 16px;
    font-weight: 500;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    text-transform: uppercase;
  }

  .address-container {
    margin-top: 8px;
    position: relative;
  }

  .address-display {
    display: flex;
    align-items: center;
    background-color: var(--vscode-input-background, var(--panel-bg));
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid var(--vscode-input-border, var(--border-color));
    transition: all 0.2s ease;
    cursor: pointer;
    max-width: fit-content;
  }

  .address-display:hover {
    border-color: var(--vscode-focusBorder, var(--primary-color));
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .address-display:hover .copy-tooltip {
    opacity: 1;
    transform: translateY(0);
  }

  .address-value {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 280px;
    padding-right: 8px;
    color: var(--vscode-editor-foreground, var(--text-color));
  }

  .copy-address-btn {
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    margin-left: 4px;
    border-radius: 4px;
    color: var(--vscode-foreground, var(--text-color));
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .copy-address-btn:hover {
    background-color: var(--vscode-toolbar-hoverBackground, var(--hover-bg));
    color: var(--vscode-focusBorder, var(--primary-color));
  }

  .copy-tooltip {
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background-color: var(
      --vscode-editorHoverWidget-background,
      var(--panel-bg)
    );
    color: var(--vscode-editorHoverWidget-foreground, var(--text-color));
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    transition: all 0.2s ease;
    pointer-events: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid
      var(--vscode-editorHoverWidget-border, var(--border-color));
  }

  .network-row {
    display: flex;
    margin-bottom: 20px;
  }

  .network-selector {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .network-label {
    font-weight: 500;
    color: var(--vscode-foreground, var(--text-color));
  }

  .network-selector-container {
    display: flex;
    gap: 8px;
  }

  .custom-dropdown {
    position: relative;
  }

  .dropdown-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: 1px solid var(--vscode-dropdown-border, var(--border-color));
    border-radius: 6px;
    background-color: var(--vscode-dropdown-background);
    color: var(--vscode-dropdown-foreground);
    font-size: 14px;
    width: 250px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dropdown-button:focus {
    outline: none;
    border-color: var(--vscode-focusBorder, var(--primary-color));
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 0, 120, 212), 0.25);
  }

  .dropdown-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: var(--vscode-input-background, transparent);
    color: var(--vscode-disabledForeground, inherit);
  }

  .dropdown-arrow {
    transition: transform 0.2s ease;
    color: var(--vscode-foreground, currentColor);
  }

  .custom-dropdown.open .dropdown-arrow {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--vscode-dropdown-background);
    border: 1px solid var(--vscode-dropdown-border, var(--border-color));
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 4px;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 14px;
    color: var(--vscode-dropdown-foreground);
  }

  .dropdown-item:hover:not(.disabled) {
    background-color: var(--vscode-list-hoverBackground);
  }

  .dropdown-item.selected {
    background-color: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
  }

  .dropdown-item.disabled {
    opacity: 0.7;
    cursor: not-allowed;
    color: var(--vscode-disabledForeground);
  }

  .network-url {
    flex: 1;
  }

  .remove-network-btn {
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
    color: var(--vscode-descriptionForeground);
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.7;
  }

  .remove-network-btn:hover {
    background-color: var(--vscode-inputValidation-errorBackground);
    color: var(--vscode-inputValidation-errorForeground);
    opacity: 1;
  }

  .create-network-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid var(--vscode-button-background, var(--primary-color));
    border-radius: 6px;
    background-color: var(--vscode-button-background, var(--primary-color));
    color: var(--vscode-button-foreground, white);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .create-network-button:hover {
    background-color: var(
      --vscode-button-hoverBackground,
      var(--primary-hover)
    );
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .create-network-button:active {
    transform: translateY(0);
  }

  .deployment-notice {
    background-color: var(--vscode-editor-background, var(--panel-bg));
    border: 1px solid var(--vscode-panel-border, var(--border-color));
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 20px;
  }

  .notice-message {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--vscode-descriptionForeground);
    font-size: 14px;
  }

  .notice-message svg {
    color: var(--vscode-notificationsWarningIcon-foreground, #f59e0b);
    flex-shrink: 0;
  }

  .tab-navigation {
    display: flex;
    border-bottom: 1px solid var(--vscode-tab-border, var(--border-color));
    margin-bottom: 16px;
  }

  .tab-button {
    padding: 8px 16px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 14px;
    color: var(--vscode-tab-inactiveForeground, var(--text-color));
    transition: all 0.2s ease;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tab-button:hover {
    background-color: var(--vscode-tab-hoverBackground, var(--hover-bg));
    color: var(--vscode-tab-activeForeground, var(--primary-color));
  }

  .tab-button.active {
    border-bottom-color: var(--vscode-tab-activeBorder, var(--primary-color));
    color: var(--vscode-tab-activeForeground, var(--primary-color));
    font-weight: 600;
    background-color: var(--vscode-tab-activeBackground, transparent);
  }

  .event-count {
    background: var(--vscode-badge-background, var(--primary-color));
    color: var(--vscode-badge-foreground, white);
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 500;
    min-width: 16px;
    text-align: center;
  }

  .tab-content {
    flex: 1;
    overflow: auto;
    min-height: 0;
    transition: opacity 0.3s ease;
  }

  .tab-content.functions-disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .tab-panel {
    overflow: auto;
    padding-top: 4px;
  }

  @media (max-width: 768px) {
    .contract-header {
      flex-direction: column;
      gap: 16px;
    }

    .contract-title {
      font-size: 16px;
    }

    .address-display {
      max-width: 100%;
      width: 100%;
    }

    .address-value {
      max-width: none;
      flex: 1;
    }

    .network-row {
      flex-direction: column;
      gap: 12px;
    }

    .network-selector {
      width: 100%;
    }

    .network-selector-container {
      flex: 1;
    }

    .dropdown-button {
      width: 100%;
      min-width: 0;
      flex: 1;
    }

    .tab-button {
      flex: 1;
      text-align: center;
      padding: 8px 4px;
    }
  }
</style>
