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
exports.postsQueryRepository = void 0;
const db_1 = require("../../db");
const mongodb_1 = require("mongodb");
const blogs_sorting_1 = require("../../blogs/blogs-query/utils/blogs-sorting");
const blogs_paginate_1 = require("../../blogs/blogs-query/utils/blogs-paginate");
const change_id_format_1 = require("../../common/custom-methods/change-id-format");
exports.postsQueryRepository = {
    getPosts(sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortQuery = blogs_sorting_1.blogsSorting.getSorting(sortBy, sortDirection);
            const { skip, limit, newPageNumber, newPageSize } = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            let posts = yield db_1.postsCollection.find({}).sort(sortQuery).skip(skip).limit(limit).toArray();
            const allPosts = yield db_1.postsCollection.find({}).sort(sortQuery).toArray();
            let pagesCount = Math.ceil(allPosts.length / newPageSize);
            const fixArrayIds = posts.map((item => (0, change_id_format_1.changeIdFormat)(item)));
            return {
                "pagesCount": pagesCount,
                "page": newPageNumber,
                "pageSize": newPageSize,
                "totalCount": allPosts.length,
                "items": fixArrayIds
            };
        });
    },
    getPostsByBlogId(blogId, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortQuery = blogs_sorting_1.blogsSorting.getSorting(sortBy, sortDirection);
            const { skip, limit, newPageNumber, newPageSize } = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            let posts = yield db_1.postsCollection.find({ "blogId": blogId }).sort(sortQuery).skip(skip).limit(limit).toArray();
            const allPosts = yield db_1.postsCollection.find({ "blogId": blogId }).toArray();
            let pagesCount = Math.ceil(allPosts.length / newPageSize);
            const fixArrayIds = posts.map((item => (0, change_id_format_1.changeIdFormat)(item)));
            return {
                "pagesCount": pagesCount,
                "page": newPageNumber,
                "pageSize": newPageSize,
                "totalCount": allPosts.length,
                "items": fixArrayIds
            };
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return post ? (0, change_id_format_1.changeIdFormat)(post) : false;
        });
    },
};
//# sourceMappingURL=posts-query-repository.js.map