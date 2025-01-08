import express from 'express';
import { available_Bus, book_seatById, bus_dataById, createBus,  searchBus, showTicketById } from '../controller/bus.js';
import { auth } from '../middleware/auth.js';
import { paymentRequest } from '../controller/payment.js';

const router = express.Router();

router.post("/busBooking/createBus",createBus)
router.get("/busBooking/available_bus",auth,available_Bus)
router.get("/busBooking/search_bus",auth,searchBus)
router.post("/busBooking/book_seat/:id",auth,book_seatById)
router.post("/busBooking/bus_details/:id",bus_dataById)
router.post("/busBooking/payment_method/:id",auth,paymentRequest)
router.post("/busBooking/ticket_list",auth,showTicketById)


export default router