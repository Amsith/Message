import { Request, Response } from 'express';
import { Router } from 'express';
import { Db, ObjectId } from "mongodb";
import validator from 'validator'
import bcrypt from 'bcrypt'


interface Context {
    db: Db;
}



const createUser = (context: Context) => {
    const db = context.db;
    const router = Router();

    router.post('/', async (req: Request, res: Response) => {
        try {
            // Extract user ID from req.user
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

            // Access the 'users' collection
            const userCollection = db.collection('users');
            // Check if the email already exists

            const existingUser = await userCollection.findOne({ email });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
                return
            }

            // hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = {
                username,
                email,
                password: hashedPassword,
                role: "user",
                isVerified: true,
                createdAt: new Date(),
            };

            const saveUser = await userCollection.insertOne(user)
            // Hash the password

            res.status(201).json({
                success: true,
                message: "Message saved successfully",
                saveUser
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    });

    return router; // Ensure router is returned
};


// Delete User function
const deleteUser = (context: Context) => {
    const db = context.db; // Get the MongoDB database instance from context
    const router = Router();

    // Use PUT request for updating a message
    router.delete('/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // Get the message ID from params
            if (!id) {
                res.status(400).json({
                    sccess: false,
                    message: "ID not found"
                })
                return
            }

            // Update the message in the MongoDB collection using updateOne
            const result = await db.collection('users').findOneAndDelete({ _id: new ObjectId(id) })

            // Send a success response
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "An error occurred while updating the message"
            });
            return
        }
    });

    return router; // Return the router to be used in your main Express app
};


export default {createUser,deleteUser}