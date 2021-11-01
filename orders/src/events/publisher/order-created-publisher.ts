import { OrderCreatedEvent, Publisher, Subjects } from '@phapdinhtickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}