"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WithdrawalController = /** @class */ (function () {
    // DI the service in.
    function WithdrawalController(zsvc) {
        this.zsvc = zsvc;
    }
    WithdrawalController.prototype.withdraw = function (from, to, amount) {
        return this.zsvc.withdraw(from, to, amount);
    };
    return WithdrawalController;
}());
