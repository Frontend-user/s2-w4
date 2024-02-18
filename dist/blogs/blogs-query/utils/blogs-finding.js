"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsFinding = void 0;
exports.blogsFinding = {
    getFindings(searchNameTerm) {
        let findQuery = {};
        if (searchNameTerm) {
            findQuery["name"] = { $regex: searchNameTerm, $options: 'i' };
        }
        return findQuery;
    }
};
//# sourceMappingURL=blogs-finding.js.map