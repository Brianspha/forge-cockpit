import * as path from "path";
import * as vscode from "vscode";
import * as parser from "@solidity-parser/parser";
import { ABI, ContractInfo, UpgradeType } from "../types";
import { fileExists } from "./index";

type ParsedContract = {
	name: string;
	baseContracts: string[];
};

type ParsedSource = {
	relativePath: string;
	content: string;
	imports: string[];
	contracts: ParsedContract[];
};

export type ScaffoldAnalysis = {
	contractName: string;
	contractImportPath: string;
	sourceCode: string;
	importGraph: string[];
	contractImportMap: Map<string, string>;
	dependencyImportPaths: Map<string, string>;
	contractInfo: ContractInfo;
};

export class SolidityScaffoldAnalyzer {
	constructor(private readonly workspaceRoot: vscode.Uri) {}

	public async analyze(
		filePath: string,
		contractName: string,
		abi: ABI
	): Promise<ScaffoldAnalysis> {
		const entryPath = this.normalizeRelativePath(filePath);
		const sources = new Map<string, ParsedSource>();
		await this.collectSourceGraph(entryPath, sources);

		const entrySource = sources.get(entryPath);
		if (!entrySource) {
			throw new Error(`Unable to analyze Solidity source at ${entryPath}`);
		}

		const contractImportMap = this.buildContractImportMap(sources);
		const rootContract = this.findContract(entrySource.contracts, contractName);
		const resolvedContractName = rootContract?.name || contractName;
		const inheritanceChain = rootContract
			? this.collectInheritanceChain(rootContract, contractImportMap, sources, new Set())
			: [];
		const dependencyNames = this.extractDependencyNames(abi);
		const dependencyImportPaths = new Map<string, string>();

		for (const dependencyName of dependencyNames) {
			const importPath = contractImportMap.get(dependencyName);
			if (importPath && importPath !== entryPath) {
				dependencyImportPaths.set(dependencyName, importPath);
			}
		}

		const contractInfo = this.buildContractInfo(
			resolvedContractName,
			entrySource,
			sources,
			abi,
			dependencyNames,
			inheritanceChain
		);

		return {
			contractName: resolvedContractName,
			contractImportPath: entryPath,
			sourceCode: entrySource.content,
			importGraph: Array.from(sources.keys()),
			contractImportMap,
			dependencyImportPaths,
			contractInfo,
		};
	}

	private async collectSourceGraph(
		relativePath: string,
		sources: Map<string, ParsedSource>
	): Promise<void> {
		if (sources.has(relativePath)) {
			return;
		}

		const uri = vscode.Uri.joinPath(this.workspaceRoot, relativePath);
		if (!(await fileExists(uri))) {
			return;
		}

		const raw = await vscode.workspace.fs.readFile(uri);
		const content = Buffer.from(raw).toString("utf8");
		const parsedSource = this.parseSource(relativePath, content);
		sources.set(relativePath, parsedSource);

		for (const importPath of parsedSource.imports) {
			const resolvedImportPath = await this.resolveImportPath(relativePath, importPath);
			if (resolvedImportPath) {
				await this.collectSourceGraph(resolvedImportPath, sources);
			}
		}
	}

	private parseSource(relativePath: string, content: string): ParsedSource {
		try {
			const ast = parser.parse(content, {});
			const imports: string[] = [];
			const contracts: ParsedContract[] = [];

			this.visit(ast, {
				ImportDirective: (node: any) => {
					if (typeof node.path === "string") {
						imports.push(node.path);
					}
				},
				ContractDefinition: (node: any) => {
					contracts.push({
						name: node.name,
						baseContracts:
							node.baseContracts?.map((base: any) => this.extractBaseContractName(base)) || [],
					});
				},
				LibraryDefinition: (node: any) => {
					contracts.push({
						name: node.name,
						baseContracts: [],
					});
				},
				InterfaceDefinition: (node: any) => {
					contracts.push({
						name: node.name,
						baseContracts: [],
					});
				},
			});

			return {
				relativePath,
				content,
				imports,
				contracts,
			};
		} catch {
			return {
				relativePath,
				content,
				imports: this.extractImportsFromSource(content),
				contracts: this.extractContractsFromSource(content),
			};
		}
	}

	private visit(ast: any, visitors: Record<string, (node: any) => void>): void {
		parser.visit(ast, visitors);
	}

