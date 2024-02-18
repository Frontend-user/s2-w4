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
exports.commentsService = void 0;
const comments_repository_1 = require("../repository/comments-repository");
const current_user_1 = require("../../application/current-user");
exports.commentsService = {
    createComment(comment, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = {
                content: comment,
                postId: postId,
                commentatorInfo: {
                    userId: current_user_1.currentUser.userId,
                    userLogin: current_user_1.currentUser.userLogin
                },
                createdAt: new Date().toISOString()
            };
            const response = yield comments_repository_1.commentsRepository.createComment(newComment);
            return response;
        });
    },
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.updateComment(id, { content: content });
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.deleteCommentById(id);
        });
    },
};
//# sourceMappingURL=comments-service.js.map