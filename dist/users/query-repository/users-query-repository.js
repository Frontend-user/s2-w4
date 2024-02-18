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
exports.usersQueryRepository = void 0;
const blogs_paginate_1 = require("../../blogs/blogs-query/utils/blogs-paginate");
const db_1 = require("../../db");
exports.usersQueryRepository = {
    getUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const findQuery = this.__getUsersFindings(searchLoginTerm, searchEmailTerm);
            const sortQuery = this.__getUserSorting(sortBy, sortDirection);
            const { skip, limit, newPageNumber, newPageSize } = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            let users = yield db_1.usersCollection.find(findQuery).sort(sortQuery).skip(skip).limit(limit).toArray();
            const allUsers = yield db_1.usersCollection.find(findQuery).sort(sortQuery).toArray();
            let pagesCount = Math.ceil(allUsers.length / newPageSize);
            const fixArrayIds = users.map((user => this.__changeUserFormat(user)));
            return {
                "pagesCount": pagesCount,
                "page": newPageNumber,
                "pageSize": newPageSize,
                "totalCount": allUsers.length,
                "items": fixArrayIds
            };
        });
    },
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield db_1.usersCollection.findOne({ _id: userId });
            return getUser ? this.__changeUserFormat(getUser) : false;
        });
    },
    getUserByCustomField(fieldName, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let findQuery = {};
            findQuery[`${fieldName}`] = value;
            const getUser = yield db_1.usersCollection.findOne(findQuery);
            return !!getUser;
        });
    },
    getUserDataByCustomField(fieldName, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let findQuery = {};
            findQuery[`${fieldName}`] = value;
            const getUser = yield db_1.usersCollection.findOne(findQuery);
            return getUser;
        });
    },
    __changeUserFormat(obj) {
        obj.id = obj._id.toString();
        delete obj._id;
        return Object.assign({ id: obj.id }, obj.accountData);
    },
    __getUsersFindings(searchLoginTerm, searchEmailTerm) {
        let findQuery = {};
        if (searchLoginTerm || searchEmailTerm) {
            findQuery = {
                $or: [
                    { "accountData.login": { $regex: String(searchLoginTerm), $options: 'i' } },
                    { "accountData.email": { $regex: String(searchEmailTerm), $options: 'i' } }
                ]
            };
        }
        return findQuery;
    },
    __getUserSorting(sortBy, sortDirection) {
        let sortQuery = { "accountData.createdAt": -1 };
        if (sortBy) {
            delete sortQuery['accountData.createdAt'];
            sortQuery[`accountData.${sortBy}`] = sortDirection === 'asc' ? 1 : -1;
        }
        if (sortDirection && !sortBy) {
            sortQuery['accountData.createdAt'] = sortDirection === 'asc' ? 1 : -1;
        }
        return sortQuery;
    }
};
//# sourceMappingURL=users-query-repository.js.map