import { defineStore } from 'pinia';
import { vscode } from '../utils/vscode';
import type {
  TestFile,
  FunctionCallResponse,
  MessageResponse,
  DeployedContract,
  DeployContract,
  FunctionCall,
  ProcessedEvent,
  ABI,
  ScriptResponse,
} from '../types';

export const useContractStore = defineStore('contract', {
  state: () => ({
    contracts: [] as TestFile[],
    deployedContracts: [] as DeployedContract[],
    pendingContracts: [] as DeployContract[],
    selectedContractId: null as string | null,
    isLoading: false,
    isExecutionLoading: false,
    transactions: [] as FunctionCallResponse[],
    lastDeployedContract: null as DeployedContract | null,
  }),

  actions: {
    sendMessage(command: string, payload: any) {
      switch (command) {
        case 'refreshContracts':
        case 'executeFunction':
          this.isExecutionLoading = true;
          break;
      }
      vscode.postMessage({
        command,
        payload:
          typeof payload === 'object' && payload !== null
            ? JSON.stringify(payload, null, 2)
            : String(payload || ''),
      });
    },

    refreshContracts() {
      this.isLoading = true;
      this.sendMessage('refreshContracts', '');
    },

    setContracts(message: MessageResponse) {
      this.contracts = message.payload as TestFile[];
      this.isLoading = false;
    },
    deployContract(command: string, payload: any) {
      this.pendingContracts.push(payload as DeployContract);
      this.sendMessage(command, payload);
    },
    executeFunction(call: FunctionCall) {
      this.sendMessage('executeFunction', call);
    },
    getContractABI(contractName: string): ABI {
      const contract = this.contracts.find(
        contract => contract.fileName === contractName
      );
      return contract ? contract.abi : [];
    },
    runScript(command: string, payload: any) {
      this.pendingContracts.push(payload as DeployContract);
      this.sendMessage(command, payload);
    },
    setFunctionExecutionResponse(response: MessageResponse) {
      const transaction = response.payload as FunctionCallResponse;
      this.isExecutionLoading = false;
      this.transactions.push({
        ...transaction,
        logs:
          (JSON.parse(response.payload.logs) as Array<ProcessedEvent>) || [],
      });
    },
    setScriptExecutionResults(response: ScriptResponse) {
      if (response.success) {
        response.contracts.map(transaction => {
          if (transaction && transaction.success) {
            this.pendingContracts = this.pendingContracts.filter(
              contract => contract.contractName !== transaction.contractName
            );
            this.deployedContracts.push(transaction);
            this.lastDeployedContract = transaction;
            this.transactions.push({
              hash: transaction.hash || '',
              functionName: 'deploy',
              params: [],
              timestamp: new Date().toISOString(),
              status: transaction.success,
              result: transaction.address || '',
              caller: transaction.address || '',
              logs: transaction.logs || [],
              address: transaction.address || '',
              contractName: transaction.contractName,
              nodeUrl: '',
            });
          }
        });
      } else {
        this.lastDeployedContract = null;
        this.pendingContracts.pop();
      }
    },
    removeContract(contractName: string) {
      this.transactions = this.transactions.filter(
        transaction => transaction.contractName !== contractName
      );

      this.deployedContracts = this.deployedContracts.filter(
        contract => contract.contractName !== contractName
      );
    },
    setContractDeploymentResults(response: MessageResponse) {
      const transaction = response.payload as DeployedContract;
      if (transaction && transaction.success) {
        this.pendingContracts = this.pendingContracts.filter(
          contract => contract.contractName !== transaction.contractName
        );
        this.deployedContracts.push(transaction);
        this.lastDeployedContract = transaction;
        this.transactions.push({
          contractName: transaction.contractName,
          hash: transaction.hash || '',
          functionName: 'deploy',
          params: [],
          timestamp: new Date().toISOString(),
          status: transaction.success,
          result: transaction.address || '',
          caller: transaction.address || '',
          logs:
            (JSON.parse(response.payload.logs) as Array<ProcessedEvent>) || [],
          address: transaction.address || '',
          nodeUrl: '',
        });
      } else {
        this.lastDeployedContract = null;
        this.pendingContracts.pop();
      }
    },

    resetState() {
      this.transactions = [];
      this.contracts = [];
      this.selectedContractId = null;
    },
  },
});
