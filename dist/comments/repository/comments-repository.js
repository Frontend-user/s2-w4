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
exports.commentsRepository = void 0;
const db_1 = require("../../db");
exports.commentsRepository = {
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield db_1.commentsCollection.insertOne(comment);
            return response ? response.insertedId : false;
        });
    },
    updateComment(id, updateComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.commentsCollection.updateOne({ _id: id }, { $set: updateComment });
            return response.matchedCount === 1;
        });
    },
    deleteCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.commentsCollection.deleteOne({ _id: commentId });
            return !!comment;
        });
    },
};
//# sourceMappingURL=comments-repository.js.map