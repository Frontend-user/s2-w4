import request from "supertest";
import {app} from "../../src/app";
import {BlogUpdateType} from "../../src/common/types/blog-type";
// @ts-ignore
import {blogsTestManager} from "../utils/blogsTestManager";
import {Routes} from "../../src/common/constants/routes";
import {PostUpdateType, PostUpdateTypeForBind} from "../../src/common/types/post-type";

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
    })

    it('[CREATE BLOG] [CORRECT DATA] should return 201 for create new blog', async () => {
        const post: PostUpdateTypeForBind = {
            "title": "string",
            "shortDescription": "string",
            "content": "string"
        }
        let newPost = await blogsTestManager.createPost(Routes.blogsPostsBind, createBlog5.id, token, post)
        newPost = newPost.body
        expect(newPost).toEqual({
            id: expect.any(String),
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": expect.any(String),
            "blogName": expect.any(String),
            createdAt: expect.any(String)
        })
    })

    it('[CREATE BLOG] [CORRECT DATA] should return 201 for create new blog', async () => {
        const post: PostUpdateTypeForBind = {
            "title": "string",
            "shortDescription": "string",
            "content": "string"
        }
        for(let i = 0 ; i <7; i++){
            await blogsTestManager.createPost(Routes.blogsPostsBind, createBlog5.id, token, post)
        }

        const response = await request(app)
            .get(`/blogs/${createBlog5.id}/posts`)
            .query({pageNumber: 2, pageSize: 3})
    })

})
