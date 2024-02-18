import {tokensCollection, usersCollection} from "../../db";
import {AuthType} from "../auth-types/auth-types";
import {nodemailerService} from "../../application/nodemailer-service";
import {v4 as uuidv4} from "uuid";

export const authRepositories = {

    async authUser(auth: AuthType): Promise<boolean> {
        const response = await usersCollection.findOne({$or: [{'accountData.login': auth.loginOrEmail}, {'accountData.email': auth.loginOrEmail}]})
        return !!response
    },
    async getUserHash(auth: AuthType) {
        const response = await usersCollection.findOne({$or: [{'accountData.login': auth.loginOrEmail}, {'accountData.email': auth.loginOrEmail}]})
        return response ? response : false
    },
    async getUserIdByAutData(auth: AuthType) {
        const response = await usersCollection.findOne({$or: [{'accountData.login': auth.loginOrEmail}, {'accountData.email': auth.loginOrEmail}]})
        return response ? response : false
    },
    async getConfirmCode(code: string): Promise<boolean> {
        const getUser = await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
        if (getUser) {
            const respUpdate = await usersCollection.updateOne({_id: getUser._id},
                {$set: {isConfirmed: true}}
            )
            return respUpdate.modifiedCount === 1
        }
        return false
    },
    async addUnValidRefreshToken(refreshToken: string) {
        return await tokensCollection.insertOne({refreshToken: refreshToken})
    },

    async getUnValidRefreshTokens() {
        return await tokensCollection.find({}).toArray()
    },
    async registrationEmailResending(email: string) {
        const getUser = await usersCollection.findOne({'accountData.email': email})
        if (getUser) {
            const newCode = uuidv4()
            const respUpdate = await usersCollection.updateOne({_id: getUser._id},
                {$set: {'emailConfirmation.confirmationCode': newCode}}
            )
            if (respUpdate.matchedCount === 1) {
                await nodemailerService.send(newCode, email)
                return true
            } else {
                return false
            }

        }
        return false
    },

}