<script setup lang="ts">
  import {
    ref,
    computed,
    watch,
    onMounted,
    onUnmounted,
    onBeforeMount,
  } from 'vue';
  import { useWalletStore } from '../../stores/useWalletStore';
  import {
    isValidAddress,
    WebviewCommand,
    ClipboardTypeCommand,
    formatAddress,
  } from '../../utils/index';
  import ImportWalletModal from './ImportWalletModal.vue';
  import WalletDropdown from './WalletDropdown.vue';
  import TransferModal from './TransferModal.vue';
  import { storeToRefs } from 'pinia';
  import { TransferTransaction } from '../../types';

  const props = defineProps<{
    tabId: string;
    nodeUrl: string;
  }>();

  const store = useWalletStore();
  const showImportModal = ref<boolean>(false);
  const showTransferModal = ref<boolean>(false);
  const showWalletDropdown = ref<boolean>(false);
  const currentDropdownId = ref<string>('');
  const uniqueId = `wallet-selector-${props.tabId}`;

  const {
    balances,
    currentWallet,
    availableWallets,
    isWalletImportPasteLoading,
    transferResponse,
  } = storeToRefs(store);

  const walletsAsStrings = computed(() => {
    return availableWallets.value || [];
  });

  watch(
    () => props.tabId,
    newTabId => {
      if (newTabId) {
        store.setCurrentTab(newTabId);
      }
    },
    { immediate: true }
  );

  const activeWallet = computed(() => {
    const address = store.currentWallet;
    if (!address) {
      return {
        address: '',
        shortAddress: '',
        balance: '0 ETH',
      };
    }

    return {
      address,
      shortAddress: formatAddress(address),
      balance: `${store.getBalance(address)} ETH`,
    };
  });

  const toggleWalletDropdown = () => {
    if (showImportModal.value || showTransferModal.value) {
      return;
    }

    if (showWalletDropdown.value && currentDropdownId.value === uniqueId) {
      showWalletDropdown.value = false;
      currentDropdownId.value = '';
    } else {
      showWalletDropdown.value = true;
      currentDropdownId.value = uniqueId;
    }
  };

  const openImportModal = () => {
    showWalletDropdown.value = false;
    currentDropdownId.value = '';
    setTimeout(() => {
      showImportModal.value = true;
    }, 50);
  };

  const openTransferModal = () => {
    showWalletDropdown.value = false;
    currentDropdownId.value = '';
    setTimeout(() => {
      showTransferModal.value = true;
    }, 50);
  };

  const handleWalletSelect = (address: string) => {
    store.setActiveWallet(address);
    showWalletDropdown.value = false;
    currentDropdownId.value = '';
  };

  const handleWalletImport = (address: string) => {
    if (address && isValidAddress(address)) {
      store.addCustomWallet(address);
      store.setActiveWallet(address);
      fetchBalances();
      closeImportModal();
    }
  };

  const handleTransfer = async (transferData: TransferTransaction) => {
    store.sendMessage(WebviewCommand.TransferCommand, {
      ...transferData,
      nodeUrl: props.nodeUrl,
    });
    store.lastNodeUrl = props.nodeUrl;
  };

  const closeImportModal = () => {
    showImportModal.value = false;
    store.isWalletImportPasteLoading = false;
  };

  const closeTransferModal = () => {
    showTransferModal.value = false;
  };

  const closeDropdown = () => {
    showWalletDropdown.value = false;
    currentDropdownId.value = '';
  };

  const fetchBalances = async () => {
    try {
      store.sendMessage(WebviewCommand.WalletBalancesCommand, {
        wallets: store.availableWallets,
        nodeUrl: props.nodeUrl,
      });
      setTimeout(() => {
        store.isLoadingBalances = false;
      }, 50000);
    } catch (error) {
      store.isLoadingBalances = false;
    }
  };

  const isDropdownVisible = computed(() => {
    return showWalletDropdown.value && currentDropdownId.value === uniqueId;
  });

  onBeforeMount(() => {
    fetchBalances();
  });

  watch(
    () => props.nodeUrl,
    newNodeUrl => {
      if (newNodeUrl) {
        fetchBalances();
      }
    }
  );

  const handleGlobalClick = (event: any) => {
    const target = event.target;
    if (!event.target.closest(`#${uniqueId}`)) {
      closeDropdown();
    }
  };

  const handleIconClick = (event: any) => {
    event.stopPropagation();
    if (showWalletDropdown.value) {
      showWalletDropdown.value = false;
      currentDropdownId.value = '';
    } else {
      showWalletDropdown.value = true;
      currentDropdownId.value = uniqueId;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleGlobalClick);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleGlobalClick);
  });
</script>

