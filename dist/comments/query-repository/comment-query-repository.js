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
exports.commentQueryRepository = void 0;
const db_1 = require("../../db");
const blogs_sorting_1 = require("../../blogs/blogs-query/utils/blogs-sorting");
const blogs_paginate_1 = require("../../blogs/blogs-query/utils/blogs-paginate");
exports.commentQueryRepository = {
    getCommentByCommentId() {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield db_1.commentsCollection.find({}).toArray();
            return comments;
        });
    },
    getCommentsByPostId(postId, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortQuery = blogs_sorting_1.blogsSorting.getSorting(sortBy, sortDirection);
            const { skip, limit, newPageNumber, newPageSize } = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            const comments = yield db_1.commentsCollection.find({ postId: postId }).sort(sortQuery).skip(skip).limit(limit).toArray();
            const allComments = yield db_1.commentsCollection.find({ postId: postId }).sort(sortQuery).toArray();
            let pagesCount = Math.ceil(allComments.length / newPageSize);
            const fixArrayIds = comments.map((item => this.changeCommentFormat(item)));
            return {
                "pagesCount": pagesCount,
                "page": newPageNumber,
                "pageSize": newPageSize,
                "totalCount": allComments.length,
                "items": fixArrayIds
            };
        });
    },
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.commentsCollection.findOne({ _id: commentId });
            return comment ? this.changeCommentFormat(comment) : false;
        });
    },
    changeCommentFormat(obj) {
        obj.id = obj._id;
        delete obj._id;
        delete obj.postId;
        return obj;
    }
};
//# sourceMappingURL=comment-query-repository.js.map