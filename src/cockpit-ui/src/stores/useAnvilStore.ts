import { defineStore } from 'pinia';
import { AnvilInstance, ForkDetails, MessageResponse } from '../types';
import { vscode } from '../utils/vscode';
import { WebviewCommand } from '../utils';

export const useAnvilStore = defineStore('useAnvilStore', {
  state: () => ({
    instances: [] as AnvilInstance[],
    pendingInstances: [] as AnvilInstance[],
  }),
  actions: {
    updateInstances(response: MessageResponse) {
      this.instances = response.payload as AnvilInstance[];
    },
    addInstance(instance: AnvilInstance) {
      this.instances.push(instance);
    },
    removeInstance(port: string) {
      const index = this.instances.findIndex(inst => inst.port === port);
      if (index !== -1) {
        this.instances.splice(index, 1);
      }
    },
    createAnvilInstance(payload: any) {
      this.pendingInstances.push({
        port: payload.port,
        nodeUrl: `http://localhost:${payload.port}`,
        status: 'stopped',
      } as AnvilInstance);
      this.sendMessage('forkNode', payload);
    },
    stopAnvilInstance(port: string) {
      this.sendMessage(WebviewCommand.StopNodeCommand, port);
    },
    sendMessage(command: string, payload: any) {
      vscode.postMessage({
        command,
        payload:
          typeof payload === 'object' && payload !== null
            ? JSON.stringify(payload, null, 2)
            : String(payload || ''),
      });
    },
    setAnvilResponse(response: MessageResponse) {
      const anvilResponse = response.payload as ForkDetails;
      const instance = this.pendingInstances.pop();
      if (instance && instance.nodeUrl && instance.port) {
        this.instances.push({
          nodeUrl: instance.nodeUrl,
          port: instance.port,
          status: anvilResponse.success ? 'running' : 'stopped',
          type: 'anvil',
        });
      } else {
        this.instances.push({
          nodeUrl: `http://localhost:${anvilResponse.port}`,
          port: anvilResponse.port,
          status: anvilResponse.success ? 'running' : 'stopped',
          type: 'anvil',
        });
      }
    },
    setActivePorts(response: MessageResponse): void {
      const ports = response.payload as string[];
      this.instances = [];
      ports.forEach(port => {
        this.instances.push({
          port,
          nodeUrl: `http://localhost:${port}`,
          status: 'running',
        } as AnvilInstance);
      });
    },
    updateInstance(port: string, updates: Partial<AnvilInstance>) {
      const instance = this.instances.find(inst => inst.port === port);
      if (instance) {
        const index = this.instances.indexOf(instance);
        this.instances[index] = Object.assign(instance, updates);
      }
    },
  },
});
