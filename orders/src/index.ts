import mongoose from 'mongoose'

import { app } from './app'
import { nastWrapper } from './nats-wrapper'
import { TicketCreatedListener } from './events/listener/ticket-created-listener'
import { TicketUpdatedListener } from './events/listener/ticket-updated-listener'
import { ExpirationCompleteListener } from './events/listener/expiration-complete-listener'
import { PaymentCreatedListener } from './events/listener/payment-created-listener'

const start = async () => {
    console.log('Starting ....')
    
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined')
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined')
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined')
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined')
    }

    try {
        await nastWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        )
        nastWrapper.client.on('close', () => {
            console.log('NATS connection closed!')
            process.exit() 
        })

        process.on('SIGINT', () => nastWrapper.client.close())
        process.on('SIGTERM', () => nastWrapper.client.close())

        new TicketCreatedListener(nastWrapper.client).listen()
        new TicketUpdatedListener(nastWrapper.client).listen()
        new ExpirationCompleteListener(nastWrapper.client).listen()
        new PaymentCreatedListener(nastWrapper.client).listen()

        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to mongodb')
    } catch (err) {
        console.error(err)
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000')
    })
}

start()
