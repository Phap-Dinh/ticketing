import mongoose from 'mongoose'
import { app } from './app'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { nastWrapper } from './nats-wrapper'

const start = async () => {
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

        new OrderCreatedListener(nastWrapper.client).listen()
        new OrderCancelledListener(nastWrapper.client).listen()
        
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
