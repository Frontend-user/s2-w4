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
exports.testRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
exports.testRouter = (0, express_1.Router)({});
exports.testRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.connect();
        yield db_1.client.db('db').collection('blogs').deleteMany({});
        yield db_1.client.db('db').collection('posts').deleteMany({});
        yield db_1.client.db('db').collection('users').deleteMany({});
        yield db_1.client.db('db').collection('comments').deleteMany({});
        yield db_1.client.db('db').collection('tokens').deleteMany({});
        res.sendStatus(204);
    }
    catch (error) {
        console.error('Ошибка при попытке удалить все данные из бд');
    }
}));
//# sourceMappingURL=test-router.js.map