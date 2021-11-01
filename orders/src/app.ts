import express from 'express'
// Using THROW NEW in async function
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@phapdinhtickets/common'

import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes'
import { deleteOrderRouter } from './routes/delete'

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

app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }
