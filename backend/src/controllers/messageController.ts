import { Request, Response } from 'express';
import { Router } from 'express';
import { Db, ObjectId } from "mongodb";
import messageModel from '../models/messageModel';
import userModel from '../models/registerModel';

interface Context {
    db: Db;
}


const sendMessage = (context: Context) => {
    const router = Router();

    router.post('/:id', async (req: Request, res: Response) => {
        try {

            const { id: receiverID } = req.params;

            // console.log('Request user:', req.user); // Check the structure of req.user
            const senderID = (req.user as unknown as { _id: string })._id;
            console.log('Extracted userID:', senderID);


            const { message } = req.body;
            // Validate inputs
            if (!message || !receiverID) {
                res.status(400).json({
                    success: false,
                    message: "Message and receiver ID are required",
                });
                return
            }
            // Save the message to the database
            const newMessage = new messageModel({
                senderID,       // Sender's ID
                receiverID,     // Receiver's ID
                message,        // The message content
            });

            await newMessage.save();
            res.status(201).json({
                success: true,
                message: "Message saved successfully",
                newMessage,
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



const receiveMessage = (context: Context) => {
    const router = Router();

    router.get('/:id', async (req: Request, res: Response) => {
        try {
            const user = req.user as { _id: string | ObjectId; userRole: string } | undefined;
            if (!user) {
                res.status(401).json({ message: "Unauthorized access" });
                return
            }

            const { id } = req.params; // The ID of the user the logged-in user is chatting with
            const loggedInUserId = new ObjectId(user._id);
            const paramsUser = await userModel.findOne({ _id: id })
            let messages;
            if (user.userRole === 'admin' || user.userRole === 'supadmin') {
                // Retrieve all messages
                messages = await messageModel.find().sort({ createdAt: 1 }); // Sort by timestamp
            } else if (user.userRole === 'user') {
                // Retrieve messages between the logged-in user and the target user
                const chatWithObjectId = new ObjectId(id);

                messages = await messageModel.find({
                    $or: [
                        { senderID: loggedInUserId, receiverID: chatWithObjectId },
                        { senderID: chatWithObjectId, receiverID: loggedInUserId },
                    ],
                }).sort({ createdAt: 1 }); // Sort messages by timestamp (ascending)
            } else {
                res.status(403).json({
                    message: "You do not have permission to access this resource",
                });
                return
            }

            // Return messages
            res.status(200).json({
                message: "Messages retrieved successfully",
                totalMessages: messages.length,
                messages,
                paramsUser
            });
        } catch (error) {
            console.error("Error retrieving messages:", error);
            res.status(500).json({
                message: "An error occurred while retrieving messages",
            });
            return
        }
    });
    return router;
}


// Update Message - only accessible for super admin or admin
const updateMessage = (context: Context) => {
    const db = context.db; // Get the MongoDB database instance from context
    const router = Router();

    // Use PUT request for updating a message
    router.put('/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // Get the message ID from params
            const { message } = req.body; // Get the new message content from the request body

            // Check if the user is an admin or super admin
            if (req.user?.role !== 'supadmin') {
                res.status(403).json({ message: "You do not have permission to update this message" });
                return
            }

            // Update the message in the MongoDB collection using updateOne
            const result = await db.collection('messages').findOneAndUpdate(
                { _id: new ObjectId(id) }, // Find message by ID
                { $set: { message } },  // Set the new message content
            );

            // Check if the message was updated
            if (result?.matchedCount === 0) {
                res.status(404).json({ message: "Message not found or you do not have permission to update this message" });
                return
            }

            // Send a success response
            res.status(200).json({
                message: "Message updated successfully",
                result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while updating the message" });
            return
        }
    });

    return router; // Return the router to be used in your main Express app
};

// Delete Message function
const deleteMessage = (context: Context) => {
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
            const result = await db.collection('messages').findOneAndDelete({ _id: new ObjectId(id) })


            // Send a success response
            res.status(200).json({
                message: "Message deleted successfully",
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






export default { sendMessage, receiveMessage, updateMessage, deleteMessage };
