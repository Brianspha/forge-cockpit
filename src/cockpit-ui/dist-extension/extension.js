var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod
  )
);
var __toCommonJS = mod =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);
var __publicField = (obj, key, value) =>
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);

// ../extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
});
module.exports = __toCommonJS(extension_exports);
var vscode14 = __toESM(require('vscode'));
var dotenv = __toESM(require('dotenv'));
var path5 = __toESM(require('path'));

// ../providers/hoverProvider.ts
var vscode = __toESM(require('vscode'));
var path = __toESM(require('path'));
var TestHoverProvider = class {
  constructor(foundryManager) {
    this.foundryManager = foundryManager;
  }
  async provideHover(document, position) {
    if (!document.fileName.match(/[tT]\.sol$/)) {
      return null;
    }
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return null;
    }
    const word = document.getText(wordRange);
    if (!word.startsWith('test')) {
      return null;
    }
    const lineText = document.lineAt(position.line).text;
    if (!lineText.includes('function')) {
      return null;
    }
    const fileName = path.basename(document.fileName);
    const runTestCommand = vscode.Uri.parse(
      `command:forge-cockpit.runTest?${encodeURIComponent(
        JSON.stringify({
          contractName: fileName,
          testName: word,
        })
      )}`
    );
    const runTestCommandViaIR = vscode.Uri.parse(
      `command:forge-cockpit.runTestViaIR?${encodeURIComponent(
        JSON.stringify({
          contractName: fileName,
          testName: word,
        })
      )}`
    );
    const hoverContent = new vscode.MarkdownString(
      `**Forge Test**: \`${word}\`

[Run Test](${runTestCommand}) | [Run Test via IR](${runTestCommandViaIR})`
    );
    hoverContent.isTrusted = true;
    return new vscode.Hover(hoverContent, wordRange);
  }
};

// ../providers/codeLensProvider.ts
var vscode3 = __toESM(require('vscode'));

// ../utils/index.ts
var import_viem = require('viem');
var vscode2 = __toESM(require('vscode'));
var ACTIVE_NODE_KEY = 'FORGE_COCKPIT_ACTIVE_NODES';
var ForgeCockpitCommand = {
  TransferCommand: 'forge-cockpit.transfer',
  LoadCockPitWalletsCommand: 'forge-cockpit.loadWallets',
  StubForgeTestsCommand: 'forge-cockpit.stubForgeTests',
  ShowForgeCockPitCommand: 'cockpit.showForgeCockPit',
  RebuildProjectCommand: 'forge-cockpit.rebuildProject',
  RunTestCommand: 'forge-cockpit.runTest',
  RunTestViaIRCommand: 'forge-cockpit.runTestViaIR',
  RunGroupCommand: 'forge-cockpit.runGroup',
  RefreshTestsCommand: 'forge-cockpit.refreshTests',
  AbiEncodeCommand: 'forge-cockpit.abiEncode',
  ForkNodeCommand: 'forge-cockpit.forkNode',
  WalletBalancesCommand: 'forge-cockpit.walletBalances',
  ExecuteFunctionCommand: 'forge-cockpit.executeFunction',
  StopNodeCommand: 'forge-cockpit.stopNode',
  DeployContractCommand: 'forge-cockpit.deployContract',
  GetActiveNodesCommand: 'forge-cockpit.getActiveNodes',
  ShowBuildOutputCommand: 'forge-cockpit.showBuildOutput',
  PinEditorCommand: 'workbench.action.pinEditor',
  RunScriptCommand: 'forge-cockpit.runScript',
  ClearCacheCommand: 'forge-cockpit.clearCache',
  TerminateAllTasksCommand: 'workbench.action.tasks.terminate',
  OpenUrlCommand: 'forge-cockpit.openUrl',
  VsOpenUrlCommand: 'vscode.open',
};
var WebviewCommand = {
  LoadCockpitWallets: 'loadWallets',
  OpenLinkCommand: 'openLink',
  GetActiveNodesCommand: 'getActiveNodes',
  StopNodeCommand: 'stopNode',
  DeployContractCommand: 'deployContract',
  WalletBalancesCommand: 'walletBalances',
  ExecuteFunctionCommand: 'executeFunction',
  WriteClipboardCommand: 'writeClipboard',
  RefreshContractsCommand: 'refreshContracts',
  LoadContractsCommand: 'loadContracts',
  ForkNodeCommand: 'forkNode',
  RunScriptCommand: 'runScript',
  AbiEncodeCommand: 'abiEncode',
  TransferCommand: 'transfer',
  TokenInfoCommand: 'tokenInfo',
};
var ClipBoardTypeCommand = {
  ReadWalletImportCommand: 'readClipboard:walletImport',
  ReadTransferCommand: 'readClipboard:transfer',
  ReadClipboardWalletCommand: 'readClipboard:wallet',
  ReadClipboardDeploymentCommand: 'readClipboard:deployment',
  ReadClipboardAnvilCommand: 'readClipboard:anvil',
  ReadClipboardConstructorArgsCommand: 'readClipboard:constructorArgs',
  ReadClipboardFunctionInputCommand: 'readClipboard:functionInput',
  ReadClipboardEncoderCommand: 'readClipboardEncoder',
  ReadClipboard: 'readClipboard',
};
var ForgeCockPitResponseCommand = {
  GetDefaultWalletsResponse: 'getDefaultWalletResponse',
  GetActiveNodesResponse: 'getActiveNodesResponse',
  DeployContractResponse: 'deployContractResponse',
  WalletBalancesResponse: 'walletBalancesResponse',
  ExecuteFunctionResponse: 'executeFunctionResponse',
  ClipboardContentResponse: 'clipboardContentResponse',
  ForkNodeResultsResponse: 'forkNodeResultsResponse',
  SetContractsResponse: 'setContractsResponse',
  RunScriptResponse: 'setRunScriptResponse',
  StopNodeResponse: 'stopNodeResponse',
  AbiEncodeResponse: 'abiEncodeResponse',
  TransferResponse: 'transferResponse',
  TokenInfoResponse: 'tokenInfoResponse',
};
function safeStringify(obj) {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}
var DEFAULT_ANVIL_ACCOUNTS = {
  accounts: {
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80':
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d':
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a':
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6':
      '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a':
      '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba':
      '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e':
      '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356':
      '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97':
      '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6':
      '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
  },
};
function readAccounts(accountsJson) {
  return Object.entries(accountsJson).map(([privateKey, publicKey]) => ({
    privateKey,
    publicKey,
  }));
}
function encodeFunction(input) {
  try {
    const data = (0, import_viem.encodeFunctionData)({
      abi: input.abi,
      functionName: input.functionName,
      args: input.inputs,
    });
    return {
      success: true,
      data,
      error: '',
      functionName: input.functionName,
    };
  } catch (error) {
    return {
      success: false,
      data: '0x',
      error: error.toString(),
      functionName: input.functionName,
    };
  }
}
async function fileExists(uri) {
  try {
    await vscode2.workspace.fs.stat(uri);
    return true;
  } catch (err) {
    return false;
  }
}

