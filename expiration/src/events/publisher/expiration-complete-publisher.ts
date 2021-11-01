import { ExpirationCompleteEvent, Publisher, Subjects } from '@phapdinhtickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}