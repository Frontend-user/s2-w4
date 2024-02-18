import {Router, Request, Response} from "express";
import {PostCreateType, PostViewType} from "../../common/types/post-type";
import {authorizationMiddleware, bearerAuthMiddleware} from "../../validation/auth-validation";
import {
    postBlogIdExistValidation,
    postBlogIdValidation,
    postContentValidation,
    postDescValidation,
    postIdValidation,
    postTitleValidation
} from "../../validation/posts-validation";
import {inputValidationMiddleware} from "../../validation/blogs-validation";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {ObjectId} from "mongodb";
import {postsService} from "../domain/posts-service";
import {BlogViewType} from "../../common/types/blog-type";
import {postsQueryRepository} from "../posts-query/posts-query-repository";
import {blogsQueryRepository} from "../../blogs/blogs-query/blogs-query-repository";
import {commentsService} from "../../comments/service/comments-service";
import {commentQueryRepository} from "../../comments/query-repository/comment-query-repository";
import {
    commentContentValidation, commentInputValidationMiddleware,
    commentPostIdExistValidation
} from "../../comments/validation/comments-validation";
import {getQueryData} from "../../common/custom-methods/query-data";

export const postValidators = [
    authorizationMiddleware,
    postTitleValidation,
    postDescValidation,
    postContentValidation,
    postBlogIdValidation,
    postBlogIdExistValidation,
    inputValidationMiddleware
]

export const postsRouter = Router({})
postsRouter.post('/:postId/comments',
    bearerAuthMiddleware,
    commentPostIdExistValidation,
    commentContentValidation,
    commentInputValidationMiddleware,

    async (req: Request, res: Response) => {
        const commentContent: string = req.body.content
        const postId: string = req.params.postId
        const commentId = await commentsService.createComment(commentContent, postId)
        if (!commentId) {
            res.sendStatus(404)
        } else {
            const comment = await commentQueryRepository.getCommentById(commentId)
            delete  comment.postId
            res.status(201).send(comment)
        }
    })

postsRouter.get('/:postId/comments',
    commentPostIdExistValidation,
    commentInputValidationMiddleware,
    async (req: Request, res: Response) => {
        let {sortBy, sortDirection, pageNumber, pageSize} = getQueryData(req)

        const postId: string = req.params.postId

        try {
            const comment = await commentQueryRepository.getCommentsByPostId(postId, sortBy, sortDirection, pageNumber, pageSize)


            res.status(200).send(comment)

        } catch (e) {
            res.send(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })

postsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            let {sortBy, sortDirection, pageNumber, pageSize} = getQueryData(req)
            const posts = await postsQueryRepository.getPosts(sortBy, sortDirection, pageNumber, pageSize)
            res.status(HTTP_STATUSES.OK_200).send(posts)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.status(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })


postsRouter.get('/:id',
    postIdValidation,
    async (req: Request, res: Response) => {
        try {
            const post = await postsQueryRepository.getPostById(req.params.id)
            if (!post) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res.status(HTTP_STATUSES.OK_200).send(post)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
)

postsRouter.post('/',
    ...postValidators,
    async (req: Request, res: Response) => {
        let getBlogName
        const getBlog: BlogViewType | boolean = await blogsQueryRepository.getBlogById(req.body.blogId)
        if (getBlog) {
            getBlogName = getBlog.name
            let newPost: PostCreateType = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
                blogName: getBlogName,
                createdAt: new Date().toISOString()
            }

            try {
                const response = await postsService.createPost(newPost)
                if (response instanceof ObjectId) {
                    const createdPost: PostViewType | boolean = await postsQueryRepository.getPostById(response)
                    res.status(HTTP_STATUSES.CREATED_201).send(createdPost)
                    return
                }
                res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

            } catch (error) {
                res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
            }
        }


    })

postsRouter.put('/:id',
    ...postValidators,
    async (req: Request, res: Response) => {
        let postDataToUpdate = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        }
        try {
            const response: boolean = await postsService.updatePost(new ObjectId(req.params.id), postDataToUpdate)
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })


postsRouter.delete('/:id',
    authorizationMiddleware,
    postIdValidation,
    async (req: Request, res: Response) => {
        try {
            const response: boolean = await postsService.deletePost(new ObjectId(req.params.id))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })