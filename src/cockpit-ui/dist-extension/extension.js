'use strict';
var Or = require('crypto'),
  K = require('vscode'),
  Tt = require('path'),
  Is = require('fs'),
  Oi = require('child_process'),
  Y0 = require('net');
function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get: function () {
                  return e[k];
                },
              }
        );
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}
var Or__namespace = /*#__PURE__*/ _interopNamespace(Or);
var K__namespace = /*#__PURE__*/ _interopNamespace(K);
var Tt__namespace = /*#__PURE__*/ _interopNamespace(Tt);
var Is__namespace = /*#__PURE__*/ _interopNamespace(Is);
var Oi__namespace = /*#__PURE__*/ _interopNamespace(Oi);
var Y0__namespace = /*#__PURE__*/ _interopNamespace(Y0);
var vb = Object.create;
var Hi = Object.defineProperty;
var Tb = Object.getOwnPropertyDescriptor;
var Eb = Object.getOwnPropertyNames;
var Cb = Object.getPrototypeOf,
  Ab = Object.prototype.hasOwnProperty;
var Pb = (t, e, r) =>
  e in t
    ? Hi(t, e, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: r,
      })
    : (t[e] = r);
var Ls = (t =>
  typeof require != 'undefined'
    ? require
    : typeof Proxy != 'undefined'
      ? new Proxy(t, {
          get: (e, r) => (typeof require != 'undefined' ? require : e)[r],
        })
      : t)(function (t) {
  if (typeof require != 'undefined') return require.apply(this, arguments);
  throw Error('Dynamic require of "' + t + '" is not supported');
});
var D = (t, e) => () => (t && (e = t((t = 0))), e);
var zs = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
  qf = (t, e) => {
    for (var r in e) Hi(t, r, { get: e[r], enumerable: true });
  },
  kb = (t, e, r, n) => {
    if ((e && typeof e == 'object') || typeof e == 'function')
      for (let s of Eb(e))
        !Ab.call(t, s) &&
          s !== r &&
          Hi(t, s, {
            get: () => e[s],
            enumerable: !(n = Tb(e, s)) || n.enumerable,
          });
    return t;
  };
var Vf = (t, e, r) => (
  (r = t != null ? vb(Cb(t)) : {}),
  kb(
    !t || !t.__esModule ? Hi(r, 'default', { value: t, enumerable: true }) : r,
    t
  )
);
var Q = (t, e, r) => Pb(t, typeof e != 'symbol' ? e + '' : e, r);
var f = D(() => {});
var Gf = zs((K1, $b) => {
  $b.exports = {
    name: 'dotenv',
    version: '16.5.0',
    description: 'Loads environment variables from .env file',
    main: 'lib/main.js',
    types: 'lib/main.d.ts',
    exports: {
      '.': {
        types: './lib/main.d.ts',
        require: './lib/main.js',
        default: './lib/main.js',
      },
      './config': './config.js',
      './config.js': './config.js',
      './lib/env-options': './lib/env-options.js',
      './lib/env-options.js': './lib/env-options.js',
      './lib/cli-options': './lib/cli-options.js',
      './lib/cli-options.js': './lib/cli-options.js',
      './package.json': './package.json',
    },
    scripts: {
      'dts-check': 'tsc --project tests/types/tsconfig.json',
      lint: 'standard',
      pretest: 'npm run lint && npm run dts-check',
      test: 'tap run --allow-empty-coverage --disable-coverage --timeout=60000',
      'test:coverage':
        'tap run --show-full-coverage --timeout=60000 --coverage-report=lcov',
      prerelease: 'npm test',
      release: 'standard-version',
    },
    repository: { type: 'git', url: 'git://github.com/motdotla/dotenv.git' },
    homepage: 'https://github.com/motdotla/dotenv#readme',
    funding: 'https://dotenvx.com',
    keywords: [
      'dotenv',
      'env',
      '.env',
      'environment',
      'variables',
      'config',
      'settings',
    ],
    readmeFilename: 'README.md',
    license: 'BSD-2-Clause',
    devDependencies: {
      '@types/node': '^18.11.3',
      decache: '^4.6.2',
      sinon: '^14.0.1',
      standard: '^17.0.0',
      'standard-version': '^9.5.0',
      tap: '^19.2.0',
      typescript: '^4.8.4',
    },
    engines: { node: '>=12' },
    browser: { fs: false },
  };
});
var Yf = zs((J1, Ir) => {
  f();
  var ld = Ls('fs'),
    fd = Ls('path'),
    Bb = Ls('os'),
    Ib = Ls('crypto'),
    Sb = Gf(),
    Zf = Sb.version,
    Rb =
      /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
  function Nb(t) {
    let e = {},
      r = t.toString();
    r = r.replace(
      /\r\n?/gm,
      `
`
    );
    let n;
    for (; (n = Rb.exec(r)) != null; ) {
      let s = n[1],
        o = n[2] || '';
      o = o.trim();
      let i = o[0];
      (o = o.replace(/^(['"`])([\s\S]*)\1$/gm, '$2')),
        i === '"' &&
          ((o = o.replace(
            /\\n/g,
            `
`
          )),
          (o = o.replace(/\\r/g, '\r'))),
        (e[s] = o);
    }
    return e;
  }
  function Fb(t) {
    let e = Jf(t),
      r = _e.configDotenv({ path: e });
    if (!r.parsed) {
      let i = new Error(
        `MISSING_DATA: Cannot parse ${e} for an unknown reason`
      );
      throw ((i.code = 'MISSING_DATA'), i);
    }
    let n = Kf(t).split(','),
      s = n.length,
      o;
    for (let i = 0; i < s; i++)
      try {
        let c = n[i].trim(),
          d = Db(r, c);
        o = _e.decrypt(d.ciphertext, d.key);
        break;
      } catch (c) {
        if (i + 1 >= s) throw c;
      }
    return _e.parse(o);
  }
  function Ob(t) {
    console.log(`[dotenv@${Zf}][WARN] ${t}`);
  }
  function _s(t) {
    console.log(`[dotenv@${Zf}][DEBUG] ${t}`);
  }
  function Kf(t) {
    return t && t.DOTENV_KEY && t.DOTENV_KEY.length > 0
      ? t.DOTENV_KEY
      : process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0
        ? process.env.DOTENV_KEY
        : '';
  }
  function Db(t, e) {
    let r;
    try {
      r = new URL(e);
    } catch (c) {
      if (c.code === 'ERR_INVALID_URL') {
        let d = new Error(
          'INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development'
        );
        throw ((d.code = 'INVALID_DOTENV_KEY'), d);
      }
      throw c;
    }
    let n = r.password;
    if (!n) {
      let c = new Error('INVALID_DOTENV_KEY: Missing key part');
      throw ((c.code = 'INVALID_DOTENV_KEY'), c);
    }
    let s = r.searchParams.get('environment');
    if (!s) {
      let c = new Error('INVALID_DOTENV_KEY: Missing environment part');
      throw ((c.code = 'INVALID_DOTENV_KEY'), c);
    }
    let o = `DOTENV_VAULT_${s.toUpperCase()}`,
      i = t.parsed[o];
    if (!i) {
      let c = new Error(
        `NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${o} in your .env.vault file.`
      );
      throw ((c.code = 'NOT_FOUND_DOTENV_ENVIRONMENT'), c);
    }
    return { ciphertext: i, key: n };
  }
  function Jf(t) {
    let e = null;
    if (t && t.path && t.path.length > 0)
      if (Array.isArray(t.path))
        for (let r of t.path)
          ld.existsSync(r) && (e = r.endsWith('.vault') ? r : `${r}.vault`);
      else e = t.path.endsWith('.vault') ? t.path : `${t.path}.vault`;
    else e = fd.resolve(process.cwd(), '.env.vault');
    return ld.existsSync(e) ? e : null;
  }
  function Wf(t) {
    return t[0] === '~' ? fd.join(Bb.homedir(), t.slice(1)) : t;
  }
  function Mb(t) {
    !!(t && t.debug) && _s('Loading env from encrypted .env.vault');
    let r = _e._parseVault(t),
      n = process.env;
    return (
      t && t.processEnv != null && (n = t.processEnv),
      _e.populate(n, r, t),
      { parsed: r }
    );
  }
  function Ub(t) {
    let e = fd.resolve(process.cwd(), '.env'),
      r = 'utf8',
      n = !!(t && t.debug);
    t && t.encoding
      ? (r = t.encoding)
      : n && _s('No encoding is specified. UTF-8 is used by default');
    let s = [e];
    if (t && t.path)
      if (!Array.isArray(t.path)) s = [Wf(t.path)];
      else {
        s = [];
        for (let d of t.path) s.push(Wf(d));
      }
    let o,
      i = {};
    for (let d of s)
      try {
        let p = _e.parse(ld.readFileSync(d, { encoding: r }));
        _e.populate(i, p, t);
      } catch (p) {
        n && _s(`Failed to load ${d} ${p.message}`), (o = p);
      }
    let c = process.env;
    return (
      t && t.processEnv != null && (c = t.processEnv),
      _e.populate(c, i, t),
      o ? { parsed: i, error: o } : { parsed: i }
    );
  }
  function Lb(t) {
    if (Kf(t).length === 0) return _e.configDotenv(t);
    let e = Jf(t);
    return e
      ? _e._configVault(t)
      : (Ob(
          `You set DOTENV_KEY but you are missing a .env.vault file at ${e}. Did you forget to build it?`
        ),
        _e.configDotenv(t));
  }
  function zb(t, e) {
    let r = Buffer.from(e.slice(-64), 'hex'),
      n = Buffer.from(t, 'base64'),
      s = n.subarray(0, 12),
      o = n.subarray(-16);
    n = n.subarray(12, -16);
    try {
      let i = Ib.createDecipheriv('aes-256-gcm', r, s);
      return i.setAuthTag(o), `${i.update(n)}${i.final()}`;
    } catch (i) {
      let c = i instanceof RangeError,
        d = i.message === 'Invalid key length',
        p = i.message === 'Unsupported state or unable to authenticate data';
      if (c || d) {
        let u = new Error(
          'INVALID_DOTENV_KEY: It must be 64 characters long (or more)'
        );
        throw ((u.code = 'INVALID_DOTENV_KEY'), u);
      } else if (p) {
        let u = new Error('DECRYPTION_FAILED: Please check your DOTENV_KEY');
        throw ((u.code = 'DECRYPTION_FAILED'), u);
      } else throw i;
    }
  }
  function _b(t, e, r = {}) {
    let n = !!(r && r.debug),
      s = !!(r && r.override);
    if (typeof e != 'object') {
      let o = new Error(
        'OBJECT_REQUIRED: Please check the processEnv argument being passed to populate'
      );
      throw ((o.code = 'OBJECT_REQUIRED'), o);
    }
    for (let o of Object.keys(e))
      Object.prototype.hasOwnProperty.call(t, o)
        ? (s === true && (t[o] = e[o]),
          n &&
            _s(
              s === true
                ? `"${o}" is already defined and WAS overwritten`
                : `"${o}" is already defined and was NOT overwritten`
            ))
        : (t[o] = e[o]);
  }
  var _e = {
    configDotenv: Ub,
    _configVault: Mb,
    _parseVault: Fb,
    config: Lb,
    decrypt: zb,
    parse: Nb,
    populate: _b,
  };
  Ir.exports.configDotenv = _e.configDotenv;
  Ir.exports._configVault = _e._configVault;
  Ir.exports._parseVault = _e._parseVault;
  Ir.exports.config = _e.config;
  Ir.exports.decrypt = _e.decrypt;
  Ir.exports.parse = _e.parse;
  Ir.exports.populate = _e.populate;
  Ir.exports = _e;
});
var Qf,
  ep = D(() => {
    f();
    Qf = '1.0.8';
  });
var De,
  uo = D(() => {
    f();
    ep();
    De = class t extends Error {
      constructor(e, r = {}) {
        var i;
        let n =
            r.cause instanceof t
              ? r.cause.details
              : (i = r.cause) != null && i.message
                ? r.cause.message
                : r.details,
          s = (r.cause instanceof t && r.cause.docsPath) || r.docsPath,
          o = [
            e || 'An error occurred.',
            '',
            ...(r.metaMessages ? [...r.metaMessages, ''] : []),
            ...(s ? [`Docs: https://abitype.dev${s}`] : []),
            ...(n ? [`Details: ${n}`] : []),
            `Version: abitype@${Qf}`,
          ].join(`
`);
        super(o),
          Object.defineProperty(this, 'details', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          Object.defineProperty(this, 'docsPath', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          Object.defineProperty(this, 'metaMessages', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          Object.defineProperty(this, 'shortMessage', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          Object.defineProperty(this, 'name', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiTypeError',
          }),
          r.cause && (this.cause = r.cause),
          (this.details = n),
          (this.docsPath = s),
          (this.metaMessages = r.metaMessages),
          (this.shortMessage = e);
      }
    };
  });
function $t(t, e) {
  let r = t.exec(e);
  return r == null ? void 0 : r.groups;
}
var pd,
  md,
  qi,
  Hs = D(() => {
    f();
    (pd = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/),
      (md =
        /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/),
      (qi = /^\(.+?\).*?$/);
  });
function Vi(t) {
  var r;
  let e = t.type;
  if (tp.test(t.type) && 'components' in t) {
    e = '(';
    let n = t.components.length;
    for (let o = 0; o < n; o++) {
      let i = t.components[o];
      (e += Vi(i)), o < n - 1 && (e += ', ');
    }
    let s = $t(tp, t.type);
    return (
      (e += `)${(r = s == null ? void 0 : s.array) != null ? r : ''}`),
      Vi({ ...t, type: e })
    );
  }
  return (
    'indexed' in t && t.indexed && (e = `${e} indexed`),
    t.name ? `${e} ${t.name}` : e
  );
}
var tp,
  rp = D(() => {
    f();
    Hs();
    tp = /^tuple(?<array>(\[(\d*)\])*)$/;
  });
function lo(t) {
  let e = '',
    r = t.length;
  for (let n = 0; n < r; n++) {
    let s = t[n];
    (e += Vi(s)), n !== r - 1 && (e += ', ');
  }
  return e;
}
var np = D(() => {
  f();
  rp();
});
function Dn(t) {
  var e;
  return t.type === 'function'
    ? `function ${t.name}(${lo(t.inputs)})${t.stateMutability && t.stateMutability !== 'nonpayable' ? ` ${t.stateMutability}` : ''}${(e = t.outputs) != null && e.length ? ` returns (${lo(t.outputs)})` : ''}`
    : t.type === 'event'
      ? `event ${t.name}(${lo(t.inputs)})`
      : t.type === 'error'
        ? `error ${t.name}(${lo(t.inputs)})`
        : t.type === 'constructor'
          ? `constructor(${lo(t.inputs)})${t.stateMutability === 'payable' ? ' payable' : ''}`
          : t.type === 'fallback'
            ? `fallback() external${t.stateMutability === 'payable' ? ' payable' : ''}`
            : 'receive() external payable';
}
var op = D(() => {
  f();
  np();
});
function ip(t) {
  return sp.test(t);
}
function ap(t) {
  return $t(sp, t);
}
function up(t) {
  return cp.test(t);
}
function dp(t) {
  return $t(cp, t);
}
function fp(t) {
  return lp.test(t);
}
function pp(t) {
  return $t(lp, t);
}
function fo(t) {
  return mp.test(t);
}
function hp(t) {
  return $t(mp, t);
}
function yp(t) {
  return gp.test(t);
}
function bp(t) {
  return $t(gp, t);
}
function wp(t) {
  return xp.test(t);
}
function vp(t) {
  return $t(xp, t);
}
function Tp(t) {
  return Hb.test(t);
}
var sp,
  cp,
  lp,
  mp,
  gp,
  xp,
  Hb,
  Ep,
  Gi,
  js = D(() => {
    f();
    Hs();
    sp = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    cp = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    lp =
      /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
    mp = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
    gp =
      /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
    xp = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
    Hb = /^receive\(\) external payable$/;
    (Ep = new Set(['indexed'])),
      (Gi = new Set(['calldata', 'memory', 'storage']));
  });
var Wi,
  Zi,
  Ki,
  Ji = D(() => {
    f();
    uo();
    (Wi = class extends De {
      constructor({ signature: e }) {
        super('Failed to parse ABI item.', {
          details: `parseAbiItem(${JSON.stringify(e, null, 2)})`,
          docsPath: '/api/human#parseabiitem-1',
        }),
          Object.defineProperty(this, 'name', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidAbiItemError',
          });
      }
    }),
      (Zi = class extends De {
        constructor({ type: e }) {
          super('Unknown type.', {
            metaMessages: [
              `Type "${e}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`,
            ],
          }),
            Object.defineProperty(this, 'name', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 'UnknownTypeError',
            });
        }
      }),
      (Ki = class extends De {
        constructor({ type: e }) {
          super('Unknown type.', {
            metaMessages: [`Type "${e}" is not a valid ABI type.`],
          }),
            Object.defineProperty(this, 'name', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 'UnknownSolidityTypeError',
            });
        }
      });
  });
var Yi,
  Xi,
  Qi,
  ea,
  ta,
  hd = D(() => {
    f();
    uo();
    (Yi = class extends De {
      constructor({ param: e }) {
        super('Invalid ABI parameter.', { details: e }),
          Object.defineProperty(this, 'name', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidParameterError',
          });
      }
    }),
      (Xi = class extends De {
        constructor({ param: e, name: r }) {
          super('Invalid ABI parameter.', {
            details: e,
            metaMessages: [
              `"${r}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`,
            ],
          }),
            Object.defineProperty(this, 'name', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 'SolidityProtectedKeywordError',
            });
        }
      }),
      (Qi = class extends De {
        constructor({ param: e, type: r, modifier: n }) {
          super('Invalid ABI parameter.', {
            details: e,
            metaMessages: [
              `Modifier "${n}" not allowed${r ? ` in "${r}" type` : ''}.`,
            ],
          }),
            Object.defineProperty(this, 'name', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 'InvalidModifierError',
            });
        }
      }),
      (ea = class extends De {
        constructor({ param: e, type: r, modifier: n }) {
          super('Invalid ABI parameter.', {
            details: e,
            metaMessages: [
              `Modifier "${n}" not allowed${r ? ` in "${r}" type` : ''}.`,
              `Data location can only be specified for array, struct, or mapping types, but "${n}" was given.`,
            ],
          }),
            Object.defineProperty(this, 'name', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 'InvalidFunctionModifierError',
            });
        }
      }),
      (ta = class extends De {
        constructor({ abiParameter: e }) {
          super('Invalid ABI parameter.', {
            details: JSON.stringify(e, null, 2),
            metaMessages: ['ABI parameter type is invalid.'],
          }),
            Object.defineProperty(this, 'name', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 'InvalidAbiTypeParameterError',
            });
        }
      });
  });
var ur,
  ra,
  na,
  gd = D(() => {
    f();
    uo();
    (ur = class extends De {
      constructor({ signature: e, type: r }) {
        super(`Invalid ${r} signature.`, { details: e }),
          Object.defineProperty(this, 'name', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidSignatureError',
          });
      }
    }),
      (ra = class extends De {
        constructor({ signature: e }) {
          super('Unknown signature.', { details: e }),
            Object.defineProperty(this, 'name', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 'UnknownSignatureError',
            });
        }
      }),
      (na = class extends De {
        constructor({ signature: e }) {
          super('Invalid struct signature.', {
            details: e,
            metaMessages: ['No properties exist.'],
          }),
            Object.defineProperty(this, 'name', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 'InvalidStructSignatureError',
            });
        }
      });
  });
var oa,
  Cp = D(() => {
    f();
    uo();
    oa = class extends De {
      constructor({ type: e }) {
        super('Circular reference detected.', {
          metaMessages: [`Struct "${e}" is a circular reference.`],
        }),
          Object.defineProperty(this, 'name', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CircularReferenceError',
          });
      }
    };
  });
var sa,
  Ap = D(() => {
    f();
    uo();
    sa = class extends De {
      constructor({ current: e, depth: r }) {
        super('Unbalanced parentheses.', {
          metaMessages: [
            `"${e.trim()}" has too many ${r > 0 ? 'opening' : 'closing'} parentheses.`,
          ],
          details: `Depth "${r}"`,
        }),
          Object.defineProperty(this, 'name', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InvalidParenthesisError',
          });
      }
    };
  });
function Pp(t, e, r) {
  let n = '';
  if (r)
    for (let s of Object.entries(r)) {
      if (!s) continue;
      let o = '';
      for (let i of s[1]) o += `[${i.type}${i.name ? `:${i.name}` : ''}]`;
      n += `(${s[0]}{${o}})`;
    }
  return e ? `${e}:${t}${n}` : t;
}
var ia,
  kp = D(() => {
    f();
    ia = new Map([
      ['address', { type: 'address' }],
      ['bool', { type: 'bool' }],
      ['bytes', { type: 'bytes' }],
      ['bytes32', { type: 'bytes32' }],
      ['int', { type: 'int256' }],
      ['int256', { type: 'int256' }],
      ['string', { type: 'string' }],
      ['uint', { type: 'uint256' }],
      ['uint8', { type: 'uint8' }],
      ['uint16', { type: 'uint16' }],
      ['uint24', { type: 'uint24' }],
      ['uint32', { type: 'uint32' }],
      ['uint64', { type: 'uint64' }],
      ['uint96', { type: 'uint96' }],
      ['uint112', { type: 'uint112' }],
      ['uint160', { type: 'uint160' }],
      ['uint192', { type: 'uint192' }],
      ['uint256', { type: 'uint256' }],
      ['address owner', { type: 'address', name: 'owner' }],
      ['address to', { type: 'address', name: 'to' }],
      ['bool approved', { type: 'bool', name: 'approved' }],
      ['bytes _data', { type: 'bytes', name: '_data' }],
      ['bytes data', { type: 'bytes', name: 'data' }],
      ['bytes signature', { type: 'bytes', name: 'signature' }],
      ['bytes32 hash', { type: 'bytes32', name: 'hash' }],
      ['bytes32 r', { type: 'bytes32', name: 'r' }],
      ['bytes32 root', { type: 'bytes32', name: 'root' }],
      ['bytes32 s', { type: 'bytes32', name: 's' }],
      ['string name', { type: 'string', name: 'name' }],
      ['string symbol', { type: 'string', name: 'symbol' }],
      ['string tokenURI', { type: 'string', name: 'tokenURI' }],
      ['uint tokenId', { type: 'uint256', name: 'tokenId' }],
      ['uint8 v', { type: 'uint8', name: 'v' }],
      ['uint256 balance', { type: 'uint256', name: 'balance' }],
      ['uint256 tokenId', { type: 'uint256', name: 'tokenId' }],
      ['uint256 value', { type: 'uint256', name: 'value' }],
      [
        'event:address indexed from',
        { type: 'address', name: 'from', indexed: true },
      ],
      [
        'event:address indexed to',
        { type: 'address', name: 'to', indexed: true },
      ],
      [
        'event:uint indexed tokenId',
        { type: 'uint256', name: 'tokenId', indexed: true },
      ],
      [
        'event:uint256 indexed tokenId',
        { type: 'uint256', name: 'tokenId', indexed: true },
      ],
    ]);
  });
function qs(t, e = {}) {
  if (fp(t)) return jb(t, e);
  if (up(t)) return qb(t, e);
  if (ip(t)) return Vb(t, e);
  if (yp(t)) return Gb(t, e);
  if (wp(t)) return Wb(t);
  if (Tp(t)) return { type: 'receive', stateMutability: 'payable' };
  throw new ra({ signature: t });
}
function jb(t, e = {}) {
  var c;
  let r = pp(t);
  if (!r) throw new ur({ signature: t, type: 'function' });
  let n = Zt(r.parameters),
    s = [],
    o = n.length;
  for (let d = 0; d < o; d++)
    s.push(Yr(n[d], { modifiers: Gi, structs: e, type: 'function' }));
  let i = [];
  if (r.returns) {
    let d = Zt(r.returns),
      p = d.length;
    for (let u = 0; u < p; u++)
      i.push(Yr(d[u], { modifiers: Gi, structs: e, type: 'function' }));
  }
  return {
    name: r.name,
    type: 'function',
    stateMutability: (c = r.stateMutability) != null ? c : 'nonpayable',
    inputs: s,
    outputs: i,
  };
}
function qb(t, e = {}) {
  let r = dp(t);
  if (!r) throw new ur({ signature: t, type: 'event' });
  let n = Zt(r.parameters),
    s = [],
    o = n.length;
  for (let i = 0; i < o; i++)
    s.push(Yr(n[i], { modifiers: Ep, structs: e, type: 'event' }));
  return { name: r.name, type: 'event', inputs: s };
}
function Vb(t, e = {}) {
  let r = ap(t);
  if (!r) throw new ur({ signature: t, type: 'error' });
  let n = Zt(r.parameters),
    s = [],
    o = n.length;
  for (let i = 0; i < o; i++) s.push(Yr(n[i], { structs: e, type: 'error' }));
  return { name: r.name, type: 'error', inputs: s };
}
function Gb(t, e = {}) {
  var i;
  let r = bp(t);
  if (!r) throw new ur({ signature: t, type: 'constructor' });
  let n = Zt(r.parameters),
    s = [],
    o = n.length;
  for (let c = 0; c < o; c++)
    s.push(Yr(n[c], { structs: e, type: 'constructor' }));
  return {
    type: 'constructor',
    stateMutability: (i = r.stateMutability) != null ? i : 'nonpayable',
    inputs: s,
  };
}
function Wb(t) {
  var r;
  let e = vp(t);
  if (!e) throw new ur({ signature: t, type: 'fallback' });
  return {
    type: 'fallback',
    stateMutability: (r = e.stateMutability) != null ? r : 'nonpayable',
  };
}
function Yr(t, e) {
  var h, g, b, E;
  let r = Pp(t, e == null ? void 0 : e.type, e == null ? void 0 : e.structs);
  if (ia.has(r)) return ia.get(r);
  let n = qi.test(t),
    s = $t(n ? Kb : Zb, t);
  if (!s) throw new Yi({ param: t });
  if (s.name && Xb(s.name)) throw new Xi({ param: t, name: s.name });
  let o = s.name ? { name: s.name } : {},
    i = s.modifier === 'indexed' ? { indexed: true } : {},
    c = (h = e == null ? void 0 : e.structs) != null ? h : {},
    d,
    p = {};
  if (n) {
    d = 'tuple';
    let T = Zt(s.type),
      P = [],
      v = T.length;
    for (let C = 0; C < v; C++) P.push(Yr(T[C], { structs: c }));
    p = { components: P };
  } else if (s.type in c) (d = 'tuple'), (p = { components: c[s.type] });
  else if (Jb.test(s.type)) d = `${s.type}256`;
  else if (((d = s.type), (e == null ? void 0 : e.type) !== 'struct' && !yd(d)))
    throw new Ki({ type: d });
  if (s.modifier) {
    if (
      !(
        (b = (g = e == null ? void 0 : e.modifiers) == null ? void 0 : g.has) !=
          null && b.call(g, s.modifier)
      )
    )
      throw new Qi({
        param: t,
        type: e == null ? void 0 : e.type,
        modifier: s.modifier,
      });
    if (Gi.has(s.modifier) && !Qb(d, !!s.array))
      throw new ea({
        param: t,
        type: e == null ? void 0 : e.type,
        modifier: s.modifier,
      });
  }
  let u = { type: `${d}${(E = s.array) != null ? E : ''}`, ...o, ...i, ...p };
  return ia.set(r, u), u;
}
function Zt(t, e = [], r = '', n = 0) {
  let s = t.trim().length;
  for (let o = 0; o < s; o++) {
    let i = t[o],
      c = t.slice(o + 1);
    switch (i) {
      case ',':
        return n === 0 ? Zt(c, [...e, r.trim()]) : Zt(c, e, `${r}${i}`, n);
      case '(':
        return Zt(c, e, `${r}${i}`, n + 1);
      case ')':
        return Zt(c, e, `${r}${i}`, n - 1);
      default:
        return Zt(c, e, `${r}${i}`, n);
    }
  }
  if (r === '') return e;
  if (n !== 0) throw new sa({ current: r, depth: n });
  return e.push(r.trim()), e;
}
function yd(t) {
  return (
    t === 'address' ||
    t === 'bool' ||
    t === 'function' ||
    t === 'string' ||
    pd.test(t) ||
    md.test(t)
  );
}
function Xb(t) {
  return (
    t === 'address' ||
    t === 'bool' ||
    t === 'function' ||
    t === 'string' ||
    t === 'tuple' ||
    pd.test(t) ||
    md.test(t) ||
    Yb.test(t)
  );
}
function Qb(t, e) {
  return e || t === 'bytes' || t === 'string' || t === 'tuple';
}
var Zb,
  Kb,
  Jb,
  Yb,
  aa = D(() => {
    f();
    Hs();
    Ji();
    hd();
    gd();
    Ap();
    kp();
    js();
    (Zb =
      /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/),
      (Kb =
        /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/),
      (Jb = /^u?int$/);
    Yb =
      /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
  });
function ca(t) {
  let e = {},
    r = t.length;
  for (let i = 0; i < r; i++) {
    let c = t[i];
    if (!fo(c)) continue;
    let d = hp(c);
    if (!d) throw new ur({ signature: c, type: 'struct' });
    let p = d.properties.split(';'),
      u = [],
      h = p.length;
    for (let g = 0; g < h; g++) {
      let E = p[g].trim();
      if (!E) continue;
      let T = Yr(E, { type: 'struct' });
      u.push(T);
    }
    if (!u.length) throw new na({ signature: c });
    e[d.name] = u;
  }
  let n = {},
    s = Object.entries(e),
    o = s.length;
  for (let i = 0; i < o; i++) {
    let [c, d] = s[i];
    n[c] = $p(d, e);
  }
  return n;
}
function $p(t, e, r = new Set()) {
  var o;
  let n = [],
    s = t.length;
  for (let i = 0; i < s; i++) {
    let c = t[i];
    if (qi.test(c.type)) n.push(c);
    else {
      let p = $t(ex, c.type);
      if (!(p != null && p.type)) throw new ta({ abiParameter: c });
      let { array: u, type: h } = p;
      if (h in e) {
        if (r.has(h)) throw new oa({ type: h });
        n.push({
          ...c,
          type: `tuple${u != null ? u : ''}`,
          components: $p((o = e[h]) != null ? o : [], e, new Set([...r, h])),
        });
      } else if (yd(h)) n.push(c);
      else throw new Zi({ type: h });
    }
  }
  return n;
}
var ex,
  bd = D(() => {
    f();
    Hs();
    Ji();
    hd();
    gd();
    Cp();
    js();
    aa();
    ex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
  });
function ua(t) {
  let e = ca(t),
    r = [],
    n = t.length;
  for (let s = 0; s < n; s++) {
    let o = t[s];
    fo(o) || r.push(qs(o, e));
  }
  return r;
}
var Bp = D(() => {
  f();
  js();
  bd();
  aa();
});
function da(t) {
  let e;
  if (typeof t == 'string') e = qs(t);
  else {
    let r = ca(t),
      n = t.length;
    for (let s = 0; s < n; s++) {
      let o = t[s];
      if (!fo(o)) {
        e = qs(o, r);
        break;
      }
    }
  }
  if (!e) throw new Wi({ signature: t });
  return e;
}
var Ip = D(() => {
  f();
  Ji();
  js();
  bd();
  aa();
});
var la = D(() => {
  f();
  op();
  Bp();
  Ip();
});
function He(t, { includeName: e = false } = {}) {
  if (t.type !== 'function' && t.type !== 'event' && t.type !== 'error')
    throw new fa(t.type);
  return `${t.name}(${Vs(t.inputs, { includeName: e })})`;
}
function Vs(t, { includeName: e = false } = {}) {
  return t ? t.map(r => rx(r, { includeName: e })).join(e ? ', ' : ',') : '';
}
function rx(t, { includeName: e }) {
  return t.type.startsWith('tuple')
    ? `(${Vs(t.components, { includeName: e })})${t.type.slice(5)}`
    : t.type + (e && t.name ? ` ${t.name}` : '');
}
var Sr = D(() => {
  f();
  $e();
});
function Re(t, { strict: e = true } = {}) {
  return !t || typeof t != 'string'
    ? false
    : e
      ? /^0x[0-9a-fA-F]*$/.test(t)
      : t.startsWith('0x');
}
var Kt = D(() => {
  f();
});
function pe(t) {
  return Re(t, { strict: false }) ? Math.ceil((t.length - 2) / 2) : t.length;
}
var Jt = D(() => {
  f();
  Kt();
});
var xd,
  Sp = D(() => {
    f();
    xd = '2.29.0';
  });
function Rp(t, e) {
  return e != null && e(t)
    ? t
    : t && typeof t == 'object' && 'cause' in t && t.cause !== void 0
      ? Rp(t.cause, e)
      : e
        ? null
        : t;
}
var Gs,
  I,
  ce = D(() => {
    f();
    Sp();
    (Gs = {
      getDocsUrl: ({ docsBaseUrl: t, docsPath: e = '', docsSlug: r }) =>
        e
          ? `${t != null ? t : 'https://viem.sh'}${e}${r ? `#${r}` : ''}`
          : void 0,
      version: `viem@${xd}`,
    }),
      (I = class t extends Error {
        constructor(e, r = {}) {
          var c, d;
          let n = (() => {
              var p;
              return r.cause instanceof t
                ? r.cause.details
                : (p = r.cause) != null && p.message
                  ? r.cause.message
                  : r.details;
            })(),
            s = (r.cause instanceof t && r.cause.docsPath) || r.docsPath,
            o =
              (c = Gs.getDocsUrl) == null
                ? void 0
                : c.call(Gs, { ...r, docsPath: s }),
            i = [
              e || 'An error occurred.',
              '',
              ...(r.metaMessages ? [...r.metaMessages, ''] : []),
              ...(o ? [`Docs: ${o}`] : []),
              ...(n ? [`Details: ${n}`] : []),
              ...(Gs.version ? [`Version: ${Gs.version}`] : []),
            ].join(`
`);
          super(i, r.cause ? { cause: r.cause } : void 0),
            Object.defineProperty(this, 'details', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'docsPath', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'metaMessages', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'shortMessage', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'version', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'name', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 'BaseError',
            }),
            (this.details = n),
            (this.docsPath = s),
            (this.metaMessages = r.metaMessages),
            (this.name = (d = r.name) != null ? d : this.name),
            (this.shortMessage = e),
            (this.version = xd);
        }
        walk(e) {
          return Rp(this, e);
        }
      });
  });
var pa,
  Ws,
  po,
  Mt,
  ma,
  ha,
  ga,
  ya,
  Zs,
  mo,
  ba,
  ho,
  Ks,
  Yt,
  go,
  xa,
  wa,
  va,
  Xt,
  dr,
  Ta,
  Ea,
  yo,
  fa,
  $e = D(() => {
    f();
    Sr();
    Jt();
    ce();
    (pa = class extends I {
      constructor({ docsPath: e }) {
        super(
          [
            'A constructor was not found on the ABI.',
            'Make sure you are using the correct ABI and that the constructor exists on it.',
          ].join(`
`),
          { docsPath: e, name: 'AbiConstructorNotFoundError' }
        );
      }
    }),
      (Ws = class extends I {
        constructor({ docsPath: e }) {
          super(
            [
              'Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.',
              'Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists.',
            ].join(`
`),
            { docsPath: e, name: 'AbiConstructorParamsNotFoundError' }
          );
        }
      }),
      (po = class extends I {
        constructor({ data: e, params: r, size: n }) {
          super(
            [`Data size of ${n} bytes is too small for given parameters.`]
              .join(`
`),
            {
              metaMessages: [
                `Params: (${Vs(r, { includeName: true })})`,
                `Data:   ${e} (${n} bytes)`,
              ],
              name: 'AbiDecodingDataSizeTooSmallError',
            }
          ),
            Object.defineProperty(this, 'data', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'params', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'size', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.data = e),
            (this.params = r),
            (this.size = n);
        }
      }),
      (Mt = class extends I {
        constructor() {
          super('Cannot decode zero data ("0x") with ABI parameters.', {
            name: 'AbiDecodingZeroDataError',
          });
        }
      }),
      (ma = class extends I {
        constructor({ expectedLength: e, givenLength: r, type: n }) {
          super(
            [
              `ABI encoding array length mismatch for type ${n}.`,
              `Expected length: ${e}`,
              `Given length: ${r}`,
            ].join(`
`),
            { name: 'AbiEncodingArrayLengthMismatchError' }
          );
        }
      }),
      (ha = class extends I {
        constructor({ expectedSize: e, value: r }) {
          super(
            `Size of bytes "${r}" (bytes${pe(r)}) does not match expected size (bytes${e}).`,
            { name: 'AbiEncodingBytesSizeMismatchError' }
          );
        }
      }),
      (ga = class extends I {
        constructor({ expectedLength: e, givenLength: r }) {
          super(
            [
              'ABI encoding params/values length mismatch.',
              `Expected length (params): ${e}`,
              `Given length (values): ${r}`,
            ].join(`
`),
            { name: 'AbiEncodingLengthMismatchError' }
          );
        }
      }),
      (ya = class extends I {
        constructor(e, { docsPath: r }) {
          super(
            [
              `Arguments (\`args\`) were provided to "${e}", but "${e}" on the ABI does not contain any parameters (\`inputs\`).`,
              'Cannot encode error result without knowing what the parameter types are.',
              'Make sure you are using the correct ABI and that the inputs exist on it.',
            ].join(`
`),
            { docsPath: r, name: 'AbiErrorInputsNotFoundError' }
          );
        }
      }),
      (Zs = class extends I {
        constructor(e, { docsPath: r } = {}) {
          super(
            [
              `Error ${e ? `"${e}" ` : ''}not found on ABI.`,
              'Make sure you are using the correct ABI and that the error exists on it.',
            ].join(`
`),
            { docsPath: r, name: 'AbiErrorNotFoundError' }
          );
        }
      }),
      (mo = class extends I {
        constructor(e, { docsPath: r }) {
          super(
            [
              `Encoded error signature "${e}" not found on ABI.`,
              'Make sure you are using the correct ABI and that the error exists on it.',
              `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${e}.`,
            ].join(`
`),
            { docsPath: r, name: 'AbiErrorSignatureNotFoundError' }
          ),
            Object.defineProperty(this, 'signature', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.signature = e);
        }
      }),
      (ba = class extends I {
        constructor({ docsPath: e }) {
          super('Cannot extract event signature from empty topics.', {
            docsPath: e,
            name: 'AbiEventSignatureEmptyTopicsError',
          });
        }
      }),
      (ho = class extends I {
        constructor(e, { docsPath: r }) {
          super(
            [
              `Encoded event signature "${e}" not found on ABI.`,
              'Make sure you are using the correct ABI and that the event exists on it.',
              `You can look up the signature here: https://openchain.xyz/signatures?query=${e}.`,
            ].join(`
`),
            { docsPath: r, name: 'AbiEventSignatureNotFoundError' }
          );
        }
      }),
      (Ks = class extends I {
        constructor(e, { docsPath: r } = {}) {
          super(
            [
              `Event ${e ? `"${e}" ` : ''}not found on ABI.`,
              'Make sure you are using the correct ABI and that the event exists on it.',
            ].join(`
`),
            { docsPath: r, name: 'AbiEventNotFoundError' }
          );
        }
      }),
      (Yt = class extends I {
        constructor(e, { docsPath: r } = {}) {
          super(
            [
              `Function ${e ? `"${e}" ` : ''}not found on ABI.`,
              'Make sure you are using the correct ABI and that the function exists on it.',
            ].join(`
`),
            { docsPath: r, name: 'AbiFunctionNotFoundError' }
          );
        }
      }),
      (go = class extends I {
        constructor(e, { docsPath: r }) {
          super(
            [
              `Function "${e}" does not contain any \`outputs\` on ABI.`,
              'Cannot decode function result without knowing what the parameter types are.',
              'Make sure you are using the correct ABI and that the function exists on it.',
            ].join(`
`),
            { docsPath: r, name: 'AbiFunctionOutputsNotFoundError' }
          );
        }
      }),
      (xa = class extends I {
        constructor(e, { docsPath: r }) {
          super(
            [
              `Encoded function signature "${e}" not found on ABI.`,
              'Make sure you are using the correct ABI and that the function exists on it.',
              `You can look up the signature here: https://openchain.xyz/signatures?query=${e}.`,
            ].join(`
`),
            { docsPath: r, name: 'AbiFunctionSignatureNotFoundError' }
          );
        }
      }),
      (wa = class extends I {
        constructor(e, r) {
          super('Found ambiguous types in overloaded ABI items.', {
            metaMessages: [
              `\`${e.type}\` in \`${He(e.abiItem)}\`, and`,
              `\`${r.type}\` in \`${He(r.abiItem)}\``,
              '',
              'These types encode differently and cannot be distinguished at runtime.',
              'Remove one of the ambiguous items in the ABI.',
            ],
            name: 'AbiItemAmbiguityError',
          });
        }
      }),
      (va = class extends I {
        constructor({ expectedSize: e, givenSize: r }) {
          super(`Expected bytes${e}, got bytes${r}.`, {
            name: 'BytesSizeMismatchError',
          });
        }
      }),
      (Xt = class extends I {
        constructor({ abiItem: e, data: r, params: n, size: s }) {
          super(
            [
              `Data size of ${s} bytes is too small for non-indexed event parameters.`,
            ].join(`
`),
            {
              metaMessages: [
                `Params: (${Vs(n, { includeName: true })})`,
                `Data:   ${r} (${s} bytes)`,
              ],
              name: 'DecodeLogDataMismatch',
            }
          ),
            Object.defineProperty(this, 'abiItem', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'data', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'params', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'size', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.abiItem = e),
            (this.data = r),
            (this.params = n),
            (this.size = s);
        }
      }),
      (dr = class extends I {
        constructor({ abiItem: e, param: r }) {
          super(
            [
              `Expected a topic for indexed event parameter${r.name ? ` "${r.name}"` : ''} on event "${He(e, { includeName: true })}".`,
            ].join(`
`),
            { name: 'DecodeLogTopicsMismatch' }
          ),
            Object.defineProperty(this, 'abiItem', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.abiItem = e);
        }
      }),
      (Ta = class extends I {
        constructor(e, { docsPath: r }) {
          super(
            [
              `Type "${e}" is not a valid encoding type.`,
              'Please provide a valid ABI type.',
            ].join(`
`),
            { docsPath: r, name: 'InvalidAbiEncodingType' }
          );
        }
      }),
      (Ea = class extends I {
        constructor(e, { docsPath: r }) {
          super(
            [
              `Type "${e}" is not a valid decoding type.`,
              'Please provide a valid ABI type.',
            ].join(`
`),
            { docsPath: r, name: 'InvalidAbiDecodingType' }
          );
        }
      }),
      (yo = class extends I {
        constructor(e) {
          super(
            [`Value "${e}" is not a valid array.`].join(`
`),
            { name: 'InvalidArrayError' }
          );
        }
      }),
      (fa = class extends I {
        constructor(e) {
          super(
            [
              `"${e}" is not a valid definition type.`,
              'Valid types: "function", "event", "error"',
            ].join(`
`),
            { name: 'InvalidDefinitionTypeError' }
          );
        }
      });
  });
var Js,
  Ys,
  Xs,
  Aa = D(() => {
    f();
    ce();
    (Js = class extends I {
      constructor({ offset: e, position: r, size: n }) {
        super(
          `Slice ${r === 'start' ? 'starting' : 'ending'} at offset "${e}" is out-of-bounds (size: ${n}).`,
          { name: 'SliceOffsetOutOfBoundsError' }
        );
      }
    }),
      (Ys = class extends I {
        constructor({ size: e, targetSize: r, type: n }) {
          super(
            `${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} size (${e}) exceeds padding size (${r}).`,
            { name: 'SizeExceedsPaddingSizeError' }
          );
        }
      }),
      (Xs = class extends I {
        constructor({ size: e, targetSize: r, type: n }) {
          super(
            `${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} is expected to be ${r} ${n} long, but is ${e} ${n} long.`,
            { name: 'InvalidBytesLengthError' }
          );
        }
      });
  });
function Xr(t, { dir: e, size: r = 32 } = {}) {
  return typeof t == 'string'
    ? Rr(t, { dir: e, size: r })
    : nx(t, { dir: e, size: r });
}
function Rr(t, { dir: e, size: r = 32 } = {}) {
  if (r === null) return t;
  let n = t.replace('0x', '');
  if (n.length > r * 2)
    throw new Ys({ size: Math.ceil(n.length / 2), targetSize: r, type: 'hex' });
  return `0x${n[e === 'right' ? 'padEnd' : 'padStart'](r * 2, '0')}`;
}
function nx(t, { dir: e, size: r = 32 } = {}) {
  if (r === null) return t;
  if (t.length > r)
    throw new Ys({ size: t.length, targetSize: r, type: 'bytes' });
  let n = new Uint8Array(r);
  for (let s = 0; s < r; s++) {
    let o = e === 'right';
    n[o ? s : r - s - 1] = t[o ? s : t.length - s - 1];
  }
  return n;
}
var Pa = D(() => {
  f();
  Aa();
});
var bo,
  ka,
  $a,
  Ba,
  Qs = D(() => {
    f();
    ce();
    (bo = class extends I {
      constructor({ max: e, min: r, signed: n, size: s, value: o }) {
        super(
          `Number "${o}" is not in safe ${s ? `${s * 8}-bit ${n ? 'signed' : 'unsigned'} ` : ''}integer range ${e ? `(${r} to ${e})` : `(above ${r})`}`,
          { name: 'IntegerOutOfRangeError' }
        );
      }
    }),
      (ka = class extends I {
        constructor(e) {
          super(
            `Bytes value "${e}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`,
            { name: 'InvalidBytesBooleanError' }
          );
        }
      }),
      ($a = class extends I {
        constructor(e) {
          super(
            `Hex value "${e}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`,
            { name: 'InvalidHexBooleanError' }
          );
        }
      }),
      (Ba = class extends I {
        constructor({ givenSize: e, maxSize: r }) {
          super(`Size cannot exceed ${r} bytes. Given size: ${e} bytes.`, {
            name: 'SizeOverflowError',
          });
        }
      });
  });
function Qt(t, { dir: e = 'left' } = {}) {
  let r = typeof t == 'string' ? t.replace('0x', '') : t,
    n = 0;
  for (
    let s = 0;
    s < r.length - 1 &&
    r[e === 'left' ? s : r.length - s - 1].toString() === '0';
    s++
  )
    n++;
  return (
    (r = e === 'left' ? r.slice(n) : r.slice(0, r.length - n)),
    typeof t == 'string'
      ? (r.length === 1 && e === 'right' && (r = `${r}0`),
        `0x${r.length % 2 === 1 ? `0${r}` : r}`)
      : r
  );
}
var ei = D(() => {
  f();
});
function ht(t, { size: e }) {
  if (pe(t) > e) throw new Ba({ givenSize: pe(t), maxSize: e });
}
function Me(t, e = {}) {
  let { signed: r } = e;
  e.size && ht(t, { size: e.size });
  let n = BigInt(t);
  if (!r) return n;
  let s = (t.length - 2) / 2,
    o = (BigInt(1) << (BigInt(s) * BigInt(8) - BigInt(1))) - BigInt(1);
  return n <= o ? n : n - BigInt(`0x${'f'.padStart(s * 2, 'f')}`) - BigInt(1);
}
function wd(t, e = {}) {
  let r = t;
  if ((e.size && (ht(r, { size: e.size }), (r = Qt(r))), Qt(r) === '0x00'))
    return false;
  if (Qt(r) === '0x01') return true;
  throw new $a(r);
}
function Ue(t, e = {}) {
  return Number(Me(t, e));
}
var dt = D(() => {
  f();
  Qs();
  Jt();
  ei();
});
function Le(t, e = {}) {
  return typeof t == 'number' || typeof t == 'bigint'
    ? H(t, e)
    : typeof t == 'string'
      ? lr(t, e)
      : typeof t == 'boolean'
        ? vd(t, e)
        : me(t, e);
}
function vd(t, e = {}) {
  let r = `0x${Number(t)}`;
  return typeof e.size == 'number'
    ? (ht(r, { size: e.size }), Xr(r, { size: e.size }))
    : r;
}
function me(t, e = {}) {
  let r = '';
  for (let s = 0; s < t.length; s++) r += ox[t[s]];
  let n = `0x${r}`;
  return typeof e.size == 'number'
    ? (ht(n, { size: e.size }), Xr(n, { dir: 'right', size: e.size }))
    : n;
}
function H(t, e = {}) {
  let { signed: r, size: n } = e,
    s = BigInt(t),
    o;
  n
    ? r
      ? (o = (BigInt(1) << (BigInt(n) * BigInt(8) - BigInt(1))) - BigInt(1))
      : (o = BigInt(2) ** (BigInt(n) * BigInt(8)) - BigInt(1))
    : typeof t == 'number' && (o = BigInt(Number.MAX_SAFE_INTEGER));
  let i = typeof o == 'bigint' && r ? -o - BigInt(1) : 0;
  if ((o && s > o) || s < i) {
    let d = typeof t == 'bigint' ? 'n' : '';
    throw new bo({
      max: o ? `${o}${d}` : void 0,
      min: `${i}${d}`,
      signed: r,
      size: n,
      value: `${t}${d}`,
    });
  }
  let c = `0x${(r && s < 0 ? (BigInt(1) << BigInt(n * 8)) + BigInt(s) : s).toString(16)}`;
  return n ? Xr(c, { size: n }) : c;
}
function lr(t, e = {}) {
  let r = sx.encode(t);
  return me(r, e);
}
var ox,
  sx,
  se = D(() => {
    f();
    Qs();
    Pa();
    dt();
    ox = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, '0'));
    sx = new TextEncoder();
  });
function Ut(t, e = {}) {
  return typeof t == 'number' || typeof t == 'bigint'
    ? cx(t, e)
    : typeof t == 'boolean'
      ? ax(t, e)
      : Re(t)
        ? je(t, e)
        : er(t, e);
}
function ax(t, e = {}) {
  let r = new Uint8Array(1);
  return (
    (r[0] = Number(t)),
    typeof e.size == 'number'
      ? (ht(r, { size: e.size }), Xr(r, { size: e.size }))
      : r
  );
}
function Np(t) {
  if (t >= Nr.zero && t <= Nr.nine) return t - Nr.zero;
  if (t >= Nr.A && t <= Nr.F) return t - (Nr.A - 10);
  if (t >= Nr.a && t <= Nr.f) return t - (Nr.a - 10);
}
function je(t, e = {}) {
  let r = t;
  e.size &&
    (ht(r, { size: e.size }), (r = Xr(r, { dir: 'right', size: e.size })));
  let n = r.slice(2);
  n.length % 2 && (n = `0${n}`);
  let s = n.length / 2,
    o = new Uint8Array(s);
  for (let i = 0, c = 0; i < s; i++) {
    let d = Np(n.charCodeAt(c++)),
      p = Np(n.charCodeAt(c++));
    if (d === void 0 || p === void 0)
      throw new I(
        `Invalid byte sequence ("${n[c - 2]}${n[c - 1]}" in "${n}").`
      );
    o[i] = d * 16 + p;
  }
  return o;
}
function cx(t, e) {
  let r = H(t, e);
  return je(r);
}
function er(t, e = {}) {
  let r = ix.encode(t);
  return typeof e.size == 'number'
    ? (ht(r, { size: e.size }), Xr(r, { dir: 'right', size: e.size }))
    : r;
}
var ix,
  Nr,
  Ke = D(() => {
    f();
    ce();
    Kt();
    Pa();
    dt();
    se();
    ix = new TextEncoder();
    Nr = { zero: 48, nine: 57, A: 65, F: 70, a: 97, f: 102 };
  });
function ti(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error('positive integer expected, got ' + t);
}
function ux(t) {
  return (
    t instanceof Uint8Array ||
    (ArrayBuffer.isView(t) && t.constructor.name === 'Uint8Array')
  );
}
function Qr(t, ...e) {
  if (!ux(t)) throw new Error('Uint8Array expected');
  if (e.length > 0 && !e.includes(t.length))
    throw new Error(
      'Uint8Array expected of length ' + e + ', got length=' + t.length
    );
}
function Fp(t) {
  if (typeof t != 'function' || typeof t.create != 'function')
    throw new Error('Hash should be wrapped by utils.wrapConstructor');
  ti(t.outputLen), ti(t.blockLen);
}
function Fr(t, e = true) {
  if (t.destroyed) throw new Error('Hash instance has been destroyed');
  if (e && t.finished) throw new Error('Hash#digest() has already been called');
}
function Ia(t, e) {
  Qr(t);
  let r = e.outputLen;
  if (t.length < r)
    throw new Error(
      'digestInto() expects output buffer of length at least ' + r
    );
}
var ri = D(() => {
  f();
});
function dx(t, e = false) {
  return e
    ? { h: Number(t & Sa), l: Number((t >> Op) & Sa) }
    : { h: Number((t >> Op) & Sa) | 0, l: Number(t & Sa) | 0 };
}
function Dp(t, e = false) {
  let r = new Uint32Array(t.length),
    n = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    let { h: o, l: i } = dx(t[s], e);
    [r[s], n[s]] = [o, i];
  }
  return [r, n];
}
var Sa,
  Op,
  Mp,
  Up,
  Lp,
  zp,
  _p = D(() => {
    f();
    (Sa = BigInt(4294967295)), (Op = BigInt(32));
    (Mp = (t, e, r) => (t << r) | (e >>> (32 - r))),
      (Up = (t, e, r) => (e << r) | (t >>> (32 - r))),
      (Lp = (t, e, r) => (e << (r - 32)) | (t >>> (64 - r))),
      (zp = (t, e, r) => (t << (r - 32)) | (e >>> (64 - r)));
  });
var Mn,
  Hp = D(() => {
    f();
    Mn =
      Or__namespace &&
      typeof Or__namespace == 'object' &&
      'webcrypto' in Or__namespace
        ? Or__namespace.webcrypto
        : Or__namespace &&
            typeof Or__namespace == 'object' &&
            'randomBytes' in Or__namespace
          ? Or__namespace
          : void 0;
  });
function jp(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ra(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function tr(t, e) {
  return (t << (32 - e)) | (t >>> e);
}
function lx(t) {
  return (
    ((t << 24) & 4278190080) |
    ((t << 8) & 16711680) |
    ((t >>> 8) & 65280) |
    ((t >>> 24) & 255)
  );
}
function Ed(t) {
  for (let e = 0; e < t.length; e++) t[e] = lx(t[e]);
}
function fx(t) {
  if (typeof t != 'string')
    throw new Error('utf8ToBytes expected string, got ' + typeof t);
  return new Uint8Array(new TextEncoder().encode(t));
}
function tn(t) {
  return typeof t == 'string' && (t = fx(t)), Qr(t), t;
}
function qp(...t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    let s = t[n];
    Qr(s), (e += s.length);
  }
  let r = new Uint8Array(e);
  for (let n = 0, s = 0; n < t.length; n++) {
    let o = t[n];
    r.set(o, s), (s += o.length);
  }
  return r;
}
function Na(t) {
  let e = n => t().update(tn(n)).digest(),
    r = t();
  return (
    (e.outputLen = r.outputLen),
    (e.blockLen = r.blockLen),
    (e.create = () => t()),
    e
  );
}
function Vp(t) {
  let e = (n, s) => t(s).update(tn(n)).digest(),
    r = t({});
  return (
    (e.outputLen = r.outputLen),
    (e.blockLen = r.blockLen),
    (e.create = n => t(n)),
    e
  );
}
function Fa(t = 32) {
  if (Mn && typeof Mn.getRandomValues == 'function')
    return Mn.getRandomValues(new Uint8Array(t));
  if (Mn && typeof Mn.randomBytes == 'function')
    return Uint8Array.from(Mn.randomBytes(t));
  throw new Error('crypto.getRandomValues must be defined');
}
var Td,
  en,
  Un = D(() => {
    f();
    Hp();
    ri();
    Td = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
    typeof Uint8Array.from([]).toHex == 'function' &&
      typeof Uint8Array.fromHex == 'function';
    en = class {
      clone() {
        return this._cloneInto();
      }
    };
  });
function wx(t, e = 24) {
  let r = new Uint32Array(10);
  for (let n = 24 - e; n < 24; n++) {
    for (let i = 0; i < 10; i++)
      r[i] = t[i] ^ t[i + 10] ^ t[i + 20] ^ t[i + 30] ^ t[i + 40];
    for (let i = 0; i < 10; i += 2) {
      let c = (i + 8) % 10,
        d = (i + 2) % 10,
        p = r[d],
        u = r[d + 1],
        h = Gp(p, u, 1) ^ r[c],
        g = Wp(p, u, 1) ^ r[c + 1];
      for (let b = 0; b < 50; b += 10) (t[i + b] ^= h), (t[i + b + 1] ^= g);
    }
    let s = t[2],
      o = t[3];
    for (let i = 0; i < 24; i++) {
      let c = Kp[i],
        d = Gp(s, o, c),
        p = Wp(s, o, c),
        u = Zp[i];
      (s = t[u]), (o = t[u + 1]), (t[u] = d), (t[u + 1] = p);
    }
    for (let i = 0; i < 50; i += 10) {
      for (let c = 0; c < 10; c++) r[c] = t[i + c];
      for (let c = 0; c < 10; c++)
        t[i + c] ^= ~r[(c + 2) % 10] & r[(c + 4) % 10];
    }
    (t[0] ^= bx[n]), (t[1] ^= xx[n]);
  }
  r.fill(0);
}
var Zp,
  Kp,
  Jp,
  px,
  ni,
  mx,
  hx,
  gx,
  yx,
  bx,
  xx,
  Gp,
  Wp,
  Oa,
  rn,
  Da,
  Yp,
  Cd = D(() => {
    f();
    ri();
    _p();
    Un();
    (Zp = []),
      (Kp = []),
      (Jp = []),
      (px = BigInt(0)),
      (ni = BigInt(1)),
      (mx = BigInt(2)),
      (hx = BigInt(7)),
      (gx = BigInt(256)),
      (yx = BigInt(113));
    for (let t = 0, e = ni, r = 1, n = 0; t < 24; t++) {
      ([r, n] = [n, (2 * r + 3 * n) % 5]),
        Zp.push(2 * (5 * n + r)),
        Kp.push((((t + 1) * (t + 2)) / 2) % 64);
      let s = px;
      for (let o = 0; o < 7; o++)
        (e = ((e << ni) ^ ((e >> hx) * yx)) % gx),
          e & mx && (s ^= ni << ((ni << BigInt(o)) - ni));
      Jp.push(s);
    }
    ([bx, xx] = Dp(Jp, true)),
      (Gp = (t, e, r) => (r > 32 ? Lp(t, e, r) : Mp(t, e, r))),
      (Wp = (t, e, r) => (r > 32 ? zp(t, e, r) : Up(t, e, r)));
    (Oa = class t extends en {
      constructor(e, r, n, s = false, o = 24) {
        if (
          (super(),
          (this.pos = 0),
          (this.posOut = 0),
          (this.finished = false),
          (this.destroyed = false),
          (this.enableXOF = false),
          (this.blockLen = e),
          (this.suffix = r),
          (this.outputLen = n),
          (this.enableXOF = s),
          (this.rounds = o),
          ti(n),
          0 >= this.blockLen || this.blockLen >= 200)
        )
          throw new Error('Sha3 supports only keccak-f1600 function');
        (this.state = new Uint8Array(200)), (this.state32 = jp(this.state));
      }
      keccak() {
        Td || Ed(this.state32),
          wx(this.state32, this.rounds),
          Td || Ed(this.state32),
          (this.posOut = 0),
          (this.pos = 0);
      }
      update(e) {
        Fr(this);
        let { blockLen: r, state: n } = this;
        e = tn(e);
        let s = e.length;
        for (let o = 0; o < s; ) {
          let i = Math.min(r - this.pos, s - o);
          for (let c = 0; c < i; c++) n[this.pos++] ^= e[o++];
          this.pos === r && this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished) return;
        this.finished = true;
        let { state: e, suffix: r, pos: n, blockLen: s } = this;
        (e[n] ^= r),
          (r & 128) !== 0 && n === s - 1 && this.keccak(),
          (e[s - 1] ^= 128),
          this.keccak();
      }
      writeInto(e) {
        Fr(this, false), Qr(e), this.finish();
        let r = this.state,
          { blockLen: n } = this;
        for (let s = 0, o = e.length; s < o; ) {
          this.posOut >= n && this.keccak();
          let i = Math.min(n - this.posOut, o - s);
          e.set(r.subarray(this.posOut, this.posOut + i), s),
            (this.posOut += i),
            (s += i);
        }
        return e;
      }
      xofInto(e) {
        if (!this.enableXOF)
          throw new Error('XOF is not possible for this instance');
        return this.writeInto(e);
      }
      xof(e) {
        return ti(e), this.xofInto(new Uint8Array(e));
      }
      digestInto(e) {
        if ((Ia(e, this), this.finished))
          throw new Error('digest() was already called');
        return this.writeInto(e), this.destroy(), e;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        (this.destroyed = true), this.state.fill(0);
      }
      _cloneInto(e) {
        let {
          blockLen: r,
          suffix: n,
          outputLen: s,
          rounds: o,
          enableXOF: i,
        } = this;
        return (
          e || (e = new t(r, n, s, i, o)),
          e.state32.set(this.state32),
          (e.pos = this.pos),
          (e.posOut = this.posOut),
          (e.finished = this.finished),
          (e.rounds = o),
          (e.suffix = n),
          (e.outputLen = s),
          (e.enableXOF = i),
          (e.destroyed = this.destroyed),
          e
        );
      }
    }),
      (rn = (t, e, r) => Na(() => new Oa(e, t, r))),
      rn(6, 144, 224 / 8),
      rn(6, 136, 256 / 8),
      rn(6, 104, 384 / 8),
      rn(6, 72, 512 / 8),
      rn(1, 144, 224 / 8),
      (Da = rn(1, 136, 256 / 8)),
      rn(1, 104, 384 / 8),
      rn(1, 72, 512 / 8),
      (Yp = (t, e, r) =>
        Vp((n = {}) => new Oa(e, t, n.dkLen === void 0 ? r : n.dkLen, true))),
      Yp(31, 168, 128 / 8),
      Yp(31, 136, 256 / 8);
  });
function Ee(t, e) {
  let r = e || 'hex',
    n = Da(Re(t, { strict: false }) ? Ut(t) : t);
  return r === 'bytes' ? n : Le(n);
}
var rr = D(() => {
  f();
  Cd();
  Kt();
  Ke();
  se();
});
function Xp(t) {
  return vx(t);
}
var vx,
  Qp = D(() => {
    f();
    Ke();
    rr();
    vx = t => Ee(Ut(t));
  });
function em(t) {
  let e = true,
    r = '',
    n = 0,
    s = '',
    o = false;
  for (let i = 0; i < t.length; i++) {
    let c = t[i];
    if (
      (['(', ')', ','].includes(c) && (e = true),
      c === '(' && n++,
      c === ')' && n--,
      !!e)
    ) {
      if (n === 0) {
        if (c === ' ' && ['event', 'function', ''].includes(s)) s = '';
        else if (((s += c), c === ')')) {
          o = true;
          break;
        }
        continue;
      }
      if (c === ' ') {
        t[i - 1] !== ',' && r !== ',' && r !== ',(' && ((r = ''), (e = false));
        continue;
      }
      (s += c), (r += c);
    }
  }
  if (!o) throw new I('Unable to normalize signature.');
  return s;
}
var tm = D(() => {
  f();
  ce();
});
var rm,
  nm = D(() => {
    f();
    la();
    tm();
    rm = t => {
      let e = typeof t == 'string' ? t : Dn(t);
      return em(e);
    };
  });
function Ma(t) {
  return Xp(rm(t));
}
var Ad = D(() => {
  f();
  Qp();
  nm();
});
var nn,
  oi = D(() => {
    f();
    Ad();
    nn = Ma;
  });
var ot,
  Ln = D(() => {
    f();
    ce();
    ot = class extends I {
      constructor({ address: e }) {
        super(`Address "${e}" is invalid.`, {
          metaMessages: [
            '- Address must be a hex value of 20 bytes (40 hex characters).',
            '- Address must match its checksum counterpart.',
          ],
          name: 'InvalidAddressError',
        });
      }
    };
  });
var fr,
  si = D(() => {
    f();
    fr = class extends Map {
      constructor(e) {
        super(),
          Object.defineProperty(this, 'maxSize', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          (this.maxSize = e);
      }
      get(e) {
        let r = super.get(e);
        return (
          super.has(e) && r !== void 0 && (this.delete(e), super.set(e, r)), r
        );
      }
      set(e, r) {
        if ((super.set(e, r), this.maxSize && this.size > this.maxSize)) {
          let n = this.keys().next().value;
          n && this.delete(n);
        }
        return this;
      }
    };
  });
function Bt(t, e) {
  if (Pd.has(`${t}.${e}`)) return Pd.get(`${t}.${e}`);
  let r = t.substring(2).toLowerCase(),
    n = Ee(er(r), 'bytes'),
    s = r.split('');
  for (let i = 0; i < 40; i += 2)
    n[i >> 1] >> 4 >= 8 && s[i] && (s[i] = s[i].toUpperCase()),
      (n[i >> 1] & 15) >= 8 && s[i + 1] && (s[i + 1] = s[i + 1].toUpperCase());
  let o = `0x${s.join('')}`;
  return Pd.set(`${t}.${e}`, o), o;
}
function ii(t, e) {
  if (!Je(t, { strict: false })) throw new ot({ address: t });
  return Bt(t, e);
}
var Pd,
  on = D(() => {
    f();
    Ln();
    Ke();
    rr();
    si();
    sn();
    Pd = new fr(8192);
  });
function Je(t, e) {
  let { strict: r = true } = e != null ? e : {},
    n = `${t}.${r}`;
  if (kd.has(n)) return kd.get(n);
  let s = Tx.test(t)
    ? t.toLowerCase() === t
      ? true
      : r
        ? Bt(t) === t
        : true
    : false;
  return kd.set(n, s), s;
}
var Tx,
  kd,
  sn = D(() => {
    f();
    si();
    on();
    (Tx = /^0x[a-fA-F0-9]{40}$/), (kd = new fr(8192));
  });
function lt(t) {
  return typeof t[0] == 'string' ? nr(t) : Ex(t);
}
function Ex(t) {
  let e = 0;
  for (let s of t) e += s.length;
  let r = new Uint8Array(e),
    n = 0;
  for (let s of t) r.set(s, n), (n += s.length);
  return r;
}
function nr(t) {
  return `0x${t.reduce((e, r) => e + r.replace('0x', ''), '')}`;
}
var or = D(() => {
  f();
});
function pr(t, e, r, { strict: n } = {}) {
  return Re(t, { strict: false })
    ? Bd(t, e, r, { strict: n })
    : $d(t, e, r, { strict: n });
}
function om(t, e) {
  if (typeof e == 'number' && e > 0 && e > pe(t) - 1)
    throw new Js({ offset: e, position: 'start', size: pe(t) });
}
function sm(t, e, r) {
  if (typeof e == 'number' && typeof r == 'number' && pe(t) !== r - e)
    throw new Js({ offset: r, position: 'end', size: pe(t) });
}
function $d(t, e, r, { strict: n } = {}) {
  om(t, e);
  let s = t.slice(e, r);
  return n && sm(s, e, r), s;
}
function Bd(t, e, r, { strict: n } = {}) {
  om(t, e);
  let s = `0x${t.replace('0x', '').slice((e != null ? e : 0) * 2, (r != null ? r : t.length) * 2)}`;
  return n && sm(s, e, r), s;
}
var zn = D(() => {
  f();
  Aa();
  Kt();
  Jt();
});
var im,
  Ua,
  Id = D(() => {
    f();
    (im = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/),
      (Ua =
        /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/);
  });
function rt(t, e) {
  if (t.length !== e.length)
    throw new ga({ expectedLength: t.length, givenLength: e.length });
  let r = Cx({ params: t, values: e }),
    n = Rd(r);
  return n.length === 0 ? '0x' : n;
}
function Cx({ params: t, values: e }) {
  let r = [];
  for (let n = 0; n < t.length; n++) r.push(Sd({ param: t[n], value: e[n] }));
  return r;
}
function Sd({ param: t, value: e }) {
  var n;
  let r = La(t.type);
  if (r) {
    let [s, o] = r;
    return Px(e, { length: s, param: { ...t, type: o } });
  }
  if (t.type === 'tuple') return Sx(e, { param: t });
  if (t.type === 'address') return Ax(e);
  if (t.type === 'bool') return $x(e);
  if (t.type.startsWith('uint') || t.type.startsWith('int')) {
    let s = t.type.startsWith('int'),
      [, , o = '256'] = (n = Ua.exec(t.type)) != null ? n : [];
    return Bx(e, { signed: s, size: Number(o) });
  }
  if (t.type.startsWith('bytes')) return kx(e, { param: t });
  if (t.type === 'string') return Ix(e);
  throw new Ta(t.type, { docsPath: '/docs/contract/encodeAbiParameters' });
}
function Rd(t) {
  let e = 0;
  for (let o = 0; o < t.length; o++) {
    let { dynamic: i, encoded: c } = t[o];
    i ? (e += 32) : (e += pe(c));
  }
  let r = [],
    n = [],
    s = 0;
  for (let o = 0; o < t.length; o++) {
    let { dynamic: i, encoded: c } = t[o];
    i ? (r.push(H(e + s, { size: 32 })), n.push(c), (s += pe(c))) : r.push(c);
  }
  return lt([...r, ...n]);
}
function Ax(t) {
  if (!Je(t)) throw new ot({ address: t });
  return { dynamic: false, encoded: Rr(t.toLowerCase()) };
}
function Px(t, { length: e, param: r }) {
  let n = e === null;
  if (!Array.isArray(t)) throw new yo(t);
  if (!n && t.length !== e)
    throw new ma({
      expectedLength: e,
      givenLength: t.length,
      type: `${r.type}[${e}]`,
    });
  let s = false,
    o = [];
  for (let i = 0; i < t.length; i++) {
    let c = Sd({ param: r, value: t[i] });
    c.dynamic && (s = true), o.push(c);
  }
  if (n || s) {
    let i = Rd(o);
    if (n) {
      let c = H(o.length, { size: 32 });
      return { dynamic: true, encoded: o.length > 0 ? lt([c, i]) : c };
    }
    if (s) return { dynamic: true, encoded: i };
  }
  return { dynamic: false, encoded: lt(o.map(({ encoded: i }) => i)) };
}
function kx(t, { param: e }) {
  let [, r] = e.type.split('bytes'),
    n = pe(t);
  if (!r) {
    let s = t;
    return (
      n % 32 !== 0 &&
        (s = Rr(s, {
          dir: 'right',
          size: Math.ceil((t.length - 2) / 2 / 32) * 32,
        })),
      { dynamic: true, encoded: lt([Rr(H(n, { size: 32 })), s]) }
    );
  }
  if (n !== Number.parseInt(r))
    throw new ha({ expectedSize: Number.parseInt(r), value: t });
  return { dynamic: false, encoded: Rr(t, { dir: 'right' }) };
}
function $x(t) {
  if (typeof t != 'boolean')
    throw new I(
      `Invalid boolean value: "${t}" (type: ${typeof t}). Expected: \`true\` or \`false\`.`
    );
  return { dynamic: false, encoded: Rr(vd(t)) };
}
function Bx(t, { signed: e, size: r = 256 }) {
  if (typeof r == 'number') {
    let n = BigInt(2) ** (BigInt(r) - (e ? BigInt(1) : BigInt(0))) - BigInt(1),
      s = e ? -n - BigInt(1) : BigInt(0);
    if (t > n || t < s)
      throw new bo({
        max: n.toString(),
        min: s.toString(),
        signed: e,
        size: r / 8,
        value: t.toString(),
      });
  }
  return { dynamic: false, encoded: H(t, { size: 32, signed: e }) };
}
function Ix(t) {
  let e = lr(t),
    r = Math.ceil(pe(e) / 32),
    n = [];
  for (let s = 0; s < r; s++)
    n.push(Rr(pr(e, s * 32, (s + 1) * 32), { dir: 'right' }));
  return { dynamic: true, encoded: lt([Rr(H(pe(e), { size: 32 })), ...n]) };
}
function Sx(t, { param: e }) {
  let r = false,
    n = [];
  for (let s = 0; s < e.components.length; s++) {
    let o = e.components[s],
      i = Array.isArray(t) ? s : o.name,
      c = Sd({ param: o, value: t[i] });
    n.push(c), c.dynamic && (r = true);
  }
  return { dynamic: r, encoded: r ? Rd(n) : lt(n.map(({ encoded: s }) => s)) };
}
function La(t) {
  let e = t.match(/^(.*)\[(\d+)?\]$/);
  return e ? [e[2] ? Number(e[2]) : null, e[1]] : void 0;
}
var mr = D(() => {
  f();
  $e();
  Ln();
  ce();
  Qs();
  sn();
  or();
  Pa();
  Jt();
  zn();
  se();
  Id();
});
var hr,
  xo = D(() => {
    f();
    zn();
    Ad();
    hr = t => pr(Ma(t), 0, 4);
  });
function gt(t) {
  let { abi: e, args: r = [], name: n } = t,
    s = Re(n, { strict: false }),
    o = e.filter(c =>
      s
        ? c.type === 'function'
          ? hr(c) === n
          : c.type === 'event'
            ? nn(c) === n
            : false
        : 'name' in c && c.name === n
    );
  if (o.length === 0) return;
  if (o.length === 1) return o[0];
  let i;
  for (let c of o) {
    if (!('inputs' in c)) continue;
    if (!r || r.length === 0) {
      if (!c.inputs || c.inputs.length === 0) return c;
      continue;
    }
    if (!c.inputs || c.inputs.length === 0 || c.inputs.length !== r.length)
      continue;
    if (
      r.every((p, u) => {
        let h = 'inputs' in c && c.inputs[u];
        return h ? Nd(p, h) : false;
      })
    ) {
      if (i && 'inputs' in i && i.inputs) {
        let p = am(c.inputs, i.inputs, r);
        if (p)
          throw new wa({ abiItem: c, type: p[0] }, { abiItem: i, type: p[1] });
      }
      i = c;
    }
  }
  return i || o[0];
}
function Nd(t, e) {
  let r = typeof t,
    n = e.type;
  switch (n) {
    case 'address':
      return Je(t, { strict: false });
    case 'bool':
      return r === 'boolean';
    case 'function':
      return r === 'string';
    case 'string':
      return r === 'string';
    default:
      return n === 'tuple' && 'components' in e
        ? Object.values(e.components).every((s, o) =>
            Nd(Object.values(t)[o], s)
          )
        : /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(
              n
            )
          ? r === 'number' || r === 'bigint'
          : /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(n)
            ? r === 'string' || t instanceof Uint8Array
            : /[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(n)
              ? Array.isArray(t) &&
                t.every(s =>
                  Nd(s, { ...e, type: n.replace(/(\[[0-9]{0,}\])$/, '') })
                )
              : false;
  }
}
function am(t, e, r) {
  for (let n in t) {
    let s = t[n],
      o = e[n];
    if (
      s.type === 'tuple' &&
      o.type === 'tuple' &&
      'components' in s &&
      'components' in o
    )
      return am(s.components, o.components, r[n]);
    let i = [s.type, o.type];
    if (
      i.includes('address') && i.includes('bytes20')
        ? true
        : i.includes('address') && i.includes('string')
          ? Je(r[n], { strict: false })
          : i.includes('address') && i.includes('bytes')
            ? Je(r[n], { strict: false })
            : false
    )
      return i;
  }
}
var an = D(() => {
  f();
  $e();
  Kt();
  sn();
  oi();
  xo();
});
function ae(t) {
  return typeof t == 'string' ? { address: t, type: 'json-rpc' } : t;
}
var Ne = D(() => {
  f();
});
function lm(t) {
  let { abi: e, args: r, functionName: n } = t,
    s = e[0];
  if (n) {
    let o = gt({ abi: e, args: r, name: n });
    if (!o) throw new Yt(n, { docsPath: dm });
    s = o;
  }
  if (s.type !== 'function') throw new Yt(void 0, { docsPath: dm });
  return { abi: [s], functionName: hr(He(s)) };
}
var dm,
  fm = D(() => {
    f();
    $e();
    xo();
    Sr();
    an();
    dm = '/docs/contract/encodeFunctionData';
  });
function we(t) {
  let { args: e } = t,
    { abi: r, functionName: n } = (() => {
      var c;
      return t.abi.length === 1 &&
        (c = t.functionName) != null &&
        c.startsWith('0x')
        ? t
        : lm(t);
    })(),
    s = r[0],
    o = n,
    i = 'inputs' in s && s.inputs ? rt(s.inputs, e != null ? e : []) : void 0;
  return nr([o, i != null ? i : '0x']);
}
var yt = D(() => {
  f();
  or();
  mr();
  fm();
});
var _a,
  Ha,
  pm,
  ai = D(() => {
    f();
    (_a = {
      1: 'An `assert` condition failed.',
      17: 'Arithmetic operation resulted in underflow or overflow.',
      18: 'Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).',
      33: 'Attempted to convert to an invalid type.',
      34: 'Attempted to access a storage byte array that is incorrectly encoded.',
      49: 'Performed `.pop()` on an empty array',
      50: 'Array index is out of bounds.',
      65: 'Allocated too much memory or created an array which is too large.',
      81: 'Attempted to call a zero-initialized variable of internal function type.',
    }),
      (Ha = {
        inputs: [{ name: 'message', type: 'string' }],
        name: 'Error',
        type: 'error',
      }),
      (pm = {
        inputs: [{ name: 'reason', type: 'uint256' }],
        name: 'Panic',
        type: 'error',
      });
  });
var ci,
  wo,
  ja,
  Fd = D(() => {
    f();
    ce();
    (ci = class extends I {
      constructor({ offset: e }) {
        super(`Offset \`${e}\` cannot be negative.`, {
          name: 'NegativeOffsetError',
        });
      }
    }),
      (wo = class extends I {
        constructor({ length: e, position: r }) {
          super(
            `Position \`${r}\` is out of bounds (\`0 < position < ${e}\`).`,
            { name: 'PositionOutOfBoundsError' }
          );
        }
      }),
      (ja = class extends I {
        constructor({ count: e, limit: r }) {
          super(
            `Recursive read limit of \`${r}\` exceeded (recursive read count: \`${e}\`).`,
            { name: 'RecursiveReadLimitExceededError' }
          );
        }
      });
  });
function vo(t, { recursiveReadLimit: e = 8192 } = {}) {
  let r = Object.create(Rx);
  return (
    (r.bytes = t),
    (r.dataView = new DataView(t.buffer, t.byteOffset, t.byteLength)),
    (r.positionReadCount = new Map()),
    (r.recursiveReadLimit = e),
    r
  );
}
var Rx,
  qa = D(() => {
    f();
    Fd();
    Rx = {
      bytes: new Uint8Array(),
      dataView: new DataView(new ArrayBuffer(0)),
      position: 0,
      positionReadCount: new Map(),
      recursiveReadCount: 0,
      recursiveReadLimit: Number.POSITIVE_INFINITY,
      assertReadLimit() {
        if (this.recursiveReadCount >= this.recursiveReadLimit)
          throw new ja({
            count: this.recursiveReadCount + 1,
            limit: this.recursiveReadLimit,
          });
      },
      assertPosition(t) {
        if (t < 0 || t > this.bytes.length - 1)
          throw new wo({ length: this.bytes.length, position: t });
      },
      decrementPosition(t) {
        if (t < 0) throw new ci({ offset: t });
        let e = this.position - t;
        this.assertPosition(e), (this.position = e);
      },
      getReadCount(t) {
        return this.positionReadCount.get(t || this.position) || 0;
      },
      incrementPosition(t) {
        if (t < 0) throw new ci({ offset: t });
        let e = this.position + t;
        this.assertPosition(e), (this.position = e);
      },
      inspectByte(t) {
        let e = t != null ? t : this.position;
        return this.assertPosition(e), this.bytes[e];
      },
      inspectBytes(t, e) {
        let r = e != null ? e : this.position;
        return this.assertPosition(r + t - 1), this.bytes.subarray(r, r + t);
      },
      inspectUint8(t) {
        let e = t != null ? t : this.position;
        return this.assertPosition(e), this.bytes[e];
      },
      inspectUint16(t) {
        let e = t != null ? t : this.position;
        return this.assertPosition(e + 1), this.dataView.getUint16(e);
      },
      inspectUint24(t) {
        let e = t != null ? t : this.position;
        return (
          this.assertPosition(e + 2),
          (this.dataView.getUint16(e) << 8) + this.dataView.getUint8(e + 2)
        );
      },
      inspectUint32(t) {
        let e = t != null ? t : this.position;
        return this.assertPosition(e + 3), this.dataView.getUint32(e);
      },
      pushByte(t) {
        this.assertPosition(this.position),
          (this.bytes[this.position] = t),
          this.position++;
      },
      pushBytes(t) {
        this.assertPosition(this.position + t.length - 1),
          this.bytes.set(t, this.position),
          (this.position += t.length);
      },
      pushUint8(t) {
        this.assertPosition(this.position),
          (this.bytes[this.position] = t),
          this.position++;
      },
      pushUint16(t) {
        this.assertPosition(this.position + 1),
          this.dataView.setUint16(this.position, t),
          (this.position += 2);
      },
      pushUint24(t) {
        this.assertPosition(this.position + 2),
          this.dataView.setUint16(this.position, t >> 8),
          this.dataView.setUint8(this.position + 2, t & 255),
          (this.position += 3);
      },
      pushUint32(t) {
        this.assertPosition(this.position + 3),
          this.dataView.setUint32(this.position, t),
          (this.position += 4);
      },
      readByte() {
        this.assertReadLimit(), this._touch();
        let t = this.inspectByte();
        return this.position++, t;
      },
      readBytes(t, e) {
        this.assertReadLimit(), this._touch();
        let r = this.inspectBytes(t);
        return (this.position += e != null ? e : t), r;
      },
      readUint8() {
        this.assertReadLimit(), this._touch();
        let t = this.inspectUint8();
        return (this.position += 1), t;
      },
      readUint16() {
        this.assertReadLimit(), this._touch();
        let t = this.inspectUint16();
        return (this.position += 2), t;
      },
      readUint24() {
        this.assertReadLimit(), this._touch();
        let t = this.inspectUint24();
        return (this.position += 3), t;
      },
      readUint32() {
        this.assertReadLimit(), this._touch();
        let t = this.inspectUint32();
        return (this.position += 4), t;
      },
      get remaining() {
        return this.bytes.length - this.position;
      },
      setPosition(t) {
        let e = this.position;
        return (
          this.assertPosition(t), (this.position = t), () => (this.position = e)
        );
      },
      _touch() {
        if (this.recursiveReadLimit === Number.POSITIVE_INFINITY) return;
        let t = this.getReadCount();
        this.positionReadCount.set(this.position, t + 1),
          t > 0 && this.recursiveReadCount++;
      },
    };
  });
function mm(t, e = {}) {
  typeof e.size != 'undefined' && ht(t, { size: e.size });
  let r = me(t, e);
  return Me(r, e);
}
function hm(t, e = {}) {
  let r = t;
  if (
    (typeof e.size != 'undefined' && (ht(r, { size: e.size }), (r = Qt(r))),
    r.length > 1 || r[0] > 1)
  )
    throw new ka(r);
  return !!r[0];
}
function yr(t, e = {}) {
  typeof e.size != 'undefined' && ht(t, { size: e.size });
  let r = me(t, e);
  return Ue(r, e);
}
function gm(t, e = {}) {
  let r = t;
  return (
    typeof e.size != 'undefined' &&
      (ht(r, { size: e.size }), (r = Qt(r, { dir: 'right' }))),
    new TextDecoder().decode(r)
  );
}
var ym = D(() => {
  f();
  Qs();
  ei();
  dt();
  se();
});
function Dr(t, e) {
  let r = typeof e == 'string' ? je(e) : e,
    n = vo(r);
  if (pe(r) === 0 && t.length > 0) throw new Mt();
  if (pe(e) && pe(e) < 32)
    throw new po({
      data: typeof e == 'string' ? e : me(e),
      params: t,
      size: pe(e),
    });
  let s = 0,
    o = [];
  for (let i = 0; i < t.length; ++i) {
    let c = t[i];
    n.setPosition(s);
    let [d, p] = To(n, c, { staticPosition: 0 });
    (s += p), o.push(d);
  }
  return o;
}
function To(t, e, { staticPosition: r }) {
  let n = La(e.type);
  if (n) {
    let [s, o] = n;
    return Fx(t, { ...e, type: o }, { length: s, staticPosition: r });
  }
  if (e.type === 'tuple') return Ux(t, e, { staticPosition: r });
  if (e.type === 'address') return Nx(t);
  if (e.type === 'bool') return Ox(t);
  if (e.type.startsWith('bytes')) return Dx(t, e, { staticPosition: r });
  if (e.type.startsWith('uint') || e.type.startsWith('int')) return Mx(t, e);
  if (e.type === 'string') return Lx(t, { staticPosition: r });
  throw new Ea(e.type, { docsPath: '/docs/contract/decodeAbiParameters' });
}
function Nx(t) {
  let e = t.readBytes(32);
  return [Bt(me($d(e, -20))), 32];
}
function Fx(t, e, { length: r, staticPosition: n }) {
  if (!r) {
    let i = yr(t.readBytes(Od)),
      c = n + i,
      d = c + bm;
    t.setPosition(c);
    let p = yr(t.readBytes(bm)),
      u = ui(e),
      h = 0,
      g = [];
    for (let b = 0; b < p; ++b) {
      t.setPosition(d + (u ? b * 32 : h));
      let [E, T] = To(t, e, { staticPosition: d });
      (h += T), g.push(E);
    }
    return t.setPosition(n + 32), [g, 32];
  }
  if (ui(e)) {
    let i = yr(t.readBytes(Od)),
      c = n + i,
      d = [];
    for (let p = 0; p < r; ++p) {
      t.setPosition(c + p * 32);
      let [u] = To(t, e, { staticPosition: c });
      d.push(u);
    }
    return t.setPosition(n + 32), [d, 32];
  }
  let s = 0,
    o = [];
  for (let i = 0; i < r; ++i) {
    let [c, d] = To(t, e, { staticPosition: n + s });
    (s += d), o.push(c);
  }
  return [o, s];
}
function Ox(t) {
  return [hm(t.readBytes(32), { size: 32 }), 32];
}
function Dx(t, e, { staticPosition: r }) {
  let [n, s] = e.type.split('bytes');
  if (!s) {
    let i = yr(t.readBytes(32));
    t.setPosition(r + i);
    let c = yr(t.readBytes(32));
    if (c === 0) return t.setPosition(r + 32), ['0x', 32];
    let d = t.readBytes(c);
    return t.setPosition(r + 32), [me(d), 32];
  }
  return [me(t.readBytes(Number.parseInt(s), 32)), 32];
}
function Mx(t, e) {
  let r = e.type.startsWith('int'),
    n = Number.parseInt(e.type.split('int')[1] || '256'),
    s = t.readBytes(32);
  return [n > 48 ? mm(s, { signed: r }) : yr(s, { signed: r }), 32];
}
function Ux(t, e, { staticPosition: r }) {
  let n = e.components.length === 0 || e.components.some(({ name: i }) => !i),
    s = n ? [] : {},
    o = 0;
  if (ui(e)) {
    let i = yr(t.readBytes(Od)),
      c = r + i;
    for (let d = 0; d < e.components.length; ++d) {
      let p = e.components[d];
      t.setPosition(c + o);
      let [u, h] = To(t, p, { staticPosition: c });
      (o += h), (s[n ? d : p == null ? void 0 : p.name] = u);
    }
    return t.setPosition(r + 32), [s, 32];
  }
  for (let i = 0; i < e.components.length; ++i) {
    let c = e.components[i],
      [d, p] = To(t, c, { staticPosition: r });
    (s[n ? i : c == null ? void 0 : c.name] = d), (o += p);
  }
  return [s, o];
}
function Lx(t, { staticPosition: e }) {
  let r = yr(t.readBytes(32)),
    n = e + r;
  t.setPosition(n);
  let s = yr(t.readBytes(32));
  if (s === 0) return t.setPosition(e + 32), ['', 32];
  let o = t.readBytes(s, 32),
    i = gm(Qt(o));
  return t.setPosition(e + 32), [i, 32];
}
function ui(t) {
  var n;
  let { type: e } = t;
  if (e === 'string' || e === 'bytes' || e.endsWith('[]')) return true;
  if (e === 'tuple') return (n = t.components) == null ? void 0 : n.some(ui);
  let r = La(t.type);
  return !!(r && ui({ ...t, type: r[1] }));
}
var bm,
  Od,
  di = D(() => {
    f();
    $e();
    on();
    qa();
    Jt();
    zn();
    ei();
    ym();
    Ke();
    se();
    mr();
    (bm = 32), (Od = 32);
  });
function Va(t) {
  let { abi: e, data: r } = t,
    n = pr(r, 0, 4);
  if (n === '0x') throw new Mt();
  let o = [...(e || []), Ha, pm].find(
    i => i.type === 'error' && n === hr(He(i))
  );
  if (!o) throw new mo(n, { docsPath: '/docs/contract/decodeErrorResult' });
  return {
    abiItem: o,
    args:
      'inputs' in o && o.inputs && o.inputs.length > 0
        ? Dr(o.inputs, pr(r, 4))
        : void 0,
    errorName: o.name,
  };
}
var Dd = D(() => {
  f();
  ai();
  $e();
  zn();
  xo();
  di();
  Sr();
});
var ue,
  st = D(() => {
    f();
    ue = (t, e, r) =>
      JSON.stringify(
        t,
        (n, s) => {
          let o = typeof s == 'bigint' ? s.toString() : s;
          return typeof e == 'function' ? e(n, o) : o;
        },
        r
      );
  });
function Md({
  abiItem: t,
  args: e,
  includeFunctionName: r = true,
  includeName: n = false,
}) {
  if ('name' in t && 'inputs' in t && t.inputs)
    return `${r ? t.name : ''}(${t.inputs.map((s, o) => `${n && s.name ? `${s.name}: ` : ''}${typeof e[o] == 'object' ? ue(e[o]) : e[o]}`).join(', ')})`;
}
var xm = D(() => {
  f();
  st();
});
var Ga,
  wm,
  Wa = D(() => {
    f();
    (Ga = { gwei: 9, wei: 18 }), (wm = { ether: -9, wei: 9 });
  });
function Za(t, e) {
  let r = t.toString(),
    n = r.startsWith('-');
  n && (r = r.slice(1)), (r = r.padStart(e, '0'));
  let [s, o] = [r.slice(0, r.length - e), r.slice(r.length - e)];
  return (
    (o = o.replace(/(0+)$/, '')),
    `${n ? '-' : ''}${s || '0'}${o ? `.${o}` : ''}`
  );
}
var Ud = D(() => {
  f();
});
function sr(t, e = 'wei') {
  return Za(t, Ga[e]);
}
var li = D(() => {
  f();
  Wa();
  Ud();
});
function qe(t, e = 'wei') {
  return Za(t, wm[e]);
}
var Eo = D(() => {
  f();
  Wa();
  Ud();
});
function vm(t) {
  return t.reduce(
    (e, { slot: r, value: n }) => `${e}        ${r}: ${n}
`,
    ''
  );
}
function Tm(t) {
  return t
    .reduce(
      (e, { address: r, ...n }) => {
        let s = `${e}    ${r}:
`;
        return (
          n.nonce &&
            (s += `      nonce: ${n.nonce}
`),
          n.balance &&
            (s += `      balance: ${n.balance}
`),
          n.code &&
            (s += `      code: ${n.code}
`),
          n.state &&
            ((s += `      state:
`),
            (s += vm(n.state))),
          n.stateDiff &&
            ((s += `      stateDiff:
`),
            (s += vm(n.stateDiff))),
          s
        );
      },
      `  State Override:
`
    )
    .slice(0, -1);
}
var Ka,
  Ja,
  Ld = D(() => {
    f();
    ce();
    (Ka = class extends I {
      constructor({ address: e }) {
        super(`State for account "${e}" is set multiple times.`, {
          name: 'AccountStateConflictError',
        });
      }
    }),
      (Ja = class extends I {
        constructor() {
          super('state and stateDiff are set on the same account.', {
            name: 'StateAssignmentConflictError',
          });
        }
      });
  });
function _n(t) {
  let e = Object.entries(t)
      .map(([n, s]) => (s === void 0 || s === false ? null : [n, s]))
      .filter(Boolean),
    r = e.reduce((n, [s]) => Math.max(n, s.length), 0);
  return e.map(([n, s]) => `  ${`${n}:`.padEnd(r + 1)}  ${s}`).join(`
`);
}
var Ya,
  Xa,
  Qa,
  Co,
  Ao,
  ec,
  Mr = D(() => {
    f();
    li();
    Eo();
    ce();
    (Ya = class extends I {
      constructor() {
        super(
          [
            'Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.',
            'Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others.',
          ].join(`
`),
          { name: 'FeeConflictError' }
        );
      }
    }),
      (Xa = class extends I {
        constructor({ transaction: e }) {
          super('Cannot infer a transaction type from provided transaction.', {
            metaMessages: [
              'Provided Transaction:',
              '{',
              _n(e),
              '}',
              '',
              'To infer the type, either provide:',
              '- a `type` to the Transaction, or',
              '- an EIP-1559 Transaction with `maxFeePerGas`, or',
              '- an EIP-2930 Transaction with `gasPrice` & `accessList`, or',
              '- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or',
              '- an EIP-7702 Transaction with `authorizationList`, or',
              '- a Legacy Transaction with `gasPrice`',
            ],
            name: 'InvalidSerializableTransactionError',
          });
        }
      }),
      (Qa = class extends I {
        constructor(
          e,
          {
            account: r,
            docsPath: n,
            chain: s,
            data: o,
            gas: i,
            gasPrice: c,
            maxFeePerGas: d,
            maxPriorityFeePerGas: p,
            nonce: u,
            to: h,
            value: g,
          }
        ) {
          var E;
          let b = _n({
            chain:
              s &&
              `${s == null ? void 0 : s.name} (id: ${s == null ? void 0 : s.id})`,
            from: r == null ? void 0 : r.address,
            to: h,
            value:
              typeof g != 'undefined' &&
              `${sr(g)} ${((E = s == null ? void 0 : s.nativeCurrency) == null ? void 0 : E.symbol) || 'ETH'}`,
            data: o,
            gas: i,
            gasPrice: typeof c != 'undefined' && `${qe(c)} gwei`,
            maxFeePerGas: typeof d != 'undefined' && `${qe(d)} gwei`,
            maxPriorityFeePerGas: typeof p != 'undefined' && `${qe(p)} gwei`,
            nonce: u,
          });
          super(e.shortMessage, {
            cause: e,
            docsPath: n,
            metaMessages: [
              ...(e.metaMessages ? [...e.metaMessages, ' '] : []),
              'Request Arguments:',
              b,
            ].filter(Boolean),
            name: 'TransactionExecutionError',
          }),
            Object.defineProperty(this, 'cause', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.cause = e);
        }
      }),
      (Co = class extends I {
        constructor({
          blockHash: e,
          blockNumber: r,
          blockTag: n,
          hash: s,
          index: o,
        }) {
          let i = 'Transaction';
          n &&
            o !== void 0 &&
            (i = `Transaction at block time "${n}" at index "${o}"`),
            e &&
              o !== void 0 &&
              (i = `Transaction at block hash "${e}" at index "${o}"`),
            r &&
              o !== void 0 &&
              (i = `Transaction at block number "${r}" at index "${o}"`),
            s && (i = `Transaction with hash "${s}"`),
            super(`${i} could not be found.`, {
              name: 'TransactionNotFoundError',
            });
        }
      }),
      (Ao = class extends I {
        constructor({ hash: e }) {
          super(
            `Transaction receipt with hash "${e}" could not be found. The Transaction may not be processed on a block yet.`,
            { name: 'TransactionReceiptNotFoundError' }
          );
        }
      }),
      (ec = class extends I {
        constructor({ hash: e }) {
          super(
            `Timed out while waiting for transaction with hash "${e}" to be confirmed.`,
            { name: 'WaitForTransactionReceiptTimeoutError' }
          );
        }
      });
  });
var Em,
  Hn,
  tc = D(() => {
    f();
    (Em = t => t), (Hn = t => t);
  });
var Po,
  rc,
  jn,
  nc,
  oc,
  br,
  un = D(() => {
    f();
    Ne();
    ai();
    Dd();
    Sr();
    xm();
    an();
    li();
    Eo();
    $e();
    ce();
    Ld();
    Mr();
    tc();
    (Po = class extends I {
      constructor(
        e,
        {
          account: r,
          docsPath: n,
          chain: s,
          data: o,
          gas: i,
          gasPrice: c,
          maxFeePerGas: d,
          maxPriorityFeePerGas: p,
          nonce: u,
          to: h,
          value: g,
          stateOverride: b,
        }
      ) {
        var P;
        let E = r ? ae(r) : void 0,
          T = _n({
            from: E == null ? void 0 : E.address,
            to: h,
            value:
              typeof g != 'undefined' &&
              `${sr(g)} ${((P = s == null ? void 0 : s.nativeCurrency) == null ? void 0 : P.symbol) || 'ETH'}`,
            data: o,
            gas: i,
            gasPrice: typeof c != 'undefined' && `${qe(c)} gwei`,
            maxFeePerGas: typeof d != 'undefined' && `${qe(d)} gwei`,
            maxPriorityFeePerGas: typeof p != 'undefined' && `${qe(p)} gwei`,
            nonce: u,
          });
        b &&
          (T += `
${Tm(b)}`),
          super(e.shortMessage, {
            cause: e,
            docsPath: n,
            metaMessages: [
              ...(e.metaMessages ? [...e.metaMessages, ' '] : []),
              'Raw Call Arguments:',
              T,
            ].filter(Boolean),
            name: 'CallExecutionError',
          }),
          Object.defineProperty(this, 'cause', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          (this.cause = e);
      }
    }),
      (rc = class extends I {
        constructor(
          e,
          {
            abi: r,
            args: n,
            contractAddress: s,
            docsPath: o,
            functionName: i,
            sender: c,
          }
        ) {
          var g;
          let d = gt({ abi: r, args: n, name: i }),
            p = d
              ? Md({
                  abiItem: d,
                  args: n,
                  includeFunctionName: false,
                  includeName: false,
                })
              : void 0,
            u = d ? He(d, { includeName: true }) : void 0,
            h = _n({
              address: s && Em(s),
              function: u,
              args:
                p &&
                p !== '()' &&
                `${[...Array((g = i == null ? void 0 : i.length) != null ? g : 0).keys()].map(() => ' ').join('')}${p}`,
              sender: c,
            });
          super(
            e.shortMessage ||
              `An unknown error occurred while executing the contract function "${i}".`,
            {
              cause: e,
              docsPath: o,
              metaMessages: [
                ...(e.metaMessages ? [...e.metaMessages, ' '] : []),
                h && 'Contract Call:',
                h,
              ].filter(Boolean),
              name: 'ContractFunctionExecutionError',
            }
          ),
            Object.defineProperty(this, 'abi', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'args', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'cause', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'contractAddress', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'formattedArgs', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'functionName', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'sender', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.abi = r),
            (this.args = n),
            (this.cause = e),
            (this.contractAddress = s),
            (this.functionName = i),
            (this.sender = c);
        }
      }),
      (jn = class extends I {
        constructor({ abi: e, data: r, functionName: n, message: s }) {
          var u;
          let o, i, c, d;
          if (r && r !== '0x')
            try {
              i = Va({ abi: e, data: r });
              let { abiItem: h, errorName: g, args: b } = i;
              if (g === 'Error') d = b[0];
              else if (g === 'Panic') {
                let [E] = b;
                d = _a[E];
              } else {
                let E = h ? He(h, { includeName: true }) : void 0,
                  T =
                    h && b
                      ? Md({
                          abiItem: h,
                          args: b,
                          includeFunctionName: false,
                          includeName: false,
                        })
                      : void 0;
                c = [
                  E ? `Error: ${E}` : '',
                  T && T !== '()'
                    ? `       ${[...Array((u = g == null ? void 0 : g.length) != null ? u : 0).keys()].map(() => ' ').join('')}${T}`
                    : '',
                ];
              }
            } catch (h) {
              o = h;
            }
          else s && (d = s);
          let p;
          o instanceof mo &&
            ((p = o.signature),
            (c = [
              `Unable to decode signature "${p}" as it was not found on the provided ABI.`,
              'Make sure you are using the correct ABI and that the error exists on it.',
              `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${p}.`,
            ])),
            super(
              (d && d !== 'execution reverted') || p
                ? [
                    `The contract function "${n}" reverted with the following ${p ? 'signature' : 'reason'}:`,
                    d || p,
                  ].join(`
`)
                : `The contract function "${n}" reverted.`,
              {
                cause: o,
                metaMessages: c,
                name: 'ContractFunctionRevertedError',
              }
            ),
            Object.defineProperty(this, 'data', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'raw', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'reason', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'signature', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.data = i),
            (this.raw = r),
            (this.reason = d),
            (this.signature = p);
        }
      }),
      (nc = class extends I {
        constructor({ functionName: e }) {
          super(`The contract function "${e}" returned no data ("0x").`, {
            metaMessages: [
              'This could be due to any of the following:',
              `  - The contract does not have the function "${e}",`,
              '  - The parameters passed to the contract function may be invalid, or',
              '  - The address is not a contract.',
            ],
            name: 'ContractFunctionZeroDataError',
          });
        }
      }),
      (oc = class extends I {
        constructor({ factory: e }) {
          super(
            `Deployment for counterfactual contract call failed${e ? ` for factory "${e}".` : ''}`,
            {
              metaMessages: [
                'Please ensure:',
                '- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).',
                '- The `factoryData` is a valid encoded function call for contract deployment function on the factory.',
              ],
              name: 'CounterfactualDeploymentFailedError',
            }
          );
        }
      }),
      (br = class extends I {
        constructor({ data: e, message: r }) {
          super(r || '', { name: 'RawContractError' }),
            Object.defineProperty(this, 'code', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: 3,
            }),
            Object.defineProperty(this, 'data', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.data = e);
        }
      });
  });
var Lt,
  dn,
  fi,
  qn = D(() => {
    f();
    st();
    ce();
    tc();
    (Lt = class extends I {
      constructor({
        body: e,
        cause: r,
        details: n,
        headers: s,
        status: o,
        url: i,
      }) {
        super('HTTP request failed.', {
          cause: r,
          details: n,
          metaMessages: [
            o && `Status: ${o}`,
            `URL: ${Hn(i)}`,
            e && `Request body: ${ue(e)}`,
          ].filter(Boolean),
          name: 'HttpRequestError',
        }),
          Object.defineProperty(this, 'body', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          Object.defineProperty(this, 'headers', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          Object.defineProperty(this, 'status', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          Object.defineProperty(this, 'url', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0,
          }),
          (this.body = e),
          (this.headers = s),
          (this.status = o),
          (this.url = i);
      }
    }),
      (dn = class extends I {
        constructor({ body: e, error: r, url: n }) {
          super('RPC Request failed.', {
            cause: r,
            details: r.message,
            metaMessages: [`URL: ${Hn(n)}`, `Request body: ${ue(e)}`],
            name: 'RpcRequestError',
          }),
            Object.defineProperty(this, 'code', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            Object.defineProperty(this, 'data', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.code = r.code),
            (this.data = r.data);
        }
      }),
      (fi = class extends I {
        constructor({ body: e, url: r }) {
          super('The request took too long to respond.', {
            details: 'The request timed out.',
            metaMessages: [`URL: ${Hn(r)}`, `Request body: ${ue(e)}`],
            name: 'TimeoutError',
          });
        }
      });
  });
var zx,
  it,
  ft,
  ko,
  $o,
  Bo,
  Io,
  Ur,
  xr,
  So,
  Ro,
  No,
  ln,
  Vn,
  Fo,
  Gn,
  Oo,
  Do,
  Mo,
  Uo,
  Lo,
  zo,
  _o,
  Ho,
  jo,
  qo,
  Vo,
  Go,
  sc,
  pi = D(() => {
    f();
    ce();
    qn();
    (zx = -1),
      (it = class extends I {
        constructor(
          e,
          { code: r, docsPath: n, metaMessages: s, name: o, shortMessage: i }
        ) {
          super(i, {
            cause: e,
            docsPath: n,
            metaMessages: s || (e == null ? void 0 : e.metaMessages),
            name: o || 'RpcError',
          }),
            Object.defineProperty(this, 'code', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.name = o || e.name),
            (this.code = e instanceof dn ? e.code : r != null ? r : zx);
        }
      }),
      (ft = class extends it {
        constructor(e, r) {
          super(e, r),
            Object.defineProperty(this, 'data', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0,
            }),
            (this.data = r.data);
        }
      }),
      (ko = class t extends it {
        constructor(e) {
          super(e, {
            code: t.code,
            name: 'ParseRpcError',
            shortMessage:
              'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
          });
        }
      });
    Object.defineProperty(ko, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32700,
    });
    $o = class t extends it {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'InvalidRequestRpcError',
          shortMessage: 'JSON is not a valid request object.',
        });
      }
    };
    Object.defineProperty($o, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32600,
    });
    Bo = class t extends it {
      constructor(e, { method: r } = {}) {
        super(e, {
          code: t.code,
          name: 'MethodNotFoundRpcError',
          shortMessage: `The method${r ? ` "${r}"` : ''} does not exist / is not available.`,
        });
      }
    };
    Object.defineProperty(Bo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32601,
    });
    Io = class t extends it {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'InvalidParamsRpcError',
          shortMessage: [
            'Invalid parameters were provided to the RPC method.',
            'Double check you have provided the correct parameters.',
          ].join(`
`),
        });
      }
    };
    Object.defineProperty(Io, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32602,
    });
    Ur = class t extends it {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'InternalRpcError',
          shortMessage: 'An internal error was received.',
        });
      }
    };
    Object.defineProperty(Ur, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32603,
    });
    xr = class t extends it {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'InvalidInputRpcError',
          shortMessage: [
            'Missing or invalid parameters.',
            'Double check you have provided the correct parameters.',
          ].join(`
`),
        });
      }
    };
    Object.defineProperty(xr, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32e3,
    });
    So = class t extends it {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'ResourceNotFoundRpcError',
          shortMessage: 'Requested resource not found.',
        }),
          Object.defineProperty(this, 'name', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ResourceNotFoundRpcError',
          });
      }
    };
    Object.defineProperty(So, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32001,
    });
    Ro = class t extends it {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'ResourceUnavailableRpcError',
          shortMessage: 'Requested resource not available.',
        });
      }
    };
    Object.defineProperty(Ro, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32002,
    });
    No = class t extends it {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'TransactionRejectedRpcError',
          shortMessage: 'Transaction creation failed.',
        });
      }
    };
    Object.defineProperty(No, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32003,
    });
    ln = class t extends it {
      constructor(e, { method: r } = {}) {
        super(e, {
          code: t.code,
          name: 'MethodNotSupportedRpcError',
          shortMessage: `Method${r ? ` "${r}"` : ''} is not supported.`,
        });
      }
    };
    Object.defineProperty(ln, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32004,
    });
    Vn = class t extends it {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'LimitExceededRpcError',
          shortMessage: 'Request exceeds defined limit.',
        });
      }
    };
    Object.defineProperty(Vn, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32005,
    });
    Fo = class t extends it {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'JsonRpcVersionUnsupportedError',
          shortMessage: 'Version of JSON-RPC protocol is not supported.',
        });
      }
    };
    Object.defineProperty(Fo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32006,
    });
    Gn = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'UserRejectedRequestError',
          shortMessage: 'User rejected the request.',
        });
      }
    };
    Object.defineProperty(Gn, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4001,
    });
    Oo = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'UnauthorizedProviderError',
          shortMessage:
            'The requested method and/or account has not been authorized by the user.',
        });
      }
    };
    Object.defineProperty(Oo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4100,
    });
    Do = class t extends ft {
      constructor(e, { method: r } = {}) {
        super(e, {
          code: t.code,
          name: 'UnsupportedProviderMethodError',
          shortMessage: `The Provider does not support the requested method${r ? ` " ${r}"` : ''}.`,
        });
      }
    };
    Object.defineProperty(Do, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4200,
    });
    Mo = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'ProviderDisconnectedError',
          shortMessage: 'The Provider is disconnected from all chains.',
        });
      }
    };
    Object.defineProperty(Mo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4900,
    });
    Uo = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'ChainDisconnectedError',
          shortMessage: 'The Provider is not connected to the requested chain.',
        });
      }
    };
    Object.defineProperty(Uo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4901,
    });
    Lo = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'SwitchChainError',
          shortMessage: 'An error occurred when attempting to switch chain.',
        });
      }
    };
    Object.defineProperty(Lo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4902,
    });
    zo = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'UnsupportedNonOptionalCapabilityError',
          shortMessage:
            'This Wallet does not support a capability that was not marked as optional.',
        });
      }
    };
    Object.defineProperty(zo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5700,
    });
    _o = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'UnsupportedChainIdError',
          shortMessage: 'This Wallet does not support the requested chain ID.',
        });
      }
    };
    Object.defineProperty(_o, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5710,
    });
    Ho = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'DuplicateIdError',
          shortMessage: 'There is already a bundle submitted with this ID.',
        });
      }
    };
    Object.defineProperty(Ho, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5720,
    });
    jo = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'UnknownBundleIdError',
          shortMessage: 'This bundle id is unknown / has not been submitted',
        });
      }
    };
    Object.defineProperty(jo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5730,
    });
    qo = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'BundleTooLargeError',
          shortMessage:
            'The call bundle is too large for the Wallet to process.',
        });
      }
    };
    Object.defineProperty(qo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5740,
    });
    Vo = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'AtomicReadyWalletRejectedUpgradeError',
          shortMessage:
            'The Wallet can support atomicity after an upgrade, but the user rejected the upgrade.',
        });
      }
    };
    Object.defineProperty(Vo, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5750,
    });
    Go = class t extends ft {
      constructor(e) {
        super(e, {
          code: t.code,
          name: 'AtomicityNotSupportedError',
          shortMessage:
            'The wallet does not support atomic execution but the request requires it.',
        });
      }
    };
    Object.defineProperty(Go, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5760,
    });
    sc = class extends it {
      constructor(e) {
        super(e, {
          name: 'UnknownRpcError',
          shortMessage: 'An unknown RPC error occurred.',
        });
      }
    };
  });
function Hx(t, e, r, n) {
  if (typeof t.setBigUint64 == 'function') return t.setBigUint64(e, r, n);
  let s = BigInt(32),
    o = BigInt(4294967295),
    i = Number((r >> s) & o),
    c = Number(r & o),
    d = n ? 4 : 0,
    p = n ? 0 : 4;
  t.setUint32(e + d, i, n), t.setUint32(e + p, c, n);
}
function Am(t, e, r) {
  return (t & e) ^ (~t & r);
}
function Pm(t, e, r) {
  return (t & e) ^ (t & r) ^ (e & r);
}
var ic,
  km = D(() => {
    f();
    ri();
    Un();
    ic = class extends en {
      constructor(e, r, n, s) {
        super(),
          (this.finished = false),
          (this.length = 0),
          (this.pos = 0),
          (this.destroyed = false),
          (this.blockLen = e),
          (this.outputLen = r),
          (this.padOffset = n),
          (this.isLE = s),
          (this.buffer = new Uint8Array(e)),
          (this.view = Ra(this.buffer));
      }
      update(e) {
        Fr(this);
        let { view: r, buffer: n, blockLen: s } = this;
        e = tn(e);
        let o = e.length;
        for (let i = 0; i < o; ) {
          let c = Math.min(s - this.pos, o - i);
          if (c === s) {
            let d = Ra(e);
            for (; s <= o - i; i += s) this.process(d, i);
            continue;
          }
          n.set(e.subarray(i, i + c), this.pos),
            (this.pos += c),
            (i += c),
            this.pos === s && (this.process(r, 0), (this.pos = 0));
        }
        return (this.length += e.length), this.roundClean(), this;
      }
      digestInto(e) {
        Fr(this), Ia(e, this), (this.finished = true);
        let { buffer: r, view: n, blockLen: s, isLE: o } = this,
          { pos: i } = this;
        (r[i++] = 128),
          this.buffer.subarray(i).fill(0),
          this.padOffset > s - i && (this.process(n, 0), (i = 0));
        for (let h = i; h < s; h++) r[h] = 0;
        Hx(n, s - 8, BigInt(this.length * 8), o), this.process(n, 0);
        let c = Ra(e),
          d = this.outputLen;
        if (d % 4)
          throw new Error('_sha2: outputLen should be aligned to 32bit');
        let p = d / 4,
          u = this.get();
        if (p > u.length) throw new Error('_sha2: outputLen bigger than state');
        for (let h = 0; h < p; h++) c.setUint32(4 * h, u[h], o);
      }
      digest() {
        let { buffer: e, outputLen: r } = this;
        this.digestInto(e);
        let n = e.slice(0, r);
        return this.destroy(), n;
      }
      _cloneInto(e) {
        e || (e = new this.constructor()), e.set(...this.get());
        let {
          blockLen: r,
          buffer: n,
          length: s,
          finished: o,
          destroyed: i,
          pos: c,
        } = this;
        return (
          (e.length = s),
          (e.pos = c),
          (e.finished = o),
          (e.destroyed = i),
          s % r && e.buffer.set(n),
          e
        );
      }
    };
  });
var jx,
  fn,
  pn,
  zd,
  mn,
  _d = D(() => {
    f();
    km();
    Un();
    (jx = new Uint32Array([
      1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
      2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
      1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
      264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
      2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
      113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
      1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
      3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
      430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
      1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
      2428436474, 2756734187, 3204031479, 3329325298,
    ])),
      (fn = new Uint32Array([
        1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924,
        528734635, 1541459225,
      ])),
      (pn = new Uint32Array(64)),
      (zd = class extends ic {
        constructor(e = 32) {
          super(64, e, 8, false),
            (this.A = fn[0] | 0),
            (this.B = fn[1] | 0),
            (this.C = fn[2] | 0),
            (this.D = fn[3] | 0),
            (this.E = fn[4] | 0),
            (this.F = fn[5] | 0),
            (this.G = fn[6] | 0),
            (this.H = fn[7] | 0);
        }
        get() {
          let { A: e, B: r, C: n, D: s, E: o, F: i, G: c, H: d } = this;
          return [e, r, n, s, o, i, c, d];
        }
        set(e, r, n, s, o, i, c, d) {
          (this.A = e | 0),
            (this.B = r | 0),
            (this.C = n | 0),
            (this.D = s | 0),
            (this.E = o | 0),
            (this.F = i | 0),
            (this.G = c | 0),
            (this.H = d | 0);
        }
        process(e, r) {
          for (let h = 0; h < 16; h++, r += 4) pn[h] = e.getUint32(r, false);
          for (let h = 16; h < 64; h++) {
            let g = pn[h - 15],
              b = pn[h - 2],
              E = tr(g, 7) ^ tr(g, 18) ^ (g >>> 3),
              T = tr(b, 17) ^ tr(b, 19) ^ (b >>> 10);
            pn[h] = (T + pn[h - 7] + E + pn[h - 16]) | 0;
          }
          let { A: n, B: s, C: o, D: i, E: c, F: d, G: p, H: u } = this;
          for (let h = 0; h < 64; h++) {
            let g = tr(c, 6) ^ tr(c, 11) ^ tr(c, 25),
              b = (u + g + Am(c, d, p) + jx[h] + pn[h]) | 0,
              T = ((tr(n, 2) ^ tr(n, 13) ^ tr(n, 22)) + Pm(n, s, o)) | 0;
            (u = p),
              (p = d),
              (d = c),
              (c = (i + b) | 0),
              (i = o),
              (o = s),
              (s = n),
              (n = (b + T) | 0);
          }
          (n = (n + this.A) | 0),
            (s = (s + this.B) | 0),
            (o = (o + this.C) | 0),
            (i = (i + this.D) | 0),
            (c = (c + this.E) | 0),
            (d = (d + this.F) | 0),
            (p = (p + this.G) | 0),
            (u = (u + this.H) | 0),
            this.set(n, s, o, i, c, d, p, u);
        }
        roundClean() {
          pn.fill(0);
        }
        destroy() {
          this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
        }
      }),
      (mn = Na(() => new zd()));
  });
var $m = D(() => {
  f();
  _d();
});
var ac,
  Hd,
  Bm = D(() => {
    f();
    ri();
    Un();
    (ac = class extends en {
      constructor(e, r) {
        super(), (this.finished = false), (this.destroyed = false), Fp(e);
        let n = tn(r);
        if (((this.iHash = e.create()), typeof this.iHash.update != 'function'))
          throw new Error(
            'Expected instance of class which extends utils.Hash'
          );
        (this.blockLen = this.iHash.blockLen),
          (this.outputLen = this.iHash.outputLen);
        let s = this.blockLen,
          o = new Uint8Array(s);
        o.set(n.length > s ? e.create().update(n).digest() : n);
        for (let i = 0; i < o.length; i++) o[i] ^= 54;
        this.iHash.update(o), (this.oHash = e.create());
        for (let i = 0; i < o.length; i++) o[i] ^= 106;
        this.oHash.update(o), o.fill(0);
      }
      update(e) {
        return Fr(this), this.iHash.update(e), this;
      }
      digestInto(e) {
        Fr(this),
          Qr(e, this.outputLen),
          (this.finished = true),
          this.iHash.digestInto(e),
          this.oHash.update(e),
          this.oHash.digestInto(e),
          this.destroy();
      }
      digest() {
        let e = new Uint8Array(this.oHash.outputLen);
        return this.digestInto(e), e;
      }
      _cloneInto(e) {
        e || (e = Object.create(Object.getPrototypeOf(this), {}));
        let {
          oHash: r,
          iHash: n,
          finished: s,
          destroyed: o,
          blockLen: i,
          outputLen: c,
        } = this;
        return (
          (e = e),
          (e.finished = s),
          (e.destroyed = o),
          (e.blockLen = i),
          (e.outputLen = c),
          (e.oHash = r._cloneInto(e.oHash)),
          (e.iHash = n._cloneInto(e.iHash)),
          e
        );
      }
      destroy() {
        (this.destroyed = true), this.oHash.destroy(), this.iHash.destroy();
      }
    }),
      (Hd = (t, e, r) => new ac(t, e).update(r).digest());
    Hd.create = (t, e) => new ac(t, e);
  });
function Wn(t) {
  return (
    t instanceof Uint8Array ||
    (ArrayBuffer.isView(t) && t.constructor.name === 'Uint8Array')
  );
}
function zr(t) {
  if (!Wn(t)) throw new Error('Uint8Array expected');
}
function Wo(t, e) {
  if (typeof e != 'boolean') throw new Error(t + ' boolean expected, got ' + e);
}
function mi(t) {
  let e = t.toString(16);
  return e.length & 1 ? '0' + e : e;
}
function Rm(t) {
  if (typeof t != 'string')
    throw new Error('hex string expected, got ' + typeof t);
  return t === '' ? Gd : BigInt('0x' + t);
}
function Zo(t) {
  if ((zr(t), Nm)) return t.toHex();
  let e = '';
  for (let r = 0; r < t.length; r++) e += qx[t[r]];
  return e;
}
function Im(t) {
  if (t >= Lr._0 && t <= Lr._9) return t - Lr._0;
  if (t >= Lr.A && t <= Lr.F) return t - (Lr.A - 10);
  if (t >= Lr.a && t <= Lr.f) return t - (Lr.a - 10);
}
function hi(t) {
  if (typeof t != 'string')
    throw new Error('hex string expected, got ' + typeof t);
  if (Nm) return Uint8Array.fromHex(t);
  let e = t.length,
    r = e / 2;
  if (e % 2)
    throw new Error('hex string expected, got unpadded hex of length ' + e);
  let n = new Uint8Array(r);
  for (let s = 0, o = 0; s < r; s++, o += 2) {
    let i = Im(t.charCodeAt(o)),
      c = Im(t.charCodeAt(o + 1));
    if (i === void 0 || c === void 0) {
      let d = t[o] + t[o + 1];
      throw new Error(
        'hex string expected, got non-hex character "' + d + '" at index ' + o
      );
    }
    n[s] = i * 16 + c;
  }
  return n;
}
function bt(t) {
  return Rm(Zo(t));
}
function Wd(t) {
  return zr(t), Rm(Zo(Uint8Array.from(t).reverse()));
}
function wr(t, e) {
  return hi(t.toString(16).padStart(e * 2, '0'));
}
function Zd(t, e) {
  return wr(t, e).reverse();
}
function Ve(t, e, r) {
  let n;
  if (typeof e == 'string')
    try {
      n = hi(e);
    } catch (o) {
      throw new Error(t + ' must be hex string or Uint8Array, cause: ' + o);
    }
  else if (Wn(e)) n = Uint8Array.from(e);
  else throw new Error(t + ' must be hex string or Uint8Array');
  let s = n.length;
  if (typeof r == 'number' && s !== r)
    throw new Error(t + ' of length ' + r + ' expected, got ' + s);
  return n;
}
function pt(...t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    let s = t[n];
    zr(s), (e += s.length);
  }
  let r = new Uint8Array(e);
  for (let n = 0, s = 0; n < t.length; n++) {
    let o = t[n];
    r.set(o, s), (s += o.length);
  }
  return r;
}
function cc(t) {
  if (typeof t != 'string') throw new Error('string expected');
  return new Uint8Array(new TextEncoder().encode(t));
}
function Zn(t, e, r) {
  return jd(t) && jd(e) && jd(r) && e <= t && t < r;
}
function _r(t, e, r, n) {
  if (!Zn(e, r, n))
    throw new Error(
      'expected valid ' + t + ': ' + r + ' <= n < ' + n + ', got ' + e
    );
}
function Fm(t) {
  let e;
  for (e = 0; t > Gd; t >>= Vd, e += 1);
  return e;
}
function Om(t, e, r) {
  if (typeof t != 'number' || t < 2)
    throw new Error('hashLen must be a number');
  if (typeof e != 'number' || e < 2)
    throw new Error('qByteLen must be a number');
  if (typeof r != 'function') throw new Error('hmacFn must be a function');
  let n = qd(t),
    s = qd(t),
    o = 0,
    i = () => {
      n.fill(1), s.fill(0), (o = 0);
    },
    c = (...h) => r(s, n, ...h),
    d = (h = qd(0)) => {
      (s = c(Sm([0]), h)),
        (n = c()),
        h.length !== 0 && ((s = c(Sm([1]), h)), (n = c()));
    },
    p = () => {
      if (o++ >= 1e3) throw new Error('drbg: tried 1000 values');
      let h = 0,
        g = [];
      for (; h < e; ) {
        n = c();
        let b = n.slice();
        g.push(b), (h += n.length);
      }
      return pt(...g);
    };
  return (h, g) => {
    i(), d(h);
    let b;
    for (; !(b = g(p())); ) d();
    return i(), b;
  };
}
function Hr(t, e, r = {}) {
  let n = (s, o, i) => {
    let c = Vx[o];
    if (typeof c != 'function') throw new Error('invalid validator function');
    let d = t[s];
    if (!(i && d === void 0) && !c(d, t))
      throw new Error(
        'param ' + String(s) + ' is invalid. Expected ' + o + ', got ' + d
      );
  };
  for (let [s, o] of Object.entries(e)) n(s, o, false);
  for (let [s, o] of Object.entries(r)) n(s, o, true);
  return t;
}
function Kd(t) {
  let e = new WeakMap();
  return (r, ...n) => {
    let s = e.get(r);
    if (s !== void 0) return s;
    let o = t(r, ...n);
    return e.set(r, o), o;
  };
}
var Gd,
  Vd,
  Nm,
  qx,
  Lr,
  jd,
  Kn,
  qd,
  Sm,
  Vx,
  Ko = D(() => {
    f();
    (Gd = BigInt(0)), (Vd = BigInt(1));
    (Nm =
      typeof Uint8Array.from([]).toHex == 'function' &&
      typeof Uint8Array.fromHex == 'function'),
      (qx = Array.from({ length: 256 }, (t, e) =>
        e.toString(16).padStart(2, '0')
      ));
    Lr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    jd = t => typeof t == 'bigint' && Gd <= t;
    (Kn = t => (Vd << BigInt(t)) - Vd),
      (qd = t => new Uint8Array(t)),
      (Sm = t => Uint8Array.from(t));
    Vx = {
      bigint: t => typeof t == 'bigint',
      function: t => typeof t == 'function',
      boolean: t => typeof t == 'boolean',
      string: t => typeof t == 'string',
      stringOrUint8Array: t => typeof t == 'string' || Wn(t),
      isSafeInteger: t => Number.isSafeInteger(t),
      array: t => Array.isArray(t),
      field: (t, e) => e.Fp.isValid(t),
      hash: t => typeof t == 'function' && Number.isSafeInteger(t.outputLen),
    };
  });
function Fe(t, e) {
  let r = t % e;
  return r >= Ge ? r : e + r;
}
function Kx(t, e, r) {
  if (e < Ge) throw new Error('invalid exponent, negatives unsupported');
  if (r <= Ge) throw new Error('invalid modulus');
  if (r === Be) return Ge;
  let n = Be;
  for (; e > Ge; ) e & Be && (n = (n * t) % r), (t = (t * t) % r), (e >>= Be);
  return n;
}
function St(t, e, r) {
  let n = t;
  for (; e-- > Ge; ) (n *= n), (n %= r);
  return n;
}
function uc(t, e) {
  if (t === Ge) throw new Error('invert: expected non-zero number');
  if (e <= Ge) throw new Error('invert: expected positive modulus, got ' + e);
  let r = Fe(t, e),
    n = e,
    s = Ge,
    i = Be;
  for (; r !== Ge; ) {
    let p = n / r,
      u = n % r,
      h = s - i * p;
    (n = r), (r = u), (s = i), (i = h);
  }
  if (n !== Be) throw new Error('invert: does not exist');
  return Fe(s, e);
}
function Jx(t) {
  let e = (t - Be) / Jn,
    r,
    n,
    s;
  for (r = t - Be, n = 0; r % Jn === Ge; r /= Jn, n++);
  for (s = Jn; s < t && Kx(s, e, t) !== t - Be; s++)
    if (s > 1e3) throw new Error('Cannot find square root: likely non-prime P');
  if (n === 1) {
    let i = (t + Be) / Jd;
    return function (d, p) {
      let u = d.pow(p, i);
      if (!d.eql(d.sqr(u), p)) throw new Error('Cannot find square root');
      return u;
    };
  }
  let o = (r + Be) / Jn;
  return function (c, d) {
    if (c.pow(d, e) === c.neg(c.ONE))
      throw new Error('Cannot find square root');
    let p = n,
      u = c.pow(c.mul(c.ONE, s), r),
      h = c.pow(d, o),
      g = c.pow(d, r);
    for (; !c.eql(g, c.ONE); ) {
      if (c.eql(g, c.ZERO)) return c.ZERO;
      let b = 1;
      for (let T = c.sqr(g); b < p && !c.eql(T, c.ONE); b++) T = c.sqr(T);
      let E = c.pow(u, Be << BigInt(p - b - 1));
      (u = c.sqr(E)), (h = c.mul(h, E)), (g = c.mul(g, u)), (p = b);
    }
    return h;
  };
}
function Yx(t) {
  if (t % Jd === Gx) {
    let e = (t + Be) / Jd;
    return function (n, s) {
      let o = n.pow(s, e);
      if (!n.eql(n.sqr(o), s)) throw new Error('Cannot find square root');
      return o;
    };
  }
  if (t % Mm === Dm) {
    let e = (t - Dm) / Mm;
    return function (n, s) {
      let o = n.mul(s, Jn),
        i = n.pow(o, e),
        c = n.mul(s, i),
        d = n.mul(n.mul(c, Jn), i),
        p = n.mul(c, n.sub(d, n.ONE));
      if (!n.eql(n.sqr(p), s)) throw new Error('Cannot find square root');
      return p;
    };
  }
  return Jx(t);
}
function dc(t) {
  let e = {
      ORDER: 'bigint',
      MASK: 'bigint',
      BYTES: 'isSafeInteger',
      BITS: 'isSafeInteger',
    },
    r = Xx.reduce((n, s) => ((n[s] = 'function'), n), e);
  return Hr(t, r);
}
function Qx(t, e, r) {
  if (r < Ge) throw new Error('invalid exponent, negatives unsupported');
  if (r === Ge) return t.ONE;
  if (r === Be) return e;
  let n = t.ONE,
    s = e;
  for (; r > Ge; ) r & Be && (n = t.mul(n, s)), (s = t.sqr(s)), (r >>= Be);
  return n;
}
function ew(t, e) {
  let r = new Array(e.length),
    n = e.reduce(
      (o, i, c) => (t.is0(i) ? o : ((r[c] = o), t.mul(o, i))),
      t.ONE
    ),
    s = t.inv(n);
  return (
    e.reduceRight(
      (o, i, c) => (t.is0(i) ? o : ((r[c] = t.mul(o, r[c])), t.mul(o, i))),
      s
    ),
    r
  );
}
function Yd(t, e) {
  let r = e !== void 0 ? e : t.toString(2).length,
    n = Math.ceil(r / 8);
  return { nBitLength: r, nByteLength: n };
}
function lc(t, e, r = false, n = {}) {
  if (t <= Ge) throw new Error('invalid field: expected ORDER > 0, got ' + t);
  let { nBitLength: s, nByteLength: o } = Yd(t, e);
  if (o > 2048)
    throw new Error('invalid field: expected ORDER of <= 2048 bytes');
  let i,
    c = Object.freeze({
      ORDER: t,
      isLE: r,
      BITS: s,
      BYTES: o,
      MASK: Kn(s),
      ZERO: Ge,
      ONE: Be,
      create: d => Fe(d, t),
      isValid: d => {
        if (typeof d != 'bigint')
          throw new Error(
            'invalid field element: expected bigint, got ' + typeof d
          );
        return Ge <= d && d < t;
      },
      is0: d => d === Ge,
      isOdd: d => (d & Be) === Be,
      neg: d => Fe(-d, t),
      eql: (d, p) => d === p,
      sqr: d => Fe(d * d, t),
      add: (d, p) => Fe(d + p, t),
      sub: (d, p) => Fe(d - p, t),
      mul: (d, p) => Fe(d * p, t),
      pow: (d, p) => Qx(c, d, p),
      div: (d, p) => Fe(d * uc(p, t), t),
      sqrN: d => d * d,
      addN: (d, p) => d + p,
      subN: (d, p) => d - p,
      mulN: (d, p) => d * p,
      inv: d => uc(d, t),
      sqrt: n.sqrt || (d => (i || (i = Yx(t)), i(c, d))),
      invertBatch: d => ew(c, d),
      cmov: (d, p, u) => (u ? p : d),
      toBytes: d => (r ? Zd(d, o) : wr(d, o)),
      fromBytes: d => {
        if (d.length !== o)
          throw new Error(
            'Field.fromBytes: expected ' + o + ' bytes, got ' + d.length
          );
        return r ? Wd(d) : bt(d);
      },
    });
  return Object.freeze(c);
}
function Um(t) {
  if (typeof t != 'bigint') throw new Error('field order must be bigint');
  let e = t.toString(2).length;
  return Math.ceil(e / 8);
}
function Xd(t) {
  let e = Um(t);
  return e + Math.ceil(e / 2);
}
function Lm(t, e, r = false) {
  let n = t.length,
    s = Um(e),
    o = Xd(e);
  if (n < 16 || n < o || n > 1024)
    throw new Error('expected ' + o + '-1024 bytes of input, got ' + n);
  let i = r ? Wd(t) : bt(t),
    c = Fe(i, e - Be) + Be;
  return r ? Zd(c, s) : wr(c, s);
}
var Ge,
  Be,
  Jn,
  Gx,
  Jd,
  Dm,
  Mm,
  Xx,
  gi = D(() => {
    f();
    Ko();
    (Ge = BigInt(0)),
      (Be = BigInt(1)),
      (Jn = BigInt(2)),
      (Gx = BigInt(3)),
      (Jd = BigInt(4)),
      (Dm = BigInt(5)),
      (Mm = BigInt(8)),
      BigInt(9),
      BigInt(16);
    Xx = [
      'create',
      'isValid',
      'is0',
      'neg',
      'inv',
      'sqrt',
      'sqr',
      'eql',
      'add',
      'sub',
      'mul',
      'pow',
      'div',
      'addN',
      'subN',
      'mulN',
      'sqrN',
    ];
  });
function Qd(t, e) {
  let r = e.negate();
  return t ? r : e;
}
function Hm(t, e) {
  if (!Number.isSafeInteger(t) || t <= 0 || t > e)
    throw new Error('invalid window size, expected [1..' + e + '], got W=' + t);
}
function el(t, e) {
  Hm(t, e);
  let r = Math.ceil(e / t) + 1,
    n = 2 ** (t - 1),
    s = 2 ** t,
    o = Kn(t),
    i = BigInt(t);
  return { windows: r, windowSize: n, mask: o, maxNumber: s, shiftBy: i };
}
function _m(t, e, r) {
  let { windowSize: n, mask: s, maxNumber: o, shiftBy: i } = r,
    c = Number(t & s),
    d = t >> i;
  c > n && ((c -= o), (d += nl));
  let p = e * n,
    u = p + Math.abs(c) - 1,
    h = c === 0,
    g = c < 0,
    b = e % 2 !== 0;
  return { nextN: d, offset: u, isZero: h, isNeg: g, isNegF: b, offsetF: p };
}
function tw(t, e) {
  if (!Array.isArray(t)) throw new Error('array expected');
  t.forEach((r, n) => {
    if (!(r instanceof e)) throw new Error('invalid point at index ' + n);
  });
}
function rw(t, e) {
  if (!Array.isArray(t)) throw new Error('array of scalars expected');
  t.forEach((r, n) => {
    if (!e.isValid(r)) throw new Error('invalid scalar at index ' + n);
  });
}
function rl(t) {
  return jm.get(t) || 1;
}
function qm(t, e) {
  return {
    constTimeNegate: Qd,
    hasPrecomputes(r) {
      return rl(r) !== 1;
    },
    unsafeLadder(r, n, s = t.ZERO) {
      let o = r;
      for (; n > zm; ) n & nl && (s = s.add(o)), (o = o.double()), (n >>= nl);
      return s;
    },
    precomputeWindow(r, n) {
      let { windows: s, windowSize: o } = el(n, e),
        i = [],
        c = r,
        d = c;
      for (let p = 0; p < s; p++) {
        (d = c), i.push(d);
        for (let u = 1; u < o; u++) (d = d.add(c)), i.push(d);
        c = d.double();
      }
      return i;
    },
    wNAF(r, n, s) {
      let o = t.ZERO,
        i = t.BASE,
        c = el(r, e);
      for (let d = 0; d < c.windows; d++) {
        let {
          nextN: p,
          offset: u,
          isZero: h,
          isNeg: g,
          isNegF: b,
          offsetF: E,
        } = _m(s, d, c);
        (s = p), h ? (i = i.add(Qd(b, n[E]))) : (o = o.add(Qd(g, n[u])));
      }
      return { p: o, f: i };
    },
    wNAFUnsafe(r, n, s, o = t.ZERO) {
      let i = el(r, e);
      for (let c = 0; c < i.windows && s !== zm; c++) {
        let { nextN: d, offset: p, isZero: u, isNeg: h } = _m(s, c, i);
        if (((s = d), !u)) {
          let g = n[p];
          o = o.add(h ? g.negate() : g);
        }
      }
      return o;
    },
    getPrecomputes(r, n, s) {
      let o = tl.get(n);
      return (
        o || ((o = this.precomputeWindow(n, r)), r !== 1 && tl.set(n, s(o))), o
      );
    },
    wNAFCached(r, n, s) {
      let o = rl(r);
      return this.wNAF(o, this.getPrecomputes(o, r, s), n);
    },
    wNAFCachedUnsafe(r, n, s, o) {
      let i = rl(r);
      return i === 1
        ? this.unsafeLadder(r, n, o)
        : this.wNAFUnsafe(i, this.getPrecomputes(i, r, s), n, o);
    },
    setWindowSize(r, n) {
      Hm(n, e), jm.set(r, n), tl.delete(r);
    },
  };
}
function Vm(t, e, r, n) {
  if ((tw(r, t), rw(n, e), r.length !== n.length))
    throw new Error('arrays of points and scalars must have equal length');
  let s = t.ZERO,
    o = Fm(BigInt(r.length)),
    i = o > 12 ? o - 3 : o > 4 ? o - 2 : o ? 2 : 1,
    c = Kn(i),
    d = new Array(Number(c) + 1).fill(s),
    p = Math.floor((e.BITS - 1) / i) * i,
    u = s;
  for (let h = p; h >= 0; h -= i) {
    d.fill(s);
    for (let b = 0; b < n.length; b++) {
      let E = n[b],
        T = Number((E >> BigInt(h)) & c);
      d[T] = d[T].add(r[b]);
    }
    let g = s;
    for (let b = d.length - 1, E = s; b > 0; b--)
      (E = E.add(d[b])), (g = g.add(E));
    if (((u = u.add(g)), h !== 0)) for (let b = 0; b < i; b++) u = u.double();
  }
  return u;
}
function ol(t) {
  return (
    dc(t.Fp),
    Hr(
      t,
      { n: 'bigint', h: 'bigint', Gx: 'field', Gy: 'field' },
      { nBitLength: 'isSafeInteger', nByteLength: 'isSafeInteger' }
    ),
    Object.freeze({ ...Yd(t.n, t.nBitLength), ...t, p: t.Fp.ORDER })
  );
}
var zm,
  nl,
  tl,
  jm,
  Gm = D(() => {
    f();
    gi();
    Ko();
    (zm = BigInt(0)), (nl = BigInt(1));
    (tl = new WeakMap()), (jm = new WeakMap());
  });
function Wm(t) {
  t.lowS !== void 0 && Wo('lowS', t.lowS),
    t.prehash !== void 0 && Wo('prehash', t.prehash);
}
function nw(t) {
  let e = ol(t);
  Hr(
    e,
    { a: 'field', b: 'field' },
    {
      allowedPrivateKeyLengths: 'array',
      wrapPrivateKey: 'boolean',
      isTorsionFree: 'function',
      clearCofactor: 'function',
      allowInfinityPoint: 'boolean',
      fromBytes: 'function',
      toBytes: 'function',
    }
  );
  let { endo: r, Fp: n, a: s } = e;
  if (r) {
    if (!n.eql(s, n.ZERO))
      throw new Error(
        'invalid endomorphism, can only be defined for Koblitz curves that have a=0'
      );
    if (
      typeof r != 'object' ||
      typeof r.beta != 'bigint' ||
      typeof r.splitScalar != 'function'
    )
      throw new Error(
        'invalid endomorphism, expected beta: bigint and splitScalar: function'
      );
  }
  return Object.freeze({ ...e });
}
function ow(t) {
  let e = nw(t),
    { Fp: r } = e,
    n = lc(e.n, e.nBitLength),
    s =
      e.toBytes ||
      ((T, P, v) => {
        let C = P.toAffine();
        return pt(Uint8Array.from([4]), r.toBytes(C.x), r.toBytes(C.y));
      }),
    o =
      e.fromBytes ||
      (T => {
        let P = T.subarray(1),
          v = r.fromBytes(P.subarray(0, r.BYTES)),
          C = r.fromBytes(P.subarray(r.BYTES, 2 * r.BYTES));
        return { x: v, y: C };
      });
  function i(T) {
    let { a: P, b: v } = e,
      C = r.sqr(T),
      k = r.mul(C, T);
    return r.add(r.add(k, r.mul(T, P)), v);
  }
  if (!r.eql(r.sqr(e.Gy), i(e.Gx)))
    throw new Error('bad generator point: equation left != right');
  function c(T) {
    return Zn(T, ve, e.n);
  }
  function d(T) {
    let {
      allowedPrivateKeyLengths: P,
      nByteLength: v,
      wrapPrivateKey: C,
      n: k,
    } = e;
    if (P && typeof T != 'bigint') {
      if ((Wn(T) && (T = Zo(T)), typeof T != 'string' || !P.includes(T.length)))
        throw new Error('invalid private key');
      T = T.padStart(v * 2, '0');
    }
    let B;
    try {
      B = typeof T == 'bigint' ? T : bt(Ve('private key', T, v));
    } catch {
      throw new Error(
        'invalid private key, expected hex or ' + v + ' bytes, got ' + typeof T
      );
    }
    return C && (B = Fe(B, k)), _r('private key', B, ve, k), B;
  }
  function p(T) {
    if (!(T instanceof g)) throw new Error('ProjectivePoint expected');
  }
  let u = Kd((T, P) => {
      let { px: v, py: C, pz: k } = T;
      if (r.eql(k, r.ONE)) return { x: v, y: C };
      let B = T.is0();
      P == null && (P = B ? r.ONE : r.inv(k));
      let F = r.mul(v, P),
        O = r.mul(C, P),
        S = r.mul(k, P);
      if (B) return { x: r.ZERO, y: r.ZERO };
      if (!r.eql(S, r.ONE)) throw new Error('invZ was invalid');
      return { x: F, y: O };
    }),
    h = Kd(T => {
      if (T.is0()) {
        if (e.allowInfinityPoint && !r.is0(T.py)) return;
        throw new Error('bad point: ZERO');
      }
      let { x: P, y: v } = T.toAffine();
      if (!r.isValid(P) || !r.isValid(v))
        throw new Error('bad point: x or y not FE');
      let C = r.sqr(v),
        k = i(P);
      if (!r.eql(C, k)) throw new Error('bad point: equation left != right');
      if (!T.isTorsionFree())
        throw new Error('bad point: not in prime-order subgroup');
      return true;
    });
  class g {
    constructor(P, v, C) {
      if (P == null || !r.isValid(P)) throw new Error('x required');
      if (v == null || !r.isValid(v)) throw new Error('y required');
      if (C == null || !r.isValid(C)) throw new Error('z required');
      (this.px = P), (this.py = v), (this.pz = C), Object.freeze(this);
    }
    static fromAffine(P) {
      let { x: v, y: C } = P || {};
      if (!P || !r.isValid(v) || !r.isValid(C))
        throw new Error('invalid affine point');
      if (P instanceof g) throw new Error('projective point not allowed');
      let k = B => r.eql(B, r.ZERO);
      return k(v) && k(C) ? g.ZERO : new g(v, C, r.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static normalizeZ(P) {
      let v = r.invertBatch(P.map(C => C.pz));
      return P.map((C, k) => C.toAffine(v[k])).map(g.fromAffine);
    }
    static fromHex(P) {
      let v = g.fromAffine(o(Ve('pointHex', P)));
      return v.assertValidity(), v;
    }
    static fromPrivateKey(P) {
      return g.BASE.multiply(d(P));
    }
    static msm(P, v) {
      return Vm(g, n, P, v);
    }
    _setWindowSize(P) {
      E.setWindowSize(this, P);
    }
    assertValidity() {
      h(this);
    }
    hasEvenY() {
      let { y: P } = this.toAffine();
      if (r.isOdd) return !r.isOdd(P);
      throw new Error("Field doesn't support isOdd");
    }
    equals(P) {
      p(P);
      let { px: v, py: C, pz: k } = this,
        { px: B, py: F, pz: O } = P,
        S = r.eql(r.mul(v, O), r.mul(B, k)),
        N = r.eql(r.mul(C, O), r.mul(F, k));
      return S && N;
    }
    negate() {
      return new g(this.px, r.neg(this.py), this.pz);
    }
    double() {
      let { a: P, b: v } = e,
        C = r.mul(v, fc),
        { px: k, py: B, pz: F } = this,
        O = r.ZERO,
        S = r.ZERO,
        N = r.ZERO,
        M = r.mul(k, k),
        Z = r.mul(B, B),
        G = r.mul(F, F),
        J = r.mul(k, B);
      return (
        (J = r.add(J, J)),
        (N = r.mul(k, F)),
        (N = r.add(N, N)),
        (O = r.mul(P, N)),
        (S = r.mul(C, G)),
        (S = r.add(O, S)),
        (O = r.sub(Z, S)),
        (S = r.add(Z, S)),
        (S = r.mul(O, S)),
        (O = r.mul(J, O)),
        (N = r.mul(C, N)),
        (G = r.mul(P, G)),
        (J = r.sub(M, G)),
        (J = r.mul(P, J)),
        (J = r.add(J, N)),
        (N = r.add(M, M)),
        (M = r.add(N, M)),
        (M = r.add(M, G)),
        (M = r.mul(M, J)),
        (S = r.add(S, M)),
        (G = r.mul(B, F)),
        (G = r.add(G, G)),
        (M = r.mul(G, J)),
        (O = r.sub(O, M)),
        (N = r.mul(G, Z)),
        (N = r.add(N, N)),
        (N = r.add(N, N)),
        new g(O, S, N)
      );
    }
    add(P) {
      p(P);
      let { px: v, py: C, pz: k } = this,
        { px: B, py: F, pz: O } = P,
        S = r.ZERO,
        N = r.ZERO,
        M = r.ZERO,
        Z = e.a,
        G = r.mul(e.b, fc),
        J = r.mul(v, B),
        te = r.mul(C, F),
        z = r.mul(k, O),
        q = r.add(v, C),
        j = r.add(B, F);
      (q = r.mul(q, j)),
        (j = r.add(J, te)),
        (q = r.sub(q, j)),
        (j = r.add(v, k));
      let ee = r.add(B, O);
      return (
        (j = r.mul(j, ee)),
        (ee = r.add(J, z)),
        (j = r.sub(j, ee)),
        (ee = r.add(C, k)),
        (S = r.add(F, O)),
        (ee = r.mul(ee, S)),
        (S = r.add(te, z)),
        (ee = r.sub(ee, S)),
        (M = r.mul(Z, j)),
        (S = r.mul(G, z)),
        (M = r.add(S, M)),
        (S = r.sub(te, M)),
        (M = r.add(te, M)),
        (N = r.mul(S, M)),
        (te = r.add(J, J)),
        (te = r.add(te, J)),
        (z = r.mul(Z, z)),
        (j = r.mul(G, j)),
        (te = r.add(te, z)),
        (z = r.sub(J, z)),
        (z = r.mul(Z, z)),
        (j = r.add(j, z)),
        (J = r.mul(te, j)),
        (N = r.add(N, J)),
        (J = r.mul(ee, j)),
        (S = r.mul(q, S)),
        (S = r.sub(S, J)),
        (J = r.mul(q, te)),
        (M = r.mul(ee, M)),
        (M = r.add(M, J)),
        new g(S, N, M)
      );
    }
    subtract(P) {
      return this.add(P.negate());
    }
    is0() {
      return this.equals(g.ZERO);
    }
    wNAF(P) {
      return E.wNAFCached(this, P, g.normalizeZ);
    }
    multiplyUnsafe(P) {
      let { endo: v, n: C } = e;
      _r('scalar', P, ir, C);
      let k = g.ZERO;
      if (P === ir) return k;
      if (this.is0() || P === ve) return this;
      if (!v || E.hasPrecomputes(this))
        return E.wNAFCachedUnsafe(this, P, g.normalizeZ);
      let { k1neg: B, k1: F, k2neg: O, k2: S } = v.splitScalar(P),
        N = k,
        M = k,
        Z = this;
      for (; F > ir || S > ir; )
        F & ve && (N = N.add(Z)),
          S & ve && (M = M.add(Z)),
          (Z = Z.double()),
          (F >>= ve),
          (S >>= ve);
      return (
        B && (N = N.negate()),
        O && (M = M.negate()),
        (M = new g(r.mul(M.px, v.beta), M.py, M.pz)),
        N.add(M)
      );
    }
    multiply(P) {
      let { endo: v, n: C } = e;
      _r('scalar', P, ve, C);
      let k, B;
      if (v) {
        let { k1neg: F, k1: O, k2neg: S, k2: N } = v.splitScalar(P),
          { p: M, f: Z } = this.wNAF(O),
          { p: G, f: J } = this.wNAF(N);
        (M = E.constTimeNegate(F, M)),
          (G = E.constTimeNegate(S, G)),
          (G = new g(r.mul(G.px, v.beta), G.py, G.pz)),
          (k = M.add(G)),
          (B = Z.add(J));
      } else {
        let { p: F, f: O } = this.wNAF(P);
        (k = F), (B = O);
      }
      return g.normalizeZ([k, B])[0];
    }
    multiplyAndAddUnsafe(P, v, C) {
      let k = g.BASE,
        B = (O, S) =>
          S === ir || S === ve || !O.equals(k)
            ? O.multiplyUnsafe(S)
            : O.multiply(S),
        F = B(this, v).add(B(P, C));
      return F.is0() ? void 0 : F;
    }
    toAffine(P) {
      return u(this, P);
    }
    isTorsionFree() {
      let { h: P, isTorsionFree: v } = e;
      if (P === ve) return true;
      if (v) return v(g, this);
      throw new Error(
        'isTorsionFree() has not been declared for the elliptic curve'
      );
    }
    clearCofactor() {
      let { h: P, clearCofactor: v } = e;
      return P === ve ? this : v ? v(g, this) : this.multiplyUnsafe(e.h);
    }
    toRawBytes(P = true) {
      return Wo('isCompressed', P), this.assertValidity(), s(g, this, P);
    }
    toHex(P = true) {
      return Wo('isCompressed', P), Zo(this.toRawBytes(P));
    }
  }
  (g.BASE = new g(e.Gx, e.Gy, r.ONE)), (g.ZERO = new g(r.ZERO, r.ONE, r.ZERO));
  let b = e.nBitLength,
    E = qm(g, e.endo ? Math.ceil(b / 2) : b);
  return {
    CURVE: e,
    ProjectivePoint: g,
    normPrivateKeyToScalar: d,
    weierstrassEquation: i,
    isWithinCurveOrder: c,
  };
}
function sw(t) {
  let e = ol(t);
  return (
    Hr(
      e,
      { hash: 'hash', hmac: 'function', randomBytes: 'function' },
      { bits2int: 'function', bits2int_modN: 'function', lowS: 'boolean' }
    ),
    Object.freeze({ lowS: true, ...e })
  );
}
function Km(t) {
  let e = sw(t),
    { Fp: r, n } = e,
    s = r.BYTES + 1,
    o = 2 * r.BYTES + 1;
  function i(z) {
    return Fe(z, n);
  }
  function c(z) {
    return uc(z, n);
  }
  let {
      ProjectivePoint: d,
      normPrivateKeyToScalar: p,
      weierstrassEquation: u,
      isWithinCurveOrder: h,
    } = ow({
      ...e,
      toBytes(z, q, j) {
        let ee = q.toAffine(),
          re = r.toBytes(ee.x),
          de = pt;
        return (
          Wo('isCompressed', j),
          j
            ? de(Uint8Array.from([q.hasEvenY() ? 2 : 3]), re)
            : de(Uint8Array.from([4]), re, r.toBytes(ee.y))
        );
      },
      fromBytes(z) {
        let q = z.length,
          j = z[0],
          ee = z.subarray(1);
        if (q === s && (j === 2 || j === 3)) {
          let re = bt(ee);
          if (!Zn(re, ve, r.ORDER)) throw new Error('Point is not on curve');
          let de = u(re),
            be;
          try {
            be = r.sqrt(de);
          } catch (Ze) {
            let Ie = Ze instanceof Error ? ': ' + Ze.message : '';
            throw new Error('Point is not on curve' + Ie);
          }
          let xe = (be & ve) === ve;
          return ((j & 1) === 1) !== xe && (be = r.neg(be)), { x: re, y: be };
        } else if (q === o && j === 4) {
          let re = r.fromBytes(ee.subarray(0, r.BYTES)),
            de = r.fromBytes(ee.subarray(r.BYTES, 2 * r.BYTES));
          return { x: re, y: de };
        } else {
          let re = s,
            de = o;
          throw new Error(
            'invalid Point, expected length of ' +
              re +
              ', or uncompressed ' +
              de +
              ', got ' +
              q
          );
        }
      },
    }),
    g = z => Zo(wr(z, e.nByteLength));
  function b(z) {
    let q = n >> ve;
    return z > q;
  }
  function E(z) {
    return b(z) ? i(-z) : z;
  }
  let T = (z, q, j) => bt(z.slice(q, j));
  class P {
    constructor(q, j, ee) {
      _r('r', q, ve, n),
        _r('s', j, ve, n),
        (this.r = q),
        (this.s = j),
        ee != null && (this.recovery = ee),
        Object.freeze(this);
    }
    static fromCompact(q) {
      let j = e.nByteLength;
      return (
        (q = Ve('compactSignature', q, j * 2)),
        new P(T(q, 0, j), T(q, j, 2 * j))
      );
    }
    static fromDER(q) {
      let { r: j, s: ee } = jr.toSig(Ve('DER', q));
      return new P(j, ee);
    }
    assertValidity() {}
    addRecoveryBit(q) {
      return new P(this.r, this.s, q);
    }
    recoverPublicKey(q) {
      let { r: j, s: ee, recovery: re } = this,
        de = O(Ve('msgHash', q));
      if (re == null || ![0, 1, 2, 3].includes(re))
        throw new Error('recovery id invalid');
      let be = re === 2 || re === 3 ? j + e.n : j;
      if (be >= r.ORDER) throw new Error('recovery id 2 or 3 invalid');
      let xe = (re & 1) === 0 ? '02' : '03',
        Oe = d.fromHex(xe + g(be)),
        Ze = c(be),
        Ie = i(-de * Ze),
        Ct = i(ee * Ze),
        At = d.BASE.multiplyAndAddUnsafe(Oe, Ie, Ct);
      if (!At) throw new Error('point at infinify');
      return At.assertValidity(), At;
    }
    hasHighS() {
      return b(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new P(this.r, i(-this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return hi(this.toDERHex());
    }
    toDERHex() {
      return jr.hexFromSig({ r: this.r, s: this.s });
    }
    toCompactRawBytes() {
      return hi(this.toCompactHex());
    }
    toCompactHex() {
      return g(this.r) + g(this.s);
    }
  }
  let v = {
    isValidPrivateKey(z) {
      try {
        return p(z), true;
      } catch {
        return false;
      }
    },
    normPrivateKeyToScalar: p,
    randomPrivateKey: () => {
      let z = Xd(e.n);
      return Lm(e.randomBytes(z), e.n);
    },
    precompute(z = 8, q = d.BASE) {
      return q._setWindowSize(z), q.multiply(BigInt(3)), q;
    },
  };
  function C(z, q = true) {
    return d.fromPrivateKey(z).toRawBytes(q);
  }
  function k(z) {
    let q = Wn(z),
      j = typeof z == 'string',
      ee = (q || j) && z.length;
    return q
      ? ee === s || ee === o
      : j
        ? ee === 2 * s || ee === 2 * o
        : z instanceof d;
  }
  function B(z, q, j = true) {
    if (k(z)) throw new Error('first arg must be private key');
    if (!k(q)) throw new Error('second arg must be public key');
    return d.fromHex(q).multiply(p(z)).toRawBytes(j);
  }
  let F =
      e.bits2int ||
      function (z) {
        if (z.length > 8192) throw new Error('input is too large');
        let q = bt(z),
          j = z.length * 8 - e.nBitLength;
        return j > 0 ? q >> BigInt(j) : q;
      },
    O =
      e.bits2int_modN ||
      function (z) {
        return i(F(z));
      },
    S = Kn(e.nBitLength);
  function N(z) {
    return _r('num < 2^' + e.nBitLength, z, ir, S), wr(z, e.nByteLength);
  }
  function M(z, q, j = Z) {
    if (['recovered', 'canonical'].some(Te => Te in j))
      throw new Error('sign() legacy options not supported');
    let { hash: ee, randomBytes: re } = e,
      { lowS: de, prehash: be, extraEntropy: xe } = j;
    de == null && (de = true),
      (z = Ve('msgHash', z)),
      Wm(j),
      be && (z = Ve('prehashed msgHash', ee(z)));
    let Oe = O(z),
      Ze = p(q),
      Ie = [N(Ze), N(Oe)];
    if (xe != null && xe !== false) {
      let Te = xe === true ? re(r.BYTES) : xe;
      Ie.push(Ve('extraEntropy', Te));
    }
    let Ct = pt(...Ie),
      At = Oe;
    function ne(Te) {
      let mt = F(Te);
      if (!h(mt)) return;
      let Nt = c(mt),
        Gt = d.BASE.multiply(mt).toAffine(),
        Wt = i(Gt.x);
      if (Wt === ir) return;
      let cr = i(Nt * i(At + Wt * Ze));
      if (cr === ir) return;
      let Br = (Gt.x === Wt ? 0 : 2) | Number(Gt.y & ve),
        Kr = cr;
      return de && b(cr) && ((Kr = E(cr)), (Br ^= 1)), new P(Wt, Kr, Br);
    }
    return { seed: Ct, k2sig: ne };
  }
  let Z = { lowS: e.lowS, prehash: false },
    G = { lowS: e.lowS, prehash: false };
  function J(z, q, j = Z) {
    let { seed: ee, k2sig: re } = M(z, q, j),
      de = e;
    return Om(de.hash.outputLen, de.nByteLength, de.hmac)(ee, re);
  }
  d.BASE._setWindowSize(8);
  function te(z, q, j, ee = G) {
    var Br;
    let re = z;
    (q = Ve('msgHash', q)), (j = Ve('publicKey', j));
    let { lowS: de, prehash: be, format: xe } = ee;
    if ((Wm(ee), 'strict' in ee))
      throw new Error('options.strict was renamed to lowS');
    if (xe !== void 0 && xe !== 'compact' && xe !== 'der')
      throw new Error('format must be compact or der');
    let Oe = typeof re == 'string' || Wn(re),
      Ze =
        !Oe &&
        !xe &&
        typeof re == 'object' &&
        re !== null &&
        typeof re.r == 'bigint' &&
        typeof re.s == 'bigint';
    if (!Oe && !Ze)
      throw new Error(
        'invalid signature, expected Uint8Array, hex string or Signature instance'
      );
    let Ie, Ct;
    try {
      if ((Ze && (Ie = new P(re.r, re.s)), Oe)) {
        try {
          xe !== 'compact' && (Ie = P.fromDER(re));
        } catch (Kr) {
          if (!(Kr instanceof jr.Err)) throw Kr;
        }
        !Ie && xe !== 'der' && (Ie = P.fromCompact(re));
      }
      Ct = d.fromHex(j);
    } catch {
      return false;
    }
    if (!Ie || (de && Ie.hasHighS())) return false;
    be && (q = e.hash(q));
    let { r: At, s: ne } = Ie,
      Te = O(q),
      mt = c(ne),
      Nt = i(Te * mt),
      Gt = i(At * mt),
      Wt =
        (Br = d.BASE.multiplyAndAddUnsafe(Ct, Nt, Gt)) == null
          ? void 0
          : Br.toAffine();
    return Wt ? i(Wt.x) === At : false;
  }
  return {
    CURVE: e,
    getPublicKey: C,
    getSharedSecret: B,
    sign: J,
    verify: te,
    ProjectivePoint: d,
    Signature: P,
    utils: v,
  };
}
function iw(t, e) {
  let r = t.ORDER,
    n = ir;
  for (let E = r - ve; E % hn === ir; E /= hn) n += ve;
  let s = n,
    o = hn << (s - ve - ve),
    i = o * hn,
    c = (r - ve) / i,
    d = (c - ve) / hn,
    p = i - ve,
    u = o,
    h = t.pow(e, c),
    g = t.pow(e, (c + ve) / hn),
    b = (E, T) => {
      let P = h,
        v = t.pow(T, p),
        C = t.sqr(v);
      C = t.mul(C, T);
      let k = t.mul(E, C);
      (k = t.pow(k, d)),
        (k = t.mul(k, v)),
        (v = t.mul(k, T)),
        (C = t.mul(k, E));
      let B = t.mul(C, v);
      k = t.pow(B, u);
      let F = t.eql(k, t.ONE);
      (v = t.mul(C, g)),
        (k = t.mul(B, P)),
        (C = t.cmov(v, C, F)),
        (B = t.cmov(k, B, F));
      for (let O = s; O > ve; O--) {
        let S = O - hn;
        S = hn << (S - ve);
        let N = t.pow(B, S),
          M = t.eql(N, t.ONE);
        (v = t.mul(C, P)),
          (P = t.mul(P, P)),
          (N = t.mul(B, P)),
          (C = t.cmov(v, C, M)),
          (B = t.cmov(N, B, M));
      }
      return { isValid: F, value: C };
    };
  if (t.ORDER % Zm === fc) {
    let E = (t.ORDER - fc) / Zm,
      T = t.sqrt(t.neg(e));
    b = (P, v) => {
      let C = t.sqr(v),
        k = t.mul(P, v);
      C = t.mul(C, k);
      let B = t.pow(C, E);
      B = t.mul(B, k);
      let F = t.mul(B, T),
        O = t.mul(t.sqr(B), v),
        S = t.eql(O, P),
        N = t.cmov(F, B, S);
      return { isValid: S, value: N };
    };
  }
  return b;
}
function Jm(t, e) {
  if ((dc(t), !t.isValid(e.A) || !t.isValid(e.B) || !t.isValid(e.Z)))
    throw new Error('mapToCurveSimpleSWU: invalid opts');
  let r = iw(t, e.Z);
  if (!t.isOdd) throw new Error('Fp.isOdd is not implemented!');
  return n => {
    let s, o, i, c, d, p, u, h;
    (s = t.sqr(n)),
      (s = t.mul(s, e.Z)),
      (o = t.sqr(s)),
      (o = t.add(o, s)),
      (i = t.add(o, t.ONE)),
      (i = t.mul(i, e.B)),
      (c = t.cmov(e.Z, t.neg(o), !t.eql(o, t.ZERO))),
      (c = t.mul(c, e.A)),
      (o = t.sqr(i)),
      (p = t.sqr(c)),
      (d = t.mul(p, e.A)),
      (o = t.add(o, d)),
      (o = t.mul(o, i)),
      (p = t.mul(p, c)),
      (d = t.mul(p, e.B)),
      (o = t.add(o, d)),
      (u = t.mul(s, i));
    let { isValid: g, value: b } = r(o, p);
    (h = t.mul(s, n)),
      (h = t.mul(h, b)),
      (u = t.cmov(u, i, g)),
      (h = t.cmov(h, b, g));
    let E = t.isOdd(n) === t.isOdd(h);
    return (h = t.cmov(t.neg(h), h, E)), (u = t.div(u, c)), { x: u, y: h };
  };
}
var sl,
  jr,
  ir,
  ve,
  hn,
  fc,
  Zm,
  il = D(() => {
    f();
    Gm();
    gi();
    Ko();
    (sl = class extends Error {
      constructor(e = '') {
        super(e);
      }
    }),
      (jr = {
        Err: sl,
        _tlv: {
          encode: (t, e) => {
            let { Err: r } = jr;
            if (t < 0 || t > 256) throw new r('tlv.encode: wrong tag');
            if (e.length & 1) throw new r('tlv.encode: unpadded data');
            let n = e.length / 2,
              s = mi(n);
            if ((s.length / 2) & 128)
              throw new r('tlv.encode: long form length too big');
            let o = n > 127 ? mi((s.length / 2) | 128) : '';
            return mi(t) + o + s + e;
          },
          decode(t, e) {
            let { Err: r } = jr,
              n = 0;
            if (t < 0 || t > 256) throw new r('tlv.encode: wrong tag');
            if (e.length < 2 || e[n++] !== t)
              throw new r('tlv.decode: wrong tlv');
            let s = e[n++],
              o = !!(s & 128),
              i = 0;
            if (!o) i = s;
            else {
              let d = s & 127;
              if (!d)
                throw new r(
                  'tlv.decode(long): indefinite length not supported'
                );
              if (d > 4)
                throw new r('tlv.decode(long): byte length is too big');
              let p = e.subarray(n, n + d);
              if (p.length !== d)
                throw new r('tlv.decode: length bytes not complete');
              if (p[0] === 0)
                throw new r('tlv.decode(long): zero leftmost byte');
              for (let u of p) i = (i << 8) | u;
              if (((n += d), i < 128))
                throw new r('tlv.decode(long): not minimal encoding');
            }
            let c = e.subarray(n, n + i);
            if (c.length !== i) throw new r('tlv.decode: wrong value length');
            return { v: c, l: e.subarray(n + i) };
          },
        },
        _int: {
          encode(t) {
            let { Err: e } = jr;
            if (t < ir)
              throw new e('integer: negative integers are not allowed');
            let r = mi(t);
            if ((Number.parseInt(r[0], 16) & 8 && (r = '00' + r), r.length & 1))
              throw new e('unexpected DER parsing assertion: unpadded hex');
            return r;
          },
          decode(t) {
            let { Err: e } = jr;
            if (t[0] & 128) throw new e('invalid signature integer: negative');
            if (t[0] === 0 && !(t[1] & 128))
              throw new e(
                'invalid signature integer: unnecessary leading zero'
              );
            return bt(t);
          },
        },
        toSig(t) {
          let { Err: e, _int: r, _tlv: n } = jr,
            s = Ve('signature', t),
            { v: o, l: i } = n.decode(48, s);
          if (i.length)
            throw new e('invalid signature: left bytes after parsing');
          let { v: c, l: d } = n.decode(2, o),
            { v: p, l: u } = n.decode(2, d);
          if (u.length)
            throw new e('invalid signature: left bytes after parsing');
          return { r: r.decode(c), s: r.decode(p) };
        },
        hexFromSig(t) {
          let { _tlv: e, _int: r } = jr,
            n = e.encode(2, r.encode(t.r)),
            s = e.encode(2, r.encode(t.s)),
            o = n + s;
          return e.encode(48, o);
        },
      }),
      (ir = BigInt(0)),
      (ve = BigInt(1)),
      (hn = BigInt(2)),
      (fc = BigInt(3)),
      (Zm = BigInt(4));
  });
function aw(t) {
  return { hash: t, hmac: (e, ...r) => Hd(t, e, qp(...r)), randomBytes: Fa };
}
function Ym(t, e) {
  let r = n => Km({ ...t, ...aw(n) });
  return { ...r(e), create: r };
}
var Xm = D(() => {
  f();
  Bm();
  Un();
  il();
});
function gn(t, e) {
  if ((yi(t), yi(e), t < 0 || t >= 1 << (8 * e)))
    throw new Error('invalid I2OSP input: ' + t);
  let r = Array.from({ length: e }).fill(0);
  for (let n = e - 1; n >= 0; n--) (r[n] = t & 255), (t >>>= 8);
  return new Uint8Array(r);
}
function uw(t, e) {
  let r = new Uint8Array(t.length);
  for (let n = 0; n < t.length; n++) r[n] = t[n] ^ e[n];
  return r;
}
function yi(t) {
  if (!Number.isSafeInteger(t)) throw new Error('number expected');
}
function dw(t, e, r, n) {
  zr(t),
    zr(e),
    yi(r),
    e.length > 255 && (e = n(pt(cc('H2C-OVERSIZE-DST-'), e)));
  let { outputLen: s, blockLen: o } = n,
    i = Math.ceil(r / s);
  if (r > 65535 || i > 255)
    throw new Error('expand_message_xmd: invalid lenInBytes');
  let c = pt(e, gn(e.length, 1)),
    d = gn(0, o),
    p = gn(r, 2),
    u = new Array(i),
    h = n(pt(d, t, p, gn(0, 1), c));
  u[0] = n(pt(h, gn(1, 1), c));
  for (let b = 1; b <= i; b++) {
    let E = [uw(h, u[b - 1]), gn(b + 1, 1), c];
    u[b] = n(pt(...E));
  }
  return pt(...u).slice(0, r);
}
function lw(t, e, r, n, s) {
  if ((zr(t), zr(e), yi(r), e.length > 255)) {
    let o = Math.ceil((2 * n) / 8);
    e = s
      .create({ dkLen: o })
      .update(cc('H2C-OVERSIZE-DST-'))
      .update(e)
      .digest();
  }
  if (r > 65535 || e.length > 255)
    throw new Error('expand_message_xof: invalid lenInBytes');
  return s
    .create({ dkLen: r })
    .update(t)
    .update(gn(r, 2))
    .update(e)
    .update(gn(e.length, 1))
    .digest();
}
function Qm(t, e, r) {
  Hr(r, {
    DST: 'stringOrUint8Array',
    p: 'bigint',
    m: 'isSafeInteger',
    k: 'isSafeInteger',
    hash: 'hash',
  });
  let { p: n, k: s, m: o, hash: i, expand: c, DST: d } = r;
  zr(t), yi(e);
  let p = typeof d == 'string' ? cc(d) : d,
    u = n.toString(2).length,
    h = Math.ceil((u + s) / 8),
    g = e * o * h,
    b;
  if (c === 'xmd') b = dw(t, p, g, i);
  else if (c === 'xof') b = lw(t, p, g, s, i);
  else if (c === '_internal_pass') b = t;
  else throw new Error('expand must be "xmd" or "xof"');
  let E = new Array(e);
  for (let T = 0; T < e; T++) {
    let P = new Array(o);
    for (let v = 0; v < o; v++) {
      let C = h * (v + T * o),
        k = b.subarray(C, C + h);
      P[v] = Fe(cw(k), n);
    }
    E[T] = P;
  }
  return E;
}
function eh(t, e) {
  let r = e.map(n => Array.from(n).reverse());
  return (n, s) => {
    let [o, i, c, d] = r.map(p => p.reduce((u, h) => t.add(t.mul(u, n), h)));
    if (t.is0(i) || t.is0(d)) throw new Error('bad point: ZERO');
    return (n = t.div(o, i)), (s = t.mul(s, t.div(c, d))), { x: n, y: s };
  };
}
function th(t, e, r) {
  if (typeof e != 'function') throw new Error('mapToCurve() must be defined');
  return {
    hashToCurve(n, s) {
      let o = Qm(n, 2, { ...r, DST: r.DST, ...s }),
        i = t.fromAffine(e(o[0])),
        c = t.fromAffine(e(o[1])),
        d = i.add(c).clearCofactor();
      return d.assertValidity(), d;
    },
    encodeToCurve(n, s) {
      let o = Qm(n, 1, { ...r, DST: r.encodeDST, ...s }),
        i = t.fromAffine(e(o[0])).clearCofactor();
      return i.assertValidity(), i;
    },
    mapToCurve(n) {
      if (!Array.isArray(n))
        throw new Error('mapToCurve: expected array of bigints');
      for (let o of n)
        if (typeof o != 'bigint')
          throw new Error('mapToCurve: expected array of bigints');
      let s = t.fromAffine(e(n)).clearCofactor();
      return s.assertValidity(), s;
    },
  };
}
var cw,
  rh = D(() => {
    f();
    gi();
    Ko();
    cw = bt;
  });
var lh = {};
qf(lh, {
  encodeToCurve: () => xw,
  hashToCurve: () => bw,
  schnorr: () => hw,
  secp256k1: () => Yn,
});
function sh(t) {
  let e = wi,
    r = BigInt(3),
    n = BigInt(6),
    s = BigInt(11),
    o = BigInt(22),
    i = BigInt(23),
    c = BigInt(44),
    d = BigInt(88),
    p = (t * t * t) % e,
    u = (p * p * t) % e,
    h = (St(u, r, e) * u) % e,
    g = (St(h, r, e) * u) % e,
    b = (St(g, mc, e) * p) % e,
    E = (St(b, s, e) * b) % e,
    T = (St(E, o, e) * E) % e,
    P = (St(T, c, e) * T) % e,
    v = (St(P, d, e) * P) % e,
    C = (St(v, c, e) * T) % e,
    k = (St(C, r, e) * u) % e,
    B = (St(k, i, e) * E) % e,
    F = (St(B, n, e) * p) % e,
    O = St(F, mc, e);
  if (!yn.eql(yn.sqr(O), t)) throw new Error('Cannot find square root');
  return O;
}
function hc(t, ...e) {
  let r = oh[t];
  if (r === void 0) {
    let n = mn(Uint8Array.from(t, s => s.charCodeAt(0)));
    (r = pt(n, n)), (oh[t] = r);
  }
  return mn(pt(r, ...e));
}
function ul(t) {
  let e = Yn.utils.normPrivateKeyToScalar(t),
    r = ll.fromPrivateKey(e);
  return { scalar: r.hasEvenY() ? e : xi(-e), bytes: dl(r) };
}
function ah(t) {
  _r('x', t, bi, wi);
  let e = al(t * t),
    r = al(e * t + BigInt(7)),
    n = sh(r);
  n % mc !== ih && (n = al(-n));
  let s = new ll(t, n, bi);
  return s.assertValidity(), s;
}
function ch(...t) {
  return xi(Jo(hc('BIP0340/challenge', ...t)));
}
function pw(t) {
  return ul(t).bytes;
}
function mw(t, e, r = Fa(32)) {
  let n = Ve('message', t),
    { bytes: s, scalar: o } = ul(e),
    i = Ve('auxRand', r, 32),
    c = cl(o ^ Jo(hc('BIP0340/aux', i))),
    d = hc('BIP0340/nonce', c, s, n),
    p = xi(Jo(d));
  if (p === ih) throw new Error('sign failed: k is zero');
  let { bytes: u, scalar: h } = ul(p),
    g = ch(u, s, n),
    b = new Uint8Array(64);
  if ((b.set(u, 0), b.set(cl(xi(h + g * o)), 32), !uh(b, n, s)))
    throw new Error('sign: Invalid signature produced');
  return b;
}
function uh(t, e, r) {
  let n = Ve('signature', t, 64),
    s = Ve('message', e),
    o = Ve('publicKey', r, 32);
  try {
    let i = ah(Jo(o)),
      c = Jo(n.subarray(0, 32));
    if (!Zn(c, bi, wi)) return false;
    let d = Jo(n.subarray(32, 64));
    if (!Zn(d, bi, pc)) return false;
    let p = ch(cl(c), dl(i), s),
      u = fw(i, d, xi(-p));
    return !(!u || !u.hasEvenY() || u.toAffine().x !== c);
  } catch {
    return false;
  }
}
var wi,
  pc,
  bi,
  mc,
  nh,
  yn,
  Yn,
  ih,
  oh,
  dl,
  cl,
  al,
  xi,
  ll,
  fw,
  Jo,
  hw,
  gw,
  yw,
  dh,
  bw,
  xw,
  fl = D(() => {
    f();
    $m();
    Un();
    Xm();
    rh();
    gi();
    Ko();
    il();
    (wi = BigInt(
      '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f'
    )),
      (pc = BigInt(
        '0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141'
      )),
      (bi = BigInt(1)),
      (mc = BigInt(2)),
      (nh = (t, e) => (t + e / mc) / e);
    (yn = lc(wi, void 0, void 0, { sqrt: sh })),
      (Yn = Ym(
        {
          a: BigInt(0),
          b: BigInt(7),
          Fp: yn,
          n: pc,
          Gx: BigInt(
            '55066263022277343669578718895168534326250603453777594175500187360389116729240'
          ),
          Gy: BigInt(
            '32670510020758816978083085130507043184471273380659243275938904335757337482424'
          ),
          h: BigInt(1),
          lowS: true,
          endo: {
            beta: BigInt(
              '0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'
            ),
            splitScalar: t => {
              let e = pc,
                r = BigInt('0x3086d221a7d46bcde86c90e49284eb15'),
                n = -bi * BigInt('0xe4437ed6010e88286f547fa90abfe4c3'),
                s = BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8'),
                o = r,
                i = BigInt('0x100000000000000000000000000000000'),
                c = nh(o * t, e),
                d = nh(-n * t, e),
                p = Fe(t - c * r - d * s, e),
                u = Fe(-c * n - d * o, e),
                h = p > i,
                g = u > i;
              if ((h && (p = e - p), g && (u = e - u), p > i || u > i))
                throw new Error('splitScalar: Endomorphism failed, k=' + t);
              return { k1neg: h, k1: p, k2neg: g, k2: u };
            },
          },
        },
        mn
      )),
      (ih = BigInt(0)),
      (oh = {});
    (dl = t => t.toRawBytes(true).slice(1)),
      (cl = t => wr(t, 32)),
      (al = t => Fe(t, wi)),
      (xi = t => Fe(t, pc)),
      (ll = Yn.ProjectivePoint),
      (fw = (t, e, r) => ll.BASE.multiplyAndAddUnsafe(t, e, r));
    Jo = bt;
    (hw = {
      getPublicKey: pw,
      sign: mw,
      verify: uh,
      utils: {
        randomPrivateKey: Yn.utils.randomPrivateKey,
        lift_x: ah,
        pointToBytes: dl,
        numberToBytesBE: wr,
        bytesToNumberBE: bt,
        taggedHash: hc,
        mod: Fe,
      },
    }),
      (gw = eh(
        yn,
        [
          [
            '0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7',
            '0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581',
            '0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262',
            '0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c',
          ],
          [
            '0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b',
            '0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14',
            '0x0000000000000000000000000000000000000000000000000000000000000001',
          ],
          [
            '0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c',
            '0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3',
            '0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931',
            '0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84',
          ],
          [
            '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b',
            '0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573',
            '0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f',
            '0x0000000000000000000000000000000000000000000000000000000000000001',
          ],
        ].map(t => t.map(e => BigInt(e)))
      )),
      (yw = Jm(yn, {
        A: BigInt(
          '0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533'
        ),
        B: BigInt('1771'),
        Z: yn.create(BigInt('-11')),
      })),
      (dh = th(
        Yn.ProjectivePoint,
        t => {
          let { x: e, y: r } = yw(yn.create(t[0]));
          return gw(e, r);
        },
        {
          DST: 'secp256k1_XMD:SHA-256_SSWU_RO_',
          encodeDST: 'secp256k1_XMD:SHA-256_SSWU_NU_',
          p: yn.ORDER,
          m: 1,
          k: 128,
          expand: 'xmd',
          hash: mn,
        }
      )),
      (bw = dh.hashToCurve),
      (xw = dh.encodeToCurve);
  });
var qr,
  bn,
  Yo,
  Xo,
  Qo,
  es,
  ts,
  rs,
  ns,
  os,
  xn,
  zt,
  Xn = D(() => {
    f();
    Eo();
    ce();
    qr = class extends I {
      constructor({ cause: e, message: r } = {}) {
        var s;
        let n =
          (s = r == null ? void 0 : r.replace('execution reverted: ', '')) ==
          null
            ? void 0
            : s.replace('execution reverted', '');
        super(
          `Execution reverted ${n ? `with reason: ${n}` : 'for an unknown reason'}.`,
          { cause: e, name: 'ExecutionRevertedError' }
        );
      }
    };
    Object.defineProperty(qr, 'code', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3,
    });
    Object.defineProperty(qr, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /execution reverted/,
    });
    bn = class extends I {
      constructor({ cause: e, maxFeePerGas: r } = {}) {
        super(
          `The fee cap (\`maxFeePerGas\`${r ? ` = ${qe(r)} gwei` : ''}) cannot be higher than the maximum allowed value (2^256-1).`,
          { cause: e, name: 'FeeCapTooHighError' }
        );
      }
    };
    Object.defineProperty(bn, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value:
        /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/,
    });
    Yo = class extends I {
      constructor({ cause: e, maxFeePerGas: r } = {}) {
        super(
          `The fee cap (\`maxFeePerGas\`${r ? ` = ${qe(r)}` : ''} gwei) cannot be lower than the block base fee.`,
          { cause: e, name: 'FeeCapTooLowError' }
        );
      }
    };
    Object.defineProperty(Yo, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value:
        /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/,
    });
    Xo = class extends I {
      constructor({ cause: e, nonce: r } = {}) {
        super(
          `Nonce provided for the transaction ${r ? `(${r}) ` : ''}is higher than the next one expected.`,
          { cause: e, name: 'NonceTooHighError' }
        );
      }
    };
    Object.defineProperty(Xo, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too high/,
    });
    Qo = class extends I {
      constructor({ cause: e, nonce: r } = {}) {
        super(
          [
            `Nonce provided for the transaction ${r ? `(${r}) ` : ''}is lower than the current nonce of the account.`,
            'Try increasing the nonce or find the latest nonce with `getTransactionCount`.',
          ].join(`
`),
          { cause: e, name: 'NonceTooLowError' }
        );
      }
    };
    Object.defineProperty(Qo, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too low|transaction already imported|already known/,
    });
    es = class extends I {
      constructor({ cause: e, nonce: r } = {}) {
        super(
          `Nonce provided for the transaction ${r ? `(${r}) ` : ''}exceeds the maximum allowed nonce.`,
          { cause: e, name: 'NonceMaxValueError' }
        );
      }
    };
    Object.defineProperty(es, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce has max value/,
    });
    ts = class extends I {
      constructor({ cause: e } = {}) {
        super(
          [
            'The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.',
          ].join(`
`),
          {
            cause: e,
            metaMessages: [
              'This error could arise when the account does not have enough funds to:',
              ' - pay for the total gas fee,',
              ' - pay for the value to send.',
              ' ',
              'The cost of the transaction is calculated as `gas * gas fee + value`, where:',
              ' - `gas` is the amount of gas needed for transaction to execute,',
              ' - `gas fee` is the gas fee,',
              ' - `value` is the amount of ether to send to the recipient.',
            ],
            name: 'InsufficientFundsError',
          }
        );
      }
    };
    Object.defineProperty(ts, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /insufficient funds|exceeds transaction sender account balance/,
    });
    rs = class extends I {
      constructor({ cause: e, gas: r } = {}) {
        super(
          `The amount of gas ${r ? `(${r}) ` : ''}provided for the transaction exceeds the limit allowed for the block.`,
          { cause: e, name: 'IntrinsicGasTooHighError' }
        );
      }
    };
    Object.defineProperty(rs, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too high|gas limit reached/,
    });
    ns = class extends I {
      constructor({ cause: e, gas: r } = {}) {
        super(
          `The amount of gas ${r ? `(${r}) ` : ''}provided for the transaction is too low.`,
          { cause: e, name: 'IntrinsicGasTooLowError' }
        );
      }
    };
    Object.defineProperty(ns, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too low/,
    });
    os = class extends I {
      constructor({ cause: e }) {
        super('The transaction type is not supported for this chain.', {
          cause: e,
          name: 'TransactionTypeNotSupportedError',
        });
      }
    };
    Object.defineProperty(os, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /transaction type not valid/,
    });
    xn = class extends I {
      constructor({ cause: e, maxPriorityFeePerGas: r, maxFeePerGas: n } = {}) {
        super(
          [
            `The provided tip (\`maxPriorityFeePerGas\`${r ? ` = ${qe(r)} gwei` : ''}) cannot be higher than the fee cap (\`maxFeePerGas\`${n ? ` = ${qe(n)} gwei` : ''}).`,
          ].join(`
`),
          { cause: e, name: 'TipAboveFeeCapError' }
        );
      }
    };
    Object.defineProperty(xn, 'nodeMessage', {
      enumerable: true,
      configurable: true,
      writable: true,
      value:
        /max priority fee per gas higher than max fee per gas|tip higher than fee cap/,
    });
    zt = class extends I {
      constructor({ cause: e }) {
        super(
          `An error occurred while executing: ${e == null ? void 0 : e.shortMessage}`,
          { cause: e, name: 'UnknownNodeError' }
        );
      }
    };
  });
function wn(t, e) {
  let r = (t.details || '').toLowerCase(),
    n =
      t instanceof I
        ? t.walk(s => (s == null ? void 0 : s.code) === qr.code)
        : t;
  return n instanceof I
    ? new qr({ cause: t, message: n.details })
    : qr.nodeMessage.test(r)
      ? new qr({ cause: t, message: t.details })
      : bn.nodeMessage.test(r)
        ? new bn({
            cause: t,
            maxFeePerGas: e == null ? void 0 : e.maxFeePerGas,
          })
        : Yo.nodeMessage.test(r)
          ? new Yo({
              cause: t,
              maxFeePerGas: e == null ? void 0 : e.maxFeePerGas,
            })
          : Xo.nodeMessage.test(r)
            ? new Xo({ cause: t, nonce: e == null ? void 0 : e.nonce })
            : Qo.nodeMessage.test(r)
              ? new Qo({ cause: t, nonce: e == null ? void 0 : e.nonce })
              : es.nodeMessage.test(r)
                ? new es({ cause: t, nonce: e == null ? void 0 : e.nonce })
                : ts.nodeMessage.test(r)
                  ? new ts({ cause: t })
                  : rs.nodeMessage.test(r)
                    ? new rs({ cause: t, gas: e == null ? void 0 : e.gas })
                    : ns.nodeMessage.test(r)
                      ? new ns({ cause: t, gas: e == null ? void 0 : e.gas })
                      : os.nodeMessage.test(r)
                        ? new os({ cause: t })
                        : xn.nodeMessage.test(r)
                          ? new xn({
                              cause: t,
                              maxFeePerGas: e == null ? void 0 : e.maxFeePerGas,
                              maxPriorityFeePerGas:
                                e == null ? void 0 : e.maxPriorityFeePerGas,
                            })
                          : new zt({ cause: t });
}
var vi = D(() => {
  f();
  ce();
  Xn();
});
function vn(t, { format: e }) {
  if (!e) return {};
  let r = {};
  function n(o) {
    let i = Object.keys(o);
    for (let c of i)
      c in t && (r[c] = t[c]),
        o[c] && typeof o[c] == 'object' && !Array.isArray(o[c]) && n(o[c]);
  }
  let s = e(t || {});
  return n(s), r;
}
var Ti = D(() => {
  f();
});
function _t(t) {
  let e = {};
  return (
    typeof t.authorizationList != 'undefined' &&
      (e.authorizationList = Ew(t.authorizationList)),
    typeof t.accessList != 'undefined' && (e.accessList = t.accessList),
    typeof t.blobVersionedHashes != 'undefined' &&
      (e.blobVersionedHashes = t.blobVersionedHashes),
    typeof t.blobs != 'undefined' &&
      (typeof t.blobs[0] != 'string'
        ? (e.blobs = t.blobs.map(r => me(r)))
        : (e.blobs = t.blobs)),
    typeof t.data != 'undefined' && (e.data = t.data),
    typeof t.from != 'undefined' && (e.from = t.from),
    typeof t.gas != 'undefined' && (e.gas = H(t.gas)),
    typeof t.gasPrice != 'undefined' && (e.gasPrice = H(t.gasPrice)),
    typeof t.maxFeePerBlobGas != 'undefined' &&
      (e.maxFeePerBlobGas = H(t.maxFeePerBlobGas)),
    typeof t.maxFeePerGas != 'undefined' &&
      (e.maxFeePerGas = H(t.maxFeePerGas)),
    typeof t.maxPriorityFeePerGas != 'undefined' &&
      (e.maxPriorityFeePerGas = H(t.maxPriorityFeePerGas)),
    typeof t.nonce != 'undefined' && (e.nonce = H(t.nonce)),
    typeof t.to != 'undefined' && (e.to = t.to),
    typeof t.type != 'undefined' && (e.type = Tw[t.type]),
    typeof t.value != 'undefined' && (e.value = H(t.value)),
    e
  );
}
function Ew(t) {
  return t.map(e => ({
    address: e.address,
    r: e.r ? H(BigInt(e.r)) : e.r,
    s: e.s ? H(BigInt(e.s)) : e.s,
    chainId: H(e.chainId),
    nonce: H(e.nonce),
    ...(typeof e.yParity != 'undefined' ? { yParity: H(e.yParity) } : {}),
    ...(typeof e.v != 'undefined' && typeof e.yParity == 'undefined'
      ? { v: H(e.v) }
      : {}),
  }));
}
var Tw,
  Qn = D(() => {
    f();
    se();
    Tw = {
      legacy: '0x0',
      eip2930: '0x1',
      eip1559: '0x2',
      eip4844: '0x3',
      eip7702: '0x4',
    };
  });
function xh(t) {
  if (!(!t || t.length === 0))
    return t.reduce((e, { slot: r, value: n }) => {
      if (r.length !== 66)
        throw new Xs({ size: r.length, targetSize: 66, type: 'hex' });
      if (n.length !== 66)
        throw new Xs({ size: n.length, targetSize: 66, type: 'hex' });
      return (e[r] = n), e;
    }, {});
}
function Cw(t) {
  let { balance: e, nonce: r, state: n, stateDiff: s, code: o } = t,
    i = {};
  if (
    (o !== void 0 && (i.code = o),
    e !== void 0 && (i.balance = H(e)),
    r !== void 0 && (i.nonce = H(r)),
    n !== void 0 && (i.state = xh(n)),
    s !== void 0)
  ) {
    if (i.state) throw new Ja();
    i.stateDiff = xh(s);
  }
  return i;
}
function ss(t) {
  if (!t) return;
  let e = {};
  for (let { address: r, ...n } of t) {
    if (!Je(r, { strict: false })) throw new ot({ address: r });
    if (e[r]) throw new Ka({ address: r });
    e[r] = Cw(n);
  }
  return e;
}
var xc = D(() => {
  f();
  Ln();
  Aa();
  Ld();
  sn();
  se();
});
var wh,
  vh = D(() => {
    f();
    BigInt(2) ** (BigInt(8) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(16) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(24) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(32) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(40) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(48) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(56) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(64) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(72) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(80) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(88) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(96) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(104) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(112) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(120) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(128) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(136) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(144) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(152) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(160) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(168) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(176) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(184) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(192) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(200) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(208) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(216) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(224) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(232) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(240) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(248) - BigInt(1)) - BigInt(1),
      BigInt(2) ** (BigInt(256) - BigInt(1)) - BigInt(1),
      -(BigInt(2) ** (BigInt(8) - BigInt(1))),
      -(BigInt(2) ** (BigInt(16) - BigInt(1))),
      -(BigInt(2) ** (BigInt(24) - BigInt(1))),
      -(BigInt(2) ** (BigInt(32) - BigInt(1))),
      -(BigInt(2) ** (BigInt(40) - BigInt(1))),
      -(BigInt(2) ** (BigInt(48) - BigInt(1))),
      -(BigInt(2) ** (BigInt(56) - BigInt(1))),
      -(BigInt(2) ** (BigInt(64) - BigInt(1))),
      -(BigInt(2) ** (BigInt(72) - BigInt(1))),
      -(BigInt(2) ** (BigInt(80) - BigInt(1))),
      -(BigInt(2) ** (BigInt(88) - BigInt(1))),
      -(BigInt(2) ** (BigInt(96) - BigInt(1))),
      -(BigInt(2) ** (BigInt(104) - BigInt(1))),
      -(BigInt(2) ** (BigInt(112) - BigInt(1))),
      -(BigInt(2) ** (BigInt(120) - BigInt(1))),
      -(BigInt(2) ** (BigInt(128) - BigInt(1))),
      -(BigInt(2) ** (BigInt(136) - BigInt(1))),
      -(BigInt(2) ** (BigInt(144) - BigInt(1))),
      -(BigInt(2) ** (BigInt(152) - BigInt(1))),
      -(BigInt(2) ** (BigInt(160) - BigInt(1))),
      -(BigInt(2) ** (BigInt(168) - BigInt(1))),
      -(BigInt(2) ** (BigInt(176) - BigInt(1))),
      -(BigInt(2) ** (BigInt(184) - BigInt(1))),
      -(BigInt(2) ** (BigInt(192) - BigInt(1))),
      -(BigInt(2) ** (BigInt(200) - BigInt(1))),
      -(BigInt(2) ** (BigInt(208) - BigInt(1))),
      -(BigInt(2) ** (BigInt(216) - BigInt(1))),
      -(BigInt(2) ** (BigInt(224) - BigInt(1))),
      -(BigInt(2) ** (BigInt(232) - BigInt(1))),
      -(BigInt(2) ** (BigInt(240) - BigInt(1))),
      -(BigInt(2) ** (BigInt(248) - BigInt(1))),
      -(BigInt(2) ** (BigInt(256) - BigInt(1))),
      BigInt(2) ** BigInt(8) - BigInt(1),
      BigInt(2) ** BigInt(16) - BigInt(1),
      BigInt(2) ** BigInt(24) - BigInt(1),
      BigInt(2) ** BigInt(32) - BigInt(1),
      BigInt(2) ** BigInt(40) - BigInt(1),
      BigInt(2) ** BigInt(48) - BigInt(1),
      BigInt(2) ** BigInt(56) - BigInt(1),
      BigInt(2) ** BigInt(64) - BigInt(1),
      BigInt(2) ** BigInt(72) - BigInt(1),
      BigInt(2) ** BigInt(80) - BigInt(1),
      BigInt(2) ** BigInt(88) - BigInt(1),
      BigInt(2) ** BigInt(96) - BigInt(1),
      BigInt(2) ** BigInt(104) - BigInt(1),
      BigInt(2) ** BigInt(112) - BigInt(1),
      BigInt(2) ** BigInt(120) - BigInt(1),
      BigInt(2) ** BigInt(128) - BigInt(1),
      BigInt(2) ** BigInt(136) - BigInt(1),
      BigInt(2) ** BigInt(144) - BigInt(1),
      BigInt(2) ** BigInt(152) - BigInt(1),
      BigInt(2) ** BigInt(160) - BigInt(1),
      BigInt(2) ** BigInt(168) - BigInt(1),
      BigInt(2) ** BigInt(176) - BigInt(1),
      BigInt(2) ** BigInt(184) - BigInt(1),
      BigInt(2) ** BigInt(192) - BigInt(1),
      BigInt(2) ** BigInt(200) - BigInt(1),
      BigInt(2) ** BigInt(208) - BigInt(1),
      BigInt(2) ** BigInt(216) - BigInt(1),
      BigInt(2) ** BigInt(224) - BigInt(1),
      BigInt(2) ** BigInt(232) - BigInt(1),
      BigInt(2) ** BigInt(240) - BigInt(1),
      BigInt(2) ** BigInt(248) - BigInt(1),
      (wh = BigInt(2) ** BigInt(256) - BigInt(1));
  });
function xt(t) {
  let {
      account: e,
      gasPrice: r,
      maxFeePerGas: n,
      maxPriorityFeePerGas: s,
      to: o,
    } = t,
    i = e ? ae(e) : void 0;
  if (i && !Je(i.address)) throw new ot({ address: i.address });
  if (o && !Je(o)) throw new ot({ address: o });
  if (
    typeof r != 'undefined' &&
    (typeof n != 'undefined' || typeof s != 'undefined')
  )
    throw new Ya();
  if (n && n > wh) throw new bn({ maxFeePerGas: n });
  if (s && n && s > n)
    throw new xn({ maxFeePerGas: n, maxPriorityFeePerGas: s });
}
var Tn = D(() => {
  f();
  Ne();
  vh();
  Ln();
  Xn();
  Mr();
  sn();
});
function vr(t, e) {
  if (!Je(t, { strict: false })) throw new ot({ address: t });
  if (!Je(e, { strict: false })) throw new ot({ address: e });
  return t.toLowerCase() === e.toLowerCase();
}
var ds = D(() => {
  f();
  Ln();
  sn();
});
function wt(t) {
  let { abi: e, args: r, functionName: n, data: s } = t,
    o = e[0];
  if (n) {
    let c = gt({ abi: e, args: r, name: n });
    if (!c) throw new Yt(n, { docsPath: gl });
    o = c;
  }
  if (o.type !== 'function') throw new Yt(void 0, { docsPath: gl });
  if (!o.outputs) throw new go(o.name, { docsPath: gl });
  let i = Dr(o.outputs, s);
  if (i && i.length > 1) return i;
  if (i && i.length === 1) return i[0];
}
var gl,
  An = D(() => {
    f();
    $e();
    di();
    an();
    gl = '/docs/contract/decodeFunctionResult';
  });
var Ei,
  Sc,
  Nh,
  Rc,
  Fh,
  yl,
  bl,
  xl,
  Pn = D(() => {
    f();
    (Ei = [
      {
        inputs: [
          {
            components: [
              { name: 'target', type: 'address' },
              { name: 'allowFailure', type: 'bool' },
              { name: 'callData', type: 'bytes' },
            ],
            name: 'calls',
            type: 'tuple[]',
          },
        ],
        name: 'aggregate3',
        outputs: [
          {
            components: [
              { name: 'success', type: 'bool' },
              { name: 'returnData', type: 'bytes' },
            ],
            name: 'returnData',
            type: 'tuple[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ]),
      (Sc = [
        {
          name: 'query',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            {
              type: 'tuple[]',
              name: 'queries',
              components: [
                { type: 'address', name: 'sender' },
                { type: 'string[]', name: 'urls' },
                { type: 'bytes', name: 'data' },
              ],
            },
          ],
          outputs: [
            { type: 'bool[]', name: 'failures' },
            { type: 'bytes[]', name: 'responses' },
          ],
        },
        {
          name: 'HttpError',
          type: 'error',
          inputs: [
            { type: 'uint16', name: 'status' },
            { type: 'string', name: 'message' },
          ],
        },
      ]),
      (Nh = [
        { inputs: [], name: 'ResolverNotFound', type: 'error' },
        { inputs: [], name: 'ResolverWildcardNotSupported', type: 'error' },
        { inputs: [], name: 'ResolverNotContract', type: 'error' },
        {
          inputs: [{ name: 'returnData', type: 'bytes' }],
          name: 'ResolverError',
          type: 'error',
        },
        {
          inputs: [
            {
              components: [
                { name: 'status', type: 'uint16' },
                { name: 'message', type: 'string' },
              ],
              name: 'errors',
              type: 'tuple[]',
            },
          ],
          name: 'HttpError',
          type: 'error',
        },
      ]),
      (Rc = [
        ...Nh,
        {
          name: 'resolve',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            { name: 'name', type: 'bytes' },
            { name: 'data', type: 'bytes' },
          ],
          outputs: [
            { name: '', type: 'bytes' },
            { name: 'address', type: 'address' },
          ],
        },
        {
          name: 'resolve',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            { name: 'name', type: 'bytes' },
            { name: 'data', type: 'bytes' },
            { name: 'gateways', type: 'string[]' },
          ],
          outputs: [
            { name: '', type: 'bytes' },
            { name: 'address', type: 'address' },
          ],
        },
      ]),
      (Fh = [
        ...Nh,
        {
          name: 'reverse',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ type: 'bytes', name: 'reverseName' }],
          outputs: [
            { type: 'string', name: 'resolvedName' },
            { type: 'address', name: 'resolvedAddress' },
            { type: 'address', name: 'reverseResolver' },
            { type: 'address', name: 'resolver' },
          ],
        },
        {
          name: 'reverse',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            { type: 'bytes', name: 'reverseName' },
            { type: 'string[]', name: 'gateways' },
          ],
          outputs: [
            { type: 'string', name: 'resolvedName' },
            { type: 'address', name: 'resolvedAddress' },
            { type: 'address', name: 'reverseResolver' },
            { type: 'address', name: 'resolver' },
          ],
        },
      ]),
      (yl = [
        {
          name: 'text',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            { name: 'name', type: 'bytes32' },
            { name: 'key', type: 'string' },
          ],
          outputs: [{ name: '', type: 'string' }],
        },
      ]),
      (bl = [
        {
          name: 'addr',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'name', type: 'bytes32' }],
          outputs: [{ name: '', type: 'address' }],
        },
        {
          name: 'addr',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            { name: 'name', type: 'bytes32' },
            { name: 'coinType', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bytes' }],
        },
      ]),
      (xl = [
        {
          inputs: [
            { name: '_signer', type: 'address' },
            { name: '_hash', type: 'bytes32' },
            { name: '_signature', type: 'bytes' },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          inputs: [
            { name: '_signer', type: 'address' },
            { name: '_hash', type: 'bytes32' },
            { name: '_signature', type: 'bytes' },
          ],
          outputs: [{ type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'isValidSig',
        },
      ]);
  });
var Oh,
  Dh = D(() => {
    f();
    Oh = '0x82ad56cb';
  });
var Nc,
  Mh,
  Uh,
  Fc = D(() => {
    f();
    (Nc =
      '0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe'),
      (Mh =
        '0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe'),
      (Uh =
        '0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572');
  });
var eo,
  Oc,
  Dc,
  Ci,
  Mc = D(() => {
    f();
    ce();
    (eo = class extends I {
      constructor({ blockNumber: e, chain: r, contract: n }) {
        super(`Chain "${r.name}" does not support contract "${n.name}".`, {
          metaMessages: [
            'This could be due to any of the following:',
            ...(e && n.blockCreated && n.blockCreated > e
              ? [
                  `- The contract "${n.name}" was not deployed until block ${n.blockCreated} (current block ${e}).`,
                ]
              : [
                  `- The chain does not have the contract "${n.name}" configured.`,
                ]),
          ],
          name: 'ChainDoesNotSupportContract',
        });
      }
    }),
      (Oc = class extends I {
        constructor({ chain: e, currentChainId: r }) {
          super(
            `The current chain of the wallet (id: ${r}) does not match the target chain for the transaction (id: ${e.id} \u2013 ${e.name}).`,
            {
              metaMessages: [
                `Current Chain ID:  ${r}`,
                `Expected Chain ID: ${e.id} \u2013 ${e.name}`,
              ],
              name: 'ChainMismatchError',
            }
          );
        }
      }),
      (Dc = class extends I {
        constructor() {
          super(
            [
              'No chain was provided to the request.',
              'Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient.',
            ].join(`
`),
            { name: 'ChainNotFoundError' }
          );
        }
      }),
      (Ci = class extends I {
        constructor() {
          super('No chain was provided to the Client.', {
            name: 'ClientChainNotConfiguredError',
          });
        }
      });
  });
function to(t) {
  let { abi: e, args: r, bytecode: n } = t;
  if (!r || r.length === 0) return n;
  let s = e.find(i => 'type' in i && i.type === 'constructor');
  if (!s) throw new pa({ docsPath: wl });
  if (!('inputs' in s)) throw new Ws({ docsPath: wl });
  if (!s.inputs || s.inputs.length === 0) throw new Ws({ docsPath: wl });
  let o = rt(s.inputs, r);
  return nr([n, o]);
}
var wl,
  Uc = D(() => {
    f();
    $e();
    or();
    mr();
    wl = '/docs/contract/encodeDeployData';
  });
function jt({ blockNumber: t, chain: e, contract: r }) {
  var s;
  let n = (s = e == null ? void 0 : e.contracts) == null ? void 0 : s[r];
  if (!n) throw new eo({ chain: e, contract: { name: r } });
  if (t && n.blockCreated && n.blockCreated > t)
    throw new eo({
      blockNumber: t,
      chain: e,
      contract: { name: r, blockCreated: n.blockCreated },
    });
  return n.address;
}
var ro = D(() => {
  f();
  Mc();
});
function Lc(t, { docsPath: e, ...r }) {
  let n = (() => {
    let s = wn(t, r);
    return s instanceof zt ? t : s;
  })();
  return new Po(n, { docsPath: e, ...r });
}
var vl = D(() => {
  f();
  un();
  Xn();
  vi();
});
function ms() {
  let t = () => {},
    e = () => {};
  return {
    promise: new Promise((n, s) => {
      (t = n), (e = s);
    }),
    resolve: t,
    reject: e,
  };
}
var zc = D(() => {
  f();
});
function _c({ fn: t, id: e, shouldSplitBatch: r, wait: n = 0, sort: s }) {
  let o = async () => {
      let u = d();
      i();
      let h = u.map(({ args: g }) => g);
      h.length !== 0 &&
        t(h)
          .then(g => {
            s && Array.isArray(g) && g.sort(s);
            for (let b = 0; b < u.length; b++) {
              let { resolve: E } = u[b];
              E == null || E([g[b], g]);
            }
          })
          .catch(g => {
            for (let b = 0; b < u.length; b++) {
              let { reject: E } = u[b];
              E == null || E(g);
            }
          });
    },
    i = () => Tl.delete(e),
    c = () => d().map(({ args: u }) => u),
    d = () => Tl.get(e) || [],
    p = u => Tl.set(e, [...d(), u]);
  return {
    flush: i,
    async schedule(u) {
      let { promise: h, resolve: g, reject: b } = ms();
      return (
        (r == null ? void 0 : r([...c(), u])) && o(),
        d().length > 0
          ? (p({ args: u, resolve: g, reject: b }), h)
          : (p({ args: u, resolve: g, reject: b }), setTimeout(o, n), h)
      );
    },
  };
}
var Tl,
  El = D(() => {
    f();
    zc();
    Tl = new Map();
  });
var Hc,
  jc,
  qc,
  Lh = D(() => {
    f();
    st();
    ce();
    tc();
    (Hc = class extends I {
      constructor({
        callbackSelector: e,
        cause: r,
        data: n,
        extraData: s,
        sender: o,
        urls: i,
      }) {
        var c;
        super(
          r.shortMessage ||
            'An error occurred while fetching for an offchain result.',
          {
            cause: r,
            metaMessages: [
              ...(r.metaMessages || []),
              (c = r.metaMessages) != null && c.length ? '' : [],
              'Offchain Gateway Call:',
              i && ['  Gateway URL(s):', ...i.map(d => `    ${Hn(d)}`)],
              `  Sender: ${o}`,
              `  Data: ${n}`,
              `  Callback selector: ${e}`,
              `  Extra data: ${s}`,
            ].flat(),
            name: 'OffchainLookupError',
          }
        );
      }
    }),
      (jc = class extends I {
        constructor({ result: e, url: r }) {
          super(
            'Offchain gateway response is malformed. Response data must be a hex value.',
            {
              metaMessages: [`Gateway URL: ${Hn(r)}`, `Response: ${ue(e)}`],
              name: 'OffchainLookupResponseMalformedError',
            }
          );
        }
      }),
      (qc = class extends I {
        constructor({ sender: e, to: r }) {
          super(
            'Reverted sender address does not match target contract address (`to`).',
            {
              metaMessages: [
                `Contract address: ${r}`,
                `OffchainLookup sender address: ${e}`,
              ],
              name: 'OffchainLookupSenderMismatchError',
            }
          );
        }
      });
  });
function zh(t) {
  let { abi: e, data: r } = t,
    n = pr(r, 0, 4),
    s = e.find(o => o.type === 'function' && n === hr(He(o)));
  if (!s) throw new xa(n, { docsPath: '/docs/contract/decodeFunctionData' });
  return {
    functionName: s.name,
    args:
      'inputs' in s && s.inputs && s.inputs.length > 0
        ? Dr(s.inputs, pr(r, 4))
        : void 0,
  };
}
var _h = D(() => {
  f();
  $e();
  zn();
  xo();
  di();
  Sr();
});
function Al(t) {
  let { abi: e, errorName: r, args: n } = t,
    s = e[0];
  if (r) {
    let d = gt({ abi: e, args: n, name: r });
    if (!d) throw new Zs(r, { docsPath: Cl });
    s = d;
  }
  if (s.type !== 'error') throw new Zs(void 0, { docsPath: Cl });
  let o = He(s),
    i = hr(o),
    c = '0x';
  if (n && n.length > 0) {
    if (!s.inputs) throw new ya(s.name, { docsPath: Cl });
    c = rt(s.inputs, n);
  }
  return nr([i, c]);
}
var Cl,
  Hh = D(() => {
    f();
    $e();
    or();
    xo();
    mr();
    Sr();
    an();
    Cl = '/docs/contract/encodeErrorResult';
  });
function jh(t) {
  let { abi: e, functionName: r, result: n } = t,
    s = e[0];
  if (r) {
    let i = gt({ abi: e, name: r });
    if (!i) throw new Yt(r, { docsPath: Pl });
    s = i;
  }
  if (s.type !== 'function') throw new Yt(void 0, { docsPath: Pl });
  if (!s.outputs) throw new go(s.name, { docsPath: Pl });
  let o = (() => {
    if (s.outputs.length === 0) return [];
    if (s.outputs.length === 1) return [n];
    if (Array.isArray(n)) return n;
    throw new yo(n);
  })();
  return rt(s.outputs, o);
}
var Pl,
  qh = D(() => {
    f();
    $e();
    mr();
    an();
    Pl = '/docs/contract/encodeFunctionResult';
  });
async function Vh(t) {
  let { data: e, ccipRequest: r } = t,
    {
      args: [n],
    } = zh({ abi: Sc, data: e }),
    s = [],
    o = [];
  return (
    await Promise.all(
      n.map(async (i, c) => {
        try {
          (o[c] = await r(i)), (s[c] = false);
        } catch (d) {
          (s[c] = true), (o[c] = Bw(d));
        }
      })
    ),
    jh({ abi: Sc, functionName: 'query', result: [s, o] })
  );
}
function Bw(t) {
  return t.name === 'HttpRequestError' && t.status
    ? Al({ abi: Sc, errorName: 'HttpError', args: [t.status, t.shortMessage] })
    : Al({
        abi: [Ha],
        errorName: 'Error',
        args: ['shortMessage' in t ? t.shortMessage : t.message],
      });
}
var hs,
  Vc = D(() => {
    f();
    Pn();
    ai();
    _h();
    Hh();
    qh();
    hs = 'x-batch-gateway:true';
  });
var Zh = {};
qf(Zh, {
  ccipRequest: () => Wh,
  offchainLookup: () => Sw,
  offchainLookupAbiItem: () => Gh,
  offchainLookupSignature: () => Iw,
});
async function Sw(t, { blockNumber: e, blockTag: r, data: n, to: s }) {
  let { args: o } = Va({ data: n, abi: [Gh] }),
    [i, c, d, p, u] = o,
    { ccipRead: h } = t,
    g =
      h && typeof (h == null ? void 0 : h.request) == 'function'
        ? h.request
        : Wh;
  try {
    if (!vr(s, i)) throw new qc({ sender: i, to: s });
    let b = c.includes(hs)
        ? await Vh({ data: d, ccipRequest: g })
        : await g({ data: d, sender: i, urls: c }),
      { data: E } = await Tr(t, {
        blockNumber: e,
        blockTag: r,
        data: lt([p, rt([{ type: 'bytes' }, { type: 'bytes' }], [b, u])]),
        to: s,
      });
    return E;
  } catch (b) {
    throw new Hc({
      callbackSelector: p,
      cause: b,
      data: n,
      extraData: u,
      sender: i,
      urls: c,
    });
  }
}
async function Wh({ data: t, sender: e, urls: r }) {
  var s;
  let n = new Error('An unknown error occurred.');
  for (let o = 0; o < r.length; o++) {
    let i = r[o],
      c = i.includes('{data}') ? 'GET' : 'POST',
      d = c === 'POST' ? { data: t, sender: e } : void 0,
      p = c === 'POST' ? { 'Content-Type': 'application/json' } : {};
    try {
      let u = await fetch(
          i.replace('{sender}', e.toLowerCase()).replace('{data}', t),
          { body: JSON.stringify(d), headers: p, method: c }
        ),
        h;
      if (
        ((s = u.headers.get('Content-Type')) != null &&
        s.startsWith('application/json')
          ? (h = (await u.json()).data)
          : (h = await u.text()),
        !u.ok)
      ) {
        n = new Lt({
          body: d,
          details: h != null && h.error ? ue(h.error) : u.statusText,
          headers: u.headers,
          status: u.status,
          url: i,
        });
        continue;
      }
      if (!Re(h)) {
        n = new jc({ result: h, url: i });
        continue;
      }
      return h;
    } catch (u) {
      n = new Lt({ body: d, details: u.message, url: i });
    }
  }
  throw n;
}
var Iw,
  Gh,
  Kh = D(() => {
    f();
    gs();
    Lh();
    qn();
    Dd();
    mr();
    ds();
    or();
    Kt();
    Vc();
    st();
    (Iw = '0x556f1830'),
      (Gh = {
        name: 'OffchainLookup',
        type: 'error',
        inputs: [
          { name: 'sender', type: 'address' },
          { name: 'urls', type: 'string[]' },
          { name: 'callData', type: 'bytes' },
          { name: 'callbackFunction', type: 'bytes4' },
          { name: 'extraData', type: 'bytes' },
        ],
      });
  });
async function Tr(t, e) {
  var G, J, te, z;
  let {
      account: r = t.account,
      batch: n = !!((G = t.batch) != null && G.multicall),
      blockNumber: s,
      blockTag: o = 'latest',
      accessList: i,
      blobs: c,
      code: d,
      data: p,
      factory: u,
      factoryData: h,
      gas: g,
      gasPrice: b,
      maxFeePerBlobGas: E,
      maxFeePerGas: T,
      maxPriorityFeePerGas: P,
      nonce: v,
      to: C,
      value: k,
      stateOverride: B,
      ...F
    } = e,
    O = r ? ae(r) : void 0;
  if (d && (u || h))
    throw new I(
      'Cannot provide both `code` & `factory`/`factoryData` as parameters.'
    );
  if (d && C) throw new I('Cannot provide both `code` & `to` as parameters.');
  let S = d && p,
    N = u && h && C && p,
    M = S || N,
    Z = S
      ? Fw({ code: d, data: p })
      : N
        ? Ow({ data: p, factory: u, factoryData: h, to: C })
        : p;
  try {
    xt(e);
    let j = (s ? H(s) : void 0) || o,
      ee = ss(B),
      re =
        (z =
          (te = (J = t.chain) == null ? void 0 : J.formatters) == null
            ? void 0
            : te.transactionRequest) == null
          ? void 0
          : z.format,
      be = (re || _t)({
        ...vn(F, { format: re }),
        from: O == null ? void 0 : O.address,
        accessList: i,
        blobs: c,
        data: Z,
        gas: g,
        gasPrice: b,
        maxFeePerBlobGas: E,
        maxFeePerGas: T,
        maxPriorityFeePerGas: P,
        nonce: v,
        to: M ? void 0 : C,
        value: k,
      });
    if (n && Rw({ request: be }) && !ee)
      try {
        return await Nw(t, { ...be, blockNumber: s, blockTag: o });
      } catch (Oe) {
        if (!(Oe instanceof Ci) && !(Oe instanceof eo)) throw Oe;
      }
    let xe = await t.request({
      method: 'eth_call',
      params: ee ? [be, j, ee] : [be, j],
    });
    return xe === '0x' ? { data: void 0 } : { data: xe };
  } catch (q) {
    let j = Dw(q),
      { offchainLookup: ee, offchainLookupSignature: re } =
        await Promise.resolve().then(() => (Kh(), Zh));
    if (
      t.ccipRead !== false &&
      (j == null ? void 0 : j.slice(0, 10)) === re &&
      C
    )
      return { data: await ee(t, { data: j, to: C }) };
    throw M && (j == null ? void 0 : j.slice(0, 10)) === '0x101bb98d'
      ? new oc({ factory: u })
      : Lc(q, { ...e, account: O, chain: t.chain });
  }
}
function Rw({ request: t }) {
  let { data: e, to: r, ...n } = t;
  return !(
    !e ||
    e.startsWith(Oh) ||
    !r ||
    Object.values(n).filter(s => typeof s != 'undefined').length > 0
  );
}
async function Nw(t, e) {
  var T;
  let { batchSize: r = 1024, wait: n = 0 } =
      typeof ((T = t.batch) == null ? void 0 : T.multicall) == 'object'
        ? t.batch.multicall
        : {},
    {
      blockNumber: s,
      blockTag: o = 'latest',
      data: i,
      multicallAddress: c,
      to: d,
    } = e,
    p = c;
  if (!p) {
    if (!t.chain) throw new Ci();
    p = jt({ blockNumber: s, chain: t.chain, contract: 'multicall3' });
  }
  let h = (s ? H(s) : void 0) || o,
    { schedule: g } = _c({
      id: `${t.uid}.${h}`,
      wait: n,
      shouldSplitBatch(P) {
        return P.reduce((C, { data: k }) => C + (k.length - 2), 0) > r * 2;
      },
      fn: async P => {
        let v = P.map(B => ({
            allowFailure: true,
            callData: B.data,
            target: B.to,
          })),
          C = we({ abi: Ei, args: [v], functionName: 'aggregate3' }),
          k = await t.request({
            method: 'eth_call',
            params: [{ data: C, to: p }, h],
          });
        return wt({
          abi: Ei,
          args: [v],
          functionName: 'aggregate3',
          data: k || '0x',
        });
      },
    }),
    [{ returnData: b, success: E }] = await g({ data: i, to: d });
  if (!E) throw new br({ data: b });
  return b === '0x' ? { data: void 0 } : { data: b };
}
function Fw(t) {
  let { code: e, data: r } = t;
  return to({
    abi: ua(['constructor(bytes, bytes)']),
    bytecode: Nc,
    args: [e, r],
  });
}
function Ow(t) {
  let { data: e, factory: r, factoryData: n, to: s } = t;
  return to({
    abi: ua(['constructor(address, bytes, address, bytes)']),
    bytecode: Mh,
    args: [s, e, r, n],
  });
}
function Dw(t) {
  var r;
  if (!(t instanceof I)) return;
  let e = t.walk();
  return typeof (e == null ? void 0 : e.data) == 'object'
    ? (r = e.data) == null
      ? void 0
      : r.data
    : e.data;
}
var gs = D(() => {
  f();
  la();
  Ne();
  Pn();
  Dh();
  Fc();
  ce();
  Mc();
  un();
  An();
  Uc();
  yt();
  ro();
  se();
  vl();
  Ti();
  Qn();
  El();
  xc();
  Tn();
});
var V0 = zs((KH, q0) => {
  f();
  q0.exports = (function () {
    function t(n, s) {
      function o() {
        this.constructor = n;
      }
      (o.prototype = s.prototype), (n.prototype = new o());
    }
    function e(n, s, o, i, c, d) {
      (this.message = n),
        (this.expected = s),
        (this.found = o),
        (this.offset = i),
        (this.line = c),
        (this.column = d),
        (this.name = 'SyntaxError');
    }
    t(e, Error);
    function r(n) {
      var s = arguments.length > 1 ? arguments[1] : {},
        o = {},
        i = { start: Ef },
        c = Ef,
        p = function () {
          return Hf;
        },
        u = o,
        h = '#',
        g = { type: 'literal', value: '#', description: '"#"' },
        b = void 0,
        E = { type: 'any', description: 'any character' },
        T = '[',
        P = { type: 'literal', value: '[', description: '"["' },
        v = ']',
        C = { type: 'literal', value: ']', description: '"]"' },
        k = function (a) {
          ud(tt('ObjectPath', a, Qe, et));
        },
        B = function (a) {
          ud(tt('ArrayPath', a, Qe, et));
        },
        F = function (a, m) {
          return a.concat(m);
        },
        O = function (a) {
          return [a];
        },
        S = function (a) {
          return a;
        },
        N = '.',
        M = { type: 'literal', value: '.', description: '"."' },
        Z = '=',
        G = { type: 'literal', value: '=', description: '"="' },
        J = function (a, m) {
          ud(tt('Assign', m, Qe, et, a));
        },
        te = function (a) {
          return a.join('');
        },
        z = function (a) {
          return a.value;
        },
        q = '"""',
        j = { type: 'literal', value: '"""', description: '"\\"\\"\\""' },
        ee = null,
        re = function (a) {
          return tt('String', a.join(''), Qe, et);
        },
        de = '"',
        be = { type: 'literal', value: '"', description: '"\\""' },
        xe = "'''",
        Oe = { type: 'literal', value: "'''", description: `"'''"` },
        Ze = "'",
        Ie = { type: 'literal', value: "'", description: `"'"` },
        Ct = function (a) {
          return a;
        },
        At = function (a) {
          return a;
        },
        ne = '\\',
        Te = { type: 'literal', value: '\\', description: '"\\\\"' },
        mt = function () {
          return '';
        },
        Nt = 'e',
        Gt = { type: 'literal', value: 'e', description: '"e"' },
        Wt = 'E',
        cr = { type: 'literal', value: 'E', description: '"E"' },
        Br = function (a, m) {
          return tt('Float', parseFloat(a + 'e' + m), Qe, et);
        },
        Kr = function (a) {
          return tt('Float', parseFloat(a), Qe, et);
        },
        td = '+',
        rd = { type: 'literal', value: '+', description: '"+"' },
        Ql = function (a) {
          return a.join('');
        },
        Rs = '-',
        Ns = { type: 'literal', value: '-', description: '"-"' },
        ef = function (a) {
          return '-' + a.join('');
        },
        sy = function (a) {
          return tt('Integer', parseInt(a, 10), Qe, et);
        },
        tf = 'true',
        iy = { type: 'literal', value: 'true', description: '"true"' },
        ay = function () {
          return tt('Boolean', true, Qe, et);
        },
        rf = 'false',
        cy = { type: 'literal', value: 'false', description: '"false"' },
        uy = function () {
          return tt('Boolean', false, Qe, et);
        },
        dy = function () {
          return tt('Array', [], Qe, et);
        },
        ly = function (a) {
          return tt('Array', a ? [a] : [], Qe, et);
        },
        fy = function (a) {
          return tt('Array', a, Qe, et);
        },
        py = function (a, m) {
          return tt('Array', a.concat(m), Qe, et);
        },
        nf = function (a) {
          return a;
        },
        of = ',',
        sf = { type: 'literal', value: ',', description: '","' },
        my = '{',
        hy = { type: 'literal', value: '{', description: '"{"' },
        gy = '}',
        yy = { type: 'literal', value: '}', description: '"}"' },
        by = function (a) {
          return tt('InlineTable', a, Qe, et);
        },
        af = function (a, m) {
          return tt('InlineTableValue', m, Qe, et, a);
        },
        xy = function (a) {
          return '.' + a;
        },
        wy = function (a) {
          return a.join('');
        },
        Fs = ':',
        Os = { type: 'literal', value: ':', description: '":"' },
        cf = function (a) {
          return a.join('');
        },
        uf = 'T',
        df = { type: 'literal', value: 'T', description: '"T"' },
        vy = 'Z',
        Ty = { type: 'literal', value: 'Z', description: '"Z"' },
        Ey = function (a, m) {
          return tt('Date', new Date(a + 'T' + m + 'Z'), Qe, et);
        },
        Cy = function (a, m) {
          return tt('Date', new Date(a + 'T' + m), Qe, et);
        },
        Ay = /^[ \t]/,
        Py = { type: 'class', value: '[ \\t]', description: '[ \\t]' },
        lf = `
`,
        ff = {
          type: 'literal',
          value: `
`,
          description: '"\\n"',
        },
        ky = '\r',
        $y = { type: 'literal', value: '\r', description: '"\\r"' },
        By = /^[0-9a-f]/i,
        Iy = { type: 'class', value: '[0-9a-f]i', description: '[0-9a-f]i' },
        Sy = /^[0-9]/,
        Ry = { type: 'class', value: '[0-9]', description: '[0-9]' },
        Ny = '_',
        Fy = { type: 'literal', value: '_', description: '"_"' },
        Oy = function () {
          return '';
        },
        Dy = /^[A-Za-z0-9_\-]/,
        My = {
          type: 'class',
          value: '[A-Za-z0-9_\\-]',
          description: '[A-Za-z0-9_\\-]',
        },
        Uy = function (a) {
          return a.join('');
        },
        pf = '\\"',
        Ly = { type: 'literal', value: '\\"', description: '"\\\\\\""' },
        zy = function () {
          return '"';
        },
        mf = '\\\\',
        _y = { type: 'literal', value: '\\\\', description: '"\\\\\\\\"' },
        Hy = function () {
          return '\\';
        },
        hf = '\\b',
        jy = { type: 'literal', value: '\\b', description: '"\\\\b"' },
        qy = function () {
          return '\b';
        },
        gf = '\\t',
        Vy = { type: 'literal', value: '\\t', description: '"\\\\t"' },
        Gy = function () {
          return '	';
        },
        yf = '\\n',
        Wy = { type: 'literal', value: '\\n', description: '"\\\\n"' },
        Zy = function () {
          return `
`;
        },
        bf = '\\f',
        Ky = { type: 'literal', value: '\\f', description: '"\\\\f"' },
        Jy = function () {
          return '\f';
        },
        xf = '\\r',
        Yy = { type: 'literal', value: '\\r', description: '"\\\\r"' },
        Xy = function () {
          return '\r';
        },
        wf = '\\U',
        Qy = { type: 'literal', value: '\\U', description: '"\\\\U"' },
        vf = function (a) {
          return xb(a.join(''));
        },
        Tf = '\\u',
        eb = { type: 'literal', value: '\\u', description: '"\\\\u"' },
        l = 0,
        Y = 0,
        Ds = 0,
        nd = { line: 1, column: 1, seenCR: false },
        Mi = 0,
        od = [],
        U = 0,
        L = {},
        Ui;
      if ('startRule' in s) {
        if (!(s.startRule in i))
          throw new Error(
            `Can't start parsing from rule "` + s.startRule + '".'
          );
        c = i[s.startRule];
      }
      function Qe() {
        return sd(Y).line;
      }
      function et() {
        return sd(Y).column;
      }
      function sd(a) {
        function m(y, w, A) {
          var $, R;
          for ($ = w; $ < A; $++)
            (R = n.charAt($)),
              R ===
              `
`
                ? (y.seenCR || y.line++, (y.column = 1), (y.seenCR = false))
                : R === '\r' || R === '\u2028' || R === '\u2029'
                  ? (y.line++, (y.column = 1), (y.seenCR = true))
                  : (y.column++, (y.seenCR = false));
        }
        return (
          Ds !== a &&
            (Ds > a && ((Ds = 0), (nd = { line: 1, column: 1, seenCR: false })),
            m(nd, Ds, a),
            (Ds = a)),
          nd
        );
      }
      function _(a) {
        l < Mi || (l > Mi && ((Mi = l), (od = [])), od.push(a));
      }
      function id(a, m, y) {
        function w(W) {
          var ie = 1;
          for (
            W.sort(function (ye, fe) {
              return ye.description < fe.description
                ? -1
                : ye.description > fe.description
                  ? 1
                  : 0;
            });
            ie < W.length;

          )
            W[ie - 1] === W[ie] ? W.splice(ie, 1) : ie++;
        }
        function A(W, ie) {
          function ye(co) {
            function Jr(kt) {
              return kt.charCodeAt(0).toString(16).toUpperCase();
            }
            return co
              .replace(/\\/g, '\\\\')
              .replace(/"/g, '\\"')
              .replace(/\x08/g, '\\b')
              .replace(/\t/g, '\\t')
              .replace(/\n/g, '\\n')
              .replace(/\f/g, '\\f')
              .replace(/\r/g, '\\r')
              .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (kt) {
                return '\\x0' + Jr(kt);
              })
              .replace(/[\x10-\x1F\x80-\xFF]/g, function (kt) {
                return '\\x' + Jr(kt);
              })
              .replace(/[\u0180-\u0FFF]/g, function (kt) {
                return '\\u0' + Jr(kt);
              })
              .replace(/[\u1080-\uFFFF]/g, function (kt) {
                return '\\u' + Jr(kt);
              });
          }
          var fe = new Array(W.length),
            ke,
            Se,
            Pt;
          for (Pt = 0; Pt < W.length; Pt++) fe[Pt] = W[Pt].description;
          return (
            (ke =
              W.length > 1
                ? fe.slice(0, -1).join(', ') + ' or ' + fe[W.length - 1]
                : fe[0]),
            (Se = ie ? '"' + ye(ie) + '"' : 'end of input'),
            'Expected ' + ke + ' but ' + Se + ' found.'
          );
        }
        var $ = sd(y),
          R = y < n.length ? n.charAt(y) : null;
        return m !== null && w(m), new e(A(m, R), m, R, y, $.line, $.column);
      }
      function Ef() {
        var a,
          m,
          y,
          w = l * 49 + 0,
          A = L[w];
        if (A) return (l = A.nextPos), A.result;
        for (a = l, m = [], y = Cf(); y !== o; ) m.push(y), (y = Cf());
        return (
          m !== o && ((Y = a), (m = p())),
          (a = m),
          (L[w] = { nextPos: l, result: a }),
          a
        );
      }
      function Cf() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R,
          W = l * 49 + 1,
          ie = L[W];
        if (ie) return (l = ie.nextPos), ie.result;
        for (a = l, m = [], y = X(); y !== o; ) m.push(y), (y = X());
        if (m !== o)
          if (((y = tb()), y !== o)) {
            for (w = [], A = X(); A !== o; ) w.push(A), (A = X());
            if (w !== o) {
              for (A = [], $ = Li(); $ !== o; ) A.push($), ($ = Li());
              if (A !== o) {
                if ((($ = []), (R = Ot()), R !== o))
                  for (; R !== o; ) $.push(R), (R = Ot());
                else $ = u;
                $ === o && ($ = _i()),
                  $ !== o
                    ? ((m = [m, y, w, A, $]), (a = m))
                    : ((l = a), (a = u));
              } else (l = a), (a = u);
            } else (l = a), (a = u);
          } else (l = a), (a = u);
        else (l = a), (a = u);
        if (a === o) {
          if (((a = l), (m = []), (y = X()), y !== o))
            for (; y !== o; ) m.push(y), (y = X());
          else m = u;
          if (m !== o) {
            if (((y = []), (w = Ot()), w !== o))
              for (; w !== o; ) y.push(w), (w = Ot());
            else y = u;
            y === o && (y = _i()),
              y !== o ? ((m = [m, y]), (a = m)) : ((l = a), (a = u));
          } else (l = a), (a = u);
          a === o && (a = Ot());
        }
        return (L[W] = { nextPos: l, result: a }), a;
      }
      function tb() {
        var a,
          m = l * 49 + 2,
          y = L[m];
        return y
          ? ((l = y.nextPos), y.result)
          : ((a = Li()),
            a === o &&
              ((a = rb()), a === o && ((a = nb()), a === o && (a = ob()))),
            (L[m] = { nextPos: l, result: a }),
            a);
      }
      function Li() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R = l * 49 + 3,
          W = L[R];
        if (W) return (l = W.nextPos), W.result;
        if (
          ((a = l),
          n.charCodeAt(l) === 35 ? ((m = h), l++) : ((m = o), U === 0 && _(g)),
          m !== o)
        ) {
          for (
            y = [],
              w = l,
              A = l,
              U++,
              $ = Ot(),
              $ === o && ($ = _i()),
              U--,
              $ === o ? (A = b) : ((l = A), (A = u)),
              A !== o
                ? (n.length > l
                    ? (($ = n.charAt(l)), l++)
                    : (($ = o), U === 0 && _(E)),
                  $ !== o ? ((A = [A, $]), (w = A)) : ((l = w), (w = u)))
                : ((l = w), (w = u));
            w !== o;

          )
            y.push(w),
              (w = l),
              (A = l),
              U++,
              ($ = Ot()),
              $ === o && ($ = _i()),
              U--,
              $ === o ? (A = b) : ((l = A), (A = u)),
              A !== o
                ? (n.length > l
                    ? (($ = n.charAt(l)), l++)
                    : (($ = o), U === 0 && _(E)),
                  $ !== o ? ((A = [A, $]), (w = A)) : ((l = w), (w = u)))
                : ((l = w), (w = u));
          y !== o ? ((m = [m, y]), (a = m)) : ((l = a), (a = u));
        } else (l = a), (a = u);
        return (L[R] = { nextPos: l, result: a }), a;
      }
      function rb() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R = l * 49 + 4,
          W = L[R];
        if (W) return (l = W.nextPos), W.result;
        if (
          ((a = l),
          n.charCodeAt(l) === 91 ? ((m = T), l++) : ((m = o), U === 0 && _(P)),
          m !== o)
        ) {
          for (y = [], w = X(); w !== o; ) y.push(w), (w = X());
          if (y !== o)
            if (((w = Af()), w !== o)) {
              for (A = [], $ = X(); $ !== o; ) A.push($), ($ = X());
              A !== o
                ? (n.charCodeAt(l) === 93
                    ? (($ = v), l++)
                    : (($ = o), U === 0 && _(C)),
                  $ !== o ? ((Y = a), (m = k(w)), (a = m)) : ((l = a), (a = u)))
                : ((l = a), (a = u));
            } else (l = a), (a = u);
          else (l = a), (a = u);
        } else (l = a), (a = u);
        return (L[R] = { nextPos: l, result: a }), a;
      }
      function nb() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R,
          W,
          ie = l * 49 + 5,
          ye = L[ie];
        if (ye) return (l = ye.nextPos), ye.result;
        if (
          ((a = l),
          n.charCodeAt(l) === 91 ? ((m = T), l++) : ((m = o), U === 0 && _(P)),
          m !== o)
        )
          if (
            (n.charCodeAt(l) === 91
              ? ((y = T), l++)
              : ((y = o), U === 0 && _(P)),
            y !== o)
          ) {
            for (w = [], A = X(); A !== o; ) w.push(A), (A = X());
            if (w !== o)
              if (((A = Af()), A !== o)) {
                for ($ = [], R = X(); R !== o; ) $.push(R), (R = X());
                $ !== o
                  ? (n.charCodeAt(l) === 93
                      ? ((R = v), l++)
                      : ((R = o), U === 0 && _(C)),
                    R !== o
                      ? (n.charCodeAt(l) === 93
                          ? ((W = v), l++)
                          : ((W = o), U === 0 && _(C)),
                        W !== o
                          ? ((Y = a), (m = B(A)), (a = m))
                          : ((l = a), (a = u)))
                      : ((l = a), (a = u)))
                  : ((l = a), (a = u));
              } else (l = a), (a = u);
            else (l = a), (a = u);
          } else (l = a), (a = u);
        else (l = a), (a = u);
        return (L[ie] = { nextPos: l, result: a }), a;
      }
      function Af() {
        var a,
          m,
          y,
          w = l * 49 + 6,
          A = L[w];
        if (A) return (l = A.nextPos), A.result;
        if (((a = l), (m = []), (y = kf()), y !== o))
          for (; y !== o; ) m.push(y), (y = kf());
        else m = u;
        return (
          m !== o
            ? ((y = Pf()),
              y !== o ? ((Y = a), (m = F(m, y)), (a = m)) : ((l = a), (a = u)))
            : ((l = a), (a = u)),
          a === o &&
            ((a = l), (m = Pf()), m !== o && ((Y = a), (m = O(m))), (a = m)),
          (L[w] = { nextPos: l, result: a }),
          a
        );
      }
      function Pf() {
        var a,
          m,
          y,
          w,
          A,
          $ = l * 49 + 7,
          R = L[$];
        if (R) return (l = R.nextPos), R.result;
        for (a = l, m = [], y = X(); y !== o; ) m.push(y), (y = X());
        if (m !== o)
          if (((y = Ms()), y !== o)) {
            for (w = [], A = X(); A !== o; ) w.push(A), (A = X());
            w !== o ? ((Y = a), (m = S(y)), (a = m)) : ((l = a), (a = u));
          } else (l = a), (a = u);
        else (l = a), (a = u);
        if (a === o) {
          for (a = l, m = [], y = X(); y !== o; ) m.push(y), (y = X());
          if (m !== o)
            if (((y = ad()), y !== o)) {
              for (w = [], A = X(); A !== o; ) w.push(A), (A = X());
              w !== o ? ((Y = a), (m = S(y)), (a = m)) : ((l = a), (a = u));
            } else (l = a), (a = u);
          else (l = a), (a = u);
        }
        return (L[$] = { nextPos: l, result: a }), a;
      }
      function kf() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R,
          W = l * 49 + 8,
          ie = L[W];
        if (ie) return (l = ie.nextPos), ie.result;
        for (a = l, m = [], y = X(); y !== o; ) m.push(y), (y = X());
        if (m !== o)
          if (((y = Ms()), y !== o)) {
            for (w = [], A = X(); A !== o; ) w.push(A), (A = X());
            if (w !== o)
              if (
                (n.charCodeAt(l) === 46
                  ? ((A = N), l++)
                  : ((A = o), U === 0 && _(M)),
                A !== o)
              ) {
                for ($ = [], R = X(); R !== o; ) $.push(R), (R = X());
                $ !== o ? ((Y = a), (m = S(y)), (a = m)) : ((l = a), (a = u));
              } else (l = a), (a = u);
            else (l = a), (a = u);
          } else (l = a), (a = u);
        else (l = a), (a = u);
        if (a === o) {
          for (a = l, m = [], y = X(); y !== o; ) m.push(y), (y = X());
          if (m !== o)
            if (((y = ad()), y !== o)) {
              for (w = [], A = X(); A !== o; ) w.push(A), (A = X());
              if (w !== o)
                if (
                  (n.charCodeAt(l) === 46
                    ? ((A = N), l++)
                    : ((A = o), U === 0 && _(M)),
                  A !== o)
                ) {
                  for ($ = [], R = X(); R !== o; ) $.push(R), (R = X());
                  $ !== o ? ((Y = a), (m = S(y)), (a = m)) : ((l = a), (a = u));
                } else (l = a), (a = u);
              else (l = a), (a = u);
            } else (l = a), (a = u);
          else (l = a), (a = u);
        }
        return (L[W] = { nextPos: l, result: a }), a;
      }
      function ob() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R = l * 49 + 9,
          W = L[R];
        if (W) return (l = W.nextPos), W.result;
        if (((a = l), (m = Ms()), m !== o)) {
          for (y = [], w = X(); w !== o; ) y.push(w), (w = X());
          if (y !== o)
            if (
              (n.charCodeAt(l) === 61
                ? ((w = Z), l++)
                : ((w = o), U === 0 && _(G)),
              w !== o)
            ) {
              for (A = [], $ = X(); $ !== o; ) A.push($), ($ = X());
              A !== o
                ? (($ = ao()),
                  $ !== o
                    ? ((Y = a), (m = J(m, $)), (a = m))
                    : ((l = a), (a = u)))
                : ((l = a), (a = u));
            } else (l = a), (a = u);
          else (l = a), (a = u);
        } else (l = a), (a = u);
        if (a === o)
          if (((a = l), (m = ad()), m !== o)) {
            for (y = [], w = X(); w !== o; ) y.push(w), (w = X());
            if (y !== o)
              if (
                (n.charCodeAt(l) === 61
                  ? ((w = Z), l++)
                  : ((w = o), U === 0 && _(G)),
                w !== o)
              ) {
                for (A = [], $ = X(); $ !== o; ) A.push($), ($ = X());
                A !== o
                  ? (($ = ao()),
                    $ !== o
                      ? ((Y = a), (m = J(m, $)), (a = m))
                      : ((l = a), (a = u)))
                  : ((l = a), (a = u));
              } else (l = a), (a = u);
            else (l = a), (a = u);
          } else (l = a), (a = u);
        return (L[R] = { nextPos: l, result: a }), a;
      }
      function Ms() {
        var a,
          m,
          y,
          w = l * 49 + 10,
          A = L[w];
        if (A) return (l = A.nextPos), A.result;
        if (((a = l), (m = []), (y = zf()), y !== o))
          for (; y !== o; ) m.push(y), (y = zf());
        else m = u;
        return (
          m !== o && ((Y = a), (m = te(m))),
          (a = m),
          (L[w] = { nextPos: l, result: a }),
          a
        );
      }
      function ad() {
        var a,
          m,
          y = l * 49 + 11,
          w = L[y];
        return w
          ? ((l = w.nextPos), w.result)
          : ((a = l),
            (m = $f()),
            m !== o && ((Y = a), (m = z(m))),
            (a = m),
            a === o &&
              ((a = l), (m = Bf()), m !== o && ((Y = a), (m = z(m))), (a = m)),
            (L[y] = { nextPos: l, result: a }),
            a);
      }
      function ao() {
        var a,
          m = l * 49 + 12,
          y = L[m];
        return y
          ? ((l = y.nextPos), y.result)
          : ((a = sb()),
            a === o &&
              ((a = gb()),
              a === o &&
                ((a = ub()),
                a === o &&
                  ((a = db()),
                  a === o &&
                    ((a = lb()),
                    a === o && ((a = fb()), a === o && (a = pb())))))),
            (L[m] = { nextPos: l, result: a }),
            a);
      }
      function sb() {
        var a,
          m = l * 49 + 13,
          y = L[m];
        return y
          ? ((l = y.nextPos), y.result)
          : ((a = ib()),
            a === o &&
              ((a = $f()), a === o && ((a = ab()), a === o && (a = Bf()))),
            (L[m] = { nextPos: l, result: a }),
            a);
      }
      function ib() {
        var a,
          m,
          y,
          w,
          A,
          $ = l * 49 + 14,
          R = L[$];
        if (R) return (l = R.nextPos), R.result;
        if (
          ((a = l),
          n.substr(l, 3) === q
            ? ((m = q), (l += 3))
            : ((m = o), U === 0 && _(j)),
          m !== o)
        )
          if (((y = Ot()), y === o && (y = ee), y !== o)) {
            for (w = [], A = Rf(); A !== o; ) w.push(A), (A = Rf());
            w !== o
              ? (n.substr(l, 3) === q
                  ? ((A = q), (l += 3))
                  : ((A = o), U === 0 && _(j)),
                A !== o ? ((Y = a), (m = re(w)), (a = m)) : ((l = a), (a = u)))
              : ((l = a), (a = u));
          } else (l = a), (a = u);
        else (l = a), (a = u);
        return (L[$] = { nextPos: l, result: a }), a;
      }
      function $f() {
        var a,
          m,
          y,
          w,
          A = l * 49 + 15,
          $ = L[A];
        if ($) return (l = $.nextPos), $.result;
        if (
          ((a = l),
          n.charCodeAt(l) === 34
            ? ((m = de), l++)
            : ((m = o), U === 0 && _(be)),
          m !== o)
        ) {
          for (y = [], w = If(); w !== o; ) y.push(w), (w = If());
          y !== o
            ? (n.charCodeAt(l) === 34
                ? ((w = de), l++)
                : ((w = o), U === 0 && _(be)),
              w !== o ? ((Y = a), (m = re(y)), (a = m)) : ((l = a), (a = u)))
            : ((l = a), (a = u));
        } else (l = a), (a = u);
        return (L[A] = { nextPos: l, result: a }), a;
      }
      function ab() {
        var a,
          m,
          y,
          w,
          A,
          $ = l * 49 + 16,
          R = L[$];
        if (R) return (l = R.nextPos), R.result;
        if (
          ((a = l),
          n.substr(l, 3) === xe
            ? ((m = xe), (l += 3))
            : ((m = o), U === 0 && _(Oe)),
          m !== o)
        )
          if (((y = Ot()), y === o && (y = ee), y !== o)) {
            for (w = [], A = Nf(); A !== o; ) w.push(A), (A = Nf());
            w !== o
              ? (n.substr(l, 3) === xe
                  ? ((A = xe), (l += 3))
                  : ((A = o), U === 0 && _(Oe)),
                A !== o ? ((Y = a), (m = re(w)), (a = m)) : ((l = a), (a = u)))
              : ((l = a), (a = u));
          } else (l = a), (a = u);
        else (l = a), (a = u);
        return (L[$] = { nextPos: l, result: a }), a;
      }
      function Bf() {
        var a,
          m,
          y,
          w,
          A = l * 49 + 17,
          $ = L[A];
        if ($) return (l = $.nextPos), $.result;
        if (
          ((a = l),
          n.charCodeAt(l) === 39
            ? ((m = Ze), l++)
            : ((m = o), U === 0 && _(Ie)),
          m !== o)
        ) {
          for (y = [], w = Sf(); w !== o; ) y.push(w), (w = Sf());
          y !== o
            ? (n.charCodeAt(l) === 39
                ? ((w = Ze), l++)
                : ((w = o), U === 0 && _(Ie)),
              w !== o ? ((Y = a), (m = re(y)), (a = m)) : ((l = a), (a = u)))
            : ((l = a), (a = u));
        } else (l = a), (a = u);
        return (L[A] = { nextPos: l, result: a }), a;
      }
      function If() {
        var a,
          m,
          y,
          w = l * 49 + 18,
          A = L[w];
        return A
          ? ((l = A.nextPos), A.result)
          : ((a = _f()),
            a === o &&
              ((a = l),
              (m = l),
              U++,
              n.charCodeAt(l) === 34
                ? ((y = de), l++)
                : ((y = o), U === 0 && _(be)),
              U--,
              y === o ? (m = b) : ((l = m), (m = u)),
              m !== o
                ? (n.length > l
                    ? ((y = n.charAt(l)), l++)
                    : ((y = o), U === 0 && _(E)),
                  y !== o
                    ? ((Y = a), (m = Ct(y)), (a = m))
                    : ((l = a), (a = u)))
                : ((l = a), (a = u))),
            (L[w] = { nextPos: l, result: a }),
            a);
      }
      function Sf() {
        var a,
          m,
          y,
          w = l * 49 + 19,
          A = L[w];
        return A
          ? ((l = A.nextPos), A.result)
          : ((a = l),
            (m = l),
            U++,
            n.charCodeAt(l) === 39
              ? ((y = Ze), l++)
              : ((y = o), U === 0 && _(Ie)),
            U--,
            y === o ? (m = b) : ((l = m), (m = u)),
            m !== o
              ? (n.length > l
                  ? ((y = n.charAt(l)), l++)
                  : ((y = o), U === 0 && _(E)),
                y !== o ? ((Y = a), (m = Ct(y)), (a = m)) : ((l = a), (a = u)))
              : ((l = a), (a = u)),
            (L[w] = { nextPos: l, result: a }),
            a);
      }
      function Rf() {
        var a,
          m,
          y,
          w = l * 49 + 20,
          A = L[w];
        return A
          ? ((l = A.nextPos), A.result)
          : ((a = _f()),
            a === o &&
              ((a = cb()),
              a === o &&
                ((a = l),
                (m = l),
                U++,
                n.substr(l, 3) === q
                  ? ((y = q), (l += 3))
                  : ((y = o), U === 0 && _(j)),
                U--,
                y === o ? (m = b) : ((l = m), (m = u)),
                m !== o
                  ? (n.length > l
                      ? ((y = n.charAt(l)), l++)
                      : ((y = o), U === 0 && _(E)),
                    y !== o
                      ? ((Y = a), (m = At(y)), (a = m))
                      : ((l = a), (a = u)))
                  : ((l = a), (a = u)))),
            (L[w] = { nextPos: l, result: a }),
            a);
      }
      function cb() {
        var a,
          m,
          y,
          w,
          A,
          $ = l * 49 + 21,
          R = L[$];
        if (R) return (l = R.nextPos), R.result;
        if (
          ((a = l),
          n.charCodeAt(l) === 92
            ? ((m = ne), l++)
            : ((m = o), U === 0 && _(Te)),
          m !== o)
        )
          if (((y = Ot()), y !== o)) {
            for (w = [], A = Lf(); A !== o; ) w.push(A), (A = Lf());
            w !== o ? ((Y = a), (m = mt()), (a = m)) : ((l = a), (a = u));
          } else (l = a), (a = u);
        else (l = a), (a = u);
        return (L[$] = { nextPos: l, result: a }), a;
      }
      function Nf() {
        var a,
          m,
          y,
          w = l * 49 + 22,
          A = L[w];
        return A
          ? ((l = A.nextPos), A.result)
          : ((a = l),
            (m = l),
            U++,
            n.substr(l, 3) === xe
              ? ((y = xe), (l += 3))
              : ((y = o), U === 0 && _(Oe)),
            U--,
            y === o ? (m = b) : ((l = m), (m = u)),
            m !== o
              ? (n.length > l
                  ? ((y = n.charAt(l)), l++)
                  : ((y = o), U === 0 && _(E)),
                y !== o ? ((Y = a), (m = Ct(y)), (a = m)) : ((l = a), (a = u)))
              : ((l = a), (a = u)),
            (L[w] = { nextPos: l, result: a }),
            a);
      }
      function ub() {
        var a,
          m,
          y,
          w,
          A = l * 49 + 23,
          $ = L[A];
        return $
          ? ((l = $.nextPos), $.result)
          : ((a = l),
            (m = Ff()),
            m === o && (m = cd()),
            m !== o
              ? (n.charCodeAt(l) === 101
                  ? ((y = Nt), l++)
                  : ((y = o), U === 0 && _(Gt)),
                y === o &&
                  (n.charCodeAt(l) === 69
                    ? ((y = Wt), l++)
                    : ((y = o), U === 0 && _(cr))),
                y !== o
                  ? ((w = cd()),
                    w !== o
                      ? ((Y = a), (m = Br(m, w)), (a = m))
                      : ((l = a), (a = u)))
                  : ((l = a), (a = u)))
              : ((l = a), (a = u)),
            a === o &&
              ((a = l), (m = Ff()), m !== o && ((Y = a), (m = Kr(m))), (a = m)),
            (L[A] = { nextPos: l, result: a }),
            a);
      }
      function Ff() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R = l * 49 + 24,
          W = L[R];
        return W
          ? ((l = W.nextPos), W.result)
          : ((a = l),
            n.charCodeAt(l) === 43
              ? ((m = td), l++)
              : ((m = o), U === 0 && _(rd)),
            m === o && (m = ee),
            m !== o
              ? ((y = l),
                (w = Us()),
                w !== o
                  ? (n.charCodeAt(l) === 46
                      ? ((A = N), l++)
                      : ((A = o), U === 0 && _(M)),
                    A !== o
                      ? (($ = Us()),
                        $ !== o
                          ? ((w = [w, A, $]), (y = w))
                          : ((l = y), (y = u)))
                      : ((l = y), (y = u)))
                  : ((l = y), (y = u)),
                y !== o ? ((Y = a), (m = Ql(y)), (a = m)) : ((l = a), (a = u)))
              : ((l = a), (a = u)),
            a === o &&
              ((a = l),
              n.charCodeAt(l) === 45
                ? ((m = Rs), l++)
                : ((m = o), U === 0 && _(Ns)),
              m !== o
                ? ((y = l),
                  (w = Us()),
                  w !== o
                    ? (n.charCodeAt(l) === 46
                        ? ((A = N), l++)
                        : ((A = o), U === 0 && _(M)),
                      A !== o
                        ? (($ = Us()),
                          $ !== o
                            ? ((w = [w, A, $]), (y = w))
                            : ((l = y), (y = u)))
                        : ((l = y), (y = u)))
                    : ((l = y), (y = u)),
                  y !== o
                    ? ((Y = a), (m = ef(y)), (a = m))
                    : ((l = a), (a = u)))
                : ((l = a), (a = u))),
            (L[R] = { nextPos: l, result: a }),
            a);
      }
      function db() {
        var a,
          m,
          y = l * 49 + 25,
          w = L[y];
        return w
          ? ((l = w.nextPos), w.result)
          : ((a = l),
            (m = cd()),
            m !== o && ((Y = a), (m = sy(m))),
            (a = m),
            (L[y] = { nextPos: l, result: a }),
            a);
      }
      function cd() {
        var a,
          m,
          y,
          w,
          A,
          $ = l * 49 + 26,
          R = L[$];
        if (R) return (l = R.nextPos), R.result;
        if (
          ((a = l),
          n.charCodeAt(l) === 43
            ? ((m = td), l++)
            : ((m = o), U === 0 && _(rd)),
          m === o && (m = ee),
          m !== o)
        ) {
          if (((y = []), (w = he()), w !== o))
            for (; w !== o; ) y.push(w), (w = he());
          else y = u;
          y !== o
            ? ((w = l),
              U++,
              n.charCodeAt(l) === 46
                ? ((A = N), l++)
                : ((A = o), U === 0 && _(M)),
              U--,
              A === o ? (w = b) : ((l = w), (w = u)),
              w !== o ? ((Y = a), (m = Ql(y)), (a = m)) : ((l = a), (a = u)))
            : ((l = a), (a = u));
        } else (l = a), (a = u);
        if (a === o)
          if (
            ((a = l),
            n.charCodeAt(l) === 45
              ? ((m = Rs), l++)
              : ((m = o), U === 0 && _(Ns)),
            m !== o)
          ) {
            if (((y = []), (w = he()), w !== o))
              for (; w !== o; ) y.push(w), (w = he());
            else y = u;
            y !== o
              ? ((w = l),
                U++,
                n.charCodeAt(l) === 46
                  ? ((A = N), l++)
                  : ((A = o), U === 0 && _(M)),
                U--,
                A === o ? (w = b) : ((l = w), (w = u)),
                w !== o ? ((Y = a), (m = ef(y)), (a = m)) : ((l = a), (a = u)))
              : ((l = a), (a = u));
          } else (l = a), (a = u);
        return (L[$] = { nextPos: l, result: a }), a;
      }
      function lb() {
        var a,
          m,
          y = l * 49 + 27,
          w = L[y];
        return w
          ? ((l = w.nextPos), w.result)
          : ((a = l),
            n.substr(l, 4) === tf
              ? ((m = tf), (l += 4))
              : ((m = o), U === 0 && _(iy)),
            m !== o && ((Y = a), (m = ay())),
            (a = m),
            a === o &&
              ((a = l),
              n.substr(l, 5) === rf
                ? ((m = rf), (l += 5))
                : ((m = o), U === 0 && _(cy)),
              m !== o && ((Y = a), (m = uy())),
              (a = m)),
            (L[y] = { nextPos: l, result: a }),
            a);
      }
      function fb() {
        var a,
          m,
          y,
          w,
          A,
          $ = l * 49 + 28,
          R = L[$];
        if (R) return (l = R.nextPos), R.result;
        if (
          ((a = l),
          n.charCodeAt(l) === 91 ? ((m = T), l++) : ((m = o), U === 0 && _(P)),
          m !== o)
        ) {
          for (y = [], w = Ft(); w !== o; ) y.push(w), (w = Ft());
          y !== o
            ? (n.charCodeAt(l) === 93
                ? ((w = v), l++)
                : ((w = o), U === 0 && _(C)),
              w !== o ? ((Y = a), (m = dy()), (a = m)) : ((l = a), (a = u)))
            : ((l = a), (a = u));
        } else (l = a), (a = u);
        if (
          a === o &&
          ((a = l),
          n.charCodeAt(l) === 91 ? ((m = T), l++) : ((m = o), U === 0 && _(P)),
          m !== o
            ? ((y = Of()),
              y === o && (y = ee),
              y !== o
                ? (n.charCodeAt(l) === 93
                    ? ((w = v), l++)
                    : ((w = o), U === 0 && _(C)),
                  w !== o
                    ? ((Y = a), (m = ly(y)), (a = m))
                    : ((l = a), (a = u)))
                : ((l = a), (a = u)))
            : ((l = a), (a = u)),
          a === o)
        ) {
          if (
            ((a = l),
            n.charCodeAt(l) === 91
              ? ((m = T), l++)
              : ((m = o), U === 0 && _(P)),
            m !== o)
          ) {
            if (((y = []), (w = zi()), w !== o))
              for (; w !== o; ) y.push(w), (w = zi());
            else y = u;
            y !== o
              ? (n.charCodeAt(l) === 93
                  ? ((w = v), l++)
                  : ((w = o), U === 0 && _(C)),
                w !== o ? ((Y = a), (m = fy(y)), (a = m)) : ((l = a), (a = u)))
              : ((l = a), (a = u));
          } else (l = a), (a = u);
          if (a === o)
            if (
              ((a = l),
              n.charCodeAt(l) === 91
                ? ((m = T), l++)
                : ((m = o), U === 0 && _(P)),
              m !== o)
            ) {
              if (((y = []), (w = zi()), w !== o))
                for (; w !== o; ) y.push(w), (w = zi());
              else y = u;
              y !== o
                ? ((w = Of()),
                  w !== o
                    ? (n.charCodeAt(l) === 93
                        ? ((A = v), l++)
                        : ((A = o), U === 0 && _(C)),
                      A !== o
                        ? ((Y = a), (m = py(y, w)), (a = m))
                        : ((l = a), (a = u)))
                    : ((l = a), (a = u)))
                : ((l = a), (a = u));
            } else (l = a), (a = u);
        }
        return (L[$] = { nextPos: l, result: a }), a;
      }
      function Of() {
        var a,
          m,
          y,
          w,
          A,
          $ = l * 49 + 29,
          R = L[$];
        if (R) return (l = R.nextPos), R.result;
        for (a = l, m = [], y = Ft(); y !== o; ) m.push(y), (y = Ft());
        if (m !== o)
          if (((y = ao()), y !== o)) {
            for (w = [], A = Ft(); A !== o; ) w.push(A), (A = Ft());
            w !== o ? ((Y = a), (m = nf(y)), (a = m)) : ((l = a), (a = u));
          } else (l = a), (a = u);
        else (l = a), (a = u);
        return (L[$] = { nextPos: l, result: a }), a;
      }
      function zi() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R,
          W = l * 49 + 30,
          ie = L[W];
        if (ie) return (l = ie.nextPos), ie.result;
        for (a = l, m = [], y = Ft(); y !== o; ) m.push(y), (y = Ft());
        if (m !== o)
          if (((y = ao()), y !== o)) {
            for (w = [], A = Ft(); A !== o; ) w.push(A), (A = Ft());
            if (w !== o)
              if (
                (n.charCodeAt(l) === 44
                  ? ((A = of), l++)
                  : ((A = o), U === 0 && _(sf)),
                A !== o)
              ) {
                for ($ = [], R = Ft(); R !== o; ) $.push(R), (R = Ft());
                $ !== o ? ((Y = a), (m = nf(y)), (a = m)) : ((l = a), (a = u));
              } else (l = a), (a = u);
            else (l = a), (a = u);
          } else (l = a), (a = u);
        else (l = a), (a = u);
        return (L[W] = { nextPos: l, result: a }), a;
      }
      function Ft() {
        var a,
          m = l * 49 + 31,
          y = L[m];
        return y
          ? ((l = y.nextPos), y.result)
          : ((a = X()),
            a === o && ((a = Ot()), a === o && (a = Li())),
            (L[m] = { nextPos: l, result: a }),
            a);
      }
      function pb() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R = l * 49 + 32,
          W = L[R];
        if (W) return (l = W.nextPos), W.result;
        if (
          ((a = l),
          n.charCodeAt(l) === 123
            ? ((m = my), l++)
            : ((m = o), U === 0 && _(hy)),
          m !== o)
        ) {
          for (y = [], w = X(); w !== o; ) y.push(w), (w = X());
          if (y !== o) {
            for (w = [], A = Df(); A !== o; ) w.push(A), (A = Df());
            if (w !== o) {
              for (A = [], $ = X(); $ !== o; ) A.push($), ($ = X());
              A !== o
                ? (n.charCodeAt(l) === 125
                    ? (($ = gy), l++)
                    : (($ = o), U === 0 && _(yy)),
                  $ !== o
                    ? ((Y = a), (m = by(w)), (a = m))
                    : ((l = a), (a = u)))
                : ((l = a), (a = u));
            } else (l = a), (a = u);
          } else (l = a), (a = u);
        } else (l = a), (a = u);
        return (L[R] = { nextPos: l, result: a }), a;
      }
      function Df() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R,
          W,
          ie,
          ye,
          fe,
          ke = l * 49 + 33,
          Se = L[ke];
        if (Se) return (l = Se.nextPos), Se.result;
        for (a = l, m = [], y = X(); y !== o; ) m.push(y), (y = X());
        if (m !== o)
          if (((y = Ms()), y !== o)) {
            for (w = [], A = X(); A !== o; ) w.push(A), (A = X());
            if (w !== o)
              if (
                (n.charCodeAt(l) === 61
                  ? ((A = Z), l++)
                  : ((A = o), U === 0 && _(G)),
                A !== o)
              ) {
                for ($ = [], R = X(); R !== o; ) $.push(R), (R = X());
                if ($ !== o)
                  if (((R = ao()), R !== o)) {
                    for (W = [], ie = X(); ie !== o; ) W.push(ie), (ie = X());
                    if (W !== o)
                      if (
                        (n.charCodeAt(l) === 44
                          ? ((ie = of), l++)
                          : ((ie = o), U === 0 && _(sf)),
                        ie !== o)
                      ) {
                        for (ye = [], fe = X(); fe !== o; )
                          ye.push(fe), (fe = X());
                        ye !== o
                          ? ((Y = a), (m = af(y, R)), (a = m))
                          : ((l = a), (a = u));
                      } else (l = a), (a = u);
                    else (l = a), (a = u);
                  } else (l = a), (a = u);
                else (l = a), (a = u);
              } else (l = a), (a = u);
            else (l = a), (a = u);
          } else (l = a), (a = u);
        else (l = a), (a = u);
        if (a === o) {
          for (a = l, m = [], y = X(); y !== o; ) m.push(y), (y = X());
          if (m !== o)
            if (((y = Ms()), y !== o)) {
              for (w = [], A = X(); A !== o; ) w.push(A), (A = X());
              if (w !== o)
                if (
                  (n.charCodeAt(l) === 61
                    ? ((A = Z), l++)
                    : ((A = o), U === 0 && _(G)),
                  A !== o)
                ) {
                  for ($ = [], R = X(); R !== o; ) $.push(R), (R = X());
                  $ !== o
                    ? ((R = ao()),
                      R !== o
                        ? ((Y = a), (m = af(y, R)), (a = m))
                        : ((l = a), (a = u)))
                    : ((l = a), (a = u));
                } else (l = a), (a = u);
              else (l = a), (a = u);
            } else (l = a), (a = u);
          else (l = a), (a = u);
        }
        return (L[ke] = { nextPos: l, result: a }), a;
      }
      function Mf() {
        var a,
          m,
          y,
          w = l * 49 + 34,
          A = L[w];
        return A
          ? ((l = A.nextPos), A.result)
          : ((a = l),
            n.charCodeAt(l) === 46
              ? ((m = N), l++)
              : ((m = o), U === 0 && _(M)),
            m !== o
              ? ((y = Us()),
                y !== o ? ((Y = a), (m = xy(y)), (a = m)) : ((l = a), (a = u)))
              : ((l = a), (a = u)),
            (L[w] = { nextPos: l, result: a }),
            a);
      }
      function Uf() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R,
          W,
          ie,
          ye,
          fe,
          ke,
          Se = l * 49 + 35,
          Pt = L[Se];
        return Pt
          ? ((l = Pt.nextPos), Pt.result)
          : ((a = l),
            (m = l),
            (y = he()),
            y !== o
              ? ((w = he()),
                w !== o
                  ? ((A = he()),
                    A !== o
                      ? (($ = he()),
                        $ !== o
                          ? (n.charCodeAt(l) === 45
                              ? ((R = Rs), l++)
                              : ((R = o), U === 0 && _(Ns)),
                            R !== o
                              ? ((W = he()),
                                W !== o
                                  ? ((ie = he()),
                                    ie !== o
                                      ? (n.charCodeAt(l) === 45
                                          ? ((ye = Rs), l++)
                                          : ((ye = o), U === 0 && _(Ns)),
                                        ye !== o
                                          ? ((fe = he()),
                                            fe !== o
                                              ? ((ke = he()),
                                                ke !== o
                                                  ? ((y = [
                                                      y,
                                                      w,
                                                      A,
                                                      $,
                                                      R,
                                                      W,
                                                      ie,
                                                      ye,
                                                      fe,
                                                      ke,
                                                    ]),
                                                    (m = y))
                                                  : ((l = m), (m = u)))
                                              : ((l = m), (m = u)))
                                          : ((l = m), (m = u)))
                                      : ((l = m), (m = u)))
                                  : ((l = m), (m = u)))
                              : ((l = m), (m = u)))
                          : ((l = m), (m = u)))
                      : ((l = m), (m = u)))
                  : ((l = m), (m = u)))
              : ((l = m), (m = u)),
            m !== o && ((Y = a), (m = wy(m))),
            (a = m),
            (L[Se] = { nextPos: l, result: a }),
            a);
      }
      function mb() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R,
          W,
          ie,
          ye,
          fe,
          ke = l * 49 + 36,
          Se = L[ke];
        return Se
          ? ((l = Se.nextPos), Se.result)
          : ((a = l),
            (m = l),
            (y = he()),
            y !== o
              ? ((w = he()),
                w !== o
                  ? (n.charCodeAt(l) === 58
                      ? ((A = Fs), l++)
                      : ((A = o), U === 0 && _(Os)),
                    A !== o
                      ? (($ = he()),
                        $ !== o
                          ? ((R = he()),
                            R !== o
                              ? (n.charCodeAt(l) === 58
                                  ? ((W = Fs), l++)
                                  : ((W = o), U === 0 && _(Os)),
                                W !== o
                                  ? ((ie = he()),
                                    ie !== o
                                      ? ((ye = he()),
                                        ye !== o
                                          ? ((fe = Mf()),
                                            fe === o && (fe = ee),
                                            fe !== o
                                              ? ((y = [
                                                  y,
                                                  w,
                                                  A,
                                                  $,
                                                  R,
                                                  W,
                                                  ie,
                                                  ye,
                                                  fe,
                                                ]),
                                                (m = y))
                                              : ((l = m), (m = u)))
                                          : ((l = m), (m = u)))
                                      : ((l = m), (m = u)))
                                  : ((l = m), (m = u)))
                              : ((l = m), (m = u)))
                          : ((l = m), (m = u)))
                      : ((l = m), (m = u)))
                  : ((l = m), (m = u)))
              : ((l = m), (m = u)),
            m !== o && ((Y = a), (m = cf(m))),
            (a = m),
            (L[ke] = { nextPos: l, result: a }),
            a);
      }
      function hb() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R,
          W,
          ie,
          ye,
          fe,
          ke,
          Se,
          Pt,
          co,
          Jr,
          kt,
          jf = l * 49 + 37,
          dd = L[jf];
        return dd
          ? ((l = dd.nextPos), dd.result)
          : ((a = l),
            (m = l),
            (y = he()),
            y !== o
              ? ((w = he()),
                w !== o
                  ? (n.charCodeAt(l) === 58
                      ? ((A = Fs), l++)
                      : ((A = o), U === 0 && _(Os)),
                    A !== o
                      ? (($ = he()),
                        $ !== o
                          ? ((R = he()),
                            R !== o
                              ? (n.charCodeAt(l) === 58
                                  ? ((W = Fs), l++)
                                  : ((W = o), U === 0 && _(Os)),
                                W !== o
                                  ? ((ie = he()),
                                    ie !== o
                                      ? ((ye = he()),
                                        ye !== o
                                          ? ((fe = Mf()),
                                            fe === o && (fe = ee),
                                            fe !== o
                                              ? (n.charCodeAt(l) === 45
                                                  ? ((ke = Rs), l++)
                                                  : ((ke = o),
                                                    U === 0 && _(Ns)),
                                                ke === o &&
                                                  (n.charCodeAt(l) === 43
                                                    ? ((ke = td), l++)
                                                    : ((ke = o),
                                                      U === 0 && _(rd))),
                                                ke !== o
                                                  ? ((Se = he()),
                                                    Se !== o
                                                      ? ((Pt = he()),
                                                        Pt !== o
                                                          ? (n.charCodeAt(l) ===
                                                            58
                                                              ? ((co = Fs), l++)
                                                              : ((co = o),
                                                                U === 0 &&
                                                                  _(Os)),
                                                            co !== o
                                                              ? ((Jr = he()),
                                                                Jr !== o
                                                                  ? ((kt =
                                                                      he()),
                                                                    kt !== o
                                                                      ? ((y = [
                                                                          y,
                                                                          w,
                                                                          A,
                                                                          $,
                                                                          R,
                                                                          W,
                                                                          ie,
                                                                          ye,
                                                                          fe,
                                                                          ke,
                                                                          Se,
                                                                          Pt,
                                                                          co,
                                                                          Jr,
                                                                          kt,
                                                                        ]),
                                                                        (m = y))
                                                                      : ((l =
                                                                          m),
                                                                        (m =
                                                                          u)))
                                                                  : ((l = m),
                                                                    (m = u)))
                                                              : ((l = m),
                                                                (m = u)))
                                                          : ((l = m), (m = u)))
                                                      : ((l = m), (m = u)))
                                                  : ((l = m), (m = u)))
                                              : ((l = m), (m = u)))
                                          : ((l = m), (m = u)))
                                      : ((l = m), (m = u)))
                                  : ((l = m), (m = u)))
                              : ((l = m), (m = u)))
                          : ((l = m), (m = u)))
                      : ((l = m), (m = u)))
                  : ((l = m), (m = u)))
              : ((l = m), (m = u)),
            m !== o && ((Y = a), (m = cf(m))),
            (a = m),
            (L[jf] = { nextPos: l, result: a }),
            a);
      }
      function gb() {
        var a,
          m,
          y,
          w,
          A,
          $ = l * 49 + 38,
          R = L[$];
        return R
          ? ((l = R.nextPos), R.result)
          : ((a = l),
            (m = Uf()),
            m !== o
              ? (n.charCodeAt(l) === 84
                  ? ((y = uf), l++)
                  : ((y = o), U === 0 && _(df)),
                y !== o
                  ? ((w = mb()),
                    w !== o
                      ? (n.charCodeAt(l) === 90
                          ? ((A = vy), l++)
                          : ((A = o), U === 0 && _(Ty)),
                        A !== o
                          ? ((Y = a), (m = Ey(m, w)), (a = m))
                          : ((l = a), (a = u)))
                      : ((l = a), (a = u)))
                  : ((l = a), (a = u)))
              : ((l = a), (a = u)),
            a === o &&
              ((a = l),
              (m = Uf()),
              m !== o
                ? (n.charCodeAt(l) === 84
                    ? ((y = uf), l++)
                    : ((y = o), U === 0 && _(df)),
                  y !== o
                    ? ((w = hb()),
                      w !== o
                        ? ((Y = a), (m = Cy(m, w)), (a = m))
                        : ((l = a), (a = u)))
                    : ((l = a), (a = u)))
                : ((l = a), (a = u))),
            (L[$] = { nextPos: l, result: a }),
            a);
      }
      function X() {
        var a,
          m = l * 49 + 39,
          y = L[m];
        return y
          ? ((l = y.nextPos), y.result)
          : (Ay.test(n.charAt(l))
              ? ((a = n.charAt(l)), l++)
              : ((a = o), U === 0 && _(Py)),
            (L[m] = { nextPos: l, result: a }),
            a);
      }
      function Ot() {
        var a,
          m,
          y,
          w = l * 49 + 40,
          A = L[w];
        return A
          ? ((l = A.nextPos), A.result)
          : (n.charCodeAt(l) === 10
              ? ((a = lf), l++)
              : ((a = o), U === 0 && _(ff)),
            a === o &&
              ((a = l),
              n.charCodeAt(l) === 13
                ? ((m = ky), l++)
                : ((m = o), U === 0 && _($y)),
              m !== o
                ? (n.charCodeAt(l) === 10
                    ? ((y = lf), l++)
                    : ((y = o), U === 0 && _(ff)),
                  y !== o ? ((m = [m, y]), (a = m)) : ((l = a), (a = u)))
                : ((l = a), (a = u))),
            (L[w] = { nextPos: l, result: a }),
            a);
      }
      function Lf() {
        var a,
          m = l * 49 + 41,
          y = L[m];
        return y
          ? ((l = y.nextPos), y.result)
          : ((a = Ot()),
            a === o && (a = X()),
            (L[m] = { nextPos: l, result: a }),
            a);
      }
      function _i() {
        var a,
          m,
          y = l * 49 + 42,
          w = L[y];
        return w
          ? ((l = w.nextPos), w.result)
          : ((a = l),
            U++,
            n.length > l
              ? ((m = n.charAt(l)), l++)
              : ((m = o), U === 0 && _(E)),
            U--,
            m === o ? (a = b) : ((l = a), (a = u)),
            (L[y] = { nextPos: l, result: a }),
            a);
      }
      function Dt() {
        var a,
          m = l * 49 + 43,
          y = L[m];
        return y
          ? ((l = y.nextPos), y.result)
          : (By.test(n.charAt(l))
              ? ((a = n.charAt(l)), l++)
              : ((a = o), U === 0 && _(Iy)),
            (L[m] = { nextPos: l, result: a }),
            a);
      }
      function he() {
        var a,
          m,
          y = l * 49 + 44,
          w = L[y];
        return w
          ? ((l = w.nextPos), w.result)
          : (Sy.test(n.charAt(l))
              ? ((a = n.charAt(l)), l++)
              : ((a = o), U === 0 && _(Ry)),
            a === o &&
              ((a = l),
              n.charCodeAt(l) === 95
                ? ((m = Ny), l++)
                : ((m = o), U === 0 && _(Fy)),
              m !== o && ((Y = a), (m = Oy())),
              (a = m)),
            (L[y] = { nextPos: l, result: a }),
            a);
      }
      function zf() {
        var a,
          m = l * 49 + 45,
          y = L[m];
        return y
          ? ((l = y.nextPos), y.result)
          : (Dy.test(n.charAt(l))
              ? ((a = n.charAt(l)), l++)
              : ((a = o), U === 0 && _(My)),
            (L[m] = { nextPos: l, result: a }),
            a);
      }
      function Us() {
        var a,
          m,
          y,
          w = l * 49 + 46,
          A = L[w];
        if (A) return (l = A.nextPos), A.result;
        if (((a = l), (m = []), (y = he()), y !== o))
          for (; y !== o; ) m.push(y), (y = he());
        else m = u;
        return (
          m !== o && ((Y = a), (m = Uy(m))),
          (a = m),
          (L[w] = { nextPos: l, result: a }),
          a
        );
      }
      function _f() {
        var a,
          m,
          y = l * 49 + 47,
          w = L[y];
        return w
          ? ((l = w.nextPos), w.result)
          : ((a = l),
            n.substr(l, 2) === pf
              ? ((m = pf), (l += 2))
              : ((m = o), U === 0 && _(Ly)),
            m !== o && ((Y = a), (m = zy())),
            (a = m),
            a === o &&
              ((a = l),
              n.substr(l, 2) === mf
                ? ((m = mf), (l += 2))
                : ((m = o), U === 0 && _(_y)),
              m !== o && ((Y = a), (m = Hy())),
              (a = m),
              a === o &&
                ((a = l),
                n.substr(l, 2) === hf
                  ? ((m = hf), (l += 2))
                  : ((m = o), U === 0 && _(jy)),
                m !== o && ((Y = a), (m = qy())),
                (a = m),
                a === o &&
                  ((a = l),
                  n.substr(l, 2) === gf
                    ? ((m = gf), (l += 2))
                    : ((m = o), U === 0 && _(Vy)),
                  m !== o && ((Y = a), (m = Gy())),
                  (a = m),
                  a === o &&
                    ((a = l),
                    n.substr(l, 2) === yf
                      ? ((m = yf), (l += 2))
                      : ((m = o), U === 0 && _(Wy)),
                    m !== o && ((Y = a), (m = Zy())),
                    (a = m),
                    a === o &&
                      ((a = l),
                      n.substr(l, 2) === bf
                        ? ((m = bf), (l += 2))
                        : ((m = o), U === 0 && _(Ky)),
                      m !== o && ((Y = a), (m = Jy())),
                      (a = m),
                      a === o &&
                        ((a = l),
                        n.substr(l, 2) === xf
                          ? ((m = xf), (l += 2))
                          : ((m = o), U === 0 && _(Yy)),
                        m !== o && ((Y = a), (m = Xy())),
                        (a = m),
                        a === o && (a = yb()))))))),
            (L[y] = { nextPos: l, result: a }),
            a);
      }
      function yb() {
        var a,
          m,
          y,
          w,
          A,
          $,
          R,
          W,
          ie,
          ye,
          fe,
          ke = l * 49 + 48,
          Se = L[ke];
        return Se
          ? ((l = Se.nextPos), Se.result)
          : ((a = l),
            n.substr(l, 2) === wf
              ? ((m = wf), (l += 2))
              : ((m = o), U === 0 && _(Qy)),
            m !== o
              ? ((y = l),
                (w = Dt()),
                w !== o
                  ? ((A = Dt()),
                    A !== o
                      ? (($ = Dt()),
                        $ !== o
                          ? ((R = Dt()),
                            R !== o
                              ? ((W = Dt()),
                                W !== o
                                  ? ((ie = Dt()),
                                    ie !== o
                                      ? ((ye = Dt()),
                                        ye !== o
                                          ? ((fe = Dt()),
                                            fe !== o
                                              ? ((w = [
                                                  w,
                                                  A,
                                                  $,
                                                  R,
                                                  W,
                                                  ie,
                                                  ye,
                                                  fe,
                                                ]),
                                                (y = w))
                                              : ((l = y), (y = u)))
                                          : ((l = y), (y = u)))
                                      : ((l = y), (y = u)))
                                  : ((l = y), (y = u)))
                              : ((l = y), (y = u)))
                          : ((l = y), (y = u)))
                      : ((l = y), (y = u)))
                  : ((l = y), (y = u)),
                y !== o ? ((Y = a), (m = vf(y)), (a = m)) : ((l = a), (a = u)))
              : ((l = a), (a = u)),
            a === o &&
              ((a = l),
              n.substr(l, 2) === Tf
                ? ((m = Tf), (l += 2))
                : ((m = o), U === 0 && _(eb)),
              m !== o
                ? ((y = l),
                  (w = Dt()),
                  w !== o
                    ? ((A = Dt()),
                      A !== o
                        ? (($ = Dt()),
                          $ !== o
                            ? ((R = Dt()),
                              R !== o
                                ? ((w = [w, A, $, R]), (y = w))
                                : ((l = y), (y = u)))
                            : ((l = y), (y = u)))
                        : ((l = y), (y = u)))
                    : ((l = y), (y = u)),
                  y !== o
                    ? ((Y = a), (m = vf(y)), (a = m))
                    : ((l = a), (a = u)))
                : ((l = a), (a = u))),
            (L[ke] = { nextPos: l, result: a }),
            a);
      }
      var Hf = [];
      function bb(a, m, y) {
        var w = new Error(a);
        throw ((w.line = m), (w.column = y), w);
      }
      function ud(a) {
        Hf.push(a);
      }
      function tt(a, m, y, w, A) {
        var $ = { type: a, value: m, line: y(), column: w() };
        return A && ($.key = A), $;
      }
      function xb(a, m, y) {
        var w = parseInt('0x' + a);
        if (
          !isFinite(w) ||
          Math.floor(w) != w ||
          w < 0 ||
          w > 1114111 ||
          (w > 55295 && w < 57344)
        )
          bb('Invalid Unicode escape code: ' + a, m, y);
        else return wb(w);
      }
      function wb() {
        var a = 16384,
          m = [],
          y,
          w,
          A = -1,
          $ = arguments.length;
        if (!$) return '';
        for (var R = ''; ++A < $; ) {
          var W = Number(arguments[A]);
          W <= 65535
            ? m.push(W)
            : ((W -= 65536),
              (y = (W >> 10) + 55296),
              (w = (W % 1024) + 56320),
              m.push(y, w)),
            (A + 1 == $ || m.length > a) &&
              ((R += String.fromCharCode.apply(null, m)), (m.length = 0));
        }
        return R;
      }
      if (((Ui = c()), Ui !== o && l === n.length)) return Ui;
      throw (
        (Ui !== o &&
          l < n.length &&
          _({ type: 'end', description: 'end of input' }),
        id(null, od, Mi))
      );
    }
    return { SyntaxError: e, parse: r };
  })();
});
var W0 = zs((YH, G0) => {
  f();
  function M1(t) {
    var e = [],
      r = [],
      n = '',
      s = Object.create(null),
      o = s;
    return c(t);
    function c(C) {
      for (var k, B = 0; B < C.length; B++)
        switch (((k = C[B]), k.type)) {
          case 'Assign':
            p(k);
            break;
          case 'ObjectPath':
            b(k);
            break;
          case 'ArrayPath':
            E(k);
            break;
        }
      return s;
    }
    function d(C, k, B) {
      var F = new Error(C);
      throw ((F.line = k), (F.column = B), F);
    }
    function p(C) {
      var k = C.key,
        B = C.value,
        F = C.line,
        O = C.column,
        S;
      n ? (S = n + '.' + k) : (S = k),
        typeof o[k] != 'undefined' &&
          d("Cannot redefine existing key '" + S + "'.", F, O),
        (o[k] = h(B)),
        u(S) || (e.push(S), r.push(S));
    }
    function u(C) {
      return e.indexOf(C) !== -1;
    }
    function h(C) {
      return C.type === 'Array'
        ? P(C.value)
        : C.type === 'InlineTable'
          ? g(C.value)
          : C.value;
    }
    function g(C) {
      for (var k = Object.create(null), B = 0; B < C.length; B++) {
        var F = C[B];
        F.value.type === 'InlineTable'
          ? (k[F.key] = g(F.value.value))
          : F.type === 'InlineTableValue' && (k[F.key] = h(F.value));
      }
      return k;
    }
    function b(C) {
      var k = C.value,
        B = k.map(v).join('.'),
        F = C.line,
        O = C.column;
      u(B) && d("Cannot redefine existing key '" + k + "'.", F, O),
        e.push(B),
        (o = T(s, k, Object.create(null), F, O)),
        (n = k);
    }
    function E(C) {
      var k = C.value,
        B = k.map(v).join('.'),
        F = C.line,
        O = C.column;
      if (
        (u(B) || e.push(B),
        (e = e.filter(function (N) {
          return N.indexOf(B) !== 0;
        })),
        e.push(B),
        (o = T(s, k, [], F, O)),
        (n = B),
        o instanceof Array)
      ) {
        var S = Object.create(null);
        o.push(S), (o = S);
      } else d("Cannot redefine existing key '" + k + "'.", F, O);
    }
    function T(C, k, B, F, O) {
      for (
        var S = [], N = '', M = k.join('.'), Z = C, G = 0;
        G < k.length;
        G++
      ) {
        var J = k[G];
        S.push(J),
          (N = S.join('.')),
          typeof Z[J] == 'undefined'
            ? G === k.length - 1
              ? (Z[J] = B)
              : (Z[J] = Object.create(null))
            : G !== k.length - 1 &&
              r.indexOf(N) > -1 &&
              d("Cannot redefine existing key '" + N + "'.", F, O),
          (Z = Z[J]),
          Z instanceof Array &&
            Z.length &&
            G < k.length - 1 &&
            (Z = Z[Z.length - 1]);
      }
      return Z;
    }
    function P(C) {
      for (var k = null, B = 0; B < C.length; B++) {
        var F = C[B];
        k === null
          ? (k = F.type)
          : F.type !== k &&
            d(
              'Cannot add value of type ' +
                F.type +
                ' to array of type ' +
                k +
                '.',
              F.line,
              F.column
            );
      }
      return C.map(h);
    }
    function v(C) {
      return C.indexOf('.') > -1 ? '"' + C + '"' : C;
    }
  }
  G0.exports = { compile: M1 };
});
var K0 = zs((QH, Z0) => {
  f();
  var U1 = V0(),
    L1 = W0();
  Z0.exports = {
    parse: function (t) {
      var e = U1.parse(t.toString());
      return L1.compile(e);
    },
  };
});
f();
var ny = Vf(Yf());
f();
var ji = class {
  constructor(e) {
    this.foundryManager = e;
  }
  async provideHover(e, r) {
    if (!e.fileName.match(/[tT]\.sol$/)) return null;
    let n = e.getWordRangeAtPosition(r);
    if (!n) return null;
    let s = e.getText(n);
    if (!s.startsWith('test') || !e.lineAt(r.line).text.includes('function'))
      return null;
    let i = Tt__namespace.basename(e.fileName),
      c = K__namespace.Uri.parse(
        `command:forge-cockpit.runTest?${encodeURIComponent(JSON.stringify({ contractName: i, testName: s }))}`
      ),
      d = K__namespace.Uri.parse(
        `command:forge-cockpit.runTestViaIR?${encodeURIComponent(JSON.stringify({ contractName: i, testName: s }))}`
      ),
      p = new K__namespace.MarkdownString(`**Forge Test**: \`${s}\`

[Run Test](${c}) | [Run Test via IR](${d})`);
    return (p.isTrusted = true), new K__namespace.Hover(p, n);
  }
};
f();
f();
f();
f();
function V(t, e, r) {
  let n = t[e.name];
  if (typeof n == 'function') return n;
  let s = t[r];
  return typeof s == 'function' ? s : o => e(t, o);
}
f();
f();
$e();
f();
ce();
var Ca = class extends I {
  constructor(e) {
    super(`Filter type "${e}" is not supported.`, {
      name: 'FilterTypeNotSupportedError',
    });
  }
};
Ke();
rr();
oi();
mr();
Sr();
an();
var cm = '/docs/contract/encodeEventTopics';
function gr(t) {
  var d, p, u;
  let { abi: e, eventName: r, args: n } = t,
    s = e[0];
  if (r) {
    let h = gt({ abi: e, name: r });
    if (!h) throw new Ks(r, { docsPath: cm });
    s = h;
  }
  if (s.type !== 'event') throw new Ks(void 0, { docsPath: cm });
  let o = He(s),
    i = nn(o),
    c = [];
  if (n && 'inputs' in s) {
    let h =
        (d = s.inputs) == null
          ? void 0
          : d.filter(b => 'indexed' in b && b.indexed),
      g = Array.isArray(n)
        ? n
        : Object.values(n).length > 0
          ? (p = h == null ? void 0 : h.map(b => n[b.name])) != null
            ? p
            : []
          : [];
    g.length > 0 &&
      (c =
        (u =
          h == null
            ? void 0
            : h.map((b, E) =>
                Array.isArray(g[E])
                  ? g[E].map((T, P) => um({ param: b, value: g[E][P] }))
                  : typeof g[E] != 'undefined' && g[E] !== null
                    ? um({ param: b, value: g[E] })
                    : null
              )) != null
          ? u
          : []);
  }
  return [i, ...c];
}
function um({ param: t, value: e }) {
  if (t.type === 'string' || t.type === 'bytes') return Ee(Ut(e));
  if (t.type === 'tuple' || t.type.match(/^(.*)\[(\d+)?\]$/))
    throw new Ca(t.type);
  return rt([t], [e]);
}
se();
f();
function cn(t, { method: e }) {
  var n, s;
  let r = {};
  return (
    t.transport.type === 'fallback' &&
      ((s = (n = t.transport).onResponse) == null ||
        s.call(n, ({ method: o, response: i, status: c, transport: d }) => {
          c === 'success' && e === o && (r[i] = d.request);
        })),
    o => r[o] || t.request
  );
}
async function za(t, e) {
  let {
      address: r,
      abi: n,
      args: s,
      eventName: o,
      fromBlock: i,
      strict: c,
      toBlock: d,
    } = e,
    p = cn(t, { method: 'eth_newFilter' }),
    u = o ? gr({ abi: n, args: s, eventName: o }) : void 0,
    h = await t.request({
      method: 'eth_newFilter',
      params: [
        {
          address: r,
          fromBlock: typeof i == 'bigint' ? H(i) : i,
          toBlock: typeof d == 'bigint' ? H(d) : d,
          topics: u,
        },
      ],
    });
  return {
    abi: n,
    args: s,
    eventName: o,
    id: h,
    request: p(h),
    strict: !!c,
    type: 'event',
  };
}
f();
Ne();
yt();
f();
$e();
ce();
un();
qn();
pi();
var _x = 3;
function It(
  t,
  { abi: e, address: r, args: n, docsPath: s, functionName: o, sender: i }
) {
  let c =
      t instanceof br
        ? t
        : t instanceof I
          ? t.walk(E => 'data' in E) || t.walk()
          : {},
    { code: d, data: p, details: u, message: h, shortMessage: g } = c,
    b =
      t instanceof Mt
        ? new nc({ functionName: o })
        : [_x, Ur.code].includes(d) && (p || u || h || g)
          ? new jn({
              abi: e,
              data: typeof p == 'object' ? p.data : p,
              functionName: o,
              message: c instanceof dn ? u : g != null ? g : h,
            })
          : t;
  return new rc(b, {
    abi: e,
    args: n,
    contractAddress: r,
    docsPath: s,
    functionName: o,
    sender: i,
  });
}
f();
Ne();
ce();
f();
f();
f();
on();
rr();
function Cm(t) {
  let e = Ee(`0x${t.substring(4)}`).substring(26);
  return Bt(`0x${e}`);
}
f();
Kt();
Jt();
dt();
se();
async function ph({ hash: t, signature: e }) {
  let r = Re(t) ? t : Le(t),
    { secp256k1: n } = await Promise.resolve().then(() => (fl(), lh));
  return `0x${(() => {
    if (typeof e == 'object' && 'r' in e && 's' in e) {
      let { r: p, s: u, v: h, yParity: g } = e,
        b = Number(g != null ? g : h),
        E = fh(b);
      return new n.Signature(Me(p), Me(u)).addRecoveryBit(E);
    }
    let i = Re(e) ? e : Le(e);
    if (pe(i) !== 65) throw new Error('invalid signature length');
    let c = Ue(`0x${i.slice(130)}`),
      d = fh(c);
    return n.Signature.fromCompact(i.substring(2, 130)).addRecoveryBit(d);
  })()
    .recoverPublicKey(r.substring(2))
    .toHex(false)}`;
}
function fh(t) {
  if (t === 0 || t === 1) return t;
  if (t === 27) return 0;
  if (t === 28) return 1;
  throw new Error('Invalid yParityOrV value');
}
async function gc({ hash: t, signature: e }) {
  return Cm(await ph({ hash: t, signature: e }));
}
f();
or();
Ke();
se();
f();
ce();
qa();
Ke();
se();
function mh(t, e = 'hex') {
  let r = hh(t),
    n = vo(new Uint8Array(r.length));
  return r.encode(n), e === 'hex' ? me(n.bytes) : n.bytes;
}
function hh(t) {
  return Array.isArray(t) ? ww(t.map(e => hh(e))) : vw(t);
}
function ww(t) {
  let e = t.reduce((s, o) => s + o.length, 0),
    r = gh(e);
  return {
    length: e <= 55 ? 1 + e : 1 + r + e,
    encode(s) {
      e <= 55
        ? s.pushByte(192 + e)
        : (s.pushByte(247 + r),
          r === 1
            ? s.pushUint8(e)
            : r === 2
              ? s.pushUint16(e)
              : r === 3
                ? s.pushUint24(e)
                : s.pushUint32(e));
      for (let { encode: o } of t) o(s);
    },
  };
}
function vw(t) {
  let e = typeof t == 'string' ? je(t) : t,
    r = gh(e.length);
  return {
    length:
      e.length === 1 && e[0] < 128
        ? 1
        : e.length <= 55
          ? 1 + e.length
          : 1 + r + e.length,
    encode(s) {
      e.length === 1 && e[0] < 128
        ? s.pushBytes(e)
        : e.length <= 55
          ? (s.pushByte(128 + e.length), s.pushBytes(e))
          : (s.pushByte(183 + r),
            r === 1
              ? s.pushUint8(e.length)
              : r === 2
                ? s.pushUint16(e.length)
                : r === 3
                  ? s.pushUint24(e.length)
                  : s.pushUint32(e.length),
            s.pushBytes(e));
    },
  };
}
function gh(t) {
  if (t < 2 ** 8) return 1;
  if (t < 2 ** 16) return 2;
  if (t < 2 ** 24) return 3;
  if (t < 2 ** 32) return 4;
  throw new I('Length is too large.');
}
rr();
function yh(t) {
  var i;
  let { chainId: e, nonce: r, to: n } = t,
    s = (i = t.contractAddress) != null ? i : t.address,
    o = Ee(nr(['0x05', mh([e ? H(e) : '0x', s, r ? H(r) : '0x'])]));
  return n === 'bytes' ? je(o) : o;
}
async function yc(t) {
  let { authorization: e, signature: r } = t;
  return gc({ hash: yh(e), signature: r != null ? r : e });
}
se();
f();
f();
li();
Eo();
ce();
Mr();
var bc = class extends I {
  constructor(
    e,
    {
      account: r,
      docsPath: n,
      chain: s,
      data: o,
      gas: i,
      gasPrice: c,
      maxFeePerGas: d,
      maxPriorityFeePerGas: p,
      nonce: u,
      to: h,
      value: g,
    }
  ) {
    var E;
    let b = _n({
      from: r == null ? void 0 : r.address,
      to: h,
      value:
        typeof g != 'undefined' &&
        `${sr(g)} ${((E = s == null ? void 0 : s.nativeCurrency) == null ? void 0 : E.symbol) || 'ETH'}`,
      data: o,
      gas: i,
      gasPrice: typeof c != 'undefined' && `${qe(c)} gwei`,
      maxFeePerGas: typeof d != 'undefined' && `${qe(d)} gwei`,
      maxPriorityFeePerGas: typeof p != 'undefined' && `${qe(p)} gwei`,
      nonce: u,
    });
    super(e.shortMessage, {
      cause: e,
      docsPath: n,
      metaMessages: [
        ...(e.metaMessages ? [...e.metaMessages, ' '] : []),
        'Estimate Gas Arguments:',
        b,
      ].filter(Boolean),
      name: 'EstimateGasExecutionError',
    }),
      Object.defineProperty(this, 'cause', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      (this.cause = e);
  }
};
Xn();
vi();
function bh(t, { docsPath: e, ...r }) {
  let n = (() => {
    let s = wn(t, r);
    return s instanceof zt ? t : s;
  })();
  return new bc(n, { docsPath: e, ...r });
}
Ti();
Qn();
xc();
Tn();
f();
Ne();
f();
f();
Eo();
ce();
var wc = class extends I {
    constructor() {
      super('`baseFeeMultiplier` must be greater than 1.', {
        name: 'BaseFeeScalarError',
      });
    }
  },
  En = class extends I {
    constructor() {
      super('Chain does not support EIP-1559 fees.', {
        name: 'Eip1559FeesNotSupportedError',
      });
    }
  },
  vc = class extends I {
    constructor({ maxPriorityFeePerGas: e }) {
      super(
        `\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${qe(e)} gwei).`,
        { name: 'MaxFeePerGasTooLowError' }
      );
    }
  };
f();
dt();
f();
f();
ce();
var is = class extends I {
  constructor({ blockHash: e, blockNumber: r }) {
    let n = 'Block';
    e && (n = `Block at hash "${e}"`),
      r && (n = `Block at number "${r}"`),
      super(`${n} could not be found.`, { name: 'BlockNotFoundError' });
  }
};
se();
f();
f();
dt();
var pl = {
  '0x0': 'legacy',
  '0x1': 'eip2930',
  '0x2': 'eip1559',
  '0x3': 'eip4844',
  '0x4': 'eip7702',
};
function Tc(t) {
  let e = {
    ...t,
    blockHash: t.blockHash ? t.blockHash : null,
    blockNumber: t.blockNumber ? BigInt(t.blockNumber) : null,
    chainId: t.chainId ? Ue(t.chainId) : void 0,
    gas: t.gas ? BigInt(t.gas) : void 0,
    gasPrice: t.gasPrice ? BigInt(t.gasPrice) : void 0,
    maxFeePerBlobGas: t.maxFeePerBlobGas ? BigInt(t.maxFeePerBlobGas) : void 0,
    maxFeePerGas: t.maxFeePerGas ? BigInt(t.maxFeePerGas) : void 0,
    maxPriorityFeePerGas: t.maxPriorityFeePerGas
      ? BigInt(t.maxPriorityFeePerGas)
      : void 0,
    nonce: t.nonce ? Ue(t.nonce) : void 0,
    to: t.to ? t.to : null,
    transactionIndex: t.transactionIndex ? Number(t.transactionIndex) : null,
    type: t.type ? pl[t.type] : void 0,
    typeHex: t.type ? t.type : void 0,
    value: t.value ? BigInt(t.value) : void 0,
    v: t.v ? BigInt(t.v) : void 0,
  };
  return (
    t.authorizationList && (e.authorizationList = Aw(t.authorizationList)),
    (e.yParity = (() => {
      if (t.yParity) return Number(t.yParity);
      if (typeof e.v == 'bigint') {
        if (e.v === BigInt(0) || e.v === BigInt(27)) return 0;
        if (e.v === BigInt(1) || e.v === BigInt(28)) return 1;
        if (e.v >= BigInt(35)) return e.v % BigInt(2) === BigInt(0) ? 1 : 0;
      }
    })()),
    e.type === 'legacy' &&
      (delete e.accessList,
      delete e.maxFeePerBlobGas,
      delete e.maxFeePerGas,
      delete e.maxPriorityFeePerGas,
      delete e.yParity),
    e.type === 'eip2930' &&
      (delete e.maxFeePerBlobGas,
      delete e.maxFeePerGas,
      delete e.maxPriorityFeePerGas),
    e.type === 'eip1559' && delete e.maxFeePerBlobGas,
    e
  );
}
function Aw(t) {
  return t.map(e => ({
    address: e.address,
    chainId: Number(e.chainId),
    nonce: Number(e.nonce),
    r: e.r,
    s: e.s,
    yParity: Number(e.yParity),
  }));
}
function Ec(t) {
  var r;
  let e = ((r = t.transactions) != null ? r : []).map(n =>
    typeof n == 'string' ? n : Tc(n)
  );
  return {
    ...t,
    baseFeePerGas: t.baseFeePerGas ? BigInt(t.baseFeePerGas) : null,
    blobGasUsed: t.blobGasUsed ? BigInt(t.blobGasUsed) : void 0,
    difficulty: t.difficulty ? BigInt(t.difficulty) : void 0,
    excessBlobGas: t.excessBlobGas ? BigInt(t.excessBlobGas) : void 0,
    gasLimit: t.gasLimit ? BigInt(t.gasLimit) : void 0,
    gasUsed: t.gasUsed ? BigInt(t.gasUsed) : void 0,
    hash: t.hash ? t.hash : null,
    logsBloom: t.logsBloom ? t.logsBloom : null,
    nonce: t.nonce ? t.nonce : null,
    number: t.number ? BigInt(t.number) : null,
    size: t.size ? BigInt(t.size) : void 0,
    timestamp: t.timestamp ? BigInt(t.timestamp) : void 0,
    transactions: e,
    totalDifficulty: t.totalDifficulty ? BigInt(t.totalDifficulty) : null,
  };
}
async function at(
  t,
  { blockHash: e, blockNumber: r, blockTag: n, includeTransactions: s } = {}
) {
  var u, h, g;
  let o = n != null ? n : 'latest',
    i = s != null ? s : false,
    c = r !== void 0 ? H(r) : void 0,
    d = null;
  if (
    (e
      ? (d = await t.request(
          { method: 'eth_getBlockByHash', params: [e, i] },
          { dedupe: true }
        ))
      : (d = await t.request(
          { method: 'eth_getBlockByNumber', params: [c || o, i] },
          { dedupe: !!c }
        )),
    !d)
  )
    throw new is({ blockHash: e, blockNumber: r });
  return (
    ((g =
      (h = (u = t.chain) == null ? void 0 : u.formatters) == null
        ? void 0
        : h.block) == null
      ? void 0
      : g.format) || Ec
  )(d);
}
f();
async function as(t) {
  let e = await t.request({ method: 'eth_gasPrice' });
  return BigInt(e);
}
async function Th(t, e) {
  return ml(t, e);
}
async function ml(t, e) {
  var o, i, c;
  let { block: r, chain: n = t.chain, request: s } = e || {};
  try {
    let d =
      (c =
        (o = n == null ? void 0 : n.fees) == null
          ? void 0
          : o.maxPriorityFeePerGas) != null
        ? c
        : (i = n == null ? void 0 : n.fees) == null
          ? void 0
          : i.defaultPriorityFee;
    if (typeof d == 'function') {
      let u = r || (await V(t, at, 'getBlock')({})),
        h = await d({ block: u, client: t, request: s });
      if (h === null) throw new Error();
      return h;
    }
    if (typeof d != 'undefined') return d;
    let p = await t.request({ method: 'eth_maxPriorityFeePerGas' });
    return Me(p);
  } catch {
    let [d, p] = await Promise.all([
      r ? Promise.resolve(r) : V(t, at, 'getBlock')({}),
      V(t, as, 'getGasPrice')({}),
    ]);
    if (typeof d.baseFeePerGas != 'bigint') throw new En();
    let u = p - d.baseFeePerGas;
    return u < BigInt(0) ? BigInt(0) : u;
  }
}
async function Eh(t, e) {
  return Cc(t, e);
}
async function Cc(t, e) {
  var g, b, E, T, P;
  let {
      block: r,
      chain: n = t.chain,
      request: s,
      type: o = 'eip1559',
    } = e || {},
    i = await (async () => {
      var v, C, k;
      return typeof ((v = n == null ? void 0 : n.fees) == null
        ? void 0
        : v.baseFeeMultiplier) == 'function'
        ? n.fees.baseFeeMultiplier({ block: r, client: t, request: s })
        : (k =
              (C = n == null ? void 0 : n.fees) == null
                ? void 0
                : C.baseFeeMultiplier) != null
          ? k
          : 1.2;
    })();
  if (i < 1) throw new wc();
  let d =
      10 **
      ((b = (g = i.toString().split('.')[1]) == null ? void 0 : g.length) !=
      null
        ? b
        : 0),
    p = v => (v * BigInt(Math.ceil(i * d))) / BigInt(d),
    u = r || (await V(t, at, 'getBlock')({}));
  if (
    typeof ((E = n == null ? void 0 : n.fees) == null
      ? void 0
      : E.estimateFeesPerGas) == 'function'
  ) {
    let v = await n.fees.estimateFeesPerGas({
      block: r,
      client: t,
      multiply: p,
      request: s,
      type: o,
    });
    if (v !== null) return v;
  }
  if (o === 'eip1559') {
    if (typeof u.baseFeePerGas != 'bigint') throw new En();
    let v =
        typeof (s == null ? void 0 : s.maxPriorityFeePerGas) == 'bigint'
          ? s.maxPriorityFeePerGas
          : await ml(t, { block: u, chain: n, request: s }),
      C = p(u.baseFeePerGas);
    return {
      maxFeePerGas:
        (T = s == null ? void 0 : s.maxFeePerGas) != null ? T : C + v,
      maxPriorityFeePerGas: v,
    };
  }
  return {
    gasPrice:
      (P = s == null ? void 0 : s.gasPrice) != null
        ? P
        : p(await V(t, as, 'getGasPrice')({})),
  };
}
f();
dt();
se();
async function cs(t, { address: e, blockTag: r = 'latest', blockNumber: n }) {
  let s = await t.request(
    { method: 'eth_getTransactionCount', params: [e, n ? H(n) : r] },
    { dedupe: !!n }
  );
  return Ue(s);
}
f();
Ke();
se();
function Ac(t) {
  var o;
  let { kzg: e } = t,
    r =
      (o = t.to) != null ? o : typeof t.blobs[0] == 'string' ? 'hex' : 'bytes',
    n = typeof t.blobs[0] == 'string' ? t.blobs.map(i => je(i)) : t.blobs,
    s = [];
  for (let i of n) s.push(Uint8Array.from(e.blobToKzgCommitment(i)));
  return r === 'bytes' ? s : s.map(i => me(i));
}
f();
Ke();
se();
function Pc(t) {
  var i;
  let { kzg: e } = t,
    r =
      (i = t.to) != null ? i : typeof t.blobs[0] == 'string' ? 'hex' : 'bytes',
    n = typeof t.blobs[0] == 'string' ? t.blobs.map(c => je(c)) : t.blobs,
    s =
      typeof t.commitments[0] == 'string'
        ? t.commitments.map(c => je(c))
        : t.commitments,
    o = [];
  for (let c = 0; c < n.length; c++) {
    let d = n[c],
      p = s[c];
    o.push(Uint8Array.from(e.computeBlobKzgProof(d, p)));
  }
  return r === 'bytes' ? o : o.map(c => me(c));
}
f();
f();
se();
f();
_d();
Kt();
Ke();
se();
function Ch(t, e) {
  let r = e,
    n = mn(Re(t, { strict: false }) ? Ut(t) : t);
  return r === 'bytes' ? n : Le(n);
}
function Ah(t) {
  var o;
  let { commitment: e, version: r = 1 } = t,
    n = (o = t.to) != null ? o : typeof e == 'string' ? 'hex' : 'bytes',
    s = Ch(e, 'bytes');
  return s.set([r], 0), n === 'bytes' ? s : me(s);
}
function Ph(t) {
  var o;
  let { commitments: e, version: r } = t,
    n = (o = t.to) != null ? o : typeof e[0] == 'string' ? 'hex' : 'bytes',
    s = [];
  for (let i of e) s.push(Ah({ commitment: i, to: n, version: r }));
  return s;
}
f();
f();
f();
ce();
var kc = class extends I {
    constructor({ maxSize: e, size: r }) {
      super('Blob size is too large.', {
        metaMessages: [`Max: ${e} bytes`, `Given: ${r} bytes`],
        name: 'BlobSizeTooLargeError',
      });
    }
  },
  $c = class extends I {
    constructor() {
      super('Blob data must not be empty.', { name: 'EmptyBlobError' });
    }
  };
qa();
Jt();
Ke();
se();
function kh(t) {
  var c;
  let e = (c = t.to) != null ? c : typeof t.data == 'string' ? 'hex' : 'bytes',
    r = typeof t.data == 'string' ? je(t.data) : t.data,
    n = pe(r);
  if (!n) throw new $c();
  if (n > 761855) throw new kc({ maxSize: 761855, size: n });
  let s = [],
    o = true,
    i = 0;
  for (; o; ) {
    let d = vo(new Uint8Array(131072)),
      p = 0;
    for (; p < 4096; ) {
      let u = r.slice(i, i + 31);
      if ((d.pushByte(0), d.pushBytes(u), u.length < 31)) {
        d.pushByte(128), (o = false);
        break;
      }
      p++, (i += 31);
    }
    s.push(d);
  }
  return e === 'bytes' ? s.map(d => d.bytes) : s.map(d => me(d.bytes));
}
function $h(t) {
  var d, p, u;
  let { data: e, kzg: r, to: n } = t,
    s = (d = t.blobs) != null ? d : kh({ data: e, to: n }),
    o = (p = t.commitments) != null ? p : Ac({ blobs: s, kzg: r, to: n }),
    i =
      (u = t.proofs) != null
        ? u
        : Pc({ blobs: s, commitments: o, kzg: r, to: n }),
    c = [];
  for (let h = 0; h < s.length; h++)
    c.push({ blob: s[h], commitment: o[h], proof: i[h] });
  return c;
}
Tn();
f();
Mr();
function Bh(t) {
  if (t.type) return t.type;
  if (typeof t.authorizationList != 'undefined') return 'eip7702';
  if (
    typeof t.blobs != 'undefined' ||
    typeof t.blobVersionedHashes != 'undefined' ||
    typeof t.maxFeePerBlobGas != 'undefined' ||
    typeof t.sidecars != 'undefined'
  )
    return 'eip4844';
  if (
    typeof t.maxFeePerGas != 'undefined' ||
    typeof t.maxPriorityFeePerGas != 'undefined'
  )
    return 'eip1559';
  if (typeof t.gasPrice != 'undefined')
    return typeof t.accessList != 'undefined' ? 'eip2930' : 'legacy';
  throw new Xa({ transaction: t });
}
f();
dt();
async function Ht(t) {
  let e = await t.request({ method: 'eth_chainId' }, { dedupe: true });
  return Ue(e);
}
var hl = ['blobVersionedHashes', 'chainId', 'fees', 'gas', 'nonce', 'type'],
  Ih = new Map();
async function Cn(t, e) {
  let {
      account: r = t.account,
      blobs: n,
      chain: s,
      gas: o,
      kzg: i,
      nonce: c,
      nonceManager: d,
      parameters: p = hl,
      type: u,
    } = e,
    h = r && ae(r),
    g = { ...e, ...(h ? { from: h == null ? void 0 : h.address } : {}) },
    b;
  async function E() {
    return b || ((b = await V(t, at, 'getBlock')({ blockTag: 'latest' })), b);
  }
  let T;
  async function P() {
    return (
      T ||
      (s
        ? s.id
        : typeof e.chainId != 'undefined'
          ? e.chainId
          : ((T = await V(t, Ht, 'getChainId')({})), T))
    );
  }
  if (p.includes('nonce') && typeof c == 'undefined' && h)
    if (d) {
      let v = await P();
      g.nonce = await d.consume({ address: h.address, chainId: v, client: t });
    } else
      g.nonce = await V(
        t,
        cs,
        'getTransactionCount'
      )({ address: h.address, blockTag: 'pending' });
  if ((p.includes('blobVersionedHashes') || p.includes('sidecars')) && n && i) {
    let v = Ac({ blobs: n, kzg: i });
    if (p.includes('blobVersionedHashes')) {
      let C = Ph({ commitments: v, to: 'hex' });
      g.blobVersionedHashes = C;
    }
    if (p.includes('sidecars')) {
      let C = Pc({ blobs: n, commitments: v, kzg: i }),
        k = $h({ blobs: n, commitments: v, proofs: C, to: 'hex' });
      g.sidecars = k;
    }
  }
  if (
    (p.includes('chainId') && (g.chainId = await P()),
    (p.includes('fees') || p.includes('type')) && typeof u == 'undefined')
  )
    try {
      g.type = Bh(g);
    } catch {
      let v = Ih.get(t.uid);
      if (typeof v == 'undefined') {
        let C = await E();
        (v = typeof (C == null ? void 0 : C.baseFeePerGas) == 'bigint'),
          Ih.set(t.uid, v);
      }
      g.type = v ? 'eip1559' : 'legacy';
    }
  if (p.includes('fees'))
    if (g.type !== 'legacy' && g.type !== 'eip2930') {
      if (
        typeof g.maxFeePerGas == 'undefined' ||
        typeof g.maxPriorityFeePerGas == 'undefined'
      ) {
        let v = await E(),
          { maxFeePerGas: C, maxPriorityFeePerGas: k } = await Cc(t, {
            block: v,
            chain: s,
            request: g,
          });
        if (
          typeof e.maxPriorityFeePerGas == 'undefined' &&
          e.maxFeePerGas &&
          e.maxFeePerGas < k
        )
          throw new vc({ maxPriorityFeePerGas: k });
        (g.maxPriorityFeePerGas = k), (g.maxFeePerGas = C);
      }
    } else {
      if (
        typeof e.maxFeePerGas != 'undefined' ||
        typeof e.maxPriorityFeePerGas != 'undefined'
      )
        throw new En();
      if (typeof e.gasPrice == 'undefined') {
        let v = await E(),
          { gasPrice: C } = await Cc(t, {
            block: v,
            chain: s,
            request: g,
            type: 'legacy',
          });
        g.gasPrice = C;
      }
    }
  return (
    p.includes('gas') &&
      typeof o == 'undefined' &&
      (g.gas = await V(
        t,
        us,
        'estimateGas'
      )({ ...g, account: h && { address: h.address, type: 'json-rpc' } })),
    xt(g),
    delete g.parameters,
    g
  );
}
f();
se();
async function Bc(t, { address: e, blockNumber: r, blockTag: n = 'latest' }) {
  let s = r ? H(r) : void 0,
    o = await t.request({ method: 'eth_getBalance', params: [e, s || n] });
  return BigInt(o);
}
async function us(t, e) {
  var s, o, i;
  let { account: r = t.account } = e,
    n = r ? ae(r) : void 0;
  try {
    let z = function (j) {
        let { block: ee, request: re, rpcStateOverride: de } = j;
        return t.request({
          method: 'eth_estimateGas',
          params: de
            ? [re, ee != null ? ee : 'latest', de]
            : ee
              ? [re, ee]
              : [re],
        });
      },
      {
        accessList: c,
        authorizationList: d,
        blobs: p,
        blobVersionedHashes: u,
        blockNumber: h,
        blockTag: g,
        data: b,
        gas: E,
        gasPrice: T,
        maxFeePerBlobGas: P,
        maxFeePerGas: v,
        maxPriorityFeePerGas: C,
        nonce: k,
        value: B,
        stateOverride: F,
        ...O
      } = await Cn(t, {
        ...e,
        parameters:
          (n == null ? void 0 : n.type) === 'local'
            ? void 0
            : ['blobVersionedHashes'],
      }),
      N = (h ? H(h) : void 0) || g,
      M = ss(F),
      Z = await (async () => {
        if (O.to) return O.to;
        if (d && d.length > 0)
          return await yc({ authorization: d[0] }).catch(() => {
            throw new I(
              '`to` is required. Could not infer from `authorizationList`'
            );
          });
      })();
    xt(e);
    let G =
        (i =
          (o = (s = t.chain) == null ? void 0 : s.formatters) == null
            ? void 0
            : o.transactionRequest) == null
          ? void 0
          : i.format,
      te = (G || _t)({
        ...vn(O, { format: G }),
        from: n == null ? void 0 : n.address,
        accessList: c,
        authorizationList: d,
        blobs: p,
        blobVersionedHashes: u,
        data: b,
        gas: E,
        gasPrice: T,
        maxFeePerBlobGas: P,
        maxFeePerGas: v,
        maxPriorityFeePerGas: C,
        nonce: k,
        to: Z,
        value: B,
      }),
      q = BigInt(await z({ block: N, request: te, rpcStateOverride: M }));
    if (d) {
      let j = await Bc(t, { address: te.from }),
        ee = await Promise.all(
          d.map(async re => {
            let { address: de } = re,
              be = await z({
                block: N,
                request: {
                  authorizationList: void 0,
                  data: b,
                  from: n == null ? void 0 : n.address,
                  to: de,
                  value: H(j),
                },
                rpcStateOverride: M,
              }).catch(() => BigInt(100000));
            return BigInt(2) * BigInt(be);
          })
        );
      q += ee.reduce((re, de) => re + de, BigInt(0));
    }
    return q;
  } catch (c) {
    throw bh(c, { ...e, account: n, chain: t.chain });
  }
}
async function Sh(t, e) {
  let { abi: r, address: n, args: s, functionName: o, dataSuffix: i, ...c } = e,
    d = we({ abi: r, args: s, functionName: o });
  try {
    return await V(
      t,
      us,
      'estimateGas'
    )({ data: `${d}${i ? i.replace('0x', '') : ''}`, to: n, ...c });
  } catch (p) {
    let u = c.account ? ae(c.account) : void 0;
    throw It(p, {
      abi: r,
      address: n,
      args: s,
      docsPath: '/docs/contract/estimateContractGas',
      functionName: o,
      sender: u == null ? void 0 : u.address,
    });
  }
}
f();
an();
f();
f();
$e();
ds();
Ke();
rr();
oi();
f();
$e();
Jt();
oi();
Fd();
di();
Sr();
var Rh = '/docs/contract/decodeEventLog';
function ls(t) {
  let { abi: e, data: r, strict: n, topics: s } = t,
    o = n != null ? n : true,
    [i, ...c] = s;
  if (!i) throw new ba({ docsPath: Rh });
  let d =
    e.length === 1 ? e[0] : e.find(T => T.type === 'event' && i === nn(He(T)));
  if (!(d && 'name' in d) || d.type !== 'event')
    throw new ho(i, { docsPath: Rh });
  let { name: p, inputs: u } = d,
    h = u == null ? void 0 : u.some(T => !('name' in T && T.name)),
    g = h ? [] : {},
    b = u.filter(T => 'indexed' in T && T.indexed);
  for (let T = 0; T < b.length; T++) {
    let P = b[T],
      v = c[T];
    if (!v) throw new dr({ abiItem: d, param: P });
    g[h ? T : P.name || T] = kw({ param: P, value: v });
  }
  let E = u.filter(T => !('indexed' in T && T.indexed));
  if (E.length > 0) {
    if (r && r !== '0x')
      try {
        let T = Dr(E, r);
        if (T)
          if (h) g = [...g, ...T];
          else for (let P = 0; P < E.length; P++) g[E[P].name] = T[P];
      } catch (T) {
        if (o)
          throw T instanceof po || T instanceof wo
            ? new Xt({ abiItem: d, data: r, params: E, size: pe(r) })
            : T;
      }
    else if (o) throw new Xt({ abiItem: d, data: '0x', params: E, size: 0 });
  }
  return { eventName: p, args: Object.values(g).length > 0 ? g : void 0 };
}
function kw({ param: t, value: e }) {
  return t.type === 'string' ||
    t.type === 'bytes' ||
    t.type === 'tuple' ||
    t.type.match(/^(.*)\[(\d+)?\]$/)
    ? e
    : (Dr([t], e) || [])[0];
}
function fs(t) {
  let { abi: e, args: r, logs: n, strict: s = true } = t,
    o = (() => {
      if (t.eventName)
        return Array.isArray(t.eventName) ? t.eventName : [t.eventName];
    })();
  return n
    .map(i => {
      var c;
      try {
        let d = e.find(u => u.type === 'event' && i.topics[0] === nn(u));
        if (!d) return null;
        let p = ls({ ...i, abi: [d], strict: s });
        return (o && !o.includes(p.eventName)) ||
          !$w({ args: p.args, inputs: d.inputs, matchArgs: r })
          ? null
          : { ...p, ...i };
      } catch (d) {
        let p, u;
        if (d instanceof ho) return null;
        if (d instanceof Xt || d instanceof dr) {
          if (s) return null;
          (p = d.abiItem.name),
            (u =
              (c = d.abiItem.inputs) == null
                ? void 0
                : c.some(h => !('name' in h && h.name)));
        }
        return { ...i, args: u ? [] : {}, eventName: p };
      }
    })
    .filter(Boolean);
}
function $w(t) {
  let { args: e, inputs: r, matchArgs: n } = t;
  if (!n) return true;
  if (!e) return false;
  function s(o, i, c) {
    try {
      return o.type === 'address'
        ? vr(i, c)
        : o.type === 'string' || o.type === 'bytes'
          ? Ee(Ut(i)) === c
          : i === c;
    } catch {
      return false;
    }
  }
  return Array.isArray(e) && Array.isArray(n)
    ? n.every((o, i) => {
        if (o == null) return true;
        let c = r[i];
        return c
          ? (Array.isArray(o) ? o : [o]).some(p => s(c, p, e[i]))
          : false;
      })
    : typeof e == 'object' &&
        !Array.isArray(e) &&
        typeof n == 'object' &&
        !Array.isArray(n)
      ? Object.entries(n).every(([o, i]) => {
          if (i == null) return true;
          let c = r.find(p => p.name === o);
          return c
            ? (Array.isArray(i) ? i : [i]).some(p => s(c, p, e[o]))
            : false;
        })
      : false;
}
se();
f();
function ct(t, { args: e, eventName: r } = {}) {
  return {
    ...t,
    blockHash: t.blockHash ? t.blockHash : null,
    blockNumber: t.blockNumber ? BigInt(t.blockNumber) : null,
    logIndex: t.logIndex ? Number(t.logIndex) : null,
    transactionHash: t.transactionHash ? t.transactionHash : null,
    transactionIndex: t.transactionIndex ? Number(t.transactionIndex) : null,
    ...(r ? { args: e, eventName: r } : {}),
  };
}
async function ps(
  t,
  {
    address: e,
    blockHash: r,
    fromBlock: n,
    toBlock: s,
    event: o,
    events: i,
    args: c,
    strict: d,
  } = {}
) {
  let p = d != null ? d : false,
    u = i != null ? i : o ? [o] : void 0,
    h = [];
  u &&
    ((h = [
      u.flatMap(T => gr({ abi: [T], eventName: T.name, args: i ? void 0 : c })),
    ]),
    o && (h = h[0]));
  let g;
  r
    ? (g = await t.request({
        method: 'eth_getLogs',
        params: [{ address: e, topics: h, blockHash: r }],
      }))
    : (g = await t.request({
        method: 'eth_getLogs',
        params: [
          {
            address: e,
            topics: h,
            fromBlock: typeof n == 'bigint' ? H(n) : n,
            toBlock: typeof s == 'bigint' ? H(s) : s,
          },
        ],
      }));
  let b = g.map(E => ct(E));
  return u ? fs({ abi: u, args: c, logs: b, strict: p }) : b;
}
async function Ic(t, e) {
  let {
      abi: r,
      address: n,
      args: s,
      blockHash: o,
      eventName: i,
      fromBlock: c,
      toBlock: d,
      strict: p,
    } = e,
    u = i ? gt({ abi: r, name: i }) : void 0,
    h = u ? void 0 : r.filter(g => g.type === 'event');
  return V(
    t,
    ps,
    'getLogs'
  )({
    address: n,
    args: s,
    blockHash: o,
    event: u,
    events: h,
    fromBlock: c,
    toBlock: d,
    strict: p,
  });
}
f();
An();
yt();
gs();
async function nt(t, e) {
  let { abi: r, address: n, args: s, functionName: o, ...i } = e,
    c = we({ abi: r, args: s, functionName: o });
  try {
    let { data: d } = await V(t, Tr, 'call')({ ...i, data: c, to: n });
    return wt({ abi: r, args: s, functionName: o, data: d || '0x' });
  } catch (d) {
    throw It(d, {
      abi: r,
      address: n,
      args: s,
      docsPath: '/docs/contract/readContract',
      functionName: o,
    });
  }
}
f();
Ne();
An();
yt();
gs();
async function Jh(t, e) {
  let { abi: r, address: n, args: s, dataSuffix: o, functionName: i, ...c } = e,
    d = c.account ? ae(c.account) : t.account,
    p = we({ abi: r, args: s, functionName: i });
  try {
    let { data: u } = await V(
        t,
        Tr,
        'call'
      )({
        batch: false,
        data: `${p}${o ? o.replace('0x', '') : ''}`,
        to: n,
        ...c,
        account: d,
      }),
      h = wt({ abi: r, args: s, functionName: i, data: u || '0x' }),
      g = r.filter(b => 'name' in b && b.name === e.functionName);
    return {
      result: h,
      request: {
        abi: g,
        address: n,
        args: s,
        dataSuffix: o,
        functionName: i,
        ...c,
        account: d,
      },
    };
  } catch (u) {
    throw It(u, {
      abi: r,
      address: n,
      args: s,
      docsPath: '/docs/contract/simulateContract',
      functionName: i,
      sender: d == null ? void 0 : d.address,
    });
  }
}
f();
$e();
pi();
f();
var kl = new Map(),
  Yh = new Map(),
  Mw = 0;
function ut(t, e, r) {
  let n = ++Mw,
    s = () => kl.get(t) || [],
    o = () => {
      let u = s();
      kl.set(
        t,
        u.filter(h => h.id !== n)
      );
    },
    i = () => {
      let u = s();
      if (!u.some(g => g.id === n)) return;
      let h = Yh.get(t);
      u.length === 1 && h && h(), o();
    },
    c = s();
  if ((kl.set(t, [...c, { id: n, fns: e }]), c && c.length > 0)) return i;
  let d = {};
  for (let u in e)
    d[u] = (...h) => {
      var b, E;
      let g = s();
      if (g.length !== 0)
        for (let T of g) (E = (b = T.fns)[u]) == null || E.call(b, ...h);
    };
  let p = r(d);
  return typeof p == 'function' && Yh.set(t, p), i;
}
f();
f();
async function Ai(t) {
  return new Promise(e => setTimeout(e, t));
}
function qt(t, { emitOnBegin: e, initialWaitTime: r, interval: n }) {
  let s = true,
    o = () => (s = false);
  return (
    (async () => {
      var u;
      let c;
      e && (c = await t({ unpoll: o }));
      let d = (u = await (r == null ? void 0 : r(c))) != null ? u : n;
      await Ai(d);
      let p = async () => {
        s && (await t({ unpoll: o }), await Ai(n), p());
      };
      p();
    })(),
    o
  );
}
st();
f();
f();
var Uw = new Map(),
  Lw = new Map();
function Xh(t) {
  let e = (s, o) => ({
      clear: () => o.delete(s),
      get: () => o.get(s),
      set: i => o.set(s, i),
    }),
    r = e(t, Uw),
    n = e(t, Lw);
  return {
    clear: () => {
      r.clear(), n.clear();
    },
    promise: r,
    response: n,
  };
}
async function Qh(t, { cacheKey: e, cacheTime: r = Number.POSITIVE_INFINITY }) {
  let n = Xh(e),
    s = n.response.get();
  if (s && r > 0 && new Date().getTime() - s.created.getTime() < r)
    return s.data;
  let o = n.promise.get();
  o || ((o = t()), n.promise.set(o));
  try {
    let i = await o;
    return n.response.set({ created: new Date(), data: i }), i;
  } finally {
    n.promise.clear();
  }
}
var zw = t => `blockNumber.${t}`;
async function Er(t, { cacheTime: e = t.cacheTime } = {}) {
  let r = await Qh(() => t.request({ method: 'eth_blockNumber' }), {
    cacheKey: zw(t.uid),
    cacheTime: e,
  });
  return BigInt(r);
}
f();
async function kn(t, { filter: e }) {
  let r = 'strict' in e && e.strict,
    n = await e.request({ method: 'eth_getFilterChanges', params: [e.id] });
  if (typeof n[0] == 'string') return n;
  let s = n.map(o => ct(o));
  return !('abi' in e) || !e.abi ? s : fs({ abi: e.abi, logs: s, strict: r });
}
f();
async function $n(t, { filter: e }) {
  return e.request({ method: 'eth_uninstallFilter', params: [e.id] });
}
function eg(t, e) {
  let {
    abi: r,
    address: n,
    args: s,
    batch: o = true,
    eventName: i,
    fromBlock: c,
    onError: d,
    onLogs: p,
    poll: u,
    pollingInterval: h = t.pollingInterval,
    strict: g,
  } = e;
  return (
    typeof u != 'undefined'
      ? u
      : typeof c == 'bigint'
        ? true
        : !(
            t.transport.type === 'webSocket' ||
            (t.transport.type === 'fallback' &&
              t.transport.transports[0].config.type === 'webSocket')
          )
  )
    ? (() => {
        let P = g != null ? g : false,
          v = ue(['watchContractEvent', n, s, o, t.uid, i, h, P, c]);
        return ut(v, { onLogs: p, onError: d }, C => {
          let k;
          c !== void 0 && (k = c - BigInt(1));
          let B,
            F = false,
            O = qt(
              async () => {
                var S;
                if (!F) {
                  try {
                    B = await V(
                      t,
                      za,
                      'createContractEventFilter'
                    )({
                      abi: r,
                      address: n,
                      args: s,
                      eventName: i,
                      strict: P,
                      fromBlock: c,
                    });
                  } catch {}
                  F = true;
                  return;
                }
                try {
                  let N;
                  if (B) N = await V(t, kn, 'getFilterChanges')({ filter: B });
                  else {
                    let M = await V(t, Er, 'getBlockNumber')({});
                    k && k < M
                      ? (N = await V(
                          t,
                          Ic,
                          'getContractEvents'
                        )({
                          abi: r,
                          address: n,
                          args: s,
                          eventName: i,
                          fromBlock: k + BigInt(1),
                          toBlock: M,
                          strict: P,
                        }))
                      : (N = []),
                      (k = M);
                  }
                  if (N.length === 0) return;
                  if (o) C.onLogs(N);
                  else for (let M of N) C.onLogs([M]);
                } catch (N) {
                  B && N instanceof xr && (F = false),
                    (S = C.onError) == null || S.call(C, N);
                }
              },
              { emitOnBegin: true, interval: h }
            );
          return async () => {
            B && (await V(t, $n, 'uninstallFilter')({ filter: B })), O();
          };
        });
      })()
    : (() => {
        let P = g != null ? g : false,
          v = ue(['watchContractEvent', n, s, o, t.uid, i, h, P]),
          C = true,
          k = () => (C = false);
        return ut(
          v,
          { onLogs: p, onError: d },
          B => (
            (async () => {
              try {
                let F = (() => {
                    if (t.transport.type === 'fallback') {
                      let N = t.transport.transports.find(
                        M => M.config.type === 'webSocket'
                      );
                      return N ? N.value : t.transport;
                    }
                    return t.transport;
                  })(),
                  O = i ? gr({ abi: r, eventName: i, args: s }) : [],
                  { unsubscribe: S } = await F.subscribe({
                    params: ['logs', { address: n, topics: O }],
                    onData(N) {
                      var Z;
                      if (!C) return;
                      let M = N.result;
                      try {
                        let { eventName: G, args: J } = ls({
                            abi: r,
                            data: M.data,
                            topics: M.topics,
                            strict: g,
                          }),
                          te = ct(M, { args: J, eventName: G });
                        B.onLogs([te]);
                      } catch (G) {
                        let J, te;
                        if (G instanceof Xt || G instanceof dr) {
                          if (g) return;
                          (J = G.abiItem.name),
                            (te =
                              (Z = G.abiItem.inputs) == null
                                ? void 0
                                : Z.some(q => !('name' in q && q.name)));
                        }
                        let z = ct(M, { args: te ? [] : {}, eventName: J });
                        B.onLogs([z]);
                      }
                    },
                    onError(N) {
                      var M;
                      (M = B.onError) == null || M.call(B, N);
                    },
                  });
                (k = S), C || k();
              } catch (F) {
                d == null || d(F);
              }
            })(),
            () => k()
          )
        );
      })();
}
f();
Ne();
f();
ce();
var Ye = class extends I {
    constructor({ docsPath: e } = {}) {
      super(
        [
          'Could not find an Account to execute with this Action.',
          'Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client.',
        ].join(`
`),
        { docsPath: e, docsSlug: 'account', name: 'AccountNotFoundError' }
      );
    }
  },
  Bn = class extends I {
    constructor({ docsPath: e, metaMessages: r, type: n }) {
      super(`Account type "${n}" is not supported.`, {
        docsPath: e,
        metaMessages: r,
        name: 'AccountTypeNotSupportedError',
      });
    }
  };
yt();
f();
Ne();
ce();
f();
Mc();
function Gc({ chain: t, currentChainId: e }) {
  if (!t) throw new Dc();
  if (e !== t.id) throw new Oc({ chain: t, currentChainId: e });
}
f();
Xn();
Mr();
vi();
function Wc(t, { docsPath: e, ...r }) {
  let n = (() => {
    let s = wn(t, r);
    return s instanceof zt ? t : s;
  })();
  return new Qa(n, { docsPath: e, ...r });
}
Ti();
Qn();
si();
Tn();
f();
async function ys(t, { serializedTransaction: e }) {
  return t.request(
    { method: 'eth_sendRawTransaction', params: [e] },
    { retryCount: 0 }
  );
}
var $l = new fr(128);
async function bs(t, e) {
  var C, k, B, F;
  let {
    account: r = t.account,
    chain: n = t.chain,
    accessList: s,
    authorizationList: o,
    blobs: i,
    data: c,
    gas: d,
    gasPrice: p,
    maxFeePerBlobGas: u,
    maxFeePerGas: h,
    maxPriorityFeePerGas: g,
    nonce: b,
    type: E,
    value: T,
    ...P
  } = e;
  if (typeof r == 'undefined')
    throw new Ye({ docsPath: '/docs/actions/wallet/sendTransaction' });
  let v = r ? ae(r) : null;
  try {
    xt(e);
    let O = await (async () => {
      if (e.to) return e.to;
      if (e.to !== null && o && o.length > 0)
        return await yc({ authorization: o[0] }).catch(() => {
          throw new I(
            '`to` is required. Could not infer from `authorizationList`.'
          );
        });
    })();
    if ((v == null ? void 0 : v.type) === 'json-rpc' || v === null) {
      let S;
      n !== null &&
        ((S = await V(t, Ht, 'getChainId')({})),
        Gc({ currentChainId: S, chain: n }));
      let N =
          (B =
            (k = (C = t.chain) == null ? void 0 : C.formatters) == null
              ? void 0
              : k.transactionRequest) == null
            ? void 0
            : B.format,
        Z = (N || _t)({
          ...vn(P, { format: N }),
          accessList: s,
          authorizationList: o,
          blobs: i,
          chainId: S,
          data: c,
          from: v == null ? void 0 : v.address,
          gas: d,
          gasPrice: p,
          maxFeePerBlobGas: u,
          maxFeePerGas: h,
          maxPriorityFeePerGas: g,
          nonce: b,
          to: O,
          type: E,
          value: T,
        }),
        G = $l.get(t.uid),
        J = G ? 'wallet_sendTransaction' : 'eth_sendTransaction';
      try {
        return await t.request({ method: J, params: [Z] }, { retryCount: 0 });
      } catch (te) {
        if (G === false) throw te;
        let z = te;
        if (
          z.name === 'InvalidInputRpcError' ||
          z.name === 'InvalidParamsRpcError' ||
          z.name === 'MethodNotFoundRpcError' ||
          z.name === 'MethodNotSupportedRpcError'
        )
          return await t
            .request(
              { method: 'wallet_sendTransaction', params: [Z] },
              { retryCount: 0 }
            )
            .then(q => ($l.set(t.uid, true), q))
            .catch(q => {
              let j = q;
              throw j.name === 'MethodNotFoundRpcError' ||
                j.name === 'MethodNotSupportedRpcError'
                ? ($l.set(t.uid, false), z)
                : j;
            });
        throw z;
      }
    }
    if ((v == null ? void 0 : v.type) === 'local') {
      let S = await V(
          t,
          Cn,
          'prepareTransactionRequest'
        )({
          account: v,
          accessList: s,
          authorizationList: o,
          blobs: i,
          chain: n,
          data: c,
          gas: d,
          gasPrice: p,
          maxFeePerBlobGas: u,
          maxFeePerGas: h,
          maxPriorityFeePerGas: g,
          nonce: b,
          nonceManager: v.nonceManager,
          parameters: [...hl, 'sidecars'],
          type: E,
          value: T,
          ...P,
          to: O,
        }),
        N =
          (F = n == null ? void 0 : n.serializers) == null
            ? void 0
            : F.transaction,
        M = await v.signTransaction(S, { serializer: N });
      return await V(t, ys, 'sendRawTransaction')({ serializedTransaction: M });
    }
    throw (v == null ? void 0 : v.type) === 'smart'
      ? new Bn({
          metaMessages: [
            'Consider using the `sendUserOperation` Action instead.',
          ],
          docsPath: '/docs/actions/bundler/sendUserOperation',
          type: 'smart',
        })
      : new Bn({
          docsPath: '/docs/actions/wallet/sendTransaction',
          type: v == null ? void 0 : v.type,
        });
  } catch (O) {
    throw O instanceof Bn
      ? O
      : Wc(O, { ...e, account: v, chain: e.chain || void 0 });
  }
}
async function tg(t, e) {
  let {
    abi: r,
    account: n = t.account,
    address: s,
    args: o,
    dataSuffix: i,
    functionName: c,
    ...d
  } = e;
  if (typeof n == 'undefined')
    throw new Ye({ docsPath: '/docs/contract/writeContract' });
  let p = n ? ae(n) : null,
    u = we({ abi: r, args: o, functionName: c });
  try {
    return await V(
      t,
      bs,
      'sendTransaction'
    )({ data: `${u}${i ? i.replace('0x', '') : ''}`, to: s, account: p, ...d });
  } catch (h) {
    throw It(h, {
      abi: r,
      address: s,
      args: o,
      docsPath: '/docs/contract/writeContract',
      functionName: c,
      sender: p == null ? void 0 : p.address,
    });
  }
}
f();
ce();
zc();
st();
f();
dt();
f();
dt();
var Bl = { '0x0': 'reverted', '0x1': 'success' };
function rg(t) {
  let e = {
    ...t,
    blockNumber: t.blockNumber ? BigInt(t.blockNumber) : null,
    contractAddress: t.contractAddress ? t.contractAddress : null,
    cumulativeGasUsed: t.cumulativeGasUsed ? BigInt(t.cumulativeGasUsed) : null,
    effectiveGasPrice: t.effectiveGasPrice ? BigInt(t.effectiveGasPrice) : null,
    gasUsed: t.gasUsed ? BigInt(t.gasUsed) : null,
    logs: t.logs ? t.logs.map(r => ct(r)) : null,
    to: t.to ? t.to : null,
    transactionIndex: t.transactionIndex ? Ue(t.transactionIndex) : null,
    status: t.status ? Bl[t.status] : null,
    type: t.type ? pl[t.type] || t.type : null,
  };
  return (
    t.blobGasPrice && (e.blobGasPrice = BigInt(t.blobGasPrice)),
    t.blobGasUsed && (e.blobGasUsed = BigInt(t.blobGasUsed)),
    e
  );
}
async function Zc(t, e) {
  var p;
  let {
      atomic: r = false,
      chainId: n,
      receipts: s,
      version: o = '2.0.0',
      ...i
    } = await t.request({ method: 'wallet_getCallsStatus', params: [e.id] }),
    [c, d] = (() => {
      let u = i.status;
      return u >= 100 && u < 200
        ? ['pending', u]
        : u >= 200 && u < 300
          ? ['success', u]
          : u >= 300 && u < 700
            ? ['failure', u]
            : u === 'CONFIRMED'
              ? ['success', 200]
              : u === 'PENDING'
                ? ['pending', 100]
                : [void 0, u];
    })();
  return {
    ...i,
    atomic: r,
    chainId: n ? Ue(n) : void 0,
    receipts:
      (p =
        s == null
          ? void 0
          : s.map(u => ({
              ...u,
              blockNumber: Me(u.blockNumber),
              gasUsed: Me(u.gasUsed),
              status: Bl[u.status],
            }))) != null
        ? p
        : [],
    statusCode: d,
    status: c,
    version: o,
  };
}
async function ng(t, e) {
  let {
      id: r,
      pollingInterval: n = t.pollingInterval,
      status: s = ({ statusCode: g }) => g >= 200,
      timeout: o = 6e4,
    } = e,
    i = ue(['waitForCallsStatus', t.uid, r]),
    { promise: c, resolve: d, reject: p } = ms(),
    u,
    h = ut(i, { resolve: d, reject: p }, g => {
      let b = qt(
        async () => {
          let E = T => {
            clearTimeout(u), b(), T(), h();
          };
          try {
            let T = await Zc(t, { id: r });
            if (!s(T)) return;
            E(() => g.resolve(T));
          } catch (T) {
            E(() => g.reject(T));
          }
        },
        { interval: n, emitOnBegin: true }
      );
      return b;
    });
  return (
    (u = o
      ? setTimeout(() => {
          h(), clearTimeout(u), p(new Il({ id: r }));
        }, o)
      : void 0),
    await c
  );
}
var Il = class extends I {
  constructor({ id: e }) {
    super(
      `Timed out while waiting for call bundle with id "${e}" to be confirmed.`,
      { name: 'WaitForCallsStatusTimeoutError' }
    );
  }
};
f();
Ne();
f();
var Kc = 256,
  Jc;
function Yc(t = 11) {
  if (!Jc || Kc + t > 256 * 2) {
    (Jc = ''), (Kc = 0);
    for (let e = 0; e < 256; e++)
      Jc += ((256 + Math.random() * 256) | 0).toString(16).substring(1);
  }
  return Jc.substring(Kc, Kc++ + t);
}
function Xc(t) {
  var P;
  let {
      batch: e,
      cacheTime: r = (P = t.pollingInterval) != null ? P : 4e3,
      ccipRead: n,
      key: s = 'base',
      name: o = 'Base Client',
      pollingInterval: i = 4e3,
      type: c = 'base',
    } = t,
    d = t.chain,
    p = t.account ? ae(t.account) : void 0,
    {
      config: u,
      request: h,
      value: g,
    } = t.transport({ chain: d, pollingInterval: i }),
    b = { ...u, ...g },
    E = {
      account: p,
      batch: e,
      cacheTime: r,
      ccipRead: n,
      chain: d,
      key: s,
      name: o,
      pollingInterval: i,
      request: h,
      transport: b,
      type: c,
      uid: Yc(),
    };
  function T(v) {
    return C => {
      let k = C(v);
      for (let F in E) delete k[F];
      let B = { ...v, ...k };
      return Object.assign(B, { extend: T(B) });
    };
  }
  return Object.assign(E, { extend: T(E) });
}
f();
f();
ce();
qn();
pi();
se();
f();
si();
var Qc = new fr(8192);
function og(t, { enabled: e = true, id: r }) {
  if (!e || !r) return t();
  if (Qc.get(r)) return Qc.get(r);
  let n = t().finally(() => Qc.delete(r));
  return Qc.set(r, n), n;
}
f();
function Pi(
  t,
  { delay: e = 100, retryCount: r = 2, shouldRetry: n = () => true } = {}
) {
  return new Promise((s, o) => {
    let i = async ({ count: c = 0 } = {}) => {
      let d = async ({ error: p }) => {
        let u = typeof e == 'function' ? e({ count: c, error: p }) : e;
        u && (await Ai(u)), i({ count: c + 1 });
      };
      try {
        let p = await t();
        s(p);
      } catch (p) {
        if (c < r && (await n({ count: c, error: p }))) return d({ error: p });
        o(p);
      }
    };
    i();
  });
}
st();
function sg(t, e = {}) {
  return async (r, n = {}) => {
    var h;
    let {
        dedupe: s = false,
        methods: o,
        retryDelay: i = 150,
        retryCount: c = 3,
        uid: d,
      } = { ...e, ...n },
      { method: p } = r;
    if ((h = o == null ? void 0 : o.exclude) != null && h.includes(p))
      throw new ln(new Error('method not supported'), { method: p });
    if (o != null && o.include && !o.include.includes(p))
      throw new ln(new Error('method not supported'), { method: p });
    let u = s ? lr(`${d}.${ue(r)}`) : void 0;
    return og(
      () =>
        Pi(
          async () => {
            try {
              return await t(r);
            } catch (g) {
              let b = g;
              switch (b.code) {
                case ko.code:
                  throw new ko(b);
                case $o.code:
                  throw new $o(b);
                case Bo.code:
                  throw new Bo(b, { method: r.method });
                case Io.code:
                  throw new Io(b);
                case Ur.code:
                  throw new Ur(b);
                case xr.code:
                  throw new xr(b);
                case So.code:
                  throw new So(b);
                case Ro.code:
                  throw new Ro(b);
                case No.code:
                  throw new No(b);
                case ln.code:
                  throw new ln(b, { method: r.method });
                case Vn.code:
                  throw new Vn(b);
                case Fo.code:
                  throw new Fo(b);
                case Gn.code:
                  throw new Gn(b);
                case Oo.code:
                  throw new Oo(b);
                case Do.code:
                  throw new Do(b);
                case Mo.code:
                  throw new Mo(b);
                case Uo.code:
                  throw new Uo(b);
                case Lo.code:
                  throw new Lo(b);
                case zo.code:
                  throw new zo(b);
                case _o.code:
                  throw new _o(b);
                case Ho.code:
                  throw new Ho(b);
                case jo.code:
                  throw new jo(b);
                case qo.code:
                  throw new qo(b);
                case Vo.code:
                  throw new Vo(b);
                case Go.code:
                  throw new Go(b);
                case 5e3:
                  throw new Gn(b);
                default:
                  throw g instanceof I ? g : new sc(b);
              }
            }
          },
          {
            delay: ({ count: g, error: b }) => {
              var E;
              if (b && b instanceof Lt) {
                let T =
                  (E = b == null ? void 0 : b.headers) == null
                    ? void 0
                    : E.get('Retry-After');
                if (T != null && T.match(/\d/)) return Number.parseInt(T) * 1e3;
              }
              return ~~(1 << g) * i;
            },
            retryCount: c,
            shouldRetry: ({ error: g }) => _w(g),
          }
        ),
      { enabled: s, id: u }
    );
  };
}
function _w(t) {
  return 'code' in t && typeof t.code == 'number'
    ? t.code === -1 || t.code === Vn.code || t.code === Ur.code
    : t instanceof Lt && t.status
      ? t.status === 403 ||
        t.status === 408 ||
        t.status === 413 ||
        t.status === 429 ||
        t.status === 500 ||
        t.status === 502 ||
        t.status === 503 ||
        t.status === 504
      : true;
}
function ig(
  {
    key: t,
    methods: e,
    name: r,
    request: n,
    retryCount: s = 3,
    retryDelay: o = 150,
    timeout: i,
    type: c,
  },
  d
) {
  let p = Yc();
  return {
    config: {
      key: t,
      methods: e,
      name: r,
      request: n,
      retryCount: s,
      retryDelay: o,
      timeout: i,
      type: c,
    },
    request: sg(n, { methods: e, retryCount: s, retryDelay: o, uid: p }),
    value: d,
  };
}
f();
qn();
f();
ce();
var eu = class extends I {
  constructor() {
    super(
      'No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.',
      { docsPath: '/docs/clients/intro', name: 'UrlRequiredError' }
    );
  }
};
El();
f();
qn();
f();
function ag(
  t,
  { errorInstance: e = new Error('timed out'), timeout: r, signal: n }
) {
  return new Promise((s, o) => {
    (async () => {
      let i;
      try {
        let c = new AbortController();
        r > 0 &&
          (i = setTimeout(() => {
            c.abort();
          }, r)),
          s(await t({ signal: (c == null ? void 0 : c.signal) || null }));
      } catch (c) {
        (c == null ? void 0 : c.name) === 'AbortError' && o(e), o(c);
      } finally {
        clearTimeout(i);
      }
    })();
  });
}
st();
f();
function Hw() {
  return {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    },
  };
}
var Sl = Hw();
function cg(t, e = {}) {
  return {
    async request(r) {
      var h, g, b, E;
      let {
          body: n,
          onRequest: s = e.onRequest,
          onResponse: o = e.onResponse,
          timeout: i = (h = e.timeout) != null ? h : 1e4,
        } = r,
        c = {
          ...((g = e.fetchOptions) != null ? g : {}),
          ...((b = r.fetchOptions) != null ? b : {}),
        },
        { headers: d, method: p, signal: u } = c;
      try {
        let T = await ag(
          async ({ signal: v }) => {
            var O, S, N;
            let C = {
                ...c,
                body: Array.isArray(n)
                  ? ue(
                      n.map(M => {
                        var Z;
                        return {
                          jsonrpc: '2.0',
                          id: (Z = M.id) != null ? Z : Sl.take(),
                          ...M,
                        };
                      })
                    )
                  : ue({
                      jsonrpc: '2.0',
                      id: (O = n.id) != null ? O : Sl.take(),
                      ...n,
                    }),
                headers: { 'Content-Type': 'application/json', ...d },
                method: p || 'POST',
                signal: u || (i > 0 ? v : null),
              },
              k = new Request(t, C),
              B =
                (S = await (s == null ? void 0 : s(k, C))) != null
                  ? S
                  : { ...C, url: t };
            return await fetch((N = B.url) != null ? N : t, B);
          },
          {
            errorInstance: new fi({ body: n, url: t }),
            timeout: i,
            signal: true,
          }
        );
        o && (await o(T));
        let P;
        if (
          (E = T.headers.get('Content-Type')) != null &&
          E.startsWith('application/json')
        )
          P = await T.json();
        else {
          P = await T.text();
          try {
            P = JSON.parse(P || '{}');
          } catch (v) {
            if (T.ok) throw v;
            P = { error: P };
          }
        }
        if (!T.ok)
          throw new Lt({
            body: n,
            details: ue(P.error) || T.statusText,
            headers: T.headers,
            status: T.status,
            url: t,
          });
        return P;
      } catch (T) {
        throw T instanceof Lt || T instanceof fi
          ? T
          : new Lt({ body: n, cause: T, url: t });
      }
    },
  };
}
function xs(t, e = {}) {
  let {
    batch: r,
    fetchOptions: n,
    key: s = 'http',
    methods: o,
    name: i = 'HTTP JSON-RPC',
    onFetchRequest: c,
    onFetchResponse: d,
    retryDelay: p,
    raw: u,
  } = e;
  return ({ chain: h, retryCount: g, timeout: b }) => {
    var B, F;
    let { batchSize: E = 1e3, wait: T = 0 } = typeof r == 'object' ? r : {},
      P = (B = e.retryCount) != null ? B : g,
      v = (F = b != null ? b : e.timeout) != null ? F : 1e4,
      C = t || (h == null ? void 0 : h.rpcUrls.default.http[0]);
    if (!C) throw new eu();
    let k = cg(C, { fetchOptions: n, onRequest: c, onResponse: d, timeout: v });
    return ig(
      {
        key: s,
        methods: o,
        name: i,
        async request({ method: O, params: S }) {
          let N = { method: O, params: S },
            { schedule: M } = _c({
              id: C,
              wait: T,
              shouldSplitBatch(te) {
                return te.length > E;
              },
              fn: te => k.request({ body: te }),
              sort: (te, z) => te.id - z.id,
            }),
            Z = async te => (r ? M(te) : [await k.request({ body: te })]),
            [{ error: G, result: J }] = await Z(N);
          if (u) return { error: G, result: J };
          if (G) throw new dn({ body: N, error: G, url: C });
          return J;
        },
        retryCount: P,
        retryDelay: p,
        timeout: v,
        type: 'http',
      },
      { fetchOptions: n, url: C }
    );
  };
}
f();
f();
f();
Pn();
An();
yt();
ro();
ei();
se();
f();
ai();
ce();
un();
function ws(t, e) {
  var n, s, o, i, c, d;
  if (!(t instanceof I)) return false;
  let r = t.walk(p => p instanceof jn);
  return r instanceof jn
    ? !!(
        ((n = r.data) == null ? void 0 : n.errorName) === 'ResolverNotFound' ||
        ((s = r.data) == null ? void 0 : s.errorName) ===
          'ResolverWildcardNotSupported' ||
        ((o = r.data) == null ? void 0 : o.errorName) ===
          'ResolverNotContract' ||
        ((i = r.data) == null ? void 0 : i.errorName) === 'ResolverError' ||
        ((c = r.data) == null ? void 0 : c.errorName) === 'HttpError' ||
        ((d = r.reason) != null &&
          d.includes('Wildcard on non-extended resolvers is not supported')) ||
        (e === 'reverse' && r.reason === _a[50])
      )
    : false;
}
Vc();
f();
or();
Ke();
se();
rr();
f();
Kt();
function tu(t) {
  if (t.length !== 66 || t.indexOf('[') !== 0 || t.indexOf(']') !== 65)
    return null;
  let e = `0x${t.slice(1, 65)}`;
  return Re(e) ? e : null;
}
function vs(t) {
  let e = new Uint8Array(32).fill(0);
  if (!t) return me(e);
  let r = t.split('.');
  for (let n = r.length - 1; n >= 0; n -= 1) {
    let s = tu(r[n]),
      o = s ? Ut(s) : Ee(er(r[n]), 'bytes');
    e = Ee(lt([e, o]), 'bytes');
  }
  return me(e);
}
f();
Ke();
f();
function ug(t) {
  return `[${t.slice(2)}]`;
}
f();
Ke();
se();
rr();
function dg(t) {
  let e = new Uint8Array(32).fill(0);
  return t ? tu(t) || Ee(er(t)) : me(e);
}
function In(t) {
  let e = t.replace(/^\.|\.$/gm, '');
  if (e.length === 0) return new Uint8Array(1);
  let r = new Uint8Array(er(e).byteLength + 2),
    n = 0,
    s = e.split('.');
  for (let o = 0; o < s.length; o++) {
    let i = er(s[o]);
    i.byteLength > 255 && (i = er(ug(dg(s[o])))),
      (r[n] = i.length),
      r.set(i, n + 1),
      (n += i.length + 1);
  }
  return r.byteLength !== n + 1 ? r.slice(0, n + 1) : r;
}
async function lg(t, e) {
  let {
      blockNumber: r,
      blockTag: n,
      coinType: s,
      name: o,
      gatewayUrls: i,
      strict: c,
    } = e,
    { chain: d } = t,
    p = (() => {
      if (e.universalResolverAddress) return e.universalResolverAddress;
      if (!d)
        throw new Error(
          'client chain not configured. universalResolverAddress is required.'
        );
      return jt({ blockNumber: r, chain: d, contract: 'ensUniversalResolver' });
    })(),
    u = d == null ? void 0 : d.ensTlds;
  if (u && !u.some(h => o.endsWith(h))) return null;
  try {
    let h = we({
        abi: bl,
        functionName: 'addr',
        ...(s != null ? { args: [vs(o), BigInt(s)] } : { args: [vs(o)] }),
      }),
      g = {
        address: p,
        abi: Rc,
        functionName: 'resolve',
        args: [Le(In(o)), h, i != null ? i : [hs]],
        blockNumber: r,
        blockTag: n,
      },
      E = await V(t, nt, 'readContract')(g);
    if (E[0] === '0x') return null;
    let T = wt({
      abi: bl,
      args: s != null ? [vs(o), BigInt(s)] : void 0,
      functionName: 'addr',
      data: E[0],
    });
    return T === '0x' || Qt(T) === '0x00' ? null : T;
  } catch (h) {
    if (c) throw h;
    if (ws(h, 'resolve')) return null;
    throw h;
  }
}
f();
f();
f();
f();
ce();
var ru = class extends I {
    constructor({ data: e }) {
      super(
        'Unable to extract image from metadata. The metadata may be malformed or invalid.',
        {
          metaMessages: [
            '- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.',
            '',
            `Provided data: ${JSON.stringify(e)}`,
          ],
          name: 'EnsAvatarInvalidMetadataError',
        }
      );
    }
  },
  Sn = class extends I {
    constructor({ reason: e }) {
      super(`ENS NFT avatar URI is invalid. ${e}`, {
        name: 'EnsAvatarInvalidNftUriError',
      });
    }
  },
  Ts = class extends I {
    constructor({ uri: e }) {
      super(
        `Unable to resolve ENS avatar URI "${e}". The URI may be malformed, invalid, or does not respond with a valid image.`,
        { name: 'EnsAvatarUriResolutionError' }
      );
    }
  },
  nu = class extends I {
    constructor({ namespace: e }) {
      super(
        `ENS NFT avatar namespace "${e}" is not supported. Must be "erc721" or "erc1155".`,
        { name: 'EnsAvatarUnsupportedNamespaceError' }
      );
    }
  };
var jw =
    /(?<protocol>https?:\/\/[^\/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/,
  qw =
    /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/,
  Vw = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/,
  Gw = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
async function Ww(t) {
  try {
    let e = await fetch(t, { method: 'HEAD' });
    if (e.status === 200) {
      let r = e.headers.get('content-type');
      return r == null ? void 0 : r.startsWith('image/');
    }
    return false;
  } catch (e) {
    return (typeof e == 'object' && typeof e.response != 'undefined') ||
      !globalThis.hasOwnProperty('Image')
      ? false
      : new Promise(r => {
          let n = new Image();
          (n.onload = () => {
            r(true);
          }),
            (n.onerror = () => {
              r(false);
            }),
            (n.src = t);
        });
  }
}
function fg(t, e) {
  return t ? (t.endsWith('/') ? t.slice(0, -1) : t) : e;
}
function Rl({ uri: t, gatewayUrls: e }) {
  let r = Vw.test(t);
  if (r) return { uri: t, isOnChain: true, isEncoded: r };
  let n = fg(e == null ? void 0 : e.ipfs, 'https://ipfs.io'),
    s = fg(e == null ? void 0 : e.arweave, 'https://arweave.net'),
    o = t.match(jw),
    {
      protocol: i,
      subpath: c,
      target: d,
      subtarget: p = '',
    } = (o == null ? void 0 : o.groups) || {},
    u = i === 'ipns:/' || c === 'ipns/',
    h = i === 'ipfs:/' || c === 'ipfs/' || qw.test(t);
  if (t.startsWith('http') && !u && !h) {
    let b = t;
    return (
      e != null &&
        e.arweave &&
        (b = t.replace(
          /https:\/\/arweave.net/g,
          e == null ? void 0 : e.arweave
        )),
      { uri: b, isOnChain: false, isEncoded: false }
    );
  }
  if ((u || h) && d)
    return {
      uri: `${n}/${u ? 'ipns' : 'ipfs'}/${d}${p}`,
      isOnChain: false,
      isEncoded: false,
    };
  if (i === 'ar:/' && d)
    return { uri: `${s}/${d}${p || ''}`, isOnChain: false, isEncoded: false };
  let g = t.replace(Gw, '');
  if (
    (g.startsWith('<svg') && (g = `data:image/svg+xml;base64,${btoa(g)}`),
    g.startsWith('data:') || g.startsWith('{'))
  )
    return { uri: g, isOnChain: true, isEncoded: false };
  throw new Ts({ uri: t });
}
function Nl(t) {
  if (
    typeof t != 'object' ||
    (!('image' in t) && !('image_url' in t) && !('image_data' in t))
  )
    throw new ru({ data: t });
  return t.image || t.image_url || t.image_data;
}
async function pg({ gatewayUrls: t, uri: e }) {
  try {
    let r = await fetch(e).then(s => s.json());
    return await ou({ gatewayUrls: t, uri: Nl(r) });
  } catch {
    throw new Ts({ uri: e });
  }
}
async function ou({ gatewayUrls: t, uri: e }) {
  let { uri: r, isOnChain: n } = Rl({ uri: e, gatewayUrls: t });
  if (n || (await Ww(r))) return r;
  throw new Ts({ uri: e });
}
function mg(t) {
  let e = t;
  e.startsWith('did:nft:') &&
    (e = e.replace('did:nft:', '').replace(/_/g, '/'));
  let [r, n, s] = e.split('/'),
    [o, i] = r.split(':'),
    [c, d] = n.split(':');
  if (!o || o.toLowerCase() !== 'eip155')
    throw new Sn({ reason: 'Only EIP-155 supported' });
  if (!i) throw new Sn({ reason: 'Chain ID not found' });
  if (!d) throw new Sn({ reason: 'Contract address not found' });
  if (!s) throw new Sn({ reason: 'Token ID not found' });
  if (!c) throw new Sn({ reason: 'ERC namespace not found' });
  return {
    chainID: Number.parseInt(i),
    namespace: c.toLowerCase(),
    contractAddress: d,
    tokenID: s,
  };
}
async function hg(t, { nft: e }) {
  if (e.namespace === 'erc721')
    return nt(t, {
      address: e.contractAddress,
      abi: [
        {
          name: 'tokenURI',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'tokenId', type: 'uint256' }],
          outputs: [{ name: '', type: 'string' }],
        },
      ],
      functionName: 'tokenURI',
      args: [BigInt(e.tokenID)],
    });
  if (e.namespace === 'erc1155')
    return nt(t, {
      address: e.contractAddress,
      abi: [
        {
          name: 'uri',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: '_id', type: 'uint256' }],
          outputs: [{ name: '', type: 'string' }],
        },
      ],
      functionName: 'uri',
      args: [BigInt(e.tokenID)],
    });
  throw new nu({ namespace: e.namespace });
}
async function gg(t, { gatewayUrls: e, record: r }) {
  return /eip155:/i.test(r)
    ? Zw(t, { gatewayUrls: e, record: r })
    : ou({ uri: r, gatewayUrls: e });
}
async function Zw(t, { gatewayUrls: e, record: r }) {
  let n = mg(r),
    s = await hg(t, { nft: n }),
    { uri: o, isOnChain: i, isEncoded: c } = Rl({ uri: s, gatewayUrls: e });
  if (i && (o.includes('data:application/json;base64,') || o.startsWith('{'))) {
    let p = c ? atob(o.replace('data:application/json;base64,', '')) : o,
      u = JSON.parse(p);
    return ou({ uri: Nl(u), gatewayUrls: e });
  }
  let d = n.tokenID;
  return (
    n.namespace === 'erc1155' && (d = d.replace('0x', '').padStart(64, '0')),
    pg({ gatewayUrls: e, uri: o.replace(/(?:0x)?{id}/, d) })
  );
}
f();
Pn();
An();
yt();
ro();
se();
Vc();
async function su(t, e) {
  let {
      blockNumber: r,
      blockTag: n,
      key: s,
      name: o,
      gatewayUrls: i,
      strict: c,
    } = e,
    { chain: d } = t,
    p = (() => {
      if (e.universalResolverAddress) return e.universalResolverAddress;
      if (!d)
        throw new Error(
          'client chain not configured. universalResolverAddress is required.'
        );
      return jt({ blockNumber: r, chain: d, contract: 'ensUniversalResolver' });
    })(),
    u = d == null ? void 0 : d.ensTlds;
  if (u && !u.some(h => o.endsWith(h))) return null;
  try {
    let h = {
        address: p,
        abi: Rc,
        functionName: 'resolve',
        args: [
          Le(In(o)),
          we({ abi: yl, functionName: 'text', args: [vs(o), s] }),
          i != null ? i : [hs],
        ],
        blockNumber: r,
        blockTag: n,
      },
      b = await V(t, nt, 'readContract')(h);
    if (b[0] === '0x') return null;
    let E = wt({ abi: yl, functionName: 'text', data: b[0] });
    return E === '' ? null : E;
  } catch (h) {
    if (c) throw h;
    if (ws(h, 'resolve')) return null;
    throw h;
  }
}
async function yg(
  t,
  {
    blockNumber: e,
    blockTag: r,
    assetGatewayUrls: n,
    name: s,
    gatewayUrls: o,
    strict: i,
    universalResolverAddress: c,
  }
) {
  let d = await V(
    t,
    su,
    'getEnsText'
  )({
    blockNumber: e,
    blockTag: r,
    key: 'avatar',
    name: s,
    universalResolverAddress: c,
    gatewayUrls: o,
    strict: i,
  });
  if (!d) return null;
  try {
    return await gg(t, { record: d, gatewayUrls: n });
  } catch {
    return null;
  }
}
f();
Pn();
ro();
se();
async function bg(
  t,
  {
    address: e,
    blockNumber: r,
    blockTag: n,
    gatewayUrls: s,
    strict: o,
    universalResolverAddress: i,
  }
) {
  let c = i;
  if (!c) {
    if (!t.chain)
      throw new Error(
        'client chain not configured. universalResolverAddress is required.'
      );
    c = jt({
      blockNumber: r,
      chain: t.chain,
      contract: 'ensUniversalResolver',
    });
  }
  let d = `${e.toLowerCase().substring(2)}.addr.reverse`;
  try {
    let p = {
        address: c,
        abi: Fh,
        functionName: 'reverse',
        args: [Le(In(d))],
        blockNumber: r,
        blockTag: n,
      },
      u = V(t, nt, 'readContract'),
      [h, g] = s ? await u({ ...p, args: [...p.args, s] }) : await u(p);
    return e.toLowerCase() !== g.toLowerCase() ? null : h;
  } catch (p) {
    if (o) throw p;
    if (ws(p, 'reverse')) return null;
    throw p;
  }
}
f();
ro();
se();
async function xg(t, e) {
  let { blockNumber: r, blockTag: n, name: s } = e,
    { chain: o } = t,
    i = (() => {
      if (e.universalResolverAddress) return e.universalResolverAddress;
      if (!o)
        throw new Error(
          'client chain not configured. universalResolverAddress is required.'
        );
      return jt({ blockNumber: r, chain: o, contract: 'ensUniversalResolver' });
    })(),
    c = o == null ? void 0 : o.ensTlds;
  if (c && !c.some(p => s.endsWith(p)))
    throw new Error(
      `${s} is not a valid ENS TLD (${c == null ? void 0 : c.join(', ')}) for chain "${o.name}" (id: ${o.id}).`
    );
  let [d] = await V(
    t,
    nt,
    'readContract'
  )({
    address: i,
    abi: [
      {
        inputs: [{ type: 'bytes' }],
        name: 'findResolver',
        outputs: [{ type: 'address' }, { type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'findResolver',
    args: [Le(In(s))],
    blockNumber: r,
    blockTag: n,
  });
  return d;
}
gs();
f();
Ne();
se();
vl();
Ti();
Qn();
Tn();
async function iu(t, e) {
  var P, v, C;
  let {
      account: r = t.account,
      blockNumber: n,
      blockTag: s = 'latest',
      blobs: o,
      data: i,
      gas: c,
      gasPrice: d,
      maxFeePerBlobGas: p,
      maxFeePerGas: u,
      maxPriorityFeePerGas: h,
      to: g,
      value: b,
      ...E
    } = e,
    T = r ? ae(r) : void 0;
  try {
    xt(e);
    let B = (n ? H(n) : void 0) || s,
      F =
        (C =
          (v = (P = t.chain) == null ? void 0 : P.formatters) == null
            ? void 0
            : v.transactionRequest) == null
          ? void 0
          : C.format,
      S = (F || _t)({
        ...vn(E, { format: F }),
        from: T == null ? void 0 : T.address,
        blobs: o,
        data: i,
        gas: c,
        gasPrice: d,
        maxFeePerBlobGas: p,
        maxFeePerGas: u,
        maxPriorityFeePerGas: h,
        to: g,
        value: b,
      }),
      N = await t.request({ method: 'eth_createAccessList', params: [S, B] });
    return { accessList: N.accessList, gasUsed: BigInt(N.gasUsed) };
  } catch (k) {
    throw Lc(k, { ...e, account: T, chain: t.chain });
  }
}
f();
async function wg(t) {
  let e = cn(t, { method: 'eth_newBlockFilter' }),
    r = await t.request({ method: 'eth_newBlockFilter' });
  return { id: r, request: e(r), type: 'block' };
}
f();
se();
async function au(
  t,
  {
    address: e,
    args: r,
    event: n,
    events: s,
    fromBlock: o,
    strict: i,
    toBlock: c,
  } = {}
) {
  let d = s != null ? s : n ? [n] : void 0,
    p = cn(t, { method: 'eth_newFilter' }),
    u = [];
  d &&
    ((u = [d.flatMap(b => gr({ abi: [b], eventName: b.name, args: r }))]),
    n && (u = u[0]));
  let h = await t.request({
    method: 'eth_newFilter',
    params: [
      {
        address: e,
        fromBlock: typeof o == 'bigint' ? H(o) : o,
        toBlock: typeof c == 'bigint' ? H(c) : c,
        ...(u.length ? { topics: u } : {}),
      },
    ],
  });
  return {
    abi: d,
    args: r,
    eventName: n ? n.name : void 0,
    fromBlock: o,
    id: h,
    request: p(h),
    strict: !!i,
    toBlock: c,
    type: 'event',
  };
}
f();
async function cu(t) {
  let e = cn(t, { method: 'eth_newPendingTransactionFilter' }),
    r = await t.request({ method: 'eth_newPendingTransactionFilter' });
  return { id: r, request: e(r), type: 'transaction' };
}
f();
async function vg(t) {
  let e = await t.request({ method: 'eth_blobBaseFee' });
  return BigInt(e);
}
f();
dt();
se();
async function Tg(
  t,
  { blockHash: e, blockNumber: r, blockTag: n = 'latest' } = {}
) {
  let s = r !== void 0 ? H(r) : void 0,
    o;
  return (
    e
      ? (o = await t.request(
          { method: 'eth_getBlockTransactionCountByHash', params: [e] },
          { dedupe: true }
        ))
      : (o = await t.request(
          { method: 'eth_getBlockTransactionCountByNumber', params: [s || n] },
          { dedupe: !!s }
        )),
    Ue(o)
  );
}
f();
se();
async function Fl(t, { address: e, blockNumber: r, blockTag: n = 'latest' }) {
  let s = r !== void 0 ? H(r) : void 0,
    o = await t.request(
      { method: 'eth_getCode', params: [e, s || n] },
      { dedupe: !!s }
    );
  if (o !== '0x') return o;
}
f();
f();
ce();
var uu = class extends I {
  constructor({ address: e }) {
    super(`No EIP-712 domain found on contract "${e}".`, {
      metaMessages: [
        'Ensure that:',
        `- The contract is deployed at the address "${e}".`,
        '- `eip712Domain()` function exists on the contract.',
        '- `eip712Domain()` function matches signature to ERC-5267 specification.',
      ],
      name: 'Eip712DomainNotFoundError',
    });
  }
};
async function Eg(t, e) {
  let { address: r, factory: n, factoryData: s } = e;
  try {
    let [o, i, c, d, p, u, h] = await V(
      t,
      nt,
      'readContract'
    )({
      abi: Kw,
      address: r,
      functionName: 'eip712Domain',
      factory: n,
      factoryData: s,
    });
    return {
      domain: {
        name: i,
        version: c,
        chainId: Number(d),
        verifyingContract: p,
        salt: u,
      },
      extensions: h,
      fields: o,
    };
  } catch (o) {
    let i = o;
    throw i.name === 'ContractFunctionExecutionError' &&
      i.cause.name === 'ContractFunctionZeroDataError'
      ? new uu({ address: r })
      : i;
  }
}
var Kw = [
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', type: 'bytes1' },
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
      { name: 'salt', type: 'bytes32' },
      { name: 'extensions', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
f();
se();
f();
function Cg(t) {
  var e;
  return {
    baseFeePerGas: t.baseFeePerGas.map(r => BigInt(r)),
    gasUsedRatio: t.gasUsedRatio,
    oldestBlock: BigInt(t.oldestBlock),
    reward: (e = t.reward) == null ? void 0 : e.map(r => r.map(n => BigInt(n))),
  };
}
async function Ag(
  t,
  {
    blockCount: e,
    blockNumber: r,
    blockTag: n = 'latest',
    rewardPercentiles: s,
  }
) {
  let o = r ? H(r) : void 0,
    i = await t.request(
      { method: 'eth_feeHistory', params: [H(e), o || n, s] },
      { dedupe: !!o }
    );
  return Cg(i);
}
f();
async function Pg(t, { filter: e }) {
  var o;
  let r = (o = e.strict) != null ? o : false,
    s = (await e.request({ method: 'eth_getFilterLogs', params: [e.id] })).map(
      i => ct(i)
    );
  return e.abi ? fs({ abi: e.abi, logs: s, strict: r }) : s;
}
f();
se();
f();
f();
f();
function Ol(t) {
  return { formatters: void 0, fees: void 0, serializers: void 0, ...t };
}
f();
$e();
Ln();
f();
st();
ce();
var du = class extends I {
    constructor({ domain: e }) {
      super(`Invalid domain "${ue(e)}".`, {
        metaMessages: ['Must be a valid EIP-712 domain.'],
      });
    }
  },
  lu = class extends I {
    constructor({ primaryType: e, types: r }) {
      super(
        `Invalid primary type \`${e}\` must be one of \`${JSON.stringify(Object.keys(r))}\`.`,
        {
          docsPath: '/api/glossary/Errors#typeddatainvalidprimarytypeerror',
          metaMessages: ['Check that the primary type is a key in `types`.'],
        }
      );
    }
  },
  fu = class extends I {
    constructor({ type: e }) {
      super(`Struct type "${e}" is invalid.`, {
        metaMessages: ['Struct type must not be a Solidity type.'],
        name: 'InvalidStructTypeError',
      });
    }
  };
sn();
Jt();
se();
Id();
f();
mr();
or();
se();
rr();
function kg(t) {
  let { domain: e = {}, message: r, primaryType: n } = t,
    s = { EIP712Domain: mu({ domain: e }), ...t.types };
  pu({ domain: e, message: r, primaryType: n, types: s });
  let o = ['0x1901'];
  return (
    e && o.push(Jw({ domain: e, types: s })),
    n !== 'EIP712Domain' && o.push($g({ data: r, primaryType: n, types: s })),
    Ee(lt(o))
  );
}
function Jw({ domain: t, types: e }) {
  return $g({ data: t, primaryType: 'EIP712Domain', types: e });
}
function $g({ data: t, primaryType: e, types: r }) {
  let n = Bg({ data: t, primaryType: e, types: r });
  return Ee(n);
}
function Bg({ data: t, primaryType: e, types: r }) {
  let n = [{ type: 'bytes32' }],
    s = [Yw({ primaryType: e, types: r })];
  for (let o of r[e]) {
    let [i, c] = Sg({ types: r, name: o.name, type: o.type, value: t[o.name] });
    n.push(i), s.push(c);
  }
  return rt(n, s);
}
function Yw({ primaryType: t, types: e }) {
  let r = Le(Xw({ primaryType: t, types: e }));
  return Ee(r);
}
function Xw({ primaryType: t, types: e }) {
  let r = '',
    n = Ig({ primaryType: t, types: e });
  n.delete(t);
  let s = [t, ...Array.from(n).sort()];
  for (let o of s)
    r += `${o}(${e[o].map(({ name: i, type: c }) => `${c} ${i}`).join(',')})`;
  return r;
}
function Ig({ primaryType: t, types: e }, r = new Set()) {
  let n = t.match(/^\w*/u),
    s = n == null ? void 0 : n[0];
  if (r.has(s) || e[s] === void 0) return r;
  r.add(s);
  for (let o of e[s]) Ig({ primaryType: o.type, types: e }, r);
  return r;
}
function Sg({ types: t, name: e, type: r, value: n }) {
  if (t[r] !== void 0)
    return [{ type: 'bytes32' }, Ee(Bg({ data: n, primaryType: r, types: t }))];
  if (r === 'bytes')
    return (
      (n = `0x${(n.length % 2 ? '0' : '') + n.slice(2)}`),
      [{ type: 'bytes32' }, Ee(n)]
    );
  if (r === 'string') return [{ type: 'bytes32' }, Ee(Le(n))];
  if (r.lastIndexOf(']') === r.length - 1) {
    let s = r.slice(0, r.lastIndexOf('[')),
      o = n.map(i => Sg({ name: e, type: s, types: t, value: i }));
    return [
      { type: 'bytes32' },
      Ee(
        rt(
          o.map(([i]) => i),
          o.map(([, i]) => i)
        )
      ),
    ];
  }
  return [{ type: r }, n];
}
st();
function Rg(t) {
  let { domain: e, message: r, primaryType: n, types: s } = t,
    o = (d, p) => {
      let u = { ...p };
      for (let h of d) {
        let { name: g, type: b } = h;
        b === 'address' && (u[g] = u[g].toLowerCase());
      }
      return u;
    },
    i = s.EIP712Domain ? (e ? o(s.EIP712Domain, e) : {}) : {},
    c = (() => {
      if (n !== 'EIP712Domain') return o(s[n], r);
    })();
  return ue({ domain: i, message: c, primaryType: n, types: s });
}
function pu(t) {
  let { domain: e, message: r, primaryType: n, types: s } = t,
    o = (i, c) => {
      for (let d of i) {
        let { name: p, type: u } = d,
          h = c[p],
          g = u.match(Ua);
        if (g && (typeof h == 'number' || typeof h == 'bigint')) {
          let [T, P, v] = g;
          H(h, { signed: P === 'int', size: Number.parseInt(v) / 8 });
        }
        if (u === 'address' && typeof h == 'string' && !Je(h))
          throw new ot({ address: h });
        let b = u.match(im);
        if (b) {
          let [T, P] = b;
          if (P && pe(h) !== Number.parseInt(P))
            throw new va({
              expectedSize: Number.parseInt(P),
              givenSize: pe(h),
            });
        }
        let E = s[u];
        E && (Qw(u), o(E, h));
      }
    };
  if (s.EIP712Domain && e) {
    if (typeof e != 'object') throw new du({ domain: e });
    o(s.EIP712Domain, e);
  }
  if (n !== 'EIP712Domain')
    if (s[n]) o(s[n], r);
    else throw new lu({ primaryType: n, types: s });
}
function mu({ domain: t }) {
  return [
    typeof (t == null ? void 0 : t.name) == 'string' && {
      name: 'name',
      type: 'string',
    },
    (t == null ? void 0 : t.version) && { name: 'version', type: 'string' },
    (typeof (t == null ? void 0 : t.chainId) == 'number' ||
      typeof (t == null ? void 0 : t.chainId) == 'bigint') && {
      name: 'chainId',
      type: 'uint256',
    },
    (t == null ? void 0 : t.verifyingContract) && {
      name: 'verifyingContract',
      type: 'address',
    },
    (t == null ? void 0 : t.salt) && { name: 'salt', type: 'bytes32' },
  ].filter(Boolean);
}
function Qw(t) {
  if (
    t === 'address' ||
    t === 'bool' ||
    t === 'string' ||
    t.startsWith('bytes') ||
    t.startsWith('uint') ||
    t.startsWith('int')
  )
    throw new fu({ type: t });
}
yt();
dt();
f();
rr();
f();
f();
var Ng = `Ethereum Signed Message:
`;
or();
Jt();
se();
function Fg(t) {
  let e =
      typeof t == 'string'
        ? lr(t)
        : typeof t.raw == 'string'
          ? t.raw
          : me(t.raw),
    r = lr(`${Ng}${pe(e)}`);
  return lt([r, e]);
}
function hu(t, e) {
  return Ee(Fg(t), e);
}
f();
f();
var gu = '0x6492649264926492649264926492649264926492649264926492649264926492';
zn();
function Og(t) {
  return Bd(t, -32) === gu;
}
f();
mr();
or();
Ke();
function Dg(t) {
  let { address: e, data: r, signature: n, to: s = 'hex' } = t,
    o = nr([
      rt(
        [{ type: 'address' }, { type: 'bytes' }, { type: 'bytes' }],
        [e, r, n]
      ),
      gu,
    ]);
  return s === 'hex' ? o : je(o);
}
f();
f();
ce();
var yu = class extends I {
  constructor({ value: e }) {
    super(`Number \`${e}\` is not a valid decimal number.`, {
      name: 'InvalidDecimalNumberError',
    });
  }
};
function Mg(t, e) {
  if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(t)) throw new yu({ value: t });
  let [r, n = '0'] = t.split('.'),
    s = r.startsWith('-');
  if ((s && (r = r.slice(1)), (n = n.replace(/(0+)$/, '')), e === 0))
    Math.round(+`.${n}`) === 1 && (r = `${BigInt(r) + BigInt(1)}`), (n = '');
  else if (n.length > e) {
    let [o, i, c] = [n.slice(0, e - 1), n.slice(e - 1, e), n.slice(e)],
      d = Math.round(+`${i}.${c}`);
    d > 9
      ? (n = `${BigInt(o) + BigInt(1)}0`.padStart(o.length + 1, '0'))
      : (n = `${o}${d}`),
      n.length > e && ((n = n.slice(1)), (r = `${BigInt(r) + BigInt(1)}`)),
      (n = n.slice(0, e));
  } else n = n.padEnd(e, '0');
  return BigInt(`${s ? '-' : ''}${r}${n}`);
}
f();
Wa();
function Dl(t, e = 'wei') {
  return Mg(t, Ga[e]);
}
function e1(t) {
  return t.map(e => ({ ...e, value: BigInt(e.value) }));
}
function Ug(t) {
  return {
    ...t,
    balance: t.balance ? BigInt(t.balance) : void 0,
    nonce: t.nonce ? Ue(t.nonce) : void 0,
    storageProof: t.storageProof ? e1(t.storageProof) : void 0,
  };
}
async function Lg(
  t,
  { address: e, blockNumber: r, blockTag: n, storageKeys: s }
) {
  let o = n != null ? n : 'latest',
    i = r !== void 0 ? H(r) : void 0,
    c = await t.request({ method: 'eth_getProof', params: [e, s, i || o] });
  return Ug(c);
}
f();
se();
async function zg(
  t,
  { address: e, blockNumber: r, blockTag: n = 'latest', slot: s }
) {
  let o = r !== void 0 ? H(r) : void 0;
  return await t.request({
    method: 'eth_getStorageAt',
    params: [e, s, o || n],
  });
}
f();
Mr();
se();
async function Es(
  t,
  { blockHash: e, blockNumber: r, blockTag: n, hash: s, index: o }
) {
  var u, h, g;
  let i = n || 'latest',
    c = r !== void 0 ? H(r) : void 0,
    d = null;
  if (
    (s
      ? (d = await t.request(
          { method: 'eth_getTransactionByHash', params: [s] },
          { dedupe: true }
        ))
      : e
        ? (d = await t.request(
            {
              method: 'eth_getTransactionByBlockHashAndIndex',
              params: [e, H(o)],
            },
            { dedupe: true }
          ))
        : (d = await t.request(
            {
              method: 'eth_getTransactionByBlockNumberAndIndex',
              params: [c || i, H(o)],
            },
            { dedupe: !!c }
          )),
    !d)
  )
    throw new Co({
      blockHash: e,
      blockNumber: r,
      blockTag: i,
      hash: s,
      index: o,
    });
  return (
    ((g =
      (h = (u = t.chain) == null ? void 0 : u.formatters) == null
        ? void 0
        : h.transaction) == null
      ? void 0
      : g.format) || Tc
  )(d);
}
f();
async function _g(t, { hash: e, transactionReceipt: r }) {
  let [n, s] = await Promise.all([
      V(t, Er, 'getBlockNumber')({}),
      e ? V(t, Es, 'getTransaction')({ hash: e }) : void 0,
    ]),
    o =
      (r == null ? void 0 : r.blockNumber) ||
      (s == null ? void 0 : s.blockNumber);
  return o ? n - o + BigInt(1) : BigInt(0);
}
f();
Mr();
async function ki(t, { hash: e }) {
  var s, o, i;
  let r = await t.request(
    { method: 'eth_getTransactionReceipt', params: [e] },
    { dedupe: true }
  );
  if (!r) throw new Ao({ hash: e });
  return (
    ((i =
      (o = (s = t.chain) == null ? void 0 : s.formatters) == null
        ? void 0
        : o.transactionReceipt) == null
      ? void 0
      : i.format) || rg
  )(r);
}
f();
Pn();
$e();
ce();
un();
An();
yt();
ro();
async function Hg(t, e) {
  var P;
  let {
      allowFailure: r = true,
      batchSize: n,
      blockNumber: s,
      blockTag: o,
      multicallAddress: i,
      stateOverride: c,
    } = e,
    d = e.contracts,
    p =
      n != null
        ? n
        : (typeof ((P = t.batch) == null ? void 0 : P.multicall) == 'object' &&
            t.batch.multicall.batchSize) ||
          1024,
    u = i;
  if (!u) {
    if (!t.chain)
      throw new Error(
        'client chain not configured. multicallAddress is required.'
      );
    u = jt({ blockNumber: s, chain: t.chain, contract: 'multicall3' });
  }
  let h = [[]],
    g = 0,
    b = 0;
  for (let v = 0; v < d.length; v++) {
    let { abi: C, address: k, args: B, functionName: F } = d[v];
    try {
      let O = we({ abi: C, args: B, functionName: F });
      (b += (O.length - 2) / 2),
        p > 0 &&
          b > p &&
          h[g].length > 0 &&
          (g++, (b = (O.length - 2) / 2), (h[g] = [])),
        (h[g] = [...h[g], { allowFailure: true, callData: O, target: k }]);
    } catch (O) {
      let S = It(O, {
        abi: C,
        address: k,
        args: B,
        docsPath: '/docs/contract/multicall',
        functionName: F,
      });
      if (!r) throw S;
      h[g] = [...h[g], { allowFailure: true, callData: '0x', target: k }];
    }
  }
  let E = await Promise.allSettled(
      h.map(v =>
        V(
          t,
          nt,
          'readContract'
        )({
          abi: Ei,
          address: u,
          args: [v],
          blockNumber: s,
          blockTag: o,
          functionName: 'aggregate3',
          stateOverride: c,
        })
      )
    ),
    T = [];
  for (let v = 0; v < E.length; v++) {
    let C = E[v];
    if (C.status === 'rejected') {
      if (!r) throw C.reason;
      for (let B = 0; B < h[v].length; B++)
        T.push({ status: 'failure', error: C.reason, result: void 0 });
      continue;
    }
    let k = C.value;
    for (let B = 0; B < k.length; B++) {
      let { returnData: F, success: O } = k[B],
        { callData: S } = h[v][B],
        { abi: N, address: M, functionName: Z, args: G } = d[T.length];
      try {
        if (S === '0x') throw new Mt();
        if (!O) throw new br({ data: F });
        let J = wt({ abi: N, args: G, data: F, functionName: Z });
        T.push(r ? { result: J, status: 'success' } : J);
      } catch (J) {
        let te = It(J, {
          abi: N,
          address: M,
          args: G,
          docsPath: '/docs/contract/multicall',
          functionName: Z,
        });
        if (!r) throw te;
        T.push({ error: te, result: void 0, status: 'failure' });
      }
    }
  }
  if (T.length !== d.length) throw new I('multicall results mismatch');
  return T;
}
f();
f();
f();
f();
f();
f();
f();
var jg = '0.1.1';
function qg() {
  return jg;
}
var ge = class t extends Error {
  constructor(e, r = {}) {
    let n = (() => {
        var d;
        if (r.cause instanceof t) {
          if (r.cause.details) return r.cause.details;
          if (r.cause.shortMessage) return r.cause.shortMessage;
        }
        return (d = r.cause) != null && d.message ? r.cause.message : r.details;
      })(),
      s = (r.cause instanceof t && r.cause.docsPath) || r.docsPath,
      i = `https://oxlib.sh${s != null ? s : ''}`,
      c = [
        e || 'An error occurred.',
        ...(r.metaMessages ? ['', ...r.metaMessages] : []),
        ...(n || s
          ? ['', n ? `Details: ${n}` : void 0, s ? `See: ${i}` : void 0]
          : []),
      ].filter(d => typeof d == 'string').join(`
`);
    super(c, r.cause ? { cause: r.cause } : void 0),
      Object.defineProperty(this, 'details', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, 'docs', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, 'docsPath', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, 'shortMessage', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, 'cause', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, 'name', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 'BaseError',
      }),
      Object.defineProperty(this, 'version', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: `ox@${qg()}`,
      }),
      (this.cause = r.cause),
      (this.details = n),
      (this.docs = i),
      (this.docsPath = s),
      (this.shortMessage = e);
  }
  walk(e) {
    return Vg(this, e);
  }
};
function Vg(t, e) {
  return e != null && e(t)
    ? t
    : t && typeof t == 'object' && 'cause' in t && t.cause
      ? Vg(t.cause, e)
      : e
        ? null
        : t;
}
f();
var t1 = '#__bigint';
function Gg(t, e, r) {
  return JSON.stringify(
    t,
    (n, s) => (typeof s == 'bigint' ? s.toString() + t1 : s),
    r
  );
}
f();
function Wg(t, e) {
  if (Ml(t) > e) throw new bu({ givenSize: Ml(t), maxSize: e });
}
var Vr = { zero: 48, nine: 57, A: 65, F: 70, a: 97, f: 102 };
function Ul(t) {
  if (t >= Vr.zero && t <= Vr.nine) return t - Vr.zero;
  if (t >= Vr.A && t <= Vr.F) return t - (Vr.A - 10);
  if (t >= Vr.a && t <= Vr.f) return t - (Vr.a - 10);
}
function Zg(t, e = {}) {
  let { dir: r, size: n = 32 } = e;
  if (n === 0) return t;
  if (t.length > n)
    throw new xu({ size: t.length, targetSize: n, type: 'Bytes' });
  let s = new Uint8Array(n);
  for (let o = 0; o < n; o++) {
    let i = r === 'right';
    s[i ? o : n - o - 1] = t[i ? o : t.length - o - 1];
  }
  return s;
}
f();
function $i(t, e) {
  if (Xe(t) > e) throw new wu({ givenSize: Xe(t), maxSize: e });
}
function Kg(t, e) {
  if (typeof e == 'number' && e > 0 && e > Xe(t) - 1)
    throw new Bi({ offset: e, position: 'start', size: Xe(t) });
}
function Jg(t, e, r) {
  if (typeof e == 'number' && typeof r == 'number' && Xe(t) !== r - e)
    throw new Bi({ offset: r, position: 'end', size: Xe(t) });
}
function zl(t, e = {}) {
  let { dir: r, size: n = 32 } = e;
  if (n === 0) return t;
  let s = t.replace('0x', '');
  if (s.length > n * 2)
    throw new vu({ size: Math.ceil(s.length / 2), targetSize: n, type: 'Hex' });
  return `0x${s[r === 'right' ? 'padEnd' : 'padStart'](n * 2, '0')}`;
}
var o1 = new TextEncoder();
function Xg(t) {
  return t instanceof Uint8Array ? t : typeof t == 'string' ? i1(t) : s1(t);
}
function s1(t) {
  return t instanceof Uint8Array ? t : new Uint8Array(t);
}
function i1(t, e = {}) {
  let { size: r } = e,
    n = t;
  r && ($i(t, r), (n = Ar(t, r)));
  let s = n.slice(2);
  s.length % 2 && (s = `0${s}`);
  let o = s.length / 2,
    i = new Uint8Array(o);
  for (let c = 0, d = 0; c < o; c++) {
    let p = Ul(s.charCodeAt(d++)),
      u = Ul(s.charCodeAt(d++));
    if (p === void 0 || u === void 0)
      throw new ge(
        `Invalid byte sequence ("${s[d - 2]}${s[d - 1]}" in "${s}").`
      );
    i[c] = p * 16 + u;
  }
  return i;
}
function Qg(t, e = {}) {
  let { size: r } = e,
    n = o1.encode(t);
  return typeof r == 'number' ? (Wg(n, r), a1(n, r)) : n;
}
function a1(t, e) {
  return Zg(t, { dir: 'right', size: e });
}
function Ml(t) {
  return t.length;
}
var bu = class extends ge {
  constructor({ givenSize: e, maxSize: r }) {
    super(`Size cannot exceed \`${r}\` bytes. Given size: \`${e}\` bytes.`),
      Object.defineProperty(this, 'name', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 'Bytes.SizeOverflowError',
      });
  }
};
var xu = class extends ge {
  constructor({ size: e, targetSize: r, type: n }) {
    super(
      `${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} size (\`${e}\`) exceeds padding size (\`${r}\`).`
    ),
      Object.defineProperty(this, 'name', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 'Bytes.SizeExceedsPaddingSizeError',
      });
  }
};
var c1 = new TextEncoder(),
  u1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, '0'));
function d1(t, e = {}) {
  let { strict: r = false } = e;
  if (!t) throw new Tu(t);
  if (typeof t != 'string') throw new Tu(t);
  if (r && !/^0x[0-9a-fA-F]*$/.test(t)) throw new Eu(t);
  if (!t.startsWith('0x')) throw new Eu(t);
}
function vt(...t) {
  return `0x${t.reduce((e, r) => e + r.replace('0x', ''), '')}`;
}
function Cu(t, e = {}) {
  let r = `0x${Number(t)}`;
  return typeof e.size == 'number' ? ($i(r, e.size), Gr(r, e.size)) : r;
}
function Cs(t, e = {}) {
  let r = '';
  for (let s = 0; s < t.length; s++) r += u1[t[s]];
  let n = `0x${r}`;
  return typeof e.size == 'number' ? ($i(n, e.size), Ar(n, e.size)) : n;
}
function ze(t, e = {}) {
  let { signed: r, size: n } = e,
    s = BigInt(t),
    o;
  n
    ? r
      ? (o = (BigInt(1) << (BigInt(n) * BigInt(8) - BigInt(1))) - BigInt(1))
      : (o = BigInt(2) ** (BigInt(n) * BigInt(8)) - BigInt(1))
    : typeof t == 'number' && (o = BigInt(Number.MAX_SAFE_INTEGER));
  let i = typeof o == 'bigint' && r ? -o - BigInt(1) : 0;
  if ((o && s > o) || s < i) {
    let p = typeof t == 'bigint' ? 'n' : '';
    throw new Ii({
      max: o ? `${o}${p}` : void 0,
      min: `${i}${p}`,
      signed: r,
      size: n,
      value: `${t}${p}`,
    });
  }
  let d = `0x${(r && s < 0 ? (BigInt(1) << BigInt(n * 8)) + BigInt(s) : s).toString(16)}`;
  return n ? Gr(d, n) : d;
}
function As(t, e = {}) {
  return Cs(c1.encode(t), e);
}
function Gr(t, e) {
  return zl(t, { dir: 'left', size: e });
}
function Ar(t, e) {
  return zl(t, { dir: 'right', size: e });
}
function Ps(t, e, r, n = {}) {
  let { strict: s } = n;
  Kg(t, e);
  let o = `0x${t.replace('0x', '').slice((e != null ? e : 0) * 2, (r != null ? r : t.length) * 2)}`;
  return s && Jg(o, e, r), o;
}
function Xe(t) {
  return Math.ceil((t.length - 2) / 2);
}
function _l(t, e = {}) {
  let { strict: r = false } = e;
  try {
    return d1(t, { strict: r }), true;
  } catch {
    return false;
  }
}
var Ii = class extends ge {
  constructor({ max: e, min: r, signed: n, size: s, value: o }) {
    super(
      `Number \`${o}\` is not in safe${s ? ` ${s * 8}-bit` : ''}${n ? ' signed' : ' unsigned'} integer range ${e ? `(\`${r}\` to \`${e}\`)` : `(above \`${r}\`)`}`
    ),
      Object.defineProperty(this, 'name', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 'Hex.IntegerOutOfRangeError',
      });
  }
};
var Tu = class extends ge {
    constructor(e) {
      super(
        `Value \`${typeof e == 'object' ? Gg(e) : e}\` of type \`${typeof e}\` is an invalid hex type.`,
        { metaMessages: ['Hex types must be represented as `"0x${string}"`.'] }
      ),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'Hex.InvalidHexTypeError',
        });
    }
  },
  Eu = class extends ge {
    constructor(e) {
      super(`Value \`${e}\` is an invalid hex value.`, {
        metaMessages: [
          'Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).',
        ],
      }),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'Hex.InvalidHexValueError',
        });
    }
  };
var wu = class extends ge {
    constructor({ givenSize: e, maxSize: r }) {
      super(`Size cannot exceed \`${r}\` bytes. Given size: \`${e}\` bytes.`),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'Hex.SizeOverflowError',
        });
    }
  },
  Bi = class extends ge {
    constructor({ offset: e, position: r, size: n }) {
      super(
        `Slice ${r === 'start' ? 'starting' : 'ending'} at offset \`${e}\` is out-of-bounds (size: \`${n}\`).`
      ),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'Hex.SliceOffsetOutOfBoundsError',
        });
    }
  },
  vu = class extends ge {
    constructor({ size: e, targetSize: r, type: n }) {
      super(
        `${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} size (\`${e}\`) exceeds padding size (\`${r}\`).`
      ),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'Hex.SizeExceedsPaddingSizeError',
        });
    }
  };
f();
function e0(t) {
  return {
    address: t.address,
    amount: ze(t.amount),
    index: ze(t.index),
    validatorIndex: ze(t.validatorIndex),
  };
}
function t0(t) {
  return {
    ...(typeof t.baseFeePerGas == 'bigint' && {
      baseFeePerGas: ze(t.baseFeePerGas),
    }),
    ...(typeof t.blobBaseFee == 'bigint' && { blobBaseFee: ze(t.blobBaseFee) }),
    ...(typeof t.feeRecipient == 'string' && { feeRecipient: t.feeRecipient }),
    ...(typeof t.gasLimit == 'bigint' && { gasLimit: ze(t.gasLimit) }),
    ...(typeof t.number == 'bigint' && { number: ze(t.number) }),
    ...(typeof t.prevRandao == 'bigint' && { prevRandao: ze(t.prevRandao) }),
    ...(typeof t.time == 'bigint' && { time: ze(t.time) }),
    ...(t.withdrawals && { withdrawals: t.withdrawals.map(e0) }),
  };
}
Ne();
$e();
un();
Xn();
An();
yt();
se();
vi();
Qn();
xc();
Tn();
async function Si(t, e) {
  let {
    blockNumber: r,
    blockTag: n = 'latest',
    blocks: s,
    returnFullTransactions: o,
    traceTransfers: i,
    validation: c,
  } = e;
  try {
    let d = [];
    for (let g of s) {
      let b = g.blockOverrides ? t0(g.blockOverrides) : void 0,
        E = g.calls.map(P => {
          var B;
          let v = P,
            C = v.account ? ae(v.account) : void 0,
            k = {
              ...v,
              data: v.abi ? we(v) : v.data,
              from: (B = v.from) != null ? B : C == null ? void 0 : C.address,
            };
          return xt(k), _t(k);
        }),
        T = g.stateOverrides ? ss(g.stateOverrides) : void 0;
      d.push({ blockOverrides: b, calls: E, stateOverrides: T });
    }
    let u = (r ? H(r) : void 0) || n;
    return (
      await t.request({
        method: 'eth_simulateV1',
        params: [
          {
            blockStateCalls: d,
            returnFullTransactions: o,
            traceTransfers: i,
            validation: c,
          },
          u,
        ],
      })
    ).map((g, b) => ({
      ...Ec(g),
      calls: g.calls.map((E, T) => {
        var Z, G, J;
        let { abi: P, args: v, functionName: C, to: k } = s[b].calls[T],
          B =
            (G = (Z = E.error) == null ? void 0 : Z.data) != null
              ? G
              : E.returnData,
          F = BigInt(E.gasUsed),
          O = (J = E.logs) == null ? void 0 : J.map(te => ct(te)),
          S = E.status === '0x1' ? 'success' : 'failure',
          N =
            P && S === 'success' && B !== '0x'
              ? wt({ abi: P, data: B, functionName: C })
              : null,
          M = (() => {
            var z;
            if (S === 'success') return;
            let te;
            if (
              (((z = E.error) == null ? void 0 : z.data) === '0x'
                ? (te = new Mt())
                : E.error && (te = new br(E.error)),
              !!te)
            )
              return It(te, {
                abi: P != null ? P : [],
                address: k,
                args: v,
                functionName: C != null ? C : '<unknown>',
              });
          })();
        return {
          data: B,
          gasUsed: F,
          logs: O,
          status: S,
          ...(S === 'success' ? { result: N } : { error: M }),
        };
      }),
    }));
  } catch (d) {
    let p = d,
      u = wn(p, {});
    throw u instanceof zt ? p : u;
  }
}
f();
f();
f();
la();
f();
Cd();
function Au(t, e = {}) {
  let { as: r = typeof t == 'string' ? 'Hex' : 'Bytes' } = e,
    n = Da(Xg(t));
  return r === 'Bytes' ? n : Cs(n);
}
f();
f();
f();
f();
var Pu = class extends Map {
  constructor(e) {
    super(),
      Object.defineProperty(this, 'maxSize', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      (this.maxSize = e);
  }
  get(e) {
    let r = super.get(e);
    return super.has(e) && r !== void 0 && (this.delete(e), super.set(e, r)), r;
  }
  set(e, r) {
    if ((super.set(e, r), this.maxSize && this.size > this.maxSize)) {
      let n = this.keys().next().value;
      n && this.delete(n);
    }
    return this;
  }
};
var p1 = { checksum: new Pu(8192) },
  ku = p1.checksum;
var h1 = /^0x[a-fA-F0-9]{40}$/;
function ks(t, e = {}) {
  let { strict: r = true } = e;
  if (!h1.test(t)) throw new $u({ address: t, cause: new Hl() });
  if (r) {
    if (t.toLowerCase() === t) return;
    if (n0(t) !== t) throw new $u({ address: t, cause: new jl() });
  }
}
function n0(t) {
  if (ku.has(t)) return ku.get(t);
  ks(t, { strict: false });
  let e = t.substring(2).toLowerCase(),
    r = Au(Qg(e), { as: 'Bytes' }),
    n = e.split('');
  for (let o = 0; o < 40; o += 2)
    r[o >> 1] >> 4 >= 8 && n[o] && (n[o] = n[o].toUpperCase()),
      (r[o >> 1] & 15) >= 8 && n[o + 1] && (n[o + 1] = n[o + 1].toUpperCase());
  let s = `0x${n.join('')}`;
  return ku.set(t, s), s;
}
function Bu(t, e = {}) {
  let { strict: r = true } = e != null ? e : {};
  try {
    return ks(t, { strict: r }), true;
  } catch {
    return false;
  }
}
var $u = class extends ge {
    constructor({ address: e, cause: r }) {
      super(`Address "${e}" is invalid.`, { cause: r }),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'Address.InvalidAddressError',
        });
    }
  },
  Hl = class extends ge {
    constructor() {
      super('Address is not a 20 byte (40 hexadecimal character) value.'),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'Address.InvalidInputError',
        });
    }
  },
  jl = class extends ge {
    constructor() {
      super('Address does not match its checksum counterpart.'),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'Address.InvalidChecksumError',
        });
    }
  };
function Su(t) {
  let e = true,
    r = '',
    n = 0,
    s = '',
    o = false;
  for (let i = 0; i < t.length; i++) {
    let c = t[i];
    if (
      (['(', ')', ','].includes(c) && (e = true),
      c === '(' && n++,
      c === ')' && n--,
      !!e)
    ) {
      if (n === 0) {
        if (c === ' ' && ['event', 'function', 'error', ''].includes(s)) s = '';
        else if (((s += c), c === ')')) {
          o = true;
          break;
        }
        continue;
      }
      if (c === ' ') {
        t[i - 1] !== ',' && r !== ',' && r !== ',(' && ((r = ''), (e = false));
        continue;
      }
      (s += c), (r += c);
    }
  }
  if (!o) throw new ge('Unable to normalize signature.');
  return s;
}
function Iu(t, e) {
  let r = typeof t,
    n = e.type;
  switch (n) {
    case 'address':
      return Bu(t, { strict: false });
    case 'bool':
      return r === 'boolean';
    case 'function':
      return r === 'string';
    case 'string':
      return r === 'string';
    default:
      return n === 'tuple' && 'components' in e
        ? Object.values(e.components).every((s, o) =>
            Iu(Object.values(t)[o], s)
          )
        : /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(
              n
            )
          ? r === 'number' || r === 'bigint'
          : /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(n)
            ? r === 'string' || t instanceof Uint8Array
            : /[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(n)
              ? Array.isArray(t) &&
                t.every(s =>
                  Iu(s, { ...e, type: n.replace(/(\[[0-9]{0,}\])$/, '') })
                )
              : false;
  }
}
function Vl(t, e, r) {
  for (let n in t) {
    let s = t[n],
      o = e[n];
    if (
      s.type === 'tuple' &&
      o.type === 'tuple' &&
      'components' in s &&
      'components' in o
    )
      return Vl(s.components, o.components, r[n]);
    let i = [s.type, o.type];
    if (
      i.includes('address') && i.includes('bytes20')
        ? true
        : i.includes('address') && i.includes('string')
          ? Bu(r[n], { strict: false })
          : i.includes('address') && i.includes('bytes')
            ? Bu(r[n], { strict: false })
            : false
    )
      return i;
  }
}
function Ru(t, e = {}) {
  let { prepare: r = true } = e,
    n = Array.isArray(t) ? da(t) : typeof t == 'string' ? da(t) : t;
  return { ...n, ...(r ? { hash: $s(n) } : {}) };
}
function o0(t, e, r) {
  let { args: n = [], prepare: s = true } = r != null ? r : {},
    o = _l(e, { strict: false }),
    i = t.filter(p =>
      o
        ? p.type === 'function' || p.type === 'error'
          ? Wl(p) === Ps(e, 0, 4)
          : p.type === 'event'
            ? $s(p) === e
            : false
        : 'name' in p && p.name === e
    );
  if (i.length === 0) throw new oo({ name: e });
  if (i.length === 1) return { ...i[0], ...(s ? { hash: $s(i[0]) } : {}) };
  let c;
  for (let p of i) {
    if (!('inputs' in p)) continue;
    if (!n || n.length === 0) {
      if (!p.inputs || p.inputs.length === 0)
        return { ...p, ...(s ? { hash: $s(p) } : {}) };
      continue;
    }
    if (!p.inputs || p.inputs.length === 0 || p.inputs.length !== n.length)
      continue;
    if (
      n.every((h, g) => {
        let b = 'inputs' in p && p.inputs[g];
        return b ? Iu(h, b) : false;
      })
    ) {
      if (c && 'inputs' in c && c.inputs) {
        let h = Vl(p.inputs, c.inputs, n);
        if (h)
          throw new Gl({ abiItem: p, type: h[0] }, { abiItem: c, type: h[1] });
      }
      c = p;
    }
  }
  let d = (() => {
    if (c) return c;
    let [p, ...u] = i;
    return { ...p, overloads: u };
  })();
  if (!d) throw new oo({ name: e });
  return { ...d, ...(s ? { hash: $s(d) } : {}) };
}
function Wl(t) {
  return Ps($s(t), 0, 4);
}
function y1(t) {
  let e = typeof t == 'string' ? t : Dn(t);
  return Su(e);
}
function $s(t) {
  return typeof t != 'string' && 'hash' in t && t.hash ? t.hash : Au(As(y1(t)));
}
var Gl = class extends ge {
    constructor(e, r) {
      super('Found ambiguous types in overloaded ABI Items.', {
        metaMessages: [
          `\`${e.type}\` in \`${Su(Dn(e.abiItem))}\`, and`,
          `\`${r.type}\` in \`${Su(Dn(r.abiItem))}\``,
          '',
          'These types encode differently and cannot be distinguished at runtime.',
          'Remove one of the ambiguous items in the ABI.',
        ],
      }),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'AbiItem.AmbiguityError',
        });
    }
  },
  oo = class extends ge {
    constructor({ name: e, data: r, type: n = 'item' }) {
      let s = e ? ` with name "${e}"` : r ? ` with data "${r}"` : '';
      super(`ABI ${n}${s} not found.`),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'AbiItem.NotFoundError',
        });
    }
  };
f();
f();
var i0 = /^(.*)\[([0-9]*)\]$/,
  a0 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/,
  Nu =
    /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
BigInt(2) ** (BigInt(8) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(16) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(24) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(32) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(40) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(48) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(56) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(64) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(72) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(80) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(88) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(96) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(104) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(112) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(120) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(128) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(136) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(144) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(152) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(160) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(168) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(176) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(184) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(192) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(200) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(208) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(216) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(224) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(232) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(240) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(248) - BigInt(1)) - BigInt(1);
BigInt(2) ** (BigInt(256) - BigInt(1)) - BigInt(1);
-(BigInt(2) ** (BigInt(8) - BigInt(1)));
-(BigInt(2) ** (BigInt(16) - BigInt(1)));
-(BigInt(2) ** (BigInt(24) - BigInt(1)));
-(BigInt(2) ** (BigInt(32) - BigInt(1)));
-(BigInt(2) ** (BigInt(40) - BigInt(1)));
-(BigInt(2) ** (BigInt(48) - BigInt(1)));
-(BigInt(2) ** (BigInt(56) - BigInt(1)));
-(BigInt(2) ** (BigInt(64) - BigInt(1)));
-(BigInt(2) ** (BigInt(72) - BigInt(1)));
-(BigInt(2) ** (BigInt(80) - BigInt(1)));
-(BigInt(2) ** (BigInt(88) - BigInt(1)));
-(BigInt(2) ** (BigInt(96) - BigInt(1)));
-(BigInt(2) ** (BigInt(104) - BigInt(1)));
-(BigInt(2) ** (BigInt(112) - BigInt(1)));
-(BigInt(2) ** (BigInt(120) - BigInt(1)));
-(BigInt(2) ** (BigInt(128) - BigInt(1)));
-(BigInt(2) ** (BigInt(136) - BigInt(1)));
-(BigInt(2) ** (BigInt(144) - BigInt(1)));
-(BigInt(2) ** (BigInt(152) - BigInt(1)));
-(BigInt(2) ** (BigInt(160) - BigInt(1)));
-(BigInt(2) ** (BigInt(168) - BigInt(1)));
-(BigInt(2) ** (BigInt(176) - BigInt(1)));
-(BigInt(2) ** (BigInt(184) - BigInt(1)));
-(BigInt(2) ** (BigInt(192) - BigInt(1)));
-(BigInt(2) ** (BigInt(200) - BigInt(1)));
-(BigInt(2) ** (BigInt(208) - BigInt(1)));
-(BigInt(2) ** (BigInt(216) - BigInt(1)));
-(BigInt(2) ** (BigInt(224) - BigInt(1)));
-(BigInt(2) ** (BigInt(232) - BigInt(1)));
-(BigInt(2) ** (BigInt(240) - BigInt(1)));
-(BigInt(2) ** (BigInt(248) - BigInt(1)));
-(BigInt(2) ** (BigInt(256) - BigInt(1)));
BigInt(2) ** BigInt(8) - BigInt(1);
BigInt(2) ** BigInt(16) - BigInt(1);
BigInt(2) ** BigInt(24) - BigInt(1);
BigInt(2) ** BigInt(32) - BigInt(1);
BigInt(2) ** BigInt(40) - BigInt(1);
BigInt(2) ** BigInt(48) - BigInt(1);
BigInt(2) ** BigInt(56) - BigInt(1);
BigInt(2) ** BigInt(64) - BigInt(1);
BigInt(2) ** BigInt(72) - BigInt(1);
BigInt(2) ** BigInt(80) - BigInt(1);
BigInt(2) ** BigInt(88) - BigInt(1);
BigInt(2) ** BigInt(96) - BigInt(1);
BigInt(2) ** BigInt(104) - BigInt(1);
BigInt(2) ** BigInt(112) - BigInt(1);
BigInt(2) ** BigInt(120) - BigInt(1);
BigInt(2) ** BigInt(128) - BigInt(1);
BigInt(2) ** BigInt(136) - BigInt(1);
BigInt(2) ** BigInt(144) - BigInt(1);
BigInt(2) ** BigInt(152) - BigInt(1);
BigInt(2) ** BigInt(160) - BigInt(1);
BigInt(2) ** BigInt(168) - BigInt(1);
BigInt(2) ** BigInt(176) - BigInt(1);
BigInt(2) ** BigInt(184) - BigInt(1);
BigInt(2) ** BigInt(192) - BigInt(1);
BigInt(2) ** BigInt(200) - BigInt(1);
BigInt(2) ** BigInt(208) - BigInt(1);
BigInt(2) ** BigInt(216) - BigInt(1);
BigInt(2) ** BigInt(224) - BigInt(1);
BigInt(2) ** BigInt(232) - BigInt(1);
BigInt(2) ** BigInt(240) - BigInt(1);
BigInt(2) ** BigInt(248) - BigInt(1);
BigInt(2) ** BigInt(256) - BigInt(1);
f();
function c0({ checksumAddress: t, parameters: e, values: r }) {
  let n = [];
  for (let s = 0; s < e.length; s++)
    n.push(Zl({ checksumAddress: t, parameter: e[s], value: r[s] }));
  return n;
}
function Zl({ checksumAddress: t = false, parameter: e, value: r }) {
  var o;
  let n = e,
    s = P1(n.type);
  if (s) {
    let [i, c] = s;
    return w1(r, {
      checksumAddress: t,
      length: i,
      parameter: { ...n, type: c },
    });
  }
  if (n.type === 'tuple') return A1(r, { checksumAddress: t, parameter: n });
  if (n.type === 'address') return x1(r, { checksum: t });
  if (n.type === 'bool') return T1(r);
  if (n.type.startsWith('uint') || n.type.startsWith('int')) {
    let i = n.type.startsWith('int'),
      [, , c = '256'] = (o = Nu.exec(n.type)) != null ? o : [];
    return E1(r, { signed: i, size: Number(c) });
  }
  if (n.type.startsWith('bytes')) return v1(r, { type: n.type });
  if (n.type === 'string') return C1(r);
  throw new Ni(n.type);
}
function Fu(t) {
  let e = 0;
  for (let o = 0; o < t.length; o++) {
    let { dynamic: i, encoded: c } = t[o];
    i ? (e += 32) : (e += Xe(c));
  }
  let r = [],
    n = [],
    s = 0;
  for (let o = 0; o < t.length; o++) {
    let { dynamic: i, encoded: c } = t[o];
    i ? (r.push(ze(e + s, { size: 32 })), n.push(c), (s += Xe(c))) : r.push(c);
  }
  return vt(...r, ...n);
}
function x1(t, e) {
  let { checksum: r = false } = e;
  return ks(t, { strict: r }), { dynamic: false, encoded: Gr(t.toLowerCase()) };
}
function w1(t, e) {
  let { checksumAddress: r, length: n, parameter: s } = e,
    o = n === null;
  if (!Array.isArray(t)) throw new Du(t);
  if (!o && t.length !== n)
    throw new Ou({
      expectedLength: n,
      givenLength: t.length,
      type: `${s.type}[${n}]`,
    });
  let i = false,
    c = [];
  for (let d = 0; d < t.length; d++) {
    let p = Zl({ checksumAddress: r, parameter: s, value: t[d] });
    p.dynamic && (i = true), c.push(p);
  }
  if (o || i) {
    let d = Fu(c);
    if (o) {
      let p = ze(c.length, { size: 32 });
      return { dynamic: true, encoded: c.length > 0 ? vt(p, d) : p };
    }
    if (i) return { dynamic: true, encoded: d };
  }
  return { dynamic: false, encoded: vt(...c.map(({ encoded: d }) => d)) };
}
function v1(t, { type: e }) {
  let [, r] = e.split('bytes'),
    n = Xe(t);
  if (!r) {
    let s = t;
    return (
      n % 32 !== 0 && (s = Ar(s, Math.ceil((t.length - 2) / 2 / 32) * 32)),
      { dynamic: true, encoded: vt(Gr(ze(n, { size: 32 })), s) }
    );
  }
  if (n !== Number.parseInt(r))
    throw new Ri({ expectedSize: Number.parseInt(r), value: t });
  return { dynamic: false, encoded: Ar(t) };
}
function T1(t) {
  if (typeof t != 'boolean')
    throw new ge(
      `Invalid boolean value: "${t}" (type: ${typeof t}). Expected: \`true\` or \`false\`.`
    );
  return { dynamic: false, encoded: Gr(Cu(t)) };
}
function E1(t, { signed: e, size: r }) {
  if (typeof r == 'number') {
    let n = BigInt(2) ** (BigInt(r) - (e ? BigInt(1) : BigInt(0))) - BigInt(1),
      s = e ? -n - BigInt(1) : BigInt(0);
    if (t > n || t < s)
      throw new Ii({
        max: n.toString(),
        min: s.toString(),
        signed: e,
        size: r / 8,
        value: t.toString(),
      });
  }
  return { dynamic: false, encoded: ze(t, { size: 32, signed: e }) };
}
function C1(t) {
  let e = As(t),
    r = Math.ceil(Xe(e) / 32),
    n = [];
  for (let s = 0; s < r; s++) n.push(Ar(Ps(e, s * 32, (s + 1) * 32)));
  return { dynamic: true, encoded: vt(Ar(ze(Xe(e), { size: 32 })), ...n) };
}
function A1(t, e) {
  let { checksumAddress: r, parameter: n } = e,
    s = false,
    o = [];
  for (let i = 0; i < n.components.length; i++) {
    let c = n.components[i],
      d = Array.isArray(t) ? i : c.name,
      p = Zl({ checksumAddress: r, parameter: c, value: t[d] });
    o.push(p), p.dynamic && (s = true);
  }
  return {
    dynamic: s,
    encoded: s ? Fu(o) : vt(...o.map(({ encoded: i }) => i)),
  };
}
function P1(t) {
  let e = t.match(/^(.*)\[(\d+)?\]$/);
  return e ? [e[2] ? Number(e[2]) : null, e[1]] : void 0;
}
function Uu(t, e, r) {
  let { checksumAddress: n = false } = {};
  if (t.length !== e.length)
    throw new Mu({ expectedLength: t.length, givenLength: e.length });
  let s = c0({ checksumAddress: n, parameters: t, values: e }),
    o = Fu(s);
  return o.length === 0 ? '0x' : o;
}
function Jl(t, e) {
  if (t.length !== e.length)
    throw new Mu({ expectedLength: t.length, givenLength: e.length });
  let r = [];
  for (let n = 0; n < t.length; n++) {
    let s = t[n],
      o = e[n];
    r.push(Jl.encode(s, o));
  }
  return vt(...r);
}
(function (t) {
  function e(r, n, s = false) {
    if (r === 'address') {
      let d = n;
      return ks(d), Gr(d.toLowerCase(), s ? 32 : 0);
    }
    if (r === 'string') return As(n);
    if (r === 'bytes') return n;
    if (r === 'bool') return Gr(Cu(n), s ? 32 : 1);
    let o = r.match(Nu);
    if (o) {
      let [d, p, u = '256'] = o,
        h = Number.parseInt(u) / 8;
      return ze(n, { size: s ? 32 : h, signed: p === 'int' });
    }
    let i = r.match(a0);
    if (i) {
      let [d, p] = i;
      if (Number.parseInt(p) !== (n.length - 2) / 2)
        throw new Ri({ expectedSize: Number.parseInt(p), value: n });
      return Ar(n, s ? 32 : 0);
    }
    let c = r.match(i0);
    if (c && Array.isArray(n)) {
      let [d, p] = c,
        u = [];
      for (let h = 0; h < n.length; h++) u.push(e(p, n[h], true));
      return u.length === 0 ? '0x' : vt(...u);
    }
    throw new Ni(r);
  }
  t.encode = e;
})(Jl || (Jl = {}));
var Ou = class extends ge {
    constructor({ expectedLength: e, givenLength: r, type: n }) {
      super(
        `Array length mismatch for type \`${n}\`. Expected: \`${e}\`. Given: \`${r}\`.`
      ),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'AbiParameters.ArrayLengthMismatchError',
        });
    }
  },
  Ri = class extends ge {
    constructor({ expectedSize: e, value: r }) {
      super(
        `Size of bytes "${r}" (bytes${Xe(r)}) does not match expected size (bytes${e}).`
      ),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'AbiParameters.BytesSizeMismatchError',
        });
    }
  },
  Mu = class extends ge {
    constructor({ expectedLength: e, givenLength: r }) {
      super(
        [
          'ABI encoding parameters/values length mismatch.',
          `Expected length (parameters): ${e}`,
          `Given length (values): ${r}`,
        ].join(`
`)
      ),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'AbiParameters.LengthMismatchError',
        });
    }
  },
  Du = class extends ge {
    constructor(e) {
      super(`Value \`${e}\` is not a valid array.`),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'AbiParameters.InvalidArrayError',
        });
    }
  },
  Ni = class extends ge {
    constructor(e) {
      super(`Type \`${e}\` is not a valid ABI Type.`),
        Object.defineProperty(this, 'name', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 'AbiParameters.InvalidTypeError',
        });
    }
  };
function u0(t, e) {
  var s;
  let { bytecode: r, args: n } = e;
  return vt(
    r,
    (s = t.inputs) != null && s.length && n != null && n.length
      ? Uu(t.inputs, n)
      : '0x'
  );
}
function d0(t) {
  return Ru(t);
}
f();
function l0(t, ...e) {
  let { overloads: r } = t,
    n = r ? I1([t, ...r], t.name, { args: e[0] }) : t,
    s = S1(n),
    o = e.length > 0 ? Uu(n.inputs, e[0]) : void 0;
  return o ? vt(s, o) : s;
}
function so(t, e = {}) {
  return Ru(t, e);
}
function I1(t, e, r) {
  let n = o0(t, e, r);
  if (n.type !== 'function') throw new oo({ name: e, type: 'function' });
  return n;
}
function S1(t) {
  return Wl(t);
}
Ne();
f();
var f0 = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  ar = '0x0000000000000000000000000000000000000000';
Fc();
ce();
yt();
var N1 =
  '0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033';
async function p0(t, e) {
  var de, be, xe, Oe, Ze, Ie, Ct, At;
  let {
      blockNumber: r,
      blockTag: n,
      calls: s,
      stateOverrides: o,
      traceAssetChanges: i,
      traceTransfers: c,
      validation: d,
    } = e,
    p = e.account ? ae(e.account) : void 0;
  if (i && !p)
    throw new I('`account` is required when `traceAssetChanges` is true');
  let u = p
      ? u0(d0('constructor(bytes, bytes)'), {
          bytecode: Nc,
          args: [N1, l0(so('function getBalance(address)'), [p.address])],
        })
      : void 0,
    h = i
      ? await Promise.all(
          e.calls.map(async ne => {
            if (!ne.data && !ne.abi) return;
            let { accessList: Te } = await iu(t, {
              account: p.address,
              ...ne,
              data: ne.abi ? we(ne) : ne.data,
            });
            return Te.map(({ address: mt, storageKeys: Nt }) =>
              Nt.length > 0 ? mt : null
            );
          })
        ).then(ne => ne.flat().filter(Boolean))
      : [],
    g =
      o == null
        ? void 0
        : o.map(ne =>
            ne.address === (p == null ? void 0 : p.address)
              ? { ...ne, nonce: 0 }
              : ne
          ),
    b = await Si(t, {
      blockNumber: r,
      blockTag: n,
      blocks: [
        ...(i
          ? [
              { calls: [{ data: u }], stateOverrides: o },
              {
                calls: h.map((ne, Te) => ({
                  abi: [so('function balanceOf(address) returns (uint256)')],
                  functionName: 'balanceOf',
                  args: [p.address],
                  to: ne,
                  from: ar,
                  nonce: Te,
                })),
                stateOverrides: [{ address: ar, nonce: 0 }],
              },
            ]
          : []),
        {
          calls: [...s, {}].map((ne, Te) => ({
            ...ne,
            from: p == null ? void 0 : p.address,
            nonce: Te,
          })),
          stateOverrides: g,
        },
        ...(i
          ? [
              { calls: [{ data: u }] },
              {
                calls: h.map((ne, Te) => ({
                  abi: [so('function balanceOf(address) returns (uint256)')],
                  functionName: 'balanceOf',
                  args: [p.address],
                  to: ne,
                  from: ar,
                  nonce: Te,
                })),
                stateOverrides: [{ address: ar, nonce: 0 }],
              },
              {
                calls: h.map((ne, Te) => ({
                  to: ne,
                  abi: [so('function decimals() returns (uint256)')],
                  functionName: 'decimals',
                  from: ar,
                  nonce: Te,
                })),
                stateOverrides: [{ address: ar, nonce: 0 }],
              },
              {
                calls: h.map((ne, Te) => ({
                  to: ne,
                  abi: [so('function tokenURI(uint256) returns (string)')],
                  functionName: 'tokenURI',
                  args: [BigInt(0)],
                  from: ar,
                  nonce: Te,
                })),
                stateOverrides: [{ address: ar, nonce: 0 }],
              },
              {
                calls: h.map((ne, Te) => ({
                  to: ne,
                  abi: [so('function symbol() returns (string)')],
                  functionName: 'symbol',
                  from: ar,
                  nonce: Te,
                })),
                stateOverrides: [{ address: ar, nonce: 0 }],
              },
            ]
          : []),
      ],
      traceTransfers: c,
      validation: d,
    }),
    E = i ? b[2] : b[0],
    [T, P, , v, C, k, B, F] = i ? b : [],
    { calls: O, ...S } = E,
    N = (de = O.slice(0, -1)) != null ? de : [],
    M = (be = T == null ? void 0 : T.calls) != null ? be : [],
    Z = (xe = P == null ? void 0 : P.calls) != null ? xe : [],
    G = [...M, ...Z].map(ne => (ne.status === 'success' ? Me(ne.data) : null)),
    J = (Oe = v == null ? void 0 : v.calls) != null ? Oe : [],
    te = (Ze = C == null ? void 0 : C.calls) != null ? Ze : [],
    z = [...J, ...te].map(ne => (ne.status === 'success' ? Me(ne.data) : null)),
    q = ((Ie = k == null ? void 0 : k.calls) != null ? Ie : []).map(ne =>
      ne.status === 'success' ? ne.result : null
    ),
    j = ((Ct = F == null ? void 0 : F.calls) != null ? Ct : []).map(ne =>
      ne.status === 'success' ? ne.result : null
    ),
    ee = ((At = B == null ? void 0 : B.calls) != null ? At : []).map(ne =>
      ne.status === 'success' ? ne.result : null
    ),
    re = [];
  for (let [ne, Te] of z.entries()) {
    let mt = G[ne];
    if (typeof Te != 'bigint' || typeof mt != 'bigint') continue;
    let Nt = q[ne - 1],
      Gt = j[ne - 1],
      Wt = ee[ne - 1],
      cr =
        ne === 0
          ? { address: f0, decimals: 18, symbol: 'ETH' }
          : {
              address: h[ne - 1],
              decimals: Wt || Nt ? Number(Nt != null ? Nt : 1) : void 0,
              symbol: Gt != null ? Gt : void 0,
            };
    re.some(Br => Br.token.address === cr.address) ||
      re.push({ token: cr, value: { pre: mt, post: Te, diff: Te - mt } });
  }
  return { assetChanges: re, block: S, results: N };
}
f();
f();
Pn();
Fc();
un();
Uc();
on();
ds();
Kt();
se();
f();
fl();
dt();
Ke();
function m0({ r: t, s: e, to: r = 'hex', v: n, yParity: s }) {
  let o = (() => {
      if (s === 0 || s === 1) return s;
      if (n && (n === BigInt(27) || n === BigInt(28) || n >= BigInt(35)))
        return n % BigInt(2) === BigInt(0) ? 1 : 0;
      throw new Error('Invalid `v` or `yParity` value');
    })(),
    i = `0x${new Yn.Signature(Me(t), Me(e)).toCompactHex()}${o === 0 ? '1b' : '1c'}`;
  return r === 'hex' ? i : je(i);
}
gs();
async function Bs(t, e) {
  var h, g, b;
  let {
      address: r,
      factory: n,
      factoryData: s,
      hash: o,
      signature: i,
      universalSignatureVerifierAddress: c = (b =
        (g = (h = t.chain) == null ? void 0 : h.contracts) == null
          ? void 0
          : g.universalSignatureVerifier) == null
        ? void 0
        : b.address,
      ...d
    } = e,
    p = Re(i)
      ? i
      : typeof i == 'object' && 'r' in i && 's' in i
        ? m0(i)
        : me(i),
    u = await (async () =>
      (!n && !s) || Og(p) ? p : Dg({ address: n, data: s, signature: p }))();
  try {
    let E = c
        ? {
            to: c,
            data: we({ abi: xl, functionName: 'isValidSig', args: [r, o, u] }),
            ...d,
          }
        : { data: to({ abi: xl, args: [r, o, u], bytecode: Uh }), ...d },
      { data: T } = await V(t, Tr, 'call')(E);
    return wd(T != null ? T : '0x0');
  } catch (E) {
    try {
      if (vr(ii(r), await gc({ hash: o, signature: i }))) return true;
    } catch {}
    if (E instanceof Po) return false;
    throw E;
  }
}
async function h0(
  t,
  { address: e, message: r, factory: n, factoryData: s, signature: o, ...i }
) {
  let c = hu(r);
  return Bs(t, {
    address: e,
    factory: n,
    factoryData: s,
    hash: c,
    signature: o,
    ...i,
  });
}
f();
async function g0(t, e) {
  let {
      address: r,
      factory: n,
      factoryData: s,
      signature: o,
      message: i,
      primaryType: c,
      types: d,
      domain: p,
      ...u
    } = e,
    h = kg({ message: i, primaryType: c, types: d, domain: p });
  return Bs(t, {
    address: r,
    factory: n,
    factoryData: s,
    hash: h,
    signature: o,
    ...u,
  });
}
f();
Mr();
zc();
st();
f();
dt();
st();
function Lu(
  t,
  {
    emitOnBegin: e = false,
    emitMissed: r = false,
    onBlockNumber: n,
    onError: s,
    poll: o,
    pollingInterval: i = t.pollingInterval,
  }
) {
  let c =
      typeof o != 'undefined'
        ? o
        : !(
            t.transport.type === 'webSocket' ||
            (t.transport.type === 'fallback' &&
              t.transport.transports[0].config.type === 'webSocket')
          ),
    d;
  return c
    ? (() => {
        let h = ue(['watchBlockNumber', t.uid, e, r, i]);
        return ut(h, { onBlockNumber: n, onError: s }, g =>
          qt(
            async () => {
              var b;
              try {
                let E = await V(t, Er, 'getBlockNumber')({ cacheTime: 0 });
                if (d) {
                  if (E === d) return;
                  if (E - d > 1 && r)
                    for (let T = d + BigInt(1); T < E; T++)
                      g.onBlockNumber(T, d), (d = T);
                }
                (!d || E > d) && (g.onBlockNumber(E, d), (d = E));
              } catch (E) {
                (b = g.onError) == null || b.call(g, E);
              }
            },
            { emitOnBegin: e, interval: i }
          )
        );
      })()
    : (() => {
        let h = ue(['watchBlockNumber', t.uid, e, r]);
        return ut(h, { onBlockNumber: n, onError: s }, g => {
          let b = true,
            E = () => (b = false);
          return (
            (async () => {
              try {
                let T = (() => {
                    if (t.transport.type === 'fallback') {
                      let v = t.transport.transports.find(
                        C => C.config.type === 'webSocket'
                      );
                      return v ? v.value : t.transport;
                    }
                    return t.transport;
                  })(),
                  { unsubscribe: P } = await T.subscribe({
                    params: ['newHeads'],
                    onData(v) {
                      var k;
                      if (!b) return;
                      let C = Me((k = v.result) == null ? void 0 : k.number);
                      g.onBlockNumber(C, d), (d = C);
                    },
                    onError(v) {
                      var C;
                      (C = g.onError) == null || C.call(g, v);
                    },
                  });
                (E = P), b || E();
              } catch (T) {
                s == null || s(T);
              }
            })(),
            () => E()
          );
        });
      })();
}
async function y0(
  t,
  {
    confirmations: e = 1,
    hash: r,
    onReplaced: n,
    pollingInterval: s = t.pollingInterval,
    retryCount: o = 6,
    retryDelay: i = ({ count: d }) => ~~(1 << d) * 200,
    timeout: c = 18e4,
  }
) {
  let d = ue(['waitForTransactionReceipt', t.uid, r]),
    p,
    u,
    h,
    g = false,
    { promise: b, resolve: E, reject: T } = ms(),
    P = c ? setTimeout(() => T(new ec({ hash: r })), c) : void 0,
    v = ut(d, { onReplaced: n, resolve: E, reject: T }, C => {
      let k = V(
        t,
        Lu,
        'watchBlockNumber'
      )({
        emitMissed: true,
        emitOnBegin: true,
        poll: true,
        pollingInterval: s,
        async onBlockNumber(B) {
          let F = S => {
              clearTimeout(P), k(), S(), v();
            },
            O = B;
          if (!g)
            try {
              if (h) {
                if (
                  e > 1 &&
                  (!h.blockNumber || O - h.blockNumber + BigInt(1) < e)
                )
                  return;
                F(() => C.resolve(h));
                return;
              }
              if (
                (p ||
                  ((g = true),
                  await Pi(
                    async () => {
                      (p = await V(t, Es, 'getTransaction')({ hash: r })),
                        p.blockNumber && (O = p.blockNumber);
                    },
                    { delay: i, retryCount: o }
                  ),
                  (g = false)),
                (h = await V(t, ki, 'getTransactionReceipt')({ hash: r })),
                e > 1 && (!h.blockNumber || O - h.blockNumber + BigInt(1) < e))
              )
                return;
              F(() => C.resolve(h));
            } catch (S) {
              if (S instanceof Co || S instanceof Ao) {
                if (!p) {
                  g = false;
                  return;
                }
                try {
                  (u = p), (g = true);
                  let N = await Pi(
                    () =>
                      V(
                        t,
                        at,
                        'getBlock'
                      )({ blockNumber: O, includeTransactions: true }),
                    {
                      delay: i,
                      retryCount: o,
                      shouldRetry: ({ error: G }) => G instanceof is,
                    }
                  );
                  g = false;
                  let M = N.transactions.find(
                    ({ from: G, nonce: J }) => G === u.from && J === u.nonce
                  );
                  if (
                    !M ||
                    ((h = await V(
                      t,
                      ki,
                      'getTransactionReceipt'
                    )({ hash: M.hash })),
                    e > 1 &&
                      (!h.blockNumber || O - h.blockNumber + BigInt(1) < e))
                  )
                    return;
                  let Z = 'replaced';
                  M.to === u.to && M.value === u.value && M.input === u.input
                    ? (Z = 'repriced')
                    : M.from === M.to &&
                      M.value === BigInt(0) &&
                      (Z = 'cancelled'),
                    F(() => {
                      var G;
                      (G = C.onReplaced) == null ||
                        G.call(C, {
                          reason: Z,
                          replacedTransaction: u,
                          transaction: M,
                          transactionReceipt: h,
                        }),
                        C.resolve(h);
                    });
                } catch (N) {
                  F(() => C.reject(N));
                }
              } else F(() => C.reject(S));
            }
        },
      });
    });
  return b;
}
f();
st();
function b0(
  t,
  {
    blockTag: e = 'latest',
    emitMissed: r = false,
    emitOnBegin: n = false,
    onBlock: s,
    onError: o,
    includeTransactions: i,
    poll: c,
    pollingInterval: d = t.pollingInterval,
  }
) {
  let p =
      typeof c != 'undefined'
        ? c
        : !(
            t.transport.type === 'webSocket' ||
            (t.transport.type === 'fallback' &&
              t.transport.transports[0].config.type === 'webSocket')
          ),
    u = i != null ? i : false,
    h;
  return p
    ? (() => {
        let E = ue(['watchBlocks', t.uid, e, r, n, u, d]);
        return ut(E, { onBlock: s, onError: o }, T =>
          qt(
            async () => {
              var P;
              try {
                let v = await V(
                  t,
                  at,
                  'getBlock'
                )({ blockTag: e, includeTransactions: u });
                if (
                  v.number !== null &&
                  (h == null ? void 0 : h.number) != null
                ) {
                  if (v.number === h.number) return;
                  if (v.number - h.number > 1 && r)
                    for (
                      let C = (h == null ? void 0 : h.number) + BigInt(1);
                      C < v.number;
                      C++
                    ) {
                      let k = await V(
                        t,
                        at,
                        'getBlock'
                      )({ blockNumber: C, includeTransactions: u });
                      T.onBlock(k, h), (h = k);
                    }
                }
                ((h == null ? void 0 : h.number) == null ||
                  (e === 'pending' &&
                    (v == null ? void 0 : v.number) == null) ||
                  (v.number !== null && v.number > h.number)) &&
                  (T.onBlock(v, h), (h = v));
              } catch (v) {
                (P = T.onError) == null || P.call(T, v);
              }
            },
            { emitOnBegin: n, interval: d }
          )
        );
      })()
    : (() => {
        let E = true,
          T = true,
          P = () => (E = false);
        return (
          (async () => {
            try {
              n &&
                V(
                  t,
                  at,
                  'getBlock'
                )({ blockTag: e, includeTransactions: u }).then(k => {
                  E && T && (s(k, void 0), (T = false));
                });
              let v = (() => {
                  if (t.transport.type === 'fallback') {
                    let k = t.transport.transports.find(
                      B => B.config.type === 'webSocket'
                    );
                    return k ? k.value : t.transport;
                  }
                  return t.transport;
                })(),
                { unsubscribe: C } = await v.subscribe({
                  params: ['newHeads'],
                  async onData(k) {
                    if (!E) return;
                    let B = await V(
                      t,
                      at,
                      'getBlock'
                    )({
                      blockNumber: k.blockNumber,
                      includeTransactions: u,
                    }).catch(() => {});
                    E && (s(B, h), (T = false), (h = B));
                  },
                  onError(k) {
                    o == null || o(k);
                  },
                });
              (P = C), E || P();
            } catch (v) {
              o == null || o(v);
            }
          })(),
          () => P()
        );
      })();
}
f();
st();
$e();
pi();
function x0(
  t,
  {
    address: e,
    args: r,
    batch: n = true,
    event: s,
    events: o,
    fromBlock: i,
    onError: c,
    onLogs: d,
    poll: p,
    pollingInterval: u = t.pollingInterval,
    strict: h,
  }
) {
  let g =
      typeof p != 'undefined'
        ? p
        : typeof i == 'bigint'
          ? true
          : !(
              t.transport.type === 'webSocket' ||
              (t.transport.type === 'fallback' &&
                t.transport.transports[0].config.type === 'webSocket')
            ),
    b = h != null ? h : false;
  return g
    ? (() => {
        let P = ue(['watchEvent', e, r, n, t.uid, s, u, i]);
        return ut(P, { onLogs: d, onError: c }, v => {
          let C;
          i !== void 0 && (C = i - BigInt(1));
          let k,
            B = false,
            F = qt(
              async () => {
                var O;
                if (!B) {
                  try {
                    k = await V(
                      t,
                      au,
                      'createEventFilter'
                    )({
                      address: e,
                      args: r,
                      event: s,
                      events: o,
                      strict: b,
                      fromBlock: i,
                    });
                  } catch {}
                  B = true;
                  return;
                }
                try {
                  let S;
                  if (k) S = await V(t, kn, 'getFilterChanges')({ filter: k });
                  else {
                    let N = await V(t, Er, 'getBlockNumber')({});
                    C && C !== N
                      ? (S = await V(
                          t,
                          ps,
                          'getLogs'
                        )({
                          address: e,
                          args: r,
                          event: s,
                          events: o,
                          fromBlock: C + BigInt(1),
                          toBlock: N,
                        }))
                      : (S = []),
                      (C = N);
                  }
                  if (S.length === 0) return;
                  if (n) v.onLogs(S);
                  else for (let N of S) v.onLogs([N]);
                } catch (S) {
                  k && S instanceof xr && (B = false),
                    (O = v.onError) == null || O.call(v, S);
                }
              },
              { emitOnBegin: true, interval: u }
            );
          return async () => {
            k && (await V(t, $n, 'uninstallFilter')({ filter: k })), F();
          };
        });
      })()
    : (() => {
        let P = true,
          v = () => (P = false);
        return (
          (async () => {
            try {
              let C = (() => {
                  if (t.transport.type === 'fallback') {
                    let O = t.transport.transports.find(
                      S => S.config.type === 'webSocket'
                    );
                    return O ? O.value : t.transport;
                  }
                  return t.transport;
                })(),
                k = o != null ? o : s ? [s] : void 0,
                B = [];
              k &&
                ((B = [
                  k.flatMap(S => gr({ abi: [S], eventName: S.name, args: r })),
                ]),
                s && (B = B[0]));
              let { unsubscribe: F } = await C.subscribe({
                params: ['logs', { address: e, topics: B }],
                onData(O) {
                  var N;
                  if (!P) return;
                  let S = O.result;
                  try {
                    let { eventName: M, args: Z } = ls({
                        abi: k != null ? k : [],
                        data: S.data,
                        topics: S.topics,
                        strict: b,
                      }),
                      G = ct(S, { args: Z, eventName: M });
                    d([G]);
                  } catch (M) {
                    let Z, G;
                    if (M instanceof Xt || M instanceof dr) {
                      if (h) return;
                      (Z = M.abiItem.name),
                        (G =
                          (N = M.abiItem.inputs) == null
                            ? void 0
                            : N.some(te => !('name' in te && te.name)));
                    }
                    let J = ct(S, { args: G ? [] : {}, eventName: Z });
                    d([J]);
                  }
                },
                onError(O) {
                  c == null || c(O);
                },
              });
              (v = F), P || v();
            } catch (C) {
              c == null || c(C);
            }
          })(),
          () => v()
        );
      })();
}
f();
st();
function w0(
  t,
  {
    batch: e = true,
    onError: r,
    onTransactions: n,
    poll: s,
    pollingInterval: o = t.pollingInterval,
  }
) {
  return (typeof s != 'undefined' ? s : t.transport.type !== 'webSocket')
    ? (() => {
        let p = ue(['watchPendingTransactions', t.uid, e, o]);
        return ut(p, { onTransactions: n, onError: r }, u => {
          let h,
            g = qt(
              async () => {
                var b;
                try {
                  if (!h)
                    try {
                      h = await V(t, cu, 'createPendingTransactionFilter')({});
                      return;
                    } catch (T) {
                      throw (g(), T);
                    }
                  let E = await V(t, kn, 'getFilterChanges')({ filter: h });
                  if (E.length === 0) return;
                  if (e) u.onTransactions(E);
                  else for (let T of E) u.onTransactions([T]);
                } catch (E) {
                  (b = u.onError) == null || b.call(u, E);
                }
              },
              { emitOnBegin: true, interval: o }
            );
          return async () => {
            h && (await V(t, $n, 'uninstallFilter')({ filter: h })), g();
          };
        });
      })()
    : (() => {
        let p = true,
          u = () => (p = false);
        return (
          (async () => {
            try {
              let { unsubscribe: h } = await t.transport.subscribe({
                params: ['newPendingTransactions'],
                onData(g) {
                  if (!p) return;
                  let b = g.result;
                  n([b]);
                },
                onError(g) {
                  r == null || r(g);
                },
              });
              (u = h), p || u();
            } catch (h) {
              r == null || r(h);
            }
          })(),
          () => u()
        );
      })();
}
f();
f();
function v0(t) {
  var h, g, b, E, T;
  let {
      scheme: e,
      statement: r,
      ...n
    } = (g = (h = t.match(F1)) == null ? void 0 : h.groups) != null ? g : {},
    {
      chainId: s,
      expirationTime: o,
      issuedAt: i,
      notBefore: c,
      requestId: d,
      ...p
    } = (E = (b = t.match(O1)) == null ? void 0 : b.groups) != null ? E : {},
    u =
      (T = t.split('Resources:')[1]) == null
        ? void 0
        : T.split(
            `
- `
          ).slice(1);
  return {
    ...n,
    ...p,
    ...(s ? { chainId: Number(s) } : {}),
    ...(o ? { expirationTime: new Date(o) } : {}),
    ...(i ? { issuedAt: new Date(i) } : {}),
    ...(c ? { notBefore: new Date(c) } : {}),
    ...(d ? { requestId: d } : {}),
    ...(u ? { resources: u } : {}),
    ...(e ? { scheme: e } : {}),
    ...(r ? { statement: r } : {}),
  };
}
var F1 =
    /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/,
  O1 =
    /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;
f();
ds();
function T0(t) {
  let {
    address: e,
    domain: r,
    message: n,
    nonce: s,
    scheme: o,
    time: i = new Date(),
  } = t;
  if (
    (r && n.domain !== r) ||
    (s && n.nonce !== s) ||
    (o && n.scheme !== o) ||
    (n.expirationTime && i >= n.expirationTime) ||
    (n.notBefore && i < n.notBefore)
  )
    return false;
  try {
    if (!n.address || (e && !vr(n.address, e))) return false;
  } catch {
    return false;
  }
  return true;
}
async function E0(t, e) {
  let {
      address: r,
      domain: n,
      message: s,
      nonce: o,
      scheme: i,
      signature: c,
      time: d = new Date(),
      ...p
    } = e,
    u = v0(s);
  if (
    !u.address ||
    !T0({ address: r, domain: n, message: u, nonce: o, scheme: i, time: d })
  )
    return false;
  let g = hu(s);
  return Bs(t, { address: u.address, hash: g, signature: c, ...p });
}
function C0(t) {
  return {
    call: e => Tr(t, e),
    createAccessList: e => iu(t, e),
    createBlockFilter: () => wg(t),
    createContractEventFilter: e => za(t, e),
    createEventFilter: e => au(t, e),
    createPendingTransactionFilter: () => cu(t),
    estimateContractGas: e => Sh(t, e),
    estimateGas: e => us(t, e),
    getBalance: e => Bc(t, e),
    getBlobBaseFee: () => vg(t),
    getBlock: e => at(t, e),
    getBlockNumber: e => Er(t, e),
    getBlockTransactionCount: e => Tg(t, e),
    getBytecode: e => Fl(t, e),
    getChainId: () => Ht(t),
    getCode: e => Fl(t, e),
    getContractEvents: e => Ic(t, e),
    getEip712Domain: e => Eg(t, e),
    getEnsAddress: e => lg(t, e),
    getEnsAvatar: e => yg(t, e),
    getEnsName: e => bg(t, e),
    getEnsResolver: e => xg(t, e),
    getEnsText: e => su(t, e),
    getFeeHistory: e => Ag(t, e),
    estimateFeesPerGas: e => Eh(t, e),
    getFilterChanges: e => kn(t, e),
    getFilterLogs: e => Pg(t, e),
    getGasPrice: () => as(t),
    getLogs: e => ps(t, e),
    getProof: e => Lg(t, e),
    estimateMaxPriorityFeePerGas: e => Th(t, e),
    getStorageAt: e => zg(t, e),
    getTransaction: e => Es(t, e),
    getTransactionConfirmations: e => _g(t, e),
    getTransactionCount: e => cs(t, e),
    getTransactionReceipt: e => ki(t, e),
    multicall: e => Hg(t, e),
    prepareTransactionRequest: e => Cn(t, e),
    readContract: e => nt(t, e),
    sendRawTransaction: e => ys(t, e),
    simulate: e => Si(t, e),
    simulateBlocks: e => Si(t, e),
    simulateCalls: e => p0(t, e),
    simulateContract: e => Jh(t, e),
    verifyMessage: e => h0(t, e),
    verifySiweMessage: e => E0(t, e),
    verifyTypedData: e => g0(t, e),
    uninstallFilter: e => $n(t, e),
    waitForTransactionReceipt: e => y0(t, e),
    watchBlocks: e => b0(t, e),
    watchBlockNumber: e => Lu(t, e),
    watchContractEvent: e => eg(t, e),
    watchEvent: e => x0(t, e),
    watchPendingTransactions: e => w0(t, e),
  };
}
function Yl(t) {
  let { key: e = 'public', name: r = 'Public Client' } = t;
  return Xc({ ...t, key: e, name: r, type: 'publicClient' }).extend(C0);
}
f();
f();
se();
async function A0(t, { chain: e }) {
  let { id: r, name: n, nativeCurrency: s, rpcUrls: o, blockExplorers: i } = e;
  await t.request(
    {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: H(r),
          chainName: n,
          nativeCurrency: s,
          rpcUrls: o.default.http,
          blockExplorerUrls: i
            ? Object.values(i).map(({ url: c }) => c)
            : void 0,
        },
      ],
    },
    { dedupe: true, retryCount: 0 }
  );
}
f();
Uc();
function P0(t, e) {
  let { abi: r, args: n, bytecode: s, ...o } = e,
    i = to({ abi: r, args: n, bytecode: s });
  return bs(t, { ...o, ...(o.authorizationList ? { to: null } : {}), data: i });
}
f();
on();
async function k0(t) {
  var r;
  return ((r = t.account) == null ? void 0 : r.type) === 'local'
    ? [t.account.address]
    : (await t.request({ method: 'eth_accounts' }, { dedupe: true })).map(n =>
        Bt(n)
      );
}
f();
Ne();
se();
async function $0(t, e = {}) {
  let { account: r = t.account, chainId: n } = e,
    s = r ? ae(r) : void 0,
    o = n
      ? [s == null ? void 0 : s.address, [H(n)]]
      : [s == null ? void 0 : s.address],
    i = await t.request({ method: 'wallet_getCapabilities', params: o }),
    c = {};
  for (let [d, p] of Object.entries(i)) {
    c[Number(d)] = {};
    for (let [u, h] of Object.entries(p))
      u === 'addSubAccount' && (u = 'unstable_addSubAccount'),
        (c[Number(d)][u] = h);
  }
  return typeof n == 'number' ? c[n] : c;
}
f();
async function B0(t) {
  return await t.request({ method: 'wallet_getPermissions' }, { dedupe: true });
}
f();
Ne();
ds();
async function zu(t, e) {
  var d, p, u;
  let { account: r = t.account, chainId: n, nonce: s } = e;
  if (!r) throw new Ye({ docsPath: '/docs/eip7702/prepareAuthorization' });
  let o = ae(r),
    i = (() => {
      if (e.executor)
        return e.executor === 'self' ? e.executor : ae(e.executor);
    })(),
    c = {
      address: (d = e.contractAddress) != null ? d : e.address,
      chainId: n,
      nonce: s,
    };
  return (
    typeof c.chainId == 'undefined' &&
      (c.chainId =
        (u = (p = t.chain) == null ? void 0 : p.id) != null
          ? u
          : await V(t, Ht, 'getChainId')({})),
    typeof c.nonce == 'undefined' &&
      ((c.nonce = await V(
        t,
        cs,
        'getTransactionCount'
      )({ address: o.address, blockTag: 'pending' })),
      (i === 'self' || (i != null && i.address && vr(i.address, o.address))) &&
        (c.nonce += 1)),
    c
  );
}
f();
on();
async function I0(t) {
  return (
    await t.request(
      { method: 'eth_requestAccounts' },
      { dedupe: true, retryCount: 0 }
    )
  ).map(r => ii(r));
}
f();
async function S0(t, e) {
  return t.request(
    { method: 'wallet_requestPermissions', params: [e] },
    { retryCount: 0 }
  );
}
f();
Ne();
yt();
se();
async function R0(t, e) {
  let {
    account: r = t.account,
    chain: n = t.chain,
    forceAtomic: s = false,
    id: o,
    version: i = '2.0.0',
  } = e;
  if (typeof r == 'undefined')
    throw new Ye({ docsPath: '/docs/actions/wallet/sendCalls' });
  let c = r ? ae(r) : null,
    d = e.calls.map(p => {
      let u = p;
      return {
        data: u.abi
          ? we({ abi: u.abi, functionName: u.functionName, args: u.args })
          : u.data,
        to: u.to,
        value: u.value ? H(u.value) : void 0,
      };
    });
  try {
    let p = await t.request(
      {
        method: 'wallet_sendCalls',
        params: [
          {
            atomicRequired: s,
            calls: d,
            capabilities: D1(e.capabilities),
            chainId: H(n.id),
            from: c == null ? void 0 : c.address,
            id: o,
            version: i,
          },
        ],
      },
      { retryCount: 0 }
    );
    return typeof p == 'string' ? { id: p } : p;
  } catch (p) {
    throw Wc(p, { ...e, account: c, chain: e.chain });
  }
}
function D1(t) {
  let e =
    t != null && t.paymasterService
      ? Object.entries(t.paymasterService).reduce(
          (r, [n, s]) => ({ ...(r != null ? r : {}), [H(Number(n))]: s }),
          {}
        )
      : void 0;
  return { ...t, ...(e ? { paymasterService: e } : {}) };
}
f();
async function N0(t, e) {
  let { id: r } = e;
  await t.request({ method: 'wallet_showCallsStatus', params: [r] });
}
f();
Ne();
async function F0(t, e) {
  let { account: r = t.account } = e;
  if (!r) throw new Ye({ docsPath: '/docs/eip7702/signAuthorization' });
  let n = ae(r);
  if (!n.signAuthorization)
    throw new Bn({
      docsPath: '/docs/eip7702/signAuthorization',
      metaMessages: [
        'The `signAuthorization` Action does not support JSON-RPC Accounts.',
      ],
      type: n.type,
    });
  let s = await zu(t, e);
  return n.signAuthorization(s);
}
f();
Ne();
se();
async function O0(t, { account: e = t.account, message: r }) {
  if (!e) throw new Ye({ docsPath: '/docs/actions/wallet/signMessage' });
  let n = ae(e);
  if (n.signMessage) return n.signMessage({ message: r });
  let s =
    typeof r == 'string'
      ? lr(r)
      : r.raw instanceof Uint8Array
        ? Le(r.raw)
        : r.raw;
  return t.request(
    { method: 'personal_sign', params: [s, n.address] },
    { retryCount: 0 }
  );
}
f();
Ne();
se();
Qn();
Tn();
async function D0(t, e) {
  var p, u, h, g;
  let { account: r = t.account, chain: n = t.chain, ...s } = e;
  if (!r) throw new Ye({ docsPath: '/docs/actions/wallet/signTransaction' });
  let o = ae(r);
  xt({ account: o, ...e });
  let i = await V(t, Ht, 'getChainId')({});
  n !== null && Gc({ currentChainId: i, chain: n });
  let c =
      (n == null ? void 0 : n.formatters) ||
      ((p = t.chain) == null ? void 0 : p.formatters),
    d =
      ((u = c == null ? void 0 : c.transactionRequest) == null
        ? void 0
        : u.format) || _t;
  return o.signTransaction
    ? o.signTransaction(
        { ...s, chainId: i },
        {
          serializer:
            (g = (h = t.chain) == null ? void 0 : h.serializers) == null
              ? void 0
              : g.transaction,
        }
      )
    : await t.request(
        {
          method: 'eth_signTransaction',
          params: [{ ...d(s), chainId: H(i), from: o.address }],
        },
        { retryCount: 0 }
      );
}
f();
Ne();
async function M0(t, e) {
  let { account: r = t.account, domain: n, message: s, primaryType: o } = e;
  if (!r) throw new Ye({ docsPath: '/docs/actions/wallet/signTypedData' });
  let i = ae(r),
    c = { EIP712Domain: mu({ domain: n }), ...e.types };
  if (
    (pu({ domain: n, message: s, primaryType: o, types: c }), i.signTypedData)
  )
    return i.signTypedData({ domain: n, message: s, primaryType: o, types: c });
  let d = Rg({ domain: n, message: s, primaryType: o, types: c });
  return t.request(
    { method: 'eth_signTypedData_v4', params: [i.address, d] },
    { retryCount: 0 }
  );
}
f();
se();
async function U0(t, { id: e }) {
  await t.request(
    { method: 'wallet_switchEthereumChain', params: [{ chainId: H(e) }] },
    { retryCount: 0 }
  );
}
f();
async function L0(t, e) {
  return await t.request(
    { method: 'wallet_watchAsset', params: e },
    { retryCount: 0 }
  );
}
function z0(t) {
  return {
    addChain: e => A0(t, e),
    deployContract: e => P0(t, e),
    getAddresses: () => k0(t),
    getCallsStatus: e => Zc(t, e),
    getCapabilities: e => $0(t, e),
    getChainId: () => Ht(t),
    getPermissions: () => B0(t),
    prepareAuthorization: e => zu(t, e),
    prepareTransactionRequest: e => Cn(t, e),
    requestAddresses: () => I0(t),
    requestPermissions: e => S0(t, e),
    sendCalls: e => R0(t, e),
    sendRawTransaction: e => ys(t, e),
    sendTransaction: e => bs(t, e),
    showCallsStatus: e => N0(t, e),
    signAuthorization: e => F0(t, e),
    signMessage: e => O0(t, e),
    signTransaction: e => D0(t, e),
    signTypedData: e => M0(t, e),
    switchChain: e => U0(t, e),
    waitForCallsStatus: e => ng(t, e),
    watchAsset: e => L0(t, e),
    writeContract: e => tg(t, e),
  };
}
f();
function Fi(t) {
  let { key: e = 'wallet', name: r = 'Wallet Client', transport: n } = t;
  return Xc({
    ...t,
    key: e,
    name: r,
    transport: n,
    type: 'walletClient',
  }).extend(z0);
}
yt();
li();
on();
var Rn = 'FORGE_COCKPIT_ACTIVE_NODES',
  oe = {
    TransferCommand: 'forge-cockpit.transfer',
    LoadCockPitWalletsCommand: 'forge-cockpit.loadWallets',
    StubForgeTestsCommand: 'forge-cockpit.stubForgeTests',
    ShowForgeCockPitCommand: 'cockpit.showForgeCockPit',
    RebuildProjectCommand: 'forge-cockpit.rebuildProject',
    RunTestCommand: 'forge-cockpit.runTest',
    RunTestViaIRCommand: 'forge-cockpit.runTestViaIR',
    RunGroupCommand: 'forge-cockpit.runGroup',
    RefreshTestsCommand: 'forge-cockpit.refreshTests',
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
  },
  We = {
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
  },
  Pr = {
    ReadWalletImportCommand: 'readClipboard:walletImport',
    ReadTransferCommand: 'readClipboard:transfer',
    ReadClipboardWalletCommand: 'readClipboard:wallet',
    ReadClipboardDeploymentCommand: 'readClipboard:deployment',
    ReadClipboardAnvilCommand: 'readClipboard:anvil',
    ReadClipboardConstructorArgsCommand: 'readClipboard:constructorArgs',
    ReadClipboardFunctionInputCommand: 'readClipboard:functionInput',
    ReadClipboardEncoderCommand: 'readClipboardEncoder',
    ReadClipboard: 'readClipboard',
  },
  Rt = {
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
  };
function _u(t) {
  return JSON.stringify(t, (e, r) => (typeof r == 'bigint' ? r.toString() : r));
}
var Xl = {
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
function H0(t) {
  return Object.entries(t).map(([e, r]) => ({ privateKey: e, publicKey: r }));
}
function j0(t) {
  try {
    return {
      success: true,
      data: we({ abi: t.abi, functionName: t.functionName, args: t.inputs }),
      error: '',
      functionName: t.functionName,
    };
  } catch (e) {
    return {
      success: false,
      data: '0x',
      error: e.toString(),
      functionName: t.functionName,
    };
  }
}
async function Hu(t) {
  try {
    return await K__namespace.workspace.fs.stat(t), true;
  } catch {
    return false;
  }
}
var ju = class {
  constructor(e) {
    this.foundryManager = e;
  }
  async provideCodeLenses(e, r) {
    let n = [],
      s = e.getText(),
      o = K__namespace.workspace.asRelativePath(e.fileName);
    return (
      this.addTestFunctionLenses(e, s, o, n),
      this.addContractLenses(e, s, o, n),
      n
    );
  }
  addTestFunctionLenses(e, r, n, s) {
    if (this.isNotTestOrScriptFile(n)) return;
    let o = /function\s+(test\w+)\s*\(/g,
      i;
    for (; (i = o.exec(r)) !== null; ) {
      let c = i[1],
        d = e.positionAt(i.index),
        p = new K__namespace.Range(
          d,
          d.with(void 0, d.character + i[0].length)
        ),
        u = {
          title: 'forge test',
          command: oe.RunTestCommand,
          arguments: [{ contractName: n, testName: c }],
        },
        h = {
          title: 'forge test viaIR',
          command: oe.RunTestViaIRCommand,
          arguments: [{ contractName: n, testName: c, viaIR: true }],
        };
      s.push(new K__namespace.CodeLens(p, u)),
        s.push(new K__namespace.CodeLens(p, h));
    }
  }
  addContractLenses(e, r, n, s) {
    if (!this.isNotTestOrScriptFile(n)) return;
    let o = /contract\s+(\w+)(?:\s+is\s+|\s*\{)/g,
      i;
    for (; (i = o.exec(r)) !== null; ) {
      let c = i[1],
        d = e.positionAt(i.index),
        p = new K__namespace.Range(
          d,
          d.with(void 0, d.character + i[0].length - 1)
        ),
        u = {
          title: 'Forge stub tests',
          command: oe.StubForgeTestsCommand,
          arguments: [{ fileName: c, filePath: n }],
        };
      s.push(new K__namespace.CodeLens(p, u));
    }
  }
  isNotTestOrScriptFile(e) {
    return /^(?!.*\.(t|s)\.sol).*$/.test(e);
  }
  isScriptFile(e) {
    return /\.s\.sol$/.test(e);
  }
};
f();
var qu = class {
  constructor() {
    Q(this, 'decorationType');
    Q(this, 'activeEditor');
    (this.decorationType = K__namespace.window.createTextEditorDecorationType({
      before: {
        contentText: '',
        color: '#6a9955',
        margin: '0 0 0 2.5em',
        fontStyle: 'italic',
      },
      isWholeLine: true,
    })),
      K__namespace.window.onDidChangeActiveTextEditor(e => {
        (this.activeEditor = e), e && this.updateDecorations();
      }),
      K__namespace.workspace.onDidChangeTextDocument(e => {
        this.activeEditor &&
          e.document === this.activeEditor.document &&
          this.updateDecorations();
      }),
      (this.activeEditor = K__namespace.window.activeTextEditor),
      this.activeEditor && this.updateDecorations();
  }
  updateDecorations() {
    var r;
    let e = (r = this.activeEditor) == null ? void 0 : r.document;
    if (
      this.activeEditor &&
      e != null &&
      e.fileName.match(/[tT]\.sol$/) &&
      !(e != null && e.fileName.match(/[tT]\.s.sol$/))
    ) {
      let n = e.getText(),
        s = [],
        o = /function\s+(test\w+)\s*\(/g,
        i;
      for (; (i = o.exec(n)) !== null; ) {
        let c = e.positionAt(i.index);
        if (c.line > 0) {
          let d = new K__namespace.Position(c.line - 1, 0),
            p = new K__namespace.Range(d, d);
          s.push({ range: p });
        }
      }
      this.activeEditor.setDecorations(this.decorationType, s);
    }
  }
  dispose() {
    this.decorationType.dispose();
  }
};
f();
var J0 = Vf(K0());
f();
var Vu = class {
  constructor(e, r) {
    this.controller = e;
    this.logger = r;
    Q(this, 'tasks', new Map());
    Q(this, 'executions', new Map());
    Q(this, 'taskEndListener');
    (this.controller = e),
      (this.taskEndListener = K__namespace.tasks.onDidEndTaskProcess(n =>
        this.handleTaskEnd(n)
      ));
  }
  handleTaskEnd(e) {
    for (let [r, n] of this.executions)
      if (e.execution === n) {
        let s = n.task;
        s.definition.command === 'fork' &&
          (K__namespace.commands.executeCommand(oe.GetActiveNodesCommand),
          this.closeTaskTerminal(s.name)),
          this.executions.delete(r),
          this.tasks.delete(r);
        break;
      }
  }
  provideTasks() {
    return this.getFoundryTasks();
  }
  resolveTask(e) {
    let r = e.definition;
    return r.type === 'foundry' ? this.createFoundryTask(r) : void 0;
  }
  async getFoundryTasks() {
    return this.controller.isFoundry() ? [] : [];
  }
  createFoundryTask(e) {
    let r = this.controller.getConfig(),
      n,
      s;
    switch (e.command) {
      case 'test': {
        let c = ['test'];
        e.testName && c.push('--match-test', e.testName),
          e.contractFile && c.push('--match-path', e.contractFile),
          r.viaIR && c.push('--via-ir'),
          c.push(r.verbosity),
          (n = new K__namespace.ShellExecution('forge', c.filter(Boolean), {
            cwd: r.workspaceRoot.fsPath,
          })),
          (s = `Foundry: Test ${e.testName || 'All'}`);
        break;
      }
      case 'fork': {
        let c = e.port,
          d = e.nodeUrl || '',
          p = ['--port', c, '--auto-impersonate'];
        d && p.unshift('--fork-url', d),
          (n = new K__namespace.ShellExecution('anvil', p, {
            cwd: r.workspaceRoot.fsPath,
          })),
          (s = `Foundry: Fork ${d || 'Local'} (${c})`);
        break;
      }
      default:
        throw new Error(`Unknown foundry command: ${e.command}`);
    }
    let o = new K__namespace.Task(
      e,
      K__namespace.TaskScope.Workspace,
      s,
      'foundry',
      n
    );
    e.command === 'fork'
      ? ((o.isBackground = true),
        (o.problemMatchers = []),
        (o.presentationOptions = {
          reveal: K__namespace.TaskRevealKind.Never,
          focus: false,
          panel: K__namespace.TaskPanelKind.Dedicated,
          showReuseMessage: false,
          clear: false,
        }))
      : ((o.group = K__namespace.TaskGroup.Test),
        (o.presentationOptions = {
          reveal: K__namespace.TaskRevealKind.Always,
          focus: true,
          panel: K__namespace.TaskPanelKind.Dedicated,
          showReuseMessage: false,
          clear: true,
        }));
    let i = this.getTaskId(e);
    return this.tasks.set(i, o), o;
  }
  async executeTask(e) {
    let r = this.createFoundryTask(e),
      n = await K__namespace.tasks.executeTask(r);
    return this.executions.set(e.port, n), n;
  }
  async terminateTaskByType(e) {
    let r = K__namespace.tasks.taskExecutions;
    for (let n of r) {
      let o = n.task.definition;
      if (o.command === e) {
        await this.terminateTask(o.port);
        break;
      }
    }
  }
  async terminateTask(e) {
    let r = this.executions.get(e);
    if (r)
      try {
        let s = r.task;
        return (
          r.terminate(),
          await this.closeTaskTerminal(s.name),
          this.executions.delete(e),
          this.tasks.delete(e),
          true
        );
      } catch (s) {
        return this.logger.logToOutput(`Error disposing task ${e}:${s}`), false;
      }
    let n = K__namespace.tasks.taskExecutions;
    for (let s of n) {
      let o = s.task;
      if (o.definition.port === e)
        try {
          return s.terminate(), await this.closeTaskTerminal(o.name), true;
        } catch (c) {
          return (
            this.logger.logToOutput(`Error disposing task by port: ${c}`), false
          );
        }
    }
    return !!(
      (await this.terminateTaskByTerminal(e)) ||
      (await this.terminateTaskByProcess(e))
    );
  }
  async terminateTaskByTerminal(e) {
    let r = K__namespace.window.terminals;
    for (let n of r)
      if (n.name.includes(e) || n.name.includes(`(${e})`))
        return (
          this.logger.logToOutput(`Found terminal for port ${e}: ${n.name}`),
          n.dispose(),
          true
        );
    return false;
  }
  async terminateTaskByProcess(e) {
    try {
      return (
        await K__namespace.commands.executeCommand(oe.TerminateAllTasksCommand),
        this.logger.logToOutput(
          `Terminated all tasks as fallback for port ${e}`
        ),
        true
      );
    } catch (r) {
      return (
        this.logger.logToOutput(`Error terminating all tasks: ${r}`), false
      );
    }
  }
  getRunningTasks() {
    return new Map(this.executions);
  }
  isTaskRunning(e) {
    return this.executions.has(e);
  }
  getTaskId(e) {
    let r = `foundry-${e.command}`;
    return (
      e.port && (r += `-${e.port}`), e.testName && (r += `-${e.testName}`), r
    );
  }
  async closeTaskTerminal(e) {
    let r = K__namespace.window.terminals;
    for (let n of r)
      if (n.name === e || n.name.includes(e)) {
        n.dispose();
        break;
      }
  }
  async closeAllTaskTerminals() {
    let e = K__namespace.window.terminals;
    for (let r of e)
      (r.name.startsWith('Foundry:') || r.name.includes('foundry')) &&
        r.dispose();
  }
  dispose() {
    this.taskEndListener.dispose();
    for (let [, e] of this.executions) {
      let r = e.task;
      e.terminate(), this.closeTaskTerminal(r.name);
    }
    this.executions.clear(), this.tasks.clear();
  }
};
var Gu = class {
  constructor(e) {
    this.logger = e;
    Q(this, 'workspaceRoot');
    Q(this, 'isFoundryProject', false);
    Q(this, 'fileWatchers', []);
    Q(this, 'buildInProgress', false);
    Q(this, 'buildQueue', false);
    Q(this, 'debounceTimer');
    Q(this, '_onDidBuildSucceed', new K__namespace.EventEmitter());
    Q(this, 'onDidBuildSucceed', this._onDidBuildSucceed.event);
    Q(this, 'taskProvider');
    Q(this, 'taskProviderDisposable');
    Q(this, 'accounts', []);
    Q(this, 'config', {
      verbosity: '-vvvvv',
      viaIR: false,
      testDir: 'test',
      srcDir: 'src',
      outputDir: 'out',
      scriptDir: 'script',
      workspaceRoot: K__namespace.Uri.parse(''),
    });
    (this.taskProvider = new Vu(this, e)),
      (this.taskProviderDisposable = K__namespace.tasks.registerTaskProvider(
        'foundry',
        this.taskProvider
      ));
  }
  async initialize() {
    let e = K__namespace.workspace.workspaceFolders;
    if (!e || e.length === 0) {
      this.logger.logToOutput('No workspace folder is open'),
        K__namespace.window.showInformationMessage(
          'No workspace folder is open.'
        );
      return;
    }
    let r = e[0].uri;
    if (
      (this.logger.logToOutput(
        `Searching for Foundry projects in workspace: ${r.fsPath}`
      ),
      !(await this.isForgeInstalled()))
    ) {
      this.logger.logToOutput('Foundry is not installed or not in PATH'),
        this.showForgeNotInstalledError();
      return;
    }
    try {
      let n = await this.findFoundryProjects(r);
      if (n.length === 0)
        throw new Error('No foundry.toml files found in workspace');
      (this.workspaceRoot = n[0]),
        n.length > 1 &&
          (this.logger.logToOutput(
            `Multiple Foundry projects found. Using: ${this.workspaceRoot.fsPath}`
          ),
          this.logger.logToOutput(
            `Other projects found at: ${n
              .slice(1)
              .map(s => s.fsPath)
              .join(', ')}`
          )),
        await this.checkNodeModules(),
        await this.loadFoundryConfig(),
        (this.isFoundryProject = true),
        this.logger.logToOutput(
          `Successfully loaded Foundry configuration from: ${this.workspaceRoot.fsPath}`
        ),
        this.logger.updateStatusBar(
          '$(sync~spin) Forge cockpit detecting contracts...'
        ),
        await Promise.all([
          this.cleanOutputDirectory(),
          this.executeBuild(false),
        ]),
        this.setupWatchers(),
        this.logger.logToOutput('File watchers setup completed');
    } catch (n) {
      let s = `No Foundry project found in workspace. ${n.message}`;
      this.logger.updateStatusBar(
        `$(error) Forge cockpit ${s}`,
        new K__namespace.ThemeColor('statusBarItem.errorBackground')
      ),
        (this.isFoundryProject = false);
    }
  }
  async findFoundryProjects(e) {
    let r = [];
    try {
      let n = await K__namespace.workspace.findFiles(
        new K__namespace.RelativePattern(e, '**/foundry.toml'),
        '**/node_modules/**'
      );
      for (let s of n) {
        let o = K__namespace.Uri.file(Tt__namespace.dirname(s.fsPath));
        r.push(o);
      }
      r.sort((s, o) => {
        let i = Tt__namespace.relative(e.fsPath, s.fsPath).split(
            Tt__namespace.sep
          ).length,
          c = Tt__namespace.relative(e.fsPath, o.fsPath).split(
            Tt__namespace.sep
          ).length;
        return i - c;
      });
    } catch (n) {
      this.logger.logToOutput(
        `Error searching for Foundry projects: ${n.message}`
      );
    }
    return r;
  }
  async checkNodeModules() {
    try {
      let e = K__namespace.Uri.joinPath(this.workspaceRoot, 'package.json'),
        r = K__namespace.Uri.joinPath(this.workspaceRoot, 'node_modules');
      if (!(await Hu(e))) return;
      if (!(await Hu(r))) {
        let o =
          "package.json found but node_modules is missing. Please run 'npm install' or 'yarn install' to install dependencies. Incase your smartcontracts use node_modules for remappings";
        this.logger.logToOutput(o),
          K__namespace.window.showInformationMessage(o);
      }
    } catch (e) {
      this.logger.logToOutput(`Error checking node_modules: ${e.message}`);
    }
  }
  async loadFoundryConfig() {
    var o, i, c, d, p, u, h, g, b, E;
    if (!this.workspaceRoot) return;
    let e = K__namespace.Uri.joinPath(this.workspaceRoot, 'foundry.toml'),
      r = await K__namespace.workspace.fs.readFile(e),
      n = new TextDecoder().decode(r),
      s = J0.parse(n);
    this.config = {
      verbosity: '-vvvvv',
      viaIR:
        ((i = (o = s.profile) == null ? void 0 : o.default) == null
          ? void 0
          : i.via_ir) || false,
      testDir:
        ((d = (c = s.profile) == null ? void 0 : c.default) == null
          ? void 0
          : d.test) || 'test',
      srcDir:
        ((u = (p = s.profile) == null ? void 0 : p.default) == null
          ? void 0
          : u.src) || 'src',
      outputDir:
        ((g = (h = s.profile) == null ? void 0 : h.default) == null
          ? void 0
          : g.out) || 'out',
      scriptDir:
        ((E = (b = s.profile) == null ? void 0 : b.default) == null
          ? void 0
          : E.script) || 'script',
      workspaceRoot: this.workspaceRoot,
    };
  }
  showForgeNotInstalledError() {
    this.logger.logToOutput('Showing Foundry installation error dialog'),
      K__namespace.window
        .showErrorMessage(
          "Foundry is not installed or not in PATH. Please install Foundry and ensure it's in your PATH.",
          'Install Foundry',
          'Learn More'
        )
        .then(e => {
          e === 'Install Foundry'
            ? (this.logger.logToOutput(
                "User clicked 'Install Foundry' - opening installation guide"
              ),
              K__namespace.env.openExternal(
                K__namespace.Uri.parse(
                  'https://book.getfoundry.sh/getting-started/installation'
                )
              ))
            : e === 'Learn More' &&
              (this.logger.logToOutput(
                "User clicked 'Learn More' - opening Foundry documentation"
              ),
              K__namespace.env.openExternal(
                K__namespace.Uri.parse('https://book.getfoundry.sh/')
              ));
        });
  }
  setupWatchers() {
    var e, r, n, s, o, i;
    if (!this.workspaceRoot) {
      this.logger.logToOutput('Cannot setup watchers - no workspace root');
      return;
    }
    this.logger.logToOutput(
      `Setting up file watchers for ${(e = this.config) == null ? void 0 : e.srcDir} and ${(r = this.config) == null ? void 0 : r.outputDir}`
    ),
      this.createFileWatcher(
        `${(n = this.config) == null ? void 0 : n.srcDir}/**/*.sol`,
        this.handleSourceChange.bind(this)
      ),
      this.createFileWatcher(
        `${(s = this.config) == null ? void 0 : s.testDir}/**/*.sol`,
        this.handleSourceChange.bind(this)
      ),
      this.createFileWatcher(
        `${(o = this.config) == null ? void 0 : o.scriptDir}/**/*.sol`,
        this.handleSourceChange.bind(this)
      ),
      this.createFileWatcher(
        ((i = this.config) == null ? void 0 : i.outputDir) || 'out',
        this.handleFileChange.bind(this)
      );
  }
  createFileWatcher(e, r) {
    if (!this.workspaceRoot) return;
    let n = new K__namespace.RelativePattern(this.workspaceRoot, e),
      s = K__namespace.workspace.createFileSystemWatcher(
        n,
        false,
        false,
        false
      );
    s.onDidCreate(r),
      s.onDidChange(r),
      s.onDidDelete(r),
      this.fileWatchers.push(s);
  }
  handleSourceChange(e) {
    this.logger.logToOutput(
      `Source file changed: ${Tt__namespace.basename(e.fsPath)}`
    ),
      this.debouncedBuild(1500);
  }
  handleFileChange(e) {
    this.logger.logToOutput(
      `Output file changed: ${Tt__namespace.basename(e.fsPath)}`
    ),
      this.debouncedBuild(1e3);
  }
  debouncedBuild(e) {
    this.debounceTimer && clearTimeout(this.debounceTimer),
      (this.debounceTimer = setTimeout(async () => {
        await this.triggerBuild(),
          K__namespace.commands.executeCommand(oe.RefreshTestsCommand),
          K__namespace.commands.executeCommand(oe.LoadCockPitWalletsCommand);
      }, e));
  }
  async triggerBuild() {
    if (!this.isFoundryProject || !this.workspaceRoot) {
      this.logger.logToOutput(
        'Cannot trigger build - not a Foundry project or no workspace'
      );
      return;
    }
    if (this.buildInProgress) {
      this.logger.logToOutput('Build already in progress - queuing next build'),
        (this.buildQueue = true);
      return;
    }
    (this.buildInProgress = true),
      this.logger.logToOutput('Triggering build process'),
      this.logger.updateStatusBar(
        '$(sync~spin) Forge cockpit Building...',
        new K__namespace.ThemeColor('statusBarItem.warningBackground')
      );
    try {
      await this.executeBuild(false);
    } catch (e) {
      this.logger.logToOutput(`Build trigger failed: ${e.stack}`),
        this.logger.updateStatusBar(
          `$(error) Forge cockpit build failed: ${e.message}`,
          new K__namespace.ThemeColor('statusBarItem.errorBackground')
        );
    } finally {
      (this.buildInProgress = false),
        this.buildQueue &&
          (this.logger.logToOutput('Processing queued build'),
          (this.buildQueue = false),
          setTimeout(() => this.triggerBuild(), 100));
    }
  }
  async getExecutablePath(e) {
    let r = process.env.HOME || process.env.USERPROFILE,
      n =
        process.platform === 'win32'
          ? `${r}\\.foundry\\bin\\${e}.exe`
          : `${r}/.foundry/bin/${e}`;
    return new Promise(s => {
      Is__namespace.access(n, Is__namespace.constants.X_OK, o => {
        s(o ? e : n);
      });
    });
  }
  async executeCommand(
    e = [],
    r = (s => ((s = this.workspaceRoot) == null ? void 0 : s.fsPath))() || '',
    n = true
  ) {
    let o = { ...process.env },
      i = process.env.HOME || process.env.USERPROFILE,
      c = Tt__namespace.dirname(
        process.platform === 'win32'
          ? `${i}\\.foundry\\bin\\${e[0]}.exe`
          : `${i}/.foundry/bin/${e[0]}`
      );
    return (
      (o.PATH = `${c}${process.platform === 'win32' ? ';' : ':'}${o.PATH || ''}`),
      new Promise((d, p) => {
        var T, P;
        if (!n) {
          Oi__namespace.exec(e.join(' '), { cwd: r, env: o }, (v, C, k) => {
            v
              ? p({ error: v, stderr: k, exitCode: v.code || 1 })
              : d({ stdout: C, stderr: k, exitCode: 0 });
          });
          return;
        }
        let [u, ...h] = e,
          g = Oi__namespace.spawn(u, h, { cwd: r, env: o, shell: true }),
          b = '',
          E = '';
        (T = g.stdout) == null ||
          T.on('data', v => {
            let C = v.toString();
            (b += C), n && this.logger.logToOutput(C.trim());
          }),
          (P = g.stderr) == null ||
            P.on('data', v => {
              let C = v.toString();
              (E += C), n && this.logger.logToOutput(C.trim());
            }),
          g.on('error', v => {
            this.logger.logToOutput(`Process error: ${v.stack}`),
              p({ error: v, stderr: E, exitCode: 1 });
          }),
          g.on('close', v => {
            d({ stdout: b, stderr: E, exitCode: v || 0 });
          });
      })
    );
  }
  async executeBuild(e) {
    var r, n;
    try {
      this.logger.logToOutput(`Starting build${e ? ' with --via-ir' : ''}`);
      let o = [
        await this.getExecutablePath('forge'),
        'build',
        '--contracts',
        `./${(r = this.config) == null ? void 0 : r.srcDir}`,
      ];
      e && o.push('--via-ir');
      let i = await this.executeCommand(
        o,
        ((n = this.workspaceRoot) == null ? void 0 : n.fsPath) || '',
        true
      );
      return i.exitCode !== 0
        ? !e && i.stderr.includes('--via-ir')
          ? (this.logger.logToOutput('Retrying build with --via-ir flag'),
            this.executeBuild(true))
          : (this.logger.updateStatusBar(
              '$(error) Forge cockpit build failed',
              new K__namespace.ThemeColor('statusBarItem.errorBackground')
            ),
            false)
        : (this.logger.logToOutput('Build completed successfully'),
          this.logger.updateStatusBar('$(check) Forge cockpit build succeeded'),
          this.onBuildSucceeded(),
          true);
    } catch (s) {
      return (
        this.logger.logToOutput(`Build error: ${s.stack}`),
        this.logger.updateStatusBar(
          `$(error) Forge cockpit build failed: ${s.message}`,
          new K__namespace.ThemeColor('statusBarItem.errorBackground')
        ),
        false
      );
    }
  }
  async runTest(e, r, n) {
    if (!this.isFoundryProject || !this.workspaceRoot)
      return (
        this.logger.logToOutput(
          'Cannot run test - not a Foundry project or no workspace'
        ),
        { testName: r, success: false }
      );
    (this.config = n),
      this.logger.logToOutput(`Starting test execution: ${r} in ${e}`),
      this.logger.updateStatusBar(
        `$(beaker~spin) Forge cockpit running test: ${r}`,
        new K__namespace.ThemeColor('statusBarItem.warningBackground')
      );
    try {
      let s = {
          type: 'foundry',
          command: 'test',
          testName: `"\\\\b${r}\\\\b"`,
          contractFile: e,
          taskId: `test-${r}-${Date.now()}`,
          port: '0',
        },
        o = await this.taskProvider.executeTask(s);
      return (
        this.logger.logToOutput(`Test task created for: ${r}`),
        new Promise(i => {
          let c = K__namespace.tasks.onDidEndTaskProcess(d => {
            d.execution === o &&
              (d.exitCode === 0
                ? (this.logger.logToOutput(`Test passed: ${r}`),
                  this.logger.updateStatusBar(
                    `$(check) Forge cockpit test passed: ${r}`,
                    new K__namespace.ThemeColor(
                      'statusBarItem.successBackground'
                    )
                  ),
                  i({ testName: r, success: true }))
                : (this.logger.logToOutput(
                    `Test failed: ${r} with exit code ${d.exitCode}`
                  ),
                  this.logger.updateStatusBar(
                    `$(error) Forge cockpit test failed: ${r}`,
                    new K__namespace.ThemeColor('statusBarItem.errorBackground')
                  ),
                  i({
                    testName: r,
                    success: false,
                    error: `Test failed with exit code ${d.exitCode}`,
                  })),
              setTimeout(() => {
                this.logger.updateStatusBar('$(check) Forge cockpit ready');
              }, 3e3),
              c.dispose());
          });
        })
      );
    } catch (s) {
      return (
        this.logger.logToOutput(`Failed to run test ${r}: ${s.stack}`),
        this.logger.updateStatusBar(
          `$(error) Forge cockpit failed to run test: ${r}`,
          new K__namespace.ThemeColor('statusBarItem.errorBackground')
        ),
        {
          testName: r,
          success: false,
          error: `Failed to run test: ${s.message}`,
        }
      );
    }
  }
  async runAllTests(e) {
    var r;
    if (!this.isFoundryProject || !this.workspaceRoot)
      return (
        this.logger.logToOutput(
          'Cannot run tests - not a Foundry project or no workspace'
        ),
        []
      );
    (this.config = e),
      this.logger.logToOutput('Starting all tests execution'),
      this.logger.updateStatusBar(
        '$(beaker~spin) Forge cockpit running all tests',
        new K__namespace.ThemeColor('statusBarItem.warningBackground')
      );
    try {
      let n = ['test', '--json'];
      e.viaIR && n.push('--via-ir'), e.verbosity && n.push('-v', e.verbosity);
      let s =
        typeof this.workspaceRoot == 'string'
          ? this.workspaceRoot
          : ((r = this.workspaceRoot) == null ? void 0 : r.fsPath) ||
            process.cwd();
      return new Promise(o => {
        var u, h;
        let { spawn: i } = Ls('child_process'),
          c = i('forge', n, { cwd: s, shell: true }),
          d = '',
          p = '';
        (u = c.stdout) == null ||
          u.on('data', g => {
            d += g.toString();
          }),
          (h = c.stderr) == null ||
            h.on('data', g => {
              p += g.toString();
            }),
          c.on('close', g => {
            let b = this.parseTestResults(d);
            this.logger.logToOutput(`All tests completed successfully 

 with results: ${JSON.stringify(b)}

`),
              g === 0
                ? (this.logger.logToOutput('All tests completed successfully'),
                  this.logger.updateStatusBar(
                    '$(check) Forge cockpit all tests passed',
                    new K__namespace.ThemeColor(
                      'statusBarItem.successBackground'
                    )
                  ))
                : (this.logger.logToOutput(
                    `Some tests failed with exit code ${g}`
                  ),
                  p && this.logger.logToOutput(`Error output: ${p}`),
                  this.logger.updateStatusBar(
                    '$(error) Forge cockpit some tests failed',
                    new K__namespace.ThemeColor('statusBarItem.errorBackground')
                  )),
              setTimeout(() => {
                this.logger.updateStatusBar('$(check) Forge cockpit ready');
              }, 3e3),
              o(b);
          }),
          c.on('error', g => {
            this.logger.logToOutput(
              `Failed to start forge process: ${g.message}`
            ),
              this.logger.updateStatusBar(
                '$(error) Forge cockpit failed to run tests',
                new K__namespace.ThemeColor('statusBarItem.errorBackground')
              ),
              o([]);
          });
      });
    } catch (n) {
      return (
        this.logger.logToOutput(`Failed to run all tests: ${n.stack}`),
        this.logger.updateStatusBar(
          '$(error) Forge cockpit failed to run tests',
          new K__namespace.ThemeColor('statusBarItem.errorBackground')
        ),
        []
      );
    }
  }
  parseTestResults(e) {
    let r = [];
    try {
      let n = JSON.parse(e);
      if (!n || typeof n != 'object') return r;
      Object.keys(n).forEach(s => {
        var d;
        if (!s.includes('.sol:')) return;
        let o = n[s];
        if (!(o != null && o.test_results)) return;
        let i = o.test_results,
          c =
            ((d = s.split(':')[0]) == null ? void 0 : d.split('/').pop()) || s;
        Object.keys(i).forEach(p => {
          var b;
          let u = i[p];
          if (!(u != null && u.status)) return;
          let h = u.status === 'Success',
            g = h ? void 0 : u.reason || 'Unknown error';
          if (p.startsWith('Found ') && p.includes('instances:')) {
            let E = p.match(/instances: (.+)$/);
            (
              ((b = E == null ? void 0 : E[1]) == null
                ? void 0
                : b.split(', ')) || []
            ).forEach(P => {
              let v = P.trim().replace(/\(.*\)$/, '');
              if (!v) return;
              let C = new Map();
              C.set(v, h),
                r.push({
                  testName: v,
                  fileName: c,
                  success: h,
                  error: g,
                  testResults: C,
                });
            });
          } else {
            let E = new Map();
            E.set(p, h),
              r.push({
                testName: p.replace(/\(.*\)$/, ''),
                fileName: c,
                success: h,
                error: g,
                testResults: E,
              });
          }
        });
      });
    } catch (n) {
      this.logger.logToOutput(`Failed to parse test results: ${n}`);
    }
    return r;
  }
  async runScript(e) {
    var r;
    if (!this.isFoundryProject || !this.workspaceRoot)
      return (
        this.logger.logToOutput(
          'Cannot run script - not a Foundry project or no workspace'
        ),
        {
          success: false,
          contracts: [
            {
              contractName: e.contractName,
              address: '',
              success: false,
              hash: '',
              nodeUrl: e.nodeUrl,
              logs: void 0,
            },
          ],
          scriptName: e.contractName,
        }
      );
    this.logger.logToOutput(
      `Starting script execution: ${e.contractName} in ${e.scriptName}`
    ),
      this.logger.updateStatusBar(
        `$(play~spin) Forge cockpit running script: ${e.contractName}`,
        new K__namespace.ThemeColor('statusBarItem.warningBackground')
      );
    try {
      let n = this.accounts.find(p => Bt(p.publicKey) === Bt(e.msgSender));
      if (!n)
        return {
          success: false,
          contracts: [
            {
              contractName: e.contractName,
              address: '',
              success: false,
              hash: '',
              nodeUrl: e.nodeUrl,
              logs: void 0,
            },
          ],
          scriptName: e.contractName,
        };
      let s = await this.getExecutablePath('forge'),
        o = this.buildScriptArgs({ ...e, privateKey: n.privateKey });
      if (o.length === 0)
        return {
          success: false,
          contracts: [
            {
              contractName: e.contractName,
              address: '',
              success: false,
              hash: '',
              nodeUrl: e.nodeUrl,
              logs: void 0,
            },
          ],
          scriptName: e.contractName,
        };
      let i = [s, ...o];
      this.logger.logToOutput(`Executing command: ${i.join(' ')}`);
      let c = await this.executeCommand(
        i,
        ((r = this.workspaceRoot) == null ? void 0 : r.fsPath) || '',
        true
      );
      if (c.exitCode !== 0)
        return (
          this.logger.logToOutput(
            `Script failed: ${e.contractName} with exit code ${c.exitCode}`
          ),
          this.logger.logToOutput(`Error output: ${c.stderr}`),
          this.logger.updateStatusBar(
            `$(error) Forge cockpit script failed: ${e.contractName}`,
            new K__namespace.ThemeColor('statusBarItem.errorBackground')
          ),
          setTimeout(() => {
            this.logger.updateStatusBar('$(check) Forge cockpit ready');
          }, 3e3),
          {
            success: false,
            contracts: [
              {
                contractName: e.contractName,
                address: '',
                success: false,
                hash: '',
                nodeUrl: e.nodeUrl,
                logs: void 0,
              },
            ],
            scriptName: e.contractName,
          }
        );
      let d = await this.extractDeployedContracts(e);
      return (
        d.length === 0 &&
          (this.logger.logToOutput(
            `Script completed successfully but no contract deployments detected: ${e.contractName}`
          ),
          d.push({
            contractName: e.contractName,
            address: '',
            success: true,
            hash: '',
            nodeUrl: e.nodeUrl,
            logs: void 0,
          })),
        this.logger.logToOutput(
          `Script completed successfully: ${e.contractName}`
        ),
        this.logger.logToOutput(
          `Deployment results: ${JSON.stringify(d, null, 2)}`
        ),
        this.logger.updateStatusBar(
          `$(check) Forge cockpit script completed: ${e.contractName}`,
          new K__namespace.ThemeColor('statusBarItem.successBackground')
        ),
        setTimeout(() => {
          this.logger.updateStatusBar('$(check) Forge cockpit ready');
        }, 3e3),
        { success: true, contracts: d, scriptName: e.contractName }
      );
    } catch (n) {
      return (
        this.logger.logToOutput(`Script execution error: ${n.message}`),
        this.logger.updateStatusBar(
          `$(error) Forge cockpit script failed: ${e.contractName}`,
          new K__namespace.ThemeColor('statusBarItem.errorBackground')
        ),
        setTimeout(() => {
          this.logger.updateStatusBar('$(check) Forge cockpit ready');
        }, 3e3),
        {
          success: false,
          contracts: [
            {
              contractName: e.contractName,
              address: '',
              success: false,
              hash: '',
              nodeUrl: e.nodeUrl,
              logs: void 0,
            },
          ],
          scriptName: e.contractName,
        }
      );
    }
  }
  async extractDeployedContracts(e) {
    if (!this.workspaceRoot) return [];
    let r = [];
    try {
      let n = K__namespace.Uri.joinPath(
          this.workspaceRoot,
          'broadcast',
          `${e.scriptName}`
        ),
        s = await K__namespace.workspace.findFiles(
          new K__namespace.RelativePattern(n, `**/${e.chainId}/run-latest.json`)
        );
      for (let o of s) {
        let i = await K__namespace.workspace.fs.readFile(o),
          c = JSON.parse(new TextDecoder().decode(i));
        if (c.transactions && Array.isArray(c.transactions))
          for (let d of c.transactions)
            d.transactionType === 'CREATE' &&
              d.contractAddress &&
              r.push({
                contractName: d.contractName || 'Unknown',
                address: d.contractAddress,
                success: true,
                hash: d.hash || '',
                nodeUrl: e.nodeUrl || '',
                logs: void 0,
              });
      }
      this.logger.logToOutput(
        `Extracted ${r.length} deployed contracts from broadcast files`
      );
    } catch (n) {
      this.logger.logToOutput(`Failed to read deployment files: ${n.stack}`);
    }
    return r;
  }
  buildScriptArgs(e) {
    let r = ['script', `${this.config.scriptDir}/${e.scriptName}`];
    return (
      e.scriptName && r.push(e.scriptName),
      e.privateKey && r.push('--private-key', e.privateKey),
      e.viaIR && r.push('--via-ir'),
      r.push('--rpc-url', e.nodeUrl),
      r.push('--broadcast'),
      r.push('-vvvvv'),
      r
    );
  }
  async cleanOutputDirectory() {
    var e;
    if (!this.isFoundryProject || !this.workspaceRoot) {
      this.logger.logToOutput(
        'Cannot clean output directory - not a Foundry project or no workspace'
      );
      return;
    }
    this.logger.updateStatusBar(
      `$(sync~spin) Forge cockpit cleaning ${this.config.outputDir}...`,
      new K__namespace.ThemeColor('statusBarItem.warningBackground')
    );
    try {
      this.logger.logToOutput(`Starting clean of ${this.config.outputDir}`);
      let n = [await this.getExecutablePath('forge'), 'clean'],
        s = await this.executeCommand(
          n,
          ((e = this.workspaceRoot) == null ? void 0 : e.fsPath) || '',
          true
        );
      s.exitCode !== 0
        ? this.logger.logToOutput(`Clean failed with exit code: ${s.exitCode}`)
        : this.logger.logToOutput('Clean completed successfully'),
        this.logger.updateStatusBar('$(check) Forge cockpit clean completed'),
        setTimeout(() => {
          this.logger.updateStatusBar('$(check) Forge cockpit ready');
        }, 1500);
    } catch (r) {
      this.logger.logToOutput(`Clean error: ${r.stack}`),
        this.logger.updateStatusBar(
          `$(error) Forge cockpit clean failed: ${r.message}`,
          new K__namespace.ThemeColor('statusBarItem.errorBackground')
        );
    }
  }
  async onBuildSucceeded() {
    this.logger.logToOutput('Build succeeded - scanning for contract ABIs'),
      await this.getAllContractABIs(),
      this.logger.logToOutput('Firing build success event'),
      this._onDidBuildSucceed.fire();
  }
  async loadWallets() {
    let e = [];
    try {
      if (!this.workspaceRoot) return [];
      let r = K__namespace.Uri.joinPath(
        this.workspaceRoot,
        'cockpit-accounts.json'
      );
      if (!(await Hu(r))) {
        this.logger.logToOutput(
          'No cockpit-accounts.json file found, using default accounts'
        );
        let c = new TextEncoder().encode(JSON.stringify(Xl, null, 2));
        try {
          await K__namespace.workspace.fs.writeFile(r, c);
        } catch (d) {
          this.logger.logToOutput(
            `Error writing default accounts: ${d.message}`
          );
        }
      }
      let s = await K__namespace.workspace.fs.readFile(r),
        o = JSON.parse(new TextDecoder().decode(s)),
        i = H0(o ? o.accounts : Xl.accounts);
      (this.accounts = i),
        this.logger.logToOutput(
          `Loaded cockpit wallets with info: ${JSON.stringify(i)}`
        ),
        (e = i.map(c => c.publicKey));
    } catch (r) {
      this.logger.updateStatusBar(`$(error) Forge cockpit ${r.message}`),
        this.logger.logToOutput(`Error loading default wallets: ${r.stack}`);
    }
    return e;
  }
  async getAllContractABIs() {
    var n, s;
    if (!this.workspaceRoot || !this.isFoundryProject) {
      let o = 'cannot scan for contracts: Not a valid Foundry project';
      return (
        this.logger.logToOutput(`Error: ${o}`),
        this.logger.updateStatusBar(
          `$(error) Forge cockpit ${o}`,
          new K__namespace.ThemeColor('statusBarItem.errorBackground')
        ),
        []
      );
    }
    this.logger.logToOutput(
      `Scanning for contract ABIs in ${(n = this.config) == null ? void 0 : n.outputDir}`
    );
    let e = K__namespace.Uri.joinPath(
        this.workspaceRoot,
        (s = this.config) == null ? void 0 : s.outputDir
      ),
      r = [];
    try {
      let o = new K__namespace.RelativePattern(e, '**/*.json'),
        i = await K__namespace.workspace.findFiles(o);
      if (
        (this.logger.logToOutput(
          `Found ${i.length} JSON files in output directory`
        ),
        i.length === 0)
      ) {
        let d = `No contract files found in ${this.config.testDir} directory. Have you compiled the project?`;
        return (
          this.logger.logToOutput(d),
          this.triggerBuild(),
          K__namespace.window.showInformationMessage(d),
          []
        );
      }
      let c = 0;
      for (let d of i) {
        let p = Tt__namespace.basename(d.fsPath, '.json');
        try {
          let u = await K__namespace.workspace.fs.readFile(d),
            h = JSON.parse(new TextDecoder().decode(u)),
            g = h.abi,
            b = h.bytecode && h.bytecode.object ? h.bytecode.object : '',
            E =
              h.ast && h.ast.absolutePath
                ? h.ast && Tt__namespace.basename(h.ast.absolutePath)
                : '';
          g &&
            (r.push({
              fileName: p,
              filePath: d.fsPath,
              solFileName: E,
              tests: [],
              abi: g,
              bytecode: b,
              isFolder: false,
            }),
            c++);
        } catch (u) {
          this.logger.logToOutput(
            `Failed to parse contract file ${p}: ${u.stack}`
          );
          continue;
        }
      }
      return this.logger.logToOutput(`Successfully loaded ${c} contracts`), r;
    } catch (o) {
      let i = `error scanning output directory: ${o.message}`;
      return (
        this.logger.logToOutput(`Error: ${o.stack}`),
        this.logger.updateStatusBar(`$(error) Forge cockpit ${i}`),
        []
      );
    }
  }
  async isForgeInstalled() {
    return new Promise(e => {
      let r =
        process.platform === 'win32'
          ? 'where forge 2>nul'
          : 'which forge 2>/dev/null || command -v forge 2>/dev/null';
      Oi__namespace.exec(r, (n, s) => {
        if (!n && s) {
          e(true);
          return;
        }
        let o = process.env.HOME || process.env.USERPROFILE,
          i =
            process.platform === 'win32'
              ? `${o}\\.foundry\\bin\\forge.exe`
              : `${o}/.foundry/bin/forge`;
        Is__namespace.access(i, Is__namespace.constants.X_OK, c => {
          e(!c);
        });
      });
    });
  }
  async getActiveNodes() {
    this.logger.logToOutput('Checking for active fork nodes');
    let e = [],
      r = this.taskProvider.getRunningTasks();
    for (let [n, s] of r) {
      let i = s.task.definition;
      i.command === 'fork' &&
        i.port &&
        ((await this.isPortInUse(i.port))
          ? e.push(i.port)
          : (this.logger.logToOutput(
              `Removing stale fork task ${n} - port ${i.port} not in use`
            ),
            this.taskProvider.terminateTask(n)));
    }
    return (
      this.logger.logToOutput(
        `Found ${e.length} active fork nodes on ports: ${e.join(', ')}`
      ),
      e.sort((n, s) => parseInt(n) - parseInt(s))
    );
  }
  async forkNode(e) {
    this.logger.logToOutput(
      `Attempting to fork node on port ${e.port} with URL: ${e.nodeUrl || 'local'}`
    );
    let r = await this.isPortInUse(e.port);
    if (!this.isFoundryProject || !this.workspaceRoot || r) {
      let n = this.isFoundryProject
        ? this.workspaceRoot
          ? 'port already in use'
          : 'no workspace'
        : 'not a Foundry project';
      return (
        this.logger.logToOutput(`Fork failed: ${n}`),
        { success: false, accounts: [], port: e.port.toString() }
      );
    }
    try {
      let n = {
        type: 'foundry',
        command: 'fork',
        taskId: e.tabId,
        port: e.port.toString(),
        nodeUrl: e.nodeUrl,
      };
      await this.taskProvider.executeTask(n),
        this.logger.logToOutput(
          `Fork task started, waiting for node to be ready on port ${e.port}`
        );
      let s = await this.waitForNodeReady(e.port);
      return (
        s
          ? this.logger.logToOutput(
              `Fork node successfully started on port ${e.port}`
            )
          : this.logger.logToOutput(
              `Fork node failed to start on port ${e.port} - timeout`
            ),
        { success: s, accounts: [], port: e.port }
      );
    } catch (n) {
      return (
        this.logger.logToOutput(`Error creating anvil instance: ${n.stack}`),
        this.logger.updateStatusBar(
          `$(error) Forge cockpit error creating anvil instance: ${n.message}`,
          new K__namespace.ThemeColor('statusBarItem.errorBackground')
        ),
        { success: false, accounts: [], port: e.port }
      );
    }
  }
  async stopForkNode(e) {
    try {
      this.logger.logToOutput(`Stopping anvil node on port: ${e}`);
      let r = await this.taskProvider.terminateTask(e);
      return (
        this.logger.updateStatusBar(
          `$(check) Forge cockpit anvil node stopped on port: ${e}`,
          new K__namespace.ThemeColor('statusBarItem.successBackground')
        ),
        setTimeout(() => {
          this.logger.updateStatusBar('$(check) Forge cockpit ready');
        }, 2e3),
        r
      );
    } catch (r) {
      this.logger.logToOutput(`error stopping fork ${r.stack}`);
    }
    return false;
  }
  async waitForNodeReady(e, r = 100) {
    return (
      this.logger.logToOutput(
        `Waiting for node to be ready on port ${e} (max ${r} attempts)`
      ),
      new Promise(n => {
        let s = 0,
          o = async () => {
            if (
              (s++,
              this.logger.logToOutput(
                `Waiting for node to be ready on port ${e} (current attempts ${s})`
              ),
              await this.isPortInUse(e))
            ) {
              this.logger.logToOutput(
                `Node ready on port ${e} after ${s} attempts`
              ),
                n(true);
              return;
            }
            if (s >= r) {
              this.logger.logToOutput(
                `Node failed to start on port ${e} - timeout after ${s} attempts`
              ),
                n(false);
              return;
            }
            setTimeout(o, 1e3);
          };
        o();
      })
    );
  }
  async isPortInUse(e) {
    return new Promise(r => {
      let n = new Y0__namespace.Socket();
      n.once('connect', () => {
        n.destroy(), this.logger.logToOutput(`Port ${e} is in use`), r(true);
      }),
        n.once('error', () => {
          this.logger.logToOutput(`Port ${e} is not in use`), r(false);
        }),
        n.connect(+e, '127.0.0.1');
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
    var e;
    return ((e = this.config) == null ? void 0 : e.srcDir) || 'src';
  }
  isFoundry() {
    return this.isFoundryProject;
  }
  dispose() {
    var e;
    this.fileWatchers.forEach(r => r.dispose()),
      this.debounceTimer && clearTimeout(this.debounceTimer),
      this.taskProvider.dispose(),
      (e = this.taskProviderDisposable) == null || e.dispose(),
      this.logger.dispose(),
      this._onDidBuildSucceed.dispose();
  }
};
f();
var Wu = class {
  constructor(e, r) {
    this.config = e;
    this.logger = r;
    Q(this, 'functionRegex', /function\s+(test\w*)\s*\(/g);
    Q(this, 'watcher');
    Q(this, '_onDidChangeContracts', new K__namespace.EventEmitter());
    Q(this, 'debounceTimer');
    Q(this, 'onDidChangeContracts', this._onDidChangeContracts.event);
    Q(this, 'contracts', []);
  }
  async initialize() {
    if (((this.contracts = []), !this.config.workspaceRoot)) {
      this.logger.logToOutput(
        'Workspace root not defined. Please open a Foundry project.'
      ),
        K__namespace.window.showErrorMessage('Workspace root not defined.');
      return;
    }
    let e = K__namespace.Uri.joinPath(
        this.config.workspaceRoot,
        this.config.testDir
      ),
      r = new K__namespace.RelativePattern(e, '**/*.sol'),
      n = await K__namespace.workspace.findFiles(r);
    for (let s of n) {
      let o = Tt__namespace.basename(s.fsPath);
      if (this.isTestFile(o))
        try {
          let i = await K__namespace.workspace.fs.readFile(s),
            c = new TextDecoder().decode(i),
            d = this.extractContractNameFromSource(c, o),
            p = this.extractTestFunctionsFromSource(c).map(h => ({
              ...h,
              filePath: s.fsPath,
              contractName: d,
            }));
          if (p.length === 0 || !d) continue;
          let u = Tt__namespace.relative(
            this.config.workspaceRoot.fsPath,
            s.fsPath
          ).replace(/\\/g, '/');
          this.contracts.push({
            fileName: o,
            filePath: u,
            isFolder: false,
            tests: p,
          });
        } catch {
          continue;
        }
    }
    this.setupFileWatcher();
  }
  extractContractNameFromSource(e, r) {
    let n = e.match(/contract\s+(\w+)(?:\s+is\s+.*?)?\s*\{/);
    return n && n[1] ? n[1] : r.replace(/\.sol$/, '');
  }
  extractTestFunctionsFromSource(e) {
    return Array.from(e.matchAll(this.functionRegex), r => r[1]).map(r => ({
      testName: r,
      contractName: '',
      status: false,
      filePath: '',
    }));
  }
  setupFileWatcher() {
    let e = K__namespace.workspace.workspaceFolders;
    if (!(!e || e.length === 0))
      try {
        let r = new K__namespace.RelativePattern(
          e[0],
          `${this.config.testDir}/**/*.t.sol`
        );
        (this.watcher = K__namespace.workspace.createFileSystemWatcher(r)),
          this.watcher.onDidCreate(() => this.triggerRefresh()),
          this.watcher.onDidChange(() => this.triggerRefresh()),
          this.watcher.onDidDelete(() => this.triggerRefresh());
      } catch {}
  }
  getIndividualTests() {
    let e = [];
    for (let r of this.contracts)
      for (let n of r.tests)
        e.push({
          contractName: r.fileName,
          testName: n.testName,
          filePath: r.filePath,
          viaIR: false,
          status: false,
        });
    return e;
  }
  triggerRefresh() {
    this.debounceTimer && clearTimeout(this.debounceTimer),
      (this.debounceTimer = setTimeout(async () => {
        await this.initialize(),
          this._onDidChangeContracts.fire(this.contracts);
      }, 1e3));
  }
  async refresh() {
    await this.initialize(), this._onDidChangeContracts.fire(this.contracts);
  }
  isTestFile(e) {
    return /^[^.\\/]+\.t\.sol$/.test(e);
  }
  dispose() {
    this.watcher && this.watcher.dispose(),
      this.debounceTimer && clearTimeout(this.debounceTimer),
      this._onDidChangeContracts.dispose();
  }
};
f();
var Ku = class {
  constructor(e, r, n, s) {
    this.contracts = e;
    this.onDidChangeContracts = r;
    this.foundryController = n;
    this.logger = s;
    Q(this, 'testController');
    Q(this, 'testItems', new Map());
    Q(this, 'testData', new Map());
    Q(this, 'currentRun');
    Q(
      this,
      'currentCancellationTokenSource',
      new K__namespace.CancellationTokenSource()
    );
    (this.testController = K__namespace.tests.createTestController(
      'forgeCockpitTests',
      'Forge cockpit Tests'
    )),
      this.onDidChangeContracts(o => {
        (this.contracts = o), this.refreshTests();
      }),
      this.testController.createRunProfile(
        'Run Test',
        K__namespace.TestRunProfileKind.Run,
        (o, i) => this.runHandler(o, i, false),
        true
      ),
      this.testController.createRunProfile(
        'Run Test via IR',
        K__namespace.TestRunProfileKind.Run,
        (o, i) => this.runHandler(o, i, true)
      ),
      this.testController.createRunProfile(
        'Verbose',
        K__namespace.TestRunProfileKind.Coverage,
        (o, i) => this.runHandler(o, i, false, '-vvvvv'),
        false
      ),
      this.refreshTests();
  }
  resetTestStates() {
    this.refreshTests();
  }
  async stopTests(e) {
    this.currentCancellationTokenSource &&
      (this.currentCancellationTokenSource.cancel(),
      this.currentCancellationTokenSource.dispose()),
      this.currentRun && (this.currentRun.end(), (this.currentRun = void 0)),
      this.testController.refreshHandler &&
        (await this.testController.refreshHandler(e));
  }
  async refreshTests() {
    this.clearAllTests(), this.buildTestStructure();
  }
  clearAllTests() {
    this.testController.items.forEach(e => this.disposeTestItem(e)),
      this.testController.items.replace([]),
      this.testItems.clear(),
      this.testData.clear(),
      this.testController.invalidateTestResults();
  }
  disposeTestItem(e) {
    var r;
    (r = e.children) == null || r.forEach(n => this.disposeTestItem(n));
  }
  buildTestStructure() {
    let e = this.testController.createTestItem(
      'test',
      'test',
      K__namespace.Uri.file('test')
    );
    (e.canResolveChildren = true),
      this.testItems.set('test', e),
      this.testController.items.add(e),
      this.buildFolderStructure(),
      this.contracts.forEach(r => this.addTestContract(r));
  }
  buildFolderStructure() {
    let e = new Set(['test']);
    for (let r of this.contracts) {
      if (!r.filePath) continue;
      let s = r.filePath.replace(/\\/g, '/').split('/'),
        o = 'test';
      for (let i = 0; i < s.length - 1; i++) {
        let c = s[i],
          d = `${o}/${c}`;
        if (!e.has(d)) {
          let p = this.testItems.get(o);
          if (p) {
            let u = this.testController.createTestItem(
              d,
              c,
              K__namespace.Uri.file(d)
            );
            (u.canResolveChildren = true),
              p.children.add(u),
              this.testItems.set(d, u),
              e.add(d);
          }
        }
        o = d;
      }
    }
  }
  addTestContract(e) {
    var u;
    if (!e.filePath) return;
    let r = e.filePath.replace(/\\/g, '/'),
      n = r.split('/'),
      s = n.slice(0, n.length - 1).join('/'),
      o = s ? `test/${s}` : 'test',
      i = this.testItems.get(o);
    if (!i) return;
    let c = this.foundryController.getConfig().workspaceRoot,
      d = K__namespace.Uri.joinPath(c, e.filePath),
      p = this.testController.createTestItem(r, e.fileName, d);
    (p.canResolveChildren = true),
      this.testItems.set(r, p),
      i.children.add(p),
      ((u = e.tests) == null ? void 0 : u.length) > 0 &&
        e.tests.forEach(h => this.addTestMethod(p, e.filePath, h, d));
  }
  addTestMethod(e, r, n, s) {
    let o = `${r}:${n.testName}`,
      i = this.testController.createTestItem(o, n.testName, s);
    this.testData.set(o, { contractName: r, testName: n.testName }),
      e.children.add(i),
      this.testItems.set(o, i);
  }
  async runHandler(e, r, n, s) {
    this.stopTests(r),
      (this.currentCancellationTokenSource =
        new K__namespace.CancellationTokenSource()),
      (this.currentRun = this.testController.createTestRun(e));
    let o = this.currentRun,
      i = [];
    e.include
      ? e.include.forEach(p => this.collectTestItems(p, i, e.exclude))
      : this.testController.items.forEach(p =>
          this.collectTestItems(p, i, e.exclude)
        );
    let c = i.length;
    o.appendOutput(`Running ${c} tests`);
    let d = {
      ...this.foundryController.getConfig(),
      viaIR: n,
      verbosity: s || '',
    };
    if (c === 0) {
      o.appendOutput('No tests found to run.'),
        this.logger.logToOutput('No tests found to run.'),
        o.end(),
        (this.currentRun = void 0),
        this.currentCancellationTokenSource.dispose();
      return;
    }
    if (
      this.currentCancellationTokenSource.token.isCancellationRequested ||
      r.isCancellationRequested
    ) {
      o.appendOutput('Test execution cancelled.'),
        this.logger.logToOutput('Test execution cancelled.'),
        o.end(),
        (this.currentRun = void 0),
        this.currentCancellationTokenSource.dispose();
      return;
    }
    i.forEach(p => {
      this.testData.get(p.id) && o.started(p);
    });
    try {
      if (i.length === 1) {
        let p = this.testData.get(i[0].id);
        if (!p)
          o.failed(i[0], new K__namespace.TestMessage('Test info not found')),
            o.appendOutput(`Test failed: ${i[0].label} - Test info not found`),
            this.logger.logToOutput(
              `Test failed: ${i[0].label} - Test info not found`
            );
        else {
          let u = await this.foundryController.runTest(
            p.contractName,
            p == null ? void 0 : p.testName,
            d
          );
          if (u.success) {
            o.passed(i[0]);
            let h = `Test passed: ${p.testName}`;
            o.appendOutput(h), this.logger.logToOutput(h);
          } else {
            o.failed(
              i[0],
              new K__namespace.TestMessage(`Error running test ${u.error}`)
            );
            let h = `Test failed: ${p.testName} - ${u.error}`;
            o.appendOutput(h), this.logger.logToOutput(h);
          }
        }
      } else {
        let p = await this.foundryController.runAllTests(d);
        i.forEach(u => {
          var E;
          let h = this.testData.get(u.id);
          if (!h) {
            o.failed(u, new K__namespace.TestMessage('Test info not found'));
            return;
          }
          let g =
              (E = u.id.split(':')[0]) == null ? void 0 : E.split('/').pop(),
            b = p.find(T => T.fileName === g);
          b && b.success
            ? (o.passed(u),
              o.appendOutput(`Test passed: ${h.testName}`),
              this.logger.logToOutput(`Test passed: ${h.testName}`))
            : b
              ? (o.failed(
                  u,
                  new K__namespace.TestMessage(
                    `Test failed: ${b.error || 'Test failed'}`
                  )
                ),
                o.appendOutput(
                  `Test failed: ${h.testName} - ${b.error || 'Test failed'}`
                ),
                this.logger.logToOutput(
                  `Test failed: ${h.testName} - ${b.error || 'Test failed'}`
                ))
              : (o.failed(
                  u,
                  new K__namespace.TestMessage('Test not found in results')
                ),
                o.appendOutput(
                  `Test failed: ${h.testName} - Test not found in results`
                ),
                this.logger.logToOutput(
                  `Test failed: ${h.testName} - Test not found in results`
                ));
        });
      }
    } catch (p) {
      i.forEach(u => {
        let h = this.testData.get(u.id);
        if (!h) return;
        let g = new K__namespace.TestMessage(`Execution error: ${p.message}`);
        o.failed(u, g),
          o.appendOutput(`Test failed: ${h.testName} - Execution error`);
      }),
        o.appendOutput(`Test execution error: ${p.message}`),
        this.logger.logToOutput(`Test execution error: ${p.stack}`);
    }
    o.appendOutput('Test execution complete.'),
      o.end(),
      (this.currentRun = void 0),
      this.currentCancellationTokenSource.dispose();
  }
  collectTestItems(e, r, n) {
    var s;
    if (!(n != null && n.includes(e))) {
      if (this.testData.has(e.id)) {
        r.push(e);
        return;
      }
      (s = e.children) == null ||
        s.forEach(o => this.collectTestItems(o, r, n));
    }
  }
  runTest(e) {
    let r = `${e.contractName}:${e.testName}`,
      n = this.testItems.get(r);
    if (n) {
      let s = new K__namespace.TestRunRequest([n]);
      this.runHandler(
        s,
        new K__namespace.CancellationTokenSource().token,
        false
      );
    }
  }
  runTestViaIR(e) {
    let r = `${e.contractName}:${e.testName}`,
      n = this.testItems.get(r);
    if (n) {
      let s = new K__namespace.TestRunRequest([n]);
      this.runHandler(
        s,
        new K__namespace.CancellationTokenSource().token,
        true
      );
    }
  }
  runGroup(e) {
    let r = this.testItems.get(e);
    if (r) {
      let n = new K__namespace.TestRunRequest([r]);
      this.runHandler(
        n,
        new K__namespace.CancellationTokenSource().token,
        false
      );
    }
  }
  dispose() {
    this.stopTests(this.currentCancellationTokenSource.token),
      this.testController.dispose();
  }
};
f();
f();
var z1 = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }

      #webview-patch-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      .outer {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    </style>

    <script type="module" id="webview-patch">
      const TAG = '[@tomjs:vscode:extension] ';

      function onDomReady(callback, doc) {
        const _doc = doc || document;
        if (_doc.readyState === 'interactive' || _doc.readyState === 'complete') {
          callback();
        } else {
          _doc.addEventListener('DOMContentLoaded', callback);
        }
      }

      let vsCodeApi;

      function getApi() {
        if (vsCodeApi) return vsCodeApi;
        return (vsCodeApi = acquireVsCodeApi());
      }

      function sendInitData(iframe) {
        console.log(TAG + 'init data');
        const dataset = {};
        Object.keys(document.body.dataset).forEach((key) => {
          dataset[key] = document.body.dataset[key];
        });

        iframe.contentWindow.postMessage(
          {
            type: '[vscode:extension]:init',
            data: {
              state: getApi().getState(),
              style: document.getElementById('_defaultStyles').innerHTML,
              root: {
                cssText: document.documentElement.style.cssText,
              },
              body: {
                dataset: dataset,
                className: document.body.className,
                role: document.body.getAttribute('role'),
              },
            },
          },
          '*',
        );
      }

      function observeAttributeChanges(element, attributeName, callback) {
        const observer = new MutationObserver(function (mutationsList) {
          for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === attributeName) {
              callback(mutation.target.getAttribute(attributeName));
            }
          }
        });
        observer.observe(element, { attributes: true });
        return observer;
      }

      // message handler
      let iframeLoaded = false;
      const cacheMessages = [];

      function handleMessage(e) {
        const iframe = document.getElementById('webview-patch-iframe');
        if (!iframeLoaded || !iframe) {
          return;
        }
        if (e.origin.startsWith('vscode-webview://')) {
          iframe.contentWindow.postMessage(e.data, '*');
        } else if ('{{serverUrl}}'.startsWith(e.origin)) {
          const { type, data } = e.data;
          console.log(TAG + ' received:', e.data);
          if (type === '[vscode:client]:postMessage') {
            getApi().postMessage(data);
          } else if (type === '[vscode:client]:commands') {
            if (data === 'F1') {
              window.dispatchEvent(
                new KeyboardEvent('keydown', {
                  key: 'F1',
                  keyCode: 112,
                  code: 'F1',
                }),
              );
            }
          }
        }
      }

      window.addEventListener('message', function (event) {
        if (event.origin.startsWith('vscode-webview://')) {
          cacheMessages.push(event);
          return;
        }
        handleMessage(event);
      });

      let isCacheWorking = false;
      setInterval(() => {
        if (isCacheWorking) {
          return;
        }

        isCacheWorking = true;
        if (iframeLoaded) {
          let event = cacheMessages.shift();
          while (event) {
            handleMessage(event);
            event = cacheMessages.shift();
          }
        }
        isCacheWorking = false;
      }, 50);

      onDomReady(function () {
        /**  @type {HTMLIFrameElement} */
        const iframe = document.getElementById('webview-patch-iframe');
        observeAttributeChanges(document.body, 'class', function (className) {
          sendInitData(iframe);
        });

        onDomReady(function () {
          iframeLoaded = true;
          sendInitData(iframe);
        }, iframe.contentDocument);

        iframe.addEventListener('load', function (e) {
          iframeLoaded = true;

          let interval = setInterval(() => {
            try {
              if (document.getElementById('_defaultStyles')) {
                sendInitData(iframe);
                // addListeners(iframe);
                clearInterval(interval);
                return;
              }
            } catch (e) {
              clearInterval(interval);
              console.error(e);
            }
          }, 10);
        });
      });
    </script>
  </head>

  <body>
    <div class="outer">
      <iframe
        id="webview-patch-iframe"
        frameborder="0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads"
        allow="cross-origin-isolated; autoplay; clipboard-read; clipboard-write"
        src="{{serverUrl}}"
      ></iframe>
    </div>
  </body>
</html>
`;
function _1(t) {
  let e = { serverUrl: '' };
  return Object.assign(e, t), z1.replace(/\{\{serverUrl\}\}/g, e.serverUrl);
}
var X0 = _1;
var Pe = class Pe {
  constructor(e, r) {
    Q(this, '_panel');
    Q(this, '_disposables', []);
    (this._panel = e),
      this._panel.onDidDispose(() => this.dispose(), null, this._disposables),
      (this._panel.webview.html = this._getWebviewContent(
        this._panel.webview,
        r
      )),
      this._setWebviewMessageListener(this._panel.webview);
  }
  static render(e) {
    if (Pe.currentPanel) Pe.currentPanel._panel.reveal(K.ViewColumn.One);
    else {
      let r = K.window.createWebviewPanel(
        'showForgeCockPit',
        'Forge CockPit',
        K.ViewColumn.One,
        {
          retainContextWhenHidden: true,
          enableScripts: true,
          localResourceRoots: [
            K.Uri.joinPath(e.extensionUri, 'out'),
            K.Uri.joinPath(e.extensionUri, 'dist'),
          ],
        }
      );
      Pe.currentPanel = new Pe(r, e);
    }
  }
  static isVisible() {
    var e, r;
    return (r = (e = Pe.currentPanel) == null ? void 0 : e._panel.active) !=
      null
      ? r
      : false;
  }
  static exists() {
    return Pe.currentPanel !== void 0;
  }
  dispose() {
    for (
      Pe.currentPanel = void 0, this._panel.dispose();
      this._disposables.length;

    ) {
      let e = this._disposables.pop();
      e && e.dispose();
    }
  }
  _getWebviewContent(e, r) {
    return X0({
      serverUrl: process.env.VITE_DEV_SERVER_URL,
      webview: e,
      context: r,
      injectCode: '<script>window.__FLAG1__=666;window.__FLAG2__=888;</script>',
    });
  }
  _setWebviewMessageListener(e) {
    e.onDidReceiveMessage(
      async r => {
        var o, i, c, d, p, u, h, g, b;
        let n = r.command,
          s = this.toSafePayload(r.payload);
        switch (n) {
          case We.GetActiveNodesCommand:
            await Pe.sendActiveNodes(n);
            break;
          case We.StopNodeCommand:
            let E = await K.commands.executeCommand(oe.StopNodeCommand, s);
            (o = Pe.currentPanel) == null ||
              o._panel.webview.postMessage({
                type: Rt.StopNodeResponse,
                payload: E,
                previousType: n.toString(),
              });
            break;
          case We.DeployContractCommand:
            let T = s,
              P = await K.commands.executeCommand(oe.DeployContractCommand, T);
            (i = Pe.currentPanel) == null ||
              i._panel.webview.postMessage({
                type: Rt.DeployContractResponse,
                payload: P,
                previousType: n.toString(),
              });
            break;
          case We.WalletBalancesCommand:
            let v = s,
              C = await K.commands.executeCommand(oe.WalletBalancesCommand, v);
            (c = Pe.currentPanel) == null ||
              c._panel.webview.postMessage({
                type: Rt.WalletBalancesResponse,
                payload: C,
                previousType: n.toString(),
              });
            break;
          case We.ExecuteFunctionCommand:
            let k = s,
              B = await K.commands.executeCommand(oe.ExecuteFunctionCommand, k);
            (d = Pe.currentPanel) == null ||
              d._panel.webview.postMessage({
                type: Rt.ExecuteFunctionResponse,
                payload: B,
                previousType: k.caller,
              });
            break;
          case We.TransferCommand:
            let F = await K.commands.executeCommand(oe.TransferCommand, s);
            (p = Pe.currentPanel) == null ||
              p._panel.webview.postMessage({
                type: Rt.TransferResponse,
                payload: JSON.stringify(F),
                previousType: n.toString(),
                previousPayload: s,
              });
            break;
          case Pr.ReadWalletImportCommand:
          case Pr.ReadClipboardWalletCommand:
          case Pr.ReadClipboardDeploymentCommand:
          case Pr.ReadClipboardAnvilCommand:
          case Pr.ReadClipboardConstructorArgsCommand:
          case Pr.ReadClipboardFunctionInputCommand:
          case Pr.ReadClipboardEncoderCommand:
          case Pr.ReadTransferCommand:
          case Pr.ReadClipboard:
            let O = await K.env.clipboard.readText();
            K.window.showInformationMessage(
              `Read from clipboard ${JSON.stringify(O)}`
            ),
              (u = Pe.currentPanel) == null ||
                u._panel.webview.postMessage({
                  type: Rt.ClipboardContentResponse,
                  payload: JSON.stringify(O),
                  previousType: n.toString(),
                  previousPayload: s,
                });
            break;
          case We.WriteClipboardCommand:
            K.window.showInformationMessage('Copied to Clipboard'),
              await K.env.clipboard.writeText(JSON.stringify(s));
            break;
          case We.RunScriptCommand:
            let S = await K.commands.executeCommand(oe.RunScriptCommand, s);
            (h = Pe.currentPanel) == null ||
              h._panel.webview.postMessage({
                type: Rt.RunScriptResponse,
                payload: JSON.stringify(S),
                previousType: n.toString(),
              });
            break;
          case We.StopNodeCommand:
            K.commands.executeCommand(oe.StopNodeCommand, s);
            break;
          case We.OpenLinkCommand:
            K.commands.executeCommand(oe.OpenUrlCommand, s);
            break;
          case We.AbiEncodeCommand:
            let M = j0(s);
            (g = Pe.currentPanel) == null ||
              g._panel.webview.postMessage({
                type: Rt.AbiEncodeResponse,
                payload: JSON.stringify(M),
                previousType: n.toString(),
              });
            break;
          case We.RefreshContractsCommand:
          case We.LoadContractsCommand:
            K.commands.executeCommand(oe.RefreshTestsCommand),
              K.commands.executeCommand(oe.LoadCockPitWalletsCommand);
            return;
          case We.ForkNodeCommand:
            let G = {
              ...(await K.commands.executeCommand(oe.ForkNodeCommand, s)),
              tabId: s,
            };
            (b = Pe.currentPanel) == null ||
              b._panel.webview.postMessage({
                type: Rt.ForkNodeResultsResponse,
                payload: G,
                previousType: '',
              });
            break;
          default:
            K.window.showInformationMessage(r);
        }
      },
      void 0,
      this._disposables
    );
  }
  static sendDefaultWallets(e, r) {
    var n;
    Pe.currentPanel &&
      ((n = Pe.currentPanel) == null ||
        n._panel.webview.postMessage({
          type: Rt.GetDefaultWalletsResponse,
          payload: r,
          previousType: e.toString(),
        }));
  }
  static sendContracts(e) {
    Pe.currentPanel &&
      Pe.currentPanel._panel.webview.postMessage({
        type: Rt.SetContractsResponse,
        payload: e,
      });
  }
  static async sendActiveNodes(e) {
    var r;
    if (Pe.currentPanel) {
      let n = await K.commands.executeCommand(oe.GetActiveNodesCommand);
      (r = Pe.currentPanel) == null ||
        r._panel.webview.postMessage({
          type: Rt.GetActiveNodesResponse,
          payload: n,
          previousType: e.toString(),
        });
    }
  }
  toSafePayload(e) {
    if (typeof e == 'string')
      try {
        return JSON.parse(e);
      } catch {
        return e;
      }
    return e;
  }
};
Q(Pe, 'currentPanel');
var Nn = Pe;
f();
f();
var Di = class extends K__namespace.TreeItem {
  constructor(r, n, s, o) {
    super(r, K__namespace.TreeItemCollapsibleState.None);
    this.label = r;
    this.tooltip = n;
    this.command = s;
    (this.tooltip = n),
      (this.command = s),
      (this.iconPath = new K__namespace.ThemeIcon(o));
  }
};
var Yu = class {
  constructor() {
    Q(this, '_onDidChangeTreeData', new K__namespace.EventEmitter());
    Q(this, 'onDidChangeTreeData', this._onDidChangeTreeData.event);
  }
  refresh() {
    this._onDidChangeTreeData.fire();
  }
  getTreeItem(e) {
    return e;
  }
  getChildren(e) {
    if (e) return Promise.resolve([]);
    let r = [];
    return (
      r.push(
        new Di(
          'Open Cockpit',
          'Open the Forge Cockpit panel',
          { command: oe.ShowForgeCockPitCommand, title: 'Open Cockpit' },
          'play'
        ),
        new Di(
          'Clear Cockpit Cache',
          'Clear Forge Cockpit cache',
          { command: oe.ClearCacheCommand, title: 'Clear Cache' },
          'notebook-delete-cell'
        )
      ),
      Promise.resolve(r)
    );
  }
};
f();
var Xu = class {
  constructor(e, r) {
    this.foundryProjectController = e;
    this.logger = r;
    Q(this, 'abis', []);
    Q(this, 'watcher');
    Q(this, '_onDidChangeAbis', new K__namespace.EventEmitter());
    Q(this, 'onDidChangeAbis', this._onDidChangeAbis.event);
    Q(this, 'debounceTimer');
  }
  initialize() {
    this.logger.updateStatusBar(
      '$(beaker~spin) Forge cockpit loading ABIs',
      new K__namespace.ThemeColor('statusBarItem.successBackground')
    ),
      this.setupFileWatcher(),
      this.foundryProjectController.onDidBuildSucceed(() => {
        this.refresh();
      }),
      this.logger.updateStatusBar(
        '$(check) Forge cockpit ready',
        new K__namespace.ThemeColor('statusBarItem.successBackground')
      );
  }
  async loadAbis() {
    try {
      this.abis = await this.foundryProjectController.getAllContractABIs();
    } catch {}
  }
  setupFileWatcher() {
    let e = K__namespace.workspace.workspaceFolders;
    if (!e || e.length === 0) return;
    let r = this.foundryProjectController.getConfig().outputDir || 'out';
    try {
      let n = new K__namespace.RelativePattern(e[0], `${r}/**/*.json`);
      (this.watcher = K__namespace.workspace.createFileSystemWatcher(n)),
        this.watcher.onDidCreate(() => this.triggerRefresh('create')),
        this.watcher.onDidChange(() => this.triggerRefresh('change')),
        this.watcher.onDidDelete(() => this.triggerRefresh('delete')),
        console.log(`Output watcher set up for ${r}/**/*.json`);
    } catch (n) {
      console.error('Error setting up file watcher:', n);
    }
  }
  triggerRefresh(e) {
    this.debounceTimer && clearTimeout(this.debounceTimer),
      (this.debounceTimer = setTimeout(async () => {
        await this.loadAbis(), this._onDidChangeAbis.fire();
      }, 1e3));
  }
  async refresh() {
    await this.loadAbis(), this._onDidChangeAbis.fire();
  }
  async triggerBuild() {
    await this.foundryProjectController.triggerBuild();
  }
  dispose() {
    this.watcher && this.watcher.dispose(),
      this.debounceTimer && clearTimeout(this.debounceTimer),
      this.foundryProjectController.dispose(),
      this._onDidChangeAbis.dispose();
  }
};
f();
var Qu = class {
  constructor(e, r, n) {
    Q(this, 'contractName');
    Q(this, 'abi');
    Q(this, 'logger');
    Q(this, 'sourceCode', '');
    Q(this, 'dependencies', new Set());
    Q(this, 'events', new Map());
    Q(this, 'stateVariables', new Map());
    Q(this, 'abiEvents', new Map());
    Q(this, 'errors', new Map());
    Q(this, 'patterns', [
      {
        name: 'foundry-uups',
        detect: (e, r) =>
          e.includes('openzeppelin-foundry-upgrades') &&
          (e.includes('UUPS') || this.hasInitializer(r)),
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
        detect: (e, r) =>
          e.includes('openzeppelin-foundry-upgrades') &&
          e.includes('Transparent'),
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
        detect: (e, r) =>
          (e.includes('upgradeable') ||
            e.includes('proxy') ||
            this.hasInitializer(r)) &&
          !e.includes('foundry-upgrades'),
        template: {
          imports:
            'import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";',
          declarations: `ERC1967Proxy public proxy;
    address public implementation;`,
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
    Q(
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
    (this.contractName = e),
      (this.abi = r),
      (this.logger = n),
      this.findDependencies(),
      this.extractAbiEvents(),
      this.extractAbiErrors();
  }
  async generateTestFile(e) {
    var r;
    try {
      let n =
        (r = K__namespace.workspace.workspaceFolders) == null ? void 0 : r[0];
      if (!n) throw new Error('No workspace folder found.');
      let s = Tt__namespace.default.join(n.uri.fsPath, e),
        o = await K__namespace.workspace.fs.readFile(K__namespace.Uri.file(s));
      (this.sourceCode = Buffer.from(o).toString('utf8')),
        this.extractStateVariables(),
        this.mapFunctionEvents();
      let i = this.renderTemplate(),
        c = await K__namespace.workspace.openTextDocument({
          content: i,
          language: 'solidity',
        });
      await K__namespace.window.showTextDocument(c),
        this.logger.logToOutput(`Generated test file for ${this.contractName}`);
    } catch (n) {
      this.logger.logToOutput(`Error generating test file: ${n.stack}`);
    }
  }
  extractAbiEvents() {
    let e = this.abi.filter(r => r.type === 'event');
    for (let r of e) r.name && this.abiEvents.set(r.name, r);
  }
  extractAbiErrors() {
    let e = this.abi.filter(r => r.type === 'error');
    for (let r of e) r.name && this.errors.set(r.name, r);
  }
  extractStateVariables() {
    if (!this.sourceCode) return;
    let e =
        /(?:uint256|uint\d*|int256|int\d*|bool|address|string|bytes\d*|mapping\([^)]+\)|struct\s+\w+|\w+)\s+(public|private|internal|constant|immutable)\s+(\w+)(?:\s*=\s*[^;]+)?;/g,
      r;
    for (; (r = e.exec(this.sourceCode)) !== null; ) {
      let n = r[0].split(/\s+/)[0],
        s = r[1],
        o = r[2];
      this.stateVariables.set(o, { name: o, type: n, visibility: s });
    }
  }
  mapFunctionEvents() {
    if (!this.sourceCode) return;
    let e =
        /function\s+(\w+)\s*\([^)]*\)\s*[^{]*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
      r;
    for (; (r = e.exec(this.sourceCode)) !== null; ) {
      let n = r[1],
        s = r[2],
        o = this.extractEmittedEvents(s);
      o.length > 0 && this.events.set(n, o);
    }
  }
  extractEmittedEvents(e) {
    var o, i;
    let r = [],
      n = /emit\s+(\w+)\s*\(([^)]*)\)/g,
      s;
    for (; (s = n.exec(e)) !== null; ) {
      let c = s[1],
        d = this.abiEvents.get(c);
      if (d) {
        let p = {
          name: c,
          signature: this.buildEventSignature(d),
          indexed:
            ((o = d.inputs) == null
              ? void 0
              : o.filter(u => u.indexed).map(u => u.name)) || [],
          nonIndexed:
            ((i = d.inputs) == null
              ? void 0
              : i.filter(u => !u.indexed).map(u => u.name)) || [],
          inputs: d.inputs || [],
        };
        r.push(p);
      }
    }
    return r;
  }
  buildEventSignature(e) {
    if (!e.inputs || e.inputs.length === 0) return `${e.name}()`;
    let r = e.inputs.map(n => n.type).join(',');
    return `${e.name}(${r})`;
  }
  analyzeFunction(e) {
    let r = e.name,
      n = this.events.get(r) || [],
      s = false,
      o = [],
      i = [],
      c = false;
    if (this.sourceCode && r) {
      let d = this.sourceCode.match(
        new RegExp(
          `function\\s+${r}\\s*\\([^)]*\\)\\s*[^{]*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}`,
          'g'
        )
      );
      if (d && d[0]) {
        let p = d[0];
        for (let [u, h] of this.stateVariables)
          (p.includes(`${u} =`) ||
            p.includes(`${u}++`) ||
            p.includes(`${u}--`) ||
            p.includes(`++${u}`) ||
            p.includes(`--${u}`) ||
            p.includes(`${u}[`) ||
            p.includes(`${u}.`)) &&
            ((s = true), i.push(u)),
            p.includes(u) && o.push(u);
        c =
          p.includes('require(') ||
          p.includes('revert(') ||
          p.includes('assert(') ||
          p.includes('_revert');
      }
    }
    return (
      s || (s = e.stateMutability !== 'view' && e.stateMutability !== 'pure'),
      {
        modifiesState: s,
        accessesState: [...new Set(o)],
        modifiesVariables: [...new Set(i)],
        hasEvents: n.length > 0,
        eventCount: n.length,
        isPayable: e.stateMutability === 'payable',
        canRevert: c,
      }
    );
  }
  renderTemplate() {
    let e = this.detectPattern(),
      r = this.buildContext(e);
    return this.replaceTokens(this.baseTemplate, r);
  }
  detectPattern() {
    return (
      this.patterns.find(e => e.detect(this.sourceCode, this.abi)) ||
      this.patterns[3]
    );
  }
  buildContext(e) {
    return {
      CONTRACT: this.contractName,
      CONTRACT_VAR: this.contractName.toLowerCase(),
      DEPENDENCY_IMPORTS: this.renderDependencyImports(),
      DEPENDENCY_DECLARATIONS: this.renderDependencyDeclarations(),
      DEPENDENCY_SETUP: this.renderDependencySetup(),
      PATTERN_IMPORTS: e.template.imports
        ? `
${e.template.imports}`
        : '',
      PATTERN_DECLARATIONS: e.template.declarations
        ? `
    ${e.template.declarations}`
        : '',
      PATTERN_SETUP: this.replaceTokens(e.template.setup, {
        CONTRACT: this.contractName,
        CONTRACT_VAR: this.contractName.toLowerCase(),
        INIT_DATA: this.getInitData(),
        CONSTRUCTOR_PARAMS: this.getConstructorParams(),
      }),
      TESTS: this.renderTests(),
      FUZZ_TESTS: this.renderFuzzTests(),
    };
  }
  replaceTokens(e, r) {
    return Object.entries(r).reduce(
      (n, [s, o]) => n.replace(new RegExp(`{{${s}}}`, 'g'), o),
      e
    );
  }
  hasInitializer(e) {
    return e.some(r => r.name === 'initialize');
  }
  findDependencies() {
    let e = this.abi.filter(
      r => r.type === 'constructor' || r.name === 'initialize'
    );
    for (let r of e)
      if (r.inputs)
        for (let n of r.inputs) {
          let s = this.extractContractName(n);
          s && s !== this.contractName && this.dependencies.add(s);
        }
  }
  extractContractName(e) {
    var r;
    if ((r = e.internalType) != null && r.includes('contract ')) {
      let n = e.internalType.match(/contract\s+([^\s]+)/);
      return (n == null ? void 0 : n[1]) || null;
    }
    return null;
  }
  renderDependencyImports() {
    let e = Array.from(this.dependencies).map(r => `import "src/${r}.sol";`)
      .join(`
`);
    return e
      ? `
${e}`
      : '';
  }
  renderDependencyDeclarations() {
    return this.dependencies.size === 0
      ? ''
      : `
    ${Array.from(this.dependencies).map(r => `${r} public ${r.toLowerCase()};`)
      .join(`
    `)}`;
  }
  renderDependencySetup() {
    return this.dependencies.size === 0
      ? ''
      : `${Array.from(this.dependencies).map(
          r => `        ${r.toLowerCase()} = new ${r}();`
        ).join(`
`)}
`;
  }
  getInitData() {
    var r;
    let e = this.abi.find(n => n.name === 'initialize');
    return (r = e == null ? void 0 : e.inputs) != null && r.length
      ? `abi.encodeCall(${this.contractName}.initialize, (${this.buildParamList(e.inputs)}))`
      : '""';
  }
  getConstructorParams() {
    let e = this.abi.find(r => r.type === 'constructor');
    return e != null && e.inputs ? this.buildParamList(e.inputs) : '';
  }
  buildParamList(e) {
    return e
      .map(r => {
        let n = this.extractContractName(r);
        return n && this.dependencies.has(n)
          ? n.toLowerCase()
          : this.getDefaultValue(r);
      })
      .join(', ');
  }
  getDefaultValue(e) {
    let r = e.type;
    if (this.isStructType(e)) return this.buildStructLiteral(e);
    if (r != null && r.startsWith('uint'))
      return (parseInt(r.replace('uint', '')) || 256) <= 8 ? '1' : '100';
    if (r != null && r.startsWith('int')) return '1';
    if (r === 'bool') return 'true';
    if (r === 'address') return 'address(0x1)';
    if (r === 'string') return '"test"';
    if (r === 'bytes' || (r != null && r.startsWith('bytes') && r !== 'bytes'))
      return '"0x01"';
    if (r != null && r.endsWith('[]'))
      return `new ${r.replace(/\[\]$/, '')}[](0)`;
    if (r != null && r.match(/\[\d+\]$/)) {
      let n = r.match(/(.+)\[(\d+)\]$/);
      if (n) {
        let s = n[1],
          o = parseInt(n[2]),
          i = this.getDefaultValue({ type: s });
        return `[${Array(Math.min(o, 3)).fill(i).join(', ')}${o > 3 ? ', ...' : ''}]`;
      }
    }
    return r != null && r.startsWith('enum '), '0';
  }
  isStructType(e) {
    return (e == null ? void 0 : e.type) === 'tuple';
  }
  buildStructLiteral(e) {
    var s;
    let r = this.getStructName(e);
    if (!((s = e.components) != null && s.length))
      return `${this.contractName}.${r}({})`;
    let n = e.components
      .map(o => `${o.name}: ${this.getDefaultValue(o)}`)
      .join(', ');
    return `${this.contractName}.${r}({${n}})`;
  }
  getStructName(e) {
    var r, n, s;
    if ((r = e.internalType) != null && r.includes('struct')) {
      let o = e.internalType.match(/struct\s+(?:[^.]+\.)?([^.\[\]\s]+)/);
      if (o != null && o[1]) return o[1];
    }
    if (this.sourceCode && e.name) {
      let o = this.toPascalCase(e.name);
      if (new RegExp(`struct\\s+${o}\\s*{`, 'g').test(this.sourceCode))
        return o;
      let c = this.sourceCode.match(/struct\s+([A-Za-z_][A-Za-z0-9_]*)\s*{/g);
      if (c) {
        for (let d of c) {
          let p =
            (n = d.match(/struct\s+([A-Za-z_][A-Za-z0-9_]*)/)) == null
              ? void 0
              : n[1];
          if (p && p.toLowerCase() === e.name.toLowerCase()) return p;
        }
        if (c.length > 0) {
          let d =
            (s = c[0].match(/struct\s+([A-Za-z_][A-Za-z0-9_]*)/)) == null
              ? void 0
              : s[1];
          if (d) return d;
        }
      }
    }
    return e.name ? this.toPascalCase(e.name) : 'TestStruct';
  }
  renderTests() {
    let e = this.abi.filter(
        n =>
          n.type === 'function' &&
          n.name &&
          n.name !== 'initialize' &&
          !this.isStateVariableGetter(n)
      ),
      r = '';
    for (let n of e)
      (r += this.renderSingleTest(n)), (r += this.renderRevertTests(n));
    return r;
  }
  isStateVariableGetter(e) {
    var r, n;
    return !this.sourceCode ||
      e.stateMutability !== 'view' ||
      ((r = e.inputs) == null ? void 0 : r.length) !== 0
      ? false
      : this.stateVariables.has(e.name) &&
          ((n = this.stateVariables.get(e.name)) == null
            ? void 0
            : n.visibility) === 'public';
  }
  renderSingleTest(e) {
    var d;
    let r = this.toPascalCase(e.name),
      n = this.buildParamList(e.inputs || []),
      s = e.stateMutability === 'view' || e.stateMutability === 'pure',
      o = this.analyzeFunction(e);
    if (s && (d = e.outputs) != null && d.length) {
      let p = e.outputs[0],
        u = this.getType(p),
        h = this.generateViewAssertion(p, 'result', o);
      return `
    function test_${r}() public view {
        ${u} result = ${this.contractName.toLowerCase()}.${e.name}(${n});
        ${h}
    }
`;
    }
    let i = this.generateEventAssertions(e.name),
      c = this.generateStateAssertions(o);
    return `
    function test_${r}() public {
        // Change caller as needed (ALICE, BOB, CHARLIE, DAVE)
        vm.startPrank(BOB);
        ${i.setup}
        ${this.contractName.toLowerCase()}.${e.name}${o.isPayable ? '{value: 1 ether}' : ''}(${n});
        vm.stopPrank();
        ${i.assertions}
        ${c}
    }
`;
  }
  generateEventAssertions(e) {
    let r = this.events.get(e);
    if (!r || r.length === 0) return { setup: '', assertions: '' };
    let n = 'vm.recordLogs();',
      s = r.map((o, i) => {
        let c = `Vm.Log[] memory logs = vm.getRecordedLogs();
        assertGe(logs.length, ${i + 1});
        assertEq(logs[${i}].topics[0], keccak256("${o.signature}"));`;
        return (
          o.indexed.length > 0 &&
            (c += `
        /// @dev Verify indexed parameters: ${o.indexed.join(', ')}`),
          o.nonIndexed.length > 0 &&
            (c += `
        /// @dev Decode and verify non-indexed parameters: ${o.nonIndexed.join(', ')}`),
          c
        );
      }).join(`
        `);
    return { setup: n, assertions: s };
  }
  generateViewAssertion(e, r, n) {
    let s = e.type;
    if (
      (s != null && s.startsWith('uint')) ||
      (s != null && s.startsWith('int'))
    )
      return `assertTrue(${r} >= 0 || ${r} < 0);`;
    if (s === 'bool') return `assertTrue(${r}) || assertFalse(${r});`;
    if (s === 'address')
      return `assertTrue(${r} != address(0) || ${r} == address(0));`;
    if (s === 'string') return `assertTrue(bytes(${r}).length >= 0);`;
    if (this.isStructType(e)) {
      this.getStructName(e);
      return e.components && e.components.length > 0
        ? e.components.map(c => 'assertTrue(true);').join(`
        `)
        : 'assertTrue(true);';
    }
    return s != null && s.endsWith('[]')
      ? `assertTrue(${r}.length >= 0);`
      : 'assertTrue(true);';
  }
  generateStateAssertions(e) {
    if (!e.modifiesState && !e.hasEvents) return '';
    let r = [];
    if (e.modifiesVariables.length > 0)
      for (let n of e.modifiesVariables) {
        let s = this.stateVariables.get(n);
        s && s.visibility === 'public' && r.push('assertTrue(true);');
      }
    return r.length > 0
      ? r.join(`
        `)
      : '';
  }
  renderRevertTests(e) {
    if (!this.analyzeFunction(e).canRevert) return '';
    let n = this.toPascalCase(e.name),
      s = this.buildParamList(e.inputs || []),
      o = this.extractFunctionModifiers(e.name),
      i = '';
    if (
      (o.length > 0 &&
        (i += o
          .map(c => {
            let d = this.generateModifierFailureTest(c);
            return `
    function test_RevertWhen_${n}_${this.toPascalCase(c)}Fails() public {
        vm.startPrank(ALICE);
        ${d.setup}
        vm.expectRevert(${d.expectedError});
        ${this.contractName.toLowerCase()}.${e.name}(${s});
        vm.stopPrank();
    }`;
          })
          .join('')),
      e.inputs && e.inputs.length > 0)
    ) {
      let c = e.inputs
        .map(d => {
          var p, u;
          return d.type === 'address'
            ? 'address(0)'
            : ((p = d.type) != null && p.startsWith('uint')) ||
                ((u = d.type) != null && u.startsWith('int'))
              ? '0'
              : d.type === 'string' || d.type === 'bytes'
                ? '""'
                : d.type === 'bool'
                  ? 'false'
                  : this.getDefaultValue(d);
        })
        .join(', ');
      i += `
    function test_RevertWhen_${n}_InvalidInput() public {
        vm.startPrank(ALICE);
        vm.expectRevert();
        ${this.contractName.toLowerCase()}.${e.name}(${c});
        vm.stopPrank();
    }`;
    }
    return i;
  }
  generateModifierFailureTest(e) {
    if (this.sourceCode) {
      let r = this.sourceCode.match(
        new RegExp(
          `modifier\\s+${e}\\s*\\([^)]*\\)\\s*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}`,
          'g'
        )
      );
      if (r && r[0]) {
        let n = r[0],
          s = n.match(/revert\s+(\w+)\s*\(/);
        if (s && this.errors.has(s[1]))
          return {
            setup: '',
            expectedError: `${this.contractName}.${s[1]}.selector`,
          };
        let o = n.match(/require\([^,)]+,\s*"([^"]+)"/);
        if (o) return { setup: '', expectedError: `"${o[1]}"` };
        if (n.includes('msg.sender') || n.includes('owner'))
          return {
            setup: 'vm.startPrank(address(0xdead));',
            expectedError: 'bytes("")',
          };
        if (n.includes('block.timestamp') || n.includes('block.number'))
          return { setup: '', expectedError: 'bytes("")' };
      }
    }
    return { setup: '', expectedError: 'bytes("")' };
  }
  extractFunctionModifiers(e) {
    if (!this.sourceCode) return [];
    let n = new RegExp(
      `function\\s+${e}\\s*\\([^)]*\\)\\s*([^{]*?)\\s*{`,
      'gm'
    ).exec(this.sourceCode);
    if (!n) return [];
    let s = n[1].trim();
    if (!s) return [];
    let i = s
        .replace(/returns\s*\([^)]*\)/gi, '')
        .trim()
        .split(/\s+/)
        .filter(p => p.length > 0),
      c = new Set([
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
      ]),
      d = i
        .map(p => p.replace(/\([^)]*\)$/, ''))
        .filter(p => !c.has(p) && p.length > 0)
        .filter(p => this.isModifierDefined(p));
    return [...new Set(d)];
  }
  isModifierDefined(e) {
    return this.sourceCode
      ? new RegExp(`modifier\\s+${e}\\s*\\([^)]*\\)\\s*{`, 'gm').test(
          this.sourceCode
        )
      : false;
  }
  renderFuzzTests() {
    return this.abi.filter(r => {
      var n;
      return (
        r.type === 'function' &&
        ((n = r.inputs) == null ? void 0 : n.length) &&
        r.name &&
        r.name !== 'initialize' &&
        !this.isStateVariableGetter(r)
      );
    }).length === 0
      ? ''
      : `

    function testFuzz_FunctionCall(address caller) public {
        vm.assume(caller != address(0));
        vm.startPrank(caller);
        assertTrue(true);
        vm.stopPrank();
    }`;
  }
  renderFuzzTest(e) {
    let r = this.toPascalCase(e.name),
      n = e.inputs
        .map((d, p) => {
          let u = this.getType(d),
            h = d.name || `param${p}`;
          return `${u} ${h}`;
        })
        .join(', '),
      s = e.inputs.map((d, p) => d.name || `param${p}`).join(', '),
      i = this.analyzeFunction(e).isPayable ? 'payable ' : '',
      c = this.generateFuzzAssumptions(e.inputs);
    return `
    function testFuzz_${r}(${n}) public ${i}{
        ${c}
        ${this.contractName.toLowerCase()}.${e.name}(${s});
        assertTrue(true);
    }`;
  }
  generateFuzzAssumptions(e) {
    let r = e.map((n, s) => {
      let o = n.name || `param${s}`,
        i = n.type;
      return i === 'address'
        ? `vm.assume(${o} != address(0));`
        : i != null && i.startsWith('uint')
          ? `vm.assume(${o} > 0);`
          : i != null && i.startsWith('int')
            ? `vm.assume(${o} != 0);`
            : 'vm.assume(true);';
    });
    return r.length > 0
      ? r.join(`
        `) +
          `
`
      : '';
  }
  getType(e) {
    if (!(e != null && e.type)) return 'unknown';
    if (this.isStructType(e)) {
      let r = this.getStructName(e);
      return `${this.contractName}.${r} memory`;
    }
    return e.type === 'string' || e.type === 'bytes' || e.type.endsWith('[]')
      ? `${e.type} memory`
      : e.type;
  }
  toPascalCase(e) {
    return e ? e.charAt(0).toUpperCase() + e.slice(1) : '';
  }
};
f();
var Zr = class {
  constructor(e, r) {
    this.rpcUrl = e;
    this.logger = r;
    Q(this, 'publicClient');
    this.publicClient = Yl({ transport: xs(this.rpcUrl) });
  }
  async getBalances(e) {
    try {
      let n = (
        await Promise.all(
          e.map(s => this.publicClient.getBalance({ address: s }))
        )
      ).map(s => sr(s).toString());
      return (
        this.logger.logToOutput(
          `Balances retrieved: ${e.length} wallets: ${n.join(', ')} ETH`
        ),
        n
      );
    } catch (r) {
      return (
        this.logger.logToOutput(
          `Balance fetch failed: ${e.length} wallets - ${r.stack}`
        ),
        Array(e.length).fill('0')
      );
    }
  }
  createChain(e, r) {
    return Ol({
      id: r,
      name: 'Forge Cockpit',
      nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
      rpcUrls: { default: { http: [e], webSocket: [] } },
    });
  }
  async executeFunction(e) {
    try {
      let r = await this.publicClient.getChainId(),
        n = Fi({
          chain: this.createChain(e.nodeUrl, r),
          transport: xs(e.nodeUrl),
        });
      if (e.staticCall) {
        let c = await this.publicClient.readContract({
          address: e.contractAddress,
          abi: e.abi,
          functionName: e.functionName,
          args: e.params,
        });
        return (
          this.logger.logToOutput(
            `Read call successful: ${e.functionName}(${JSON.stringify(e.params)}) -> ${e.contractAddress} | Result: ${JSON.stringify(c, (d, p) => (typeof p == 'bigint' ? p.toString() : p))}`
          ),
          {
            logs: JSON.stringify([]),
            hash: '0x',
            functionName: e.functionName,
            params: e.params,
            timestamp: Date.now().toString(),
            status: c !== null,
            error: '',
            result: JSON.stringify(c, (d, p) =>
              typeof p == 'bigint' ? p.toString() : p
            ),
            caller: e.caller,
            address: e.contractAddress,
          }
        );
      }
      let { request: s } = await this.publicClient.simulateContract({
          address: e.contractAddress,
          abi: e.abi,
          functionName: e.functionName,
          args: e.params,
          account: e.msgSender,
        }),
        o = await n.writeContract(s),
        i = await this.publicClient.getTransactionReceipt({ hash: o });
      return (
        this.logger.logToOutput(
          `Write call ${i.status}: ${e.functionName}(${JSON.stringify(e.params)}) -> ${e.contractAddress} | Tx: ${o} | Gas used: ${i.gasUsed.toString()} | Logs: ${i.logs.length}`
        ),
        {
          logs: _u(i.logs),
          hash: o,
          functionName: e.functionName,
          params: e.params,
          timestamp: Date.now().toString(),
          status: i.status === 'success',
          error: '',
          result: '',
          address: e.contractAddress,
          caller: e.caller,
        }
      );
    } catch (r) {
      return (
        this.logger.logToOutput(
          `Function call failed: ${e.functionName}(${JSON.stringify(e.params)}) -> ${e.contractAddress} | Error: ${r.stack}`
        ),
        {
          logs: JSON.stringify([]),
          hash: '',
          functionName: e.functionName,
          params: e.params,
          timestamp: Date.now().toString(),
          status: false,
          error: `Unable to make contract call due to error: ${r.toString()}`,
          result: '',
          address: e.contractAddress,
          caller: e.caller,
        }
      );
    }
  }
  async isAnvilNode() {
    try {
      return !!(await this.publicClient.request({
        method: 'anvil_nodeInfo',
        params: [],
      }));
    } catch {
      return false;
    }
  }
  async chainId() {
    return (await this.publicClient.getChainId()).toString();
  }
  async deployContract(e) {
    try {
      let r = await this.publicClient.getChainId(),
        n = this.createChain(e.nodeUrl, r),
        s = Fi({ chain: n, transport: xs(e.nodeUrl) });
      this.logger.logToOutput(
        `Deploy started: ${e.contractName} | Args: ${JSON.stringify(e.constructorArgs)} | Deployer: ${e.msgSender}`
      );
      let o = await s.deployContract({
          abi: e.abi,
          account: e.msgSender,
          args: e.constructorArgs,
          bytecode: e.bytecode,
          chain: n,
        }),
        i = await this.publicClient.waitForTransactionReceipt({ hash: o }),
        c = await this.publicClient.getContractEvents({
          abi: e.abi,
          address: i.contractAddress,
          fromBlock: 'earliest',
        });
      return (
        this.logger.logToOutput(
          `Deploy ${i.status}: ${e.contractName} -> ${i.contractAddress} | Tx: ${o} | Gas used: ${i.gasUsed.toString()} | Events: ${c.length}`
        ),
        {
          hash: o,
          address: i.contractAddress,
          success: i.status === 'success',
          nodeUrl: e.nodeUrl,
          contractName: e.contractName,
          logs: _u(c),
        }
      );
    } catch (r) {
      return (
        this.logger.logToOutput(
          `Deploy failed: ${e.contractName} | Args: ${JSON.stringify(e.constructorArgs)} | Deployer: ${e.msgSender} | Error: ${r.stack}`
        ),
        {
          hash: '',
          address: '',
          success: false,
          nodeUrl: e.nodeUrl,
          contractName: e.contractName,
          logs: JSON.stringify([]),
        }
      );
    }
  }
  async getContractEvents(e) {
    try {
      let r = await this.publicClient.getContractEvents({
        address: e.contractAddress,
        abi: e.abi,
        fromBlock: 'earliest',
      });
      return (
        this.logger.logToOutput(
          `Events retrieved: ${r.length} events from ${e.contractAddress} | Function: ${e.functionName}`
        ),
        {
          logs: _u(r),
          hash: '',
          functionName: e.functionName,
          params: e.params,
          timestamp: Date.now().toString(),
          status: true,
          error: '',
          result: '',
          caller: e.caller,
          address: e.contractAddress,
        }
      );
    } catch (r) {
      return (
        this.logger.logToOutput(
          `Events fetch failed: ${e.contractAddress} | Function: ${e.functionName} | Error: ${r.stack}`
        ),
        {
          logs: JSON.stringify([]),
          hash: '',
          functionName: e.functionName,
          params: e.params,
          timestamp: Date.now().toString(),
          status: false,
          error: `Unable to make contract call due to error: ${r.toString()}`,
          result: '',
          caller: e.caller,
          address: e.contractAddress,
        }
      );
    }
  }
  async transfer(e) {
    try {
      let r = await this.publicClient.getChainId(),
        n = Fi({
          chain: this.createChain(e.nodeUrl, r),
          transport: xs(e.nodeUrl),
        });
      this.logger.logToOutput(
        `Transferring ${e.amount} ETH to ${e.to} from ${e.from}`
      );
      let s = await n.sendTransaction({
          account: e.from,
          to: e.to,
          value: Dl(e.amount.toString()),
        }),
        [o, i, c] = await Promise.all([
          this.publicClient.waitForTransactionReceipt({ hash: s }),
          this.publicClient.getBalance({ address: e.from }),
          this.publicClient.getBalance({ address: e.to }),
        ]);
      return (
        this.logger.logToOutput(
          `Transferred ${e.amount} ETH to ${e.to} from ${e.from} transaction hash: ${s} new balance From: ${sr(i)} new balance To ${sr(c)}`
        ),
        { success: o.status === 'success', hash: s, error: o.status }
      );
    } catch (r) {
      let n = r;
      return (
        this.logger.logToOutput(
          `Error Transferring ${e.amount} ETH to ${e.to} from ${e.from} error ${n.stack}`
        ),
        { success: false, hash: '', error: n.message }
      );
    }
  }
};
f();
var ed = class {
  constructor() {
    Q(this, 'outputChannel');
    Q(this, 'buildStatusBar');
    (this.outputChannel =
      K__namespace.window.createOutputChannel('Forge Cockpit Logs')),
      (this.buildStatusBar = K__namespace.window.createStatusBarItem(
        K__namespace.StatusBarAlignment.Left,
        100
      )),
      (this.buildStatusBar.name = 'Forge cockpit Build Status'),
      (this.buildStatusBar.command = 'forge-cockpit.showBuildOutput'),
      (this.buildStatusBar.tooltip =
        'Forge cockpit Build Status - Click to show output'),
      this.buildStatusBar.hide(),
      this.showBuildOutput();
  }
  showBuildOutput() {
    this.outputChannel.show();
  }
  logToOutput(e) {
    let r = new Date().toLocaleTimeString();
    this.outputChannel.appendLine(`[${r}] Forge cockpit ${e}`);
  }
  dispose() {
    this.outputChannel && this.outputChannel.dispose(),
      this.buildStatusBar && this.buildStatusBar.dispose();
  }
  updateStatusBar(e, r) {
    this.buildStatusBar.hide(),
      (this.buildStatusBar.text = e),
      (this.buildStatusBar.backgroundColor =
        r != null
          ? r
          : new K__namespace.ThemeColor('statusBarItem.successBackground'));
  }
};
ny.config({ path: Tt__namespace.join(__dirname, '..', '.env') });
async function fq(t) {
  let e = new ed(),
    r = new Gu(e);
  if ((await r.initialize(), r.isFoundry())) {
    let s = new Wu(r.getConfig(), e),
      o = new Xu(r, e);
    o.initialize(), await s.initialize();
    let i = new Ku(s.contracts, s.onDidChangeContracts, r, e),
      c = new ji(r),
      d = new ju(r),
      p = new qu(),
      u = new Yu(),
      h = K__namespace.window.createTreeView('forgeCockpitActions', {
        treeDataProvider: u,
        showCollapseAll: false,
      });
    t.subscriptions.push(
      K__namespace.commands.registerCommand(
        oe.StubForgeTestsCommand,
        async g => {
          var P;
          let b = g.fileName.replace(/\.sol$/, ''),
            E =
              (P = o.abis.find(v => v.fileName === g.fileName)) == null
                ? void 0
                : P.abi;
          if (!E) {
            K__namespace.window.showErrorMessage(
              `ABI not found for ${o.abis.length} ABIs`
            );
            return;
          }
          await new Qu(b, E, e).generateTestFile(g.filePath);
        }
      ),
      K__namespace.commands.registerCommand(oe.ShowForgeCockPitCommand, () => {
        n(t),
          K__namespace.commands.executeCommand(oe.PinEditorCommand),
          K__namespace.commands.executeCommand(oe.LoadCockPitWalletsCommand);
      }),
      K__namespace.commands.registerCommand(oe.RebuildProjectCommand, () => {
        r.triggerBuild();
      }),
      K__namespace.languages.registerCodeLensProvider(
        { language: 'solidity', pattern: '**/*.sol' },
        d
      ),
      K__namespace.languages.registerHoverProvider(
        { language: 'solidity', pattern: '**/*.sol' },
        c
      ),
      K__namespace.commands.registerCommand(oe.RunTestCommand, g => {
        i.runTest(g);
      }),
      K__namespace.commands.registerCommand(oe.RunTestViaIRCommand, g => {
        i.runTestViaIR(g);
      }),
      K__namespace.commands.registerCommand(oe.RunGroupCommand, g => {
        i.runGroup(g);
      }),
      K__namespace.commands.registerCommand(
        oe.RefreshTestsCommand,
        async () => {
          await i.refreshTests(), Nn.sendContracts(o.abis);
        }
      ),
      K__namespace.commands.registerCommand(oe.ForkNodeCommand, async g => {
        let [b, E] = await Promise.all([r.forkNode(g), t.globalState.get(Rn)]);
        if (b.success) {
          let T = `http://localhost:${b.port}`,
            v = [...(Array.isArray(E) ? E : []), T];
          await t.globalState.update(Rn, v);
        }
        return b;
      }),
      K__namespace.commands.registerCommand(
        oe.WalletBalancesCommand,
        async g => await new Zr(g.nodeUrl, e).getBalances(g.wallets)
      ),
      K__namespace.commands.registerCommand(
        oe.LoadCockPitWalletsCommand,
        async () => {
          let g = await r.loadWallets();
          Nn.sendDefaultWallets(We.LoadCockpitWallets, g);
        }
      ),
      K__namespace.commands.registerCommand(
        oe.ExecuteFunctionCommand,
        async g => {
          var T;
          let b = new Zr(g.nodeUrl, e),
            E =
              (T = o.abis.find(P => P.fileName === g.contractAddress)) == null
                ? void 0
                : T.abi;
          return await b.executeFunction({ ...g, abi: E != null ? E : g.abi });
        }
      ),
      K__namespace.commands.registerCommand(oe.StopNodeCommand, async g => {
        let b = await r.stopForkNode(g),
          E = t.globalState.get(Rn);
        if (b && E) {
          let T = E == null ? void 0 : E.filter(P => !P.includes(g));
          await t.globalState.update(Rn, T),
            Nn.sendActiveNodes(We.GetActiveNodesCommand);
        }
        return b;
      }),
      K__namespace.commands.registerCommand(
        oe.DeployContractCommand,
        async g => await new Zr(g.nodeUrl, e).deployContract(g)
      ),
      K__namespace.commands.registerCommand(
        oe.TransferCommand,
        async g => await new Zr(g.nodeUrl, e).transfer(g)
      ),
      K__namespace.commands.registerCommand(
        oe.GetActiveNodesCommand,
        async () => {
          let g = await r.getActiveNodes(),
            b = await t.globalState.get(Rn),
            T = (
              await Promise.all(
                b.map(async v =>
                  (await new Zr(v, e).isAnvilNode()) ? v.split(':')[2] : null
                )
              )
            ).filter(v => v !== null),
            P = [...new Set([...g, ...T])];
          return e.logToOutput(`Found ${P} anvil cached nodes`), P;
        }
      ),
      K__namespace.commands.registerCommand(oe.ShowBuildOutputCommand, () => {
        e.showBuildOutput();
      }),
      K__namespace.commands.registerCommand(oe.OpenUrlCommand, g => {
        K__namespace.commands.executeCommand(
          oe.VsOpenUrlCommand,
          K__namespace.Uri.parse(g)
        );
      }),
      K__namespace.commands.registerCommand(oe.ClearCacheCommand, async () => {
        let g = t.globalState.get(Rn);
        g &&
          (await Promise.all([
            g.map(b => {
              let E = b.split(':')[2];
              return K__namespace.commands.executeCommand(
                oe.StopNodeCommand,
                E
              );
            }),
          ])),
          await t.globalState.update(Rn, []),
          Nn.sendActiveNodes(We.GetActiveNodesCommand),
          e.logToOutput('Cleared Cache');
      }),
      K__namespace.commands.registerCommand(oe.RunScriptCommand, async g => {
        let E = await new Zr(g.nodeUrl, e).chainId(),
          T = o.abis.find(P => P.fileName === g.contractName);
        return T
          ? await r.runScript({ ...g, chainId: E, scriptName: T.solFileName })
          : {
              success: false,
              contracts: [
                {
                  contractName: g.contractName,
                  address: '',
                  success: false,
                  hash: '',
                  nodeUrl: g.nodeUrl,
                  logs: void 0,
                },
              ],
              scriptName: g.contractName,
            };
      })
    ),
      t.subscriptions.push(
        h,
        { dispose: () => p.dispose() },
        { dispose: () => s.dispose() },
        { dispose: () => i.dispose() }
      ),
      K__namespace.window.showInformationMessage('Forge Cockpit activated!');
  }
  function n(s) {
    Nn.render(s);
  }
}
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
@noble/curves/esm/abstract/modular.js:
@noble/curves/esm/abstract/curve.js:
@noble/curves/esm/abstract/weierstrass.js:
@noble/curves/esm/_shortw_utils.js:
@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/ exports.activate = fq;
