import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { nastWrapper } from '../../nats-wrapper'

it('marks an order as cancelled', async () => {
    // create a ticket with Ticket Model
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save()

    const user = global.signin()
    // make a request to create na order
    const { body: order } =  await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    
    // expectation to make sure the thing is cancelled
    const updateOrder = await Order.findById(order.id)

    expect(updateOrder?.status).toEqual(OrderStatus.Cancelled)
})

it('emits a order cancelled event', async () => {
    // create a ticket with Ticket Model
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save()

    const user = global.signin()
    // make a request to create na order
    const { body: order } =  await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    expect(nastWrapper.client.publish).toHaveBeenCalled()
})