import {
	http,
	createPublicClient,
	formatEther,
	createWalletClient,
	TransactionReceipt,
	defineChain,
	parseEther,
} from "viem";
import {
	DeployContract,
	DeployedContract,
	EncodeResponse,
	FunctionCall,
	FunctionCallResponse,
	TransferResponse,
	TransferTransaction,
} from "../types";
import { CockPitLogProvider } from "./logProvider";
import { safeStringify } from "../utils";

export class WalletProvider {
	private publicClient: ReturnType<typeof createPublicClient>;
	constructor(
		private rpcUrl: string,
		private logger: CockPitLogProvider
	) {
		this.publicClient = createPublicClient({
			transport: http(this.rpcUrl),
		});
	}

	async getBalances(wallets: string[]): Promise<string[]> {
		try {
			const balances = await Promise.all(
				wallets.map(address =>
					this.publicClient.getBalance({
						address: address as `0x${string}`,
					})
				)
			);

			const formattedBalances = balances.map(balance => formatEther(balance).toString());
			this.logger.logToOutput(
				`Balances retrieved: ${wallets.length} wallets: ${formattedBalances.join(", ")} ETH`
			);

			return formattedBalances;
		} catch (error: any) {
			this.logger.logToOutput(
				`Balance fetch failed: ${wallets.length} wallets - ${(error as Error).stack}`
			);
			return Array(wallets.length).fill("0");
		}
	}

	private createChain(nodeUrl: string, chainId: number) {
		return defineChain({
			id: chainId,
			name: "Forge Cockpit",
			nativeCurrency: {
				decimals: 18,
				name: "Ether",
				symbol: "ETH",
			},
			rpcUrls: {
				default: {
					http: [nodeUrl],
					webSocket: [],
				},
			},
		});
	}

	public async executeFunction(callInfo: FunctionCall): Promise<FunctionCallResponse> {
		try {
			const chainId = await this.publicClient.getChainId();

			const walletClient = createWalletClient({
				chain: this.createChain(callInfo.nodeUrl, chainId),
				transport: http(callInfo.nodeUrl),
			});

			if (callInfo.staticCall) {
				const data = await this.publicClient.readContract({
					address: callInfo.contractAddress as `0x${string}`,
					abi: callInfo.abi,
					functionName: callInfo.functionName,
					args: callInfo.params,
				});

				this.logger.logToOutput(
					`Read call successful: ${callInfo.functionName}(${JSON.stringify(callInfo.params)}) -> ${callInfo.contractAddress} | Result: ${JSON.stringify(data, (_key, value) => (typeof value === "bigint" ? value.toString() : value))}`
				);

				return {
					logs: JSON.stringify([]),
					hash: "0x",
					functionName: callInfo.functionName,
					params: callInfo.params,
					timestamp: Date.now().toString(),
					status: data !== null,
					error: "",
					result: JSON.stringify(data, (_key, value) =>
						typeof value === "bigint" ? value.toString() : value
					),
					caller: callInfo.caller,
					address: callInfo.contractAddress,
				} as FunctionCallResponse;
			}

			const { request } = await this.publicClient.simulateContract({
				address: callInfo.contractAddress as `0x${string}`,
				abi: callInfo.abi,
				functionName: callInfo.functionName,
				args: callInfo.params,
				account: callInfo.msgSender as `0x${string}`,
			});

			const hash = await walletClient.writeContract(request);
			const transaction: TransactionReceipt = await this.publicClient.getTransactionReceipt({
				hash,
			});

			this.logger.logToOutput(
				`Write call ${transaction.status}: ${callInfo.functionName}(${JSON.stringify(callInfo.params)}) -> ${callInfo.contractAddress} | Tx: ${hash} | Gas used: ${transaction.gasUsed.toString()} | Logs: ${transaction.logs.length}`
			);

			return {
				logs: safeStringify(transaction.logs),
				hash: hash,
				functionName: callInfo.functionName,
				params: callInfo.params,
				timestamp: Date.now().toString(),
				status: transaction.status === "success",
				error: "",
				result: "",
				address: callInfo.contractAddress,
				caller: callInfo.caller,
			} as FunctionCallResponse;
		} catch (error) {
			this.logger.logToOutput(
				`Function call failed: ${callInfo.functionName}(${JSON.stringify(callInfo.params)}) -> ${callInfo.contractAddress} | Error: ${(error as Error).stack}`
			);

			return {
				logs: JSON.stringify([]),
				hash: "",
				functionName: callInfo.functionName,
				params: callInfo.params,
				timestamp: Date.now().toString(),
				status: false,
				error: `Unable to make contract call due to error: ${(error as Error).toString()}`,
				result: "",
				address: callInfo.contractAddress,
				caller: callInfo.caller,
			} as FunctionCallResponse;
		}
	}

	async isAnvilNode(): Promise<boolean> {
		try {
			const result = await this.publicClient.request({
				method: "anvil_nodeInfo",
				params: [],
			});
			return !!result;
		} catch {
			return false;
		}
	}

