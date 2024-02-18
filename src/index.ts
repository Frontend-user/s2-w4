import express, {NextFunction, Request, Response} from 'express'
import {client, runDb} from "./db";
import {app} from "./app";

const PORT = 3000

app.get('/', (req: Request, res: Response) => {
    res.send('w')
})


const startApp = async () => {
    await runDb()
    app.listen(PORT, () => {
        console.log(`START on PORT ${PORT}`)
    })

}
startApp()
