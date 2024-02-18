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
exports.authRouter = exports.registrationValidators = void 0;
const users_validation_1 = require("../../users/validation/users-validation");
const blogs_validation_1 = require("../../validation/blogs-validation");
const jwt = require('jsonwebtoken');
exports.registrationValidators = [
    users_validation_1.usersLoginValidation,
    users_validation_1.usersPasswordValidation,
    users_validation_1.usersEmailValidation,
    users_validation_1.userEmailExistValidation,
    users_validation_1.userLoginExistValidation,
    blogs_validation_1.inputValidationMiddleware,
];
const authValidators = [
    users_validation_1.usersPasswordValidation,
    users_validation_1.authLoginOrEmailValidation,
    blogs_validation_1.inputValidationMiddleware,
];
const express_1 = require("express");
const http_statuses_1 = require("../../common/constants/http-statuses");
const auth_service_1 = require("../auth-domain/auth-service");
const jwt_service_1 = require("../../application/jwt-service");
const current_user_1 = require("../../application/current-user");
const users_query_repository_1 = require("../../users/query-repository/users-query-repository");
const mongodb_1 = require("mongodb");
const auth_repository_1 = require("../auth-repository/auth-repository");
const tokenValidator_1 = require("../validation/tokenValidator");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.get('/me', tokenValidator_1.authorizationTokenMiddleware, tokenValidator_1.tokenValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.authorization.split(' ')[1];
    let userId = yield jwt_service_1.jwtService.checkToken(token);
    const getUserByID = yield users_query_repository_1.usersQueryRepository.getUserById(new mongodb_1.ObjectId(userId));
    if (!getUserByID) {
        res.sendStatus(401);
        return;
    }
    if (getUserByID) {
        current_user_1.currentUser.userLogin = getUserByID.login;
        current_user_1.currentUser.userId = userId;
        res.send({
            "email": getUserByID.email,
            "login": getUserByID.login,
            "userId": getUserByID.id
        });
        return;
    }
    else {
        res.sendStatus(401);
        return;
    }
}));
exports.authRouter.post('/logout', tokenValidator_1.refreshTokenValidator, tokenValidator_1.isUnValidTokenMiddleware, tokenValidator_1.tokenValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getRefreshToken = req.cookies.refreshToken;
    const userId = yield jwt_service_1.jwtService.checkRefreshToken(getRefreshToken);
    if (!userId) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_AUTH_401);
        return;
    }
    yield auth_repository_1.authRepositories.addUnValidRefreshToken(getRefreshToken);
    res.sendStatus(204);
}));
exports.authRouter.post('/refresh-token', tokenValidator_1.refreshTokenValidator, tokenValidator_1.isUnValidTokenMiddleware, tokenValidator_1.tokenValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getRefreshToken = req.cookies.refreshToken;
    const userId = yield jwt_service_1.jwtService.checkRefreshToken(getRefreshToken);
    if (!userId) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_AUTH_401);
        return;
    }
    const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(userId);
    const token = yield jwt_service_1.jwtService.createJWT(userId);
    yield auth_repository_1.authRepositories.addUnValidRefreshToken(getRefreshToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.send({ accessToken: token });
}));
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authData = {
            loginOrEmail: req.body.loginOrEmail,
            password: req.body.password,
        };
        const response = yield auth_service_1.authService.authUser(authData);
        if (!response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_AUTH_401);
            return;
        }
        const user = yield auth_repository_1.authRepositories.getUserIdByAutData(authData);
        if (user) {
            const token = yield jwt_service_1.jwtService.createJWT(user._id);
            const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(user._id);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
            res.send({ accessToken: token });
        }
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.authRouter.post('/registration', ...exports.registrationValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInputData = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
        };
        const response = yield auth_service_1.authService.registration(userInputData);
        if (!response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
            return;
        }
        res.send(204);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.authRouter.post('/registration-confirmation', users_validation_1.checkCodeConfirmation, users_validation_1.checkCodeExist, blogs_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield auth_service_1.authService.registrationConfirm(req.body.code);
        if (!response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
            return;
        }
        res.send(204);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.authRouter.post('/registration-email-resending', users_validation_1.checkEmailConfirmation, users_validation_1.userEmailRecendingExistValidation, blogs_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield auth_service_1.authService.registrationEmailResending(req.body.email);
        if (!response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
            return;
        }
        res.send(204);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
//# sourceMappingURL=auth-router.js.map