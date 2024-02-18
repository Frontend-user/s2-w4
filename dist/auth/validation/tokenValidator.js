"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenValidationMiddleware = exports.refreshTokenValidator = exports.isUnValidTokenMiddleware = exports.authorizationTokenMiddleware = void 0;
const express_validator_1 = require("express-validator");
const jwt_service_1 = require("../../application/jwt-service");
const auth_repository_1 = require("../auth-repository/auth-repository");
exports.authorizationTokenMiddleware = (0, express_validator_1.header)('authorization').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!value) {
        throw new Error('Wrong authorization');
    }
    let token = value.split(' ')[1];
    if (!token) {
        throw new Error('Wrong authorization');
    }
    let userId;
    try {
        userId = yield jwt_service_1.jwtService.checkToken(token);
        if (!userId) {
            throw new Error('Wrong authorization');
        }
    }
    catch (e) {
        throw new Error('Wrong authorization');
    }
})).withMessage({
    message: 'authorization wrong',
    field: 'authorization'
});
exports.isUnValidTokenMiddleware = (0, express_validator_1.cookie)('refreshToken').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    let unValidTokens = yield auth_repository_1.authRepositories.getUnValidRefreshTokens();
    let find = unValidTokens.filter((item) => item.refreshToken === value);
    if (find.length > 0) {
        throw new Error('Wrong refreshToken');
    }
    return true;
}));
exports.refreshTokenValidator = (0, express_validator_1.cookie)('refreshToken').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = value;
    const isExpired = yield jwt_service_1.jwtService.checkRefreshToken(refreshToken);
    if (isExpired && refreshToken) {
        return true;
    }
    else {
        throw new Error('Wrong refreshToken');
    }
})).withMessage({
    message: 'error refreshToken',
    field: 'refreshToken'
});
const tokenValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length) {
        let errorsForClient = [];
        for (const error of errors) {
            errorsForClient.push(error.msg);
        }
        res.sendStatus(401);
        return;
    }
    else {
        next();
    }
};
exports.tokenValidationMiddleware = tokenValidationMiddleware;
//# sourceMappingURL=tokenValidator.js.map