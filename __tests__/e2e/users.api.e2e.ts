import request from "supertest";
import {app} from "../../src/app";
import {Routes} from "../../src/common/constants/routes";
import {BlogUpdateType} from "../../src/common/types/blog-type";
// @ts-ignore
import {blogsTestManager} from "../utils/blogsTestManager";
import {UserCreateType, UserInputModelType} from "../../src/users/types/user-types";
import {AuthType} from "../../src/auth/auth-types/auth-types";
import {ObjectId} from "mongodb";

describe('/Users', () => {

    const token = 'Basic YWRtaW46cXdlcnR5'
    const clearUserData = {
        "pagesCount": 0,
        "page": 1,
        "pageSize": 10,
        "totalCount": 0,
        "items": []
    }
    let correctUserData = {
        "login": "string",
        "email": "emailemail@mail.ru",
        "password": "password",
    }
    let inCorrectUserData = {
        "login": "a",
        "email": "emailemail",
        "password": "a",
    }

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })


    it('[USERS] [GET USERS] [EXPECT 200 [] ]IS DELETE? Expect 200', async () => {
        await request(app)
            .get(Routes.users)
            .set('Authorization', `${token}`)
            .expect(200, clearUserData)
    })

    it('[USERS] [CREATE USER] [CORRECT DATA] [Expect 201 CREATE USER]', async () => {
        const user: UserInputModelType = correctUserData
        let createUserResponse = await blogsTestManager.createBlog(Routes.users, token, user)
        createUserResponse = createUserResponse.body
        expect(createUserResponse).toEqual({
            "id": expect.any(String),
            "login": "string",
            "email": "emailemail@mail.ru",
            "createdAt": expect.any(String),
        })

    })

    it('[USERS] [CREATE USER] [INCORRECT DATA] [Expect 400 ERROR TO CREATE USER]', async () => {
        const user: UserInputModelType = inCorrectUserData
        let createUserResponse:any = await blogsTestManager.createBlog(Routes.users, token, user)
        createUserResponse = createUserResponse.body
        expect(Array.isArray(createUserResponse.errorsMessages)).toBe(true);
        expect(createUserResponse.errorsMessages.length).toBe(3);
        expect(createUserResponse.errorsMessages[2].field).toBe('email');
    })

    it('[USERS] [QUERY]', async () => {
        await request(app).delete('/testing/all-data')
        for(let i =1; i < 12; i++){
            await blogsTestManager.createBlog(Routes.users, token, {...correctUserData, login: `login:3${i}`})
        }

        const response = await request(app)
            .get(Routes.users)
            .set('Authorization', `${token}`)
            .query({searchLoginTerm:'3',pageNumber: 2, pageSize:3,sortBy: 'login', sortDirection: 'desc'})
        const responseBlogs = response.body.items
        expect(responseBlogs.length).toEqual(3)
        expect(responseBlogs[0].login).toEqual('login:36')
        const responseAll = await request(app)
            .get(Routes.users)
            .set('Authorization', `${token}`)
        expect(responseAll.body.items.length).toEqual(10)

    })


    let createUserResponseForDelete: any
    it('[USERS] [CREATE USER] [CORRECT DATA] [Expect 201 CREATE USER]', async () => {
        const user: UserInputModelType = correctUserData
        createUserResponseForDelete= await blogsTestManager.createBlog(Routes.users, token, user)
        createUserResponseForDelete = createUserResponseForDelete.body
        expect(createUserResponseForDelete).toEqual({
            "id": expect.any(String),
            "login": "string",
            "email": "emailemail@mail.ru",
            "createdAt": expect.any(String),
        })

    })


    it('[USERS][DELETE CORRECT] EXCEPT 204', async () => {
        await request(app)
            .delete(`/users/${createUserResponseForDelete.id}`)
            .set('Authorization', `${token}`)
            .expect(204)
    })

    it('[AUTH / USERS] [INCORRECT DATA] [Expect 401 ]', async () => {
        const user: UserInputModelType = correctUserData
        createUserResponseForDelete= await blogsTestManager.createBlog(Routes.users, token, user)
        const authData:AuthType = {
            loginOrEmail:  'string',
            password:  'password',
        }
    await request(app)
            .post(Routes.authLogin)
            .send(authData)
           .expect(200)

    })

    afterAll(async () => {
        await request(app).delete('/testing/all-data')
    })


})