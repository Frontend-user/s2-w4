import {cookie, header, validationResult} from "express-validator";
import {CommentEntity} from "../../comments/types/comment-type";
import {commentQueryRepository} from "../../comments/query-repository/comment-query-repository";
import {ObjectId} from "mongodb";
import {NextFunction, Request, Response} from "express";
import {ErrorType} from "../../common/types/error-type";
import {jwtService} from "../../application/jwt-service";
import {authRepositories} from "../auth-repository/auth-repository";

export const authorizationTokenMiddleware = header('authorization').custom(async (value, {req}) => {
    if(!value){
        throw new Error('Wrong authorization');

    }

    let token = value.split(' ')[1]
    if (!token) {
        throw new Error('Wrong authorization');
    }
let userId
    try {
        userId = await jwtService.checkToken(token)
        if (!userId) {
            throw new Error('Wrong authorization');

        }
    } catch (e) {
        throw new Error('Wrong authorization');
    }
}).withMessage({
    message: 'authorization wrong',
    field:'authorization'
})

export const isUnValidTokenMiddleware =cookie('refreshToken').custom(async (value, {req}) => {
    let unValidTokens = await authRepositories.getUnValidRefreshTokens()
    let find = unValidTokens.filter((item) => item.refreshToken === value)
    if (find.length > 0) {
        throw new Error('Wrong refreshToken');
    }
    return true
})
export const refreshTokenValidator = cookie('refreshToken').custom(async (value, {req}) => {
    const refreshToken = value
    const isExpired = await jwtService.checkRefreshToken(refreshToken)
    if (isExpired && refreshToken) {
        return true
    } else {
        throw new Error('Wrong refreshToken');
    }
}).withMessage({
    message: 'error refreshToken',
    field: 'refreshToken'
})

export const tokenValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({onlyFirstError: true})
    if (errors.length) {
        let errorsForClient: ErrorType[] = []
        for (const error of errors) {
            errorsForClient.push(error.msg)
        }

        res.sendStatus(401)
        return
    } else {
        next()
    }
}
