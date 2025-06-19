<script setup lang="ts">
  import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue';
  import LoadingSpinner from '../spinners/LoadingSpinner.vue';
  import type {
    Function,
    FunctionCallResponse,
    TransactionStatus,
  } from '../../types/index';

  const props = defineProps<{
    function: Function;
    contractAddress: string;
    executingFunctionId?: string;
    onPasteField?: (fieldId: string) => void;
    inputValues: Record<string, string>;
    loadingStates: Record<string, boolean>;
    transactions: FunctionCallResponse[];
    lastResult?: any;
  }>();

  const emit = defineEmits<{
    (e: 'execute', params: any[]): void;
    (e: 'copy-to-clipboard', item: any): void;
    (e: 'update-input', fieldId: string, value: string): void;
  }>();

  const isExpanded = ref(false);
  const functionResult = ref<any>(null);
  const hasError = ref(false);
  const errorMessage = ref('');
  const transactionStatus = ref<TransactionStatus>(null);
  const lastProcessedTxId = ref<string>('');

  const isExecuting = computed(
    () => props.executingFunctionId === props.function.name
  );
  const isReadOnly = computed(
    () =>
      props.function.stateMutability === 'view' ||
      props.function.stateMutability === 'pure'
  );
  const buttonText = computed(() =>
    isExecuting.value ? 'Processing...' : isReadOnly.value ? 'Query' : 'Execute'
  );
  const buttonClass = computed(() =>
    isReadOnly.value ? 'secondary-button' : 'primary-button'
  );
  const functionClass = computed(() => {
    if (isReadOnly.value) return 'function-read';
    if (props.function.stateMutability === 'payable') return 'function-payable';
    return 'function-write';
  });

  const inputErrors = ref<{ [param: string]: string }>({});

  if (props.function.inputs) {
    props.function.inputs.forEach((input, index) => {
      inputErrors.value[input.name || `param${index}`] = '';
    });
  }

  const clearResults = () => {
    functionResult.value = null;
    hasError.value = false;
    errorMessage.value = '';
    transactionStatus.value = null;
    lastProcessedTxId.value = '';
  };

  const handleTransactionResult = (tx: any) => {
    const txId =
      tx.id || tx.transactionHash || tx.timestamp || JSON.stringify(tx);

    if (lastProcessedTxId.value === txId) {
      return;
    }

    lastProcessedTxId.value = txId;

    if (
      tx.error ||
      tx.errorMessage ||
      tx.status === false ||
      tx.status === '0x0'
    ) {
      hasError.value = true;
      errorMessage.value =
        tx.error || tx.errorMessage || tx.message || 'Transaction failed';
      transactionStatus.value = 'error';
      functionResult.value = null;
    } else {
      let result = tx.result || tx.returnValue || tx.output || tx;
      if (tx.transactionHash && !result) {
        result = tx.receipt || tx;
      }
      functionResult.value = result;
      transactionStatus.value = 'success';
      hasError.value = false;
      errorMessage.value = '';
    }
  };

  watch(
    () => props.transactions,
    (transactions, oldTransactions) => {
      if (!transactions || transactions.length === 0) {
        if (oldTransactions && oldTransactions.length > 0) {
          clearResults();
        }
        return;
      }

      const relevantTxs = transactions
        .filter(tx => tx.functionName === props.function.name)
        .sort((a, b) =>
          Number(BigInt(b.timestamp || '0') - BigInt(a.timestamp || '0'))
        );

      const latestTx = relevantTxs[0];
      if (latestTx && !isExecuting.value) {
        nextTick(() => {
          handleTransactionResult(latestTx);
        });
      }
    },
    { deep: true, immediate: false }
  );

  watch(
    () => props.lastResult,
    (result, oldResult) => {
      if (
        result &&
        result.functionName === props.function.name &&
        result !== oldResult
      ) {
        nextTick(() => {
          handleTransactionResult(result);
        });
      }
    },
    { immediate: false }
  );

  watch(
    () => props.executingFunctionId,
    (newVal, oldVal) => {
      if (oldVal === props.function.name && newVal !== props.function.name) {
        nextTick(() => {
          if (transactionStatus.value === 'pending') {
            transactionStatus.value = hasError.value ? 'error' : 'success';
          }
        });
      }
    }
  );

  watch(
    () => isExecuting.value,
    executing => {
      if (executing) {
        transactionStatus.value = 'pending';
        hasError.value = false;
        errorMessage.value = '';
      }
    }
  );

  onBeforeUnmount(() => {
    clearResults();
  });

  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
  };

  const getFieldId = (inputName: string) =>
    `${props.function.name}-${inputName}`;

  const getInputValue = (inputName: string) => {
    const fieldId = getFieldId(inputName);
    return props.inputValues[fieldId] || '';
  };

  const updateInputValue = (inputName: string, value: string) => {
    const fieldId = getFieldId(inputName);
    emit('update-input', fieldId, value);
  };

  const isFieldLoading = (inputName: string) => {
    const fieldId = getFieldId(inputName);
    return props.loadingStates[fieldId] || false;
  };

  const getPlaceholderForType = (type: string) => {
    if (type.includes('int')) return '0';
    if (type.includes('bool')) return 'true or false';
    if (type.includes('address')) return '0x...';
    if (type.includes('bytes')) return '0x...';
    if (type.includes('string')) return 'text...';
    return '';
  };

  const validateInput = (
    value: string,
    type: string,
    inputName: string
  ): string => {
    inputErrors.value[inputName] = '';

    if (!value.trim() && value !== '0') return 'Required';

    if (type.includes('int')) {
      if (!/^-?\d+$/.test(value)) return 'Must be a valid integer';
      const num = parseInt(value);
      if (type.includes('uint') && num < 0) return 'Must be a positive integer';
      const sizeMatch = type.match(/int(\d+)/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        const maxValue = type.includes('uint')
          ? BigInt(2) ** BigInt(size) - BigInt(1)
          : BigInt(2) ** BigInt(size - 1) - BigInt(1);
        const minValue = type.includes('uint')
          ? BigInt(0)
          : -(BigInt(2) ** BigInt(size - 1));
        try {
          const bigIntValue = BigInt(value);
          if (bigIntValue > maxValue || bigIntValue < minValue)
            return `Value outside range for ${type}`;
        } catch (e) {
          return `Invalid value for ${type}`;
        }
      }
    } else if (type === 'bool') {
      if (value !== 'true' && value !== 'false')
        return 'Must be "true" or "false"';
    } else if (type === 'address') {
      if (!/^0x[a-fA-F0-9]{40}$/.test(value)) return 'Invalid Ethereum address';
    } else if (type.includes('bytes')) {
      if (!/^0x[a-fA-F0-9]*$/.test(value)) return 'Must be hex format (0x...)';
      const sizeMatch = type.match(/bytes(\d+)/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        const expectedLength = size * 2 + 2;
        if (value.length !== expectedLength)
          return `Must be exactly ${size} bytes (${expectedLength} chars including 0x)`;
      }
    }

    return '';
  };

  const handleInputChange = (input: any, index: number, value: string) => {
    const inputName = input.name || `param${index}`;
    updateInputValue(inputName, value);
    const error = validateInput(value, input.type, inputName);
    inputErrors.value[inputName] = error;
  };

  const executeFunction = async () => {
    if (!props.contractAddress && !isReadOnly.value) {
      hasError.value = true;
      errorMessage.value =
        'Contract must be deployed first to execute this function';
      return;
    }

    let hasValidationErrors = false;
    props.function.inputs.forEach((input, index) => {
      const inputName = input.name || `param${index}`;
      const value = getInputValue(inputName);
      const error = validateInput(value, input.type, inputName);
      if (error) {
        inputErrors.value[inputName] = error;
        hasValidationErrors = true;
      }
    });

    if (hasValidationErrors) {
      hasError.value = true;
      errorMessage.value = 'Please correct input errors before executing';
      return;
    }

    clearResults();
    transactionStatus.value = 'pending';

    try {
      const params = props.function.inputs.map((input, index) => {
        const inputName = input.name || `param${index}`;
        const value = getInputValue(inputName);
        if (input.type.includes('int')) return value ? Number(value) : 0;
        if (input.type === 'bool') return value === 'true';
        return value;
      });

      emit('execute', params);
    } catch (error) {
      hasError.value = true;
      errorMessage.value = (error as Error).message;
      transactionStatus.value = 'error';
    }
  };

  const handlePaste = (inputName: string) => {
    if (props.onPasteField) {
      const fieldId = getFieldId(inputName);
      props.onPasteField(fieldId);
    }
  };

  const resetFunction = () => {
    props.function.inputs.forEach((input, index) => {
      const inputName = input.name || `param${index}`;
      updateInputValue(inputName, '');
      inputErrors.value[inputName] = '';
    });
    clearResults();
  };

  const formatValue = (value: any, type?: string): string => {
    if (value === null || value === undefined) return 'null';
    if (value._isBigNumber || value._hex || value.type === 'BigNumber') {
      if (value.toString) return value.toString();
      if (value._hex) return parseInt(value._hex, 16).toString();
    }
    if (type && type.includes('int') && !isNaN(value))
      return Number(value).toLocaleString();
    if (typeof value === 'bigint') return value.toLocaleString();
    if (type === 'bool' || typeof value === 'boolean')
      return value ? 'true' : 'false';
    if (
      type === 'address' ||
      (typeof value === 'string' && value.startsWith('0x'))
    )
      return value;
    return String(value);
  };

  const formatResult = (result: any, outputs?: any[]): any => {
    if (!result) return null;
    if (result._isBigNumber || result._hex) return formatValue(result);
    if (Array.isArray(result) && outputs && outputs.length > 0) {
      if (result.length === 1 && outputs.length === 1) {
        return formatValue(result[0], outputs[0].type);
      }
      const formattedResult: any = {};
      result.forEach((value, index) => {
        const output = outputs[index];
        if (output) {
          const key = output.name || `output${index}`;
          formattedResult[key] = {
            type: output.type,
            value: formatValue(value, output.type),
          };
        }
      });
      return formattedResult;
    }
    if (outputs && outputs.length === 1 && !Array.isArray(result)) {
      return formatValue(result, outputs[0].type);
    }
    if (result.transactionHash) return result;
    if (result.result !== undefined)
      return formatResult(result.result, outputs);
    return result;
  };

  const displayResult = computed(() => {
    if (!functionResult.value) return null;
    return formatResult(functionResult.value, props.function.outputs);
  });

  const hasResult = computed(
    () => functionResult.value !== null && !hasError.value
  );

  const copyResult = () => {
    if (displayResult.value) {
      emit('copy-to-clipboard', displayResult.value);
    }
  };

  const copyErrorMessage = () => {
    if (errorMessage) {
      emit('copy-to-clipboard', errorMessage.value);
    }
  };
