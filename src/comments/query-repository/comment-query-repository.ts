import {commentsCollection, postsCollection} from "../../db";
import {ObjectId} from "mongodb";
import {blogsSorting} from "../../blogs/blogs-query/utils/blogs-sorting";
import {blogsPaginate} from "../../blogs/blogs-query/utils/blogs-paginate";
import {changeIdFormat} from "../../common/custom-methods/change-id-format";

export const commentQueryRepository = {
    async getCommentByCommentId() {
        const comments = await commentsCollection.find({}).toArray()
        return comments
    },
    async getCommentsByPostId(postId: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number) {
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)
        const comments = await commentsCollection.find({postId: postId}).sort(sortQuery).skip(skip).limit(limit).toArray()
        const allComments = await commentsCollection.find({postId: postId}).sort(sortQuery).toArray()

        let pagesCount = Math.ceil(allComments.length / newPageSize)
        const fixArrayIds = comments.map((item => this.changeCommentFormat(item)))

        return {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allComments.length,
            "items": fixArrayIds
        }

    },
    async getCommentById(commentId: ObjectId) {
        const comment = await commentsCollection.findOne({_id: commentId})

        return comment ? this.changeCommentFormat(comment) : false
    },

    changeCommentFormat (obj: any){
        obj.id = obj._id
        delete obj._id
        delete obj.postId
        return obj
    }
}