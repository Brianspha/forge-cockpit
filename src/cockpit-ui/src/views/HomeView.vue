<script setup lang="ts">
  import {
    ref,
    computed,
    onMounted,
    inject,
    watch,
    type Ref,
    ComponentPublicInstance,
    provide,
    reactive,
  } from 'vue';
  import ContractList from '../components/contract/ContractList.vue';
  import EmptyState from '../components/state/EmptyState.vue';
  import ContractDetails from '../components/contract/ContractDetails.vue';
  import ScriptDetails from '../components/script/ScriptDetails.vue';
  import FunctionPanel from '../components/functions/FunctionPanel.vue';
  import LoadingSpinner from '../components/spinners/LoadingSpinner.vue';
  import ForkContractView from './fork/ForkContractView.vue';
  import AbiEncoder from '../components/encoder/AbiEncoder.vue';
  import DeploymentModal from '../components/contract/DeploymentModal.vue';
  import AnvilModal from '../components/contract/AnvilModal.vue';
  import Shimmer from '../components/state/Shimmer.vue';
  import type {
    ABI,
    ActiveContractTab,
    AnvilModalExposed,
    DeployContract,
    DeployInputType,
    ForkInfo,
    Function,
    DeployedContract,
    ScriptResponse,
    AbiInputData,
    EncodeResponse,
    TransferResponse,
    TokenInfoResponse,
    ActiveContractTypeTab,
  } from '../types';
  import { useForkStore } from '../stores/useForkStore';
  import { useWalletStore } from '../stores/useWalletStore';
  import { useAnvilStore } from '../stores/useAnvilStore';
  import {
    getContractId,
    ForgeCockPitResponseCommand,
    WebviewCommand,
    ClipboardTypeCommand,
  } from '../utils';
  import { useAppStore } from '../stores/useAppstore';
  import { useContractStore } from '../stores/useContractStore';

  const latestMessage = inject<Ref<any>>('latestMessage');
  const showForkInterface = ref(false);
  const showDeploymentModal = ref(false);
  const showAnvilModal = ref(false);
  const contractToDeploy = ref<string>('');
  const constructorArgs = ref<Function | null>(null);
  const searchQuery = ref<string>('');
  const isDeploying = ref<{ [name: string]: boolean }>({});
  const isRunningScript = ref<{ [name: string]: boolean }>({});
  const activeTab = ref<ActiveContractTypeTab>('regular');
  const activeFunctionTab = ref<ActiveContractTab>('readFunctions');
  const isAbiCopied = ref(false);
  const currentABI = ref<ABI>([]);
  const scriptDeployedContracts = ref<{ [scriptName: string]: any[] }>({});

  const appStore = useAppStore();
  const contractStore = useContractStore();
  const forkStore = useForkStore();
  const walletStore = useWalletStore();
  const anvilStore = useAnvilStore();

  const deploymentClipboardContent = ref<{ nodeUrl?: string; port?: string }>(
    {}
  );
  const deploymentLoadingStates = ref<{ nodeUrl?: boolean; port?: boolean }>(
    {}
  );
  const constructorClipboardContent = ref<Record<string, string>>({});
  const constructorLoadingStates = ref<Record<string, boolean>>({});

  const functionInputValues = reactive<Record<string, string>>({});
  const functionLoadingStates = reactive<Record<string, boolean>>({});

  const encoderInputValues = reactive<Record<string, string>>({});
  const encoderLoadingStates = reactive<Record<string, boolean>>({});
  const encodedResults = reactive<Record<string, string>>({});
  const encodedErrors = reactive<Record<string, string>>({});

  const isAnvilCreating = ref(false);
  const selectedNodeUrl = ref<string>('');
  const anvilModalRef = ref<ComponentPublicInstance<AnvilModalExposed> | null>(
    null
  );

  provide('functionInputValues', functionInputValues);
  provide('functionLoadingStates', functionLoadingStates);

  const onShowForkContract = () => {
    showForkInterface.value = !showForkInterface.value;
  };

  const selectedContract = computed(() => {
    if (!contractStore.selectedContractId) return null;

    return (
      activeContracts.value.find(
        c => c.fileName === contractStore.selectedContractId
      ) || null
    );
  });

  const filteredContracts = computed(() => {
    if (!searchQuery.value.trim()) return contractStore.contracts;
    const query = searchQuery.value.toLowerCase().trim();
    return contractStore.contracts.filter(contract =>
      contract.fileName.toLowerCase().includes(query)
    );
  });

  const contractCountByType = (contractType: 'regular' | 'script') => {
    return filteredContracts.value.filter(contract => {
      if (!contract.abi) return false;

      const hasIS_SCRIPT = contract.abi.some(
        func => func.type === 'function' && func.name === 'IS_SCRIPT'
      );

      const hasIS_TEST = contract.abi.some(
        func => func.type === 'function' && func.name === 'IS_TEST'
      );

      if (contractType === 'script') {
        return hasIS_SCRIPT && contract.fileName !== 'Script';
      } else {
        return !hasIS_TEST && !hasIS_SCRIPT;
      }
    }).length;
  };

  const activeContracts = computed(() => {
    return filteredContracts.value.filter(contract => {
      if (!contract.abi) return false;

      const isScript = contract.abi.some(
        func => func.type === 'function' && func.name === 'IS_SCRIPT'
      );

      const isTest = contract.abi.some(
        func => func.type === 'function' && func.name === 'IS_TEST'
      );

      if (activeTab.value === 'script') {
        return isScript && contract.fileName !== 'Script';
      } else {
        return !isTest && !isScript;
      }
    });
  });

  const getDeploymentInfo = (contractId: string) => {
    return (
      contractStore.deployedContracts.find(
        contract => contract.contractName == contractId
      ) || null
    );
  };

  const getScriptDeployedContracts = (scriptName: string) => {
    return scriptDeployedContracts.value[scriptName] || [];
  };

  const groupFunctionsByType = (abi: ABI | undefined) => {
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

  const onShowDeploymentModal = () => {
    showDeploymentModal.value = !showDeploymentModal.value;
  };

  const openDeploymentModal = (config: DeployContract) => {
    contractToDeploy.value = config.contractName;
    selectedNodeUrl.value = config.nodeUrl;

    Object.keys(constructorClipboardContent.value).forEach(key => {
      delete constructorClipboardContent.value[key];
    });
    Object.keys(constructorLoadingStates.value).forEach(key => {
      delete constructorLoadingStates.value[key];
    });

    const foundContract = filteredContracts.value.find(
      contract => contract.fileName === config.contractName
    );

    if (foundContract && foundContract.abi) {
      constructorArgs.value =
        foundContract.abi.find(func => func.type === 'constructor') || null;
    } else {
      constructorArgs.value = null;
    }

    showDeploymentModal.value = true;
  };

  const openAnvilModal = () => {
    showAnvilModal.value = true;
  };

  const handleDeployment = (config: DeployContract) => {
    contractToDeploy.value = config.contractName;
    isDeploying.value[config.contractName] = true;
    contractStore.deployContract(WebviewCommand.DeployContractCommand, {
      ...config,
      msgSender: walletStore.activeWallet,
    });

    setTimeout(() => {
      if (contractToDeploy.value) {
        isDeploying.value[contractToDeploy.value] = false;
        showDeploymentModal.value = false;
        contractStore.setContractDeploymentResults({
          payload: { success: false, contractName: config.contractName },
          command: '',
          previousType: '',
          type: '',
          tabId: '',
          previousPayload: '',
        });
      }
    }, 60000);
  };

  const handleRunScript = (config: DeployContract) => {
    isRunningScript.value[config.contractName] = true;
    contractStore.runScript(WebviewCommand.RunScriptCommand, {
      ...config,
      msgSender: walletStore.activeWallet,
    });

    setTimeout(() => {
      if (isRunningScript.value[config.contractName]) {
        isRunningScript.value[config.contractName] = false;
      }
    }, 120000);
  };

  const handleOpenLink = (url: string) => {
    appStore.sendMessage(WebviewCommand.OpenLinkCommand, url);
  };

  const handleCreateAnvilInstance = (config: ForkInfo) => {
    isAnvilCreating.value = true;
    anvilStore.createAnvilInstance(config);

    setTimeout(() => {
      isAnvilCreating.value = false;
    }, 20000);
  };

  const copyToClipboard = (item: any) => {
    try {
      appStore.sendMessage(WebviewCommand.WriteClipboardCommand, item);
      isAbiCopied.value = true;
      setTimeout(() => {
        isAbiCopied.value = false;
      }, 2000);
    } catch (error) {
      appStore.sendMessage(
        `Error copying to clipboard: ${(error as Error).message}`,
        undefined
      );
    }
  };

  const refreshContracts = () => {
    contractStore.refreshContracts();
  };

  const executeFunction = (
    functionName: string,
    contractName: string,
    params: any[] = [],
    contractAddress: string,
    staticCall: boolean = false
  ) => {
    contractStore.executeFunction({
      functionName,
      contractName,
      params,
      contractAddress,
      staticCall,
      msgSender: walletStore.activeWallet,
      caller:
        activeTab.value === 'script' ? 'ScriptDetails' : 'ContractDetails',
      nodeUrl: selectedNodeUrl.value,
      abi:
        activeTab.value === 'script'
          ? currentABI.value.filter(item => item.name === functionName)
          : selectedContract.value?.abi
            ? selectedContract.value.abi.filter(
                item => item.name === functionName
              )
            : [],
      bytecode: '',
    });
  };

  const handleDeploymentPaste = (fieldName: DeployInputType) => {
    deploymentLoadingStates.value = {
      ...deploymentLoadingStates.value,
      [fieldName]: true,
    };

    appStore.sendMessage(
      `${ClipboardTypeCommand.ReadClipboardAnvilCommand}:${fieldName}`,
      fieldName
    );

    setTimeout(() => {
      if (deploymentLoadingStates.value[fieldName]) {
        deploymentLoadingStates.value[fieldName] = false;
      }
    }, 5000);
  };

  const handleConstructorPaste = (fieldId: string) => {
    constructorLoadingStates.value = {
      ...constructorLoadingStates.value,
      [fieldId]: true,
    };

    appStore.sendMessage(
      `${ClipboardTypeCommand.ReadClipboardConstructorArgsCommand}:constructor:${fieldId}`,
      fieldId
    );

    setTimeout(() => {
      if (constructorLoadingStates.value[fieldId]) {
        constructorLoadingStates.value[fieldId] = false;
      }
    }, 5000);
  };

  const handleFunctionInputPaste = (fieldId: string) => {
    functionLoadingStates[fieldId] = true;

    appStore.sendMessage(
      `${ClipboardTypeCommand.ReadClipboardFunctionInputCommand}:function:${fieldId}`,
      fieldId
    );

    setTimeout(() => {
      if (functionLoadingStates[fieldId]) {
        functionLoadingStates[fieldId] = false;
      }
    }, 5000);
  };

  const handleEncoderPaste = (fieldId: string) => {
    encoderLoadingStates[fieldId] = true;

    appStore.sendMessage(
      ClipboardTypeCommand.ReadClipboardEncoderCommand,
      fieldId
    );

    setTimeout(() => {
      encoderLoadingStates[fieldId] = false;
    }, 5000);
  };

  const handleEncodeFunction = (input: AbiInputData) => {
    appStore.sendMessage(WebviewCommand.AbiEncodeCommand, input);
  };

  const updateFunctionInput = (fieldId: string, value: string) => {
    functionInputValues[fieldId] = value;
  };

  const updateEncoderInput = (fieldId: string, value: string) => {
    encoderInputValues[fieldId] = value;
  };

  const handleNetworkSelection = (networkUrl: string) => {
    selectedNodeUrl.value = networkUrl;
  };

  const handleNetworkRemoval = (port: string) => {
    anvilStore.sendMessage(WebviewCommand.StopNodeCommand, port);
  };

  const onChangeTab = (tab: ActiveContractTypeTab) => {
    activeTab.value = tab;
    if (tab !== 'encoder' && activeContracts.value.length > 0) {
      contractStore.selectedContractId = getContractId(
        activeContracts.value[0].fileName
      );
    }
  };

  const setCurrentABI = (contract: DeployedContract) => {
    currentABI.value = contractStore.getContractABI(contract.contractName);
  };

  const handleExtensionMessage = (message: any) => {
    switch (message.type) {
      case ForgeCockPitResponseCommand.TransferResponse:
        const transfer = JSON.parse(message.payload) as TransferResponse;
        walletStore.setTransferResponse(transfer);
        appStore.sendMessage(WebviewCommand.WalletBalancesCommand, {
          wallets: walletStore.availableWallets,
          nodeUrl: walletStore.lastNodeUrl,
        });
        break;
      case ForgeCockPitResponseCommand.TokenInfoResponse:
        walletStore.setTokenInfoResponse(message.payload as TokenInfoResponse);
        break;
      case ForgeCockPitResponseCommand.GetDefaultWalletsResponse:
        walletStore.setWalletsResponse(message);
        break;
      case ForgeCockPitResponseCommand.StopNodeResponse:
        const stopped = message.payload as boolean;
        if (stopped) {
          const fileName = selectedContract.value?.fileName;
          if (fileName) {
            contractStore.removeContract(fileName);
          }
        }
        break;
      case ForgeCockPitResponseCommand.GetActiveNodesResponse:
        anvilStore.setActivePorts(message);
        break;
      case ForgeCockPitResponseCommand.DeployContractResponse:
        contractStore.setContractDeploymentResults(message);
        isDeploying.value[contractToDeploy.value] = false;
        break;
      case ForgeCockPitResponseCommand.RunScriptResponse:
        const scriptResults = JSON.parse(message.payload) as ScriptResponse;
        if (scriptResults.success) {
          scriptDeployedContracts.value[scriptResults.scriptName] =
            scriptResults.contracts;

          isRunningScript.value[scriptResults.scriptName] = false;
          contractStore.setScriptExecutionResults(scriptResults);
        }
        break;
      case ForgeCockPitResponseCommand.ExecuteFunctionResponse:
        contractStore.setFunctionExecutionResponse(message);
        forkStore.setFunctionResponse(message);
        break;
      case ForgeCockPitResponseCommand.WalletBalancesResponse:
        walletStore.setBalanceResponse(message);
        break;
      case ForgeCockPitResponseCommand.ForkNodeResultsResponse:
        forkStore.setForkResponse(message);
        anvilStore.setAnvilResponse(message);
        isAnvilCreating.value = false;
        if (anvilModalRef.value) {
          if (message.payload?.success) {
            anvilModalRef.value.handleCreationSuccess();
          } else {
            anvilModalRef.value.handleCreationFailure(
              message.payload?.error || 'Failed to create Anvil instance'
            );
          }
        }
        break;
      case ForgeCockPitResponseCommand.AbiEncodeResponse:
        const encodeData = JSON.parse(message.payload) as EncodeResponse;
        if (encodeData.functionName) {
          if (encodeData.success) {
            encodedResults[encodeData.functionName] = encodeData.data;
          } else {
            encodedErrors[encodeData.functionName] =
              encodeData.error || 'Encoding failed';
          }
        }
        break;
      case ForgeCockPitResponseCommand.ClipboardContentResponse:
        const payload = JSON.parse(message.payload);
        if (
          message.previousType?.includes(
            ClipboardTypeCommand.ReadWalletImportCommand
          ) ||
          message.previousType?.includes(
            ClipboardTypeCommand.ReadTransferCommand
          )
        ) {
          walletStore.setClipboardContent(message);
        } else if (
          message.previousType?.includes(
            ClipboardTypeCommand.ReadClipboardAnvilCommand
          )
        ) {
          const fieldName = message.previousType.split(':')[1];
          deploymentClipboardContent.value = {
            ...deploymentClipboardContent.value,
            [fieldName]: payload,
          };
          deploymentLoadingStates.value = {
            ...deploymentLoadingStates.value,
            [fieldName]: false,
          };
        } else if (
          message.previousType?.includes(
            ClipboardTypeCommand.ReadClipboardConstructorArgsCommand
          )
        ) {
          const fieldId = message.previousType.split(':')[2];
          constructorClipboardContent.value = {
            ...constructorClipboardContent.value,
            [fieldId]: payload,
          };
          constructorLoadingStates.value = {
            ...constructorLoadingStates.value,
            [fieldId]: false,
          };
        } else if (
          message.previousType?.includes(
            ClipboardTypeCommand.ReadClipboardFunctionInputCommand
          )
        ) {
          const fieldId = message.previousType.split(':')[2];
          functionInputValues[fieldId] = payload;
          functionLoadingStates[fieldId] = false;
        } else if (
          message.previousType?.includes(
            ClipboardTypeCommand.ReadClipboardEncoderCommand
          )
        ) {
          encoderInputValues[message.previousPayload] = payload;
          encoderLoadingStates[message.previousPayload] = false;
        } else {
          forkStore.setClipboardContent(message);
        }
        break;
      case ForgeCockPitResponseCommand.SetContractsResponse:
        contractStore.setContracts(message);
        break;
    }
  };

  if (latestMessage) {
    watch(latestMessage, newMessage => {
      if (newMessage) {
        handleExtensionMessage(newMessage);
      }
    });
  }

  onMounted(() => {
    contractStore.refreshContracts();
    anvilStore.sendMessage(WebviewCommand.GetActiveNodesCommand, '');
    setTimeout(() => {
      onChangeTab(activeTab.value);
    }, 100);
  });
</script>

<template>
  <div class="abi-explorer">
    <header class="header">
      <h1>Forge CockPit</h1>
      <div class="actions">
        <button
          class="action-button fork-button"
          @click="onShowForkContract"
          title="Import & interact with external contracts via forked nodes"
        >
          {{ showForkInterface ? 'Back to Contracts' : 'Fork Contract' }}
        </button>

        <button
          class="action-button refresh-button"
          @click="refreshContracts"
          :disabled="contractStore.isLoading"
        >
          <span v-if="contractStore.isLoading">
            <LoadingSpinner size="small" />
            Refreshing...
          </span>
          <span v-else>Refresh Contracts</span>
        </button>
      </div>
    </header>

    <div class="main-container">
      <template v-if="!showForkInterface">
        <div class="contracts-view">
          <div class="contract-tabs">
            <button
              class="tab-button"
              :class="{ active: activeTab === 'regular' }"
              @click="onChangeTab('regular')"
              :disabled="contractStore.isLoading"
            >
              Contracts
              <span class="tab-count">
                {{
                  contractStore.isLoading
                    ? '...'
                    : contractCountByType('regular')
                }}
              </span>
            </button>
            <button
              class="tab-button"
              :class="{ active: activeTab === 'script' }"
              @click="onChangeTab('script')"
              :disabled="contractStore.isLoading"
            >
              Scripts
              <span class="tab-count">
                {{
                  contractStore.isLoading
                    ? '...'
                    : contractCountByType('script')
                }}
              </span>
            </button>
            <button
              class="tab-button"
              :class="{ active: activeTab === 'encoder' }"
              @click="onChangeTab('encoder')"
            >
              ABI Encoder
            </button>
          </div>

          <div class="combined-content">
            <template v-if="activeTab === 'encoder'">
              <main class="content encoder-content">
                <AbiEncoder
                  :inputValues="encoderInputValues"
                  :loadingStates="encoderLoadingStates"
                  :encodedResults="encodedResults"
                  :encoding-errors="encodedErrors"
                  :onPasteField="handleEncoderPaste"
                  @update-input="updateEncoderInput"
                  @encode-function="handleEncodeFunction"
                  @copy-to-clipboard="copyToClipboard"
                />
              </main>
            </template>

            <template v-else-if="contractStore.isLoading">
              <aside class="contract-sidebar shimmer-sidebar">
                <div class="shimmer-contract-list">
                  <div v-for="i in 5" :key="i" class="shimmer-item">
                    <Shimmer
                      height="18px"
                      width="80%"
                      borderRadius="4px"
                      margin="0 0 8px 0"
                    />
                    <div class="shimmer-meta">
                      <Shimmer height="12px" width="40%" borderRadius="4px" />
                      <Shimmer height="12px" width="30%" borderRadius="4px" />
                    </div>
                  </div>
                </div>
              </aside>

              <main class="content shimmer-content">
                <div class="shimmer-details">
                  <div class="shimmer-header">
                    <Shimmer
                      height="24px"
                      width="60%"
                      borderRadius="4px"
                      margin="0 0 16px 0"
                    />
                    <div class="shimmer-actions">
                      <Shimmer height="32px" width="120px" borderRadius="4px" />
                    </div>
                  </div>

                  <div class="shimmer-tabs">
                    <Shimmer
                      height="32px"
                      width="100%"
                      borderRadius="4px"
                      margin="0 0 24px 0"
                    />
                  </div>

                  <div class="shimmer-functions">
                    <div v-for="i in 3" :key="i" class="shimmer-function">
                      <Shimmer
                        height="20px"
                        width="40%"
                        borderRadius="4px"
                        margin="0 0 12px 0"
                      />
                      <Shimmer
                        height="16px"
                        width="90%"
                        borderRadius="4px"
                        margin="0 0 8px 0"
                      />
                      <Shimmer
                        height="16px"
                        width="70%"
                        borderRadius="4px"
                        margin="0 0 24px 0"
                      />
                    </div>
                  </div>
                </div>
              </main>
            </template>

            <template v-else>
              <aside class="contract-sidebar">
                <ContractList
                  :contracts="activeContracts"
                  :activeTab="activeTab"
                  :selectedContractId="contractStore.selectedContractId"
                  :deployedContracts="
                    activeTab === 'script'
                      ? []
                      : contractStore.deployedContracts
                  "
                  @select-contract="contractStore.selectedContractId = $event"
                />
              </aside>

              <main class="content">
                <EmptyState
                  v-if="!selectedContract"
                  title="No Contract Selected"
                  message="Select a contract from the sidebar to view its details and interact with it."
                />

                <ContractDetails
                  v-else-if="activeTab === 'regular'"
                  :contract="selectedContract"
                  :is-deploying="
                    isDeploying[selectedContract.fileName] || false
                  "
                  :deployment-info="
                    getDeploymentInfo(selectedContract.fileName) || undefined
                  "
                  :active-tab="activeFunctionTab"
                  :anvil-instances="anvilStore.instances"
                  @deploy="openDeploymentModal"
                  @change-tab="activeFunctionTab = $event as ActiveContractTab"
                  @open-anvil-modal="openAnvilModal"
                  @copy-address="copyToClipboard"
                  :panelClipboardContent="constructorClipboardContent"
                  @select-network="handleNetworkSelection"
                  @remove-network="handleNetworkRemoval"
                  @show-depoyment-modal="onShowDeploymentModal"
                  :transactions="contractStore.transactions"
                >
                  <template v-slot:readFunctions>
                    <div
                      v-if="
                        selectedContract.abi && selectedContract.abi.length > 0
                      "
                    >
                      <div
                        v-if="
                          groupFunctionsByType(selectedContract.abi).read
                            .length > 0
                        "
                        class="function-group"
                      >
                        <FunctionPanel
                          v-for="func in groupFunctionsByType(
                            selectedContract.abi
                          ).read"
                          :key="func.name"
                          :function="func"
                          :contractAddress="
                            getDeploymentInfo(selectedContract.fileName)
                              ?.address || ''
                          "
                          :transactions="contractStore.transactions"
                          :onPasteField="handleFunctionInputPaste"
                          :inputValues="functionInputValues"
                          :loadingStates="functionLoadingStates"
                          @execute="
                            executeFunction(
                              func.name,
                              selectedContract.fileName,
                              $event,
                              getDeploymentInfo(selectedContract.fileName)
                                ?.address || '',
                              true
                            )
                          "
                          @update-input="updateFunctionInput"
                          @copy-to-clipboard="copyToClipboard"
                        />
                      </div>
                    </div>

                    <EmptyState
                      v-else
                      title="No Read Functions available"
                      message="This contract's ABI doesn't contain any read functions."
                    />
                  </template>

                  <template v-slot:writeFunctions>
                    <div
                      v-if="
                        selectedContract.abi && selectedContract.abi.length > 0
                      "
                    >
                      <div
                        v-if="
                          groupFunctionsByType(selectedContract.abi).write
                            .length > 0
                        "
                        class="function-group"
                      >
                        <FunctionPanel
                          v-for="func in groupFunctionsByType(
                            selectedContract.abi
                          ).write"
                          :key="func.name"
                          :function="func"
                          :contractAddress="
                            getDeploymentInfo(selectedContract.fileName)
                              ?.address || ''
                          "
                          :transactions="contractStore.transactions"
                          :onPasteField="handleFunctionInputPaste"
                          :inputValues="functionInputValues"
                          :loadingStates="functionLoadingStates"
                          @execute="
                            executeFunction(
                              func.name,
                              selectedContract.fileName,
                              $event,
                              getDeploymentInfo(selectedContract.fileName)
                                ?.address || '',
                              false
                            )
                          "
                          @update-input="updateFunctionInput"
                          @copy-to-clipboard="copyToClipboard"
                        />
                      </div>
                    </div>

                    <EmptyState
                      v-else
                      title="No Write Functions Available"
                      message="This contract's ABI doesn't contain any write functions."
                    />
                  </template>

                  <template v-slot:rawAbi>
                    <div
                      v-if="
                        selectedContract.abi && selectedContract.abi.length > 0
                      "
                      class="raw-abi"
                    >
                      <div class="raw-abi-header">
                        <button
                          class="copy-button"
                          @click="copyToClipboard(selectedContract.abi)"
                          :class="{ copied: isAbiCopied }"
                          aria-label="Copy ABI to clipboard"
                        >
                          <span class="copy-icon"></span>
                          <span class="copy-text">
                            {{ isAbiCopied ? 'Copied!' : 'Copy' }}
                          </span>
                        </button>
                      </div>
                      <pre>{{
                        JSON.stringify(selectedContract.abi, null, 2)
                      }}</pre>
                    </div>

                    <EmptyState
                      v-else
                      title="No ABI Available"
                      message="This contract doesn't have an ABI defined."
                    />
                  </template>
                </ContractDetails>

                <ScriptDetails
                  v-else-if="activeTab === 'script'"
                  :contract="selectedContract"
                  :is-running="
                    isRunningScript[selectedContract.fileName] || false
                  "
                  :deployed-contracts="
                    getScriptDeployedContracts(selectedContract.fileName)
                  "
                  :active-tab="activeFunctionTab"
                  :anvil-instances="anvilStore.instances"
                  :currentABI="currentABI"
                  @open-link="handleOpenLink"
                  @run-script="handleRunScript"
                  @change-tab="activeFunctionTab = $event as ActiveContractTab"
                  @open-anvil-modal="openAnvilModal"
                  @copy-address="copyToClipboard"
                  :panelClipboardContent="constructorClipboardContent"
                  @select-network="handleNetworkSelection"
                  @remove-network="handleNetworkRemoval"
                  @paste-panel-constructor-field="handleConstructorPaste"
                  :transactions="contractStore.transactions"
                  @execute-function="
                    (data: any) =>
                      executeFunction(
                        data.functionName,
                        data.contractName,
                        data.params,
                        data.contractAddress,
                        data.staticCall
                      )
                  "
                  @update-input="updateFunctionInput"
                  @copy-to-clipboard="copyToClipboard"
                  @select-deployed-contract="setCurrentABI"
                >
                  <template
                    v-slot:readFunctions="{
                      functions,
                      contractAddress,
                      onExecute,
                      onUpdateInput,
                      onCopyToClipboard,
                    }"
                  >
                    <FunctionPanel
                      v-for="func in functions"
                      :key="func.name"
                      :function="func"
                      :contractAddress="contractAddress"
                      :transactions="contractStore.transactions"
                      :onPasteField="handleFunctionInputPaste"
                      :inputValues="functionInputValues"
                      :loadingStates="functionLoadingStates"
                      @execute="onExecute(func, true)"
                      @update-input="onUpdateInput"
                      @copy-to-clipboard="onCopyToClipboard"
                    />
                  </template>

                  <template
                    v-slot:writeFunctions="{
                      functions,
                      contractAddress,
                      onExecute,
                      onUpdateInput,
                      onCopyToClipboard,
                    }"
                  >
                    <FunctionPanel
                      v-for="func in functions"
                      :key="func.name"
                      :function="func"
                      :contractAddress="contractAddress"
                      :transactions="contractStore.transactions"
                      :onPasteField="handleFunctionInputPaste"
                      :inputValues="functionInputValues"
                      :loadingStates="functionLoadingStates"
                      @execute="onExecute(func, false)"
                      @update-input="onUpdateInput"
                      @copy-to-clipboard="onCopyToClipboard"
                    />
                  </template>
                </ScriptDetails>
              </main>
            </template>
          </div>
        </div>
      </template>

      <main v-else class="fork-content">
        <ForkContractView />
      </main>
    </div>

    <DeploymentModal
      v-if="showDeploymentModal && selectedContract"
      :is-open="showDeploymentModal"
      :contract="selectedContract!"
      :constructor-args="constructorArgs"
      :node-url="selectedNodeUrl"
      :is-deploying="
        contractToDeploy ? isDeploying[contractToDeploy] || false : false
      "
      :clipboard-content="constructorClipboardContent"
      :is-parent-loading="constructorLoadingStates"
      @close="showDeploymentModal = false"
      @deploy="handleDeployment"
      @paste-constructor-field="handleConstructorPaste"
    />

    <AnvilModal
      v-if="showAnvilModal"
      :is-open="showAnvilModal"
      :anvil-instances="anvilStore.instances"
      :clipboard-content="deploymentClipboardContent"
      :is-parent-loading="deploymentLoadingStates"
      @close="showAnvilModal = false"
      @paste-field="handleDeploymentPaste"
      @create-anvil-instance="handleCreateAnvilInstance"
      ref="anvilModalRef"
    />
  </div>
