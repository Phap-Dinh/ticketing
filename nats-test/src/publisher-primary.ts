import nats from 'node-nats-streaming'

console.clear()

// 'abc': is client id
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Publisher connected to NATS')

    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    })

    // First arg: subject (name of channel  )
    stan.publish('ticket:created', data, () => {
        console.log('Event published')
    })
})
