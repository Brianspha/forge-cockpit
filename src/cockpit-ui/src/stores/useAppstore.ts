import { defineStore } from 'pinia';
import { vscode } from '../utils/vscode';

export type VSCodeCommand = 'writeClipboard' | string;

export const useAppStore = defineStore('useAppStore', {
  state: () => ({}),
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
  },
});