</template>

<style>
  :root {
    --primary-color: var(--vscode-button-background, #0078d4);
    --primary-hover: var(--vscode-button-hoverBackground, #106ebe);
    --primary-active: var(--vscode-button-background, #005a9e);
    --success-color: var(
      --vscode-gitDecoration-addedResourceForeground,
      #0ea5e9
    );
    --error-color: var(--vscode-inputValidation-errorForeground, #ef4444);
    --warning-color: var(--vscode-notificationsWarningIcon-foreground, #f59e0b);
    --bg-color: var(--vscode-editor-background);
    --panel-bg: var(--vscode-sideBar-background);
    --text-color: var(--vscode-editor-foreground);
    --secondary-text: var(--vscode-descriptionForeground);
    --border-color: var(--vscode-panel-border);
    --hover-bg: var(--vscode-list-hoverBackground);
    --selected-bg: var(--vscode-list-activeSelectionBackground);
    --selected-text: var(--vscode-list-activeSelectionForeground);
    --header-height: 48px;
    --border-radius: 4px;
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --shadow-sm: var(--vscode-widget-shadow, 0 1px 2px rgba(0, 0, 0, 0.1));
    --shadow-md: var(--vscode-widget-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
    --shimmer-color: var(--hover-bg, rgba(128, 128, 128, 0.1));
    --shimmer-animation: rgba(255, 255, 255, 0.1);
  }

  .abi-explorer {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  .header {
    height: var(--header-height);
    padding: 0 var(--space-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--vscode-titleBar-border, var(--border-color));
    background-color: var(--vscode-titleBar-activeBackground, var(--bg-color));
    flex-shrink: 0;
  }

  .header h1 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: var(--vscode-titleBar-activeForeground, var(--text-color));
  }

  .actions {
    display: flex;
    gap: var(--space-sm);
    align-items: center;
  }

  .action-button {
    background-color: var(--vscode-button-background, var(--primary-color));
    color: var(--vscode-button-foreground, white);
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    padding: 6px 12px;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    transition: background-color 0.2s;
  }

  .action-button:hover:not(:disabled) {
    background-color: var(
      --vscode-button-hoverBackground,
      var(--primary-hover)
    );
  }

  .action-button:active:not(:disabled) {
    background-color: var(
      --vscode-button-hoverBackground,
      var(--primary-active)
    );
  }

  .action-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
  }

  .main-container {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    height: calc(100vh - var(--header-height) - 1px);
  }

  .contracts-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    height: 100%;
  }

  .contract-tabs {
    display: flex;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--vscode-tab-border, var(--border-color));
    background-color: var(
      --vscode-editorGroupHeader-tabsBackground,
      var(--panel-bg)
    );
  }

  .tab-button {
    padding: var(--space-sm) var(--space-md);
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    background-color: var(--vscode-tab-inactiveBackground, transparent);
    color: var(--vscode-tab-inactiveForeground, var(--text-color));
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    position: relative;
  }

  .tab-button:hover:not(:disabled):not(.active) {
    background-color: var(--vscode-tab-hoverBackground, var(--hover-bg));
    color: var(--vscode-tab-hoverForeground, var(--text-color));
  }

  .tab-button.active {
    background-color: var(--vscode-tab-activeBackground, var(--selected-bg));
    color: var(--vscode-tab-activeForeground, var(--selected-text));
    border-bottom-color: var(--vscode-input-border, var(--border-color));
  }

  .tab-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
  }

  .tab-count {
    background-color: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid var(--vscode-contrastBorder, transparent);
  }

  .combined-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-height: 0;
    height: 100%;
  }

  .contract-sidebar {
    width: 280px;
    flex-shrink: 0;
    border-right: 1px solid var(--vscode-sideBar-border, var(--border-color));
    background-color: var(--vscode-sideBar-background, var(--panel-bg));
    overflow-y: auto;
    height: 100%;
    min-height: 0;
    max-height: 100%;
    display: flex;
    flex-direction: column;
  }

  .contract-sidebar > * {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .content {
    flex: 1;
    overflow: auto;
    padding: var(--space-md);
    min-height: 0;
    background-color: var(--vscode-editor-background);
  }

  .encoder-content {
    padding: 0;
  }

  .shimmer-sidebar {
    padding: var(--space-md);
  }

  .shimmer-contract-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .shimmer-item {
    padding: var(--space-sm) 0;
  }

  .shimmer-meta {
    display: flex;
    gap: var(--space-md);
    margin-top: var(--space-sm);
  }

  .shimmer-content {
    display: flex;
    flex-direction: column;
  }

  .shimmer-details {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .shimmer-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-lg);
  }

  .shimmer-tabs {
    margin-bottom: var(--space-lg);
  }

  .shimmer-functions {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .function-group {
    margin-bottom: var(--space-lg);
  }

  .function-group h3 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--vscode-panel-border, var(--border-color));
    color: var(--vscode-sideBarTitle-foreground, var(--text-color));
  }

  .raw-abi {
    position: relative;
    background-color: var(--vscode-editor-background);
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    padding: var(--space-md);
    overflow: auto;
    max-height: calc(100vh - 200px);
  }

  .raw-abi-header {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
    z-index: 1;
  }

  .copy-button {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    background-color: var(--vscode-button-background, var(--primary-color));
    color: var(--vscode-button-foreground, white);
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    padding: 4px 10px;
    font-size: 12px;
    cursor: pointer;
    transition:
      background-color 0.2s,
      opacity 0.2s;
  }

  .copy-button:hover {
    background-color: var(
      --vscode-button-hoverBackground,
      var(--primary-hover)
    );
  }

  .copy-button:active {
    background-color: var(
      --vscode-button-hoverBackground,
      var(--primary-active)
    );
  }

  .copy-button.copied {
    background-color: var(
      --vscode-gitDecoration-addedResourceForeground,
      var(--success-color)
    );
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
    color: var(--vscode-editor-foreground);
    white-space: pre-wrap;
    word-break: break-word;
    margin-top: var(--space-lg);
  }

  .fork-content {
    flex: 1;
    padding: var(--space-md);
    overflow: auto;
    background-color: var(--vscode-editor-background);
  }

  @media (max-width: 768px) {
    .contract-sidebar {
      width: 100%;
    }

    .combined-content {
      flex-direction: column;
    }

    .header {
      flex-direction: column;
      height: auto;
      padding: var(--space-sm);
      gap: var(--space-sm);
      align-items: flex-start;
    }

    .actions {
      width: 100%;
      justify-content: space-between;
    }

    .action-button {
      flex: 1;
      justify-content: center;
    }

    .copy-button {
      padding: 6px 12px;
    }

    .shimmer-header {
      flex-direction: column;
      gap: var(--space-md);
    }

    .shimmer-actions {
      align-self: flex-end;
    }
  }

  @media (max-width: 480px) {
    .actions {
      flex-direction: column;
      width: 100%;
    }

    .action-button {
      width: 100%;
    }

    .header {
      padding: var(--space-sm);
    }

    .contract-tabs {
      padding: var(--space-sm);
      flex-wrap: wrap;
    }

    .tab-button {
      flex: 1;
      justify-content: center;
      min-width: 80px;
    }

    .copy-button {
      padding: 8px 12px;
    }

    .copy-text {
      display: none;
    }

    .copy-icon {
      width: 16px;
      height: 16px;
    }

    .shimmer-meta {
      flex-direction: column;
      gap: var(--space-sm);
    }
  }
</style>
