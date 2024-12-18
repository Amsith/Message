import { Router } from "express";
import authController from "../controllers/registerController";
import isAuthenticate from "../middleware/isAuthenticate";
import messageController from "../controllers/messageController";
import adminCreateUser from "../controllers/adminCreateUser";
import loginController from "../controllers/loginController";
import rateLimit from "express-rate-limit";
import getLoginUser from "../controllers/getUser";
import getUser from "../controllers/getUser";




//  registerRateLimiter
const registerRateLimiter = rateLimit({
    max: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many registration attempts from this IP. Please try again after 1 hour."
        });
    }
});


//  loginRateLimiter
const loginRateLimiter = rateLimit({
    max: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many registration attempts from this IP. Please try again after 15 minutes."
        });
    }
});




const createRouter = (context: any) => {
    const router = Router();

    // Registration POST
    router.use('/user/register', registerRateLimiter, authController.registerController(context));
    // Verify GET   api/user/verify/:token
    router.use('/user/verify', authController.verify(context));
    // Login POST
    router.use('/login', loginRateLimiter, loginController.login(context));
    // Logout function
    router.use('/logout', isAuthenticate.isAuthenticate(context), loginController.logOut(context));

    //== Get All User
    router.use('/all/user', isAuthenticate.isAuthenticate(context),isAuthenticate.authorizeRole('user', 'admin', 'supadmin'), getUser.getAllUser(context));

    //== Get Login User
    router.use('/logedin/user', isAuthenticate.isAuthenticate(context),isAuthenticate.authorizeRole('user', 'admin', 'supadmin'), getUser.getLoginUser(context));

    // post message
    router.use('/message', isAuthenticate.isAuthenticate(context), isAuthenticate.authorizeRole('user', 'admin', 'supadmin'), messageController.sendMessage(context)); // Fix invocation
    // get meesgae
    router.use('/message', isAuthenticate.isAuthenticate(context), isAuthenticate.authorizeRole('user', 'admin', 'supadmin'), messageController.receiveMessage(context));
    // update the message
    router.use('/message', isAuthenticate.isAuthenticate(context), isAuthenticate.authorizeRole('supadmin'), messageController.updateMessage(context));
    // delete message
    router.use('/message', isAuthenticate.isAuthenticate(context), isAuthenticate.authorizeRole('supadmin'), messageController.deleteMessage(context));

    // Create user by supAdmin  POST
    router.use('/admin/regsiter', isAuthenticate.isAuthenticate(context), isAuthenticate.authorizeRole('supadmin'), adminCreateUser.createUser(context));
    // Delete user by supAdmin  DELETE  api/admin/delete/user/:id
    router.use('/admin/delete/user/', isAuthenticate.isAuthenticate(context), isAuthenticate.authorizeRole('supadmin'), adminCreateUser.deleteUser(context));


    return router;
};

export default createRouter;