<template>
  <div class="wallet-selector" :id="uniqueId">
    <div class="wallet-container">
      <div class="wallet-header">
        <h3 class="wallet-title">Wallet</h3>
        <div class="wallet-buttons">
          <button
            class="wallet-button refresh-button"
            @click.stop="fetchBalances"
            title="Refresh Balances"
            :disabled="store.isLoadingBalances"
          >
            <svg
              v-if="!store.isLoadingBalances"
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
                d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
              />
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
            <span>
              {{ store.isLoadingBalances ? 'Loading...' : 'Refresh' }}
            </span>
          </button>

          <button
            class="wallet-button transfer-button"
            @click.stop="openTransferModal"
            title="Transfer ETH"
            :disabled="!currentWallet"
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
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
            <span>Transfer</span>
          </button>

          <button
            class="wallet-button import-button"
            @click.stop="openImportModal"
            title="Import Wallet"
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Import</span>
          </button>
        </div>
      </div>

      <div class="wallet-content">
        <div class="active-wallet" @click.stop="toggleWalletDropdown">
          <div class="wallet-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <circle cx="16" cy="12" r="2" />
              <path
                d="M22 10V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"
              />
            </svg>
          </div>
          <div class="wallet-info">
            <div v-if="activeWallet.address" class="wallet-address">
              {{ activeWallet.shortAddress }}
            </div>
            <div v-else class="wallet-address-empty">No wallet selected</div>
            <div v-if="activeWallet.address" class="wallet-balance">
              {{ activeWallet.balance }}
            </div>
          </div>
          <div
            class="wallet-dropdown-icon"
            :class="{ open: isDropdownVisible }"
            @click.stop="handleIconClick($event)"
          >
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
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <WalletDropdown
      v-if="isDropdownVisible && !showImportModal && !showTransferModal"
      :wallets="availableWallets"
      :activeWallet="currentWallet"
      :balances="balances"
      @select="handleWalletSelect"
      @remove="store.removeCustomWallet"
      @close="closeDropdown"
      @import="openImportModal"
    />

    <ImportWalletModal
      v-if="showImportModal"
      @import="handleWalletImport"
      @close="closeImportModal"
      :paste="
        () => store.readClipboard(ClipboardTypeCommand.ReadWalletImportCommand)
      "
      :isPasting="isWalletImportPasteLoading"
      :activeWallet="activeWallet.address"
    />

    <TransferModal
      v-if="showTransferModal"
      :wallets="walletsAsStrings"
      :activeWallet="currentWallet || ''"
      :balances="balances || {}"
      :paste="
        () => store.readClipboard(ClipboardTypeCommand.ReadTransferCommand)
      "
      :transferResponse="transferResponse"
      @transfer="handleTransfer"
      @close="closeTransferModal"
      :pastedContent="store.pastedContent"
    />
  </div>
</template>

<style scoped>
  .wallet-selector {
    position: relative;
    margin-bottom: 1rem;
  }

  .wallet-container {
    background-color: var(--vscode-editor-background);
    border: 1px solid var(--vscode-widget-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .wallet-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--vscode-widget-border);
    background-color: var(
      --vscode-titleBar-activeBackground,
      rgba(0, 0, 0, 0.1)
    );
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .wallet-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
    color: var(--vscode-titleBar-activeForeground, var(--vscode-foreground));
    flex: 1;
  }

  .wallet-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .wallet-button {
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: var(--vscode-button-secondaryBackground, transparent);
    color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
    border: 1px solid
      var(--vscode-button-border, var(--vscode-contrastBorder, #6c757d));
    border-radius: 2px;
    padding: 2px 8px;
    font-size: 0.7rem;
    cursor: pointer;
    transition:
      background-color 0.1s,
      opacity 0.2s;
    min-width: 72px;
    justify-content: center;
    height: 24px;
  }

  .wallet-button:hover:not(:disabled) {
    background-color: var(
      --vscode-button-secondaryHoverBackground,
      rgba(90, 93, 94, 0.31)
    );
  }

  .wallet-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .refresh-button {
    position: relative;
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

  .wallet-content {
    position: relative;
  }

  .active-wallet {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    user-select: none;
  }

  .active-wallet:hover {
    background-color: var(--vscode-list-hoverBackground);
  }

  .wallet-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--vscode-button-background, #0e639c);
    color: var(--vscode-button-foreground, white);
    margin-right: 0.75rem;
    flex-shrink: 0;
  }

  .wallet-info {
    flex: 1;
    min-width: 0;
  }

  .wallet-address {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .wallet-address-empty {
    font-weight: 500;
    color: var(--vscode-descriptionForeground);
  }

  .wallet-balance {
    font-size: 0.8rem;
    color: var(--vscode-descriptionForeground);
  }

  .wallet-dropdown-icon {
    margin-left: 0.5rem;
    transition: transform 0.2s;
  }

  .wallet-dropdown-icon.open {
    transform: rotate(180deg);
  }

  .wallet-add-button {
    display: none;
  }
</style>
