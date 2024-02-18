
import {body, check, validationResult, ValidationError} from "express-validator";
import {ObjectId} from "mongodb";
import {BlogViewType} from "../common/types/blog-type";
import {blogsQueryRepository} from "../blogs/blogs-query/blogs-query-repository";

export const postTitleValidation = body('title').trim().isLength({min: 4, max: 30}).withMessage({
    message: 'title is wrong',
    field: 'title'
})
export const postDescValidation = body('shortDescription').trim().isLength({min: 4, max: 100}).withMessage({
    message: 'shortDescription is wrong',
    field: 'shortDescription'
})


export const postContentValidation = body('content').trim().isLength({min: 4, max: 1000}).withMessage({
    message: 'content is wrong',
    field: 'content'
})

export const postBlogIdValidation = body('blogId').trim().isLength({min: 1, max: 300}).withMessage({
    message: 'id is wrong',
    field: 'id'
})

export const postBlogIdExistValidation = body('blogId').custom(async (value, {req}) => {
    const isExistBlogId: BlogViewType | boolean = await blogsQueryRepository.getBlogById(new ObjectId(value))
    if (isExistBlogId) {
        return true
    } else {
        throw new Error('Wrong blogID');
    }
}).withMessage({
    message: 'Wrong blogID',
    field: 'blogId'
})

export const postIdValidation = body('id').trim().isLength({min: 1, max: 300}).isString().withMessage({
    message: 'id is wrong',
    field: 'id'
})