// ../providers/codeLensProvider.ts
var TestCodeLensProvider = class {
  constructor(foundryManager) {
    this.foundryManager = foundryManager;
  }
  async provideCodeLenses(document, token) {
    const codeLenses = [];
    const text = document.getText();
    const relativePath = vscode3.workspace.asRelativePath(document.fileName);
    this.addTestFunctionLenses(document, text, relativePath, codeLenses);
    this.addContractLenses(document, text, relativePath, codeLenses);
    return codeLenses;
  }
  addTestFunctionLenses(document, text, relativePath, codeLenses) {
    if (this.isNotTestOrScriptFile(relativePath)) {
      return;
    }
    const functionRegex = /function\s+(test\w+)\s*\(/g;
    let match;
    while ((match = functionRegex.exec(text)) !== null) {
      const functionName = match[1];
      const position = document.positionAt(match.index);
      const range = new vscode3.Range(
        position,
        position.with(void 0, position.character + match[0].length)
      );
      const runTestCmd = {
        title: 'forge test',
        command: ForgeCockpitCommand.RunTestCommand,
        arguments: [
          {
            contractName: relativePath,
            testName: functionName,
          },
        ],
      };
      const runTestViaIRCmd = {
        title: 'forge test viaIR',
        command: ForgeCockpitCommand.RunTestViaIRCommand,
        arguments: [
          {
            contractName: relativePath,
            testName: functionName,
            viaIR: true,
          },
        ],
      };
      codeLenses.push(new vscode3.CodeLens(range, runTestCmd));
      codeLenses.push(new vscode3.CodeLens(range, runTestViaIRCmd));
    }
  }
  addContractLenses(document, text, relativePath, codeLenses) {
    if (!this.isNotTestOrScriptFile(relativePath)) {
      return;
    }
    const contractRegex = /contract\s+(\w+)(?:\s+is\s+|\s*\{)/g;
    let match;
    while ((match = contractRegex.exec(text)) !== null) {
      const contractName = match[1];
      const position = document.positionAt(match.index);
      const range = new vscode3.Range(
        position,
        position.with(void 0, position.character + match[0].length - 1)
      );
      const generateTestsCmd = {
        title: 'Forge stub tests',
        command: ForgeCockpitCommand.StubForgeTestsCommand,
        arguments: [
          {
            fileName: contractName,
            filePath: relativePath,
          },
        ],
      };
      codeLenses.push(new vscode3.CodeLens(range, generateTestsCmd));
    }
  }
  isNotTestOrScriptFile(fileName) {
    return /^(?!.*\.(t|s)\.sol).*$/.test(fileName);
  }
  isScriptFile(fileName) {
    return /\.s\.sol$/.test(fileName);
  }
};

// ../providers/testCodeDecoProvider.ts
var vscode4 = __toESM(require('vscode'));
var TestDecorationProvider = class {
  constructor() {
    __publicField(this, 'decorationType');
    __publicField(this, 'activeEditor');
    this.decorationType = vscode4.window.createTextEditorDecorationType({
      before: {
        contentText: '',
        color: '#6a9955',
        margin: '0 0 0 2.5em',
        fontStyle: 'italic',
      },
      isWholeLine: true,
    });
    vscode4.window.onDidChangeActiveTextEditor(editor => {
      this.activeEditor = editor;
      if (editor) {
        this.updateDecorations();
      }
    });
    vscode4.workspace.onDidChangeTextDocument(event => {
      if (this.activeEditor && event.document === this.activeEditor.document) {
        this.updateDecorations();
      }
    });
    this.activeEditor = vscode4.window.activeTextEditor;
    if (this.activeEditor) {
      this.updateDecorations();
    }
  }
  updateDecorations() {
    var _a;
    const document = (_a = this.activeEditor) == null ? void 0 : _a.document;
    if (
      this.activeEditor &&
      (document == null ? void 0 : document.fileName.match(/[tT]\.sol$/)) &&
      !(document == null ? void 0 : document.fileName.match(/[tT]\.s.sol$/))
    ) {
      const text = document.getText();
      const decorations = [];
      const functionRegex = /function\s+(test\w+)\s*\(/g;
      let match;
      while ((match = functionRegex.exec(text)) !== null) {
        const startPos = document.positionAt(match.index);
        if (startPos.line > 0) {
          const prevLine = new vscode4.Position(startPos.line - 1, 0);
          const range = new vscode4.Range(prevLine, prevLine);
          decorations.push({ range });
        }
      }
      this.activeEditor.setDecorations(this.decorationType, decorations);
    }
  }
  dispose() {
    this.decorationType.dispose();
  }
};

// ../controllers/forgeProjectController.ts
var vscode6 = __toESM(require('vscode'));
var path2 = __toESM(require('path'));
var fs = __toESM(require('fs'));
var toml = __toESM(require('toml'));
var cp = __toESM(require('child_process'));
var net = __toESM(require('net'));

// ../providers/taskProvider.ts
var vscode5 = __toESM(require('vscode'));
var FoundryTaskProvider = class {
  constructor(controller, logger) {
    this.controller = controller;
    this.logger = logger;
    __publicField(this, 'tasks', /* @__PURE__ */ new Map());
    __publicField(this, 'executions', /* @__PURE__ */ new Map());
    __publicField(this, 'taskEndListener');
    this.controller = controller;
    this.taskEndListener = vscode5.tasks.onDidEndTaskProcess(e =>
      this.handleTaskEnd(e)
    );
  }
  handleTaskEnd(e) {
    for (const [taskId, execution] of this.executions) {
      if (e.execution === execution) {
        const task = execution.task;
        const definition = task.definition;
        if (definition.command === 'fork') {
          vscode5.commands.executeCommand(
            ForgeCockpitCommand.GetActiveNodesCommand
          );
          this.closeTaskTerminal(task.name);
        }
        this.executions.delete(taskId);
        this.tasks.delete(taskId);
        break;
      }
    }
  }
  provideTasks() {
    return this.getFoundryTasks();
  }
  resolveTask(task) {
    const definition = task.definition;
    return definition.type === 'foundry'
      ? this.createFoundryTask(definition)
      : void 0;
  }
  async getFoundryTasks() {
    if (!this.controller.isFoundry()) {
      return [];
    }
    return [];
  }
  createFoundryTask(definition) {
    const config2 = this.controller.getConfig();
    let execution;
    let taskName;
    switch (definition.command) {
      case 'test': {
        const testArgs = ['test'];
        if (definition.testName) {
          testArgs.push('--match-test', definition.testName);
        }
        if (definition.contractFile) {
          testArgs.push('--match-path', definition.contractFile);
        }
        if (config2.viaIR) {
          testArgs.push('--via-ir');
        }
        testArgs.push(config2.verbosity);
        execution = new vscode5.ShellExecution(
          'forge',
          testArgs.filter(Boolean),
          {
            cwd: config2.workspaceRoot.fsPath,
          }
        );
        taskName = `Foundry: Test ${definition.testName || 'All'}`;
        break;
      }
      case 'fork': {
        const port = definition.port;
        const nodeUrl = definition.nodeUrl || '';
        const anvilArgs = ['--port', port, '--auto-impersonate'];
        if (nodeUrl) {
          anvilArgs.unshift('--fork-url', nodeUrl);
        }
        execution = new vscode5.ShellExecution('anvil', anvilArgs, {
          cwd: config2.workspaceRoot.fsPath,
        });
        taskName = `Foundry: Fork ${nodeUrl || 'Local'} (${port})`;
        break;
      }
      default:
        throw new Error(`Unknown foundry command: ${definition.command}`);
    }
    const task = new vscode5.Task(
      definition,
      vscode5.TaskScope.Workspace,
      taskName,
      'foundry',
      execution
    );
    if (definition.command === 'fork') {
      task.isBackground = true;
      task.problemMatchers = [];
      task.presentationOptions = {
        reveal: vscode5.TaskRevealKind.Never,
        focus: false,
        panel: vscode5.TaskPanelKind.Dedicated,
        showReuseMessage: false,
        clear: false,
      };
    } else {
      task.group = vscode5.TaskGroup.Test;
      task.presentationOptions = {
        reveal: vscode5.TaskRevealKind.Always,
        focus: true,
        panel: vscode5.TaskPanelKind.Dedicated,
        showReuseMessage: false,
        clear: true,
      };
    }
    const taskId = this.getTaskId(definition);
    this.tasks.set(taskId, task);
    return task;
  }
  async executeTask(definition) {
    const task = this.createFoundryTask(definition);
    const execution = await vscode5.tasks.executeTask(task);
    this.executions.set(definition.port, execution);
    return execution;
  }
  async terminateTaskByType(forkType) {
    const runningTasks = vscode5.tasks.taskExecutions;
    for (const execution of runningTasks) {
      const task = execution.task;
      const taskDef = task.definition;
      if (taskDef.command === forkType) {
        await this.terminateTask(taskDef.port);
        break;
      }
    }
  }
  async terminateTask(port) {
    const execution = this.executions.get(port);
    if (execution) {
      try {
        const task = execution.task;
        execution.terminate();
        await this.closeTaskTerminal(task.name);
        this.executions.delete(port);
        this.tasks.delete(port);
        return true;
      } catch (error) {
        this.logger.logToOutput(`Error disposing task ${port}:${error}`);
        return false;
      }
    }
    const runningTasks = vscode5.tasks.taskExecutions;
    for (const execution2 of runningTasks) {
      const task = execution2.task;
      const taskDef = task.definition;
      if (taskDef.port === port) {
        try {
          execution2.terminate();
          await this.closeTaskTerminal(task.name);
          return true;
        } catch (error) {
          this.logger.logToOutput(`Error disposing task by port: ${error}`);
          return false;
        }
      }
    }
    if (await this.terminateTaskByTerminal(port)) {
      return true;
    }
    if (await this.terminateTaskByProcess(port)) {
      return true;
    }
    return false;
  }
  async terminateTaskByTerminal(port) {
    const terminals = vscode5.window.terminals;
    for (const terminal of terminals) {
      if (terminal.name.includes(port) || terminal.name.includes(`(${port})`)) {
        this.logger.logToOutput(
          `Found terminal for port ${port}: ${terminal.name}`
        );
        terminal.dispose();
        return true;
      }
    }
    return false;
  }
  async terminateTaskByProcess(port) {
    try {
      await vscode5.commands.executeCommand(
        ForgeCockpitCommand.TerminateAllTasksCommand
      );
      this.logger.logToOutput(
        `Terminated all tasks as fallback for port ${port}`
      );
      return true;
    } catch (error) {
      this.logger.logToOutput(`Error terminating all tasks: ${error}`);
      return false;
    }
  }
  getRunningTasks() {
    return new Map(this.executions);
  }
  isTaskRunning(taskId) {
    return this.executions.has(taskId);
  }
  getTaskId(definition) {
    let id = `foundry-${definition.command}`;
    if (definition.port) {
      id += `-${definition.port}`;
    }
    if (definition.testName) {
      id += `-${definition.testName}`;
    }
    return id;
  }
  async closeTaskTerminal(taskName) {
    const terminals = vscode5.window.terminals;
    for (const terminal of terminals) {
      if (terminal.name === taskName || terminal.name.includes(taskName)) {
        terminal.dispose();
        break;
      }
    }
  }
  async closeAllTaskTerminals() {
    const terminals = vscode5.window.terminals;
    for (const terminal of terminals) {
      if (
        terminal.name.startsWith('Foundry:') ||
        terminal.name.includes('foundry')
      ) {
        terminal.dispose();
      }
    }
  }
  dispose() {
    this.taskEndListener.dispose();
    for (const [, execution] of this.executions) {
      const task = execution.task;
      execution.terminate();
      this.closeTaskTerminal(task.name);
    }
    this.executions.clear();
    this.tasks.clear();
  }
};

// ../controllers/forgeProjectController.ts
var import_viem2 = require('viem');
var FoundryProjectController = class {
  constructor(logger) {
    this.logger = logger;
    __publicField(this, 'workspaceRoot');
    __publicField(this, 'isFoundryProject', false);
    __publicField(this, 'fileWatchers', []);
    __publicField(this, 'buildInProgress', false);
    __publicField(this, 'buildQueue', false);
    __publicField(this, 'debounceTimer');
    __publicField(this, '_onDidBuildSucceed', new vscode6.EventEmitter());
    __publicField(this, 'onDidBuildSucceed', this._onDidBuildSucceed.event);
    __publicField(this, 'taskProvider');
    __publicField(this, 'taskProviderDisposable');
    __publicField(this, 'accounts', []);
    __publicField(this, 'config', {
      verbosity: '-vvvvv',
      viaIR: false,
      testDir: 'test',
      srcDir: 'src',
      outputDir: 'out',
      scriptDir: 'script',
      workspaceRoot: vscode6.Uri.parse(''),
    });
    this.taskProvider = new FoundryTaskProvider(this, logger);
    this.taskProviderDisposable = vscode6.tasks.registerTaskProvider(
      'foundry',
      this.taskProvider
    );
  }
  async initialize() {
    const workspaceFolders = vscode6.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      this.logger.logToOutput('No workspace folder is open');
      vscode6.window.showInformationMessage('No workspace folder is open.');
      return;
    }
    const workspaceRoot = workspaceFolders[0].uri;
    this.logger.logToOutput(
      `Searching for Foundry projects in workspace: ${workspaceRoot.fsPath}`
    );
    if (!(await this.isForgeInstalled())) {
      this.logger.logToOutput('Foundry is not installed or not in PATH');
      this.showForgeNotInstalledError();
      return;
    }
    try {
      const foundryProjects = await this.findFoundryProjects(workspaceRoot);
      if (foundryProjects.length === 0) {
        throw new Error('No foundry.toml files found in workspace');
      }
      this.workspaceRoot = foundryProjects[0];
      if (foundryProjects.length > 1) {
        this.logger.logToOutput(
          `Multiple Foundry projects found. Using: ${this.workspaceRoot.fsPath}`
        );
        this.logger.logToOutput(
          `Other projects found at: ${foundryProjects
            .slice(1)
            .map(p => p.fsPath)
            .join(', ')}`
        );
      }
      await this.checkNodeModules();
      await this.loadFoundryConfig();
      this.isFoundryProject = true;
      this.logger.logToOutput(
        `Successfully loaded Foundry configuration from: ${this.workspaceRoot.fsPath}`
      );
      this.logger.updateStatusBar(
        '$(sync~spin) Forge cockpit detecting contracts...'
      );
      await Promise.all([
        this.cleanOutputDirectory(),
        this.executeBuild(false),
      ]);
      this.setupWatchers();
      this.logger.logToOutput('File watchers setup completed');
    } catch (error) {
      const errorMessage = `No Foundry project found in workspace. ${error.message}`;
      this.logger.updateStatusBar(
        `$(error) Forge cockpit ${errorMessage}`,
        new vscode6.ThemeColor('statusBarItem.errorBackground')
      );
      this.isFoundryProject = false;
    }
  }
  async findFoundryProjects(workspaceUri) {
    const foundryProjects = [];
    try {
      const foundryFiles = await vscode6.workspace.findFiles(
        new vscode6.RelativePattern(workspaceUri, '**/foundry.toml'),
        '**/node_modules/**'
      );
      for (const file of foundryFiles) {
        const projectDir = vscode6.Uri.file(path2.dirname(file.fsPath));
        foundryProjects.push(projectDir);
      }
      foundryProjects.sort((a, b) => {
        const aDepth = path2
          .relative(workspaceUri.fsPath, a.fsPath)
          .split(path2.sep).length;
        const bDepth = path2
          .relative(workspaceUri.fsPath, b.fsPath)
          .split(path2.sep).length;
        return aDepth - bDepth;
      });
    } catch (error) {
      this.logger.logToOutput(
        `Error searching for Foundry projects: ${error.message}`
      );
    }
    return foundryProjects;
  }
  async checkNodeModules() {
    try {
      const packageJsonPath = vscode6.Uri.joinPath(
        this.workspaceRoot,
        'package.json'
      );
      const nodeModulesPath = vscode6.Uri.joinPath(
        this.workspaceRoot,
        'node_modules'
      );
      const packageJsonExists = await fileExists(packageJsonPath);
      if (!packageJsonExists) {
        return;
      }
      const nodeModulesExists = await fileExists(nodeModulesPath);
      if (!nodeModulesExists) {
        const message =
          "package.json found but node_modules is missing. Please run 'npm install' or 'yarn install' to install dependencies. Incase your smartcontracts use node_modules for remappings";
        this.logger.logToOutput(message);
        vscode6.window.showInformationMessage(message);
      }
    } catch (error) {
      this.logger.logToOutput(`Error checking node_modules: ${error.message}`);
    }
  }
  async loadFoundryConfig() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    if (!this.workspaceRoot) {
      return;
    }
    const foundryTomlUri = vscode6.Uri.joinPath(
      this.workspaceRoot,
      'foundry.toml'
    );
    const foundryTomlContent =
      await vscode6.workspace.fs.readFile(foundryTomlUri);
    const parsedContent = new TextDecoder().decode(foundryTomlContent);
    const foundryConfig = toml.parse(parsedContent);
    this.config = {
      verbosity: '-vvvvv',
      viaIR:
        ((_b = (_a = foundryConfig.profile) == null ? void 0 : _a.default) ==
        null
          ? void 0
          : _b.via_ir) || false,
      testDir:
        ((_d = (_c = foundryConfig.profile) == null ? void 0 : _c.default) ==
        null
          ? void 0
          : _d.test) || 'test',
      srcDir:
        ((_f = (_e = foundryConfig.profile) == null ? void 0 : _e.default) ==
        null
          ? void 0
          : _f.src) || 'src',
      outputDir:
        ((_h = (_g = foundryConfig.profile) == null ? void 0 : _g.default) ==
        null
          ? void 0
          : _h.out) || 'out',
      scriptDir:
        ((_j = (_i = foundryConfig.profile) == null ? void 0 : _i.default) ==
        null
          ? void 0
          : _j.script) || 'script',
      workspaceRoot: this.workspaceRoot,
    };
  }
  showForgeNotInstalledError() {
    this.logger.logToOutput('Showing Foundry installation error dialog');
    vscode6.window
      .showErrorMessage(
        "Foundry is not installed or not in PATH. Please install Foundry and ensure it's in your PATH.",
        'Install Foundry',
        'Learn More'
      )
      .then(selection => {
        if (selection === 'Install Foundry') {
          this.logger.logToOutput(
            "User clicked 'Install Foundry' - opening installation guide"
          );
          vscode6.env.openExternal(
            vscode6.Uri.parse(
              'https://book.getfoundry.sh/getting-started/installation'
            )
          );
        } else if (selection === 'Learn More') {
          this.logger.logToOutput(
            "User clicked 'Learn More' - opening Foundry documentation"
          );
          vscode6.env.openExternal(
            vscode6.Uri.parse('https://book.getfoundry.sh/')
          );
        }
      });
  }
  setupWatchers() {
    var _a, _b, _c, _d, _e, _f;
    if (!this.workspaceRoot) {
      this.logger.logToOutput('Cannot setup watchers - no workspace root');
      return;
    }
    this.logger.logToOutput(
      `Setting up file watchers for ${(_a = this.config) == null ? void 0 : _a.srcDir} and ${(_b = this.config) == null ? void 0 : _b.outputDir}`
    );
    this.createFileWatcher(
      `${(_c = this.config) == null ? void 0 : _c.srcDir}/**/*.sol`,
      this.handleSourceChange.bind(this)
    );
    this.createFileWatcher(
      `${(_d = this.config) == null ? void 0 : _d.testDir}/**/*.sol`,
      this.handleSourceChange.bind(this)
    );
    this.createFileWatcher(
      `${(_e = this.config) == null ? void 0 : _e.scriptDir}/**/*.sol`,
      this.handleSourceChange.bind(this)
    );
    this.createFileWatcher(
      ((_f = this.config) == null ? void 0 : _f.outputDir) || 'out',
      this.handleFileChange.bind(this)
    );
  }
  createFileWatcher(pattern, changeHandler) {
    if (!this.workspaceRoot) {
      return;
    }
    const filePattern = new vscode6.RelativePattern(
      this.workspaceRoot,
      pattern
    );
    const watcher = vscode6.workspace.createFileSystemWatcher(
      filePattern,
      false,
      false,
      false
    );
    watcher.onDidCreate(changeHandler);
    watcher.onDidChange(changeHandler);
    watcher.onDidDelete(changeHandler);
    this.fileWatchers.push(watcher);
  }
  handleSourceChange(uri) {
    this.logger.logToOutput(
      `Source file changed: ${path2.basename(uri.fsPath)}`
    );
    this.debouncedBuild(1500);
  }
  handleFileChange(uri) {
    this.logger.logToOutput(
      `Output file changed: ${path2.basename(uri.fsPath)}`
    );
    this.debouncedBuild(1e3);
  }
  debouncedBuild(delay) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(async () => {
      await this.triggerBuild();
      vscode6.commands.executeCommand(ForgeCockpitCommand.RefreshTestsCommand);
      vscode6.commands.executeCommand(
        ForgeCockpitCommand.LoadCockPitWalletsCommand
      );
    }, delay);
  }
  async triggerBuild() {
    if (!this.isFoundryProject || !this.workspaceRoot) {
      this.logger.logToOutput(
        'Cannot trigger build - not a Foundry project or no workspace'
      );
      return;
    }
    if (this.buildInProgress) {
      this.logger.logToOutput('Build already in progress - queuing next build');
      this.buildQueue = true;
      return;
    }
    this.buildInProgress = true;
    this.logger.logToOutput('Triggering build process');
    this.logger.updateStatusBar(
      '$(sync~spin) Forge cockpit Building...',
      new vscode6.ThemeColor('statusBarItem.warningBackground')
    );
    try {
      await this.executeBuild(false);
    } catch (error) {
      this.logger.logToOutput(`Build trigger failed: ${error.stack}`);
      this.logger.updateStatusBar(
        `$(error) Forge cockpit build failed: ${error.message}`,
        new vscode6.ThemeColor('statusBarItem.errorBackground')
      );
    } finally {
      this.buildInProgress = false;
      if (this.buildQueue) {
        this.logger.logToOutput('Processing queued build');
        this.buildQueue = false;
        setTimeout(() => this.triggerBuild(), 100);
      }
    }
  }
  async getExecutablePath(name) {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const likelyPath =
      process.platform === 'win32'
        ? `${homeDir}\\.foundry\\bin\\${name}.exe`
        : `${homeDir}/.foundry/bin/${name}`;
    return new Promise(resolve => {
      fs.access(likelyPath, fs.constants.X_OK, error => {
        resolve(error ? name : likelyPath);
      });
    });
  }
  async executeCommand(
    args = [],
    cwd = (_a => ((_a = this.workspaceRoot) == null ? void 0 : _a.fsPath))() ||
      '',
    streamOutput = true
  ) {
    const env3 = { ...process.env };
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const foundryBinDir = path2.dirname(
      process.platform === 'win32'
        ? `${homeDir}\\.foundry\\bin\\${args[0]}.exe`
        : `${homeDir}/.foundry/bin/${args[0]}`
    );
    env3.PATH = `${foundryBinDir}${process.platform === 'win32' ? ';' : ':'}${env3.PATH || ''}`;
    return new Promise((resolve, reject) => {
      var _a2, _b;
      if (!streamOutput) {
        cp.exec(
          args.join(' '),
          { cwd, env: env3 },
          (error, stdout2, stderr2) => {
            if (error) {
              reject({ error, stderr: stderr2, exitCode: error.code || 1 });
            } else {
              resolve({ stdout: stdout2, stderr: stderr2, exitCode: 0 });
            }
          }
        );
        return;
      }
      const [command, ...commandArgs] = args;
      const child = cp.spawn(command, commandArgs, {
        cwd,
        env: env3,
        shell: true,
      });
      let stdout = '';
      let stderr = '';
      (_a2 = child.stdout) == null
        ? void 0
        : _a2.on('data', data => {
            const output = data.toString();
            stdout += output;
            if (streamOutput) {
              this.logger.logToOutput(output.trim());
            }
          });
      (_b = child.stderr) == null
        ? void 0
        : _b.on('data', data => {
            const output = data.toString();
            stderr += output;
            if (streamOutput) {
              this.logger.logToOutput(output.trim());
            }
          });
      child.on('error', error => {
        this.logger.logToOutput(`Process error: ${error.stack}`);
        reject({ error, stderr, exitCode: 1 });
      });
      child.on('close', code => {
        resolve({ stdout, stderr, exitCode: code || 0 });
      });
    });
  }
  async executeBuild(useViaIr) {
    var _a, _b;
    try {
      this.logger.logToOutput(
        `Starting build${useViaIr ? ' with --via-ir' : ''}`
      );
      const forgePath = await this.getExecutablePath('forge');
      const args = [
        forgePath,
        'build',
        '--contracts',
        `./${(_a = this.config) == null ? void 0 : _a.srcDir}`,
      ];
      if (useViaIr) {
        args.push('--via-ir');
      }
      const result = await this.executeCommand(
        args,
        ((_b = this.workspaceRoot) == null ? void 0 : _b.fsPath) || '',
        true
      );
      if (result.exitCode !== 0) {
        if (!useViaIr && result.stderr.includes('--via-ir')) {
          this.logger.logToOutput('Retrying build with --via-ir flag');
          return this.executeBuild(true);
        }
        this.logger.updateStatusBar(
          `$(error) Forge cockpit build failed`,
          new vscode6.ThemeColor('statusBarItem.errorBackground')
        );
        return false;
      }
      this.logger.logToOutput('Build completed successfully');
      this.logger.updateStatusBar('$(check) Forge cockpit build succeeded');
      this.onBuildSucceeded();
      return true;
    } catch (error) {
      this.logger.logToOutput(`Build error: ${error.stack}`);
      this.logger.updateStatusBar(
        `$(error) Forge cockpit build failed: ${error.message}`,
        new vscode6.ThemeColor('statusBarItem.errorBackground')
      );
      return false;
    }
  }
  async runTest(contractFile, testName, config2) {
    if (!this.isFoundryProject || !this.workspaceRoot) {
      this.logger.logToOutput(
        'Cannot run test - not a Foundry project or no workspace'
      );
      return {
        testName,
        success: false,
      };
    }
    this.config = config2;
    this.logger.logToOutput(
      `Starting test execution: ${testName} in ${contractFile}`
    );
    this.logger.updateStatusBar(
      `$(beaker~spin) Forge cockpit running test: ${testName}`,
      new vscode6.ThemeColor('statusBarItem.warningBackground')
    );
    try {
      const definition = {
        type: 'foundry',
        command: 'test',
        testName: `"\\\\b${testName}\\\\b"`,
        contractFile,
        taskId: `test-${testName}-${Date.now()}`,
        port: '0',
      };
      const execution = await this.taskProvider.executeTask(definition);
      this.logger.logToOutput(`Test task created for: ${testName}`);
      return new Promise(resolve => {
        const disposable = vscode6.tasks.onDidEndTaskProcess(e => {
          if (e.execution === execution) {
            if (e.exitCode === 0) {
              this.logger.logToOutput(`Test passed: ${testName}`);
              this.logger.updateStatusBar(
                `$(check) Forge cockpit test passed: ${testName}`,
                new vscode6.ThemeColor('statusBarItem.successBackground')
              );
              resolve({
                testName,
                success: true,
              });
            } else {
              this.logger.logToOutput(
                `Test failed: ${testName} with exit code ${e.exitCode}`
              );
              this.logger.updateStatusBar(
                `$(error) Forge cockpit test failed: ${testName}`,
                new vscode6.ThemeColor('statusBarItem.errorBackground')
              );
              resolve({
                testName,
                success: false,
                error: `Test failed with exit code ${e.exitCode}`,
              });
            }
            setTimeout(() => {
              this.logger.updateStatusBar('$(check) Forge cockpit ready');
            }, 3e3);
            disposable.dispose();
          }
        });
      });
    } catch (error) {
      this.logger.logToOutput(`Failed to run test ${testName}: ${error.stack}`);
      this.logger.updateStatusBar(
        `$(error) Forge cockpit failed to run test: ${testName}`,
        new vscode6.ThemeColor('statusBarItem.errorBackground')
      );
      return {
        testName,
        success: false,
        error: `Failed to run test: ${error.message}`,
      };
    }
  }
  async runAllTests(config2) {
    var _a;
    if (!this.isFoundryProject || !this.workspaceRoot) {
      this.logger.logToOutput(
        'Cannot run tests - not a Foundry project or no workspace'
      );
      return [];
    }
    this.config = config2;
    this.logger.logToOutput(`Starting all tests execution`);
    this.logger.updateStatusBar(
      `$(beaker~spin) Forge cockpit running all tests`,
      new vscode6.ThemeColor('statusBarItem.warningBackground')
    );
    try {
      const args = ['test', '--json'];
      if (config2.viaIR) {
        args.push('--via-ir');
      }
      if (config2.verbosity) {
        args.push('-v', config2.verbosity);
      }
      const workingDirectory =
        typeof this.workspaceRoot === 'string'
          ? this.workspaceRoot
          : ((_a = this.workspaceRoot) == null ? void 0 : _a.fsPath) ||
            process.cwd();
      return new Promise(resolve => {
        var _a2, _b;
        const { spawn: spawn2 } = require('child_process');
        const forgeProcess = spawn2('forge', args, {
          cwd: workingDirectory,
          shell: true,
        });
        let output = '';
        let errorOutput = '';
        (_a2 = forgeProcess.stdout) == null
          ? void 0
          : _a2.on('data', data => {
              output += data.toString();
            });
        (_b = forgeProcess.stderr) == null
          ? void 0
          : _b.on('data', data => {
              errorOutput += data.toString();
            });
        forgeProcess.on('close', code => {
          const results = this.parseTestResults(output);
          this.logger.logToOutput(
            `All tests completed successfully 

 with results: ${JSON.stringify(results)}

`
          );
          if (code === 0) {
            this.logger.logToOutput(`All tests completed successfully`);
            this.logger.updateStatusBar(
              `$(check) Forge cockpit all tests passed`,
              new vscode6.ThemeColor('statusBarItem.successBackground')
            );
          } else {
            this.logger.logToOutput(`Some tests failed with exit code ${code}`);
            if (errorOutput) {
              this.logger.logToOutput(`Error output: ${errorOutput}`);
            }
            this.logger.updateStatusBar(
              `$(error) Forge cockpit some tests failed`,
              new vscode6.ThemeColor('statusBarItem.errorBackground')
            );
          }
          setTimeout(() => {
            this.logger.updateStatusBar('$(check) Forge cockpit ready');
          }, 3e3);
          resolve(results);
        });
        forgeProcess.on('error', error => {
          this.logger.logToOutput(
            `Failed to start forge process: ${error.message}`
          );
          this.logger.updateStatusBar(
            `$(error) Forge cockpit failed to run tests`,
            new vscode6.ThemeColor('statusBarItem.errorBackground')
          );
          resolve([]);
        });
      });
    } catch (error) {
      this.logger.logToOutput(`Failed to run all tests: ${error.stack}`);
      this.logger.updateStatusBar(
        `$(error) Forge cockpit failed to run tests`,
        new vscode6.ThemeColor('statusBarItem.errorBackground')
      );
      return [];
    }
  }
  parseTestResults(output) {
    const results = [];
    try {
      const json = JSON.parse(output);
      if (!json || typeof json !== 'object') {
        return results;
      }
      Object.keys(json).forEach(contractKey => {
        var _a;
        if (!contractKey.includes('.sol:')) {
          return;
        }
        const contractData = json[contractKey];
        if (!(contractData == null ? void 0 : contractData.test_results)) {
          return;
        }
        const testResults = contractData.test_results;
        const fileName =
          ((_a = contractKey.split(':')[0]) == null
            ? void 0
            : _a.split('/').pop()) || contractKey;
        Object.keys(testResults).forEach(testKey => {
          var _a2;
          const testResult = testResults[testKey];
          if (!(testResult == null ? void 0 : testResult.status)) {
            return;
          }
          const isSuccess = testResult.status === 'Success';
          const error = !isSuccess
            ? testResult.reason || 'Unknown error'
            : void 0;
          if (testKey.startsWith('Found ') && testKey.includes('instances:')) {
            const testNamesMatch = testKey.match(/instances: (.+)$/);
            const testNames =
              ((_a2 = testNamesMatch == null ? void 0 : testNamesMatch[1]) ==
              null
                ? void 0
                : _a2.split(', ')) || [];
            testNames.forEach(testName => {
              const trimmedTestName = testName.trim().replace(/\(.*\)$/, '');
              if (!trimmedTestName) {
                return;
              }
              const testResultsMap = /* @__PURE__ */ new Map();
              testResultsMap.set(trimmedTestName, isSuccess);
              results.push({
                testName: trimmedTestName,
                fileName,
                success: isSuccess,
                error,
                testResults: testResultsMap,
              });
            });
          } else {
            const testResultsMap = /* @__PURE__ */ new Map();
            testResultsMap.set(testKey, isSuccess);
            results.push({
              testName: testKey.replace(/\(.*\)$/, ''),
              fileName,
              success: isSuccess,
              error,
              testResults: testResultsMap,
            });
          }
        });
      });
    } catch (parseError) {
      this.logger.logToOutput(`Failed to parse test results: ${parseError}`);
    }
    return results;
  }
  async runScript(contractInfo) {
    var _a;
    if (!this.isFoundryProject || !this.workspaceRoot) {
      this.logger.logToOutput(
        'Cannot run script - not a Foundry project or no workspace'
      );
      return {
        success: false,
        contracts: [
          {
            contractName: contractInfo.contractName,
            address: '',
            success: false,
            hash: '',
            nodeUrl: contractInfo.nodeUrl,
            logs: void 0,
          },
        ],
        scriptName: contractInfo.contractName,
      };
    }
    this.logger.logToOutput(
      `Starting script execution: ${contractInfo.contractName} in ${contractInfo.scriptName}`
    );
    this.logger.updateStatusBar(
      `$(play~spin) Forge cockpit running script: ${contractInfo.contractName}`,
      new vscode6.ThemeColor('statusBarItem.warningBackground')
    );
    try {
      const account = this.accounts.find(
        account2 =>
          (0, import_viem2.checksumAddress)(account2.publicKey) ===
          (0, import_viem2.checksumAddress)(contractInfo.msgSender)
      );
      if (!account) {
        return {
          success: false,
          contracts: [
            {
              contractName: contractInfo.contractName,
              address: '',
              success: false,
              hash: '',
              nodeUrl: contractInfo.nodeUrl,
              logs: void 0,
            },
          ],
          scriptName: contractInfo.contractName,
        };
      }
      const forgePath = await this.getExecutablePath('forge');
      const scriptArgs = this.buildScriptArgs({
        ...contractInfo,
        privateKey: account.privateKey,
      });
      if (scriptArgs.length === 0) {
        return {
          success: false,
          contracts: [
            {
              contractName: contractInfo.contractName,
              address: '',
              success: false,
              hash: '',
              nodeUrl: contractInfo.nodeUrl,
              logs: void 0,
            },
          ],
          scriptName: contractInfo.contractName,
        };
      }
      const args = [forgePath, ...scriptArgs];
      this.logger.logToOutput(`Executing command: ${args.join(' ')}`);
      const result = await this.executeCommand(
        args,
        ((_a = this.workspaceRoot) == null ? void 0 : _a.fsPath) || '',
        true
      );
      if (result.exitCode !== 0) {
        this.logger.logToOutput(
          `Script failed: ${contractInfo.contractName} with exit code ${result.exitCode}`
        );
        this.logger.logToOutput(`Error output: ${result.stderr}`);
        this.logger.updateStatusBar(
          `$(error) Forge cockpit script failed: ${contractInfo.contractName}`,
          new vscode6.ThemeColor('statusBarItem.errorBackground')
        );
        setTimeout(() => {
          this.logger.updateStatusBar('$(check) Forge cockpit ready');
        }, 3e3);
        return {
          success: false,
          contracts: [
            {
              contractName: contractInfo.contractName,
              address: '',
              success: false,
              hash: '',
              nodeUrl: contractInfo.nodeUrl,
              logs: void 0,
            },
          ],
          scriptName: contractInfo.contractName,
        };
      }
      const deployedContracts =
        await this.extractDeployedContracts(contractInfo);
      if (deployedContracts.length === 0) {
        this.logger.logToOutput(
          `Script completed successfully but no contract deployments detected: ${contractInfo.contractName}`
        );
        deployedContracts.push({
          contractName: contractInfo.contractName,
          address: '',
          success: true,
          hash: '',
          nodeUrl: contractInfo.nodeUrl,
          logs: void 0,
        });
      }
      this.logger.logToOutput(
        `Script completed successfully: ${contractInfo.contractName}`
      );
      this.logger.logToOutput(
        `Deployment results: ${JSON.stringify(deployedContracts, null, 2)}`
      );
      this.logger.updateStatusBar(
        `$(check) Forge cockpit script completed: ${contractInfo.contractName}`,
        new vscode6.ThemeColor('statusBarItem.successBackground')
      );
      setTimeout(() => {
        this.logger.updateStatusBar('$(check) Forge cockpit ready');
      }, 3e3);
      return {
        success: true,
        contracts: deployedContracts,
        scriptName: contractInfo.contractName,
      };
    } catch (error) {
      this.logger.logToOutput(`Script execution error: ${error.message}`);
      this.logger.updateStatusBar(
        `$(error) Forge cockpit script failed: ${contractInfo.contractName}`,
        new vscode6.ThemeColor('statusBarItem.errorBackground')
      );
      setTimeout(() => {
        this.logger.updateStatusBar('$(check) Forge cockpit ready');
      }, 3e3);
      return {
        success: false,
        contracts: [
          {
            contractName: contractInfo.contractName,
            address: '',
            success: false,
            hash: '',
            nodeUrl: contractInfo.nodeUrl,
            logs: void 0,
          },
        ],
        scriptName: contractInfo.contractName,
      };
    }
  }
  async extractDeployedContracts(contractInfo) {
    if (!this.workspaceRoot) {
      return [];
    }
    const deployedContracts = [];
    try {
      const broadcastDir = vscode6.Uri.joinPath(
        this.workspaceRoot,
        'broadcast',
        `${contractInfo.scriptName}`
      );
      const runLatestFiles = await vscode6.workspace.findFiles(
        new vscode6.RelativePattern(
          broadcastDir,
          `**/${contractInfo.chainId}/run-latest.json`
        )
      );
      for (const fileUri of runLatestFiles) {
        const fileData = await vscode6.workspace.fs.readFile(fileUri);
        const content = JSON.parse(new TextDecoder().decode(fileData));
        if (content.transactions && Array.isArray(content.transactions)) {
          for (const tx of content.transactions) {
            if (tx.transactionType === 'CREATE' && tx.contractAddress) {
              deployedContracts.push({
                contractName: tx.contractName || 'Unknown',
                address: tx.contractAddress,
                success: true,
                hash: tx.hash || '',
                nodeUrl: contractInfo.nodeUrl || '',
                logs: void 0,
              });
            }
          }
        }
      }
      this.logger.logToOutput(
        `Extracted ${deployedContracts.length} deployed contracts from broadcast files`
      );
    } catch (error) {
      this.logger.logToOutput(
        `Failed to read deployment files: ${error.stack}`
      );
    }
    return deployedContracts;
  }
  buildScriptArgs(contractInfo) {
    const args = [
      'script',
      `${this.config.scriptDir}/${contractInfo.scriptName}`,
    ];
    if (contractInfo.scriptName) {
      args.push(contractInfo.scriptName);
    }
    if (contractInfo.privateKey) {
      args.push('--private-key', contractInfo.privateKey);
    }
    if (contractInfo.viaIR) {
      args.push('--via-ir');
    }
    args.push('--rpc-url', contractInfo.nodeUrl);
    args.push('--broadcast');
    args.push('-vvvvv');
    return args;
  }
  async cleanOutputDirectory() {
    var _a;
    if (!this.isFoundryProject || !this.workspaceRoot) {
      this.logger.logToOutput(
        'Cannot clean output directory - not a Foundry project or no workspace'
      );
      return;
    }
    this.logger.updateStatusBar(
      `$(sync~spin) Forge cockpit cleaning ${this.config.outputDir}...`,
      new vscode6.ThemeColor('statusBarItem.warningBackground')
    );
    try {
      this.logger.logToOutput(`Starting clean of ${this.config.outputDir}`);
      const forgePath = await this.getExecutablePath('forge');
      const args = [forgePath, 'clean'];
      const result = await this.executeCommand(
        args,
        ((_a = this.workspaceRoot) == null ? void 0 : _a.fsPath) || '',
        true
      );
      if (result.exitCode !== 0) {
        this.logger.logToOutput(
          `Clean failed with exit code: ${result.exitCode}`
        );
      } else {
        this.logger.logToOutput('Clean completed successfully');
      }
      this.logger.updateStatusBar('$(check) Forge cockpit clean completed');
      setTimeout(() => {
        this.logger.updateStatusBar('$(check) Forge cockpit ready');
      }, 1500);
    } catch (error) {
      this.logger.logToOutput(`Clean error: ${error.stack}`);
      this.logger.updateStatusBar(
        `$(error) Forge cockpit clean failed: ${error.message}`,
        new vscode6.ThemeColor('statusBarItem.errorBackground')
      );
    }
  }
  async onBuildSucceeded() {
    this.logger.logToOutput('Build succeeded - scanning for contract ABIs');
    await this.getAllContractABIs();
    this.logger.logToOutput('Firing build success event');
    this._onDidBuildSucceed.fire();
  }
  async loadWallets() {
    let accounts = [];
    try {
      if (!this.workspaceRoot) {
        return [];
      }
      const cockpitAccounts = vscode6.Uri.joinPath(
        this.workspaceRoot,
        'cockpit-accounts.json'
      );
      const exists = await fileExists(cockpitAccounts);
      if (!exists) {
        this.logger.logToOutput(
          'No cockpit-accounts.json file found, using default accounts'
        );
        const content = new TextEncoder().encode(
          JSON.stringify(DEFAULT_ANVIL_ACCOUNTS, null, 2)
        );
        try {
          await vscode6.workspace.fs.writeFile(cockpitAccounts, content);
        } catch (error) {
          this.logger.logToOutput(
            `Error writing default accounts: ${error.message}`
          );
        }
      }
      const rawAccounts = await vscode6.workspace.fs.readFile(cockpitAccounts);
      const parsedAccounts = JSON.parse(new TextDecoder().decode(rawAccounts));
      const readAcc = readAccounts(
        parsedAccounts
          ? parsedAccounts.accounts
          : DEFAULT_ANVIL_ACCOUNTS.accounts
      );
      this.accounts = readAcc;
      this.logger.logToOutput(
        `Loaded cockpit wallets with info: ${JSON.stringify(readAcc)}`
      );
      accounts = readAcc.map(account => account.publicKey);
    } catch (error) {
      this.logger.updateStatusBar(`$(error) Forge cockpit ${error.message}`);
      this.logger.logToOutput(`Error loading default wallets: ${error.stack}`);
    }
    return accounts;
  }
  async getAllContractABIs() {
    var _a, _b;
    if (!this.workspaceRoot || !this.isFoundryProject) {
      const errorMessage =
        'cannot scan for contracts: Not a valid Foundry project';
      this.logger.logToOutput(`Error: ${errorMessage}`);
      this.logger.updateStatusBar(
        `$(error) Forge cockpit ${errorMessage}`,
        new vscode6.ThemeColor('statusBarItem.errorBackground')
      );
      return [];
    }
    this.logger.logToOutput(
      `Scanning for contract ABIs in ${(_a = this.config) == null ? void 0 : _a.outputDir}`
    );
    const outputDirUri = vscode6.Uri.joinPath(
      this.workspaceRoot,
      (_b = this.config) == null ? void 0 : _b.outputDir
    );
    const contracts = [];
    try {
      const jsonPattern = new vscode6.RelativePattern(
        outputDirUri,
        '**/*.json'
      );
      const jsonFiles = await vscode6.workspace.findFiles(jsonPattern);
      this.logger.logToOutput(
        `Found ${jsonFiles.length} JSON files in output directory`
      );
      if (jsonFiles.length === 0) {
        const message = `No contract files found in ${this.config.testDir} directory. Have you compiled the project?`;
        this.logger.logToOutput(message);
        this.triggerBuild();
        vscode6.window.showInformationMessage(message);
        return [];
      }
      let contractCount = 0;
      for (const fileUri of jsonFiles) {
        const contractName = path2.basename(fileUri.fsPath, '.json');
        try {
          const fileData = await vscode6.workspace.fs.readFile(fileUri);
          const content = JSON.parse(new TextDecoder().decode(fileData));
          const abi = content.abi;
          const bytecode =
            content.bytecode && content.bytecode.object
              ? content.bytecode.object
              : '';
          const solFileName =
            content.ast && content.ast.absolutePath
              ? content.ast && path2.basename(content.ast.absolutePath)
              : '';
          if (abi) {
            contracts.push({
              fileName: contractName,
              filePath: fileUri.fsPath,
              solFileName,
              tests: [],
              abi,
              bytecode,
              isFolder: false,
            });
            contractCount++;
          }
        } catch (error) {
          this.logger.logToOutput(
            `Failed to parse contract file ${contractName}: ${error.stack}`
          );
          continue;
        }
      }
      this.logger.logToOutput(`Successfully loaded ${contractCount} contracts`);
      return contracts;
    } catch (error) {
      const errorMessage = `error scanning output directory: ${error.message}`;
      this.logger.logToOutput(`Error: ${error.stack}`);
      this.logger.updateStatusBar(`$(error) Forge cockpit ${errorMessage}`);
      return [];
    }
  }
  async isForgeInstalled() {
    return new Promise(resolve => {
      let command =
        process.platform === 'win32'
          ? 'where forge 2>nul'
          : 'which forge 2>/dev/null || command -v forge 2>/dev/null';
      cp.exec(command, (error, stdout) => {
        if (!error && stdout) {
          resolve(true);
          return;
        }
        const homeDir = process.env.HOME || process.env.USERPROFILE;
        const foundryPath =
          process.platform === 'win32'
            ? `${homeDir}\\.foundry\\bin\\forge.exe`
            : `${homeDir}/.foundry/bin/forge`;
        fs.access(foundryPath, fs.constants.X_OK, error2 => {
          resolve(!error2);
        });
      });
    });
  }
  async getActiveNodes() {
    this.logger.logToOutput('Checking for active fork nodes');
    const activePorts = [];
    const runningTasks = this.taskProvider.getRunningTasks();
    for (const [taskId, execution] of runningTasks) {
      const task = execution.task;
      const definition = task.definition;
      if (definition.command === 'fork' && definition.port) {
        if (await this.isPortInUse(definition.port)) {
          activePorts.push(definition.port);
        } else {
          this.logger.logToOutput(
            `Removing stale fork task ${taskId} - port ${definition.port} not in use`
          );
          this.taskProvider.terminateTask(taskId);
        }
      }
    }
    this.logger.logToOutput(
      `Found ${activePorts.length} active fork nodes on ports: ${activePorts.join(', ')}`
    );
    return activePorts.sort((a, b) => parseInt(a) - parseInt(b));
  }
  async forkNode(forkInfo) {
    this.logger.logToOutput(
      `Attempting to fork node on port ${forkInfo.port} with URL: ${forkInfo.nodeUrl || 'local'}`
    );
    const inUse = await this.isPortInUse(forkInfo.port);
    if (!this.isFoundryProject || !this.workspaceRoot || inUse) {
      const reason = !this.isFoundryProject
        ? 'not a Foundry project'
        : !this.workspaceRoot
          ? 'no workspace'
          : 'port already in use';
      this.logger.logToOutput(`Fork failed: ${reason}`);
      return {
        success: false,
        accounts: [],
        port: forkInfo.port.toString(),
      };
    }
    try {
      const definition = {
        type: 'foundry',
        command: 'fork',
        taskId: forkInfo.tabId,
        port: forkInfo.port.toString(),
        nodeUrl: forkInfo.nodeUrl,
      };
      await this.taskProvider.executeTask(definition);
      this.logger.logToOutput(
        `Fork task started, waiting for node to be ready on port ${forkInfo.port}`
      );
      const success = await this.waitForNodeReady(forkInfo.port);
      if (success) {
        this.logger.logToOutput(
          `Fork node successfully started on port ${forkInfo.port}`
        );
      } else {
        this.logger.logToOutput(
          `Fork node failed to start on port ${forkInfo.port} - timeout`
        );
      }
      return {
        success,
        accounts: [],
        port: forkInfo.port,
      };
    } catch (error) {
      this.logger.logToOutput(`Error creating anvil instance: ${error.stack}`);
      this.logger.updateStatusBar(
        `$(error) Forge cockpit error creating anvil instance: ${error.message}`,
        new vscode6.ThemeColor('statusBarItem.errorBackground')
      );
      return {
        success: false,
        accounts: [],
        port: forkInfo.port,
      };
    }
  }
  async stopForkNode(port) {
    try {
      this.logger.logToOutput(`Stopping anvil node on port: ${port}`);
      const stopped = await this.taskProvider.terminateTask(port);
      this.logger.updateStatusBar(
        `$(check) Forge cockpit anvil node stopped on port: ${port}`,
        new vscode6.ThemeColor('statusBarItem.successBackground')
      );
      setTimeout(() => {
        this.logger.updateStatusBar('$(check) Forge cockpit ready');
      }, 2e3);
      return stopped;
    } catch (error) {
      this.logger.logToOutput(`error stopping fork ${error.stack}`);
    }
    return false;
  }
  async waitForNodeReady(port, maxAttempts = 100) {
    this.logger.logToOutput(
      `Waiting for node to be ready on port ${port} (max ${maxAttempts} attempts)`
    );
    return new Promise(resolve => {
      let attempts = 0;
      const check = async () => {
        attempts++;
        this.logger.logToOutput(
          `Waiting for node to be ready on port ${port} (current attempts ${attempts})`
        );
        if (await this.isPortInUse(port)) {
          this.logger.logToOutput(
            `Node ready on port ${port} after ${attempts} attempts`
          );
          resolve(true);
          return;
        }
        if (attempts >= maxAttempts) {
          this.logger.logToOutput(
            `Node failed to start on port ${port} - timeout after ${attempts} attempts`
          );
          resolve(false);
          return;
        }
        setTimeout(check, 1e3);
      };
      check();
    });
  }
  async isPortInUse(port) {
    return new Promise(resolve => {
      const socket = new net.Socket();
      socket.once('connect', () => {
        socket.destroy();
        this.logger.logToOutput(`Port ${port} is in use`);
        resolve(true);
      });
      socket.once('error', () => {
        this.logger.logToOutput(`Port ${port} is not in use`);
        resolve(false);
      });
      socket.connect(+port, '127.0.0.1');
    });
  }
  async disposeForkTasks() {
    await this.taskProvider.terminateTaskByType('fork');
  }
  async closeAllTaskTerminals() {
    await this.taskProvider.closeAllTaskTerminals();
  }
  getConfig() {
    return this.config;
  }
  getSourceDirectory() {
    var _a;
    return ((_a = this.config) == null ? void 0 : _a.srcDir) || 'src';
  }
  isFoundry() {
    return this.isFoundryProject;
  }
  dispose() {
    var _a;
    this.fileWatchers.forEach(watcher => watcher.dispose());
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.taskProvider.dispose();
    (_a = this.taskProviderDisposable) == null ? void 0 : _a.dispose();
    this.logger.dispose();
    this._onDidBuildSucceed.dispose();
  }
};

