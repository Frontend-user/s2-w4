"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryData = void 0;
const getQueryData = (req) => {
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
    let sortDirection = req.query.sortDirection ? String(req.query.sortDirection) : undefined;
    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : undefined;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
    return { sortBy, sortDirection, pageNumber, pageSize };
};
exports.getQueryData = getQueryData;
//# sourceMappingURL=query-data.js.map