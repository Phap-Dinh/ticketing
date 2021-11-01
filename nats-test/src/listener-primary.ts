import nats, { Message, Stan } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Listener connected to NATS')

    stan.on('close', () => {
        console.log('NATS connection closed!')
        process.exit()
    })

    // setManualAckMode(true)
    // Ack stand for acknowledge
    // Make sure everything has been processed successfully
    // If we do not acknowledge the incoming event, the NATS server is going to wait 30s (default)
    // After 30s, automatically decide to send that event to other member of that queue group

    // setDeliverAllAvailable
    // Whenever our subcription get created, NATS si going try to send over all the events
    // missed while or before the subcription was ever created or while it's been down

    // setDurableName('accounting-srv')
    // NAT create a record listing all the different durable subcriptions tha we have 
    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accounting-srv')

    // queue-group
    // The only one instant listener will recieve msg
    // ADD IN OTHER IMPORTANT THING, even if all of our different services inside this queue group go down, NAT is
    // going to perist durable naem subcription (not delete record of setDurableName)
    const subscription = stan.subscribe(
        'ticket:created', 
        'orders-service-queue-group',
        options
    )

    subscription.on('message', (msg: Message) => {
        const data = msg.getData()

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
        }

        msg.ack()
    })
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())