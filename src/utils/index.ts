import { encodeFunctionData } from "viem";
import { AbiInputData, Account, EncodeResponse } from "../types";

export const ALREADY_PINNED_KEY = "FORGE_COCKPIT_ALREADY_PINNED";
export const ACTIVE_NODE_KEY = "FORGE_COCKPIT_ACTIVE_NODES";

export const ForgeCockpitCommand = {
	TransferCommand: "forge-cockpit.transfer",
	LoadCockPitWalletsCommand: "forge-cockpit.loadWallets",
	StubForgeTestsCommand: "forge-cockpit.stubForgeTests",
	ShowForgeCockPitCommand: "cockpit.showForgeCockPit",
	RebuildProjectCommand: "forge-cockpit.rebuildProject",
	RunTestCommand: "forge-cockpit.runTest",
	RunTestViaIRCommand: "forge-cockpit.runTestViaIR",
	RunGroupCommand: "forge-cockpit.runGroup",
	RefreshTestsCommand: "forge-cockpit.refreshTests",
	AbiEncodeCommand: "forge-cockpit.abiEncode",
	ForkNodeCommand: "forge-cockpit.forkNode",
	WalletBalancesCommand: "forge-cockpit.walletBalances",
	ExecuteFunctionCommand: "forge-cockpit.executeFunction",
	StopNodeCommand: "forge-cockpit.stopNode",
	DeployContractCommand: "forge-cockpit.deployContract",
	GetActiveNodesCommand: "forge-cockpit.getActiveNodes",
	ShowBuildOutputCommand: "forge-cockpit.showBuildOutput",
	PinEditorCommand: "workbench.action.pinEditor",
	RunScriptCommand: "forge-cockpit.runScript",
	ClearCacheCommand: "forge-cockpit.clearCache",
	TerminateAllTasksCommand: "workbench.action.tasks.terminate",
	OpenUrlCommand: "forge-cockpit.openUrl",
	VsOpenUrlCommand: "vscode.open",
} as const;

export const WebviewCommand = {
	LoadCockpitWallets: "loadWallets",
	OpenLinkCommand: "openLink",
	GetActiveNodesCommand: "getActiveNodes",
	StopNodeCommand: "stopNode",
	DeployContractCommand: "deployContract",
	WalletBalancesCommand: "walletBalances",
	ExecuteFunctionCommand: "executeFunction",
	WriteClipboardCommand: "writeClipboard",
	RefreshContractsCommand: "refreshContracts",
	LoadContractsCommand: "loadContracts",
	ForkNodeCommand: "forkNode",
	RunScriptCommand: "runScript",
	AbiEncodeCommand: "abiEncode",
	TransferCommand: "transfer",
	TokenInfoCommand: "tokenInfo",
} as const;

export const ClipBoardTypeCommand = {
	ReadWalletImportCommand: "readClipboard:walletImport",
	ReadTransferCommand: "readClipboard:transfer",
	ReadClipboardWalletCommand: "readClipboard:wallet",
	ReadClipboardDeploymentCommand: "readClipboard:deployment",
	ReadClipboardAnvilCommand: "readClipboard:anvil",
	ReadClipboardConstructorArgsCommand: "readClipboard:constructorArgs",
	ReadClipboardFunctionInputCommand: "readClipboard:functionInput",
	ReadClipboardEncoderCommand: "readClipboardEncoder",
	ReadClipboard: "readClipboard",
} as const;

export const ForgeCockPitResponseCommand = {
	GetDefaultWalletsResponse: "getDefaultWalletResponse",
	GetActiveNodesResponse: "getActiveNodesResponse",
	DeployContractResponse: "deployContractResponse",
	WalletBalancesResponse: "walletBalancesResponse",
	ExecuteFunctionResponse: "executeFunctionResponse",
	ClipboardContentResponse: "clipboardContentResponse",
	ForkNodeResultsResponse: "forkNodeResultsResponse",
	SetContractsResponse: "setContractsResponse",
	RunScriptResponse: "setRunScriptResponse",
	StopNodeResponse: "stopNodeResponse",
	AbiEncodeResponse: "abiEncodeResponse",
	TransferResponse: "transferResponse",
	TokenInfoResponse: "tokenInfoResponse",
} as const;

