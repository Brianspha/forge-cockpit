import { AbiValidationResponse, Output } from '../types';

export const validSolidityTypes: string[] = [
  'address',
  'bool',
  'string',
  'bytes',
  'uint',
  'uint8',
  'uint16',
  'uint32',
  'uint64',
  'uint128',
  'uint256',
  'int',
  'int8',
  'int16',
  'int32',
  'int64',
  'int128',
  'int256',
  'bytes1',
  'bytes2',
  'bytes3',
  'bytes4',
  'bytes5',
  'bytes6',
  'bytes7',
  'bytes8',
  'bytes9',
  'bytes10',
  'bytes11',
  'bytes12',
  'bytes13',
  'bytes14',
  'bytes15',
  'bytes16',
  'bytes17',
  'bytes18',
  'bytes19',
  'bytes20',
  'bytes21',
  'bytes22',
  'bytes23',
  'bytes24',
  'bytes25',
  'bytes26',
  'bytes27',
  'bytes28',
  'bytes29',
  'bytes30',
  'bytes31',
  'bytes32',
];

export function isValidAddress(address: string): boolean {
  const regExpression = /^(?:0x)?[0-9a-fA-F]{40}$/;
  return regExpression.test(address);
}

export function isValidPort(port: number): boolean {
  return port >= 1024 && port <= 65535;
}

export function validateAbiString(abiString: string): AbiValidationResponse {
  try {
    if (!abiString.trim()) {
      return { success: false, error: '' } as AbiValidationResponse;
    }

    let parsed;
    try {
      parsed = JSON.parse(abiString);
    } catch (err) {
      return {
        success: false,
        error: 'Invalid JSON format',
      } as AbiValidationResponse;
    }

    if (!Array.isArray(parsed)) {
      return {
        success: false,
        error: 'ABI must be a JSON array',
      } as AbiValidationResponse;
    }

    const hasFunctions = parsed.some(
      item =>
        typeof item === 'object' &&
        item !== null &&
        'type' in item &&
        item.type === 'function' &&
        'name' in item &&
        'inputs' in item &&
        Array.isArray(item.inputs)
    );

    if (!hasFunctions) {
      return {
        success: false,
        error: 'ABI appears to be invalid or empty - no functions found',
      };
    }

    return { success: true, error: '' } as AbiValidationResponse;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      error: `Error validating ABI: ${errorMessage}`,
    } as AbiValidationResponse;
  }
}

export function readAbiFile(file: File, callback: (result: any) => void): void {
  const reader = new FileReader();

  reader.onload = e => {
    try {
      const content = e.target?.result as string;
      let parsedContent = JSON.parse(content);

      let abiData, abiText;

      if (Array.isArray(parsedContent)) {
        abiData = parsedContent;
        abiText = content;
      } else if (parsedContent?.abi && Array.isArray(parsedContent.abi)) {
        abiData = parsedContent.abi;
        abiText = JSON.stringify(parsedContent.abi, null, 2);
      } else if (
        parsedContent?.output?.abi &&
        Array.isArray(parsedContent.output.abi)
      ) {
        abiData = parsedContent.output.abi;
        abiText = JSON.stringify(parsedContent.output.abi, null, 2);
      } else {
        callback({ error: 'No valid ABI found in the uploaded file' });
        return;
      }

      callback({ abiData, abiText, file });
    } catch (err) {
      callback({ error: 'Invalid JSON format or file read error' });
    }
  };

  reader.readAsText(file);
}

export function isNodeUrl(url: string): boolean {
  const regExpression = /^(https?|wss):\/\/[^\s/$.?#].[^\s]*$/;
  return regExpression.test(url);
}

export function buildFullFunctionSignature(
  functionName: string,
  inputs: Array<Output>,
  outputs: Array<Output>
): string {
  const inputTypes = inputs.map(input => input.type).join(',');
  const outputTypes = outputs.map(output => output.type).join(',');
  let signature = `${functionName}(${inputTypes})`;
  if (outputs.length > 0) {
    signature += `(${outputTypes})`;
  }
  return signature;
}

export const getContractId = (fileName: string) => fileName;

export function safeStringify(obj: any): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() + 'n' : value
  );
}
export function safeParse(json: string): any {
  return JSON.parse(json, (_key, value) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
      return BigInt(value.slice(0, -1));
    }
    return value;
  });
}

