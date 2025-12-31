"use strict";
/**
 * @file auth.ts
 * @description Types et interfaces pour l'authentification
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorCodes = void 0;
/**
 * @enum AuthErrorCodes
 * @description Codes d'erreur standardisés pour l'authentification
 */
var AuthErrorCodes;
(function (AuthErrorCodes) {
    AuthErrorCodes["MISSING_CREDENTIALS"] = "MISSING_CREDENTIALS";
    AuthErrorCodes["INVALID_EMAIL_FORMAT"] = "INVALID_EMAIL_FORMAT";
    AuthErrorCodes["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    AuthErrorCodes["ACCOUNT_DISABLED"] = "ACCOUNT_DISABLED";
    AuthErrorCodes["ACCOUNT_LOCKED"] = "ACCOUNT_LOCKED";
    AuthErrorCodes["EMAIL_ALREADY_EXISTS"] = "EMAIL_ALREADY_EXISTS";
    AuthErrorCodes["INVALID_TOKEN"] = "INVALID_TOKEN";
    AuthErrorCodes["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    AuthErrorCodes["PASSWORD_TOO_SHORT"] = "PASSWORD_TOO_SHORT";
    AuthErrorCodes["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    AuthErrorCodes["INTERNAL_ERROR"] = "INTERNAL_ERROR";
})(AuthErrorCodes || (exports.AuthErrorCodes = AuthErrorCodes = {}));
//# sourceMappingURL=auth.js.map