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
exports.authService = void 0;
const auth_repository_1 = require("../auth-repository/auth-repository");
const jwt_service_1 = require("../../application/jwt-service");
const uuid_1 = require("uuid");
const nodemailer_service_1 = require("../../application/nodemailer-service");
const add_1 = require("date-fns/add");
const users_repository_1 = require("../../users/repository/users-repository");
const bcrypt = require('bcrypt');
exports.authService = {
    authUser(authData) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExistLogin = yield auth_repository_1.authRepositories.authUser(authData);
            const res = yield auth_repository_1.authRepositories.getUserHash(authData);
            if (res && isExistLogin) {
                const passwordSalt = res.passwordSalt;
                const passwordHash = res.passwordHash;
                const newPasswordHash = yield bcrypt.hash(authData.password, passwordSalt);
                return newPasswordHash === passwordHash;
            }
            else {
                return false;
            }
        });
    },
    registration(userInputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield jwt_service_1.jwtService.generateSalt(10);
            const passwordHash = yield jwt_service_1.jwtService.generateHash(userInputData.password, passwordSalt);
            const userEmailEntity = {
                accountData: {
                    login: userInputData.login,
                    email: userInputData.email,
                    createdAt: new Date().toISOString(),
                },
                passwordSalt,
                passwordHash,
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.add)(new Date(), { hours: 1, minutes: 3 })
                },
                isConfirmed: false,
                isCreatedFromAdmin: false
            };
            const mailSendResponse = yield nodemailer_service_1.nodemailerService.send(userEmailEntity.emailConfirmation.confirmationCode, userInputData.email);
            if (mailSendResponse) {
                const userId = yield users_repository_1.usersRepositories.createUser(userEmailEntity);
                return !!userId;
            }
            return false;
        });
    },
    registrationConfirm(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_repository_1.authRepositories.getConfirmCode(code);
        });
    },
    registrationEmailResending(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_repository_1.authRepositories.registrationEmailResending(email);
        });
    }
};
//# sourceMappingURL=auth-service.js.map