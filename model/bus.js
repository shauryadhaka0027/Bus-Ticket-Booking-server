import mongoose from 'mongoose';


const busSchema = mongoose.Schema({
    bus_number: {
        type: String,
        required: true
    },
    route_name: {
        type: String,
        required: true
    },
    arrival_time: {
        type: Date,
        required: true
    },
    departure_time: {
        type: Date,
        required: true
    },
    total_seats: {
        type: Number,
        required: true
    },
    seats_available: {
        type: Number,
        required: true
    },
    fromLocationName: {
        type: String,
        required: true
    },
    toLocationName: {
        type: String,
        required: true
    },
    ticket_price: {
        type: String,
        required: true
    },
    vender_name: {
        type: String,
        required: true
    },
    travel_date: {
        type: String,
        required: true
    },
    bookingId: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }]

});

const Bus = mongoose.model('Bus', busSchema);

export default Bus;