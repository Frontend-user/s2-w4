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
exports.blogsService = void 0;
const blogs_repositories_1 = require("../repository/blogs-repositories");
exports.blogsService = {
    createBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = Object.assign(Object.assign({}, blog), { createdAt: new Date().toISOString(), isMembership: false });
            const newBlogId = yield blogs_repositories_1.blogsRepositories.createBlog(newBlog);
            return newBlogId ? newBlogId : false;
        });
    },
    updateBlog(id, updateBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repositories_1.blogsRepositories.updateBlog(id, updateBlog);
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repositories_1.blogsRepositories.deleteBlog(id);
        });
    },
};
//# sourceMappingURL=blogs-service.js.map