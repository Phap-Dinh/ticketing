import { Publisher, Subjects, TicketUpdatedEvent } from '@phapdinhtickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated
}
