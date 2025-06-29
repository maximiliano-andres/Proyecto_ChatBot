import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import env from 'env-var';
import { logger } from '../../config/logger.js';

const nameVerificarToken = "VERIFICACION TOKEN MIDDLEWARE:";

config();

const JWT_SECRET = env.get("JWT_SECRET").required().asString();

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    const cokk = req.cookies;
    logger.info(nameVerificarToken + "COOKIES recibido:", cokk);
    // Mostrar el token recibido
    logger.info(nameVerificarToken + "Token recibido:", token);

    if (!token) {
        logger.info(nameVerificarToken + "NO HAY TOKEN");
        return res.status(401).render("login", { title: "Login", error: "Debe iniciar sesión para acceder" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            logger.error(nameVerificarToken + "Error de verificación del token:", err);
            return res.status(401).render("login", { title: "Login", error: "Sesión expirada, debe volver a iniciar sesión" });
        }

        // Mostrar los datos decodificados del token
        logger.info(nameVerificarToken + "Token verificado, datos del usuario:", decoded);

        req.user = decoded; // Guardar los datos del usuario en la solicitud
        next();
    });
};
