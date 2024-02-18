import {body, check} from "express-validator";
import {BlogViewType} from "../../common/types/blog-type";
import {blogsQueryRepository} from "../../blogs/blogs-query/blogs-query-repository";
import {ObjectId} from "mongodb";
import {usersCollection} from "../../db";
import {usersQueryRepository} from "../query-repository/users-query-repository";

const usersEmailPattern =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const usersLoginValidation = body('login').trim().isString().isLength({min: 3, max: 10}).withMessage({
    message: 'login is wrong',
    field: 'login'
})

export const usersPasswordValidation = body('password').trim().isString().isLength({min: 6, max: 20}).withMessage({
    message: 'password is wrong',
    field: 'password'
})
export const authLoginOrEmailValidation = body('loginOrEmail').trim().isString().isLength({min:3, max:20}).withMessage({
    message: 'loginOrEmail is unvalid',
    field: 'loginOrEmail'
})
export const usersEmailValidation = body('email').trim().isString().withMessage({
    message: 'email is wrong',
    field: 'email'
}).matches(usersEmailPattern).withMessage({
    message: 'email pattern is wrong',
    field: 'email'
})
export const userEmailExistValidation = body('email').custom(async (value, {req}) => {
    const isExistEmail = await usersQueryRepository.getUserByCustomField('accountData.email',value)
    if (!isExistEmail) {
        return true
    } else {
        throw new Error('email exist');
    }
}).withMessage({
    message: 'email exist',
    field: 'email'
})
export const userLoginExistValidation = body('login').custom(async (value, {req}) => {
    const isExistEmail = await usersQueryRepository.getUserByCustomField('accountData.login',value)
    if (!isExistEmail) {
        return true
    } else {
        throw new Error('login exist');
    }
}).withMessage({
    message: 'login exist',
    field: 'login'
})
export const checkCodeConfirmation = body('code').custom(async (value, {req}) => {
    const isExistEmail = await usersQueryRepository.getUserDataByCustomField('emailConfirmation.confirmationCode',value)

    if (isExistEmail && isExistEmail.isConfirmed) {
        throw new Error('code exist');
        } else {
        return true
    }
}).withMessage({
    message: 'code exist',
    field: 'code'
})
export const checkCodeExist = body('code').custom(async (value, {req}) => {
    const isExistEmail = await usersQueryRepository.getUserByCustomField('emailConfirmation.confirmationCode',value)
    if (isExistEmail) {
        return true
    } else {
        throw new Error('code exist');
    }
}).withMessage({
    message: 'code exist',
    field: 'code'
})


export const checkEmailConfirmation = body('email').custom(async (value, {req}) => {
    const isExistEmail = await usersQueryRepository.getUserDataByCustomField('accountData.email',value)
    if (isExistEmail && !isExistEmail.isConfirmed) {
        return true
    }
    else {  throw new Error('code exist');
    }
}).withMessage({
    message: 'email exist',
    field: 'email'
})

export const userEmailRecendingExistValidation = body('email').custom(async (value, {req}) => {
    const isExistEmail = await usersQueryRepository.getUserByCustomField('accountData.email',value)
    if (!isExistEmail) {
         throw new Error('email exist');
    } else {
        return true
    }
}).withMessage({
    message: 'email not exist',
    field: 'email'
})