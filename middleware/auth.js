import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();
export const auth=(req,res,next)=>{
    let token = req.cookies["token"] || req.headers.authorization;
    // console.log("auth", token)

    if(!token){
        return res.status(401).json({message:"You are not authenticated"})
    }

    jwt.verify(token, process.env.SECERT_KEY, (err, decode) => {
        if (err) {
            return res.status(400).json({ msg: "Invalid or expired token", error: err });
        }

       req.body.userId = decode.userId; 
        
        // req.body.user = decode.user;
        // console.log("Decoded token data:", decode);

        next(); 
    });
        
}