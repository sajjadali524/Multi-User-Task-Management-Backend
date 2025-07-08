import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer", "").trim();
    if(!token) {
        return res.status(404).json({message: "Unauthorized"})
    };

    try {
        const decode = jwt.verify(token, process.env.TOKEN_SECRET);

        req.user = decode;
        next();
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
};

export const isAdmin = (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next();
    }else {
        res.status(403).json({message: "Access Denied"})
    }
};