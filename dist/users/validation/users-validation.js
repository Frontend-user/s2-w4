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
exports.userEmailRecendingExistValidation = exports.checkEmailConfirmation = exports.checkCodeExist = exports.checkCodeConfirmation = exports.userLoginExistValidation = exports.userEmailExistValidation = exports.usersEmailValidation = exports.authLoginOrEmailValidation = exports.usersPasswordValidation = exports.usersLoginValidation = void 0;
const express_validator_1 = require("express-validator");
const users_query_repository_1 = require("../query-repository/users-query-repository");
const usersEmailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
exports.usersLoginValidation = (0, express_validator_1.body)('login').trim().isString().isLength({ min: 3, max: 10 }).withMessage({
    message: 'login is wrong',
    field: 'login'
});
exports.usersPasswordValidation = (0, express_validator_1.body)('password').trim().isString().isLength({ min: 6, max: 20 }).withMessage({
    message: 'password is wrong',
    field: 'password'
});
exports.authLoginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail').trim().isString().isLength({ min: 3, max: 20 }).withMessage({
    message: 'loginOrEmail is unvalid',
    field: 'loginOrEmail'
});
exports.usersEmailValidation = (0, express_validator_1.body)('email').trim().isString().withMessage({
    message: 'email is wrong',
    field: 'email'
}).matches(usersEmailPattern).withMessage({
    message: 'email pattern is wrong',
    field: 'email'
});
exports.userEmailExistValidation = (0, express_validator_1.body)('email').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistEmail = yield users_query_repository_1.usersQueryRepository.getUserByCustomField('accountData.email', value);
    if (!isExistEmail) {
        return true;
    }
    else {
        throw new Error('email exist');
    }
})).withMessage({
    message: 'email exist',
    field: 'email'
});
exports.userLoginExistValidation = (0, express_validator_1.body)('login').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistEmail = yield users_query_repository_1.usersQueryRepository.getUserByCustomField('accountData.login', value);
    if (!isExistEmail) {
        return true;
    }
    else {
        throw new Error('login exist');
    }
})).withMessage({
    message: 'login exist',
    field: 'login'
});
exports.checkCodeConfirmation = (0, express_validator_1.body)('code').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistEmail = yield users_query_repository_1.usersQueryRepository.getUserDataByCustomField('emailConfirmation.confirmationCode', value);
    if (isExistEmail && isExistEmail.isConfirmed) {
        throw new Error('code exist');
    }
    else {
        return true;
    }
})).withMessage({
    message: 'code exist',
    field: 'code'
});
exports.checkCodeExist = (0, express_validator_1.body)('code').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistEmail = yield users_query_repository_1.usersQueryRepository.getUserByCustomField('emailConfirmation.confirmationCode', value);
    if (isExistEmail) {
        return true;
    }
    else {
        throw new Error('code exist');
    }
})).withMessage({
    message: 'code exist',
    field: 'code'
});
exports.checkEmailConfirmation = (0, express_validator_1.body)('email').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistEmail = yield users_query_repository_1.usersQueryRepository.getUserDataByCustomField('accountData.email', value);
    if (isExistEmail && !isExistEmail.isConfirmed) {
        return true;
    }
    else {
        throw new Error('code exist');
    }
})).withMessage({
    message: 'email exist',
    field: 'email'
});
exports.userEmailRecendingExistValidation = (0, express_validator_1.body)('email').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistEmail = yield users_query_repository_1.usersQueryRepository.getUserByCustomField('accountData.email', value);
    if (!isExistEmail) {
        throw new Error('email exist');
    }
    else {
        return true;
    }
})).withMessage({
    message: 'email not exist',
    field: 'email'
});
//# sourceMappingURL=users-validation.js.map