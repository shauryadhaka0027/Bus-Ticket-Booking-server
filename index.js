import express from 'express';
import connection from './config/db.js';
import busRoute from "./routes/bus.js"
import userRouter from "./routes/user.js"
import ticketRouter from "./routes/ticket.js"
import cors from "cors"
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use("/api", busRoute);
app.use("/api",userRouter)
app.use("/api",ticketRouter)




app.listen(3000,async()=>{
    try {
        await connection
        console.log('Server running on port 3000');
        console.log('Connected to MongoDB');

    } catch (error) {
        
    }
})