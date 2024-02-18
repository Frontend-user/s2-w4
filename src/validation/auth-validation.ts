import {NextFunction, Request, Response, ErrorRequestHandler} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../users/query-repository/users-query-repository";
import {ObjectId} from "mongodb";
import {currentUser} from "../application/current-user";
const AUTH_CODE = 'YWRtaW46cXdlcnR5'
export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let requestAuthCode = req.headers.authorization

    if (!requestAuthCode || requestAuthCode.slice(6) !== AUTH_CODE) {
        res.sendStatus(401)
        return
    } else {
        next()
    }

}

export const bearerAuthMiddleware = async (req:Request, res:Response, next: NextFunction)=>{
    if(!req.headers.authorization){

        res.sendStatus(401)
        return
    }
    let token = req.headers.authorization!.split(' ')[1]

    const userId = await jwtService.checkToken(token)
    const getUserByID = await usersQueryRepository.getUserById(new ObjectId(userId))
    if(!getUserByID || !userId){

        res.sendStatus(401)
        return
    } else {

        currentUser.userId = userId
        currentUser.userLogin = getUserByID.login
    // currentUser.updateCurrentUser(userId,getUserByID.login)
        next()
    }
}