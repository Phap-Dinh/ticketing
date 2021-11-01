import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { nastWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { OrderCancelledEvent } from '@phapdinhtickets/common'

const setup = async () => {
    const listener = new OrderCancelledListener(nastWrapper.client)

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'sdfsd'
    })
    // HACK: Ticket Attrs don't have orderId
    ticket.set({ orderId })
    await ticket.save()

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('updated the ticket, publishes an event and acks the message', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(nastWrapper.client.publish).toHaveBeenCalled()
})