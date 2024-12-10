declare namespace Express {
    interface User {
        _id: string;
        role: string;
    }

    interface Request {
        user?: User;
    }
}