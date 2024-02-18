import {CommentCreateType, CommentEntity} from "../types/comment-type";
import {commentsCollection, postsCollection} from "../../db";
import {PostCreateType, PostUpdateType} from "../../common/types/post-type";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async createComment(comment: CommentCreateType): Promise<false | ObjectId> {
        let response = await commentsCollection.insertOne(comment);
        return response ? response.insertedId : false
    },

    async updateComment(id: ObjectId, updateComment: {
        content: string
    }): Promise<boolean> {
        const response = await commentsCollection.updateOne({_id: id}, {$set: updateComment})
        return response.matchedCount === 1;
    },

    async deleteCommentById(commentId: ObjectId) {
        const comment = await commentsCollection.deleteOne({_id: commentId})
        return !!comment
    },

}