<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { formatAddress } from '../../utils/index';
const props = defineProps<{
  wallets: string[];
  activeWallet: string;
  balances: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: 'select', address: string): void;
  (e: 'remove', address: string): void;
  (e: 'close'): void;
  (e: 'import'): void;
}>();

const dropdownRef = ref(null);
const searchQuery = ref('');
const hoveredWalletIndex = ref(-1);

const getFormattedBalance = (address: string): string => {
  const balance = props.balances[address] || '0';
  return `${balance} ETH`;
};

const filteredWallets = computed(() => {
  const query = searchQuery.value.toLowerCase();

  return props.wallets
    .filter(address => address.toLowerCase().includes(query))
    .map(address => ({
      address,
      isActive: address === props.activeWallet,
      displayAddress: formatAddress(address),
      balance: getFormattedBalance(address),
    }));
});

onClickOutside(dropdownRef, () => {
  emit('close');
});

const handleKeyDown = (event: any) => {
  const wallets = filteredWallets.value;

  if (event.key === 'Escape') {
    emit('close');
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    hoveredWalletIndex.value = Math.min(
      hoveredWalletIndex.value + 1,
      wallets.length - 1
    );
    scrollToWallet();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    hoveredWalletIndex.value = Math.max(hoveredWalletIndex.value - 1, -1);
    scrollToWallet();
  } else if (event.key === 'Enter' && hoveredWalletIndex.value >= 0) {
    event.preventDefault();
    const selectedWallet = wallets[hoveredWalletIndex.value];
    emit('select', selectedWallet.address);
  }
};

const scrollToWallet = () => {
  if (hoveredWalletIndex.value >= 0 && dropdownRef.value) {
    const walletElements = dropdownRef.value.querySelectorAll('.wallet-item');
    if (walletElements[hoveredWalletIndex.value]) {
      walletElements[hoveredWalletIndex.value].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);

  const searchInput = dropdownRef.value?.querySelector('input');
  if (searchInput) {
    searchInput.focus();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

watch(filteredWallets, () => {
  hoveredWalletIndex.value = -1;
});

const removeWallet = (address: string, event: Event) => {
  event.stopPropagation();
  emit('remove', address);
};

const selectWallet = (address: string) => {
  emit('select', address);
};

const openImportModal = () => {
  emit('close');
  setTimeout(() => {
    emit('import');
  }, 50);
};
</script>

<template>
  <div class="wallet-dropdown" ref="dropdownRef" @click.stop="emit('close')">
    <div class="dropdown-header">
      <div class="search-container">
        <div class="search-icon">
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
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          class="search-input"
          v-model="searchQuery"
          placeholder="Search wallet address..."
          @click.stop
        />
      </div>
    </div>

    <div class="wallets-container">
      <div v-if="filteredWallets.length === 0" class="no-results">
        No wallets match your search
      </div>

      <div
        v-for="(wallet, index) in filteredWallets"
        :key="wallet.address"
        class="wallet-item"
        :class="{
          active: wallet.isActive,
          hovered: index === hoveredWalletIndex,
        }"
        @click="selectWallet(wallet.address)"
        @mouseenter="hoveredWalletIndex = index"
      >
        <div class="wallet-item-info">
          <div class="wallet-item-address">{{ wallet.displayAddress }}</div>
          <div class="wallet-item-balance">{{ wallet.balance }}</div>
          <div v-if="wallet.isActive" class="wallet-badge active">Active</div>
        </div>
        <button
          class="wallet-item-remove"
          @click="removeWallet(wallet.address, $event)"
          title="Remove wallet"
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="dropdown-footer">
      <button class="import-button" @click.stop="openImportModal">
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
        Import New Wallet
      </button>
      <button class="close-button" @click.stop="emit('close')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.wallet-dropdown {
  position: absolute;
  z-index: 1000;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background-color: var(--vscode-editor-background);
  border: 1px solid var(--vscode-widget-border);
  border-radius: 4px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow: hidden;
}

.dropdown-header {
  padding: 8px;
  border-bottom: 1px solid var(--vscode-widget-border);
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: var(--vscode-descriptionForeground);
}

.search-input {
  width: 100%;
  padding: 6px 10px 6px 32px;
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-family: var(--vscode-font-family);
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
}

.wallets-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  max-height: 280px;
}

.no-results {
  padding: 12px;
  text-align: center;
  color: var(--vscode-descriptionForeground);
  font-style: italic;
}

.wallet-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: background-color 0.15s;
  position: relative;
}

.wallet-item:hover,
.wallet-item.hovered {
  background-color: var(--vscode-list-hoverBackground);
}

.wallet-item.active {
  background-color: var(--vscode-list-activeSelectionBackground);
  color: var(--vscode-list-activeSelectionForeground);
}

.wallet-item-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.wallet-item-address {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallet-item-balance {
  font-size: 0.8rem;
  color: var(--vscode-descriptionForeground);
  white-space: nowrap;
}

.wallet-badge {
  display: inline-block;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  text-transform: uppercase;
  font-weight: bold;
}

.wallet-badge.default {
  background-color: var(--vscode-badge-background, rgba(0, 0, 0, 0.2));
  color: var(--vscode-badge-foreground, white);
}

.wallet-badge.active {
  background-color: var(--vscode-testing-iconPassed, #2cbb5d);
  color: white;
}

.wallet-item-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--vscode-foreground);
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.wallet-item:hover .wallet-item-remove {
  opacity: 0.7;
}

.wallet-item-remove:hover {
  background-color: var(
    --vscode-inputValidation-errorBackground,
    rgba(255, 0, 0, 0.1)
  );
  opacity: 1 !important;
}

.dropdown-footer {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-top: 1px solid var(--vscode-widget-border);
}

.import-button,
.close-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.import-button {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.import-button:hover {
  background-color: var(--vscode-button-hoverBackground);
}

.close-button {
  background-color: transparent;
  color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
  border: 1px solid var(--vscode-button-border, var(--vscode-button-background));
}

.close-button:hover {
  background-color: var(
    --vscode-button-secondaryHoverBackground,
    rgba(255, 255, 255, 0.1)
  );
}
</style>
