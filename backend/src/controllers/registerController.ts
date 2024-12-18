import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Db } from 'mongodb';
import configs from '../configs/config';
import sendVerificationEmail from '../middleware/sendMail';
import validator from 'validator'
import userModel from '../models/registerModel';

interface Context {
    db: Db; // Database instance
}



const registerController = (context: Context) => {
    const router = Router();

    router.post('/', async (req: Request, res: Response) => {
        try {

            // Extract user input
            const username = req.body.username?.trim();
            const email = req.body.email?.trim();
            const { password } = req.body;

            // check all fields required
            if (!username || !email || !password) {
                res.status(400).json({ success: false, message: "All fields are required." });
                return
            }

            // chekc the emial format using validator
            if (!validator.isEmail(email)) {
                res.status(400).json({ success: false, message: "Invalid email format" })
                return
            }
            // Check if the email already exists
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                if (existingUser.googleId) {
                    res.status(400).json({
                        success: false,
                        message: "This email is associated with a Google account. Please log in with Google.",
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Email already registered.",
                    });
                }
                return;
            }


            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);


            // Create a new user document
            const newUser = await new userModel({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                userRole: "user",// Default role
                currentIp:null,
            });

            // Save the user to the database
            const savedUser = await newUser.save();

            // Generate a verification token
            const verificationToken = jwt.sign(
                { id: savedUser._id, email: savedUser.email },
                configs.JWT_SECRET_KEY,
                { expiresIn: configs.REGISTER_TOKEN_EXPIRE }
            );

            // Send Verification Email
            await sendVerificationEmail(email, "Email Verification", verificationToken);

            // Respond with success message
            res.status(201).json({
                success: true,
                message: "User registered successfully. Verification link sent to your email.",
                user: { id: savedUser._id, username: savedUser.username, email: savedUser.email },
            });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    });
    return router;
}



// Verify the user
const verify = (context: Context) => {
    const router = Router(); // Initialize the router

    router.get('/:token', async (req: Request, res: Response) => {
        try {
            const { token } = req.params;

            // Verify the token
            const decodedToken = jwt.verify(token, configs.JWT_SECRET_KEY) as { email: string };

            const { email } = decodedToken;

            // Find the user by email using the registerModel
            const user = await userModel.findOne({ email });

            if (!user) {
                res.status(400).json({ message: "Invalid token or user does not exist." });
                return
            }

            // Check if the user is already verified
            if (user.isVerified) {
                res.status(400).json({ message: "User is already verified." });
                return
            }

            // Update the user's verification status
            user.isVerified = true;
            await user.save();

            // Respond with success message
            res.status(200).json({ message: "User verified successfully!" });
        } catch (error) {
            console.error("Error verifying user:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });

    return router;
};




export default { verify, registerController };


