import express, { Request, Response } from 'express'
import { NotFoundError } from '@phapdinhtickets/common'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    // In this case, error-handler is very important
    // req.params.id must be a string of 12 or 24 hex characters
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        throw new NotFoundError()
    }

    res.send(ticket)
})

export { router as showTicketRouter}
