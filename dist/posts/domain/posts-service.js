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
exports.postsService = void 0;
const posts_repositories_1 = require("../repositories/posts-repositories");
exports.postsService = {
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPostId = yield posts_repositories_1.postsRepositories.createPost(post);
            return newPostId ? newPostId : false;
        });
    },
    updatePost(id, updatePost) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repositories_1.postsRepositories.updatePost(id, updatePost);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repositories_1.postsRepositories.deletePost(id);
        });
    },
};
//# sourceMappingURL=posts-service.js.map