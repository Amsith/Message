import { Request, Response, NextFunction } from "express";
import { Db, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import configs from "../configs/config";
import userModel from "../models/registerModel";

interface Context {
    db: Db;
}

const isAuthenticate = (context: Context) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            // Read the token from the cookie
            const token = req.cookies.token;
            const googleUser = req.user
            // If there's a googleUser, proceed
            if (googleUser) {
                req.user = googleUser; // Attach googleUser to the request object
                return next();
            }

            // If there's no googleUser, check for the token
            if (token) {
                try {
                    // Verify the token
                    const decodedData = jwt.verify(token, configs.JWT_SECRET_KEY) as { id: string };
                    const user = await userModel.findOne({ _id: new ObjectId(decodedData.id) });

                    if (!user) {
                        res.status(403).json({ message: "User not found, please login again" });
                        return
                    }

                    // Attach user info to the request object
                    (req as any).user = user;
                    return next();
                } catch (error) {
                    res.status(403).json({ message: "Invalid token, please login again" });
                    return
                }
            }

            // If no googleUser or token, send a 403 response
            res.status(403).json({ message: "Please Login to access" });

        } catch (error) {
            console.error(error);
            res.status(403).json({ message: "Invalid token, please login again" });
            return; // Ensure no further code is executed
        }
    };
};


declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            userRole: any;
            id: any;
            role?: string;
        };
    }
}

const authorizeRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Log the user's role for debugging (optional)
            console.log("User Role", req.user?.userRole);

            // Check if req.user exists and has a role property
            if (!req.user || !req.user.userRole) {
                res.status(401).json({
                    message: "User is not authenticated or role is missing",
                });
                return

            }

            // Check if user role is in the allowed roles
            if (!roles.includes(req.user.userRole)) {
                res.status(403).json({
                    message: `Role "${req.user.userRole}" is not allowed to access this resource`,
                });
                return
            }

            // Proceed to the next middleware
            next();
        } catch (error) {
            console.error("Error in role authorization:", error);

            // Respond with a generic error message and prevent leaking sensitive information
            res.status(500).json({
                message: "An error occurred while checking roles",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };
};


export default { isAuthenticate, authorizeRole };
