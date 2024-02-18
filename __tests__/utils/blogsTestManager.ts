import request from "supertest";
import {app} from "../../src/app";
import {PostUpdateTypeForBind} from "../../src/common/types/post-type";

export const blogsTestManager = {

    async createBlog(route: string, token: string, dataToCreateBlog: any) {
        const responseCreateBlog = await request(app)
            .post(route)
            .set('Authorization', `${token}`)
            .send(dataToCreateBlog)
        return responseCreateBlog

    },
    async createPost(route: string,blogId:string, token: string, dataToCreateBlog: PostUpdateTypeForBind) {
        const responseCreateBlog = await request(app)
            .post(`/blogs/${blogId}/posts`)
            .set('Authorization', `${token}`)
            .send(dataToCreateBlog)

        return responseCreateBlog

    },
     arraySort<T>(arrayToSort:T[], sortBy: string = 'createdAt', sortDirection: string = 'desc') {
        return  arrayToSort.slice().sort((a: any, b: any) => {
            if (a[sortBy] < b[sortBy]) {
                return sortDirection === 'asc' ? -1 : 1
            } else if (a[sortBy] > b[sortBy]) {
                return sortDirection === 'asc' ? 1 : -1
            } else {
                return 0
            }
        });
    }

}