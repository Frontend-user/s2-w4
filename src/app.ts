import express, {NextFunction, Request, Response, Router} from 'express'
import {runDb} from "./db";
import {testRouter} from "./routes/test-router";
import {blogsPostsBindRouter} from "./routes/blogs-posts-bindings-router";
import {usersRouter} from "./users/router/users-router";
import {blogsRouter} from "./blogs/router/blogs-router";
import {postsRouter} from "./posts/router/posts-router";
import {authRouter} from "./auth/auth-router/auth-router";
import {commentsRouter} from "./comments/router/comments-router";
import cookieParser from "cookie-parser";
export const app = express()
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.use('/blogs',blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/auth', authRouter)
app.use('/testing',testRouter)
app.use('/blogs',blogsPostsBindRouter)

