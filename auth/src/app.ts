import express from 'express'
// Using THROW NEW in async function
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@phapdinhtickets/common'

import { currentUserRouter } from './routes/currrent-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

const app = express()
// Express doesn't trust proxy (ingress nginx)
app.set('trust proxy', true)
app.use(json())
// create session on server => middleware will automatically create and res cookie
// secure: true => https connect to, when using ingress-nginx
// secure: false => http connect to, when using supertest
// When testing, jest will set process.env.NODE_ENV = 'test'
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

// Sync
// app.all('*', () => {
//     throw new NotFoundError()
// })

// Async
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError())
// })

// Using express-async-errors
app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }
