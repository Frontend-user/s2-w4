import {app} from "../../src/app";
import request from 'supertest'
import {BlogUpdateType, BlogViewType} from "../../src/common/types/blog-type";
import {Routes} from "../../src/common/constants/routes";
import any = jasmine.any;
// @ts-ignore
import {blogsTestManager} from "../utils/blogsTestManager";

describe('/blogs', () => {
    const token = 'Basic YWRtaW46cXdlcnR5'

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    let createBlog: any
    it('[CREATE BLOG] [CORRECT DATA] should return 201 for create new blog', async () => {
        const dataToCreateBlog: BlogUpdateType = {
            "name": "eeee",
            "description": "description",
            "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
        }


        createBlog = await blogsTestManager.createBlog(Routes.blogs, token, dataToCreateBlog)
        createBlog = createBlog.body

        expect(createBlog).toEqual({
            id: expect.any(String),
            name: "eeee",
            description: "description",
            websiteUrl: "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4",
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })

    })

    it('[GET BLOG] [EXISTING]should return 200 for  existing blog', async () => {
        await request(app)
            .get(`/blogs/${createBlog.id}`)
            .expect(200, createBlog)
    })
    const dataToCreateBlog: BlogUpdateType = {
        "name": "hhhh1",
        "description": "description",
        "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
    }

    it('[Sorting][CHECK BLOGS SORT ASCENDING] [CORRECT DATA] should return 201 for create new blog', async () => {
        await blogsTestManager.createBlog(Routes.blogs, token, dataToCreateBlog)
        await blogsTestManager.createBlog(Routes.blogs, token, {...dataToCreateBlog, name: 'aaaa2'})
        await blogsTestManager.createBlog(Routes.blogs, token, {...dataToCreateBlog, name: "bbbb3"})
        await blogsTestManager.createBlog(Routes.blogs, token, {...dataToCreateBlog, name: "dddd3"})
        await blogsTestManager.createBlog(Routes.blogs, token, {...dataToCreateBlog, name: "dddd5"})

        const response: any = await request(app)
            .get('/blogs')
                .query({sortBy: 'createdAt', sortDirection: 'asc'})
        const responseBlogs = response.body.items
        let resArr: any = []
        responseBlogs.forEach((i: any) => resArr.push(i.name))
        const arr: BlogViewType[] = responseBlogs
        const sortedArray = blogsTestManager.arraySort<BlogViewType>(arr, 'createdAt', 'asc')

        let sortedArrayNames: any = []
        sortedArray.forEach((i: any) => sortedArrayNames.push(i.name))
        expect(responseBlogs).toEqual(sortedArray);
    })

    it('[SearchNameTerm] [GET BLOGS][QUERY SearchNameTerm] [EXISTING]should arrays length = 1', async () => {
        const response = await request(app)
            .get(`/blogs?SearchNameTerm=a`)
        const responseBlogs = response.body.items

        expect(responseBlogs.length).toEqual(1)
    })

    it('[CHECK ALL QUERY][GET BLOGS][QUERY] [EXISTING]should return 200 for  existing blog', async () => {
        const response = await request(app)
            .get(`/blogs?SearchNameTerm=d`)
            .query({sortBy: 'name', sortDirection: 'desc'})
        const responseBlogs = response.body.items

        expect(responseBlogs.length).toEqual(2)
        const sortedArray = blogsTestManager.arraySort<BlogViewType>(responseBlogs, 'name', 'desc')
        expect(sortedArray).toEqual(responseBlogs)
    })

    // it('[PAGESIZE]', async () => {
    //     await request(app).delete('/testing/all-data')
    //     for(let i =1; i < 21; i++){
    //         await blogsTestManager.createBlog(Routes.blogs, token, {...dataToCreateBlog, name: `ITEM NUMBER:${i}`})
    //     }
    //
    //     const response = await request(app)
    //         .get(`/blogs?pageNumber=3&pageSize=5`)
    //         .query({pageNumber: '3', pageSize: '5'})
    //     const responseBlogs = response.body.items
    //     expect(responseBlogs.length).toEqual(5)
    //     expect(responseBlogs[0].name).toEqual(`ITEM NUMBER:10`)
    //     expect(responseBlogs[4].name).toEqual(`ITEM NUMBER:6`)
    // })

    // afterAll(async () => {
    //     await request(app).delete('/testing/all-data')
    // })


})



