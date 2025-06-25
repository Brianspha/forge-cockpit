<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { AbiInputData, Function } from '../../types/index';
  import {
    readAbiFile,
    getPlaceholderForType,
    getDefaultValueForType,
    validateTypeValue,
    transformInputValue,
  } from '../../utils';

  const props = defineProps<{
    inputValues: Record<string, string>;
    loadingStates: Record<string, boolean>;
    encodedResults: Record<string, string>;
    encodingErrors: Record<string, string>;
    onPasteField?: (fieldId: string) => void;
  }>();

  const emit = defineEmits<{
    (e: 'update-input', fieldId: string, value: string): void;
    (e: 'encode-function', input: AbiInputData): void;
    (e: 'copy-to-clipboard', text: string): void;
  }>();

  const fileInputRef = ref<HTMLInputElement | null>(null);
  const abiFile = ref<File | null>(null);
  const abiContent = ref<Function[]>([]);
  const abiText = ref<string>('');
  const expandedFunctions = ref<Set<string>>(new Set());
  const uploadError = ref('');
  const inputErrors = ref<Record<string, string>>({});

  const functions = computed(() =>
    abiContent.value.filter(item => item.type === 'function')
  );

  const validateInput = (
    functionName: string,
    inputName: string,
    type: string,
    value: string
  ) => {
    const fieldId = getFieldId(functionName, inputName);
    const validation = validateTypeValue(type, value);

    if (validation.valid) {
      delete inputErrors.value[fieldId];
    } else {
      inputErrors.value[fieldId] = validation.error || 'Invalid value';
    }

    return validation.valid;
  };

  const handleFileUpload = (event: Event): void => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    readAbiFile(file, result => {
      if (result.error) {
        uploadError.value = result.error;
        abiContent.value = [];
      } else {
        abiContent.value = result.abiData;
        abiText.value = result.abiText;
        abiFile.value = result.file;
        uploadError.value = '';
        expandedFunctions.value.clear();
        emit(
          'update-input',
          'abi-paste',
          JSON.stringify(result.abiData, null, 2)
        );
      }
    });
  };

  const processAbiText = (text: string) => {
    try {
      const abi = JSON.parse(text);
      abiContent.value = abi;
      uploadError.value = '';
      expandedFunctions.value.clear();
      emit('update-input', 'abi-paste', text);
    } catch {
      uploadError.value = 'Invalid ABI format. Please provide valid JSON.';
      abiContent.value = [];
    }
  };

  const handleAbiTextChange = (event: Event) => {
    const text = (event.target as HTMLTextAreaElement).value;
    abiText.value = text;
    emit('update-input', 'abi-paste', text);

    if (text.trim()) {
      processAbiText(text);
      abiFile.value = null;
    } else {
      abiContent.value = [];
      uploadError.value = '';
    }
  };

  const getFieldId = (functionName: string, inputName: string) =>
    `encode-${functionName}-${inputName}`;

  const getInputValue = (functionName: string, inputName: string) => {
    const fieldId = getFieldId(functionName, inputName);
    return props.inputValues[fieldId] || '';
  };

  const updateInputValue = (
    functionName: string,
    inputName: string,
    type: string,
    value: string
  ) => {
    const fieldId = getFieldId(functionName, inputName);
    validateInput(functionName, inputName, type, value);
    emit('update-input', fieldId, value);
  };

  const encodeFunction = (func: Function) => {
    const inputs = func.inputs.map((input, index) => {
      const inputName = input.name || `param${index}`;
      const value = getInputValue(func.name, inputName);
      return transformInputValue(input.type, value);
    });

    emit('encode-function', {
      inputs,
      functionName: func.name,
      abi: abiContent.value,
    } as AbiInputData);
  };

  const handlePaste = (functionName: string, inputName: string) => {
    if (props.onPasteField) {
      props.onPasteField(getFieldId(functionName, inputName));
    }
  };

  const getInputError = (functionName: string, inputName: string) => {
    const fieldId = getFieldId(functionName, inputName);
    return inputErrors.value[fieldId];
  };

  watch(
    () => props.inputValues['abi-paste'],
    newValue => {
      if (newValue && newValue !== abiText.value) {
        abiText.value = newValue;
        processAbiText(newValue);
        abiFile.value = null;
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="abi-encoder">
    <div class="upload-section">
      <h2 class="section-title">ABI Function Encoder</h2>
      <p class="section-description">
        Upload an ABI file to encode function calls and get the encoded data
        output.
      </p>

      <div class="form-container">
        <div class="form-group">
          <label for="abi-input">Contract ABI</label>
          <div class="abi-input-container">
            <textarea
              id="abi-input"
              v-model="abiText"
              class="text-area"
              placeholder="Paste contract ABI in JSON format here..."
              @input="handleAbiTextChange"
            ></textarea>

            <div class="abi-actions">
              <button
                type="button"
                class="action-button clipboard-button"
                @click="props.onPasteField?.('abi-paste')"
                :disabled="props.loadingStates['abi-paste']"
                title="Paste from clipboard"
              >
                <span
                  v-if="props.loadingStates['abi-paste']"
                  class="button-content"
                >
                  <span class="button-spinner"></span>
                  Pasting...
                </span>
                <span v-else class="button-content">
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
                    class="button-icon"
                  >
                    <path
                      d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                    ></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  Paste
                </span>
              </button>

              <button
                type="button"
                class="action-button upload-button"
                @click="fileInputRef?.click()"
                title="Upload JSON file"
              >
                <span class="button-content">
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
                    class="button-icon"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Upload
                </span>
              </button>
            </div>
          </div>
          <div class="field-hint">
            Provide the contract's ABI by pasting JSON or uploading a file
            <span v-if="abiFile" class="file-info">
              • Loaded: {{ abiFile.name }}
            </span>
          </div>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          accept=".json,application/json"
          @change="handleFileUpload"
          style="display: none"
        />

        <div v-if="uploadError" class="error-message">
          <div class="error-header">
            <span class="error-icon">❌</span>
            <span>Upload Error</span>
          </div>
          <p>{{ uploadError }}</p>
        </div>
      </div>
    </div>

    <div v-if="functions.length > 0" class="functions-section">
      <div class="functions-header">
        <h3 class="section-subtitle">
          Available Functions ({{ functions.length }})
        </h3>
        <p class="section-description">
          Expand functions below to enter parameters and encode function calls.
        </p>
      </div>

      <div class="functions-list">
        <div v-for="func in functions" :key="func.name" class="function-panel">
          <div
            class="function-header"
            @click="
              expandedFunctions.has(func.name)
                ? expandedFunctions.delete(func.name)
                : expandedFunctions.add(func.name)
            "
          >
            <div class="function-info">
              <div class="function-name">{{ func.name }}</div>
              <div
                class="function-type-badge"
                :class="`type-${func.stateMutability}`"
              >
                {{ func.stateMutability }}
              </div>
            </div>
            <div class="expand-icon">
              {{ expandedFunctions.has(func.name) ? '−' : '+' }}
            </div>
          </div>

          <div v-if="expandedFunctions.has(func.name)" class="function-details">
            <div class="function-signature">
              <code>
                {{ func.name }}({{
                  func.inputs.map(i => `${i.type} ${i.name || ''}`).join(', ')
                }})
              </code>
            </div>

            <div v-if="func.inputs.length > 0" class="function-inputs">
              <div
                v-for="(input, index) in func.inputs"
                :key="`${func.name}-input-${index}`"
                class="form-group"
              >
                <label>
                  {{ input.name || `param${index}` }}
                  <span class="param-type">{{ input.type }}</span>
                </label>
                <div class="input-with-embedded-button">
                  <input
                    :value="
                      getInputValue(func.name, input.name || `param${index}`) ||
                      getDefaultValueForType(input.type)
                    "
                    :placeholder="getPlaceholderForType(input.type)"
                    :class="[
                      'text-input',
                      'with-button',
                      {
                        'input-error': getInputError(
                          func.name,
                          input.name || `param${index}`
                        ),
                      },
                    ]"
                    @input="
                      updateInputValue(
                        func.name,
                        input.name || `param${index}`,
                        input.type,
                        ($event.target as HTMLInputElement).value
                      )
                    "
                  />
                  <button
                    type="button"
                    class="embedded-paste-button"
                    title="Paste from clipboard"
                    :disabled="
                      props.loadingStates[
                        getFieldId(func.name, input.name || `param${index}`)
                      ]
                    "
                    @click="
                      handlePaste(func.name, input.name || `param${index}`)
                    "
                  >
                    <span
                      v-if="
                        props.loadingStates[
                          getFieldId(func.name, input.name || `param${index}`)
                        ]
                      "
                      class="button-spinner small"
                    ></span>
                    <span v-else class="paste-icon">
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
                        <path
                          d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                        ></path>
                        <rect
                          x="8"
                          y="2"
                          width="8"
                          height="4"
                          rx="1"
                          ry="1"
                        ></rect>
                      </svg>
                    </span>
                  </button>
                </div>
                <div
                  v-if="getInputError(func.name, input.name || `param${index}`)"
                  class="input-error-message"
                >
                  {{ getInputError(func.name, input.name || `param${index}`) }}
                </div>
              </div>
            </div>

            <div class="function-actions">
              <button
                class="action-button primary-button"
                @click="encodeFunction(func)"
              >
                <span class="button-content">
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
                    class="button-icon"
                  >
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  Encode Function
                </span>
              </button>
            </div>

            <div
              v-if="encodedResults[func.name] || encodingErrors[func.name]"
              class="result-container"
              :class="{ 'result-error': encodingErrors[func.name] }"
            >
              <div class="result-header">
                <div class="result-info">
                  <span class="result-label">
                    {{
                      encodingErrors[func.name]
                        ? 'Encoding Error'
                        : 'Encoded Data'
                    }}
                  </span>
                  <span
                    class="result-badge"
                    :class="{ 'badge-error': encodingErrors[func.name] }"
                  >
                    {{ encodingErrors[func.name] ? 'Error' : 'Ready' }}
                  </span>
                </div>
                <button
                  v-if="encodedResults[func.name]"
                  class="action-button copy-button"
                  @click="emit('copy-to-clipboard', encodedResults[func.name])"
                  title="Copy to clipboard"
                >
                  <span class="button-content">
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
                      class="button-icon"
                    >
                      <path
                        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                      ></path>
                      <rect
                        x="8"
                        y="2"
                        width="8"
                        height="4"
                        rx="1"
                        ry="1"
                      ></rect>
                    </svg>
                    Copy
                  </span>
                </button>
              </div>
              <textarea
                :value="encodingErrors[func.name] || encodedResults[func.name]"
                class="result-textarea"
                :class="{ 'textarea-error': encodingErrors[func.name] }"
                readonly
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="abiContent.length > 0" class="empty-state">
      <div class="empty-icon">📄</div>
      <h3>No Functions Found</h3>
      <p>The uploaded ABI doesn't contain any function definitions.</p>
    </div>
  </div>
</template>

<style scoped>
  .abi-encoder {
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    background-color: var(--vscode-editor-background);
    color: var(--vscode-foreground);
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--vscode-foreground);
  }

  .section-subtitle {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--vscode-foreground);
  }

  .section-description {
    color: var(--vscode-descriptionForeground);
    margin: 0 0 1.5rem 0;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .upload-section {
    margin-bottom: 2rem;
  }

  .form-container {
    background-color: var(--vscode-editor-background);
    border: 1px solid var(--vscode-widget-border);
    border-radius: 4px;
    padding: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--vscode-foreground);
    font-size: 0.9rem;
  }

  .param-type {
    color: var(--vscode-descriptionForeground);
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 0.8rem;
    margin-left: 0.5rem;
    opacity: 0.8;
    font-weight: normal;
  }

  .abi-input-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .text-area {
    width: 100%;
    min-height: 150px;
    padding: 0.75rem;
    border: 1px solid var(--vscode-input-border);
    border-radius: 4px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 0.9rem;
    resize: vertical;
    line-height: 1.4;
    transition: border-color 0.2s;
  }

  .text-area:focus {
    outline: none;
    border-color: var(--vscode-focusBorder);
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
  }

  .text-area:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
  }

  .abi-actions {
    display: flex;
    gap: 8px;
  }

  .clipboard-button {
    flex: 1;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border: 1px solid transparent;
  }

  .clipboard-button:hover:not(:disabled) {
    background-color: var(--vscode-button-hoverBackground);
  }

  .file-info {
    color: var(--vscode-textLink-foreground);
    font-weight: 500;
  }

  .input-with-embedded-button {
    position: relative;
    width: 100%;
  }

  .text-input.with-button {
    width: 100%;
    padding: 0.75rem;
    padding-right: 40px;
    border: 1px solid var(--vscode-input-border);
    border-radius: 4px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-family: var(--vscode-font-family);
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }

  .text-input.with-button:focus {
    outline: none;
    border-color: var(--vscode-focusBorder);
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
  }

  .text-input.with-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
  }

  .text-input.input-error {
    border-color: var(--vscode-inputValidation-errorBorder, #f56565);
    box-shadow: 0 0 0 1px var(--vscode-inputValidation-errorBorder, #f56565);
    background-color: var(
      --vscode-inputValidation-errorBackground,
      rgba(245, 101, 101, 0.05)
    );
  }

  .text-input.input-error:focus {
    border-color: var(--vscode-inputValidation-errorBorder, #f56565);
    box-shadow: 0 0 0 2px
      var(--vscode-inputValidation-errorBorder, rgba(245, 101, 101, 0.2));
  }

  .input-error-message {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--vscode-inputValidation-errorForeground, #f56565);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .input-error-message::before {
    content: '⚠';
    font-size: 0.9rem;
  }

  .embedded-paste-button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 36px;
    background: transparent;
    border: none;
    border-left: 1px solid var(--vscode-input-border);
    color: var(--vscode-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.7;
    transition:
      opacity 0.2s,
      background-color 0.2s;
    border-radius: 0 4px 4px 0;
  }

  .embedded-paste-button:hover:not(:disabled) {
    opacity: 1;
    background-color: var(
      --vscode-button-secondaryHoverBackground,
      rgba(255, 255, 255, 0.1)
    );
  }

  .embedded-paste-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: var(--vscode-disabledForeground);
  }

  .action-button {
    height: 36px;
    padding: 0 16px;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upload-button {
    flex: 1;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
  }

  .primary-button {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
  }

  .copy-button {
    background-color: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    border: 1px solid transparent;
  }

  .action-button:hover:not(:disabled) {
    background-color: var(--vscode-button-hoverBackground);
  }

  .copy-button:hover:not(:disabled) {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }

  .action-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--vscode-input-background);
    color: var(--vscode-disabledForeground);
  }

  .button-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .button-icon {
    flex-shrink: 0;
  }

  .button-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--vscode-foreground, rgba(255, 255, 255, 0.3));
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .button-spinner.small {
    width: 12px;
    height: 12px;
    border-width: 1.5px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .field-hint {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--vscode-descriptionForeground);
  }

  .error-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: var(--vscode-inputValidation-errorBackground);
    border-left: 3px solid var(--vscode-inputValidation-errorBorder);
    color: var(--vscode-inputValidation-errorForeground);
    border-radius: 4px;
  }

  .error-header {
    display: flex;
    align-items: center;
    font-weight: 600;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }

  .functions-section {
    margin-top: 2rem;
  }

  .functions-header {
    margin-bottom: 1.5rem;
  }

  .functions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .function-panel {
    background-color: var(--vscode-editor-background);
    border: 1px solid var(--vscode-widget-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .function-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid transparent;
    background-color: var(--vscode-editor-background);
  }

  .function-header:hover {
    background-color: var(--vscode-list-hoverBackground);
  }

  .function-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .function-name {
    font-weight: 600;
    font-size: 1rem;
    color: var(--vscode-foreground);
  }

  .function-type-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: lowercase;
    border: 1px solid var(--vscode-contrastBorder, transparent);
  }

  .type-view,
  .type-pure {
    background-color: var(
      --vscode-gitDecoration-addedResourceForeground,
      rgba(34, 197, 94, 0.15)
    );
    color: var(
      --vscode-gitDecoration-addedResourceForeground,
      rgb(34, 197, 94)
    );
  }

  .type-nonpayable {
    background-color: var(
      --vscode-textLink-foreground,
      rgba(59, 130, 246, 0.15)
    );
    color: var(--vscode-textLink-foreground, rgb(59, 130, 246));
  }

  .type-payable {
    background-color: var(
      --vscode-notificationsWarningIcon-foreground,
      rgba(245, 158, 11, 0.15)
    );
    color: var(--vscode-notificationsWarningIcon-foreground, rgb(245, 158, 11));
  }

  .expand-icon {
    font-weight: bold;
    font-size: 1.2rem;
    color: var(--vscode-descriptionForeground);
    transition: transform 0.2s;
  }

  .function-details {
    padding: 1.5rem;
    border-top: 1px solid var(--vscode-widget-border);
    animation: slideDown 0.2s ease;
    background-color: var(--vscode-editor-background);
  }

  .function-signature {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 0.9rem;
    padding: 1rem;
    background-color: var(--vscode-textCodeBlock-background);
    border-radius: 4px;
    margin-bottom: 1.5rem;
    border: 1px solid var(--vscode-widget-border);
    color: var(--vscode-foreground);
  }

  .function-inputs {
    margin-bottom: 1.5rem;
  }

  .function-actions {
    margin-bottom: 1.5rem;
  }

  .result-container {
    border: 1px solid var(--vscode-widget-border);
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--vscode-textCodeBlock-background);
  }

  .result-container.result-error {
    border-color: var(--vscode-inputValidation-errorBorder, #f56565);
    background-color: var(
      --vscode-inputValidation-errorBackground,
      rgba(245, 101, 101, 0.05)
    );
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: var(--vscode-editor-background);
    border-bottom: 1px solid var(--vscode-widget-border);
  }

  .result-container.result-error .result-header {
    background-color: var(
      --vscode-inputValidation-errorBackground,
      rgba(245, 101, 101, 0.1)
    );
    border-bottom-color: var(--vscode-inputValidation-errorBorder, #f56565);
  }

  .result-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .result-label {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--vscode-foreground);
  }

  .result-badge {
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    background-color: var(
      --vscode-gitDecoration-addedResourceForeground,
      rgba(34, 197, 94, 0.15)
    );
    color: var(
      --vscode-gitDecoration-addedResourceForeground,
      rgb(34, 197, 94)
    );
    border: 1px solid var(--vscode-contrastBorder, transparent);
  }

  .result-badge.badge-error {
    background-color: var(
      --vscode-inputValidation-errorBackground,
      rgba(245, 101, 101, 0.15)
    );
    color: var(--vscode-inputValidation-errorForeground, #f56565);
  }

  .result-textarea {
    width: 100%;
    padding: 1rem;
    border: none;
    background-color: var(--vscode-textCodeBlock-background);
    color: var(--vscode-foreground);
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 0.85rem;
    resize: vertical;
    min-height: 80px;
    line-height: 1.4;
  }

  .result-textarea.textarea-error {
    background-color: var(
      --vscode-inputValidation-errorBackground,
      rgba(245, 101, 101, 0.03)
    );
    color: var(--vscode-inputValidation-errorForeground, #f56565);
  }

  .result-textarea:focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
    background-color: var(--vscode-editor-background);
    border: 1px solid var(--vscode-widget-border);
    border-radius: 4px;
    margin-top: 2rem;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
    color: var(--vscode-descriptionForeground);
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    color: var(--vscode-foreground);
    font-size: 1.1rem;
  }

  .empty-state p {
    margin: 0;
    color: var(--vscode-descriptionForeground);
    font-size: 0.9rem;
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

  @media (max-width: 768px) {
    .abi-encoder {
      padding: 1rem;
    }

    .abi-actions {
      flex-direction: column;
    }

    .function-header {
      padding: 0.75rem 1rem;
    }

    .function-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .function-details {
      padding: 1rem;
    }

    .result-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .copy-button {
      width: 100%;
    }
  }
</style>
