export type Output = {
  name: string;
  type: string;
  indexed?: boolean;
  internalType: string;
  components: Array<Output>;
};

export type Function = {
  type: string;
  name: string;
  inputs: Array<Output>;
  outputs?: Array<Output>;
  stateMutability: StateMutability;
  constant?: boolean;
  payable?: boolean;
  anonymous?: boolean;
};

export type ABI = Array<Function>;

export type BaseResponse = {
  success: boolean;
  error?: string;
};

export type NetworkContext = {
  nodeUrl: string;
};

export type PortContext = {
  port: string;
};

export type ContractContext = {
  contractName: string;
  contractAddress?: string;
};

export type TransactionContext = {
  hash: string;
  logs: ProcessedEvent[];
};

export type FunctionContext = {
  functionName: string;
  abi: ABI;
};

export type ProcessedEvent = {
  id?: string;
  eventName: string;
  args: Record<string, any>;
  address: string;
  topics: string[];
  data: string;
  blockHash: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;
};

export type Account = {
  publicKey: string;
  privateKey: string;
};

export type SingleTest = {
  contractName: string;
  filePath: string;
  testName: string;
  status: boolean;
  viaIR?: boolean;
};

export type TestFile = {
  fileName: string;
  filePath: string;
  isFolder: boolean;
  tests: Array<SingleTest>;
  abi: ABI;
  bytecode: string;
};

export type AbiInputData = FunctionContext & {
  inputs: any[];
};

export type EncodeResponse = BaseResponse & {
  data: string;
  functionName: string;
};

export type FunctionCallResponse = NetworkContext &
  ContractContext &
  TransactionContext & {
    functionName: string;
    params: any;
    timestamp: string;
    status: boolean;
    result: string;
    caller: string;
    address: string;
  };

export type FunctionCall = NetworkContext &
  FunctionContext &
  ContractContext & {
    params: any[];
    caller: string;
    msgSender: string;
    staticCall: boolean;
    bytecode: string;
  };

export type Token = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balances: Record<string, string>;
};

export type AnvilInstance = NetworkContext &
  PortContext & {
    status: AnvilStatus;
    type: NetworkType;
  };

export type ForkDetails = BaseResponse &
  PortContext & {
    accounts: Array<Account>;
  };

export type ForkInfo = NetworkContext &
  PortContext & {
    requestId?: string;
    tabId?: string;
    useExisting?: boolean;
  };

export type DeployedContract = NetworkContext &
  ContractContext &
  TransactionContext &
  BaseResponse & {
    address: string;
  };

export type DeployContract = NetworkContext &
  FunctionContext & {
    contractName: string;
    constructorArgs: any[];
    msgSender: string;
    bytecode: string;
    viaIR?: boolean;
  };

export type ScriptResponse = BaseResponse & {
  contracts: Array<DeployedContract>;
  scriptName: string;
};

export type AbiTab = NetworkContext &
  PortContext &
  ContractContext & {
    id: string;
    title: string;
    parsedAbi: ABI;
    isConnected: boolean;
    isLoading: boolean;
    error: string;
    transactions: FunctionCallResponse[];
    validationWarnings: string[];
    accounts: Array<Account>;
    executingFunctionId?: string;
    functionResults?: { [functionName: string]: any };
    useExistingNode: boolean;
    parentForkId: string;
  };

export type PendingRequest = {
  id: string;
  tabId: string;
  functionName: string;
  timestamp: number;
};

export type Message = BaseResponse & {
  type: string;
  payload?: any;
  tabId?: string;
  data?: any;
  txHash?: string;
  result?: string;
  params?: any[];
};

export type MessageResponse = {
  payload: any;
  command: string;
  previousType: string;
  type: string;
  tabId: string;
  previousPayload: string;
};

export type AnvilModalExposed = {
  handleCreationSuccess: () => void;
  handleCreationFailure: (error: string) => void;
};

export type AbiValidationResponse = BaseResponse;

export type AbiFormData = NetworkContext &
  PortContext & {
    contractAddress: string;
    customAbi: string;
    isLoading: boolean;
    error: string;
    newAbiForm: boolean;
    validationWarnings: string[];
    useExistingNode: boolean;
  };

export type TransferTransaction = {
  type: TransferType;
  from: string;
  to: string;
  amount: string;
  nodeUrl: string;
};

export type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
};

export type TokenInfoResponse = {
  data: TokenInfo;
  success: boolean;
  error: string;
};

export type TransferResponse = {
  hash: string;
  success: boolean;
  error: string;
};

export type ActiveContractTab = 'readFunctions' | 'writeFunctions' | 'rawAbi';
export type ActiveContractTypeTab = 'regular' | 'script' | 'encoder';
export type DeployInputType = 'nodeUrl' | 'port';
export type NetworkType = 'default' | 'fork' | 'live' | 'anvil';
export type AnvilStatus = 'running' | 'stopped';
export type StateMutability = 'pure' | 'view' | 'nonpayable' | 'payable';
export type TransactionStatus = 'pending' | 'success' | 'error' | null;
export type TransferType = 'eth' | 'token';
