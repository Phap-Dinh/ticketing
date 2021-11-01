import { OrderCancelledEvent, Publisher, Subjects } from '@phapdinhtickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}