// ../providers/testParserProvider.ts
var vscode7 = __toESM(require('vscode'));
var path3 = __toESM(require('path'));
var TestParserProvider = class {
  constructor(config2, logger) {
    this.config = config2;
    this.logger = logger;
    __publicField(this, 'functionRegex', /function\s+(test\w*)\s*\(/g);
    __publicField(this, 'watcher');
    __publicField(this, '_onDidChangeContracts', new vscode7.EventEmitter());
    __publicField(this, 'debounceTimer');
    __publicField(
      this,
      'onDidChangeContracts',
      this._onDidChangeContracts.event
    );
    __publicField(this, 'contracts', []);
  }
  async initialize() {
    this.contracts = [];
    if (!this.config.workspaceRoot) {
      this.logger.logToOutput(
        'Workspace root not defined. Please open a Foundry project.'
      );
      vscode7.window.showErrorMessage('Workspace root not defined.');
      return;
    }
    const testDirUri = vscode7.Uri.joinPath(
      this.config.workspaceRoot,
      this.config.testDir
    );
    const solPattern = new vscode7.RelativePattern(testDirUri, '**/*.sol');
    const solFiles = await vscode7.workspace.findFiles(solPattern);
    for (const fileUri of solFiles) {
      const fileName = path3.basename(fileUri.fsPath);
      if (!this.isTestFile(fileName)) {
        continue;
      }
      try {
        const raw = await vscode7.workspace.fs.readFile(fileUri);
        const content = new TextDecoder().decode(raw);
        const contractName = this.extractContractNameFromSource(
          content,
          fileName
        );
        const singleTests = this.extractTestFunctionsFromSource(content).map(
          test => {
            return {
              ...test,
              filePath: fileUri.fsPath,
              contractName,
            };
          }
        );
        if (singleTests.length === 0 || !contractName) {
          continue;
        }
        const relativeToWorkspace = path3
          .relative(this.config.workspaceRoot.fsPath, fileUri.fsPath)
          .replace(/\\/g, '/');
        this.contracts.push({
          fileName,
          filePath: relativeToWorkspace,
          isFolder: false,
          tests: singleTests,
        });
      } catch (error) {
        continue;
      }
    }
    this.setupFileWatcher();
  }
  extractContractNameFromSource(content, fallbackFileName) {
    const contractMatch = content.match(
      /contract\s+(\w+)(?:\s+is\s+.*?)?\s*\{/
    );
    if (contractMatch && contractMatch[1]) {
      return contractMatch[1];
    }
    return fallbackFileName.replace(/\.sol$/, '');
  }
  extractTestFunctionsFromSource(content) {
    return Array.from(
      content.matchAll(this.functionRegex),
      match => match[1]
    ).map(testName => {
      return {
        testName,
        contractName: '',
        status: false,
        filePath: '',
      };
    });
  }
  setupFileWatcher() {
    const workspaceFolders = vscode7.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return;
    }
    try {
      const pattern = new vscode7.RelativePattern(
        workspaceFolders[0],
        `${this.config.testDir}/**/*.t.sol`
      );
      this.watcher = vscode7.workspace.createFileSystemWatcher(pattern);
      this.watcher.onDidCreate(() => this.triggerRefresh());
      this.watcher.onDidChange(() => this.triggerRefresh());
      this.watcher.onDidDelete(() => this.triggerRefresh());
    } catch (error) {}
  }
  getIndividualTests() {
    const singleTests = [];
    for (const contract of this.contracts) {
      for (const test of contract.tests) {
        singleTests.push({
          contractName: contract.fileName,
          testName: test.testName,
          filePath: contract.filePath,
          viaIR: false,
          status: false,
        });
      }
    }
    return singleTests;
  }
  triggerRefresh() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(async () => {
      await this.initialize();
      this._onDidChangeContracts.fire(this.contracts);
    }, 1e3);
  }
  async refresh() {
    await this.initialize();
    this._onDidChangeContracts.fire(this.contracts);
  }
  isTestFile(fileName) {
    return /^[^.\\/]+\.t\.sol$/.test(fileName);
  }
  dispose() {
    if (this.watcher) {
      this.watcher.dispose();
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this._onDidChangeContracts.dispose();
  }
};

// ../providers/forgeTestProvider.ts
var vscode8 = __toESM(require('vscode'));
var ForgeTestProvider = class {
  constructor(contracts, onDidChangeContracts, foundryController, logger) {
    this.contracts = contracts;
    this.onDidChangeContracts = onDidChangeContracts;
    this.foundryController = foundryController;
    this.logger = logger;
    __publicField(this, 'testController');
    __publicField(this, 'testItems', /* @__PURE__ */ new Map());
    __publicField(this, 'testData', /* @__PURE__ */ new Map());
    __publicField(this, 'currentRun');
    __publicField(
      this,
      'currentCancellationTokenSource',
      new vscode8.CancellationTokenSource()
    );
    this.testController = vscode8.tests.createTestController(
      'forgeCockpitTests',
      'Forge cockpit Tests'
    );
    this.onDidChangeContracts(contracts2 => {
      this.contracts = contracts2;
      this.refreshTests();
    });
    this.testController.createRunProfile(
      'Run Test',
      vscode8.TestRunProfileKind.Run,
      (request, token) => this.runHandler(request, token, false),
      true
    );
    this.testController.createRunProfile(
      'Run Test via IR',
      vscode8.TestRunProfileKind.Run,
      (request, token) => this.runHandler(request, token, true)
    );
    this.testController.createRunProfile(
      'Verbose',
      vscode8.TestRunProfileKind.Coverage,
      (request, token) => this.runHandler(request, token, false, '-vvvvv'),
      false
    );
    this.refreshTests();
  }
  resetTestStates() {
    this.refreshTests();
  }
  async stopTests(token) {
    if (this.currentCancellationTokenSource) {
      this.currentCancellationTokenSource.cancel();
      this.currentCancellationTokenSource.dispose();
    }
    if (this.currentRun) {
      this.currentRun.end();
      this.currentRun = void 0;
    }
    if (this.testController.refreshHandler) {
      await this.testController.refreshHandler(token);
    }
  }
  async refreshTests() {
    this.clearAllTests();
    this.buildTestStructure();
  }
  clearAllTests() {
    this.testController.items.forEach(item => this.disposeTestItem(item));
    this.testController.items.replace([]);
    this.testItems.clear();
    this.testData.clear();
    this.testController.invalidateTestResults();
  }
  disposeTestItem(item) {
    var _a;
    (_a = item.children) == null
      ? void 0
      : _a.forEach(child => this.disposeTestItem(child));
  }
  buildTestStructure() {
    const rootItem = this.testController.createTestItem(
      'test',
      'test',
      vscode8.Uri.file('test')
    );
    rootItem.canResolveChildren = true;
    this.testItems.set('test', rootItem);
    this.testController.items.add(rootItem);
    this.buildFolderStructure();
    this.contracts.forEach(contract => this.addTestContract(contract));
  }
  buildFolderStructure() {
    const createdFolders = /* @__PURE__ */ new Set(['test']);
    for (const contract of this.contracts) {
      if (!contract.filePath) {
        continue;
      }
      const contractPath = contract.filePath.replace(/\\/g, '/');
      const pathParts = contractPath.split('/');
      let currentPath = 'test';
      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i];
        const newPath = `${currentPath}/${folderName}`;
        if (!createdFolders.has(newPath)) {
          const parentItem = this.testItems.get(currentPath);
          if (parentItem) {
            const folderItem = this.testController.createTestItem(
              newPath,
              folderName,
              vscode8.Uri.file(newPath)
            );
            folderItem.canResolveChildren = true;
            parentItem.children.add(folderItem);
            this.testItems.set(newPath, folderItem);
            createdFolders.add(newPath);
          }
        }
        currentPath = newPath;
      }
    }
  }
  addTestContract(contract) {
    var _a;
    if (!contract.filePath) {
      return;
    }
    const contractPath = contract.filePath.replace(/\\/g, '/');
    const pathParts = contractPath.split('/');
    const parentPath = pathParts.slice(0, pathParts.length - 1).join('/');
    const fullParentPath = parentPath ? `test/${parentPath}` : 'test';
    const parentItem = this.testItems.get(fullParentPath);
    if (!parentItem) {
      return;
    }
    const workspaceRoot = this.foundryController.getConfig().workspaceRoot;
    const contractUri = vscode8.Uri.joinPath(workspaceRoot, contract.filePath);
    const contractItem = this.testController.createTestItem(
      contractPath,
      contract.fileName,
      contractUri
    );
    contractItem.canResolveChildren = true;
    this.testItems.set(contractPath, contractItem);
    parentItem.children.add(contractItem);
    if (((_a = contract.tests) == null ? void 0 : _a.length) > 0) {
      contract.tests.forEach(test =>
        this.addTestMethod(contractItem, contract.filePath, test, contractUri)
      );
    }
  }
  addTestMethod(contractItem, contractPath, test, contractUri) {
    const testId = `${contractPath}:${test.testName}`;
    const testItem = this.testController.createTestItem(
      testId,
      test.testName,
      contractUri
    );
    this.testData.set(testId, {
      contractName: contractPath,
      testName: test.testName,
    });
    contractItem.children.add(testItem);
    this.testItems.set(testId, testItem);
  }
  async runHandler(request, token, viaIR, verbose) {
    this.stopTests(token);
    this.currentCancellationTokenSource = new vscode8.CancellationTokenSource();
    this.currentRun = this.testController.createTestRun(request);
    const run = this.currentRun;
    const testsToRun = [];
    if (request.include) {
      request.include.forEach(test =>
        this.collectTestItems(test, testsToRun, request.exclude)
      );
    } else {
      this.testController.items.forEach(item =>
        this.collectTestItems(item, testsToRun, request.exclude)
      );
    }
    const totalTests = testsToRun.length;
    run.appendOutput(`Running ${totalTests} tests`);
    const config2 = {
      ...this.foundryController.getConfig(),
      viaIR,
      verbosity: verbose || '',
    };
    if (totalTests === 0) {
      run.appendOutput(`No tests found to run.`);
      this.logger.logToOutput(`No tests found to run.`);
      run.end();
      this.currentRun = void 0;
      this.currentCancellationTokenSource.dispose();
      return;
    }
    if (
      this.currentCancellationTokenSource.token.isCancellationRequested ||
      token.isCancellationRequested
    ) {
      run.appendOutput(`Test execution cancelled.`);
      this.logger.logToOutput(`Test execution cancelled.`);
      run.end();
      this.currentRun = void 0;
      this.currentCancellationTokenSource.dispose();
      return;
    }
    testsToRun.forEach(test => {
      const testInfo = this.testData.get(test.id);
      if (testInfo) {
        run.started(test);
      }
    });
    try {
      if (testsToRun.length === 1) {
        const testInfo = this.testData.get(testsToRun[0].id);
        if (!testInfo) {
          run.failed(
            testsToRun[0],
            new vscode8.TestMessage('Test info not found')
          );
          run.appendOutput(
            `Test failed: ${testsToRun[0].label} - Test info not found`
          );
          this.logger.logToOutput(
            `Test failed: ${testsToRun[0].label} - Test info not found`
          );
        } else {
          const results = await this.foundryController.runTest(
            testInfo.contractName,
            testInfo == null ? void 0 : testInfo.testName,
            config2
          );
          if (results.success) {
            run.passed(testsToRun[0]);
            const message = `Test passed: ${testInfo.testName}`;
            run.appendOutput(message);
            this.logger.logToOutput(message);
          } else {
            run.failed(
              testsToRun[0],
              new vscode8.TestMessage(`Error running test ${results.error}`)
            );
            const message = `Test failed: ${testInfo.testName} - ${results.error}`;
            run.appendOutput(message);
            this.logger.logToOutput(message);
          }
        }
      } else {
        const results = await this.foundryController.runAllTests(config2);
        testsToRun.forEach(test => {
          var _a;
          const testInfo = this.testData.get(test.id);
          if (!testInfo) {
            run.failed(test, new vscode8.TestMessage('Test info not found'));
            return;
          }
          const testFileName =
            (_a = test.id.split(':')[0]) == null ? void 0 : _a.split('/').pop();
          const result = results.find(r => r.fileName === testFileName);
          if (result && result.success) {
            run.passed(test);
            run.appendOutput(`Test passed: ${testInfo.testName}`);
            this.logger.logToOutput(`Test passed: ${testInfo.testName}`);
          } else if (result) {
            run.failed(
              test,
              new vscode8.TestMessage(
                `Test failed: ${result.error || 'Test failed'}`
              )
            );
            run.appendOutput(
              `Test failed: ${testInfo.testName} - ${result.error || 'Test failed'}`
            );
            this.logger.logToOutput(
              `Test failed: ${testInfo.testName} - ${result.error || 'Test failed'}`
            );
          } else {
            run.failed(
              test,
              new vscode8.TestMessage(`Test not found in results`)
            );
            run.appendOutput(
              `Test failed: ${testInfo.testName} - Test not found in results`
            );
            this.logger.logToOutput(
              `Test failed: ${testInfo.testName} - Test not found in results`
            );
          }
        });
      }
    } catch (error) {
      testsToRun.forEach(test => {
        const testInfo = this.testData.get(test.id);
        if (!testInfo) {
          return;
        }
        const message = new vscode8.TestMessage(
          `Execution error: ${error.message}`
        );
        run.failed(test, message);
        run.appendOutput(`Test failed: ${testInfo.testName} - Execution error`);
      });
      run.appendOutput(`Test execution error: ${error.message}`);
      this.logger.logToOutput(`Test execution error: ${error.stack}`);
    }
    run.appendOutput(`Test execution complete.`);
    run.end();
    this.currentRun = void 0;
    this.currentCancellationTokenSource.dispose();
  }
  collectTestItems(item, collected, excluded) {
    var _a;
    if (excluded == null ? void 0 : excluded.includes(item)) {
      return;
    }
    if (this.testData.has(item.id)) {
      collected.push(item);
      return;
    }
    (_a = item.children) == null
      ? void 0
      : _a.forEach(child => this.collectTestItems(child, collected, excluded));
  }
  runTest(test) {
    const testId = `${test.contractName}:${test.testName}`;
    const testItem = this.testItems.get(testId);
    if (testItem) {
      const request = new vscode8.TestRunRequest([testItem]);
      this.runHandler(
        request,
        new vscode8.CancellationTokenSource().token,
        false
      );
    }
  }
  runTestViaIR(test) {
    const testId = `${test.contractName}:${test.testName}`;
    const testItem = this.testItems.get(testId);
    if (testItem) {
      const request = new vscode8.TestRunRequest([testItem]);
      this.runHandler(
        request,
        new vscode8.CancellationTokenSource().token,
        true
      );
    }
  }
  runGroup(groupId) {
    const groupItem = this.testItems.get(groupId);
    if (groupItem) {
      const request = new vscode8.TestRunRequest([groupItem]);
      this.runHandler(
        request,
        new vscode8.CancellationTokenSource().token,
        false
      );
    }
  }
  dispose() {
    this.stopTests(this.currentCancellationTokenSource.token);
    this.testController.dispose();
  }
};

