import * as vscode from "vscode";
import { ABI, ContractPattern, EventInfo, StateVariable } from "../types";
import { CockPitLogProvider } from "./logProvider";
import path from "path";

export class StubTestProvider {
	private readonly contractName: string;
	private readonly abi: ABI;
	private readonly logger: CockPitLogProvider;
	private sourceCode = "";
	private readonly dependencies = new Set<string>();
	private readonly events = new Map<string, EventInfo[]>();
	private readonly stateVariables = new Map<string, StateVariable>();
	private readonly abiEvents = new Map<string, any>();
	private readonly errors = new Map<string, any>();

	private readonly patterns: ContractPattern[] = [
		{
			name: "foundry-uups",
			detect: (code, abi) =>
				code.includes("openzeppelin-foundry-upgrades") &&
				(code.includes("UUPS") || this.hasInitializer(abi)),
			template: {
				imports: 'import {UnsafeUpgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";',
				declarations: "address public proxy;",
				setup: `proxy = UnsafeUpgrades.deployUUPSProxy(\n            address(new {{CONTRACT}}()),\n            {{INIT_DATA}}\n        );\n        {{CONTRACT_VAR}} = {{CONTRACT}}(proxy);`,
			},
		},
		{
			name: "foundry-transparent",
			detect: (code, abi) =>
				code.includes("openzeppelin-foundry-upgrades") && code.includes("Transparent"),
			template: {
				imports: 'import {UnsafeUpgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";',
				declarations: "address public proxy;",
				setup: `proxy = UnsafeUpgrades.deployTransparentProxy(\n            address(new {{CONTRACT}}()),\n            address(this),\n            {{INIT_DATA}}\n        );\n        {{CONTRACT_VAR}} = {{CONTRACT}}(proxy);`,
			},
		},
		{
			name: "erc1967-proxy",
			detect: (code, abi) =>
				(code.includes("upgradeable") || code.includes("proxy") || this.hasInitializer(abi)) &&
				!code.includes("foundry-upgrades"),
			template: {
				imports: 'import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";',
				declarations: "ERC1967Proxy public proxy;\n    address public implementation;",
				setup: `implementation = address(new {{CONTRACT}}());
        proxy = new ERC1967Proxy(implementation, {{INIT_DATA}});
        {{CONTRACT_VAR}} = {{CONTRACT}}(address(proxy));`,
			},
		},
		{
			name: "regular",
			detect: () => true,
			template: {
				imports: "",
				declarations: "",
				setup: "{{CONTRACT_VAR}} = new {{CONTRACT}}({{CONSTRUCTOR_PARAMS}});",
			},
		},
	];

	private readonly baseTemplate = `// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "src/{{CONTRACT}}.sol";{{DEPENDENCY_IMPORTS}}{{PATTERN_IMPORTS}}

contract {{CONTRACT}}Test is Test {
    {{CONTRACT}} public {{CONTRACT_VAR}};{{DEPENDENCY_DECLARATIONS}}{{PATTERN_DECLARATIONS}}
    
    uint256 constant INITIAL_BALANCE = 100 ether;
    address public constant ALICE = address(0xA11CE);
    address public constant BOB = address(0xB0B);
    address public constant CHARLIE = address(0xC4A4);
    address public constant DAVE = address(0xDA5E);

    function setUp() public {
        vm.deal(ALICE, INITIAL_BALANCE);
        vm.deal(BOB, INITIAL_BALANCE);
        vm.deal(CHARLIE, INITIAL_BALANCE);
        vm.deal(DAVE, INITIAL_BALANCE);
        
        vm.label(ALICE, "Alice");
        vm.label(BOB, "Bob");
        vm.label(CHARLIE, "Charlie");
        vm.label(DAVE, "Dave");
        
        vm.startPrank(BOB);
{{DEPENDENCY_SETUP}}        {{PATTERN_SETUP}}
        vm.stopPrank();
    }
{{TESTS}}{{FUZZ_TESTS}}
}
`;

