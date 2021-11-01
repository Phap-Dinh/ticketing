import { Subjects } from './subjects'

export interface TicketCreatedEvent {
    // Subjects.TicketCreated will be a data type (like as: template literal in types)
    subject: Subjects.TicketCreated
    data: {
        id: string,
        title: string,
        price: number
    }
}