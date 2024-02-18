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
exports.blogsRepositories = void 0;
const db_1 = require("../../db");
exports.blogsRepositories = {
    createBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.blogsCollection.insertOne(blog);
            return response ? response.insertedId : false;
        });
    },
    updateBlog(id, updateBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.blogsCollection.updateOne({ _id: id }, { $set: updateBlog });
            return response.matchedCount === 1;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.blogsCollection.deleteOne({ _id: id });
            return !!response.deletedCount;
        });
    },
};
//# sourceMappingURL=blogs-repositories.js.map