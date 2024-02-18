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
exports.bearerAuthMiddleware = exports.authorizationMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const users_query_repository_1 = require("../users/query-repository/users-query-repository");
const mongodb_1 = require("mongodb");
const current_user_1 = require("../application/current-user");
const AUTH_CODE = 'YWRtaW46cXdlcnR5';
const authorizationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let requestAuthCode = req.headers.authorization;
    if (!requestAuthCode || requestAuthCode.slice(6) !== AUTH_CODE) {
        res.sendStatus(401);
        return;
    }
    else {
        next();
    }
});
exports.authorizationMiddleware = authorizationMiddleware;
const bearerAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }
    let token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.checkToken(token);
    const getUserByID = yield users_query_repository_1.usersQueryRepository.getUserById(new mongodb_1.ObjectId(userId));
    if (!getUserByID || !userId) {
        res.sendStatus(401);
        return;
    }
    else {
        current_user_1.currentUser.userId = userId;
        current_user_1.currentUser.userLogin = getUserByID.login;
        // currentUser.updateCurrentUser(userId,getUserByID.login)
        next();
    }
});
exports.bearerAuthMiddleware = bearerAuthMiddleware;
//# sourceMappingURL=auth-validation.js.map