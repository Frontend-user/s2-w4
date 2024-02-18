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
exports.authRepositories = void 0;
const db_1 = require("../../db");
const nodemailer_service_1 = require("../../application/nodemailer-service");
const uuid_1 = require("uuid");
exports.authRepositories = {
    authUser(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.usersCollection.findOne({ $or: [{ 'accountData.login': auth.loginOrEmail }, { 'accountData.email': auth.loginOrEmail }] });
            return !!response;
        });
    },
    getUserHash(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.usersCollection.findOne({ $or: [{ 'accountData.login': auth.loginOrEmail }, { 'accountData.email': auth.loginOrEmail }] });
            return response ? response : false;
        });
    },
    getUserIdByAutData(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.usersCollection.findOne({ $or: [{ 'accountData.login': auth.loginOrEmail }, { 'accountData.email': auth.loginOrEmail }] });
            return response ? response : false;
        });
    },
    getConfirmCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield db_1.usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
            if (getUser) {
                const respUpdate = yield db_1.usersCollection.updateOne({ _id: getUser._id }, { $set: { isConfirmed: true } });
                return respUpdate.modifiedCount === 1;
            }
            return false;
        });
    },
    addUnValidRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.tokensCollection.insertOne({ refreshToken: refreshToken });
        });
    },
    getUnValidRefreshTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.tokensCollection.find({}).toArray();
        });
    },
    registrationEmailResending(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield db_1.usersCollection.findOne({ 'accountData.email': email });
            if (getUser) {
                const newCode = (0, uuid_1.v4)();
                const respUpdate = yield db_1.usersCollection.updateOne({ _id: getUser._id }, { $set: { 'emailConfirmation.confirmationCode': newCode } });
                if (respUpdate.matchedCount === 1) {
                    yield nodemailer_service_1.nodemailerService.send(newCode, email);
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        });
    },
};
//# sourceMappingURL=auth-repository.js.map