// ../panels/forgeCockPitPanel.ts
var import_webview = __toESM(require('@tomjs/vite-plugin-vscode/webview'));
var import_vscode = require('vscode');
var _ForgeCockPitPanel = class _ForgeCockPitPanel {
  constructor(panel, context) {
    __publicField(this, '_panel');
    __publicField(this, '_disposables', []);
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      context
    );
    this._setWebviewMessageListener(this._panel.webview);
  }
  static render(context) {
    if (_ForgeCockPitPanel.currentPanel) {
      _ForgeCockPitPanel.currentPanel._panel.reveal(
        import_vscode.ViewColumn.One
      );
    } else {
      const panel = import_vscode.window.createWebviewPanel(
        'showForgeCockPit',
        'Forge CockPit',
        import_vscode.ViewColumn.One,
        {
          retainContextWhenHidden: true,
          enableScripts: true,
          localResourceRoots: [
            import_vscode.Uri.joinPath(context.extensionUri, 'out'),
            import_vscode.Uri.joinPath(context.extensionUri, 'dist'),
          ],
        }
      );
      _ForgeCockPitPanel.currentPanel = new _ForgeCockPitPanel(panel, context);
    }
  }
  static isVisible() {
    var _a, _b;
    return (_b =
      (_a = _ForgeCockPitPanel.currentPanel) == null
        ? void 0
        : _a._panel.active) != null
      ? _b
      : false;
  }
  static exists() {
    return _ForgeCockPitPanel.currentPanel !== void 0;
  }
  dispose() {
    _ForgeCockPitPanel.currentPanel = void 0;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
  _getWebviewContent(webview, context) {
    return (0, import_webview.default)({
      serverUrl: 'http://localhost:5000/',
      webview,
      context,
      injectCode: `<script>window.__FLAG1__=666;window.__FLAG2__=888;</script>`,
    });
  }
  _setWebviewMessageListener(webview) {
    webview.onDidReceiveMessage(
      async message => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        const command = message.command;
        const payload = this.toSafePayload(message.payload);
        switch (command) {
          case WebviewCommand.GetActiveNodesCommand:
            await _ForgeCockPitPanel.sendActiveNodes(command);
            break;
          case WebviewCommand.StopNodeCommand:
            const stopped = await import_vscode.commands.executeCommand(
              ForgeCockpitCommand.StopNodeCommand,
              payload
            );
            (_a = _ForgeCockPitPanel.currentPanel) == null
              ? void 0
              : _a._panel.webview.postMessage({
                  type: ForgeCockPitResponseCommand.StopNodeResponse,
                  payload: stopped,
                  previousType: command.toString(),
                });
            break;
          case WebviewCommand.DeployContractCommand:
            const contractInfo = payload;
            const DeployedContract =
              await import_vscode.commands.executeCommand(
                ForgeCockpitCommand.DeployContractCommand,
                contractInfo
              );
            (_b = _ForgeCockPitPanel.currentPanel) == null
              ? void 0
              : _b._panel.webview.postMessage({
                  type: ForgeCockPitResponseCommand.DeployContractResponse,
                  payload: DeployedContract,
                  previousType: command.toString(),
                });
            break;
          case WebviewCommand.WalletBalancesCommand:
            const walletInfo = payload;
            const balances = await import_vscode.commands.executeCommand(
              ForgeCockpitCommand.WalletBalancesCommand,
              walletInfo
            );
            (_c = _ForgeCockPitPanel.currentPanel) == null
              ? void 0
              : _c._panel.webview.postMessage({
                  type: ForgeCockPitResponseCommand.WalletBalancesResponse,
                  payload: balances,
                  previousType: command.toString(),
                });
            break;
          case WebviewCommand.ExecuteFunctionCommand:
            const transaction = payload;
            const response = await import_vscode.commands.executeCommand(
              ForgeCockpitCommand.ExecuteFunctionCommand,
              transaction
            );
            (_d = _ForgeCockPitPanel.currentPanel) == null
              ? void 0
              : _d._panel.webview.postMessage({
                  type: ForgeCockPitResponseCommand.ExecuteFunctionResponse,
                  payload: response,
                  previousType: transaction.caller,
                });
            break;
          case WebviewCommand.TransferCommand:
            const balanceResponse = await import_vscode.commands.executeCommand(
              ForgeCockpitCommand.TransferCommand,
              payload
            );
            (_e = _ForgeCockPitPanel.currentPanel) == null
              ? void 0
              : _e._panel.webview.postMessage({
                  type: ForgeCockPitResponseCommand.TransferResponse,
                  payload: JSON.stringify(balanceResponse),
                  previousType: command.toString(),
                  previousPayload: payload,
                });
            break;
          case ClipBoardTypeCommand.ReadWalletImportCommand:
          case ClipBoardTypeCommand.ReadClipboardWalletCommand:
          case ClipBoardTypeCommand.ReadClipboardDeploymentCommand:
          case ClipBoardTypeCommand.ReadClipboardAnvilCommand:
          case ClipBoardTypeCommand.ReadClipboardConstructorArgsCommand:
          case ClipBoardTypeCommand.ReadClipboardFunctionInputCommand:
          case ClipBoardTypeCommand.ReadClipboardEncoderCommand:
          case ClipBoardTypeCommand.ReadTransferCommand:
          case ClipBoardTypeCommand.ReadClipboard:
            const text = await import_vscode.env.clipboard.readText();
            import_vscode.window.showInformationMessage(
              `Read from clipboard ${JSON.stringify(text)}`
            );
            (_f = _ForgeCockPitPanel.currentPanel) == null
              ? void 0
              : _f._panel.webview.postMessage({
                  type: ForgeCockPitResponseCommand.ClipboardContentResponse,
                  payload: JSON.stringify(text),
                  previousType: command.toString(),
                  previousPayload: payload,
                });
            break;
          case WebviewCommand.WriteClipboardCommand:
            import_vscode.window.showInformationMessage('Copied to Clipboard');
            await import_vscode.env.clipboard.writeText(
              JSON.stringify(payload)
            );
            break;
          case WebviewCommand.RunScriptCommand:
            const scriptResults = await import_vscode.commands.executeCommand(
              ForgeCockpitCommand.RunScriptCommand,
              payload
            );
            (_g = _ForgeCockPitPanel.currentPanel) == null
              ? void 0
              : _g._panel.webview.postMessage({
                  type: ForgeCockPitResponseCommand.RunScriptResponse,
                  payload: JSON.stringify(scriptResults),
                  previousType: command.toString(),
                });
            break;
          case WebviewCommand.StopNodeCommand:
            import_vscode.commands.executeCommand(
              ForgeCockpitCommand.StopNodeCommand,
              payload
            );
            break;
          case WebviewCommand.OpenLinkCommand:
            import_vscode.commands.executeCommand(
              ForgeCockpitCommand.OpenUrlCommand,
              payload
            );
            break;
          case WebviewCommand.AbiEncodeCommand:
            const input = payload;
            const encoded = encodeFunction(input);
            (_h = _ForgeCockPitPanel.currentPanel) == null
              ? void 0
              : _h._panel.webview.postMessage({
                  type: ForgeCockPitResponseCommand.AbiEncodeResponse,
                  payload: JSON.stringify(encoded),
                  previousType: command.toString(),
                });
            break;
          case WebviewCommand.RefreshContractsCommand:
          case WebviewCommand.LoadContractsCommand:
            import_vscode.commands.executeCommand(
              ForgeCockpitCommand.RefreshTestsCommand
            );
            import_vscode.commands.executeCommand(
              ForgeCockpitCommand.LoadCockPitWalletsCommand
            );
            return;
          case WebviewCommand.ForkNodeCommand:
            const results = await import_vscode.commands.executeCommand(
              ForgeCockpitCommand.ForkNodeCommand,
              payload
            );
            const result = {
              ...results,
              tabId: payload,
            };
            (_i = _ForgeCockPitPanel.currentPanel) == null
              ? void 0
              : _i._panel.webview.postMessage({
                  type: ForgeCockPitResponseCommand.ForkNodeResultsResponse,
                  payload: result,
                  previousType: '',
                });
            break;
          default:
            import_vscode.window.showInformationMessage(message);
        }
      },
      void 0,
      this._disposables
    );
  }
  static sendDefaultWallets(command, wallets) {
    var _a;
    if (_ForgeCockPitPanel.currentPanel) {
      (_a = _ForgeCockPitPanel.currentPanel) == null
        ? void 0
        : _a._panel.webview.postMessage({
            type: ForgeCockPitResponseCommand.GetDefaultWalletsResponse,
            payload: wallets,
            previousType: command.toString(),
          });
    }
  }
  static sendContracts(contracts) {
    if (_ForgeCockPitPanel.currentPanel) {
      _ForgeCockPitPanel.currentPanel._panel.webview.postMessage({
        type: ForgeCockPitResponseCommand.SetContractsResponse,
        payload: contracts,
      });
    }
  }
  static async sendActiveNodes(command) {
    var _a;
    if (_ForgeCockPitPanel.currentPanel) {
      const nodes = await import_vscode.commands.executeCommand(
        ForgeCockpitCommand.GetActiveNodesCommand
      );
      (_a = _ForgeCockPitPanel.currentPanel) == null
        ? void 0
        : _a._panel.webview.postMessage({
            type: ForgeCockPitResponseCommand.GetActiveNodesResponse,
            payload: nodes,
            previousType: command.toString(),
          });
    }
  }
  toSafePayload(payload) {
    if (typeof payload === 'string') {
      try {
        return JSON.parse(payload);
      } catch (e) {
        return payload;
      }
    }
    return payload;
  }
};
__publicField(_ForgeCockPitPanel, 'currentPanel');
var ForgeCockPitPanel = _ForgeCockPitPanel;

