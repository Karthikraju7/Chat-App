import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.json({ success: false, message: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        const user = await User.findById(decoded.userId).select("-password");
        console.log("Fetched User:", user);

        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};
