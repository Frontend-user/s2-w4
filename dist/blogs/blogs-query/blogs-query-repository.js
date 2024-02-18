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
exports.blogsQueryRepository = void 0;
const db_1 = require("../../db");
const mongodb_1 = require("mongodb");
const blogs_sorting_1 = require("./utils/blogs-sorting");
const blogs_finding_1 = require("./utils/blogs-finding");
const blogs_paginate_1 = require("./utils/blogs-paginate");
const change_id_format_1 = require("../../common/custom-methods/change-id-format");
exports.blogsQueryRepository = {
    getBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const findQuery = blogs_finding_1.blogsFinding.getFindings(searchNameTerm);
            const sortQuery = blogs_sorting_1.blogsSorting.getSorting(sortBy, sortDirection);
            const { skip, limit, newPageNumber, newPageSize } = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            let blogs = yield db_1.blogsCollection.find(findQuery).sort(sortQuery).skip(skip).limit(limit).toArray();
            const allBlogs = yield db_1.blogsCollection.find(findQuery).sort(sortQuery).toArray();
            let pagesCount = Math.ceil(allBlogs.length / newPageSize);
            const fixArrayIds = blogs.map((item => (0, change_id_format_1.changeIdFormat)(item)));
            const response = {
                "pagesCount": pagesCount,
                "page": newPageNumber,
                "pageSize": newPageSize,
                "totalCount": allBlogs.length,
                "items": fixArrayIds
            };
            return response;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongodb_1.ObjectId.isValid(id) && typeof id === 'string' || id instanceof mongodb_1.ObjectId) {
                const blog = yield db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                return blog ? (0, change_id_format_1.changeIdFormat)(blog) : false;
            }
            return false;
        });
    },
};
//# sourceMappingURL=blogs-query-repository.js.map