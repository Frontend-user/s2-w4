"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsPaginate = void 0;
exports.blogsPaginate = {
    getPagination(pageNumber, pageSize) {
        const newPageNumber = pageNumber !== null && pageNumber !== void 0 ? pageNumber : 1;
        const newPageSize = pageSize !== null && pageSize !== void 0 ? pageSize : 10;
        const skip = (newPageNumber - 1) * newPageSize;
        const limit = newPageSize;
        return { skip, limit, newPageNumber, newPageSize };
    }
};
//# sourceMappingURL=blogs-paginate.js.map