export const getPlaceholderForType = (type: string): string => {
  const cleanType = type.toLowerCase().trim();

  if (cleanType.startsWith('tuple')) {
    return cleanType.includes('[]')
      ? '[["0x0000000000000000000000000000000000000000", "0"], ["0x1111111111111111111111111111111111111111", "100"]]'
      : '["0x0000000000000000000000000000000000000000", "0"]';
  }

  if (cleanType.includes('address')) {
    return cleanType.includes('[]')
      ? '["0x0000000000000000000000000000000000000000", "0x1111111111111111111111111111111111111111"]'
      : '0x0000000000000000000000000000000000000000';
  }

  if (cleanType.includes('uint') || cleanType.includes('int')) {
    return cleanType.includes('[]') ? '[0, 100, 1000]' : '0';
  }

  if (cleanType.includes('bool')) {
    return cleanType.includes('[]') ? '[true, false, true]' : 'true';
  }

  if (cleanType.includes('bytes32')) {
    return cleanType.includes('[]')
      ? '["0x0000000000000000000000000000000000000000000000000000000000000000", "0x1111111111111111111111111111111111111111111111111111111111111111"]'
      : '0x0000000000000000000000000000000000000000000000000000000000000000';
  }

  if (cleanType.includes('bytes')) {
    return cleanType.includes('[]') ? '["0x00", "0x1234"]' : '0x00';
  }

  if (cleanType.includes('string')) {
    return cleanType.includes('[]') ? '["hello", "world"]' : 'hello world';
  }

  return cleanType.includes('[]') ? '[]' : '';
};

export const getDefaultValueForType = (type: string): string => {
  const cleanType = type.toLowerCase().trim();

  if (cleanType.startsWith('tuple')) {
    return cleanType.includes('[]')
      ? '[]'
      : '["0x0000000000000000000000000000000000000000", "0"]';
  }

  if (cleanType.includes('address')) {
    return cleanType.includes('[]')
      ? '[]'
      : '0x0000000000000000000000000000000000000000';
  }

  if (cleanType.includes('uint') || cleanType.includes('int')) {
    return cleanType.includes('[]') ? '[]' : '0';
  }

  if (cleanType.includes('bool')) {
    return cleanType.includes('[]') ? '[]' : 'false';
  }

  if (cleanType.includes('bytes32')) {
    return cleanType.includes('[]')
      ? '[]'
      : '0x0000000000000000000000000000000000000000000000000000000000000000';
  }

  if (cleanType.includes('bytes')) {
    return cleanType.includes('[]') ? '[]' : '0x00';
  }

  if (cleanType.includes('string')) {
    return cleanType.includes('[]') ? '[]' : '';
  }

  return cleanType.includes('[]') ? '[]' : '';
};
export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};
export const validateTypeValue = (
  type: string,
  value: string
): { valid: boolean; error?: string } => {
  const cleanType = type.toLowerCase().trim();

  if (!value.trim()) {
    return { valid: true };
  }

  try {
    if (cleanType.includes('[]')) {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        return { valid: false, error: 'Array type requires JSON array format' };
      }

      const elementType = cleanType.replace('[]', '');
      for (const item of parsed) {
        const itemValidation = validateTypeValue(elementType, String(item));
        if (!itemValidation.valid) {
          return {
            valid: false,
            error: `Array element: ${itemValidation.error}`,
          };
        }
      }
      return { valid: true };
    }

    if (cleanType.includes('address')) {
      if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
        return {
          valid: false,
          error:
            'Invalid address format (must be 0x followed by 40 hex characters)',
        };
      }
    }

    if (cleanType.includes('uint') || cleanType.includes('int')) {
      const num = Number(value);
      if (isNaN(num) || !Number.isInteger(num)) {
        return { valid: false, error: 'Invalid integer value' };
      }
      if (cleanType.includes('uint') && num < 0) {
        return { valid: false, error: 'Unsigned integer cannot be negative' };
      }
    }

    if (cleanType.includes('bool')) {
      if (!['true', 'false'].includes(value.toLowerCase())) {
        return { valid: false, error: 'Boolean value must be true or false' };
      }
    }

    if (cleanType.includes('bytes')) {
      if (!/^0x[a-fA-F0-9]*$/.test(value)) {
        return {
          valid: false,
          error: 'Invalid bytes format (must be 0x followed by hex characters)',
        };
      }
      if (cleanType.match(/bytes(\d+)/)) {
        const size = parseInt(cleanType.match(/bytes(\d+)/)![1]);
        const expectedLength = size * 2 + 2;
        if (value.length !== expectedLength) {
          return {
            valid: false,
            error: `bytes${size} must be exactly ${size} bytes (${expectedLength} characters including 0x)`,
          };
        }
      }
    }

    if (cleanType.startsWith('tuple')) {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          return { valid: false, error: 'Tuple must be a JSON array' };
        }
      } catch {
        return {
          valid: false,
          error: 'Invalid tuple format (must be valid JSON array)',
        };
      }
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid JSON format' };
  }
};

