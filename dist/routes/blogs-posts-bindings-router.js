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
exports.blogsPostBindValidators = exports.blogsPostsBindRouter = void 0;
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const http_statuses_1 = require("../common/constants/http-statuses");
const auth_validation_1 = require("../validation/auth-validation");
const posts_validation_1 = require("../validation/posts-validation");
const blogs_posts_bind_validation_1 = require("../validation/blogs-posts-bind-validation");
const posts_query_repository_1 = require("../posts/posts-query/posts-query-repository");
const posts_service_1 = require("../posts/domain/posts-service");
const blogs_query_repository_1 = require("../blogs/blogs-query/blogs-query-repository");
const query_data_1 = require("../common/custom-methods/query-data");
exports.blogsPostsBindRouter = (0, express_1.Router)({});
exports.blogsPostBindValidators = [
    auth_validation_1.authorizationMiddleware,
    posts_validation_1.postTitleValidation,
    posts_validation_1.postDescValidation,
    posts_validation_1.postContentValidation,
    // postBlogsBindingBlogIdValidation,
    blogs_posts_bind_validation_1.postBlogBindIdExistValidation,
    blogs_posts_bind_validation_1.blogsPostsBindingInputValidationMiddleware
];
exports.blogsPostsBindRouter.get('/:blogId/posts', blogs_posts_bind_validation_1.postBlogBindIdExistValidation, blogs_posts_bind_validation_1.blogsPostsBindingInputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { sortBy, sortDirection, pageNumber, pageSize } = (0, query_data_1.getQueryData)(req);
    try {
        const posts = yield posts_query_repository_1.postsQueryRepository.getPostsByBlogId(String(req.params.blogId), sortBy, sortDirection, pageNumber, pageSize);
        res.send(posts);
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.blogsPostsBindRouter.post('/:blogId/posts', ...exports.blogsPostBindValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let getBlogName;
    const getBlog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(req.params.blogId);
    if (getBlog) {
        getBlogName = getBlog.name;
        let newPost = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.params.blogId,
            blogName: getBlogName,
            createdAt: new Date().toISOString()
        };
        try {
            const response = yield posts_service_1.postsService.createPost(newPost);
            if (response instanceof mongodb_1.ObjectId) {
                const createdPost = yield posts_query_repository_1.postsQueryRepository.getPostById(response);
                res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(createdPost);
                return;
            }
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
        }
        catch (error) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
        }
    }
}));
//# sourceMappingURL=blogs-posts-bindings-router.js.map