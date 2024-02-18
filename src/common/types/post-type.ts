import {ObjectId} from "mongodb";

export type PostEntityType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string | ObjectId
    blogName: string
    createdAt: string
}

export type  PostViewType = Omit<PostEntityType, '_id'> & {
    id: string
}
export type  PostCreateType = Omit<PostEntityType, '_id' >
export type PostUpdateType = Omit<PostEntityType, '_id'  | 'createdAt' | 'blogName'>
export type PostUpdateTypeForBind = Omit<PostEntityType, '_id'  | 'createdAt' | 'blogName' | 'blogId'>