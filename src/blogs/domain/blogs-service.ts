import {ObjectId} from "mongodb";
import {BlogCreateType, BlogUpdateType} from "../../common/types/blog-type";
import {blogsRepositories} from "../repository/blogs-repositories";


export const blogsService = {

    async createBlog(blog:BlogUpdateType): Promise<false | ObjectId> {
        const newBlog: BlogCreateType = {
            ...blog,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const newBlogId = await blogsRepositories.createBlog(newBlog)
        return newBlogId ? newBlogId : false
    },

    async updateBlog(id: ObjectId, updateBlog: BlogUpdateType): Promise<boolean> {
        return await blogsRepositories.updateBlog(id, updateBlog)
    },

    async deleteBlog(id: ObjectId): Promise<boolean> {
        return await blogsRepositories.deleteBlog(id)
    },

}