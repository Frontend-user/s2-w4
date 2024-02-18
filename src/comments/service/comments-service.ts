import {commentsRepository} from "../repository/comments-repository";
import {CommentCreateType, CommentEntity} from "../types/comment-type";
import {currentUser} from "../../application/current-user";
import {changeIdFormat} from "../../common/custom-methods/change-id-format";
import {ObjectId} from "mongodb";
import {PostUpdateType} from "../../common/types/post-type";
import {postsRepositories} from "../../posts/repositories/posts-repositories";
import {commentQueryRepository} from "../query-repository/comment-query-repository";

export const commentsService = {
    async createComment(comment: string, postId: string) {
        const newComment: CommentCreateType = {
            content: comment,
            postId: postId,
            commentatorInfo: {
                userId: currentUser.userId,
                userLogin: currentUser.userLogin
            },
            createdAt: new Date().toISOString()
        }
        const response = await commentsRepository.createComment(newComment)
        return response
    },

    async updateComment(id: ObjectId, content: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, {content: content})
    },
    async deleteComment(id: ObjectId): Promise<boolean > {
        return await commentsRepository.deleteCommentById(id)
    },

}