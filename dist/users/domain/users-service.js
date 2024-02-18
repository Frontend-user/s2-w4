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
exports.usersService = void 0;
const users_repository_1 = require("../repository/users-repository");
const jwt_service_1 = require("../../application/jwt-service");
const bcrypt = require('bcrypt');
exports.usersService = {
    createUser(user, isReqFromSuperAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield jwt_service_1.jwtService.generateSalt(10);
            const passwordHash = yield jwt_service_1.jwtService.generateHash(user.password, passwordSalt);
            const userEmailEntity = {
                accountData: {
                    login: user.login,
                    email: user.email,
                    createdAt: new Date().toISOString(),
                },
                passwordSalt,
                passwordHash,
                emailConfirmation: {
                    confirmationCode: 'superadmin',
                    expirationDate: 'superadmin'
                },
                isConfirmed: isReqFromSuperAdmin,
                isCreatedFromAdmin: true
            };
            const userId = yield users_repository_1.usersRepositories.createUser(userEmailEntity);
            if (!userId) {
                return false;
            }
            return userId;
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_1.usersRepositories.deleteUser(id);
        });
    },
};
//# sourceMappingURL=users-service.js.map