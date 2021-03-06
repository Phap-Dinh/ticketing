import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { NotFoundError, validateRequest, requireAuth, NotAuthorizedError, BadReuqestError } from '@phapdinhtickets/common'
import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { nastWrapper } from '../nats-wrapper'

const router = express.Router()

router.put(
    '/api/tickets/:id', 
    requireAuth, 
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // In this case, error-handler is very important
        // req.params.id must be a string of 12 or 24 hex characters
        const ticket = await Ticket.findById(req.params.id)

        if (!ticket) {
            throw new NotFoundError()
        }

        if (ticket.orderId) {
            throw new BadReuqestError('Cannot edit a reserved ticket')
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price
        })

        await ticket.save()
        await new TicketUpdatedPublisher(nastWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })

        res.send(ticket)
})

export { router as updateTicketRouter}