	constructor(contractName: string, abi: ABI, logger: CockPitLogProvider) {
		this.contractName = contractName;
		this.abi = abi;
		this.logger = logger;
		this.findDependencies();
		this.extractAbiEvents();
		this.extractAbiErrors();
	}

	public async generateTestFile(filePath: string): Promise<void> {
		try {
			const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
			if (!workspaceFolder) {
				throw new Error("No workspace folder found.");
			}
			const absolutePath = path.join(workspaceFolder.uri.fsPath, filePath);
			const sourceCode = await vscode.workspace.fs.readFile(vscode.Uri.file(absolutePath));
			this.sourceCode = Buffer.from(sourceCode).toString("utf8");

			this.extractStateVariables();
			this.mapFunctionEvents();

			const content = this.renderTemplate();
			const document = await vscode.workspace.openTextDocument({
				content,
				language: "solidity",
			});
			await vscode.window.showTextDocument(document);
			this.logger.logToOutput(`Generated test file for ${this.contractName}`);
		} catch (error) {
			this.logger.logToOutput(`Error generating test file: ${(error as Error).stack}`);
		}
	}

	private extractAbiEvents(): void {
		const eventItems = this.abi.filter(item => item.type === "event");
		for (const event of eventItems) {
			if (event.name) {
				this.abiEvents.set(event.name, event);
			}
		}
	}

	private extractAbiErrors(): void {
		const errorItems = this.abi.filter(item => item.type === "error");
		for (const error of errorItems) {
			if (error.name) {
				this.errors.set(error.name, error);
			}
		}
	}

	private extractStateVariables(): void {
		if (!this.sourceCode) {
			return;
		}

		const stateVarRegex =
			/(?:uint256|uint\d*|int256|int\d*|bool|address|string|bytes\d*|mapping\([^)]+\)|struct\s+\w+|\w+)\s+(public|private|internal|constant|immutable)\s+(\w+)(?:\s*=\s*[^;]+)?;/g;

