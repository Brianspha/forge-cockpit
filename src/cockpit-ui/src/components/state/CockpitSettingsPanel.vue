<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { onClickOutside } from '@vueuse/core';
  import type { CockpitSettings } from '../../types';

  const props = defineProps<{
    isOpen: boolean;
    settings: CockpitSettings | null;
    isUpdating: boolean;
  }>();

  const emit = defineEmits<{
    close: [];
    'update-test-verbosity': [value: string];
  }>();

  const panelRef = ref<HTMLElement | null>(null);

  onClickOutside(panelRef, () => {
    if (props.isOpen) {
      emit('close');
    }
  });

  const projectRows = computed(() => {
    if (!props.settings) {
      return [];
    }

    return [
      { label: 'Project Root', value: props.settings.project.projectRoot },
      { label: 'Source Dir', value: props.settings.project.srcDir },
      { label: 'Test Dir', value: props.settings.project.testDir },
      { label: 'Script Dir', value: props.settings.project.scriptDir },
      { label: 'Output Dir', value: props.settings.project.outputDir },
      {
        label: 'Default viaIR',
        value: props.settings.project.viaIR ? 'Enabled' : 'Disabled',
      },
    ];
  });

  const handleVerbosityChange = (event: Event) => {
    const target = event.target as HTMLSelectElement | null;
    if (!target) {
      return;
    }

    emit('update-test-verbosity', target.value);
  };
</script>

<template>
  <div v-if="isOpen" ref="panelRef" class="settings-panel">
    <div class="settings-section">
      <div class="settings-heading">
        <h3>Cockpit Settings</h3>
        <button class="close-button" type="button" @click="$emit('close')">
          Close
        </button>
      </div>
      <p class="settings-copy">
        Extension-level settings update immediately. Project paths and `viaIR`
        come from `foundry.toml`.
      </p>
    </div>

    <div class="settings-section">
      <label class="settings-label" for="test-verbosity-select">
        Test Verbosity
      </label>
      <select
        id="test-verbosity-select"
        class="settings-select"
        :disabled="!settings || isUpdating"
        :value="settings?.testVerbosity ?? ''"
        @change="handleVerbosityChange"
      >
        <option
          v-for="option in settings?.availableVerbosityLevels ?? []"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <p class="settings-hint">
        Used for Cockpit-triggered `forge test` runs, including code lens
        actions.
      </p>
    </div>

    <div class="settings-section">
      <h4 class="section-title">Project Configuration</h4>
      <div class="settings-grid">
        <div v-for="row in projectRows" :key="row.label" class="settings-row">
          <span class="row-label">{{ row.label }}</span>
          <span class="row-value">{{ row.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .settings-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 30;
    width: min(420px, calc(100vw - 32px));
    padding: 16px;
    border: 1px solid var(--vscode-dropdown-border, var(--border-color));
    border-radius: 10px;
    background: var(--vscode-editorWidget-background, var(--card-bg));
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.28);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .settings-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .settings-heading h3,
  .section-title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: var(--vscode-editor-foreground);
  }

  .close-button {
    border: 1px solid var(--vscode-button-border, transparent);
    background: transparent;
    color: var(--vscode-foreground);
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
  }

  .close-button:hover {
    background: var(
      --vscode-toolbar-hoverBackground,
      rgba(255, 255, 255, 0.08)
    );
  }

  .settings-copy,
  .settings-hint {
    font-size: 12px;
    color: var(--vscode-descriptionForeground, rgba(255, 255, 255, 0.65));
  }

  .settings-label,
  .row-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--vscode-descriptionForeground, rgba(255, 255, 255, 0.65));
  }

  .settings-select {
    width: 100%;
    border: 1px solid var(--vscode-dropdown-border, var(--border-color));
    background: var(--vscode-dropdown-background, var(--input-bg));
    color: var(--vscode-dropdown-foreground, var(--text));
    border-radius: 8px;
    padding: 10px 12px;
  }

  .settings-grid {
    display: grid;
    gap: 10px;
  }

  .settings-row {
    display: grid;
    gap: 4px;
    padding: 10px 12px;
    border: 1px solid var(--vscode-widget-border, rgba(255, 255, 255, 0.08));
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
  }

  .row-value {
    font-size: 13px;
    color: var(--vscode-editor-foreground);
    word-break: break-word;
  }
</style>
