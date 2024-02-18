import {blogsCollection} from "../../db";
import {ObjectId} from "mongodb";
import {BlogCreateType, BlogUpdateType} from "../../common/types/blog-type";


export const blogsRepositories = {

    async createBlog(blog: BlogCreateType): Promise<false | ObjectId> {
        const response = await blogsCollection.insertOne(blog)
        return response ? response.insertedId : false
    },

    async updateBlog(id: ObjectId, updateBlog: BlogUpdateType): Promise<boolean> {
        const response = await blogsCollection.updateOne({_id: id}, {$set: updateBlog})
        return response.matchedCount === 1;
    },


    async deleteBlog(id: ObjectId): Promise<boolean> {
        const response = await blogsCollection.deleteOne({_id: id})
        return !!response.deletedCount;
    },

}