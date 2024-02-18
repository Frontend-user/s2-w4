import {TypeQuerySortBlog} from "../types/query-types";
import {SortDirection} from "mongodb";

export const blogsSorting = {
    getSorting(sortBy?: string, sortDirection?: SortDirection | string) {
        let sortQuery: TypeQuerySortBlog = {"createdAt": -1}
        if (sortBy) {
            delete sortQuery['createdAt']
            sortQuery[`${sortBy}`] = sortDirection === 'asc' ? 1 : -1
        }
        if (sortDirection && !sortBy) {
            sortQuery['createdAt'] = sortDirection === 'asc' ? 1 : -1
        }
        return sortQuery
    }
}