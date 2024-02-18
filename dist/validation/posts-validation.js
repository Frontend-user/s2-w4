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
exports.postIdValidation = exports.postBlogIdExistValidation = exports.postBlogIdValidation = exports.postContentValidation = exports.postDescValidation = exports.postTitleValidation = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const blogs_query_repository_1 = require("../blogs/blogs-query/blogs-query-repository");
exports.postTitleValidation = (0, express_validator_1.body)('title').trim().isLength({ min: 4, max: 30 }).withMessage({
    message: 'title is wrong',
    field: 'title'
});
exports.postDescValidation = (0, express_validator_1.body)('shortDescription').trim().isLength({ min: 4, max: 100 }).withMessage({
    message: 'shortDescription is wrong',
    field: 'shortDescription'
});
exports.postContentValidation = (0, express_validator_1.body)('content').trim().isLength({ min: 4, max: 1000 }).withMessage({
    message: 'content is wrong',
    field: 'content'
});
exports.postBlogIdValidation = (0, express_validator_1.body)('blogId').trim().isLength({ min: 1, max: 300 }).withMessage({
    message: 'id is wrong',
    field: 'id'
});
exports.postBlogIdExistValidation = (0, express_validator_1.body)('blogId').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistBlogId = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(new mongodb_1.ObjectId(value));
    if (isExistBlogId) {
        return true;
    }
    else {
        throw new Error('Wrong blogID');
    }
})).withMessage({
    message: 'Wrong blogID',
    field: 'blogId'
});
exports.postIdValidation = (0, express_validator_1.body)('id').trim().isLength({ min: 1, max: 300 }).isString().withMessage({
    message: 'id is wrong',
    field: 'id'
});
//# sourceMappingURL=posts-validation.js.map