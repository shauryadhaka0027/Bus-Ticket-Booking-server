import mongoose from "mongoose";


const ticketSchema ={
    bus_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    seat_number: {
        type: Number,
        required: true
    },
    ticketId:{
        type: String,
        required: true
    }
   
}

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;