	public async chainId(): Promise<string> {
		return (await this.publicClient.getChainId()).toString();
	}

	public async deployContract(config: DeployContract): Promise<DeployedContract> {
		try {
			const chainId = await this.publicClient.getChainId();
			const chain = this.createChain(config.nodeUrl, chainId);
			const walletClient = createWalletClient({
				chain,
				transport: http(config.nodeUrl),
			});

			this.logger.logToOutput(
				`Deploy started: ${config.contractName} | Args: ${JSON.stringify(config.constructorArgs)} | Deployer: ${config.msgSender}`
			);

			const hash = await walletClient.deployContract({
				abi: config.abi,
				account: config.msgSender as `0x${string}`,
				args: config.constructorArgs,
				bytecode: config.bytecode as `0x${string}`,
				chain,
			});

			const receipt = await this.publicClient.waitForTransactionReceipt({
				hash,
			});

			const logs = await this.publicClient.getContractEvents({
				abi: config.abi,
				address: receipt.contractAddress as `0x${string}`,
				fromBlock: "earliest",
			});

			this.logger.logToOutput(
				`Deploy ${receipt.status}: ${config.contractName} -> ${receipt.contractAddress} | Tx: ${hash} | Gas used: ${receipt.gasUsed.toString()} | Events: ${logs.length}`
			);

			return {
				hash,
				address: receipt.contractAddress,
				success: receipt.status === "success",
				nodeUrl: config.nodeUrl,
				contractName: config.contractName,
				logs: safeStringify(logs),
			} as DeployedContract;
		} catch (error) {
			this.logger.logToOutput(
				`Deploy failed: ${config.contractName} | Args: ${JSON.stringify(config.constructorArgs)} | Deployer: ${config.msgSender} | Error: ${(error as Error).stack}`
			);

			return {
				hash: "",
				address: "",
				success: false,
				nodeUrl: config.nodeUrl,
				contractName: config.contractName,
				logs: JSON.stringify([]),
			} as DeployedContract;
		}
	}

	public async getContractEvents(callInfo: FunctionCall): Promise<FunctionCallResponse> {
		try {
			const logs = await this.publicClient.getContractEvents({
				address: callInfo.contractAddress as `0x${string}`,
				abi: callInfo.abi,
				fromBlock: "earliest",
			});

			this.logger.logToOutput(
				`Events retrieved: ${logs.length} events from ${callInfo.contractAddress} | Function: ${callInfo.functionName}`
			);

			return {
				logs: safeStringify(logs),
				hash: "",
				functionName: callInfo.functionName,
				params: callInfo.params,
				timestamp: Date.now().toString(),
				status: true,
				error: "",
				result: "",
				caller: callInfo.caller,
				address: callInfo.contractAddress,
			} as FunctionCallResponse;
		} catch (error) {
			this.logger.logToOutput(
				`Events fetch failed: ${callInfo.contractAddress} | Function: ${callInfo.functionName} | Error: ${(error as Error).stack}`
			);

			return {
				logs: JSON.stringify([]),
				hash: "",
				functionName: callInfo.functionName,
				params: callInfo.params,
				timestamp: Date.now().toString(),
				status: false,
				error: `Unable to make contract call due to error: ${(error as Error).toString()}`,
				result: "",
				caller: callInfo.caller,
				address: callInfo.contractAddress,
			} as FunctionCallResponse;
		}
	}
	public async transfer(info: TransferTransaction): Promise<TransferResponse> {
		try {
			const chainId = await this.publicClient.getChainId();
			const walletClient = createWalletClient({
				chain: this.createChain(info.nodeUrl, chainId),
				transport: http(info.nodeUrl),
			});
			this.logger.logToOutput(
				`Transferring ${info.amount} ETH to ${info.to as `0x${string}`} from ${info.from as `0x${string}`}`
			);
			const hash = await walletClient.sendTransaction({
				account: info.from as `0x${string}`,
				to: info.to as `0x${string}`,
				value: parseEther(info.amount.toString()),
			});
			const [receipt, balanceFrom, balanceTo] = await Promise.all([
				this.publicClient.waitForTransactionReceipt({
					hash,
				}),
				this.publicClient.getBalance({
					address: info.from as `0x${string}`,
				}),
				this.publicClient.getBalance({
					address: info.to as `0x${string}`,
				}),
			]);

			this.logger.logToOutput(
				`Transferred ${info.amount} ETH to ${info.to as `0x${string}`} from ${info.from as `0x${string}`} transaction hash: ${hash} new balance From: ${formatEther(balanceFrom)} new balance To ${formatEther(balanceTo)}`
			);
			return {
				success: receipt.status === "success",
				hash: hash,
				error: receipt.status,
			} as TransferResponse;
		} catch (error) {
			const err = error as Error;
			this.logger.logToOutput(
				`Error Transferring ${info.amount} ETH to ${info.to as `0x${string}`} from ${info.from as `0x${string}`} error ${err.stack}`
			);
			return {
				success: false,
				hash: "",
				error: err.message,
			} as TransferResponse;
		}
	}
}
