import {
    authLoginOrEmailValidation, checkCodeConfirmation, checkCodeExist, checkEmailConfirmation,
    userEmailExistValidation, userEmailRecendingExistValidation,
    userLoginExistValidation,
    usersEmailValidation,
    usersLoginValidation,
    usersPasswordValidation
} from "../../users/validation/users-validation";
import {inputValidationMiddleware} from "../../validation/blogs-validation";

const jwt = require('jsonwebtoken')
export const registrationValidators = [
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
    userEmailExistValidation,
    userLoginExistValidation,
    inputValidationMiddleware,
]
const authValidators = [
    usersPasswordValidation,
    authLoginOrEmailValidation,
    inputValidationMiddleware,
]
import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {authService} from "../auth-domain/auth-service";
import {AuthType} from "../auth-types/auth-types";
import {jwtService} from "../../application/jwt-service";
import {currentUser} from "../../application/current-user";
import {usersQueryRepository} from "../../users/query-repository/users-query-repository";
import {ObjectId} from "mongodb";
import {authRepositories} from "../auth-repository/auth-repository";
import {
    authorizationTokenMiddleware, isUnValidTokenMiddleware,
    refreshTokenValidator,
    tokenValidationMiddleware,
} from "../validation/tokenValidator";

export const authRouter = Router({})


authRouter.get('/me',
    authorizationTokenMiddleware,
    tokenValidationMiddleware,
    async (req: Request, res: Response) => {
        let token = req.headers.authorization!.split(' ')[1]
        let userId = await jwtService.checkToken(token)

        const getUserByID = await usersQueryRepository.getUserById(new ObjectId(userId))
        if (!getUserByID) {
            res.sendStatus(401)
            return
        }
        if (getUserByID) {
            currentUser.userLogin = getUserByID.login
            currentUser.userId = userId
            res.send({
                "email": getUserByID.email,
                "login": getUserByID.login,
                "userId": getUserByID.id
            })
            return

        } else {
            res.sendStatus(401)
            return

        }

    })

authRouter.post('/logout',
   refreshTokenValidator,
    isUnValidTokenMiddleware,
    tokenValidationMiddleware,
    async (req: Request, res: Response) => {
        const getRefreshToken = req.cookies.refreshToken
        const userId = await jwtService.checkRefreshToken(getRefreshToken)
        if (!userId) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
            return
        }
        await authRepositories.addUnValidRefreshToken(getRefreshToken)
        res.sendStatus(204)
    }
)
authRouter.post('/refresh-token',
    refreshTokenValidator,
    isUnValidTokenMiddleware,
    tokenValidationMiddleware,
    async (req: Request, res: Response) => {

        const getRefreshToken = req.cookies.refreshToken
        const userId = await jwtService.checkRefreshToken(getRefreshToken)
        if (!userId) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
            return
        }
        const refreshToken = await jwtService.createRefreshToken(userId)
        const token = await jwtService.createJWT(userId)
        await authRepositories.addUnValidRefreshToken(getRefreshToken)

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        res.send({accessToken: token})
    }
)
authRouter.post('/login',
    async (req: Request, res: Response) => {
        try {
            const authData: AuthType = {
                loginOrEmail: req.body.loginOrEmail,
                password: req.body.password,
            }
            const response = await authService.authUser(authData)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
                return
            }
            const user = await authRepositories.getUserIdByAutData(authData)
            if (user) {

                const token = await jwtService.createJWT(user._id)
                const refreshToken = await jwtService.createRefreshToken(user._id)
                res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
                res.send({accessToken: token})


            }
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    })

authRouter.post('/registration',
    ...registrationValidators,
    async (req: Request, res: Response) => {
        try {

            const userInputData = {
                login: req.body.login,
                email: req.body.email,
                password: req.body.password,
            }
            const response = await authService.registration(userInputData)

            if (!response) {
                res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
                return
            }
            res.send(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })


authRouter.post('/registration-confirmation',
    checkCodeConfirmation,
    checkCodeExist,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {

            const response = await authService.registrationConfirm(req.body.code)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
                return
            }

            res.send(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })

authRouter.post('/registration-email-resending',
    checkEmailConfirmation,
    userEmailRecendingExistValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {

            const response = await authService.registrationEmailResending(req.body.email)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
                return
            }

            res.send(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })

