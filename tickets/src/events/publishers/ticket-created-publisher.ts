import { Publisher, Subjects, TicketCreatedEvent } from '@phapdinhtickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}
