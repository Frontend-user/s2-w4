"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsSorting = void 0;
exports.blogsSorting = {
    getSorting(sortBy, sortDirection) {
        let sortQuery = { "createdAt": -1 };
        if (sortBy) {
            delete sortQuery['createdAt'];
            sortQuery[`${sortBy}`] = sortDirection === 'asc' ? 1 : -1;
        }
        if (sortDirection && !sortBy) {
            sortQuery['createdAt'] = sortDirection === 'asc' ? 1 : -1;
        }
        return sortQuery;
    }
};
//# sourceMappingURL=blogs-sorting.js.map