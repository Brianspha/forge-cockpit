<script setup lang="ts">
  import { ref, computed, watch, defineProps } from 'vue';
  import EventPanel from '../contract/EventPanel.vue';
  import LoadingSpinner from '../spinners/LoadingSpinner.vue';
  import ScriptPanel from './ScriptPanelModal.vue';
  import type {
    ABI,
    AnvilInstance,
    DeployContract,
    DeployedContract,
    Function,
    FunctionCallResponse,
    ProcessedEvent,
    TestFile,
  } from '../../types';
  import { formatAddress } from '../../utils/index';

  const props = defineProps<{
    anvilInstances: AnvilInstance[];
    contract: TestFile;
    isRunning: boolean;
    deployedContracts: DeployedContract[];
    activeTab: string;
    transactions: FunctionCallResponse[];
    currentABI: ABI;
  }>();

  const emit = defineEmits<{
    (e: 'run-script', data: DeployContract): void;
    (e: 'change-tab', tabId: string): void;
    (e: 'open-anvil-modal'): void;
    (e: 'select-network', networkUrl: string): void;
    (e: 'copy-address', address: string): void;
    (e: 'remove-network', port: string): void;
    (e: 'paste-panel-constructor-field', fieldId: string): void;
    (e: 'execute-function', data: any): void;
    (e: 'update-input', fieldId: string, value: string): void;
    (e: 'copy-to-clipboard', data: any): void;
    (e: 'select-deployed-contract', contract: DeployedContract): void;
    (e: 'open-link', data: string): void;
  }>();

  const tabs = [
    { id: 'readFunctions', label: 'Read Functions' },
    { id: 'writeFunctions', label: 'Write Functions' },
    { id: 'rawAbi', label: 'Raw ABI' },
    { id: 'events', label: 'Emitted Events' },
  ];

  const selectedNetworkUrl = ref('');
  const showNetworkDropdown = ref(false);
  const selectedDeployedContract = ref<string>('');
  const showContractDropdown = ref(false);
  const constructorArgs = ref<any[]>([]);
  const showScriptPanelModal = ref(false);
  const isDeploying = ref(false);

  const scriptPanelRef = ref<InstanceType<typeof ScriptPanel> | null>(null);

  const changeTab = (tabId: string) => {
    emit('change-tab', tabId);
  };

  const handleRunScript = () => {
    if (!canRun.value) return;
    showScriptPanelModal.value = true;
  };

  const handleOpenLink = (url: string) => {
    emit('open-link', url);
  };

  const handleScriptDeployment = (config: {
    networkUrl: string;
    viaIR: boolean;
  }) => {
    isDeploying.value = true;
    emit('run-script', {
      contractName: contractName.value,
      nodeUrl: config.networkUrl,
      constructorArgs: constructorArgs.value,
      viaIR: config.viaIR,
    } as DeployContract);
  };

  const handleScriptPanelModalClose = () => {
    showScriptPanelModal.value = false;
    isDeploying.value = false;
  };

  const openAnvilModal = () => {
    emit('open-anvil-modal');
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

  const selectDeployedContract = (contractAddress: string) => {
    selectedDeployedContract.value = contractAddress;
    showContractDropdown.value = false;
    const contract = props.deployedContracts.find(
      c => c.address === contractAddress
    );
    if (contract) {
      emit('select-deployed-contract', contract);
    }
  };

  const copyContractAddress = (address: string) => {
    emit('copy-address', address);
  };

  const executeFunction = (func: Function, staticCall: boolean = false) => {
    if (!currentDeployment.value) return;
    emit('execute-function', {
      functionName: func.name,
      contractName: contractName.value,
      params: func.inputs,
      contractAddress: currentDeployment.value.address,
      staticCall,
      abi: props.currentABI,
    });
  };

  const updateFunctionInput = (fieldId: string, value: string) => {
    emit('update-input', fieldId, value);
  };

  const copyToClipboard = (data: any) => {
    emit('copy-to-clipboard', data);
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
        type: 'anvil' as const,
      }));
  });

  const allAvailableNetworks = computed(() => {
    return props.anvilInstances
      .filter(instance => instance.status === 'running')
      .map(instance => ({
        nodeUrl: `http://localhost:${instance.port}`,
        port: instance.port,
        type: 'anvil' as const,
      })) as AnvilInstance[];
  });

  const contractName = computed(() => props.contract.fileName);

  const currentContract = computed(() => {
    if (!selectedDeployedContract.value && props.deployedContracts.length > 0) {
      return props.deployedContracts[0];
    }
    return (
      props.deployedContracts.find(
        contract => contract.address === selectedDeployedContract.value
      ) || null
    );
  });

  const currentDeployment = computed(() => {
    return currentContract.value;
  });

  const contractEvents = computed(() => {
    if (!currentDeployment.value?.address) {
      return [];
    }

    const contractAddress = currentDeployment.value.address.toLowerCase();

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

  const canRun = computed(() => {
    return (
      selectedNetworkUrl.value !== '' && !props.isRunning && !isDeploying.value
    );
  });

  const hasRunningNetworks = computed(() => {
    return availableNetworks.value.length > 0;
  });

  const hasDeployedContracts = computed(() => {
    return props.deployedContracts.length > 0;
  });

  const selectedNetworkDisplay = computed(() => {
    const network = availableNetworks.value.find(
      n => n.url === selectedNetworkUrl.value
    );
    return network ? formatNodeUrl(network.url) : 'Select Network';
  });

  const selectedContractDisplay = computed(() => {
    if (!currentContract.value) return 'No contracts deployed';
    return `${currentContract.value.contractName} (${formatAddress(currentContract.value.address)})`;
  });

  const groupFunctionsByType = (abi: any[] | undefined) => {
    if (!abi) return { read: [], write: [] };

    const readFunctions = abi.filter(
      item =>
        item.type === 'function' &&
        (item.stateMutability === 'view' || item.stateMutability === 'pure')
    );

    const writeFunctions = abi.filter(
      item =>
        item.type === 'function' &&
        item.stateMutability !== 'view' &&
        item.stateMutability !== 'pure'
    );

    return { read: readFunctions, write: writeFunctions };
  };

  const constructorFunction = computed(() => {
    if (!props.contract.abi) return null;
    return props.contract.abi.find(func => func.type === 'constructor') || null;
  });

  const handleDeploymentSuccess = (message?: string) => {
    isDeploying.value = false;
    scriptPanelRef.value?.handleDeploymentSuccess(message);
  };

  const handleDeploymentFailure = (message: string | boolean | any) => {
    isDeploying.value = false;
    scriptPanelRef.value?.handleDeploymentFailure(message);
  };

  defineExpose({
    handleDeploymentSuccess,
    handleDeploymentFailure,
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

  watch(
    () => props.deployedContracts,
    newContracts => {
      if (newContracts.length > 0 && !selectedDeployedContract.value) {
        selectedDeployedContract.value = newContracts[0].address;
        emit('select-deployed-contract', newContracts[0]);
      }
    },
    { immediate: true }
  );

  watch(
    () => props.isRunning,
    newValue => {
      if (!newValue) {
        isDeploying.value = false;
      }
    }
  );
</script>

<template>
  <div class="script-details">
    <div class="script-header">
      <div class="script-title-area">
        <h2 class="script-title">
          {{ contractName }}
          <span class="script-badge">Script</span>
        </h2>
      </div>

      <div class="script-panel">
        <div class="script-actions">
          <button
            v-if="!hasRunningNetworks"
            class="run-button primary-button"
            @click="openAnvilModal"
            aria-label="Create a new network"
          >
            <span>Create Network First</span>
          </button>

          <button
            v-else
            class="run-button primary-button"
            :disabled="props.isRunning || !canRun || isDeploying"
            @click="handleRunScript"
            aria-label="Run script"
          >
            <LoadingSpinner
              v-if="props.isRunning || isDeploying"
              size="small"
            />
            <span v-if="props.isRunning || isDeploying">
              {{ isDeploying ? 'Deploying...' : 'Running...' }}
            </span>
            <span v-else>Run Script</span>
          </button>
        </div>
      </div>
    </div>

    <div class="config-row">
      <div class="network-selector">
        <label class="network-label">Network:</label>
        <div class="network-selector-container">
          <div class="custom-dropdown" :class="{ open: showNetworkDropdown }">
            <button
              class="dropdown-button"
              @click="showNetworkDropdown = !showNetworkDropdown"
              :disabled="
                props.isRunning || isDeploying || availableNetworks.length === 0
              "
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
            :disabled="props.isRunning || isDeploying"
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

    <div v-if="hasDeployedContracts" class="contracts-row">
      <div class="contracts-selector">
        <label class="contracts-label">Deployed Contracts:</label>
        <div class="custom-dropdown" :class="{ open: showContractDropdown }">
          <button
            class="dropdown-button"
            @click="showContractDropdown = !showContractDropdown"
            :disabled="props.isRunning || isDeploying"
          >
            <span>{{ selectedContractDisplay }}</span>
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

          <div v-if="showContractDropdown" class="dropdown-menu">
            <div
              v-for="contract in props.deployedContracts"
              :key="contract.address"
              class="dropdown-item"
              @click="selectDeployedContract(contract.address)"
              :class="{
                selected: contract.address === selectedDeployedContract,
              }"
            >
              <div class="contract-item">
                <span class="contract-name">{{ contract.contractName }}</span>
                <span class="contract-address">
                  {{ formatAddress(contract.address) }}
                </span>
              </div>
              <button
                class="copy-address-btn"
                @click.stop="copyContractAddress(contract.address)"
                title="Copy address"
                aria-label="Copy contract address"
              >
                <svg
                  width="14"
                  height="14"
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
          </div>
        </div>
      </div>
    </div>

    <div v-if="!hasDeployedContracts" class="deployment-notice">
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
        <span>Run this script to deploy and interact with contracts</span>
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
      :class="{ 'functions-disabled': !hasDeployedContracts }"
    >
      <div v-if="activeTab === 'readFunctions'" class="tab-panel">
        <div v-if="currentABI && currentABI.length > 0">
          <div
            v-if="groupFunctionsByType(currentABI).read.length > 0"
            class="function-group"
          >
            <slot
              name="readFunctions"
              :functions="groupFunctionsByType(currentABI).read"
              :contractAddress="currentContract?.address || ''"
              :onExecute="executeFunction"
              :onUpdateInput="updateFunctionInput"
              :onCopyToClipboard="copyToClipboard"
            ></slot>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-message">
            <span>No Read Functions available</span>
            <p>
              {{
                hasDeployedContracts
                  ? "This contract's ABI doesn't contain any read functions."
                  : 'Deploy contracts first to view functions.'
              }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'writeFunctions'" class="tab-panel">
        <div v-if="currentABI && currentABI.length > 0">
          <div
            v-if="groupFunctionsByType(currentABI).write.length > 0"
            class="function-group"
          >
            <slot
              name="writeFunctions"
              :functions="groupFunctionsByType(currentABI).write"
              :contractAddress="currentContract?.address || ''"
              :onExecute="executeFunction"
              :onUpdateInput="updateFunctionInput"
              :onCopyToClipboard="copyToClipboard"
            ></slot>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-message">
            <span>No Write Functions Available</span>
            <p>
              {{
                hasDeployedContracts
                  ? "This contract's ABI doesn't contain any write functions."
                  : 'Deploy contracts first to view functions.'
              }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'rawAbi'" class="tab-panel">
        <div v-if="currentABI && currentABI.length > 0" class="raw-abi">
          <div class="raw-abi-header">
            <button
              class="copy-button"
              @click="copyToClipboard(currentABI)"
              aria-label="Copy ABI to clipboard"
            >
              <span class="copy-icon"></span>
              <span class="copy-text">Copy</span>
            </button>
          </div>
          <pre>{{ JSON.stringify(currentABI, null, 2) }}</pre>
        </div>

        <div v-else class="empty-state">
          <div class="empty-message">
            <span>No ABI Available</span>
            <p>
              {{
                hasDeployedContracts
                  ? "This contract doesn't have an ABI defined."
                  : 'Deploy contracts first to view ABI.'
              }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'events'" class="tab-panel">
        <EventPanel
          :events="contractEvents"
          :is-deployed="hasDeployedContracts"
        />
      </div>
    </div>

    <ScriptPanel
      ref="scriptPanelRef"
      :isOpen="showScriptPanelModal"
      :availableNetworks="allAvailableNetworks"
      :contractName="contractName"
      :isDeploying="isDeploying"
      @close="handleScriptPanelModalClose"
      @open-link="handleOpenLink"
      @deploy-script="handleScriptDeployment"
    />
  </div>
</template>

<style scoped>
  .script-details {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
  }

  .script-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .script-title-area {
    flex: 1;
  }

  .script-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .script-badge {
    font-size: 12px;
    background-color: #8b5cf6;
    color: white;
    padding: 4px 8px;
    border-radius: 16px;
    font-weight: 500;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
    text-transform: uppercase;
  }

  .script-panel {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--panel-bg);
    width: 280px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .script-actions {
    padding: 12px;
    display: flex;
    justify-content: center;
  }

  .run-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 16px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
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
    border-color: var(
      --vscode-button-background,
      var(--primary-color, #0078d4)
    );
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
    transform: translateY(0);
  }

  .run-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .config-row,
  .contracts-row {
    display: flex;
    margin-bottom: 20px;
  }

  .network-selector,
  .contracts-selector {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .network-label,
  .contracts-label {
    font-weight: 500;
    min-width: 70px;
  }

  .network-selector-container {
    display: flex;
    gap: 8px;
    flex: 1;
  }

  .custom-dropdown {
    position: relative;
    flex: 1;
  }

  .dropdown-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--vscode-dropdown-background);
    color: var(--vscode-dropdown-foreground);
    font-size: 14px;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dropdown-button:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 0, 120, 212), 0.25);
  }

  .dropdown-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .dropdown-arrow {
    transition: transform 0.2s ease;
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
    border: 1px solid var(--border-color);
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
  }

  .network-url {
    flex: 1;
  }

  .contract-item {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 2px;
  }

  .contract-name {
    font-weight: 500;
  }

  .contract-address {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 12px;
    color: var(--vscode-descriptionForeground);
  }

  .remove-network-btn,
  .copy-address-btn {
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

  .copy-address-btn:hover {
    background-color: var(--hover-bg);
    color: var(--primary-color);
    opacity: 1;
  }

  .create-network-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    background-color: var(--primary-color);
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .create-network-button:hover:not(:disabled) {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .create-network-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .deployment-notice {
    background-color: var(--panel-bg);
    border: 1px solid var(--border-color);
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
    color: #f59e0b;
    flex-shrink: 0;
  }

  .tab-navigation {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 16px;
  }

  .tab-button {
    padding: 8px 16px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-color);
    transition: all 0.2s ease;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tab-button:hover {
    background-color: var(--hover-bg);
    color: var(--primary-color);
  }

  .tab-button.active {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
    font-weight: 600;
  }

  .event-count {
    background: var(--primary-color);
    color: white;
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

  .function-group {
    margin-bottom: 16px;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
  }

  .empty-message span {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
    display: block;
    margin-bottom: 8px;
  }

  .empty-message p {
    color: var(--vscode-descriptionForeground);
    margin: 0;
  }

  .raw-abi {
    position: relative;
    background-color: var(--vscode-editor-background);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    max-height: calc(100vh - 200px);
  }

  .raw-abi-header {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
  }

  .copy-button {
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .copy-button:hover {
    background-color: var(--primary-hover);
  }

  .copy-icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .raw-abi pre {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: var(--vscode-editor-font-size, 13px);
    white-space: pre-wrap;
    word-break: break-word;
    margin-top: 24px;
  }

  @media (max-width: 768px) {
    .script-header {
      flex-direction: column;
      gap: 16px;
    }

    .script-title {
      font-size: 16px;
    }

    .script-panel {
      width: 100%;
    }

    .config-row,
    .contracts-row {
      flex-direction: column;
      gap: 12px;
    }

    .network-selector,
    .contracts-selector {
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
