export const blogsPaginate = {
    getPagination(pageNumber?: number, pageSize?: number) {
        const newPageNumber = pageNumber ?? 1
        const newPageSize = pageSize ?? 10
        const skip = (newPageNumber - 1) * newPageSize
        const limit = newPageSize

        return {skip, limit, newPageNumber, newPageSize}

    }

}