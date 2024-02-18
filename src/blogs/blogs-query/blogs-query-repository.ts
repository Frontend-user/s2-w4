import {blogsCollection} from "../../db";
import {ObjectId, SortDirection} from "mongodb";
import {BlogEntityType, BlogViewType} from "../../common/types/blog-type";
import {blogsSorting} from "./utils/blogs-sorting";
import {blogsFinding} from "./utils/blogs-finding";
import {blogsPaginate} from "./utils/blogs-paginate";
import {Pagination} from "../../common/types/pagination";
import {changeIdFormat} from "../../common/custom-methods/change-id-format";


export const blogsQueryRepository = {

    async getBlogs(searchNameTerm?: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number) {
        const findQuery = blogsFinding.getFindings(searchNameTerm)
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)
        let blogs: BlogEntityType[] = await blogsCollection.find(findQuery).sort(sortQuery).skip(skip).limit(limit).toArray();
        const allBlogs = await blogsCollection.find(findQuery).sort(sortQuery).toArray()
        let pagesCount = Math.ceil(allBlogs.length / newPageSize)


        const fixArrayIds: BlogViewType[] = blogs.map((item => changeIdFormat(item)))
        const response: Pagination<BlogViewType[]> = {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allBlogs.length,
            "items": fixArrayIds
        }

        return response
    },

    async getBlogById(id: string | ObjectId): Promise<BlogViewType | false> {
        if (ObjectId.isValid(id) && typeof id === 'string' || id instanceof ObjectId) {
            const blog: BlogEntityType | null = await blogsCollection.findOne({_id: new ObjectId(id)})
            return blog ?  changeIdFormat(blog) : false
        }
        return false

    },

}