import * as vscode from "vscode";

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
	outputs: Array<Output>;
	stateMutability: string;
	anonymous?: boolean;
};

export type ABI = Array<Function>;

export type BaseResponse = {
	success: boolean;
	error?: string;
};

export type ContractIdentifier = {
	contractName: string;
	filePath: string;
};

export type NetworkContext = {
	nodeUrl: string;
};

export type FunctionContext = {
	functionName: string;
	abi: ABI;
};

export type TestFile = {
	fileName: string;
	filePath: string;
	solFileName: string;
	fileUri?: vscode.Uri;
	isFolder: boolean;
	tests: Array<SingleTest>;
	abi: ABI;
	bytecode: string;
};

export type SingleTest = ContractIdentifier & {
	testName: string;
	status: boolean;
	viaIR?: boolean;
};

export type Test = Pick<SingleTest, "contractName" | "testName">;

export type Config = {
	viaIR: boolean;
	verbosity: string;
	srcDir: string;
	testDir: string;
	scriptDir: string;
	outputDir: string;
	workspaceRoot: vscode.Uri;
};

export type Stub = ContractIdentifier;

export type Account = {
	publicKey: string;
	privateKey: string;
};

export type ForkDetails = BaseResponse & {
	port: string;
	accounts: Array<Account>;
};

export type ForkInfo = NetworkContext & {
	requestId: string;
	port: string;
	tabId: string;
};

export type WalletBalancesInfo = NetworkContext & {
	wallets: string[];
};

export type FunctionCall = NetworkContext &
	FunctionContext & {
		contractAddress: string;
		params: any[];
		caller: string;
		msgSender: string;
		staticCall: boolean;
	};

export type FunctionCallResponse = {
	hash: string;
	functionName: string;
	params: any;
	timestamp: string;
	status: boolean;
	result: string;
	error?: string;
	caller: string;
	logs: any;
};

export type CustomTaskDefinition = vscode.TaskDefinition & {
	type: "foundry";
	command: DefinitionType;
	taskId?: string;
	port: string;
	testName?: string;
	contractFile?: string;
	nodeUrl?: string;
	args?: string[];
};

export type DeployContract = NetworkContext & {
	contractName: string;
	constructorArgs: any[];
	from: string;
	abi: ABI;
	msgSender: string;
	bytecode: string;
	scriptName?: string;
	chainId?: string;
	privateKey?: string;
	viaIR?: boolean;
};

export type DeployedContract = NetworkContext & {
	address: string;
	success: boolean;
	hash: string;
	logs: any;
	contractName?: string;
};

export type TestExecutionResponse = BaseResponse & {
	testName: string;
	fileName: string;
	testResults?: Map<string, boolean>;
};

export type ScriptResponse = BaseResponse & {
	contracts: Array<DeployedContract>;
	scriptName: string;
};

export type AbiInputData = FunctionContext & {
	inputs: any[];
};

export type EncodeResponse = BaseResponse & {
	data: string;
	functionName: string;
};

export type ContractInfo = {
	name: string;
	isUpgradeable: boolean;
	hasInitializer: boolean;
	dependencies: Set<string>;
	inheritanceChain: string[];
	stateVariables: Array<StateVariable>;
	upgradeType: UpgradeType;
	usesFoundryUpgrades: boolean;
};

export type TestTemplate = {
	imports: string;
	declarations: string;
	setup: string;
};

export type ContractPattern = {
	name: string;
	detect: (sourceCode: string, abi: ABI) => boolean;
	template: TestTemplate;
};

export type EventInfo = {
	name: string;
	signature: string;
	indexed: string[];
	nonIndexed: string[];
	inputs: any[];
};

export type StateVariable = {
	name: string;
	type: string;
	visibility: string;
};

export type ImportedAccounts = {
	accounts: Map<string, string>;
};

export type TransferTransaction = {
	type: TransferType;
	from: string;
	to: string;
	amount: string;
	nodeUrl: string;
};

export type TransferResponse = {
	success: boolean;
	error: string;
	hash: string;
};

export type UpgradeType = "uups" | "transparent" | "beacon" | "custom" | "none";
export type DefinitionType = "build" | "test" | "clean" | "fork" | "stop-fork" | "script";
export type TransferType = "eth" | "token";
