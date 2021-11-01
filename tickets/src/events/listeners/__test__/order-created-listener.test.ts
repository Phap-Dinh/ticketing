import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { nastWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@phapdinhtickets/common'

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(nastWrapper.client)

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'dfsfs'
    })

    await ticket.save()

    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'asdfsda',
        expiresAt: 'sdfdsf',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('sets the userId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('ack the message', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(nastWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedDate = JSON.parse((nastWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(data.id).toEqual(ticketUpdatedDate.orderId)
})
