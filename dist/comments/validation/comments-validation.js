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
exports.commentDeleteInputValidationMiddleware = exports.commentInputValidationMiddleware = exports.haveAccesForUpdate = exports.commentPostIdExistValidation = exports.IdExistValidation = exports.commentIdExistValidation = exports.commentContentValidation = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const posts_query_repository_1 = require("../../posts/posts-query/posts-query-repository");
const comment_query_repository_1 = require("../query-repository/comment-query-repository");
const current_user_1 = require("../../application/current-user");
exports.commentContentValidation = (0, express_validator_1.body)('content').trim().isLength({ min: 20, max: 300 }).withMessage({
    message: 'content is wrong',
    field: 'content'
});
exports.commentIdExistValidation = (0, express_validator_1.param)('commentId').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistCommentId = yield comment_query_repository_1.commentQueryRepository.getCommentById(new mongodb_1.ObjectId(value));
    if (isExistCommentId) {
        return true;
    }
    else {
        throw new Error('Wrong commentId');
    }
})).withMessage({
    message: 'Wrong commentId',
    field: 'commentId'
});
exports.IdExistValidation = (0, express_validator_1.param)('id').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistId = yield comment_query_repository_1.commentQueryRepository.getCommentById(new mongodb_1.ObjectId(value));
    if (isExistId) {
        return true;
    }
    else {
        throw new Error('Wrong id');
    }
})).withMessage({
    message: 'Wrong id',
    field: 'id'
});
exports.commentPostIdExistValidation = (0, express_validator_1.param)('postId').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistPostId = yield posts_query_repository_1.postsQueryRepository.getPostById(value);
    if (isExistPostId) {
        return true;
    }
    else {
        throw new Error('Wrong postId');
    }
})).withMessage({
    message: 'Wrong postId',
    field: 'postId'
});
exports.haveAccesForUpdate = (0, express_validator_1.param)('commentId').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_query_repository_1.commentQueryRepository.getCommentById(new mongodb_1.ObjectId(value));
    if (current_user_1.currentUser.userLogin === comment.commentatorInfo.userLogin && current_user_1.currentUser.userId === comment.commentatorInfo.userId) {
        return true;
    }
    else {
        throw new Error('No access');
    }
})).withMessage({
    message: 'No access',
    field: 'No access'
});
const commentInputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length) {
        let errorsForClient = [];
        for (const error of errors) {
            errorsForClient.push(error.msg);
            if (error.msg.field === 'commentId' || error.msg.field === 'postId') {
                res.sendStatus(404);
                return;
            }
            if (error.msg.field === 'No access') {
                res.sendStatus(403);
                return;
            }
        }
        res.status(400).json({ errorsMessages: errorsForClient });
        return;
    }
    else {
        next();
    }
};
exports.commentInputValidationMiddleware = commentInputValidationMiddleware;
const commentDeleteInputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length) {
        let errorsForClient = [];
        for (const error of errors) {
            errorsForClient.push(error.msg);
            if (error.msg.field === 'commentId' || error.msg.field === 'postId') {
                res.sendStatus(404);
                return;
            }
            if (error.msg.field === 'No access') {
                res.sendStatus(403);
                return;
            }
        }
        res.sendStatus(404);
        return;
    }
    else {
        next();
    }
};
exports.commentDeleteInputValidationMiddleware = commentDeleteInputValidationMiddleware;
//# sourceMappingURL=comments-validation.js.map