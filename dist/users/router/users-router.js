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
exports.usersRouter = exports.usersValidators = void 0;
const express_1 = require("express");
const http_statuses_1 = require("../../common/constants/http-statuses");
const mongodb_1 = require("mongodb");
const users_validation_1 = require("../validation/users-validation");
const blogs_validation_1 = require("../../validation/blogs-validation");
const users_service_1 = require("../domain/users-service");
const users_query_repository_1 = require("../query-repository/users-query-repository");
const auth_validation_1 = require("../../validation/auth-validation");
const query_data_1 = require("../../common/custom-methods/query-data");
exports.usersValidators = [
    auth_validation_1.authorizationMiddleware,
    users_validation_1.usersLoginValidation,
    users_validation_1.usersPasswordValidation,
    users_validation_1.usersEmailValidation,
    blogs_validation_1.inputValidationMiddleware,
];
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', auth_validation_1.authorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { sortBy, sortDirection, pageNumber, pageSize } = (0, query_data_1.getQueryData)(req);
        let searchLoginTerm = req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : undefined;
        let searchEmailTerm = req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : undefined;
        const blogs = yield users_query_repository_1.usersQueryRepository.getUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize);
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(blogs);
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.usersRouter.post('/', ...exports.usersValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isReqFromSuperAdmin = true;
        const user = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
        };
        const response = yield users_service_1.usersService.createUser(user, isReqFromSuperAdmin);
        if (response) {
            const createdBlog = yield users_query_repository_1.usersQueryRepository.getUserById(response);
            res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(createdBlog);
            return;
        }
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.usersRouter.delete('/:id', auth_validation_1.authorizationMiddleware, blogs_validation_1.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield users_service_1.usersService.deleteUser(new mongodb_1.ObjectId(req.params.id));
        res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
//# sourceMappingURL=users-router.js.map