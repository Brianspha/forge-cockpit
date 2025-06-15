<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import FunctionPanel from '../functions/FunctionPanel.vue';
import WalletSelector from '../wallet/WalletSelector.vue';
import type { AbiTab, Function } from '../../types/index';

const props = defineProps<{
  activeTab: AbiTab;
  inputValues: Record<string, string>;
  loadingStates: Record<string, boolean>;
  readFunctions: Function[];
  writeFunctions: Function[];
  displayedFunctions: Function[];
  activeFunctionType: string;
  formatTimestamp: (timestamp: string) => string;
  pendingPasteFieldId?: string;
  pasteValue?: string;
  onFunctionPanelPaste?: (fieldId: string) => void;
}>();

const emit = defineEmits(['switch-function-type', 'execute-function']);

const handleFunctionTypeSwitch = (type: string) => {
  emit('switch-function-type', type);
};

const handleFunctionExecute = (
  functionName: string,
  params: any[],
  inputs: Function[],
  stateMutability: string
) => {
  emit('execute-function', functionName, params, inputs, stateMutability);
};
</script>

<template>
  <div class="contract-interface">
    <div class="contract-header">
      <div class="contract-info">
        <div class="connection-badge">
          <span
            class="connection-dot"
            :class="{ connected: activeTab.isConnected }"
          ></span>
          <span>{{
            activeTab.isConnected
              ? activeTab.useExistingNode
                ? 'Connected through Existing Fork'
                : 'Connected to Forked Node'
              : 'Connection Failed'
          }}</span>
        </div>
        <div class="address-info">
          <div class="address-label">Contract:</div>
          <div class="address-value">{{ activeTab.contractAddress }}</div>
        </div>
        <div class="node-info">
          <div class="node-label">Node:</div>
          <div class="node-value">{{ activeTab.nodeUrl }}</div>
        </div>
        <div v-if="!activeTab.useExistingNode" class="port-info">
          <div class="port-label">Port:</div>
          <div class="port-value">{{ activeTab.port }}</div>
        </div>
      </div>
    </div>

    <WalletSelector :tabId="activeTab.id" :nodeUrl="activeTab.nodeUrl" />

    <div v-if="activeTab.error" class="message-banner error">
      <span class="message-icon">×</span>
      <span class="message-text">{{ activeTab.error }}</span>
    </div>

    <div
      v-if="
        activeTab.validationWarnings && activeTab.validationWarnings.length > 0
      "
      class="message-banner warning"
    >
      <span class="message-icon">!</span>
      <div class="message-content">
        <div
          v-for="(warning, index) in activeTab.validationWarnings"
          :key="index"
          class="warning-item"
        >
          {{ warning }}
        </div>
      </div>
    </div>

    <div class="function-interface">
      <div class="tab-navigation">
        <button
          class="tab-button"
          :class="{ active: activeFunctionType === 'read' }"
          @click="handleFunctionTypeSwitch('read')"
        >
          Read Functions ({{ readFunctions.length }})
        </button>
        <button
          class="tab-button"
          :class="{ active: activeFunctionType === 'write' }"
          @click="handleFunctionTypeSwitch('write')"
        >
          Write Functions ({{ writeFunctions.length }})
        </button>
      </div>

      <div class="tab-content">
        <div class="tab-panel">
          <div v-if="props.displayedFunctions.length === 0" class="empty-state">
            No {{ activeFunctionType }} functions found
          </div>

          <div v-else class="functions-list">
            <FunctionPanel
              v-for="func in props.displayedFunctions"
              :key="`${activeTab.id}-${func.name}`"
              :function="func"
              :contractAddress="activeTab.contractAddress ?? ''"
              :executingFunctionId="activeTab.executingFunctionId"
              :pendingPasteFieldId="pendingPasteFieldId"
              :pasteValue="pasteValue"
              :onPasteField="onFunctionPanelPaste"
              :transactions="activeTab.transactions"
              :inputValues="inputValues || {}"
              :loadingStates="loadingStates || {}"
              @execute="
                params =>
                  handleFunctionExecute(
                    func.name,
                    params,
                    props.displayedFunctions,
                    func.stateMutability
                  )
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contract-interface {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  max-width: 100%;
  box-sizing: border-box;
}

.contract-header {
  background-color: var(--vscode-editor-background);
  border: 1px solid var(--vscode-widget-border);
  border-radius: 4px;
  padding: 1rem;
  flex-shrink: 0;
}

.contract-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.connection-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.connection-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--vscode-inputValidation-errorBorder);
  flex-shrink: 0;
}

.connection-dot.connected {
  background-color: var(--vscode-testing-iconPassed);
}

.address-info,
.node-info,
.port-info {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  min-height: 1.2em;
}

.address-label,
.node-label,
.port-label {
  font-weight: 600;
  min-width: 80px;
  flex-shrink: 0;
}

.address-value,
.node-value,
.port-value {
  font-family: var(--vscode-editor-font-family, monospace);
  word-break: break-all;
  color: var(--vscode-textLink-foreground);
  flex: 1;
}

.message-banner {
  padding: 0.75rem;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex-shrink: 0;
}

.message-banner.error {
  background-color: var(--vscode-inputValidation-errorBackground);
  border-left: 3px solid var(--vscode-inputValidation-errorBorder);
  color: var(--vscode-inputValidation-errorForeground);
}

.message-banner.warning {
  background-color: var(--vscode-inputValidation-warningBackground);
  border-left: 3px solid var(--vscode-inputValidation-warningBorder);
  color: var(--vscode-inputValidation-warningForeground);
}

.message-icon {
  font-size: 1.1rem;
  font-weight: bold;
  flex-shrink: 0;
}

.message-text {
  flex: 1;
}

.message-content {
  flex: 1;
}

.warning-item {
  margin-bottom: 0.25rem;
}

.warning-item:last-child {
  margin-bottom: 0;
}

.function-interface {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid var(--vscode-widget-border);
  margin-bottom: 16px;
  flex-shrink: 0;
}

.tab-button {
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: var(--vscode-foreground);
  transition: all 0.2s ease;
  font-weight: 500;
  font-family: inherit;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  min-height: 36px;
  border-radius: 0;
}

.tab-button:hover:not(.active) {
  background-color: var(--vscode-tab-hoverBackground);
  color: var(--vscode-foreground);
}

.tab-button.active {
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  font-weight: 600;
  border-radius: 4px 4px 0 0;
}

.tab-button:focus-visible {
  outline: 1px solid var(--vscode-focusBorder);
  outline-offset: -1px;
}

.tab-button:active {
  transform: translateY(1px);
}

.tab-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.tab-panel {
  height: 100%;
  overflow-y: auto;
  padding-top: 4px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: var(--vscode-descriptionForeground);
  text-align: center;
  background-color: var(--vscode-editor-background);
  border: 1px solid var(--vscode-widget-border);
  border-radius: 4px;
  margin: 1rem 0;
}

.functions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
}

@media (max-width: 768px) {
  .contract-interface {
    padding: 0.5rem;
    gap: 0.75rem;
  }

  .contract-info {
    gap: 0.75rem;
  }

  .address-info,
  .node-info,
  .port-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .tab-navigation {
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  .tab-button {
    flex: 1;
    text-align: center;
    padding: 8px 4px;
    min-width: 120px;
    font-size: 13px;
  }

  .functions-list {
    gap: 0.75rem;
  }

  .empty-state {
    margin: 0.5rem 0;
    padding: 2rem;
  }
}
</style>