		let match;
		while ((match = stateVarRegex.exec(this.sourceCode)) !== null) {
			const type = match[0].split(/\s+/)[0];
			const visibility = match[1];
			const name = match[2];

			this.stateVariables.set(name, {
				name,
				type,
				visibility,
			});
		}
	}

	private mapFunctionEvents(): void {
		if (!this.sourceCode) {
			return;
		}

		const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*[^{]*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;

		let match;
		while ((match = functionRegex.exec(this.sourceCode)) !== null) {
			const functionName = match[1];
			const functionBody = match[2];

			const emittedEvents = this.extractEmittedEvents(functionBody);
			if (emittedEvents.length > 0) {
				this.events.set(functionName, emittedEvents);
			}
		}
	}

	private extractEmittedEvents(functionBody: string): EventInfo[] {
		const events: EventInfo[] = [];
		const emitRegex = /emit\s+(\w+)\s*\(([^)]*)\)/g;

		let match;
		while ((match = emitRegex.exec(functionBody)) !== null) {
			const eventName = match[1];

			const abiEvent = this.abiEvents.get(eventName);
			if (abiEvent) {
				const eventInfo: EventInfo = {
					name: eventName,
					signature: this.buildEventSignature(abiEvent),
					indexed:
						abiEvent.inputs
							?.filter((input: any) => input.indexed)
							.map((input: any) => input.name) || [],
					nonIndexed:
						abiEvent.inputs
							?.filter((input: any) => !input.indexed)
							.map((input: any) => input.name) || [],
					inputs: abiEvent.inputs || [],
				};
				events.push(eventInfo);
			}
		}

		return events;
	}

	private buildEventSignature(event: any): string {
		if (!event.inputs || event.inputs.length === 0) {
			return `${event.name}()`;
		}

		const paramTypes = event.inputs.map((input: any) => input.type).join(",");
		return `${event.name}(${paramTypes})`;
	}

	private analyzeFunction(func: any): {
		modifiesState: boolean;
		accessesState: string[];
		modifiesVariables: string[];
		hasEvents: boolean;
		eventCount: number;
		isPayable: boolean;
		canRevert: boolean;
	} {
		const functionName = func.name;
		const functionEvents = this.events.get(functionName) || [];

		let modifiesState = false;
		let accessesState: string[] = [];
		let modifiesVariables: string[] = [];
		let canRevert = false;

		if (this.sourceCode && functionName) {
			const functionBodyMatch = this.sourceCode.match(
				new RegExp(
					`function\\s+${functionName}\\s*\\([^)]*\\)\\s*[^{]*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}`,
					"g"
				)
			);

			if (functionBodyMatch && functionBodyMatch[0]) {
				const functionBody = functionBodyMatch[0];

				for (const [varName, varInfo] of this.stateVariables) {
					if (
						functionBody.includes(`${varName} =`) ||
						functionBody.includes(`${varName}++`) ||
						functionBody.includes(`${varName}--`) ||
						functionBody.includes(`++${varName}`) ||
						functionBody.includes(`--${varName}`) ||
						functionBody.includes(`${varName}[`) ||
						functionBody.includes(`${varName}.`)
					) {
						modifiesState = true;
						modifiesVariables.push(varName);
					}

					if (functionBody.includes(varName)) {
						accessesState.push(varName);
					}
				}

				canRevert =
					functionBody.includes("require(") ||
					functionBody.includes("revert(") ||
					functionBody.includes("assert(") ||
					functionBody.includes("_revert");
			}
		}

		if (!modifiesState) {
			modifiesState = func.stateMutability !== "view" && func.stateMutability !== "pure";
		}

		return {
			modifiesState,
			accessesState: [...new Set(accessesState)],
			modifiesVariables: [...new Set(modifiesVariables)],
			hasEvents: functionEvents.length > 0,
			eventCount: functionEvents.length,
			isPayable: func.stateMutability === "payable",
			canRevert,
		};
	}

	private renderTemplate(): string {
		const pattern = this.detectPattern();
		const context = this.buildContext(pattern);
		return this.replaceTokens(this.baseTemplate, context);
	}

	private detectPattern(): ContractPattern {
		return this.patterns.find(p => p.detect(this.sourceCode, this.abi)) || this.patterns[3];
	}

	private buildContext(pattern: ContractPattern): Record<string, string> {
		return {
			CONTRACT: this.contractName,
			CONTRACT_VAR: this.contractName.toLowerCase(),
			DEPENDENCY_IMPORTS: this.renderDependencyImports(),
			DEPENDENCY_DECLARATIONS: this.renderDependencyDeclarations(),
			DEPENDENCY_SETUP: this.renderDependencySetup(),
			PATTERN_IMPORTS: pattern.template.imports ? `\n${pattern.template.imports}` : "",
			PATTERN_DECLARATIONS: pattern.template.declarations
				? `\n    ${pattern.template.declarations}`
				: "",
			PATTERN_SETUP: this.replaceTokens(pattern.template.setup, {
				CONTRACT: this.contractName,
				CONTRACT_VAR: this.contractName.toLowerCase(),
				INIT_DATA: this.getInitData(),
				CONSTRUCTOR_PARAMS: this.getConstructorParams(),
			}),
			TESTS: this.renderTests(),
			FUZZ_TESTS: this.renderFuzzTests(),
		};
	}

	private replaceTokens(template: string, context: Record<string, string>): string {
		return Object.entries(context).reduce(
			(result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, "g"), value),
			template
		);
	}

	private hasInitializer(abi: ABI): boolean {
		return abi.some(item => item.name === "initialize");
	}

	private findDependencies(): void {
		const initMethods = this.abi.filter(
			item => item.type === "constructor" || item.name === "initialize"
		);

		for (const method of initMethods) {
			if (!method.inputs) {
				continue;
			}
			for (const input of method.inputs) {
				const contractName = this.extractContractName(input);
				if (contractName && contractName !== this.contractName) {
					this.dependencies.add(contractName);
				}
			}
		}
	}

	private extractContractName(input: any): string | null {
		if (input.internalType?.includes("contract ")) {
			const match = input.internalType.match(/contract\s+([^\s]+)/);
			return match?.[1] || null;
		}
		return null;
	}

	private renderDependencyImports(): string {
		const imports = Array.from(this.dependencies)
			.map(dep => `import "src/${dep}.sol";`)
			.join("\n");
		return imports ? `\n${imports}` : "";
	}

	private renderDependencyDeclarations(): string {
		if (this.dependencies.size === 0) {
			return "";
		}

		const declarations = Array.from(this.dependencies)
			.map(dep => `${dep} public ${dep.toLowerCase()};`)
			.join("\n    ");

		return `\n    ${declarations}`;
	}

	private renderDependencySetup(): string {
		if (this.dependencies.size === 0) {
			return "";
		}

		const setup = Array.from(this.dependencies)
			.map(dep => `        ${dep.toLowerCase()} = new ${dep}();`)
			.join("\n");

		return `${setup}\n`;
	}

	private getInitData(): string {
		const initializer = this.abi.find(item => item.name === "initialize");
		return initializer?.inputs?.length
			? `abi.encodeCall(${this.contractName}.initialize, (${this.buildParamList(initializer.inputs)}))`
			: '""';
	}

	private getConstructorParams(): string {
		const constructor = this.abi.find(item => item.type === "constructor");
		return constructor?.inputs ? this.buildParamList(constructor.inputs) : "";
	}

	private buildParamList(inputs: any[]): string {
		return inputs
			.map(input => {
				const contractName = this.extractContractName(input);
				if (contractName && this.dependencies.has(contractName)) {
					return contractName.toLowerCase();
				}
				return this.getDefaultValue(input);
			})
			.join(", ");
	}

	private getDefaultValue(input: any): string {
		const type = input.type;

		if (this.isStructType(input)) {
			return this.buildStructLiteral(input);
		}

		if (type?.startsWith("uint")) {
			const bitSize = parseInt(type.replace("uint", "")) || 256;
			return bitSize <= 8 ? "1" : "100";
		}

		if (type?.startsWith("int")) {
			return "1";
		}

		if (type === "bool") {
			return "true";
		}
		if (type === "address") {
			return "address(0x1)";
		}
		if (type === "string") {
			return '"test"';
		}
		if (type === "bytes") {
			return '"0x01"';
		}
		if (type?.startsWith("bytes") && type !== "bytes") {
			return '"0x01"';
		}

		if (type?.endsWith("[]")) {
			const baseType = type.replace(/\[\]$/, "");
			return `new ${baseType}[](0)`;
		}

		if (type?.match(/\[\d+\]$/)) {
			const match = type.match(/(.+)\[(\d+)\]$/);
			if (match) {
				const baseType = match[1];
				const size = parseInt(match[2]);
				const defaultVal = this.getDefaultValue({ type: baseType });
				return `[${Array(Math.min(size, 3)).fill(defaultVal).join(", ")}${size > 3 ? ", ..." : ""}]`;
			}
		}

		if (type?.startsWith("enum ")) {
			return "0";
		}

		return "0";
	}

	private isStructType(input: any): boolean {
		return input?.type === "tuple";
	}

	private buildStructLiteral(input: any): string {
		const structName = this.getStructName(input);

		if (!input.components?.length) {
			return `${this.contractName}.${structName}({})`;
		}

		const fields = input.components
			.map((comp: any) => `${comp.name}: ${this.getDefaultValue(comp)}`)
			.join(", ");

		return `${this.contractName}.${structName}({${fields}})`;
	}

	private getStructName(input: any): string {
		if (input.internalType?.includes("struct")) {
			const match = input.internalType.match(/struct\s+(?:[^.]+\.)?([^.\[\]\s]+)/);
			if (match?.[1]) {
				return match[1];
			}
		}

		if (this.sourceCode && input.name) {
			const pascalName = this.toPascalCase(input.name);
			const structPattern = new RegExp(`struct\\s+${pascalName}\\s*{`, "g");
			if (structPattern.test(this.sourceCode)) {
				return pascalName;
			}

			const structMatches = this.sourceCode.match(/struct\s+([A-Za-z_][A-Za-z0-9_]*)\s*{/g);
			if (structMatches) {
				for (const structMatch of structMatches) {
					const structName = structMatch.match(/struct\s+([A-Za-z_][A-Za-z0-9_]*)/)?.[1];
					if (structName && structName.toLowerCase() === input.name.toLowerCase()) {
						return structName;
					}
				}
				if (structMatches.length > 0) {
					const firstStruct = structMatches[0].match(/struct\s+([A-Za-z_][A-Za-z0-9_]*)/)?.[1];
					if (firstStruct) {
						return firstStruct;
					}
				}
			}
		}

		return input.name ? this.toPascalCase(input.name) : "TestStruct";
	}

	private renderTests(): string {
		const functions = this.abi.filter(
			item =>
				item.type === "function" &&
				item.name &&
				item.name !== "initialize" &&
				!this.isStateVariableGetter(item)
		);

		let allTests = "";

		for (const func of functions) {
			allTests += this.renderSingleTest(func);
			allTests += this.renderRevertTests(func);
		}

		return allTests;
	}

	private isStateVariableGetter(func: any): boolean {
		if (!this.sourceCode || func.stateMutability !== "view" || func.inputs?.length !== 0) {
			return false;
		}

		return (
			this.stateVariables.has(func.name) &&
			this.stateVariables.get(func.name)?.visibility === "public"
		);
	}

	private renderSingleTest(func: any): string {
		const name = this.toPascalCase(func.name);
		const params = this.buildParamList(func.inputs || []);
		const isView = func.stateMutability === "view" || func.stateMutability === "pure";
		const analysis = this.analyzeFunction(func);

		if (isView && func.outputs?.length) {
			const output = func.outputs[0];
			const outputType = this.getType(output);
			const assertion = this.generateViewAssertion(output, "result", analysis);

			return `
    function test_${name}() public view {
        ${outputType} result = ${this.contractName.toLowerCase()}.${func.name}(${params});
        ${assertion}
    }
`;
		}

		const eventAssertions = this.generateEventAssertions(func.name);
		const stateAssertions = this.generateStateAssertions(analysis);

		return `
    function test_${name}() public {
        // Change caller as needed (ALICE, BOB, CHARLIE, DAVE)
        vm.startPrank(BOB);
        ${eventAssertions.setup}
        ${this.contractName.toLowerCase()}.${func.name}${analysis.isPayable ? "{value: 1 ether}" : ""}(${params});
        vm.stopPrank();
        ${eventAssertions.assertions}
        ${stateAssertions}
    }
`;
	}

	private generateEventAssertions(functionName: string): { setup: string; assertions: string } {
		const functionEvents = this.events.get(functionName);
		if (!functionEvents || functionEvents.length === 0) {
			return { setup: "", assertions: "" };
		}

		const setup = "vm.recordLogs();";
		const assertions = functionEvents
			.map((event, index) => {
				let eventAssertions = `Vm.Log[] memory logs = vm.getRecordedLogs();
        assertGe(logs.length, ${index + 1});
        assertEq(logs[${index}].topics[0], keccak256("${event.signature}"));`;

				if (event.indexed.length > 0) {
					eventAssertions += `\n        /// @dev Verify indexed parameters: ${event.indexed.join(", ")}`;
				}

				if (event.nonIndexed.length > 0) {
					eventAssertions += `\n        /// @dev Decode and verify non-indexed parameters: ${event.nonIndexed.join(", ")}`;
				}

				return eventAssertions;
			})
			.join("\n        ");

		return { setup, assertions };
	}

	private generateViewAssertion(output: any, varName: string, analysis: any): string {
		const type = output.type;

		if (type?.startsWith("uint") || type?.startsWith("int")) {
			return `assertTrue(${varName} >= 0 || ${varName} < 0);`;
		}

		if (type === "bool") {
			return `assertTrue(${varName}) || assertFalse(${varName});`;
		}

		if (type === "address") {
			return `assertTrue(${varName} != address(0) || ${varName} == address(0));`;
		}

		if (type === "string") {
			return `assertTrue(bytes(${varName}).length >= 0);`;
		}

		if (this.isStructType(output)) {
			const structName = this.getStructName(output);
			if (output.components && output.components.length > 0) {
				const fieldChecks = output.components
					.map((comp: any) => `assertTrue(true);`)
					.join("\n        ");
				return fieldChecks;
			}
			return `assertTrue(true);`;
		}

		if (type?.endsWith("[]")) {
			return `assertTrue(${varName}.length >= 0);`;
		}

		return `assertTrue(true);`;
	}

	private generateStateAssertions(analysis: any): string {
		if (!analysis.modifiesState && !analysis.hasEvents) {
			return "";
		}

		let assertions: string[] = [];

		if (analysis.modifiesVariables.length > 0) {
			for (const varName of analysis.modifiesVariables) {
				const varInfo = this.stateVariables.get(varName);
				if (varInfo && varInfo.visibility === "public") {
					assertions.push(`assertTrue(true);`);
				}
			}
		}

		return assertions.length > 0 ? assertions.join("\n        ") : "";
	}

	private renderRevertTests(func: any): string {
		const analysis = this.analyzeFunction(func);
		if (!analysis.canRevert) {
			return "";
		}

		const name = this.toPascalCase(func.name);
		const params = this.buildParamList(func.inputs || []);
		const modifiers = this.extractFunctionModifiers(func.name);

		let revertTests = "";

		if (modifiers.length > 0) {
			revertTests += modifiers
				.map(modifier => {
					const modifierTest = this.generateModifierFailureTest(modifier);
					return `
    function test_RevertWhen_${name}_${this.toPascalCase(modifier)}Fails() public {
        vm.startPrank(ALICE);
        ${modifierTest.setup}
        vm.expectRevert(${modifierTest.expectedError});
        ${this.contractName.toLowerCase()}.${func.name}(${params});
        vm.stopPrank();
    }`;
				})
				.join("");
		}

		if (func.inputs && func.inputs.length > 0) {
			const zeroParams = func.inputs
				.map((input: any) => {
					if (input.type === "address") {
						return "address(0)";
					}
					if (input.type?.startsWith("uint") || input.type?.startsWith("int")) {
						return "0";
					}
					if (input.type === "string") {
						return '""';
					}
					if (input.type === "bytes") {
						return '""';
					}
					if (input.type === "bool") {
						return "false";
					}
					return this.getDefaultValue(input);
				})
				.join(", ");

			revertTests += `
    function test_RevertWhen_${name}_InvalidInput() public {
        vm.startPrank(ALICE);
        vm.expectRevert();
        ${this.contractName.toLowerCase()}.${func.name}(${zeroParams});
        vm.stopPrank();
    }`;
		}

		return revertTests;
	}

	private generateModifierFailureTest(modifier: string): { setup: string; expectedError: string } {
		if (this.sourceCode) {
			const modifierDefMatch = this.sourceCode.match(
				new RegExp(
					`modifier\\s+${modifier}\\s*\\([^)]*\\)\\s*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}`,
					"g"
				)
			);

			if (modifierDefMatch && modifierDefMatch[0]) {
				const modifierBody = modifierDefMatch[0];

				const customErrorMatch = modifierBody.match(/revert\s+(\w+)\s*\(/);
				if (customErrorMatch && this.errors.has(customErrorMatch[1])) {
					return {
						setup: "",
						expectedError: `${this.contractName}.${customErrorMatch[1]}.selector`,
					};
				}

				const requireMatch = modifierBody.match(/require\([^,)]+,\s*"([^"]+)"/);
				if (requireMatch) {
					return {
						setup: "",
						expectedError: `"${requireMatch[1]}"`,
					};
				}

				if (modifierBody.includes("msg.sender") || modifierBody.includes("owner")) {
					return {
						setup: "vm.startPrank(address(0xdead));",
						expectedError: 'bytes("")',
					};
				}

				if (modifierBody.includes("block.timestamp") || modifierBody.includes("block.number")) {
					return {
						setup: "",
						expectedError: 'bytes("")',
					};
				}
			}
		}

		return {
			setup: "",
			expectedError: 'bytes("")',
		};
	}

	private extractFunctionModifiers(functionName: string): string[] {
		if (!this.sourceCode) {
			return [];
		}

		const regex = new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*([^{]*?)\\s*{`, "gm");

		const match = regex.exec(this.sourceCode);
		if (!match) {
			return [];
		}

		const declaration = match[1].trim();
		if (!declaration) {
			return [];
		}

		const withoutReturns = declaration.replace(/returns\s*\([^)]*\)/gi, "").trim();
		const words = withoutReturns.split(/\s+/).filter(w => w.length > 0);

		const solidityKeywords = new Set([
			"public",
			"private",
			"internal",
			"external",
			"pure",
			"view",
			"payable",
			"nonpayable",
			"virtual",
			"override",
		]);

		const potentialModifiers = words
			.map(word => word.replace(/\([^)]*\)$/, ""))
			.filter(word => !solidityKeywords.has(word) && word.length > 0)
			.filter(word => this.isModifierDefined(word));

		return [...new Set(potentialModifiers)];
	}

	private isModifierDefined(modifierName: string): boolean {
		if (!this.sourceCode) {
			return false;
		}

		const modifierDefRegex = new RegExp(`modifier\\s+${modifierName}\\s*\\([^)]*\\)\\s*{`, "gm");
		return modifierDefRegex.test(this.sourceCode);
	}

	private renderFuzzTests(): string {
		const functions = this.abi.filter(
			item =>
				item.type === "function" &&
				item.inputs?.length &&
				item.name &&
				item.name !== "initialize" &&
				!this.isStateVariableGetter(item)
		);

		if (functions.length === 0) {
			return "";
		}

		return `

    function testFuzz_FunctionCall(address caller) public {
        vm.assume(caller != address(0));
        vm.startPrank(caller);
        assertTrue(true);
        vm.stopPrank();
    }`;
	}

	private renderFuzzTest(func: any): string {
		const name = this.toPascalCase(func.name);
		const params = func.inputs
			.map((input: any, i: number) => {
				const type = this.getType(input);
				const paramName = input.name || `param${i}`;
				return `${type} ${paramName}`;
			})
			.join(", ");

		const callParams = func.inputs
			.map((input: any, i: number) => input.name || `param${i}`)
			.join(", ");

		const analysis = this.analyzeFunction(func);
		const modifier = analysis.isPayable ? "payable " : "";
		const boundAssumptions = this.generateFuzzAssumptions(func.inputs);

		return `
    function testFuzz_${name}(${params}) public ${modifier}{
        ${boundAssumptions}
        ${this.contractName.toLowerCase()}.${func.name}(${callParams});
        assertTrue(true);
    }`;
	}

	private generateFuzzAssumptions(inputs: any[]): string {
		const assumptions = inputs.map((input, i) => {
			const paramName = input.name || `param${i}`;
			const type = input.type;

			if (type === "address") {
				return `vm.assume(${paramName} != address(0));`;
			}

			if (type?.startsWith("uint")) {
				return `vm.assume(${paramName} > 0);`;
			}

			if (type?.startsWith("int")) {
				return `vm.assume(${paramName} != 0);`;
			}

			return `vm.assume(true);`;
		});

		return assumptions.length > 0 ? assumptions.join("\n        ") + "\n" : "";
	}

	private getType(param: any): string {
		if (!param?.type) {
			return "unknown";
		}

		if (this.isStructType(param)) {
			const structName = this.getStructName(param);
			return `${this.contractName}.${structName} memory`;
		}

		if (param.type === "string" || param.type === "bytes" || param.type.endsWith("[]")) {
			return `${param.type} memory`;
		}

		return param.type;
	}

	private toPascalCase(str: string): string {
		return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
	}
}
