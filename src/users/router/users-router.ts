import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {blogsQueryRepository} from "../../blogs/blogs-query/blogs-query-repository";
import {BlogCreateType, BlogViewType} from "../../common/types/blog-type";
import {ObjectId} from "mongodb";
import {blogsService} from "../../blogs/domain/blogs-service";
import {
    usersEmailValidation,
    usersLoginValidation,
    usersPasswordValidation,

} from "../validation/users-validation";
import {blogIdValidation, inputValidationMiddleware} from "../../validation/blogs-validation";
import {UserCreateType, UserEmailEntityType, UserInputModelType, UserViewType} from "../types/user-types";
import {usersService} from "../domain/users-service";
import {usersRepositories} from "../repository/users-repository";
import {usersQueryRepository} from "../query-repository/users-query-repository";
import {authorizationMiddleware} from "../../validation/auth-validation";
import {blogsRouter} from "../../blogs/router/blogs-router";
import {getQueryData} from "../../common/custom-methods/query-data";

export const usersValidators = [
    authorizationMiddleware,
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
    inputValidationMiddleware,
]
export const usersRouter = Router({})


usersRouter.get('/',
    authorizationMiddleware,
    async (req: Request, res: Response) => {
        try {
            let {sortBy, sortDirection, pageNumber, pageSize} = getQueryData(req)

            let searchLoginTerm = req.query.searchLoginTerm ? String(req.query.searchLoginTerm): undefined
            let searchEmailTerm = req.query.searchEmailTerm ? String(req.query.searchEmailTerm): undefined

            const blogs = await usersQueryRepository.getUsers(searchLoginTerm,searchEmailTerm, sortBy, sortDirection, pageNumber,pageSize)
            res.status(HTTP_STATUSES.OK_200).send(blogs)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })


usersRouter.post('/',
    ...usersValidators,
    async (req: Request, res: Response) => {
        try {
            const isReqFromSuperAdmin = true
            const user: UserInputModelType = {
                login: req.body.login,
                email: req.body.email,
                password: req.body.password,
            }
            const response:  ObjectId | false = await usersService.createUser(user, isReqFromSuperAdmin)
            if (response) {
                const createdBlog: UserViewType | false = await usersQueryRepository.getUserById(response)
                res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
                return
            }

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    })


usersRouter.delete('/:id',
    authorizationMiddleware,
    blogIdValidation,
    async (req: Request, res: Response) => {
        try {
            const response: boolean = await usersService.deleteUser(new ObjectId(req.params.id))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

