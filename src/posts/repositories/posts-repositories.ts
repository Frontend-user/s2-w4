import {postsCollection} from "../../db";
import {ObjectId} from "mongodb";
import {PostCreateType, PostUpdateType} from "../../common/types/post-type";




export const postsRepositories = {

    async createPost(post:PostCreateType): Promise<false | ObjectId> {
        const response = await postsCollection.insertOne(post)
        return response.insertedId ? response.insertedId: false
    },

    async updatePost(id:ObjectId, updatePost:PostUpdateType): Promise<boolean> {
        const response = await postsCollection.updateOne({_id: id}, {$set: updatePost})
        return response.matchedCount === 1;
    },


    async deletePost(id: ObjectId): Promise<boolean> {
        const response = await postsCollection.deleteOne({_id: id})
        return !!response.deletedCount;
    },

}