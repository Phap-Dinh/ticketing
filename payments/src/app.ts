import express from 'express'
// Using THROW NEW in async function
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@phapdinhtickets/common'
import { createChargeRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)

app.use(currentUser)
app.use(createChargeRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }
