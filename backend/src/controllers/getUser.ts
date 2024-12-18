import { Request, Response } from 'express';
import { Router } from 'express';
import { Db, ObjectId } from "mongodb";
import messageModel from '../models/messageModel';
import { Context } from 'vm';
import userModel from '../models/registerModel';
import { compareSync } from 'bcrypt';


// get all user to show to chating exclude the loged in user
const getAllUser = (context: any) => {
    const router = Router();

    router.get('/', async (req: Request, res: Response) => {
        try {
          // Assume `req.user` contains the logged-in user's details
          const loggedInUser = req.user as { _id: string | ObjectId } | undefined;

          // If the logged-in user is not available, throw an error
          if (!loggedInUser) {
               res.status(401).json({
                  success: false,
                  message: "User not authenticated",
              });
              return

          }

          // Fetch all users except the logged-in user
          const users = await userModel.find({ _id: { $ne: loggedInUser._id } }); // `$ne` means "not equal"

          // Check if there are any other users
          if (!users || users.length === 0) {
               res.status(404).json({
                  success: false,
                  message: "No other users found",
              });
              return
          }

          // Send the filtered users in the response
          res.status(200).json({
              success: true,
              users,
          });
        } catch (error) {
            console.error("Error retrieving users:", error);

            // Send an appropriate error response
            res.status(500).json({
                success: false,
                message: "An error occurred while retrieving users",
            });
        }
    });

    return router; // Return the configured router
};





// get login user to use in the redux to store always the user data
const getLoginUser = (context: Context) => {
    const router = Router();

    router.get('/', async (req: Request, res: Response) => {
        try {

            const user = req.user as { _id: string | ObjectId; userRole: string } | undefined;
            console.log("Loged in user:", user)
            if (!user) {
                console.log("No user found. Redirecting to home page.");
                // Redirect without sending a JSON response
                return res.redirect('http://localhost:3000/home');
            }

            // Ensure that the response is formatted properly
            res.status(200).json({
                user // Ensure this is an array of messages
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


export default { getAllUser, getLoginUser }