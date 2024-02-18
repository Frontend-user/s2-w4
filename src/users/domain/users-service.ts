import {ObjectId} from "mongodb";
import {usersRepositories} from "../repository/users-repository";
import {UserCreateType, UserEmailEntityType, UserHashType, UserInputModelType, UserViewType} from "../types/user-types";
import {usersQueryRepository} from "../query-repository/users-query-repository";
import {jwtService} from "../../application/jwt-service";

const bcrypt = require('bcrypt');


export const usersService = {
    async createUser(user: UserInputModelType, isReqFromSuperAdmin: boolean): Promise<ObjectId | false> {
        const passwordSalt=  await jwtService.generateSalt(10)
        const passwordHash = await jwtService.generateHash(user.password, passwordSalt)

         const  userEmailEntity: UserEmailEntityType  = {
             accountData: {
                 login: user.login,
                 email: user.email,
                 createdAt: new Date().toISOString(),
             },
             passwordSalt,
             passwordHash,
             emailConfirmation: {
                 confirmationCode: 'superadmin',
                 expirationDate: 'superadmin'
             },
             isConfirmed: isReqFromSuperAdmin,
             isCreatedFromAdmin: true
         }
            const userId = await usersRepositories.createUser(userEmailEntity)
            if (!userId) {
                return false
            }
            return userId

    },
    async deleteUser(id: ObjectId): Promise<boolean> {
        return await usersRepositories.deleteUser(id)

    },



}