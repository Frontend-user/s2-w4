import {app} from "../../src/app";
import request from 'supertest'
// @ts-ignore
import {blogsTestManager} from "../utils/blogsTestManager";
import {Routes} from "../../src/common/constants/routes";
import {BlogUpdateType} from "../../src/common/types/blog-type";

describe('/blogs', () => {

    const token = 'Basic YWRtaW46cXdlcnR5'

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('API[GET BLOGS] [EXPECT 200 [] ]IS DELETE? should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200,  { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })
    //
    it('[CREATE BLOG] [CORRECT DATA] should return 201 for create new blog', async () => {
        const blog: BlogUpdateType = {
            "name": "bbbbbbbb",
            "description": "description",
            "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
        }
        let getBlog = await blogsTestManager.createBlog(Routes.blogs, token, blog)
        getBlog = getBlog.body
        expect(getBlog).toEqual({
            id: expect.any(String),
            name: "bbbbbbbb",
            description: "description",
            websiteUrl: "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4",
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })

    })


    it('[GET BLOG] [NOT EXISTING]should return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/1')
            .expect(404)
    })

    it('[AUTH INCORRECT] should return 401 for false Authorization data', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', 'dasdadsadsadsa')
            .expect(401)
    })


    it('[CREATE BLOG] [INCORRECT] should return 400 for incorrect data to ', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `${token}`)
            .send({
                "name": "",
                "description": "",
                "websiteUrl": "e4"
            })
            .expect(400)
    })
    let createBlog5: any
    it('[CREATE BLOG] [CORRECT DATA] should return 201 for create new blog', async () => {
        const createResponse = await request(app)

            .post('/blogs')
            .set('Authorization', `${token}`)
            .send({
                "name": "name",
                "description": "description",
                "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
            })
        createBlog5 = createResponse.body
        expect(createBlog5).toEqual({
            id: expect.any(String),
            name: "name",
            description: "description",
            websiteUrl: "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4",
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })
    })
    //
    it('[GET BLOG] [EXISTING]should return 200 for  existing blog', async () => {
        await request(app)
            .get(`/blogs/${createBlog5.id}`)
            .expect(200, createBlog5)
    })

    //
    it('[CREATE BLOG] [CORRECT DATA] should return 201 for create new blog', async () => {
        const createResponse = await request(app)

            .post('/blogs')
            .set('Authorization', `${token}`)
            .send({
                "name": "name",
                "description": "description",
                "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
            })

        await request(app)
            .post('/blogs')
            .set('Authorization', `${token}`)
            .send({
                "name": "aaaaaaaa",
                "description": "description",
                "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
            })
        await request(app)
            .post('/blogs')
            .set('Authorization', `${token}`)
            .send({
                "name": "aaaaaaaa",
                "description": "description",
                "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
            })
    })

    let err: any = {
        "errorsMessages": [
            {
                "message": "name",
                "field": "name"
            }
        ]
    }
    it('[PUT BLOG] [INCORRECT DATA] EXCEPT(400)', async () => {
        const createResponse = await request(app)

            .put(`/blogs/${createBlog5.id}`)
            .set('Authorization', `${token}`)
            .send({
                "name": "",
                "description": "ggggfddfgdsdggadsdsasadsd",
                "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
            })
            .expect(400, err)

    })
    it('[PUT BLOG] [CORRECT DATA] EXCEPT(204)', async () => {
        const createResponse = await request(app)

            .put(`/blogs/${createBlog5.id}`)
            .set('Authorization', `${token}`)
            .send({
                "name": "UPDATE$$$$",
                "description": "afsdfsdfsd",
                "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
            })
            .expect(204)

    })
    // //
    it('[PUT BLOG] [NOT EXISTING ID] EXCEPT(404)', async () => {
        const createResponse = await request(app)

            .put(`/blogs/233232`)
            .set('Authorization', `${token}`)
            .send({
                "name": "UPDATE$$$$",
                "description": "afsdfsdfsd",
                "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
            })
            .expect(404)

    })


    it('[DELETE BLOG] [NOT EXISTING]should return 404 for not  existing blog ID', async () => {
        await request(app)
            .delete(`/blogs/1`)
            .set('Authorization', `${token}`)
            .expect(404)
    })

    it('[DELETE BLOG] [EXISTING]should return 204 for existing blog ID', async () => {
        await request(app)
            .delete(`/blogs/${createBlog5.id}`)
            .set('Authorization', `${token}`)

            .expect(204)
    })


    afterAll(async () => {
        await request(app).delete('/testing/all-data')
    })


})