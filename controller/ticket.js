import Ticket from "../model/ticket.js"


export const ticket_cancel = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate("bus_id")

        // console.log(ticket)
        
        const currentDate = Date.now();
        // console.log("currentDate", new Date(currentDate).toLocaleDateString())
        const travel_date = new Date(ticket.bus_id.travel_date).toLocaleDateString();

       
        // console.log("currentDate", currentDate)
        if(currentDate < travel_date){
           await Ticket.findByIdAndDelete(req.params.id) ;
          return  res.status(200).json({ message: "Ticket cancelled successfully" })
        }else{
            return  res.status(400).json({ message: "Cannot cancel ticket, bus travel date is passed" })
        }
        
       
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}