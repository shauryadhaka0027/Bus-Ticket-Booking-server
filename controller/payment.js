import Stripe from "stripe";
import Bus from "../model/bus.js";
import dotenv from "dotenv"

dotenv.config();

export const paymentRequest = async (req, res) => {
  const { number, id ,userId} = req.body;

  const stripe = new Stripe('sk_test_51Qd3qILIfZMoa2rdgPIMdY8T9suTo4gC6VxbgwpImwFuzBCjE292uflyI8JrYh9dgAjQly09KZyaXcdI2CH9Rrjo00OgMxLRXB');

  try {
    const findBus = await Bus.findById(id);
    if (!findBus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    const busNumber = findBus.bus_number || "Unknown Bus";
    const seatNumbers = number.join(", ");




    const ticketPriceInPaise = findBus.ticket_price * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Bus Booking - ${busNumber} (Seats: ${seatNumbers})`,
            },
            unit_amount: ticketPriceInPaise,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.PRODUCTION_URL}/payment_succes/${findBus._id}?userId=${userId}&seatNumbers=${number.join(',')}`,

      cancel_url: `${process.env.PRODUCTION_URL}/home`,
    });
   
 
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).send('Failed to create Stripe session');
  }
};
