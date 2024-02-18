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
exports.blogsRouter = exports.blogs = void 0;
const express_1 = require("express");
const blogs_validation_1 = require("../../validation/blogs-validation");
const auth_validation_1 = require("../../validation/auth-validation");
const http_statuses_1 = require("../../common/constants/http-statuses");
const mongodb_1 = require("mongodb");
const blogs_service_1 = require("../domain/blogs-service");
const blogs_query_repository_1 = require("../blogs-query/blogs-query-repository");
const query_data_1 = require("../../common/custom-methods/query-data");
const blogValidators = [
    auth_validation_1.authorizationMiddleware,
    blogs_validation_1.blogDescValidation,
    blogs_validation_1.blogNameValidation,
    blogs_validation_1.blogWebUrlValidation,
    blogs_validation_1.blogWebUrlValidation2,
    blogs_validation_1.inputValidationMiddleware,
];
exports.blogs = [];
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { sortBy, sortDirection, pageNumber, pageSize } = (0, query_data_1.getQueryData)(req);
        let searchNameTerm = req.query.SearchNameTerm ? String(req.query.SearchNameTerm) : undefined;
        const blogs = yield blogs_query_repository_1.blogsQueryRepository.getBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize);
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(blogs);
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.blogsRouter.get('/:id', blogs_validation_1.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(blog);
}));
exports.blogsRouter.post('/', ...blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBlog = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
        };
        const response = yield blogs_service_1.blogsService.createBlog(newBlog);
        if (response) {
            const createdBlog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(response);
            res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(createdBlog);
            return;
        }
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.blogsRouter.put('/:id', ...blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let blogDataToUpdate = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    };
    try {
        const response = yield blogs_service_1.blogsService.updateBlog(new mongodb_1.ObjectId(req.params.id), blogDataToUpdate);
        res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
exports.blogsRouter.delete('/:id', auth_validation_1.authorizationMiddleware, blogs_validation_1.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield blogs_service_1.blogsService.deleteBlog(new mongodb_1.ObjectId(req.params.id));
        res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
//# sourceMappingURL=blogs-router.js.map