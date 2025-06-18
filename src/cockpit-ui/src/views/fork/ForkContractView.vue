<script setup lang="ts">
  import { ref, computed, reactive, watch, inject, Ref } from 'vue';
  import { v4 as uuidv4 } from 'uuid';
  import TabBar from '../../components/fork/TabBar.vue';
  import ContractInterface from '../../components/fork/ContractInterface.vue';
  import NewABIForm from '../../components/fork/NewABIForm.vue';
  import type {
    Function,
    AbiTab,
    MessageResponse,
    AbiFormData,
  } from '../../types/index';
  import { useForkStore } from '../../stores/useForkStore';
  import { useWalletStore } from '../../stores/useWalletStore';
  import {
    isValidAddress,
    isNodeUrl,
    readAbiFile,
    validateAbiString,
    formatAddress,
  } from '../../utils/index';
  import { vscode } from '../../utils/vscode';
  import { useAnvilStore } from '../../stores/useAnvilStore';

  const walletStore = useWalletStore();
  const forkStore = useForkStore();
  const anvilStore = useAnvilStore();
  const activeTabId = ref<string>('');
  const showAddTab = ref<boolean>(true);
  const activeFunctionType = ref<string>('read');
  const inputValues = inject<Ref<any>>('functionInputValues');
  const loadingStates = inject<Ref<any>>('functionLoadingStates');

  const newAbiForm = reactive<AbiFormData>({
    nodeUrl: '',
    contractAddress: '',
    customAbi: '',
    isLoading: false,
    error: '',
    port: '',
    newAbiForm: false,
    validationWarnings: [] as string[],
    useExistingNode: false,
  });
  const selectedForkId = ref<string>('');
  const pendingPasteFieldId = ref<string>('');
  const pasteValue = ref<string>('');

  const activeTab = computed<AbiTab | undefined>(() => {
    return forkStore.tabs.find((tab: AbiTab) => tab.id === activeTabId.value);
  });

  const shouldShowAddForm = computed(() => {
    if (showAddTab.value) return true;

    if (forkStore.tabs.length === 0) return true;

    if (!activeTabId.value || !activeTab.value) return true;

    return false;
  });

  const availableForks = computed(() => {
    return anvilStore.instances.filter(
      instance => instance.status === 'running'
    );
  });

  const readFunctions = computed(() => {
    if (!activeTab.value?.parsedAbi?.length) return [];

    return activeTab.value.parsedAbi.filter(
      (item): item is Function =>
        item.type === 'function' &&
        (item.stateMutability === 'view' || item.stateMutability === 'pure')
    );
  });

  const writeFunctions = computed(() => {
    if (!activeTab.value?.parsedAbi?.length) return [];

    return activeTab.value.parsedAbi.filter(
      (item): item is Function =>
        item.type === 'function' &&
        item.stateMutability !== 'view' &&
        item.stateMutability !== 'pure'
    );
  });

  const displayedFunctions = computed(() => {
    return activeFunctionType.value === 'read'
      ? readFunctions.value
      : writeFunctions.value;
  });

  const handleFunctionPanelPaste = (fieldId: string): void => {
    pendingPasteFieldId.value = fieldId;
    pasteValue.value = '';
    forkStore.readClipboard('functionPanelInput_' + fieldId);
  };

  watch(
    () => forkStore.clipboardContent,
    newContent => {
      const fieldKey = 'functionPanelInput_' + pendingPasteFieldId.value;
      if (newContent && newContent[fieldKey] !== undefined) {
        pasteValue.value = newContent[fieldKey];
        if (forkStore.clipboardContent) {
          delete forkStore.clipboardContent[fieldKey];
        }
      }
    },
    { deep: true }
  );

  const addNewTab = () => {
    showAddTab.value = true;
    activeTabId.value = '';
    resetNewAbiForm();
  };

  const resetNewAbiForm = () => {
    newAbiForm.nodeUrl = '';
    newAbiForm.contractAddress = '';
    newAbiForm.customAbi = '';
    newAbiForm.error = '';
    newAbiForm.validationWarnings = [];
    newAbiForm.useExistingNode = false;
    selectedForkId.value = '';

    forkStore.abiInput = '';
    forkStore.nodeURLInput = '';
    forkStore.portInput = '';
    forkStore.contractAddressInput = '';
    forkStore.forkError = '';

    forkStore.isLoading = false;
    forkStore.isPasteAddressLoading = false;
    forkStore.isNodeURLLoading = false;
    forkStore.isPortPasteLoading = false;
    forkStore.resetState();

    pendingPasteFieldId.value = '';
    pasteValue.value = '';
  };

  const pasteToField = (fieldName: string) => {
    forkStore.readClipboard(fieldName);
  };

  const validateAbi = (): boolean => {
    const result = validateAbiString(newAbiForm.customAbi);
    newAbiForm.error = result.error || '';
    newAbiForm.validationWarnings = [];
    return result.success;
  };

  const pasteABI = (): void => {
    forkStore.readClipboard('abiForm');
  };

  const handleFileUpload = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    readAbiFile(file, result => {
      if (result.error) {
        newAbiForm.error = result.error;
      } else {
        newAbiForm.customAbi = result.abiText;
        newAbiForm.error = '';
        validateAbi();
      }
    });
  };

  const connectToFork = (): void => {
    forkStore.forkError = '';

    if (!validateAbi()) {
      return;
    }

    if (!newAbiForm.useExistingNode && !isNodeUrl(newAbiForm.nodeUrl)) {
      newAbiForm.error = 'Node URL is required';
      return;
    }

    if (newAbiForm.useExistingNode && !selectedForkId.value) {
      newAbiForm.error = 'Please select an existing fork';
      return;
    }

    if (!isValidAddress(newAbiForm.contractAddress)) {
      newAbiForm.error = 'Contract address is required';
      return;
    }

    if (
      anvilStore.instances.find(instance => instance.port === newAbiForm.port)
    ) {
      newAbiForm.error = 'Invalid port number, Port already in use';
      return;
    }

    if (!newAbiForm.useExistingNode) {
      const portNumber = newAbiForm.port.toString();
      const existingTab = forkStore.tabs.find(
        tab => tab.port.toString() === portNumber
      );
      if (existingTab) {
        newAbiForm.error = `Port ${portNumber} is already in use by another tab`;
        return;
      }
    }

    forkStore.isLoading = true;
    newAbiForm.error = '';
    const tabId = uuidv4();
    const requestId = uuidv4();

    let selectedFork = null;
    if (newAbiForm.useExistingNode && selectedForkId.value) {
      const port = selectedForkId.value.split(':')[2] || selectedForkId.value;
      selectedFork = anvilStore.instances.find(
        instance => instance.port === port
      );
      if (!selectedFork) {
        newAbiForm.error = 'Selected fork not found';
        forkStore.isLoading = false;
        return;
      }
    }

    const newTab: AbiTab = {
      id: tabId,
      title: `${formatAddress(newAbiForm.contractAddress)}`,
      contractName: newAbiForm.contractAddress,
      contractAddress: newAbiForm.contractAddress,
      nodeUrl: newAbiForm.useExistingNode
        ? selectedFork
          ? selectedFork.nodeUrl
          : ''
        : newAbiForm.nodeUrl,
      parsedAbi: JSON.parse(newAbiForm.customAbi),
      isConnected: newAbiForm.useExistingNode,
      isLoading: !newAbiForm.useExistingNode,
      port: newAbiForm.useExistingNode
        ? selectedFork
          ? selectedFork.port
          : '0'
        : newAbiForm.port,
      error: '',
      transactions: [],
      validationWarnings: [...newAbiForm.validationWarnings],
      accounts: [],
      useExistingNode: newAbiForm.useExistingNode,
      parentForkId: newAbiForm.useExistingNode ? selectedForkId.value : '',
    };

    if (newAbiForm.useExistingNode) {
      forkStore.tabs.push(newTab);
      forkStore.sendMessage('connectToExistingNode', {
        nodeUrl: selectedFork ? selectedFork.nodeUrl : '',
        requestId,
        tabId,
        contractAddress: newAbiForm.contractAddress,
        port: selectedFork ? selectedFork.port : '0',
        parentForkId: selectedForkId.value,
      });
      resetNewAbiForm();
    } else {
      forkStore.pendingTabs.push(newTab);
      forkStore.registerRequest(requestId, tabId, '_connect');
      try {
        const t = JSON.stringify({
          nodeUrl: newAbiForm.nodeUrl,
          requestId,
          tabId,
          port: newAbiForm.port,
        });
        forkStore.sendMessage('forkNode', {
          nodeUrl: newAbiForm.nodeUrl,
          requestId,
          tabId,
          port: newAbiForm.port,
        });
      } catch (error) {
        vscode.postMessage(`Error forking node ${(error as Error).toString()}`);
      }
      setTimeout(() => {
        forkStore.isLoading = false;
        forkStore.pendingTabs[forkStore.pendingTabs.length - 1].error =
          'Error creating fork';
      }, 30000);
    }
  };

  const executeFunction = (
    functionName: string,
    params: any[],
    inputs: Array<Function>,
    type: string
  ): void => {
    if (!activeTab.value) return;

    const tabId = activeTab.value.id;
    const requestId = uuidv4();
    const tabIndex = forkStore.tabs.findIndex(
      (tab: AbiTab) => tab.id === tabId
    );
    if (tabIndex >= 0) {
      forkStore.tabs[tabIndex].executingFunctionId = functionName;
      forkStore.tabs[tabIndex].error = '';
    }

    forkStore.registerRequest(requestId, tabId, functionName);
    forkStore.sendMessage('executeFunction', {
      nodeUrl: activeTab.value.nodeUrl,
      contractAddress: activeTab.value.contractAddress,
      functionName,
      abi: inputs,
      params: params,
      caller: tabId,
      msgSender: walletStore.activeWallet,
      staticCall: type.includes('view') || type.includes('pure'),
    });
  };

  const switchTab = (tabId: string): void => {
    activeTabId.value = tabId;
    showAddTab.value = false;
    activeFunctionType.value = 'read';
    pendingPasteFieldId.value = '';
    pasteValue.value = '';
  };

  const switchFunctionType = (type: string): void => {
    activeFunctionType.value = type;
  };

  const closeTab = (tabId: string): void => {
    const index = forkStore.tabs.findIndex((tab: AbiTab) => tab.id === tabId);
    if (index === -1) return;

    const tab = forkStore.tabs[index];

    if (!tab.useExistingNode && tab.port) {
      forkStore.sendMessage('terminateFork', {
        port: tab.port,
        tabId: tabId,
      });
    }

    forkStore.tabs.splice(index, 1);

    // If we closed the active tab
    if (activeTabId.value === tabId) {
      if (forkStore.tabs.length > 0) {
        // Switch to the first available tab
        activeTabId.value = forkStore.tabs[0].id;
        showAddTab.value = false;
      } else {
        // No tabs left, show the add form
        activeTabId.value = '';
        showAddTab.value = true;
      }
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  const downloadABI = () => {
    forkStore.downloadABI(newAbiForm.contractAddress);
  };

  const toggleExistingNode = (value: boolean) => {
    newAbiForm.useExistingNode = value;
    if (value) {
      selectedForkId.value = '';
    }
  };

  const copyToClipboard = (item: any) => {
    forkStore.sendMessage('writeClipboard', item);
  };

  watch(
    () => forkStore.tabs.length,
    newLength => {
      if (newLength === 0) {
        showAddTab.value = true;
        activeTabId.value = '';
      } else if (newLength > 0 && !activeTabId.value) {
        activeTabId.value = forkStore.tabs[0].id;
        showAddTab.value = false;
      }
    },
    { immediate: true }
  );

  watch(
    () => forkStore.abiInput,
    newContent => {
      if (newContent) {
        newAbiForm.customAbi = newContent;
        validateAbi();
      }
    }
  );

  watch(
    () => forkStore.nodeURLInput,
    newContent => {
      if (newContent) {
        newAbiForm.nodeUrl = newContent;
      }
    }
  );

  watch(
    () => forkStore.portInput,
    newContent => {
      if (newContent) {
        newAbiForm.port = newContent;
      }
    }
  );

  watch(
    () => forkStore.contractAddressInput,
    newContent => {
      if (newContent) {
        newAbiForm.contractAddress = newContent;
      }
    }
  );

  watch(
    () => forkStore.tabs,
    (newTabs, oldTabs) => {
      if (
        newTabs.length > oldTabs.length ||
        newTabs.some((tab, index) => {
          const oldTab = oldTabs[index];
          return oldTab && !oldTab.isConnected && tab.isConnected;
        })
      ) {
        const latestConnectedTab = newTabs
          .filter(tab => tab.isConnected)
          .sort((a, b) => {
            const aIndex = newTabs.indexOf(a);
            const bIndex = newTabs.indexOf(b);
            return bIndex - aIndex;
          })[0];

        if (latestConnectedTab && !activeTab.value) {
          activeTabId.value = latestConnectedTab.id;
          showAddTab.value = false;
        }
      }
    },
    { deep: true }
  );

  watch(
    () => forkStore.lastForkMessage,
    (message: MessageResponse | null) => {
      if (!message || !message.payload) return;

      if (
        message.type === 'forkNodeResponse' ||
        message.type === 'connectToExistingNodeResponse'
      ) {
        const tabId = message.payload.tabId;
        if (!tabId) return;

        if (message.payload.success) {
          const tabIndex = forkStore.tabs.findIndex(tab => tab.id === tabId);
          if (tabIndex >= 0) {
            activeTabId.value = tabId;
            showAddTab.value = false;
            activeFunctionType.value = 'read';
          }
          resetNewAbiForm();
        } else {
          resetNewAbiForm();
          showAddTab.value = true;
          forkStore.isLoading = false;
        }
      }
    },
    { deep: true }
  );

  watch(
    () => forkStore.downloadedABI,
    downloadedABI => {
      if (downloadedABI) {
        newAbiForm.customAbi = downloadedABI;
      }
    }
  );

  watch(
    () => selectedForkId.value,
    newForkId => {
      if (newForkId && newAbiForm.useExistingNode) {
        const selectedFork = anvilStore.instances.find(
          instance => instance.port === newForkId
        );
        if (selectedFork) {
          newAbiForm.nodeUrl = selectedFork.nodeUrl;
        }
      }
    }
  );
</script>

<template>
  <div class="abi-explorer">
    <TabBar
      :tabs="forkStore.tabs"
      :activeTabId="activeTabId"
      @switch-tab="switchTab"
      @close-tab="closeTab"
      @add-tab="addNewTab"
    />

    <div class="tab-content-area">
      <NewABIForm
        v-if="shouldShowAddForm"
        :formData="newAbiForm"
        :selectedForkId="selectedForkId"
        :availableForks="availableForks"
        :isLoading="forkStore.isLoading"
        :isPasteAddressLoading="forkStore.isPasteAddressLoading"
        :isNodeURLLoading="forkStore.isNodeURLLoading"
        :isPortPasteLoading="forkStore.isPortPasteLoading"
        :forkError="forkStore.forkError"
        @paste-field="pasteToField"
        :isDownloadingAbi="forkStore.isDownloadingAbi"
        @paste-abi="pasteABI"
        @upload-file="handleFileUpload"
        @connect="connectToFork"
        @download-abi="downloadABI"
        @toggle-existing-node="toggleExistingNode"
        @update:selectedForkId="selectedForkId = $event"
      />

      <ContractInterface
        v-else
        :activeTab="activeTab!"
        :readFunctions="readFunctions"
        :writeFunctions="writeFunctions"
        :displayedFunctions="displayedFunctions"
        :activeFunctionType="activeFunctionType"
        :pendingPasteFieldId="pendingPasteFieldId"
        :pasteValue="pasteValue"
        :onFunctionPanelPaste="handleFunctionPanelPaste"
        :inputValues="inputValues"
        :formatTimestamp="formatTimestamp"
        :loadingStates="loadingStates"
        @switch-function-type="switchFunctionType"
        @execute-function="executeFunction"
        @copy-to-clipboard="copyToClipboard"
      />
    </div>

    <div
      v-if="
        (forkStore.isLoading &&
          !forkStore.isPasteAddressLoading &&
          !forkStore.isNodeURLLoading &&
          !forkStore.isPortPasteLoading) ||
        (activeTab && activeTab.isLoading && !activeTab.executingFunctionId)
      "
      class="loading-overlay"
    >
      <div class="loading-content">
        <div class="spinner-large"></div>
        <p>Processing request...</p>
      </div>
    </div>
  </div>
</template>

<style>
  .abi-explorer {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    background-color: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    box-sizing: border-box;
  }

  .tab-content-area {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    box-sizing: border-box;
  }

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .loading-content {
    background-color: var(--vscode-editor-background);
    padding: 2rem;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    border: 1px solid var(--vscode-widget-border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .spinner-large {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--vscode-progressBar-background);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .abi-explorer {
      height: 100vh;
    }

    .tab-content-area {
      padding: 0.5rem;
    }

    .loading-content {
      margin: 1rem;
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .tab-content-area {
      padding: 0.25rem;
    }
  }
</style>
