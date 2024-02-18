import {ObjectId} from "mongodb";
import {PostCreateType, PostEntityType, PostUpdateType, PostViewType} from "../../common/types/post-type";
import {postsRepositories} from "../repositories/posts-repositories";



export const postsService = {

    async createPost(post: PostCreateType): Promise<false | ObjectId> {
        const newPostId = await postsRepositories.createPost(post)
        return newPostId ? newPostId : false
    },

    async updatePost(id: ObjectId, updatePost: PostUpdateType): Promise<boolean> {
        return await postsRepositories.updatePost(id, updatePost)
    },


    async deletePost(id: ObjectId): Promise<boolean> {
        return await postsRepositories.deletePost(id)
    },

}