	private extractImportsFromSource(content: string): string[] {
		return Array.from(
			content.matchAll(/import\s+(?:[^"']+from\s+)?["']([^"']+)["'];/g),
			match => match[1]
		);
	}

	private extractContractsFromSource(content: string): ParsedContract[] {
		return Array.from(
			content.matchAll(
				/(?:abstract\s+)?(?:contract|library|interface)\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s+is\s+([^{]+))?\s*\{/g
			),
			match => ({
				name: match[1],
				baseContracts: match[2]
					? match[2]
							.split(",")
							.map(item => item.trim().split("(")[0].trim())
							.filter(Boolean)
					: [],
			})
		);
	}

	private extractBaseContractName(baseContract: any): string {
		if (baseContract?.baseName?.namePath) {
			return baseContract.baseName.namePath.split(".").pop();
		}

		return baseContract?.namePath?.split(".").pop() || "";
	}

	private async resolveImportPath(
		currentRelativePath: string,
		importPath: string
	): Promise<string | undefined> {
		const normalizedImportPath = importPath.replace(/\\/g, "/");

		if (normalizedImportPath.startsWith(".")) {
			const resolvedPath = path
				.normalize(path.join(path.dirname(currentRelativePath), normalizedImportPath))
				.replace(/\\/g, "/");
			const resolvedUri = vscode.Uri.joinPath(this.workspaceRoot, resolvedPath);
			return (await fileExists(resolvedUri)) ? resolvedPath : undefined;
		}

		const directUri = vscode.Uri.joinPath(this.workspaceRoot, normalizedImportPath);
		if (await fileExists(directUri)) {
			return normalizedImportPath;
		}

		return undefined;
	}

	private normalizeRelativePath(filePath: string): string {
		const workspaceRootPath = this.workspaceRoot.fsPath;

		if (path.isAbsolute(filePath)) {
			return path.relative(workspaceRootPath, filePath).replace(/\\/g, "/");
		}

		return filePath.replace(/\\/g, "/");
	}

	private buildContractImportMap(sources: Map<string, ParsedSource>): Map<string, string> {
		const contractImportMap = new Map<string, string>();

		for (const source of sources.values()) {
			for (const contract of source.contracts) {
				if (!contractImportMap.has(contract.name)) {
					contractImportMap.set(contract.name, source.relativePath);
				}
			}
		}

		return contractImportMap;
	}

	private findContract(
		contracts: ParsedContract[],
		contractName: string
	): ParsedContract | undefined {
		return contracts.find(contract => contract.name === contractName) || contracts[0];
	}

	private collectInheritanceChain(
		contract: ParsedContract,
		contractImportMap: Map<string, string>,
		sources: Map<string, ParsedSource>,
		visited: Set<string>
	): string[] {
		const inheritanceChain: string[] = [];

		for (const baseContractName of contract.baseContracts) {
			if (!baseContractName || visited.has(baseContractName)) {
				continue;
			}

			visited.add(baseContractName);
			inheritanceChain.push(baseContractName);

			const baseImportPath = contractImportMap.get(baseContractName);
			if (!baseImportPath) {
				continue;
			}

			const baseSource = sources.get(baseImportPath);
			if (!baseSource) {
				continue;
			}

			const baseContract = this.findContract(baseSource.contracts, baseContractName);
			if (baseContract) {
				inheritanceChain.push(
					...this.collectInheritanceChain(baseContract, contractImportMap, sources, visited)
				);
			}
		}

		return inheritanceChain;
	}

	private buildContractInfo(
		contractName: string,
		entrySource: ParsedSource,
		sources: Map<string, ParsedSource>,
		abi: ABI,
		dependencies: Set<string>,
		inheritanceChain: string[]
	): ContractInfo {
		const allContent = Array.from(sources.values())
			.map(source => source.content)
			.join("\n");
		const allImports = Array.from(sources.values()).flatMap(source => source.imports);
		const hasInitializer =
			abi.some(item => item.name === "initialize" || item.name === "reinitialize") ||
			/\bfunction\s+(initialize|reinitialize)\b/.test(allContent) ||
			/\b(initializer|reinitializer)\b/.test(allContent);
		const isUups =
			inheritanceChain.some(item => item.includes("UUPS")) ||
			allContent.includes("_authorizeUpgrade");
		const isBeacon =
			allImports.some(item => item.includes("Beacon")) ||
			allContent.includes("UpgradeableBeacon") ||
			allContent.includes("BeaconProxy");
		const isTransparent =
			allImports.some(item => item.includes("Transparent")) ||
			allContent.includes("TransparentUpgradeableProxy") ||
			allContent.includes("ProxyAdmin");
		const usesUpgradeableImports = allImports.some(
			item =>
				item.includes("contracts-upgradeable") ||
				item.includes("openzeppelin-foundry-upgrades") ||
				item.includes("Initializable")
		);
		const isUpgradeable =
			hasInitializer || isUups || isBeacon || isTransparent || usesUpgradeableImports;
		const upgradeType = this.resolveUpgradeType({
			isUpgradeable,
			isUups,
			isBeacon,
			isTransparent,
		});

		return {
			name: contractName,
			isUpgradeable,
			hasInitializer,
			dependencies,
			inheritanceChain: [...new Set(inheritanceChain)],
			stateVariables: [],
			upgradeType,
			usesFoundryUpgrades: isUpgradeable,
		};
	}

	private resolveUpgradeType(input: {
		isUpgradeable: boolean;
		isUups: boolean;
		isBeacon: boolean;
		isTransparent: boolean;
	}): UpgradeType {
		if (!input.isUpgradeable) {
			return "none";
		}

		if (input.isUups) {
			return "uups";
		}

		if (input.isBeacon) {
			return "beacon";
		}

		if (input.isTransparent) {
			return "transparent";
		}

		return "transparent";
	}

	private extractDependencyNames(abi: ABI): Set<string> {
		const dependencies = new Set<string>();
		const initMethods = abi.filter(
			item => item.type === "constructor" || item.name === "initialize"
		);

		for (const method of initMethods) {
			for (const input of method.inputs || []) {
				const dependencyName = this.extractContractName(input.internalType);
				if (dependencyName) {
					dependencies.add(dependencyName);
				}
			}
		}

		return dependencies;
	}

	private extractContractName(internalType?: string): string | undefined {
		if (!internalType?.includes("contract ")) {
			return undefined;
		}

		const match = internalType.match(/contract\s+([^\s]+)/);
		return match?.[1];
	}
}