export const COCKPIT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forge Cockpit</title>
    <style>
        :root {
            --background-color: #1e1e1e;
            --foreground-color: #d4d4d4;
            --accent-color: #3794ff;
            --card-background: #252526;
            --card-border: #3794ff;
            --section-background: #333333;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: var(--background-color);
            color: var(--foreground-color);
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 1px solid #444;
            padding-bottom: 20px;
        }

        header h1 {
            margin: 0;
            color: var(--accent-color);
            font-size: 28px;
        }

        .logo {
            width: 40px;
            height: 40px;
            margin-right: 15px;
            background-color: var(--accent-color);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #fff;
        }

        .card {
            background-color: var(--card-background);
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid var(--card-border);
        }

        .card h2 {
            margin-top: 0;
            color: var(--accent-color);
            font-size: 20px;
        }

        .placeholder {
            background-color: var(--section-background);
            border-radius: 4px;
            padding: 30px 20px;
            text-align: center;
            color: #888;
            margin: 15px 0;
        }

        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }

        .status {
            font-size: 14px;
            color: #888;
            margin-top: 20px;
            text-align: center;
        }

        .button {
            background-color: var(--accent-color);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 8px;
        }

        .button:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">FC</div>
            <h1>Forge Cockpit</h1>
        </header>

        <div class="grid">
            <div class="card">
                <h2>Test Explorer</h2>
                <p>Run and monitor your Foundry tests from this interface.</p>
                <div class="placeholder">
                    <p>Vue.js Test Runner Application</p>
                    <p>This is where your test explorer will be rendered.</p>
                </div>
            </div>

            <div class="card">
                <h2>Contract Information</h2>
                <p>View detailed information about your smart contracts.</p>
                <div class="placeholder">
                    <p>Contract Data Visualization</p>
                    <p>Contract metrics and insights will appear here.</p>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>Test Results</h2>
            <p>View the results of your most recent test runs.</p>
            <div class="placeholder">
                <p>Test Results Dashboard</p>
                <p>Detailed test results with gas usage and execution time will be displayed here.</p>
            </div>
        </div>

        <div class="status">
            <p>This is a placeholder interface. The full Vue.js application will be integrated in a future update.</p>
        </div>
    </div>
</body>
</html>`;

export function shouldTriggerBuild(key: string): boolean {
	const buildRelatedSettings = [
		"forge-cockpit.useViaIr",
		"forge-cockpit.optimizer",
		"forge-cockpit.optimizerRuns",
		"forge-cockpit.foundryPath",
		"forge-cockpit.remappings",
	];

	return buildRelatedSettings.includes(key);
}

export function safeStringify(obj: any): string {
	return JSON.stringify(obj, (_key, value) =>
		typeof value === "bigint" ? value.toString() : value
	);
}

export const DEFAULT_ANVIL_ACCOUNTS = {
	accounts: {
		"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80":
			"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
		"0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d":
			"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
		"0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a":
			"0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
		"0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6":
			"0x90F79bf6EB2c4f870365E785982E1f101E93b906",
		"0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a":
			"0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
		"0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba":
			"0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
		"0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e":
			"0x976EA74026E726554dB657fA54763abd0C3a0aa9",
		"0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356":
			"0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
		"0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97":
			"0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
		"0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6":
			"0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
	},
};

export function readAccounts(accountsJson: any) {
	return Object.entries(accountsJson).map(([privateKey, publicKey]) => ({
		privateKey,
		publicKey,
	})) as Array<Account>;
}

export function encodeFunction(input: AbiInputData): EncodeResponse {
	try {
		const data = encodeFunctionData({
			abi: input.abi,
			functionName: input.functionName,
			args: input.inputs,
		});

		return {
			success: true,
			data,
			error: "",
			functionName: input.functionName,
		} as EncodeResponse;
	} catch (error) {
		return {
			success: false,
			data: "0x",
			error: (error as Error).toString(),
			functionName: input.functionName,
		} as EncodeResponse;
	}
}
