import {Request, Response, Router} from "express";
import {PostCreateType, PostViewType} from "../common/types/post-type";
import {ObjectId} from "mongodb";
import {HTTP_STATUSES} from "../common/constants/http-statuses";
import {authorizationMiddleware} from "../validation/auth-validation";
import {
    postBlogIdExistValidation,
    postBlogIdValidation,
    postContentValidation,
    postDescValidation,
    postTitleValidation
} from "../validation/posts-validation";
import {inputValidationMiddleware} from "../validation/blogs-validation";
import {
    blogsPostsBindingInputValidationMiddleware,
    postBlogBindIdExistValidation, postBlogsBindingBlogIdValidation,
} from "../validation/blogs-posts-bind-validation";
import {BlogViewType} from "../common/types/blog-type";
import {postsQueryRepository} from "../posts/posts-query/posts-query-repository";
import {postsService} from "../posts/domain/posts-service";
import {blogsQueryRepository} from "../blogs/blogs-query/blogs-query-repository";
import {getQueryData} from "../common/custom-methods/query-data";

export const blogsPostsBindRouter = Router({})
export const blogsPostBindValidators = [
    authorizationMiddleware,
    postTitleValidation,
    postDescValidation,
    postContentValidation,
    // postBlogsBindingBlogIdValidation,
    postBlogBindIdExistValidation,
    blogsPostsBindingInputValidationMiddleware
]
blogsPostsBindRouter.get('/:blogId/posts',
    postBlogBindIdExistValidation,
    blogsPostsBindingInputValidationMiddleware,
    async (req: Request, res: Response) => {
        let {sortBy, sortDirection, pageNumber, pageSize} = getQueryData(req)

        try {
            const posts = await postsQueryRepository.getPostsByBlogId(String(req.params.blogId), sortBy, sortDirection, pageNumber,pageSize)
            res.send(posts)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })


blogsPostsBindRouter.post('/:blogId/posts',
    ...blogsPostBindValidators,
    async (req: Request, res: Response) => {
        let getBlogName
        const getBlog:BlogViewType|boolean =  await blogsQueryRepository.getBlogById( req.params.blogId)
        if(getBlog){
            getBlogName = getBlog.name
        let newPost: PostCreateType = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.params.blogId,
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