// ../providers/cockpitActionsProvider.ts
var vscode10 = __toESM(require('vscode'));

// ../items/cockPitItem.ts
var vscode9 = __toESM(require('vscode'));
var CockPitActionItem = class extends vscode9.TreeItem {
  constructor(label, tooltip, command, iconName) {
    super(label, vscode9.TreeItemCollapsibleState.None);
    this.label = label;
    this.tooltip = tooltip;
    this.command = command;
    this.tooltip = tooltip;
    this.command = command;
    this.iconPath = new vscode9.ThemeIcon(iconName);
  }
};

// ../providers/cockpitActionsProvider.ts
var CockPitActionsProvider = class {
  constructor() {
    __publicField(this, '_onDidChangeTreeData', new vscode10.EventEmitter());
    __publicField(this, 'onDidChangeTreeData', this._onDidChangeTreeData.event);
  }
  refresh() {
    this._onDidChangeTreeData.fire();
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (element) {
      return Promise.resolve([]);
    }
    const items = [];
    items.push(
      new CockPitActionItem(
        'Open Cockpit',
        'Open the Forge Cockpit panel',
        {
          command: ForgeCockpitCommand.ShowForgeCockPitCommand,
          title: 'Open Cockpit',
        },
        'play'
      ),
      new CockPitActionItem(
        'Clear Cockpit Cache',
        'Clear Forge Cockpit cache',
        {
          command: ForgeCockpitCommand.ClearCacheCommand,
          title: 'Clear Cache',
        },
        'notebook-delete-cell'
      )
    );
    return Promise.resolve(items);
  }
};

