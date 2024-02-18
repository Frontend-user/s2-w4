import {SortDirection} from "mongodb";

export  type TypeQuerySortBlog = {
    [key: string]: SortDirection;
}

export type QueryFindType =  {
    [key:string]: {$regex: string,  [key:string]: string}

}