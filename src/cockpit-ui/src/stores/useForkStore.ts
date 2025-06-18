import { defineStore } from 'pinia';
import { vscode } from '../utils/vscode';
import { useAnvilStore } from './useAnvilStore';
import type {
  PendingRequest,
  Message,
  MessageResponse,
  AbiTab,
  FunctionCallResponse,
} from '../types';
import { ClipboardTypeCommand } from '../utils';

export const useForkStore = defineStore('useForkStore', {
  state: () => ({
    downloadedABI: '',
    downloadABIError: '',
    clipboardContent: {} as Record<string, string>,
    tabs: [] as AbiTab[],
    pendingTabs: [] as AbiTab[],
    pendingRequests: [] as PendingRequest[],
    abiInput: '' as string,
    nodeURLInput: '' as string,
    portInput: '' as string,
    contractAddressInput: '' as string,
    isLoading: false,
    lastMessage: null as MessageResponse | null,
    lastForkMessage: null as MessageResponse | null,
    latestResponse: null as Message | null | MessageResponse,
    isPasteAddressLoading: false,
    isNodeURLLoading: false,
    isPortPasteLoading: false,
    isFunctionExecutionLoading: false,
    isDownloadingAbi: false,
    forkError: '' as string,
  }),

  getters: {
    anvilInstances() {
      const anvilStore = useAnvilStore();
      return anvilStore.instances;
    },

    getForkByPort: state => (port: string) => {
      const anvilStore = useAnvilStore();
      return anvilStore.instances.find(instance => instance.port === port);
    },

    runningForks() {
      const anvilStore = useAnvilStore();
      return anvilStore.instances.filter(
        instance => instance.status === 'running'
      );
    },
  },

  actions: {
    registerRequest(
      requestId: string,
      tabId: string,
      functionName: string
    ): void {
      this.pendingRequests.push({
        id: requestId,
        tabId,
        functionName,
        timestamp: Date.now(),
      });
    },

    sendMessage(command: string, payload: any): void {
      this.isFunctionExecutionLoading = true;
      vscode.postMessage({
        command,
        payload:
          typeof payload === 'object' && payload !== null
            ? JSON.stringify(payload, null, 2)
            : String(payload || ''),
      });
    },

    readClipboard(from: string): void {
      switch (from) {
        case ClipboardTypeCommand.ReadPortCommand:
          this.isPortPasteLoading = true;
          break;
        case ClipboardTypeCommand.ReadNodeUrlCommand:
          this.isNodeURLLoading = true;
          break;
        case ClipboardTypeCommand.ReadContractAddressCommand:
          this.isPasteAddressLoading = true;
          break;
        case ClipboardTypeCommand.ReadAbiCommand:
          this.isLoading = true;
          break;
      }

      this.sendMessage(ClipboardTypeCommand.ReadClipboard, from);
    },

    setClipboardContent(message: MessageResponse): void {
      const trimmedPayLoad = JSON.parse(message.payload);
      switch (message.previousPayload) {
        case ClipboardTypeCommand.ReadPortCommand:
          this.portInput = trimmedPayLoad;
          this.isPortPasteLoading = false;
          break;
        case ClipboardTypeCommand.ReadAbiCommand:
          this.abiInput = trimmedPayLoad;
          break;
        case ClipboardTypeCommand.ReadNodeUrlCommand:
          this.nodeURLInput = trimmedPayLoad;
          this.isNodeURLLoading = false;
          break;
        case ClipboardTypeCommand.ReadContractAddressCommand:
          this.contractAddressInput = trimmedPayLoad;
          this.isPasteAddressLoading = false;
          break;
        default:
          if (message.previousType?.includes('functionPanelInput_')) {
            this.clipboardContent[message.previousType] = trimmedPayLoad;
          }
      }

      this.isLoading = false;
    },

    setForkResponse(message: MessageResponse): void {
      this.isLoading = false;

      this.pendingRequests = this.pendingRequests.filter(
        request => request.id !== message.payload.id
      );

      if (!message.payload.success) {
        this.forkError =
          'Failed to create fork. Please check your inputs and try again.';
        this.pendingTabs.pop();
        return;
      }

      if (this.pendingTabs.length > 0) {
        const tab = this.pendingTabs[this.pendingTabs.length - 1];
        this.tabs.push({
          ...tab,
          isLoading: false,
          isConnected: true,
          nodeUrl: `http://localhost:${tab.port}`,
        });
        this.pendingTabs.pop();
      }

      this.lastForkMessage = message;
      this.resetState();
    },

    setFunctionResponse(response: MessageResponse) {
      const transaction = response.payload as FunctionCallResponse;
      this.isFunctionExecutionLoading = false;

      const tabIndex = this.tabs.findIndex(
        (tab: AbiTab) => tab.id === transaction.caller
      );
      if (tabIndex === -1) {
        return;
      }

      const tab = this.tabs[tabIndex];
      tab.executingFunctionId = '';

      if (transaction.status) {
        tab.transactions.unshift(transaction);

        if (transaction.functionName !== undefined) {
          tab.functionResults = tab.functionResults || {};
          tab.functionResults[transaction.functionName] = transaction.result;
        }
      } else {
        tab.error = transaction.result || 'Function execution failed';

        tab.transactions.unshift({
          hash: transaction.hash || '0x0',
          functionName: transaction.functionName,
          params: transaction.params || [],
          timestamp: new Date().toISOString(),
          status: false,
          result: transaction.result,
          caller: transaction.caller,
          logs: [],
          address: '',
          contractName: transaction.contractName,
          nodeUrl: transaction.nodeUrl,
        });
      }
    },

    resetState(): void {
      this.abiInput = '';
      this.nodeURLInput = '';
      this.portInput = '';
      this.contractAddressInput = '';
      this.isLoading = false;
      this.isPasteAddressLoading = false;
      this.isNodeURLLoading = false;
      this.isPortPasteLoading = false;
      this.forkError = '';
    },
    clearForkError(): void {
      this.forkError = '';
    },
    terminateFork(port: string, tabId: string): void {
      const anvilStore = useAnvilStore();
      const tabIndex = this.tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex !== -1) {
        this.tabs.splice(tabIndex, 1);
      }
      anvilStore.stopAnvilInstance(port);
    },

    async downloadABI(contractAddress: string) {
      this.isDownloadingAbi = true;
      try {
        const response = await fetch(`https://abidata.net/${contractAddress}`);

        if (!response.ok) {
          this.isDownloadingAbi = false;
          this.downloadABIError = `No ABI found for this contract address API returned error: ${response.status}`;
          return;
        }

        const data = await response.json();
        if (data.abi) {
          this.downloadedABI = JSON.stringify(data.abi, null, 2);
        } else {
          this.downloadABIError = 'No ABI found for this contract address';
        }
      } catch (error) {
        this.downloadABIError =
          (error as Error).message.toString() || 'Failed to download ABI';
      } finally {
        this.isDownloadingAbi = false;
      }
    },
  },
});
