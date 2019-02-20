"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cron = __importStar(require("node-cron"));
var DepositCron = /** @class */ (function () {
    function DepositCron(frequency, svc) {
        this.svc = svc;
        this.task = cron.schedule(frequency, function () {
            console.log('Running deposit cron job');
        });
    }
    DepositCron.prototype.start = function () {
        this.task.start();
    };
    DepositCron.prototype.stop = function () {
        this.task.start();
    };
    DepositCron.prototype.nuke = function () {
        this.task.destroy();
    };
    return DepositCron;
}());
exports.DepositCron = DepositCron;
