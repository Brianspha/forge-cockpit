<script setup lang="ts">
  import type {
    ActiveContractTypeTab,
    DeployedContract,
    TestFile,
  } from '../../types';
  import { computed, ref } from 'vue';

  const props = defineProps<{
    contracts: TestFile[];
    activeTab: ActiveContractTypeTab;
    selectedContractId: string | null;
    deployedContracts: DeployedContract[];
  }>();

  const { deployedContracts, activeTab } = props;
  const searchQuery = ref('');

  const emit = defineEmits(['select-contract']);

  const filteredContracts = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return props.contracts.filter(c =>
      getContractId(c.fileName).toLowerCase().includes(query)
    );
  });

  const regularContracts = computed(() =>
    filteredContracts.value.filter(c => !c.fileName.includes('.t.sol'))
  );

  const testContracts = computed(() =>
    filteredContracts.value.filter(c => c.fileName.includes('.t.sol'))
  );

  const getContractId = (fileName: string) => fileName;

  const selectContract = (contractId: string) => {
    emit('select-contract', contractId);
  };

  const isDeployed = (contractId: string) => {
    return deployedContracts.some(
      contract => contract.contractName === contractId
    );
  };

  const countFunctions = (contract: TestFile) => {
    if (!contract.abi) return 0;
    return contract.abi.filter(item => item.type === 'function').length;
  };

  const countEvents = (contract: TestFile) => {
    if (!contract.abi) return 0;
    return contract.abi.filter(item => item.type === 'event').length;
  };

  const clearSearch = () => {
    searchQuery.value = '';
  };

  const hasActiveContracts = computed(() => {
    return activeTab === 'regular'
      ? regularContracts.value.length > 0
      : testContracts.value.length > 0;
  });
</script>

<template>
  <div class="contract-list">
    <div class="search-container">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search contracts..."
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-button">
          ✕
        </button>
      </div>
    </div>

    <div v-if="contracts.length === 0" class="no-contracts">
      <p>
        No {{ activeTab === 'script' ? 'test contracts' : 'contracts' }} found
      </p>
    </div>

    <div v-else-if="!hasActiveContracts && searchQuery" class="no-contracts">
      <p>
        No {{ activeTab === 'script' ? 'test contracts' : 'contracts' }} match
        your search
      </p>
      <button @click="clearSearch" class="reset-search-button">
        Clear search
      </button>
    </div>

    <div v-else>
      <div v-if="activeTab === 'regular'" class="contract-group">
        <h2 class="group-title">Contracts</h2>
        <div class="contracts">
          <div
            v-for="contract in regularContracts"
            :key="contract.fileName"
            class="contract-item"
            :class="{
              selected: selectedContractId === getContractId(contract.fileName),
              deployed: isDeployed(getContractId(contract.fileName)),
            }"
            @click="selectContract(getContractId(contract.fileName))"
          >
            <div class="contract-name">
              {{ getContractId(contract.fileName) }}
              <span
                v-if="isDeployed(getContractId(contract.fileName))"
                class="deployed-indicator"
              ></span>
            </div>
            <div class="contract-meta">
              <span class="contract-stat">
                {{ countFunctions(contract) }} functions
              </span>
              <span class="contract-stat">
                {{ countEvents(contract) }} events
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'script'" class="contract-group">
        <h2 class="group-title">Scripts</h2>
        <div class="contracts">
          <div
            v-for="contract in testContracts"
            :key="contract.fileName"
            class="contract-item test-contract"
            :class="{
              selected: selectedContractId === getContractId(contract.fileName),
              deployed: isDeployed(getContractId(contract.fileName)),
            }"
            @click="selectContract(getContractId(contract.fileName))"
          >
            <div class="contract-name">
              {{ getContractId(contract.fileName) }}
              <span
                v-if="isDeployed(getContractId(contract.fileName))"
                class="deployed-indicator"
              ></span>
            </div>
            <div class="contract-meta">
              <span class="contract-stat">
                {{ countFunctions(contract) }} functions
              </span>
              <span class="contract-stat">
                {{ countEvents(contract) }} events
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .contract-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding: var(--space-xs);
  }

  .search-container {
    padding: var(--space-xs) 0;
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--background-color, inherit);
  }

  .search-bar {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    padding-right: calc(var(--space-md) * 2);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--input-bg, var(--background-color));
    color: var(--text-color);
    font-size: 12px;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px
      var(--accent-color-transparent, rgba(0, 120, 212, 0.2));
  }

  .search-input::placeholder {
    color: var(--secondary-text);
  }

  .clear-button {
    position: absolute;
    right: var(--space-sm);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--secondary-text);
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border-radius: 50%;
  }

  .clear-button:hover {
    background-color: var(--hover-bg);
    color: var(--text-color);
  }

  .reset-search-button {
    margin-top: var(--space-sm);
    padding: var(--space-xs) var(--space-md);
    background-color: var(--button-bg, var(--hover-bg));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    color: var(--text-color);
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s;
  }

  .reset-search-button:hover {
    background-color: var(--button-hover-bg, var(--selected-bg));
  }

  .no-contracts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: var(--secondary-text);
    font-style: italic;
    margin-top: var(--space-lg);
  }

  .contract-group {
    margin-bottom: var(--space-lg);
  }

  .group-title {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--secondary-text);
    margin: var(--space-md) var(--space-xs) var(--space-sm);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border-color);
  }

  .contracts {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .contract-item {
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color 0.2s;
    position: relative;
  }

  .contract-item:hover {
    background-color: var(--hover-bg);
  }

  .contract-item.selected {
    background-color: var(--selected-bg);
    color: var(--selected-text);
  }

  .contract-item.deployed {
    border-left: 3px solid var(--success-color);
    padding-left: calc(var(--space-md) - 3px);
  }

  .test-contract {
    font-style: italic;
  }

  .contract-name {
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-xs);
  }

  .deployed-indicator {
    width: 8px;
    height: 8px;
    background-color: var(--success-color);
    border-radius: 50%;
    display: inline-block;
  }

  .contract-meta {
    display: flex;
    font-size: 11px;
    color: var(--secondary-text);
    gap: var(--space-sm);
  }

  .selected .contract-meta {
    color: var(--selected-text);
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    .contract-meta {
      flex-direction: column;
      gap: var(--space-xs);
    }

    .search-input {
      font-size: 14px;
      padding: calc(var(--space-sm) * 1.2) var(--space-md);
    }

    .contract-item {
      padding: var(--space-md);
    }
  }
</style>
