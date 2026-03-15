import { defineStore } from 'pinia';
import type {
  CockpitSettingUpdate,
  CockpitSettings,
  LocalProjectState,
  MessageResponse,
} from '../types';
import { ForgeCockPitResponseCommand } from '../utils';
import { WebviewCommand } from '../utils';
import { vscode } from '../utils/vscode';

export type VSCodeCommand = 'writeClipboard' | string;

const defaultProjectState: LocalProjectState = {
  status: 'missingArtifacts',
  message: 'Loading local project state...',
  hasArtifacts: false,
  updatedAt: new Date(0).toISOString(),
};

export const useAppStore = defineStore('useAppStore', {
  state: () => ({
    localProjectState: defaultProjectState,
    projectStateLoaded: false,
    cockpitSettings: null as CockpitSettings | null,
    settingsLoaded: false,
    isUpdatingSettings: false,
  }),
  actions: {
    sendMessage(command: any, payload: any) {
      vscode.postMessage({
        command,
        payload:
          typeof payload === 'object' && payload !== null
            ? JSON.stringify(payload, null, 2)
            : String(payload || ''),
      });
    },
    handleIncomingMessage(message: MessageResponse) {
      if (
        message.type === ForgeCockPitResponseCommand.ProjectStatusResponse ||
        message.type === ForgeCockPitResponseCommand.RebuildProjectResponse
      ) {
        this.localProjectState = message.payload as LocalProjectState;
        this.projectStateLoaded = true;
        return;
      }

      if (
        message.type === ForgeCockPitResponseCommand.CockpitSettingsResponse
      ) {
        this.cockpitSettings = message.payload as CockpitSettings;
        this.settingsLoaded = true;
        this.isUpdatingSettings = false;
      }
    },
    setLocalProjectState(projectState: LocalProjectState) {
      this.localProjectState = projectState;
      this.projectStateLoaded = true;
    },
    requestCockpitSettings() {
      this.sendMessage(WebviewCommand.GetCockpitSettingsCommand, undefined);
    },
    updateCockpitSetting(setting: CockpitSettingUpdate) {
      this.isUpdatingSettings = true;
      this.sendMessage(WebviewCommand.UpdateCockpitSettingCommand, setting);
    },
  },
});
