import request from "supertest";
import {app} from "../../src/app";
import {Routes} from "../../src/common/constants/routes";

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

    let responseUserData: any
    it('[USERS] [GET USERS] [EXPECT 200 [] ]IS DELETE? Expect 200', async () => {
        responseUserData = await request(app)
            .post('/users')
            .set('Authorization', `${token}`)
            .send(correctUserData)
    })
    let jwt: any
    it('[AUTH]', async () => {
        jwt = await request(app)
            .post('/auth/login')
            .set('userid', responseUserData.body.id)
            .send({
                "loginOrEmail": "emailemail@mail.ru",
                "password": "password",
            })
    })
    it('[AUTH]', async () => {
        const getIdResponse = await request(app)

            .get('/auth/me')
            .set('authorization', 'Bearer ' + jwt.body.accessToken)

        expect(getIdResponse.body.userId).toEqual(responseUserData.body.id)
    })

    afterAll(async () => {
        await request(app).delete('/testing/all-data')
    })


})