// ../providers/abiProvider.ts
var vscode11 = __toESM(require('vscode'));
var AbiProvider = class {
  constructor(foundryProjectController, logger) {
    this.foundryProjectController = foundryProjectController;
    this.logger = logger;
    __publicField(this, 'abis', []);
    __publicField(this, 'watcher');
    __publicField(this, '_onDidChangeAbis', new vscode11.EventEmitter());
    __publicField(this, 'onDidChangeAbis', this._onDidChangeAbis.event);
    __publicField(this, 'debounceTimer');
  }
  initialize() {
    this.logger.updateStatusBar(
      '$(beaker~spin) Forge cockpit loading ABIs',
      new vscode11.ThemeColor('statusBarItem.successBackground')
    );
    this.setupFileWatcher();
    this.foundryProjectController.onDidBuildSucceed(() => {
      this.refresh();
    });
    this.logger.updateStatusBar(
      '$(check) Forge cockpit ready',
      new vscode11.ThemeColor('statusBarItem.successBackground')
    );
  }
  async loadAbis() {
    try {
      this.abis = await this.foundryProjectController.getAllContractABIs();
    } catch (error) {}
  }
  setupFileWatcher() {
    const workspaceFolders = vscode11.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return;
    }
    const outputDir =
      this.foundryProjectController.getConfig().outputDir || 'out';
    try {
      const pattern = new vscode11.RelativePattern(
        workspaceFolders[0],
        `${outputDir}/**/*.json`
      );
      this.watcher = vscode11.workspace.createFileSystemWatcher(pattern);
      this.watcher.onDidCreate(() => this.triggerRefresh('create'));
      this.watcher.onDidChange(() => this.triggerRefresh('change'));
      this.watcher.onDidDelete(() => this.triggerRefresh('delete'));
      console.log(`Output watcher set up for ${outputDir}/**/*.json`);
    } catch (error) {
      console.error('Error setting up file watcher:', error);
    }
  }
  triggerRefresh(source) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(async () => {
      await this.loadAbis();
      this._onDidChangeAbis.fire();
    }, 1e3);
  }
  async refresh() {
    await this.loadAbis();
    this._onDidChangeAbis.fire();
  }
  async triggerBuild() {
    await this.foundryProjectController.triggerBuild();
  }
  dispose() {
    if (this.watcher) {
      this.watcher.dispose();
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.foundryProjectController.dispose();
    this._onDidChangeAbis.dispose();
  }
};

