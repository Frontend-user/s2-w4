export type CommentEntity = {
    _id: string
    content: string
    postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
}

export type CommentCreateType = Omit<CommentEntity, '_id'>