export const transformInputValue = (type: string, value: string): any => {
  const cleanType = type.toLowerCase().trim();

  if (!value.trim()) {
    return cleanType.includes('[]')
      ? []
      : cleanType.includes('bool')
        ? false
        : cleanType.includes('uint') || cleanType.includes('int')
          ? 0
          : '';
  }

  if (cleanType.includes('[]')) {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (cleanType.includes('int')) {
    return Number(value) || 0;
  }

  if (cleanType.includes('bool')) {
    return value.toLowerCase() === 'true';
  }

  if (cleanType.startsWith('tuple')) {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  return value;
};
export const WebviewCommand = {
  TransferCommand: 'transfer',
  AbiEncodeCommand: 'abiEncode',
  LoadCockpitWallets: 'loadWallets',
  OpenLinkCommand: 'openLink',
  GetActiveNodesCommand: 'getActiveNodes',
  StopNodeCommand: 'stopNode',
  DeployContractCommand: 'deployContract',
  WalletBalancesCommand: 'walletBalances',
  ExecuteFunctionCommand: 'executeFunction',
  ReadClipboardCommand: 'readClipboard',
  ReadClipboardWalletCommand: 'readClipboard:wallet',
  ReadClipboardDeploymentCommand: 'readClipboard:deployment',
  ReadClipboardAnvilCommand: 'readClipboard:anvil',
  ReadClipboardConstructorArgsCommand: 'readClipboard:constructorArgs',
  ReadClipboardFunctionInputCommand: 'readClipboard:functionInput',
  WriteClipboardCommand: 'writeClipboard',
  ShutDownAnvilInstanceCommand: 'shutDownAnvilInstance',
  RefreshContractsCommand: 'refreshContracts',
  LoadContractsCommand: 'loadContracts',
  ForkNodeCommand: 'forkNode',
  RunScriptCommand: 'runScript',
  TokenInfoCommand: 'tokenInfo',
} as const;

export const ForgeCockPitResponseCommand = {
  AbiEncodeResponse: 'abiEncodeResponse',
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
  TransferResponse: 'transferResponse',
  TokenInfoResponse: 'tokenInfoResponse',
} as const;

export const ClipboardTypeCommand = {
  ReadClipboardEncoderCommand: 'readClipboardEncoder',
  ReadWalletImportCommand: 'readClipboard:walletImport',
  ReadTransferCommand: 'readClipboard:transfer',
  ReadClipboardAnvilCommand: 'readClipboard:anvil',
  ReadClipboardConstructorArgsCommand: 'readClipboard:constructorArgs',
  ReadClipboardFunctionInputCommand: 'readClipboard:functionInput',
  ReadClipboardWalletCommand: 'readClipboard:wallet',
  ReadAbiCommand: 'abiForm',
  ReadContractAddressCommand: 'contractAddress',
  ReadNodeUrlCommand: 'nodeUrl',
  ReadPortCommand: 'port',
  ReadClipboard: 'readClipboard',
} as const;
