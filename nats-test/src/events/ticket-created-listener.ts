import { Message } from 'node-nats-streaming'
import { Listener } from './base-listener'
import { Subjects } from './subjects'
import { TicketCreatedEvent } from './ticket-created-event'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    // Option #1
    // NO DATA TYPE: TS thinks that we might try to change the value of subject at some point in the future
    // ex: this.subject = 'sdfs'
    // subject: Subjects.TicketCreated = Subjects.TicketCreated

    // Otion 2:
    readonly subject = Subjects.TicketCreated

    queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data! ', data)

        console.log(data.id)
        console.log(data.title)
        console.log(data.price)

        msg.ack()
    }
    
}
