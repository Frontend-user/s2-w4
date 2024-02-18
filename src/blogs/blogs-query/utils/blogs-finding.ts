import {QueryFindType} from "../types/query-types";

export const blogsFinding = {
    getFindings(searchNameTerm?:string){
        let findQuery: QueryFindType = {}
        if (searchNameTerm) {
            findQuery["name"] = {$regex: searchNameTerm, $options: 'i'};
        }
        return findQuery
    }
}