// ../providers/stubTestProvider.ts
var vscode12 = __toESM(require('vscode'));
var import_path = __toESM(require('path'));
var StubTestProvider = class {
  constructor(contractName, abi, logger) {
    __publicField(this, 'contractName');
    __publicField(this, 'abi');
    __publicField(this, 'logger');
    __publicField(this, 'sourceCode', '');
    __publicField(this, 'dependencies', /* @__PURE__ */ new Set());
    __publicField(this, 'events', /* @__PURE__ */ new Map());
    __publicField(this, 'stateVariables', /* @__PURE__ */ new Map());
    __publicField(this, 'abiEvents', /* @__PURE__ */ new Map());
    __publicField(this, 'errors', /* @__PURE__ */ new Map());
    __publicField(this, 'patterns', [
      {
        name: 'foundry-uups',
        detect: (code, abi) =>
          code.includes('openzeppelin-foundry-upgrades') &&
          (code.includes('UUPS') || this.hasInitializer(abi)),
        template: {
          imports:
            'import {UnsafeUpgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";',
          declarations: 'address public proxy;',
          setup: `proxy = UnsafeUpgrades.deployUUPSProxy(
            address(new {{CONTRACT}}()),
            {{INIT_DATA}}
        );
        {{CONTRACT_VAR}} = {{CONTRACT}}(proxy);`,
        },
      },
      {
        name: 'foundry-transparent',
        detect: (code, abi) =>
          code.includes('openzeppelin-foundry-upgrades') &&
          code.includes('Transparent'),
        template: {
          imports:
            'import {UnsafeUpgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";',
          declarations: 'address public proxy;',
          setup: `proxy = UnsafeUpgrades.deployTransparentProxy(
            address(new {{CONTRACT}}()),
            address(this),
            {{INIT_DATA}}
        );
        {{CONTRACT_VAR}} = {{CONTRACT}}(proxy);`,
        },
      },
      {
        name: 'erc1967-proxy',
        detect: (code, abi) =>
          (code.includes('upgradeable') ||
            code.includes('proxy') ||
            this.hasInitializer(abi)) &&
          !code.includes('foundry-upgrades'),
        template: {
          imports:
            'import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";',
          declarations:
            'ERC1967Proxy public proxy;\n    address public implementation;',
          setup: `implementation = address(new {{CONTRACT}}());
        proxy = new ERC1967Proxy(implementation, {{INIT_DATA}});
        {{CONTRACT_VAR}} = {{CONTRACT}}(address(proxy));`,
        },
      },
      {
        name: 'regular',
        detect: () => true,
        template: {
          imports: '',
          declarations: '',
          setup: '{{CONTRACT_VAR}} = new {{CONTRACT}}({{CONSTRUCTOR_PARAMS}});',
        },
      },
    ]);
    __publicField(
      this,
      'baseTemplate',
      `// SPDX-License-Identifier: UNLICENSED
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
`
    );
    this.contractName = contractName;
    this.abi = abi;
    this.logger = logger;
    this.findDependencies();
    this.extractAbiEvents();
    this.extractAbiErrors();
  }
  async generateTestFile(filePath) {
    var _a;
    try {
      const workspaceFolder =
        (_a = vscode12.workspace.workspaceFolders) == null ? void 0 : _a[0];
      if (!workspaceFolder) {
        throw new Error('No workspace folder found.');
      }
      const absolutePath = import_path.default.join(
        workspaceFolder.uri.fsPath,
        filePath
      );
      const sourceCode = await vscode12.workspace.fs.readFile(
        vscode12.Uri.file(absolutePath)
      );
      this.sourceCode = Buffer.from(sourceCode).toString('utf8');
      this.extractStateVariables();
      this.mapFunctionEvents();
      const content = this.renderTemplate();
      const document = await vscode12.workspace.openTextDocument({
        content,
        language: 'solidity',
      });
      await vscode12.window.showTextDocument(document);
      this.logger.logToOutput(`Generated test file for ${this.contractName}`);
    } catch (error) {
      this.logger.logToOutput(`Error generating test file: ${error.stack}`);
    }
  }
  extractAbiEvents() {
    const eventItems = this.abi.filter(item => item.type === 'event');
    for (const event of eventItems) {
      if (event.name) {
        this.abiEvents.set(event.name, event);
      }
    }
  }
  extractAbiErrors() {
    const errorItems = this.abi.filter(item => item.type === 'error');
    for (const error of errorItems) {
      if (error.name) {
        this.errors.set(error.name, error);
      }
    }
  }
  extractStateVariables() {
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
  mapFunctionEvents() {
    if (!this.sourceCode) {
      return;
    }
    const functionRegex =
      /function\s+(\w+)\s*\([^)]*\)\s*[^{]*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
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
  extractEmittedEvents(functionBody) {
    var _a, _b;
    const events = [];
    const emitRegex = /emit\s+(\w+)\s*\(([^)]*)\)/g;
    let match;
    while ((match = emitRegex.exec(functionBody)) !== null) {
      const eventName = match[1];
      const abiEvent = this.abiEvents.get(eventName);
      if (abiEvent) {
        const eventInfo = {
          name: eventName,
          signature: this.buildEventSignature(abiEvent),
          indexed:
            ((_a = abiEvent.inputs) == null
              ? void 0
              : _a.filter(input => input.indexed).map(input => input.name)) ||
            [],
          nonIndexed:
            ((_b = abiEvent.inputs) == null
              ? void 0
              : _b.filter(input => !input.indexed).map(input => input.name)) ||
            [],
          inputs: abiEvent.inputs || [],
        };
        events.push(eventInfo);
      }
    }
    return events;
  }
  buildEventSignature(event) {
    if (!event.inputs || event.inputs.length === 0) {
      return `${event.name}()`;
    }
    const paramTypes = event.inputs.map(input => input.type).join(',');
    return `${event.name}(${paramTypes})`;
  }
  analyzeFunction(func) {
    const functionName = func.name;
    const functionEvents = this.events.get(functionName) || [];
    let modifiesState = false;
    let accessesState = [];
    let modifiesVariables = [];
    let canRevert = false;
    if (this.sourceCode && functionName) {
      const functionBodyMatch = this.sourceCode.match(
        new RegExp(
          `function\\s+${functionName}\\s*\\([^)]*\\)\\s*[^{]*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}`,
          'g'
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
          functionBody.includes('require(') ||
          functionBody.includes('revert(') ||
          functionBody.includes('assert(') ||
          functionBody.includes('_revert');
      }
    }
    if (!modifiesState) {
      modifiesState =
        func.stateMutability !== 'view' && func.stateMutability !== 'pure';
    }
    return {
      modifiesState,
      accessesState: [...new Set(accessesState)],
      modifiesVariables: [...new Set(modifiesVariables)],
      hasEvents: functionEvents.length > 0,
      eventCount: functionEvents.length,
      isPayable: func.stateMutability === 'payable',
      canRevert,
    };
  }
  renderTemplate() {
    const pattern = this.detectPattern();
    const context = this.buildContext(pattern);
    return this.replaceTokens(this.baseTemplate, context);
  }
  detectPattern() {
    return (
      this.patterns.find(p => p.detect(this.sourceCode, this.abi)) ||
      this.patterns[3]
    );
  }
  buildContext(pattern) {
    return {
      CONTRACT: this.contractName,
      CONTRACT_VAR: this.contractName.toLowerCase(),
      DEPENDENCY_IMPORTS: this.renderDependencyImports(),
      DEPENDENCY_DECLARATIONS: this.renderDependencyDeclarations(),
      DEPENDENCY_SETUP: this.renderDependencySetup(),
      PATTERN_IMPORTS: pattern.template.imports
        ? `
${pattern.template.imports}`
        : '',
      PATTERN_DECLARATIONS: pattern.template.declarations
        ? `
    ${pattern.template.declarations}`
        : '',
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
  replaceTokens(template, context) {
    return Object.entries(context).reduce(
      (result, [key, value]) =>
        result.replace(new RegExp(`{{${key}}}`, 'g'), value),
      template
    );
  }
  hasInitializer(abi) {
    return abi.some(item => item.name === 'initialize');
  }
  findDependencies() {
    const initMethods = this.abi.filter(
      item => item.type === 'constructor' || item.name === 'initialize'
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
  extractContractName(input) {
    var _a;
    if ((_a = input.internalType) == null ? void 0 : _a.includes('contract ')) {
      const match = input.internalType.match(/contract\s+([^\s]+)/);
      return (match == null ? void 0 : match[1]) || null;
    }
    return null;
  }
  renderDependencyImports() {
    const imports = Array.from(this.dependencies)
      .map(dep => `import "src/${dep}.sol";`)
      .join('\n');
    return imports
      ? `
${imports}`
      : '';
  }
  renderDependencyDeclarations() {
    if (this.dependencies.size === 0) {
      return '';
    }
    const declarations = Array.from(this.dependencies)
      .map(dep => `${dep} public ${dep.toLowerCase()};`)
      .join('\n    ');
    return `
    ${declarations}`;
  }
  renderDependencySetup() {
    if (this.dependencies.size === 0) {
      return '';
    }
    const setup = Array.from(this.dependencies)
      .map(dep => `        ${dep.toLowerCase()} = new ${dep}();`)
      .join('\n');
    return `${setup}
`;
  }
  getInitData() {
    var _a;
    const initializer = this.abi.find(item => item.name === 'initialize');
    return (
      (_a = initializer == null ? void 0 : initializer.inputs) == null
        ? void 0
        : _a.length
    )
      ? `abi.encodeCall(${this.contractName}.initialize, (${this.buildParamList(initializer.inputs)}))`
      : '""';
  }
  getConstructorParams() {
    const constructor = this.abi.find(item => item.type === 'constructor');
    return (constructor == null ? void 0 : constructor.inputs)
      ? this.buildParamList(constructor.inputs)
      : '';
  }
  buildParamList(inputs) {
    return inputs
      .map(input => {
        const contractName = this.extractContractName(input);
        if (contractName && this.dependencies.has(contractName)) {
          return contractName.toLowerCase();
        }
        return this.getDefaultValue(input);
      })
      .join(', ');
  }
  getDefaultValue(input) {
    const type = input.type;
    if (this.isStructType(input)) {
      return this.buildStructLiteral(input);
    }
    if (type == null ? void 0 : type.startsWith('uint')) {
      const bitSize = parseInt(type.replace('uint', '')) || 256;
      return bitSize <= 8 ? '1' : '100';
    }
    if (type == null ? void 0 : type.startsWith('int')) {
      return '1';
    }
    if (type === 'bool') {
      return 'true';
    }
    if (type === 'address') {
      return 'address(0x1)';
    }
    if (type === 'string') {
      return '"test"';
    }
    if (type === 'bytes') {
      return '"0x01"';
    }
    if (
      (type == null ? void 0 : type.startsWith('bytes')) &&
      type !== 'bytes'
    ) {
      return '"0x01"';
    }
    if (type == null ? void 0 : type.endsWith('[]')) {
      const baseType = type.replace(/\[\]$/, '');
      return `new ${baseType}[](0)`;
    }
    if (type == null ? void 0 : type.match(/\[\d+\]$/)) {
      const match = type.match(/(.+)\[(\d+)\]$/);
      if (match) {
        const baseType = match[1];
        const size = parseInt(match[2]);
        const defaultVal = this.getDefaultValue({ type: baseType });
        return `[${Array(Math.min(size, 3)).fill(defaultVal).join(', ')}${size > 3 ? ', ...' : ''}]`;
      }
    }
    if (type == null ? void 0 : type.startsWith('enum ')) {
      return '0';
    }
    return '0';
  }
  isStructType(input) {
    return (input == null ? void 0 : input.type) === 'tuple';
  }
  buildStructLiteral(input) {
    var _a;
    const structName = this.getStructName(input);
    if (!((_a = input.components) == null ? void 0 : _a.length)) {
      return `${this.contractName}.${structName}({})`;
    }
    const fields = input.components
      .map(comp => `${comp.name}: ${this.getDefaultValue(comp)}`)
      .join(', ');
    return `${this.contractName}.${structName}({${fields}})`;
  }
  getStructName(input) {
    var _a, _b, _c;
    if ((_a = input.internalType) == null ? void 0 : _a.includes('struct')) {
      const match = input.internalType.match(
        /struct\s+(?:[^.]+\.)?([^.\[\]\s]+)/
      );
      if (match == null ? void 0 : match[1]) {
        return match[1];
      }
    }
    if (this.sourceCode && input.name) {
      const pascalName = this.toPascalCase(input.name);
      const structPattern = new RegExp(`struct\\s+${pascalName}\\s*{`, 'g');
      if (structPattern.test(this.sourceCode)) {
        return pascalName;
      }
      const structMatches = this.sourceCode.match(
        /struct\s+([A-Za-z_][A-Za-z0-9_]*)\s*{/g
      );
      if (structMatches) {
        for (const structMatch of structMatches) {
          const structName =
            (_b = structMatch.match(/struct\s+([A-Za-z_][A-Za-z0-9_]*)/)) ==
            null
              ? void 0
              : _b[1];
          if (
            structName &&
            structName.toLowerCase() === input.name.toLowerCase()
          ) {
            return structName;
          }
        }
        if (structMatches.length > 0) {
          const firstStruct =
            (_c = structMatches[0].match(
              /struct\s+([A-Za-z_][A-Za-z0-9_]*)/
            )) == null
              ? void 0
              : _c[1];
          if (firstStruct) {
            return firstStruct;
          }
        }
      }
    }
    return input.name ? this.toPascalCase(input.name) : 'TestStruct';
  }
  renderTests() {
    const functions = this.abi.filter(
      item =>
        item.type === 'function' &&
        item.name &&
        item.name !== 'initialize' &&
        !this.isStateVariableGetter(item)
    );
    let allTests = '';
    for (const func of functions) {
      allTests += this.renderSingleTest(func);
      allTests += this.renderRevertTests(func);
    }
    return allTests;
  }
  isStateVariableGetter(func) {
    var _a, _b;
    if (
      !this.sourceCode ||
      func.stateMutability !== 'view' ||
      ((_a = func.inputs) == null ? void 0 : _a.length) !== 0
    ) {
      return false;
    }
    return (
      this.stateVariables.has(func.name) &&
      ((_b = this.stateVariables.get(func.name)) == null
        ? void 0
        : _b.visibility) === 'public'
    );
  }
  renderSingleTest(func) {
    var _a;
    const name = this.toPascalCase(func.name);
    const params = this.buildParamList(func.inputs || []);
    const isView =
      func.stateMutability === 'view' || func.stateMutability === 'pure';
    const analysis = this.analyzeFunction(func);
    if (isView && ((_a = func.outputs) == null ? void 0 : _a.length)) {
      const output = func.outputs[0];
      const outputType = this.getType(output);
      const assertion = this.generateViewAssertion(output, 'result', analysis);
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
        ${this.contractName.toLowerCase()}.${func.name}${analysis.isPayable ? '{value: 1 ether}' : ''}(${params});
        vm.stopPrank();
        ${eventAssertions.assertions}
        ${stateAssertions}
    }
`;
  }
  generateEventAssertions(functionName) {
    const functionEvents = this.events.get(functionName);
    if (!functionEvents || functionEvents.length === 0) {
      return { setup: '', assertions: '' };
    }
    const setup = 'vm.recordLogs();';
    const assertions = functionEvents
      .map((event, index) => {
        let eventAssertions = `Vm.Log[] memory logs = vm.getRecordedLogs();
        assertGe(logs.length, ${index + 1});
        assertEq(logs[${index}].topics[0], keccak256("${event.signature}"));`;
        if (event.indexed.length > 0) {
          eventAssertions += `
        /// @dev Verify indexed parameters: ${event.indexed.join(', ')}`;
        }
        if (event.nonIndexed.length > 0) {
          eventAssertions += `
        /// @dev Decode and verify non-indexed parameters: ${event.nonIndexed.join(', ')}`;
        }
        return eventAssertions;
      })
      .join('\n        ');
    return { setup, assertions };
  }
  generateViewAssertion(output, varName, analysis) {
    const type = output.type;
    if (
      (type == null ? void 0 : type.startsWith('uint')) ||
      (type == null ? void 0 : type.startsWith('int'))
    ) {
      return `assertTrue(${varName} >= 0 || ${varName} < 0);`;
    }
    if (type === 'bool') {
      return `assertTrue(${varName}) || assertFalse(${varName});`;
    }
    if (type === 'address') {
      return `assertTrue(${varName} != address(0) || ${varName} == address(0));`;
    }
    if (type === 'string') {
      return `assertTrue(bytes(${varName}).length >= 0);`;
    }
    if (this.isStructType(output)) {
      const structName = this.getStructName(output);
      if (output.components && output.components.length > 0) {
        const fieldChecks = output.components
          .map(comp => `assertTrue(true);`)
          .join('\n        ');
        return fieldChecks;
      }
      return `assertTrue(true);`;
    }
    if (type == null ? void 0 : type.endsWith('[]')) {
      return `assertTrue(${varName}.length >= 0);`;
    }
    return `assertTrue(true);`;
  }
  generateStateAssertions(analysis) {
    if (!analysis.modifiesState && !analysis.hasEvents) {
      return '';
    }
    let assertions = [];
    if (analysis.modifiesVariables.length > 0) {
      for (const varName of analysis.modifiesVariables) {
        const varInfo = this.stateVariables.get(varName);
        if (varInfo && varInfo.visibility === 'public') {
          assertions.push(`assertTrue(true);`);
        }
      }
    }
    return assertions.length > 0 ? assertions.join('\n        ') : '';
  }
  renderRevertTests(func) {
    const analysis = this.analyzeFunction(func);
    if (!analysis.canRevert) {
      return '';
    }
    const name = this.toPascalCase(func.name);
    const params = this.buildParamList(func.inputs || []);
    const modifiers = this.extractFunctionModifiers(func.name);
    let revertTests = '';
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
        .join('');
    }
    if (func.inputs && func.inputs.length > 0) {
      const zeroParams = func.inputs
        .map(input => {
          var _a, _b;
          if (input.type === 'address') {
            return 'address(0)';
          }
          if (
            ((_a = input.type) == null ? void 0 : _a.startsWith('uint')) ||
            ((_b = input.type) == null ? void 0 : _b.startsWith('int'))
          ) {
            return '0';
          }
          if (input.type === 'string') {
            return '""';
          }
          if (input.type === 'bytes') {
            return '""';
          }
          if (input.type === 'bool') {
            return 'false';
          }
          return this.getDefaultValue(input);
        })
        .join(', ');
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
  generateModifierFailureTest(modifier) {
    if (this.sourceCode) {
      const modifierDefMatch = this.sourceCode.match(
        new RegExp(
          `modifier\\s+${modifier}\\s*\\([^)]*\\)\\s*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}`,
          'g'
        )
      );
      if (modifierDefMatch && modifierDefMatch[0]) {
        const modifierBody = modifierDefMatch[0];
        const customErrorMatch = modifierBody.match(/revert\s+(\w+)\s*\(/);
        if (customErrorMatch && this.errors.has(customErrorMatch[1])) {
          return {
            setup: '',
            expectedError: `${this.contractName}.${customErrorMatch[1]}.selector`,
          };
        }
        const requireMatch = modifierBody.match(/require\([^,)]+,\s*"([^"]+)"/);
        if (requireMatch) {
          return {
            setup: '',
            expectedError: `"${requireMatch[1]}"`,
          };
        }
        if (
          modifierBody.includes('msg.sender') ||
          modifierBody.includes('owner')
        ) {
          return {
            setup: 'vm.startPrank(address(0xdead));',
            expectedError: 'bytes("")',
          };
        }
        if (
          modifierBody.includes('block.timestamp') ||
          modifierBody.includes('block.number')
        ) {
          return {
            setup: '',
            expectedError: 'bytes("")',
          };
        }
      }
    }
    return {
      setup: '',
      expectedError: 'bytes("")',
    };
  }
  extractFunctionModifiers(functionName) {
    if (!this.sourceCode) {
      return [];
    }
    const regex = new RegExp(
      `function\\s+${functionName}\\s*\\([^)]*\\)\\s*([^{]*?)\\s*{`,
      'gm'
    );
    const match = regex.exec(this.sourceCode);
    if (!match) {
      return [];
    }
    const declaration = match[1].trim();
    if (!declaration) {
      return [];
    }
    const withoutReturns = declaration
      .replace(/returns\s*\([^)]*\)/gi, '')
      .trim();
    const words = withoutReturns.split(/\s+/).filter(w => w.length > 0);
    const solidityKeywords = /* @__PURE__ */ new Set([
      'public',
      'private',
      'internal',
      'external',
      'pure',
      'view',
      'payable',
      'nonpayable',
      'virtual',
      'override',
    ]);
    const potentialModifiers = words
      .map(word => word.replace(/\([^)]*\)$/, ''))
      .filter(word => !solidityKeywords.has(word) && word.length > 0)
      .filter(word => this.isModifierDefined(word));
    return [...new Set(potentialModifiers)];
  }
  isModifierDefined(modifierName) {
    if (!this.sourceCode) {
      return false;
    }
    const modifierDefRegex = new RegExp(
      `modifier\\s+${modifierName}\\s*\\([^)]*\\)\\s*{`,
      'gm'
    );
    return modifierDefRegex.test(this.sourceCode);
  }
  renderFuzzTests() {
    const functions = this.abi.filter(item => {
      var _a;
      return (
        item.type === 'function' &&
        ((_a = item.inputs) == null ? void 0 : _a.length) &&
        item.name &&
        item.name !== 'initialize' &&
        !this.isStateVariableGetter(item)
      );
    });
    if (functions.length === 0) {
      return '';
    }
    return `

    function testFuzz_FunctionCall(address caller) public {
        vm.assume(caller != address(0));
        vm.startPrank(caller);
        assertTrue(true);
        vm.stopPrank();
    }`;
  }
  renderFuzzTest(func) {
    const name = this.toPascalCase(func.name);
    const params = func.inputs
      .map((input, i) => {
        const type = this.getType(input);
        const paramName = input.name || `param${i}`;
        return `${type} ${paramName}`;
      })
      .join(', ');
    const callParams = func.inputs
      .map((input, i) => input.name || `param${i}`)
      .join(', ');
    const analysis = this.analyzeFunction(func);
    const modifier = analysis.isPayable ? 'payable ' : '';
    const boundAssumptions = this.generateFuzzAssumptions(func.inputs);
    return `
    function testFuzz_${name}(${params}) public ${modifier}{
        ${boundAssumptions}
        ${this.contractName.toLowerCase()}.${func.name}(${callParams});
        assertTrue(true);
    }`;
  }
  generateFuzzAssumptions(inputs) {
    const assumptions = inputs.map((input, i) => {
      const paramName = input.name || `param${i}`;
      const type = input.type;
      if (type === 'address') {
        return `vm.assume(${paramName} != address(0));`;
      }
      if (type == null ? void 0 : type.startsWith('uint')) {
        return `vm.assume(${paramName} > 0);`;
      }
      if (type == null ? void 0 : type.startsWith('int')) {
        return `vm.assume(${paramName} != 0);`;
      }
      return `vm.assume(true);`;
    });
    return assumptions.length > 0 ? assumptions.join('\n        ') + '\n' : '';
  }
  getType(param) {
    if (!(param == null ? void 0 : param.type)) {
      return 'unknown';
    }
    if (this.isStructType(param)) {
      const structName = this.getStructName(param);
      return `${this.contractName}.${structName} memory`;
    }
    if (
      param.type === 'string' ||
      param.type === 'bytes' ||
      param.type.endsWith('[]')
    ) {
      return `${param.type} memory`;
    }
    return param.type;
  }
  toPascalCase(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }
};

// ../providers/walletProvider.ts
var import_viem3 = require('viem');
var WalletProvider = class {
  constructor(rpcUrl, logger) {
    this.rpcUrl = rpcUrl;
    this.logger = logger;
    __publicField(this, 'publicClient');
    this.publicClient = (0, import_viem3.createPublicClient)({
      transport: (0, import_viem3.http)(this.rpcUrl),
    });
  }
  async getBalances(wallets) {
    try {
      const balances = await Promise.all(
        wallets.map(address =>
          this.publicClient.getBalance({
            address,
          })
        )
      );
      const formattedBalances = balances.map(balance =>
        (0, import_viem3.formatEther)(balance).toString()
      );
      this.logger.logToOutput(
        `Balances retrieved: ${wallets.length} wallets: ${formattedBalances.join(', ')} ETH`
      );
      return formattedBalances;
    } catch (error) {
      this.logger.logToOutput(
        `Balance fetch failed: ${wallets.length} wallets - ${error.stack}`
      );
      return Array(wallets.length).fill('0');
    }
  }
  createChain(nodeUrl, chainId) {
    return (0, import_viem3.defineChain)({
      id: chainId,
      name: 'Forge Cockpit',
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      rpcUrls: {
        default: {
          http: [nodeUrl],
          webSocket: [],
        },
      },
    });
  }
  async executeFunction(callInfo) {
    try {
      const chainId = await this.publicClient.getChainId();
      const walletClient = (0, import_viem3.createWalletClient)({
        chain: this.createChain(callInfo.nodeUrl, chainId),
        transport: (0, import_viem3.http)(callInfo.nodeUrl),
      });
      if (callInfo.staticCall) {
        const data = await this.publicClient.readContract({
          address: callInfo.contractAddress,
          abi: callInfo.abi,
          functionName: callInfo.functionName,
          args: callInfo.params,
        });
        this.logger.logToOutput(
          `Read call successful: ${callInfo.functionName}(${JSON.stringify(callInfo.params)}) -> ${callInfo.contractAddress} | Result: ${JSON.stringify(data, (_key, value) => (typeof value === 'bigint' ? value.toString() : value))}`
        );
        return {
          logs: JSON.stringify([]),
          hash: '0x',
          functionName: callInfo.functionName,
          params: callInfo.params,
          timestamp: Date.now().toString(),
          status: data !== null,
          error: '',
          result: JSON.stringify(data, (_key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          ),
          caller: callInfo.caller,
          address: callInfo.contractAddress,
        };
      }
      const { request } = await this.publicClient.simulateContract({
        address: callInfo.contractAddress,
        abi: callInfo.abi,
        functionName: callInfo.functionName,
        args: callInfo.params,
        account: callInfo.msgSender,
      });
      const hash = await walletClient.writeContract(request);
      const transaction = await this.publicClient.getTransactionReceipt({
        hash,
      });
      this.logger.logToOutput(
        `Write call ${transaction.status}: ${callInfo.functionName}(${JSON.stringify(callInfo.params)}) -> ${callInfo.contractAddress} | Tx: ${hash} | Gas used: ${transaction.gasUsed.toString()} | Logs: ${transaction.logs.length}`
      );
      return {
        logs: safeStringify(transaction.logs),
        hash,
        functionName: callInfo.functionName,
        params: callInfo.params,
        timestamp: Date.now().toString(),
        status: transaction.status === 'success',
        error: '',
        result: '',
        address: callInfo.contractAddress,
        caller: callInfo.caller,
      };
    } catch (error) {
      this.logger.logToOutput(
        `Function call failed: ${callInfo.functionName}(${JSON.stringify(callInfo.params)}) -> ${callInfo.contractAddress} | Error: ${error.stack}`
      );
      return {
        logs: JSON.stringify([]),
        hash: '',
        functionName: callInfo.functionName,
        params: callInfo.params,
        timestamp: Date.now().toString(),
        status: false,
        error: `Unable to make contract call due to error: ${error.toString()}`,
        result: '',
        address: callInfo.contractAddress,
        caller: callInfo.caller,
      };
    }
  }
  async isAnvilNode() {
    try {
      const result = await this.publicClient.request({
        method: 'anvil_nodeInfo',
        params: [],
      });
      return !!result;
    } catch {
      return false;
    }
  }
  async chainId() {
    return (await this.publicClient.getChainId()).toString();
  }
  async deployContract(config2) {
    try {
      const chainId = await this.publicClient.getChainId();
      const chain = this.createChain(config2.nodeUrl, chainId);
      const walletClient = (0, import_viem3.createWalletClient)({
        chain,
        transport: (0, import_viem3.http)(config2.nodeUrl),
      });
      this.logger.logToOutput(
        `Deploy started: ${config2.contractName} | Args: ${JSON.stringify(config2.constructorArgs)} | Deployer: ${config2.msgSender}`
      );
      const hash = await walletClient.deployContract({
        abi: config2.abi,
        account: config2.msgSender,
        args: config2.constructorArgs,
        bytecode: config2.bytecode,
        chain,
      });
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });
      const logs = await this.publicClient.getContractEvents({
        abi: config2.abi,
        address: receipt.contractAddress,
        fromBlock: 'earliest',
      });
      this.logger.logToOutput(
        `Deploy ${receipt.status}: ${config2.contractName} -> ${receipt.contractAddress} | Tx: ${hash} | Gas used: ${receipt.gasUsed.toString()} | Events: ${logs.length}`
      );
      return {
        hash,
        address: receipt.contractAddress,
        success: receipt.status === 'success',
        nodeUrl: config2.nodeUrl,
        contractName: config2.contractName,
        logs: safeStringify(logs),
      };
    } catch (error) {
      this.logger.logToOutput(
        `Deploy failed: ${config2.contractName} | Args: ${JSON.stringify(config2.constructorArgs)} | Deployer: ${config2.msgSender} | Error: ${error.stack}`
      );
      return {
        hash: '',
        address: '',
        success: false,
        nodeUrl: config2.nodeUrl,
        contractName: config2.contractName,
        logs: JSON.stringify([]),
      };
    }
  }
  async getContractEvents(callInfo) {
    try {
      const logs = await this.publicClient.getContractEvents({
        address: callInfo.contractAddress,
        abi: callInfo.abi,
        fromBlock: 'earliest',
      });
      this.logger.logToOutput(
        `Events retrieved: ${logs.length} events from ${callInfo.contractAddress} | Function: ${callInfo.functionName}`
      );
      return {
        logs: safeStringify(logs),
        hash: '',
        functionName: callInfo.functionName,
        params: callInfo.params,
        timestamp: Date.now().toString(),
        status: true,
        error: '',
        result: '',
        caller: callInfo.caller,
        address: callInfo.contractAddress,
      };
    } catch (error) {
      this.logger.logToOutput(
        `Events fetch failed: ${callInfo.contractAddress} | Function: ${callInfo.functionName} | Error: ${error.stack}`
      );
      return {
        logs: JSON.stringify([]),
        hash: '',
        functionName: callInfo.functionName,
        params: callInfo.params,
        timestamp: Date.now().toString(),
        status: false,
        error: `Unable to make contract call due to error: ${error.toString()}`,
        result: '',
        caller: callInfo.caller,
        address: callInfo.contractAddress,
      };
    }
  }
  async transfer(info) {
    try {
      const chainId = await this.publicClient.getChainId();
      const walletClient = (0, import_viem3.createWalletClient)({
        chain: this.createChain(info.nodeUrl, chainId),
        transport: (0, import_viem3.http)(info.nodeUrl),
      });
      this.logger.logToOutput(
        `Transferring ${info.amount} ETH to ${info.to} from ${info.from}`
      );
      const hash = await walletClient.sendTransaction({
        account: info.from,
        to: info.to,
        value: (0, import_viem3.parseEther)(info.amount.toString()),
      });
      const [receipt, balanceFrom, balanceTo] = await Promise.all([
        this.publicClient.waitForTransactionReceipt({
          hash,
        }),
        this.publicClient.getBalance({
          address: info.from,
        }),
        this.publicClient.getBalance({
          address: info.to,
        }),
      ]);
      this.logger.logToOutput(
        `Transferred ${info.amount} ETH to ${info.to} from ${info.from} transaction hash: ${hash} new balance From: ${(0, import_viem3.formatEther)(balanceFrom)} new balance To ${(0, import_viem3.formatEther)(balanceTo)}`
      );
      return {
        success: receipt.status === 'success',
        hash,
        error: receipt.status,
      };
    } catch (error) {
      const err = error;
      this.logger.logToOutput(
        `Error Transferring ${info.amount} ETH to ${info.to} from ${info.from} error ${err.stack}`
      );
      return {
        success: false,
        hash: '',
        error: err.message,
      };
    }
  }
};

// ../providers/logProvider.ts
var vscode13 = __toESM(require('vscode'));
var CockPitLogProvider = class {
  constructor() {
    __publicField(this, 'outputChannel');
    __publicField(this, 'buildStatusBar');
    this.outputChannel =
      vscode13.window.createOutputChannel('Forge Cockpit Logs');
    this.buildStatusBar = vscode13.window.createStatusBarItem(
      vscode13.StatusBarAlignment.Left,
      100
    );
    this.buildStatusBar.name = 'Forge cockpit Build Status';
    this.buildStatusBar.command = 'forge-cockpit.showBuildOutput';
    this.buildStatusBar.tooltip =
      'Forge cockpit Build Status - Click to show output';
    this.buildStatusBar.hide();
    this.showBuildOutput();
  }
  showBuildOutput() {
    this.outputChannel.show();
  }
  logToOutput(message) {
    const timestamp = /* @__PURE__ */ new Date().toLocaleTimeString();
    this.outputChannel.appendLine(`[${timestamp}] Forge cockpit ${message}`);
  }
  dispose() {
    if (this.outputChannel) {
      this.outputChannel.dispose();
    }
    if (this.buildStatusBar) {
      this.buildStatusBar.dispose();
    }
  }
  updateStatusBar(message, theme) {
    this.buildStatusBar.hide();
    this.buildStatusBar.text = message;
    this.buildStatusBar.backgroundColor =
      theme != null
        ? theme
        : new vscode13.ThemeColor('statusBarItem.successBackground');
  }
};

// ../extension.ts
dotenv.config({ path: path5.join(__dirname, '..', '.env') });
async function activate(context) {
  const logger = new CockPitLogProvider();
  const foundryProjectController = new FoundryProjectController(logger);
  await foundryProjectController.initialize();
  if (foundryProjectController.isFoundry()) {
    const testParserProvider = new TestParserProvider(
      foundryProjectController.getConfig(),
      logger
    );
    const abiProvider = new AbiProvider(foundryProjectController, logger);
    abiProvider.initialize();
    await testParserProvider.initialize();
    const testingProvider = new ForgeTestProvider(
      testParserProvider.contracts,
      testParserProvider.onDidChangeContracts,
      foundryProjectController,
      logger
    );
    const hoverProvider = new TestHoverProvider(foundryProjectController);
    const codeLensProvider = new TestCodeLensProvider(foundryProjectController);
    const decorationProvider = new TestDecorationProvider();
    const actionsProvider = new CockPitActionsProvider();
    const actionsTreeView = vscode14.window.createTreeView(
      'forgeCockpitActions',
      {
        treeDataProvider: actionsProvider,
        showCollapseAll: false,
      }
    );
    context.subscriptions.push(
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.StubForgeTestsCommand,
        async contract => {
          var _a;
          const contractName = contract.fileName.replace(/\.sol$/, '');
          const abi =
            (_a = abiProvider.abis.find(
              a => a.fileName === contract.fileName
            )) == null
              ? void 0
              : _a.abi;
          if (!abi) {
            vscode14.window.showErrorMessage(
              `ABI not found for ${abiProvider.abis.length} ABIs`
            );
            return;
          }
          const stubTestProvider = new StubTestProvider(
            contractName,
            abi,
            logger
          );
          await stubTestProvider.generateTestFile(contract.filePath);
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.ShowForgeCockPitCommand,
        () => {
          initWebView(context);
          vscode14.commands.executeCommand(
            ForgeCockpitCommand.PinEditorCommand
          );
          vscode14.commands.executeCommand(
            ForgeCockpitCommand.LoadCockPitWalletsCommand
          );
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.RebuildProjectCommand,
        () => {
          foundryProjectController.triggerBuild();
        }
      ),
      vscode14.languages.registerCodeLensProvider(
        { language: 'solidity', pattern: '**/*.sol' },
        codeLensProvider
      ),
      vscode14.languages.registerHoverProvider(
        { language: 'solidity', pattern: '**/*.sol' },
        hoverProvider
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.RunTestCommand,
        contract => {
          testingProvider.runTest(contract);
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.RunTestViaIRCommand,
        contract => {
          testingProvider.runTestViaIR(contract);
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.RunGroupCommand,
        path6 => {
          testingProvider.runGroup(path6);
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.RefreshTestsCommand,
        async () => {
          await testingProvider.refreshTests();
          ForgeCockPitPanel.sendContracts(abiProvider.abis);
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.ForkNodeCommand,
        async forkDetails => {
          const [node, cachedNodes] = await Promise.all([
            foundryProjectController.forkNode(forkDetails),
            context.globalState.get(ACTIVE_NODE_KEY),
          ]);
          if (node.success) {
            const newNodeUrl = `http://localhost:${node.port}`;
            const existingNodes = Array.isArray(cachedNodes) ? cachedNodes : [];
            const updatedNodes = [...existingNodes, newNodeUrl];
            await context.globalState.update(ACTIVE_NODE_KEY, updatedNodes);
          }
          return node;
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.WalletBalancesCommand,
        async info => {
          const walletProvider = new WalletProvider(info.nodeUrl, logger);
          return await walletProvider.getBalances(info.wallets);
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.LoadCockPitWalletsCommand,
        async () => {
          const wallets = await foundryProjectController.loadWallets();
          ForgeCockPitPanel.sendDefaultWallets(
            WebviewCommand.LoadCockpitWallets,
            wallets
          );
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.ExecuteFunctionCommand,
        async callInfo => {
          var _a;
          const walletProvider = new WalletProvider(callInfo.nodeUrl, logger);
          const abi =
            (_a = abiProvider.abis.find(
              a => a.fileName === callInfo.contractAddress
            )) == null
              ? void 0
              : _a.abi;
          return await walletProvider.executeFunction({
            ...callInfo,
            abi: abi != null ? abi : callInfo.abi,
          });
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.StopNodeCommand,
        async port => {
          const success = await foundryProjectController.stopForkNode(port);
          const cachedNodes = context.globalState.get(ACTIVE_NODE_KEY);
          if (success && cachedNodes) {
            const newNodes =
              cachedNodes == null
                ? void 0
                : cachedNodes.filter(url => !url.includes(port));
            await context.globalState.update(ACTIVE_NODE_KEY, newNodes);
            ForgeCockPitPanel.sendActiveNodes(
              WebviewCommand.GetActiveNodesCommand
            );
          }
          return success;
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.DeployContractCommand,
        async config2 => {
          const walletProvider = new WalletProvider(config2.nodeUrl, logger);
          return await walletProvider.deployContract(config2);
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.TransferCommand,
        async info => {
          const walletProvider = new WalletProvider(info.nodeUrl, logger);
          return await walletProvider.transfer(info);
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.GetActiveNodesCommand,
        async () => {
          const nodes = await foundryProjectController.getActiveNodes();
          const cachedNodes = await context.globalState.get(ACTIVE_NODE_KEY);
          const anvilNodeChecks = await Promise.all(
            cachedNodes.map(async nodeUrl => {
              const walletProvider = new WalletProvider(nodeUrl, logger);
              const isAnvil = await walletProvider.isAnvilNode();
              return isAnvil ? nodeUrl.split(':')[2] : null;
            })
          );
          const anvilNodes = anvilNodeChecks.filter(
            nodeUrl => nodeUrl !== null
          );
          const allNodes = [
            .../* @__PURE__ */ new Set([...nodes, ...anvilNodes]),
          ];
          logger.logToOutput(`Found ${allNodes} anvil cached nodes`);
          return allNodes;
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.ShowBuildOutputCommand,
        () => {
          logger.showBuildOutput();
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.OpenUrlCommand,
        url => {
          vscode14.commands.executeCommand(
            ForgeCockpitCommand.VsOpenUrlCommand,
            vscode14.Uri.parse(url)
          );
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.ClearCacheCommand,
        async () => {
          const cachedNodes = context.globalState.get(ACTIVE_NODE_KEY);
          if (cachedNodes) {
            await Promise.all([
              cachedNodes.map(nodeUrl => {
                const port = nodeUrl.split(':')[2];
                return vscode14.commands.executeCommand(
                  ForgeCockpitCommand.StopNodeCommand,
                  port
                );
              }),
            ]);
          }
          await context.globalState.update(ACTIVE_NODE_KEY, []);
          ForgeCockPitPanel.sendActiveNodes(
            WebviewCommand.GetActiveNodesCommand
          );
          logger.logToOutput('Cleared Cache');
        }
      ),
      vscode14.commands.registerCommand(
        ForgeCockpitCommand.RunScriptCommand,
        async config2 => {
          const walletProvider = new WalletProvider(config2.nodeUrl, logger);
          const chainId = await walletProvider.chainId();
          const contract = abiProvider.abis.find(
            contract2 => contract2.fileName === config2.contractName
          );
          if (!contract) {
            return {
              success: false,
              contracts: [
                {
                  contractName: config2.contractName,
                  address: '',
                  success: false,
                  hash: '',
                  nodeUrl: config2.nodeUrl,
                  logs: void 0,
                },
              ],
              scriptName: config2.contractName,
            };
          }
          return await foundryProjectController.runScript({
            ...config2,
            chainId,
            scriptName: contract.solFileName,
          });
        }
      )
    );
    context.subscriptions.push(
      actionsTreeView,
      { dispose: () => decorationProvider.dispose() },
      { dispose: () => testParserProvider.dispose() },
      { dispose: () => testingProvider.dispose() }
    );
    vscode14.window.showInformationMessage(`Forge Cockpit activated!`);
  }
  function initWebView(context2) {
    ForgeCockPitPanel.render(context2);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    activate,
  });
//# sourceMappingURL=extension.js.map
