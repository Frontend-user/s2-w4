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
exports.commentsRouter = void 0;
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const http_statuses_1 = require("../../common/constants/http-statuses");
const comments_service_1 = require("../service/comments-service");
const auth_validation_1 = require("../../validation/auth-validation");
const comment_query_repository_1 = require("../query-repository/comment-query-repository");
const comments_validation_1 = require("../validation/comments-validation");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.put('/:commentId', auth_validation_1.bearerAuthMiddleware, comments_validation_1.commentContentValidation, comments_validation_1.commentIdExistValidation, comments_validation_1.haveAccesForUpdate, comments_validation_1.commentInputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield comments_service_1.commentsService.updateComment(new mongodb_1.ObjectId(req.params.commentId), req.body.content);
        res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
exports.commentsRouter.delete('/:commentId', auth_validation_1.bearerAuthMiddleware, comments_validation_1.commentIdExistValidation, comments_validation_1.haveAccesForUpdate, comments_validation_1.commentDeleteInputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield comments_service_1.commentsService.deleteComment(new mongodb_1.ObjectId(req.params.commentId));
        res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_query_repository_1.commentQueryRepository.getCommentById(new mongodb_1.ObjectId(req.params.id));
    return comment ? res.send(comment) : res.sendStatus(404);
}));
//# sourceMappingURL=comments-router.js.map