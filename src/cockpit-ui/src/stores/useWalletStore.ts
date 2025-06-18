import { defineStore } from 'pinia';
import {
  ClipboardTypeCommand,
  isValidAddress,
  WebviewCommand,
} from '../utils/index';
import { vscode } from '../utils/vscode';
import {
  MessageResponse,
  TokenInfoResponse,
  TransferResponse,
} from '../types/index';

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    showWalletImportCommand: false,
    activeWallet: '',
    wallets: [] as string[],
    balances: {} as Record<string, string>,
    currentTabId: '' as string,
    walletImportLoading: false,
    isWalletImportPasteLoading: false,
    importedWalletAddress: '' as string,
    isLoadingBalances: false,
    isLoadingTokenBalances: false,
    tokenInfoResponse: {} as TokenInfoResponse,
    transferResponse: {} as TransferResponse,
    pastedContent: '' as any,
    lastNodeUrl: '',
  }),
  getters: {
    availableWallets: state => {
      return state.wallets;
    },
    currentWallet: state => {
      return state.activeWallet;
    },
    getBalance: state => (address: string) => {
      return state.balances[address] || '0';
    },
  },
  actions: {
    setActiveWallet(address: string) {
      this.activeWallet = address;
    },
    addCustomWallet(address: string) {
      if (!this.wallets.includes(address) && isValidAddress(address)) {
        this.wallets.push(address);
      }
    },
    removeCustomWallet(address: string) {
      const index = this.wallets.indexOf(address);
      if (index !== -1) {
        this.wallets.splice(index, 1);

        if (this.activeWallet === address) {
          this.activeWallet =
            this.availableWallets.length > 0 ? this.availableWallets[0] : '';
        }
      }
    },
    sendMessage(command: string, payload: any): void {
      switch (command) {
        case WebviewCommand.WalletBalancesCommand:
          this.isLoadingBalances = true;
          break;
      }
      vscode.postMessage({
        command,
        payload:
          typeof payload === 'object' && payload
            ? JSON.stringify(payload, null, 2)
            : String(payload || ''),
      });
    },
    readClipboard(from: string): void {
      let command = '';
      switch (from) {
        case ClipboardTypeCommand.ReadWalletImportCommand:
          this.isWalletImportPasteLoading = true;
          command = ClipboardTypeCommand.ReadClipboardWalletCommand;
          break;
        case ClipboardTypeCommand.ReadTransferCommand:
          command = ClipboardTypeCommand.ReadTransferCommand;
          break;
      }

      vscode.postMessage({
        command,
        payload: from,
      });
    },
    updateBalance(address: string, balance: string) {
      this.balances[address] = balance;
    },
    setClipboardContent(message: MessageResponse): void {
      const parsed = JSON.parse(message.payload).trim();
      switch (message.previousType) {
        case ClipboardTypeCommand.ReadWalletImportCommand:
          this.isWalletImportPasteLoading = false;
          this.addCustomWallet(parsed);
          break;
        default:
          this.pastedContent = parsed;
      }
    },
    setCurrentTab(tabId: string) {
      this.currentTabId = tabId;
    },
    setPastedImportedWallet(address: string) {
      if (!this.wallets.includes(address)) {
        this.wallets.push(address);
      }
    },
    setTokenInfoResponse(info: TokenInfoResponse) {
      this.tokenInfoResponse = info;
    },
    setTransferResponse(info: TransferResponse) {
      vscode.postMessage(`Here: ${info.success}`);
      this.transferResponse = info;
    },
    setWalletsResponse(message: MessageResponse) {
      const wallets: string[] = message.payload as string[];
      this.wallets = wallets;
      this.activeWallet = this.wallets.length > 0 ? this.wallets[0] : '';
    },
    setBalanceResponse(message: MessageResponse) {
      const balances: string[] = message.payload as string[];
      this.wallets.map((address, index) => {
        if (index < balances.length) {
          this.updateBalance(address, balances[index]);
        }
      });
      this.isLoadingBalances = false;
    },
  },
});
