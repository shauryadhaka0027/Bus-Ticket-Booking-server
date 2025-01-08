import express from 'express';
import { ticket_cancel } from '../controller/ticket.js';
import { auth } from '../middleware/auth.js';

const router= express.Router();


router.delete("/bus_booking/cancelTicket/:id",auth,ticket_cancel)

export default router;