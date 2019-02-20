"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var p_map_1 = __importDefault(require("p-map"));
var lodash_1 = require("lodash");
var util_1 = require("@Zilliqa-js/util");
var zilliqa_1 = require("@zilliqa-js/zilliqa");
var ZilliqaService = /** @class */ (function () {
    function ZilliqaService(api, mnemonics) {
        var _this = this;
        this.accounts = [];
        var zilliqa = new zilliqa_1.Zilliqa(api);
        this.zil = zilliqa;
        var _loop_1 = function (m) {
            var num = mnemonics[m];
            lodash_1.range(num).forEach(function (i) {
                var address = _this.zil.wallet.addByMnemonic(m, i);
                _this.accounts.push(address);
            });
        };
        // use mnemonics to manage/generate a large number of accounts
        // you can use this strategy for adding pre-existing accounts that you
        // want to use.
        for (var m in mnemonics) {
            _loop_1(m);
        }
    }
    ZilliqaService.prototype.createAccount = function (mnemonic, index) {
        // this returns the address of the freshly-created account.
        return this.zil.wallet.addByMnemonic(mnemonic, index);
    };
    ZilliqaService.prototype.getDeposits = function (addresses, block) {
        return __awaiter(this, void 0, void 0, function () {
            var res, transactions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.zil.blockchain.getTransactionsForTxBlock(block)];
                    case 1:
                        res = _a.sent();
                        if (res.error) {
                            // you may not wish to throw, depending on the response.
                            throw res.error;
                        }
                        return [4 /*yield*/, p_map_1.default(lodash_1.flatten(res.result), function (tx) {
                                return _this.zil.blockchain.getTransaction(tx);
                            })];
                    case 2:
                        transactions = _a.sent();
                        // filter out everything that isn't in the list of deposit addresses we
                        // are interested in.
                        return [2 /*return*/, transactions.filter(function (tx) { return addresses.indexOf(tx.txParams.toAddr) !== -1; })];
                }
            });
        });
    };
    ZilliqaService.prototype.withdraw = function (from, to, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var fromPubKey, tx, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        fromPubKey = this.zil.wallet.accounts[from].publicKey;
                        return [4 /*yield*/, this.zil.blockchain.createTransaction(this.zil.transactions.new({
                                version: util_1.bytes.pack(2, 1),
                                amount: amount,
                                gasLimit: util_1.Long.fromNumber(1),
                                gasPrice: new util_1.BN(util_1.units.toQa(1000, "li" /* Li */)),
                                toAddr: to,
                                pubKey: fromPubKey,
                            }))];
                    case 1:
                        tx = _a.sent();
                        if (tx.isRejected) {
                            // you may not wish to throw.
                            // this should generally be caught in the catch block
                            throw new Error('Transaction was rejected');
                        }
                        return [2 /*return*/, tx];
                    case 2:
                        err_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ZilliqaService;
}());
exports.ZilliqaService = ZilliqaService;
