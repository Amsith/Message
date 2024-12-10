import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Db } from 'mongodb';
import configs from '../configs/config';
import cookieParser from 'cookie-parser';
import userModel from '../models/registerModel';



const login = (context: any) => {

    const router = Router()
    router.post('/', async (req: Request, res: Response) => {
        try {
            const { email, password }: { email: string; password: string } = req.body;

            // Capture the user's IP address
            const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log("IP Address: ", userIp)
            // Check if email exists in the database
            const existingUser = await userModel.findOne({ email });

            if (!existingUser) {
                res.status(400).json({ message: "Invalid credentials" });
                return
            }
            // Check if the user is a Google account
            if (existingUser.googleId) {
                res.status(400).json({
                    message: "This email is associated with a Google account. Please log in using Google.",
                });
                return;
            }
            // Match password
            const matchPassword = await bcrypt.compare(password, existingUser.password as string);
            if (!matchPassword) {
                res.status(400).json({ message: "Invalid credentials" });
                return
            }

            // Check if user is verified
            if (!existingUser.isVerified) {
                res.status(403).json({ message: "Please verify your email before logging in." });
                return
            }
            // Check if the user is already logged in from another IP
            if (existingUser.currentIp !== userIp) {
                res.status(403).json({
                    message: `You are already logged in from IP address: ${existingUser.currentIp}`,
                });
                return;
            }
            // Update the user's current IP in the database
            existingUser.currentIp = userIp as string;
            await existingUser.save();

            // Generate Token
            const token = jwt.sign(
                {
                    id: existingUser._id.toString(),
                    role: existingUser.userRole, // Assuming "user" is the role field
                    verified: existingUser.isVerified,
                },
                configs.JWT_SECRET_KEY,
                { expiresIn: configs.LOGIN_TOKEN_EXPIRE }
            );

            // Cookie options for token
            const options = {
                expires: new Date(Date.now() + 86400000), // 1 day
                httpOnly: true,
            };

            // Send response with token and user details
            res.status(200).cookie('token', token, options).json({
                success: true,
                message: "Login Successfully",
                token,
                name: existingUser.username,
                role: existingUser.userRole,
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
    return router;
}



const logOut = (context: any) => {
    const router = Router()
    router.post('/', async (req: Request, res: Response) => {
        // console.log('Cookies backend:', req.cookies);  
        try {

            const userID = (req.user as unknown as { _id: string })._id;
            console.log("logout User idL",userID )
            if (!userID) {
                 res.status(400).json({ message: "User ID is required for logout" });
                 return
                }


            // Clear the IP address associated with the user
            const user = await userModel.findById(userID);
            if (!user) {
                 res.status(404).json({ message: "User not found" });
                 return
            }

            // Update the user's current IP in the database
            user.currentIp = null as unknown as string;
            await user.save();
            // option for token passing through cokies
            // Clear the token cookie
            res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });

            // If you're using session cookies
            res.clearCookie('connect.sid', { httpOnly: true, sameSite: 'strict' });
            // Find the user and clear their IP
           
            // Clear the cookie
            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }

    })

    return router;

}


export default { login, logOut }