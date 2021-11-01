import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { nastWrapper } from './nats-wrapper'

const start = async () => {
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
    } catch (err) {
        console.error(err)
    }
}

start()