</script>

<template>
  <div
    class="function-panel"
    :class="[functionClass, { 'is-executing': isExecuting }]"
  >
    <div class="function-header" @click="toggleExpand">
      <div class="function-info">
        <div class="function-name">{{ props.function.name }}</div>
        <div v-if="transactionStatus === 'success'" class="success-indicator">
          ✓
        </div>
      </div>

      <div class="function-meta">
        <div class="function-type">{{ props.function.stateMutability }}</div>
        <LoadingSpinner
          v-if="isExecuting"
          Resultssize="small"
          class="function-spinner"
        />
        <div v-else class="expand-icon">{{ isExpanded ? '−' : '+' }}</div>
      </div>
    </div>

    <div v-if="isExpanded" class="function-details">
      <div class="function-signature">
        <code>
          {{ props.function.name }}({{
            props.function.inputs
              .map(i => `${i.type} ${i.name || ''}`)
              .join(', ')
          }})
        </code>
        <div
          v-if="props.function.outputs && props.function.outputs.length > 0"
          class="function-returns"
        >
          <span class="returns-arrow">→</span>
          <code>
            {{
              props.function.outputs
                .map(o => `${o.type} ${o.name || ''}`)
                .join(', ')
            }}
          </code>
        </div>
      </div>

      <div
        v-if="props.function.inputs && props.function.inputs.length > 0"
        class="function-inputs"
      >
        <div
          v-for="(input, index) in props.function.inputs"
          :key="`input-${index}`"
          class="input-field"
        >
          <label :for="`func-${props.function.name}-${index}`">
            {{ input.name || `param${index}` }}
            <span class="param-type">{{ input.type }}</span>
          </label>
          <div class="input-container">
            <div class="input-wrapper">
              <input
                :id="`func-${props.function.name}-${index}`"
                :value="getInputValue(input.name || `param${index}`)"
                :placeholder="getPlaceholderForType(input.type)"
                class="text-input"
                :class="{
                  'has-error': inputErrors[input.name || `param${index}`],
                }"
                :disabled="isExecuting"
                @input="
                  handleInputChange(
                    input,
                    index,
                    ($event.target as HTMLInputElement).value
                  )
                "
                @blur="
                  handleInputChange(
                    input,
                    index,
                    ($event.target as HTMLInputElement).value
                  )
                "
              />
              <button
                class="paste-button"
                title="Paste from clipboard"
                :disabled="
                  isExecuting || isFieldLoading(input.name || `param${index}`)
                "
                @click="handlePaste(input.name || `param${index}`)"
              >
                <LoadingSpinner
                  v-if="isFieldLoading(input.name || `param${index}`)"
                  Resultssize="small"
                />
                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H15C15.5523 4 16 3.55228 16 3C16 2.44772 15.5523 2 15 2H9Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7 4C5.34315 4 4 5.34315 4 7V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V7C20 5.34315 18.6569 4 17 4H16V5H17C17.5523 5 18 5.44772 18 6V19C18 19.5523 17.5523 20 17 20H7C6.44772 20 6 19.5523 6 19V6C6 5.44772 6.44772 5 7 5H8V4H7ZM8 9C8 8.44772 8.44772 8 9 8H15C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10H9C8.44772 10 8 9.55228 8 9ZM8 13C8 12.4477 8.44772 12 9 12H15C15.5523 12 16 12.4477 16 13C16 13.5523 15.5523 14 15 14H9C8.44772 14 8 13.5523 8 13Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div
              v-if="inputErrors[input.name || `param${index}`]"
              class="input-error"
            >
              {{ inputErrors[input.name || `param${index}`] }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="props.function.stateMutability === 'payable'"
        class="payable-options"
      >
        <div class="input-field">
          <label for="eth-value">Value to Send (ETH)</label>
          <input
            id="eth-value"
            type="text"
            placeholder="0.0"
            class="text-input"
            :disabled="isExecuting"
          />
        </div>
      </div>

      <div class="function-actions">
        <button
          :class="['action-button', buttonClass]"
          @click="executeFunction"
          :disabled="isExecuting || (!contractAddress && !isReadOnly)"
        >
          <LoadingSpinner v-if="isExecuting" size="small" />
          {{ buttonText }}
        </button>

        <button
          v-if="
            (props.function.inputs && props.function.inputs.length > 0) ||
            functionResult ||
            hasError
          "
          class="action-button reset-button"
          @click="resetFunction"
          :disabled="isExecuting"
        >
          Reset
        </button>
      </div>

      <div v-if="hasError" class="result-container error-message">
        <div class="status-header">
          <div class="status-icon error">❌</div>
          <div class="status-text">Error</div>
          <div class="spacer"></div>
          <button
            class="copy-button"
            @click="copyErrorMessage"
            title="Copy error message"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4V1H12V4H14V1C14 0.447715 13.5523 0 13 0H3C2.44772 0 2 0.447715 2 1V4H4Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 5C2.44772 5 2 5.44772 2 6V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6C14 5.44772 13.5523 5 13 5H3ZM5 8C5 7.44772 5.44772 7 6 7H10C10.5523 7 11 7.44772 11 8C11 8.55228 10.5523 9 10 9H6C5.44772 9 5 8.55228 5 8ZM6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H10C10.5523 13 11 12.5523 11 12C11 11.4477 10.5523 11 10 11H6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div class="error-content">{{ errorMessage }}</div>
      </div>

      <div v-if="hasResult" class="result-container success">
        <div class="status-header">
          <div class="status-icon success">✓</div>
          <div class="status-text">
            {{ isReadOnly ? 'Query Result' : 'Transaction Successful' }}
          </div>
          <div class="spacer"></div>
          <button
            class="copy-button"
            @click="copyResult"
            title="Copy result to clipboard"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4V1H12V4H14V1C14 0.447715 13.5523 0 13 0H3C2.44772 0 2 0.447715 2 1V4H4Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 5C2.44772 5 2 5.44772 2 6V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6C14 5.44772 13.5523 5 13 5H3ZM5 8C5 7.44772 5.44772 7 6 7H10C10.5523 7 11 7.44772 11 8C11 8.55228 10.5523 9 10 9H6C5.44772 9 5 8.55228 5 8ZM6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H10C10.5523 13 11 12.5523 11 12C11 11.4477 10.5523 11 10 11H6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div class="result-content">
          <div
            v-if="
              typeof displayResult === 'string' ||
              typeof displayResult === 'number' ||
              typeof displayResult === 'boolean'
            "
            class="single-result"
          >
            <div class="result-value">{{ displayResult }}</div>
          </div>

          <div
            v-else-if="
              displayResult &&
              typeof displayResult === 'object' &&
              !displayResult.transactionHash
            "
            class="multiple-results"
          >
            <div
              v-for="(item, key) in displayResult"
              :key="key"
              class="result-item"
            >
              <div class="result-label">{{ key }}</div>
              <div class="result-data">
                <span v-if="item.type" class="result-type">
                  {{ item.type }}
                </span>
                <span class="result-value">{{ item.value || item }}</span>
              </div>
            </div>
          </div>

          <div
            v-else-if="displayResult && displayResult.transactionHash"
            class="transaction-result"
          >
            <div class="tx-summary">
              <p class="success-message">Transaction completed successfully!</p>
              <div class="tx-hash">
                <span class="tx-label">Hash:</span>
                <span class="tx-value">
                  {{ displayResult.transactionHash }}
                </span>
              </div>
              <div v-if="displayResult.blockNumber" class="tx-block">
                <span class="tx-label">Block:</span>
                <span class="tx-value">{{ displayResult.blockNumber }}</span>
              </div>
            </div>
          </div>

          <div v-else class="raw-result">
            <pre>{{ JSON.stringify(displayResult, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .function-panel {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: var(--space-sm);
    overflow: visible;
    background-color: var(--panel-bg);
    position: relative;
    transition: border-color 0.2s;
    max-width: 100%;
  }

  .function-panel.is-executing {
    border-color: var(--vscode-focusBorder, #007fd4);
    box-shadow: 0 0 0 1px var(--vscode-focusBorder, #007fd4);
  }

  .function-read {
    border-left: 3px solid var(--success-color);
  }

  .function-write {
    border-left: 3px solid var(--primary-color);
  }

  .function-payable {
    border-left: 3px solid var(--warning-color);
  }

  .function-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  .function-header:hover {
    background-color: var(--hover-bg);
  }

  .function-info {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .function-name {
    font-weight: 600;
    font-size: 14px;
  }

  .success-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--success-color);
    color: white;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  .function-meta {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .function-spinner {
    margin-left: var(--space-xs);
  }

  .function-type {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 9999px;
    background-color: var(--panel-bg);
    font-weight: 500;
  }

  .function-read .function-type {
    background-color: rgba(14, 165, 233, 0.1);
    color: var(--success-color);
  }

  .function-write .function-type {
    background-color: rgba(0, 120, 212, 0.1);
    color: var(--primary-color);
  }

  .function-payable .function-type {
    background-color: rgba(245, 158, 11, 0.1);
    color: var(--warning-color);
  }

  .expand-icon {
    font-weight: bold;
    font-size: 16px;
    color: var(--secondary-text);
  }

  .function-details {
    padding: var(--space-md);
    border-top: 1px solid var(--border-color);
    animation: slideDown 0.2s ease;
    overflow: visible;
    position: relative;
  }

  .function-signature {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 13px;
    padding: var(--space-sm) var(--space-md);
    background-color: var(--bg-color);
    border-radius: var(--border-radius);
    margin-bottom: var(--space-md);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    align-items: center;
  }

  .returns-arrow {
    color: var(--secondary-text);
    margin: 0 var(--space-xs);
  }

  .function-inputs,
  .payable-options {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin-bottom: var(--space-lg);
  }

  .input-field label {
    display: block;
    margin-bottom: var(--space-sm);
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
  }

  .input-container {
    position: relative;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .param-type {
    color: var(--secondary-text);
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 13px;
    margin-left: var(--space-xs);
    opacity: 0.8;
  }

  .text-input {
    flex: 1;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-size: 14px;
    height: 38px;
    line-height: 1.5;
    transition: all 0.2s ease;
  }

  .text-input:focus {
    outline: 1px solid var(--primary-color);
    border-color: var(--primary-color);
  }

  .text-input.has-error {
    border-color: var(--error-color);
    outline: 1px solid var(--error-color);
  }

  .input-error {
    color: var(--error-color);
    font-size: 12px;
    margin-top: 4px;
    padding-left: var(--space-xs);
  }

  .paste-button {
    width: 38px;
    height: 38px;
    padding: 0;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .paste-button:hover:not(:disabled) {
    background-color: var(--vscode-button-secondaryHoverBackground);
    border-color: var(--vscode-button-hoverBackground);
    transform: translateY(-1px);
  }

  .paste-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .paste-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .paste-button svg {
    width: 18px;
    height: 18px;
  }

  .function-actions {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-lg);
    border-radius: var(--border-radius);
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    min-width: 100px;
    font-weight: 500;
  }

  .primary-button {
    background-color: var(--primary-color);
    color: white;
  }

  .primary-button:hover:not(:disabled) {
    background-color: var(--primary-hover);
  }

  .primary-button:active:not(:disabled) {
    background-color: var(--primary-active);
  }

  .secondary-button {
    background-color: var(--success-color);
    color: white;
  }

  .secondary-button:hover:not(:disabled) {
    opacity: 0.9;
  }

  .reset-button {
    background-color: transparent;
    color: var(--text-color);
    border: 1px solid var(--border-color);
  }

  .reset-button:hover:not(:disabled) {
    background-color: var(--hover-bg);
    border-color: var(--text-color);
  }

  .action-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .result-container {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow: hidden;
    margin-top: var(--space-md);
    background-color: var(--bg-color);
    animation: slideUp 0.3s ease;
  }

  .result-container.error-message {
    border-color: var(--error-color);
    background-color: rgba(239, 68, 68, 0.05);
  }

  .result-container.success {
    border-color: var(--success-color);
  }

  .status-header {
    display: flex;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    background-color: var(--panel-bg);
    border-bottom: 1px solid var(--border-color);
    position: relative;
  }

  .spacer {
    flex-grow: 1;
  }

  .copy-button {
    background-color: transparent;
    border: none;
    color: var(--vscode-editor-foreground);
    cursor: pointer;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: var(--border-radius);
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-button:hover {
    background-color: var(
      --vscode-button-secondaryHoverBackground,
      rgba(90, 93, 94, 0.31)
    );
  }

  .copy-button svg {
    width: 16px;
    height: 16px;
  }

  .status-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
  }

  .status-icon.success {
    background-color: var(--success-color);
  }

  .status-icon.error {
    background-color: var(--error-color);
    font-size: 10px;
  }

  .status-text {
    padding-left: 0.5%;
    font-weight: 600;
    font-size: 14px;
  }

  .error-content {
    padding: var(--space-md);
    color: var(--error-color);
    font-size: 13px;
    word-break: break-word;
  }

  .result-content {
    padding: var(--space-md);
  }

  .single-result {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 14px;
  }

  .result-value {
    word-break: break-all;
    color: var(--text-color);
  }

  .multiple-results {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .result-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--space-sm);
    background-color: var(--panel-bg);
    border-radius: var(--border-radius);
  }

  .result-label {
    font-weight: 600;
    font-size: 13px;
    color: var(--secondary-text);
  }

  .result-data {
    display: flex;
    gap: var(--space-sm);
    align-items: baseline;
    font-family: var(--vscode-editor-font-family, monospace);
  }

  .result-type {
    font-size: 11px;
    color: var(--secondary-text);
    opacity: 0.7;
  }

  .transaction-result {
    font-family: var(--vscode-editor-font-family, monospace);
  }

  .tx-summary {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .success-message {
    color: var(--success-color);
    font-weight: 500;
    margin: 0;
    text-align: center;
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--border-color);
  }

  .tx-hash,
  .tx-block {
    display: flex;
    gap: var(--space-md);
    align-items: center;
    padding: var(--space-xs) 0;
  }

  .tx-label {
    font-weight: 600;
    color: var(--secondary-text);
    min-width: 60px;
  }

  .tx-value {
    flex: 1;
    word-break: break-all;
    color: var(--primary-color);
    font-size: 13px;
  }

  .raw-result {
    background-color: var(--panel-bg);
    padding: var(--space-sm);
    border-radius: var(--border-radius);
    overflow-x: auto;
  }

  .raw-result pre {
    margin: 0;
    font-size: 12px;
    color: var(--text-color);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    .input-field {
      width: 100%;
    }
    .function-actions {
      flex-direction: column;
    }
    .action-button {
      width: 100%;
    }
    .tx-hash,
    .tx-block {
      flex-direction: column;
      gap: 4px;
    }
    .tx-label {
      min-width: unset;
    }
  }

  .contract-interface {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .functions-scroll-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--space-md);
    position: relative;
  }

  .functions-scroll-container::-webkit-scrollbar {
    width: 14px;
  }

  .functions-scroll-container::-webkit-scrollbar-track {
    background: var(--vscode-editor-background, #1e1e1e);
  }

  .functions-scroll-container::-webkit-scrollbar-thumb {
    background: var(
      --vscode-scrollbarSlider-background,
      rgba(121, 121, 121, 0.4)
    );
    border-radius: 7px;
    border: 3px solid transparent;
    background-clip: content-box;
  }

  .functions-scroll-container::-webkit-scrollbar-thumb:hover {
    background: var(
      --vscode-scrollbarSlider-hoverBackground,
      rgba(100, 100, 100, 0.7)
    );
    background-clip: content-box;
  }
</style>
