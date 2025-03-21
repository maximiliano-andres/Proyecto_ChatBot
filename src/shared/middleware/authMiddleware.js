import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";

export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: "Token inválido." });
    }
};