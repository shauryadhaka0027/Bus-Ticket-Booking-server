import Bus from "../model/bus.js"
import Ticket from "../model/ticket.js"
import User from "../model/user.js"
import { generateTicketID } from "../utils/generateTicketId.js"
import mailsender from "../utils/sendingEmail.js"


export const searchBus = async (req, res) => {
  try {
    // const {fromLocation,toLocation,date}=req.query;
    // console.log(req.query)

    const find_bus = await Bus.find({
      fromLocationName: req.query.fromLocation,
      toLocationName: req.query.toLocation,
      travel_date: req.query.date
    })
    res.status(200).json({ message: 'Bus found', data: find_bus })
  } catch (error) {
    res.status(500).json({ message: error.message, error })
  }
}


export const createBus = async (req, res) => {
  try {
    //   const {busName,busCapacity,fromLocation,toLocation,departureTime,arrivalTime,price} = req.body
    const data = new Bus(req.body)
    await data.save()
    res.status(201).json({ message: 'Bus created successfully', data })
  } catch (error) {
    res.status(500).json({ message: error.message, error })
  }
}

export const available_Bus = async (req, res) => {
  try {

    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split("T")[0];

    console.log(formattedCurrentDate)

    const availableBuses = await Bus.find({
      travel_date: { $gte: formattedCurrentDate },
      // travel_date:{formattedCurrentDate}
    });

    const uniqueArray = Array.from(new Set(availableBuses.map((ele => ele.
      fromLocationName)))).map(
        fromLocationName => availableBuses.find(ele => ele.
          fromLocationName === fromLocationName))

    res.status(200).json({
      message: "Available buses",
      data: uniqueArray,
    });
  } catch (error) {
    console.error("Error fetching available buses:", error);
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export const book_seatById = async (req, res) => {
  try {
    const { userId, number } = req.body;

    const findBus = await Bus.findById(req.params.id);
    if (!findBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const findUser = await User.findById(userId)
 

    let totalPrice = 0;
     const seatListHtml = number
      .map((seat) => {
        totalPrice += findBus.ticket_price;
        return `<li>Seat No ${seat}<span> Price ₹${findBus.ticket_price}</span></li>`;
      })
      .join('');


    let emaildata = {
      toMail: findUser?.email,
      subject: "Booking Confirmation",
      fromMail: "skdj@gmail.com",
      html: `
      <html >
     <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Bus Ticket</title>
    <style>
      /* Global Styles */
      body {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f7f9;
      }

      .email-container {
        max-width: 650px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      /* Header Section */
      .header {
        background-color: #3a8f39;
        color: #ffffff;
        text-align: center;
        padding: 25px;
        font-size: 24px;
        font-weight: 600;
      }

      .header h1 {
        margin: 0;
        font-size: 28px;
      }

      /* Content Section */
      .content {
        padding: 25px 30px;
        color: #333;
      }

      .content h2 {
        color: #2d3436;
        font-size: 22px;
        margin-bottom: 15px;
      }

      .content p {
        font-size: 16px;
        line-height: 1.6;
        margin: 10px 0;
      }

      .content .seat-list {
        margin: 15px 0;
        padding: 0;
        list-style: none;
      }

      .content .seat-list li {
        background-color: #f8f9fa;
        border-radius: 5px;
        padding: 12px;
        margin-bottom: 8px;
        font-size: 16px;
        color: #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .content .seat-list li span {
        font-weight: bold;
        color: #4caf50;
      }

      .content .seat-list li:hover {
        background-color: #e9f7ec;
        cursor: pointer;
      }

      .content .total-price {
        margin-top: 20px;
        padding: 12px;
        background-color: #4caf50;
        color: white;
        font-size: 18px;
        font-weight: 600;
        border-radius: 6px;
        text-align: center;
      }

      /* Footer Section */
      .footer {
        text-align: center;
        padding: 15px;
        font-size: 14px;
        color: #777;
        background-color: #f0f0f0;
      }

      .footer p {
        margin: 0;
      }

      /* Responsive Design */
      @media (max-width: 600px) {
        .email-container {
          margin: 20px;
          padding: 15px;
        }

        .header {
          padding: 20px;
        }

        .content {
          padding: 20px;
        }

        .content h2 {
          font-size: 18px;
        }

        .footer {
          font-size: 12px;
          padding: 10px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header Section -->
      <div class="header">
        <h1>Bus Ticket Confirmation</h1>
      </div>

      <!-- Ticket Details -->
      <div class="content">
        <h2>Booking Details</h2>
        <p><strong>Bus Number:</strong> ${findBus.
          bus_number}</p>
        <p><strong>Journey Date:</strong>${findBus?.travel_date}</p>
        <p><strong>User Name: </strong>${findUser?.name}</p>
        <p><strong>Seats Booked:</strong></p>
        <ul class="seat-list">
         ${seatListHtml}
        </ul>
        <div class="total-price">Total Price: ₹${totalPrice}</div>
      </div>

      <!-- Footer Section -->
      <div class="footer">
        <p>Thank you for booking with us! Have a safe journey.</p>
        <p>&copy; 2025 Bus Booking Co.</p>
      </div>
    </div>
  </body>
</html>

      `
    }


    // let bookingSeat;

    // bookingSeat = number.map((ele) => {
    //   const ticketIDNo = generateTicketID();
    //   return { seatNo: ele, ticketID: ticketIDNo }
    // })



    // if (existingUser) {
    //   const updatedBus = await Bus.findOneAndUpdate(
    //     { _id: req.params.id, "bookingUserId.userId": userId },
    //     {
    //       $addToSet: {
    //         "bookingUserId.$.number": bookingSeat,
    //       },
    //       $inc: { seats_available: -number.length },
    //     },
    //     { new: true }
    //   );

    //   mailsender(emaildata)
    //   return res
    //     .status(200)
    //     .json({ message: "Seat(s) booked successfully", data: updatedBus });
    // }


    // const bookedObj = {
    //   userId,
    //   number: bookingSeat
    // };

 
    
    const ticketPromises = number.map(async (ele) => {
      const ticket_create = new Ticket({
        bus_id: req.params.id,
        user_id: userId,
        seat_number: ele,
        ticketId: generateTicketID()
      });
    
      await ticket_create.save();
      return ticket_create._id; 
    });
    
   
    const ticketIds = await Promise.all(ticketPromises);
    
   
    findBus.bookingId.push(...ticketIds);
    await findBus.save();
   
    mailsender(emaildata)
    res
      .status(200)
      .json({ message: "Seat(s) booked successfully",  });
  } catch (error) {
    console.error("Error booking seat:", error);
    res.status(500).json({ message: "Failed to book seat(s)", error });
  }
};



export const bus_dataById = async (req, res) => {
  try {
    // console.log("req.params.id", req.params.id)

    const busData = await Bus.findById(req.params.id).populate({
      path: 'bookingId',
    });



    // console.log("busData", busData)
    res.status(200).json({ message: 'Bus data found', data: busData })
  } catch (error) {
    res.status(500).json({ message: error.message, error })
  }
}


export const showTicketById = async (req, res) => {
  try {

    const {userId}=req.body
    // console.log("userId",userId)

    const ticketShow= await Ticket.find({
      user_id:userId
      }).populate("user_id").populate("bus_id")

      // console.log("ticketShow",ticketShow)

    res.status(200).json({ message: 'Ticket data found', data: ticketShow })



  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}