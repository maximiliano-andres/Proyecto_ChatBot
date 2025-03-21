import dotenv from 'dotenv';
import env from "env-var";
import debug from "debug";
import jwt from "jsonwebtoken";  // Asegúrate de importar jwt si no lo tienes

const DEBUG = debug("app: Middleware : ")

dotenv.config();

const JWT_SECRET = env.get("JWT_SECRET").required().asString();

DEBUG(JWT_SECRET)

export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        
        // Aquí asignamos los datos decodificados al req.user para que estén disponibles en otras funciones
        req.user = {
            username: decoded.username,  // Suponiendo que el payload tiene un campo "username"
            email: decoded.email,        // Suponiendo que el payload tiene un campo "email"
            password: decoded.password   // Suponiendo que el payload tiene un campo "password"
        };

        // Si también quieres tener los datos en req.body para otras funciones:
        req.body.username = decoded.username;
        req.body.email = decoded.email;
        req.body.password = decoded.password;

        next();
    } catch (error) {
        res.status(400).json({ error: "Token inválido." });
    }
};
